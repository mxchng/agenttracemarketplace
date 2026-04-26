import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAddress } from "viem";

const AUTH_NONCE_COOKIE = "atm_auth_nonce";
const APP_SESSION_COOKIE = "atm_session";
const NONCE_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type NonceChallenge = {
  walletAddress: string;
  nonce: string;
  chainId: number;
  issuedAt: string;
  expiresAt: string;
  domain: string;
  uri: string;
};

export type WalletSession = {
  userId: string;
  walletAddress: string;
  issuedAt: string;
  expiresAt: string;
};

type SignedCookieOptions = {
  expiresAt: string;
};

function getAuthSecret() {
  const secret = process.env.AUTH_SESSION_SECRET;

  if (!secret) {
    throw new Error("AUTH_SESSION_SECRET is required for wallet sign-in.");
  }

  return secret;
}

function encodePayload(payload: object) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function signValue(encodedPayload: string, secret: string) {
  return createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

function decodePayload<T>(value: string): T | null {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

function buildSignedCookieValue(payload: object) {
  const encodedPayload = encodePayload(payload);
  const signature = signValue(encodedPayload, getAuthSecret());
  return `${encodedPayload}.${signature}`;
}

function readSignedPayload<T>(rawValue: string | undefined) {
  if (!rawValue) {
    return null;
  }

  const [encodedPayload, signature] = rawValue.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signValue(encodedPayload, getAuthSecret());
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return null;
  }

  return decodePayload<T>(encodedPayload);
}

function isExpired(expiresAt: string) {
  return new Date(expiresAt).getTime() <= Date.now();
}

function getCookieSettings({ expiresAt }: SignedCookieOptions) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  };
}

export function parseWalletAddress(value: string) {
  const normalized = value.trim().toLowerCase();

  if (!isAddress(normalized)) {
    throw new Error("Wallet address must be a valid 0x-prefixed address.");
  }

  return normalized;
}

export function createNonceChallenge(input: {
  walletAddress: string;
  chainId: number;
  domain: string;
  uri: string;
}) {
  const issuedAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + NONCE_TTL_MS).toISOString();

  return {
    walletAddress: parseWalletAddress(input.walletAddress),
    nonce: randomBytes(16).toString("hex"),
    chainId: input.chainId,
    issuedAt,
    expiresAt,
    domain: input.domain,
    uri: input.uri,
  } satisfies NonceChallenge;
}

export function buildAuthMessage(challenge: NonceChallenge) {
  return [
    `${challenge.domain} wants you to sign in with your Base wallet:`,
    challenge.walletAddress,
    "",
    "Sign this message to create an app session for Tracer.",
    "",
    `URI: ${challenge.uri}`,
    "Version: 1",
    `Chain ID: ${challenge.chainId}`,
    `Nonce: ${challenge.nonce}`,
    `Issued At: ${challenge.issuedAt}`,
    `Expiration Time: ${challenge.expiresAt}`,
  ].join("\n");
}

export async function setNonceChallengeCookie(challenge: NonceChallenge) {
  const cookieStore = await cookies();

  cookieStore.set(
    AUTH_NONCE_COOKIE,
    buildSignedCookieValue(challenge),
    getCookieSettings({ expiresAt: challenge.expiresAt }),
  );
}

export async function readNonceChallengeCookie() {
  const cookieStore = await cookies();
  const payload = readSignedPayload<NonceChallenge>(
    cookieStore.get(AUTH_NONCE_COOKIE)?.value,
  );

  if (!payload || isExpired(payload.expiresAt)) {
    return null;
  }

  return payload;
}

export async function clearNonceChallengeCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_NONCE_COOKIE);
}

export async function setWalletSessionCookie(session: WalletSession) {
  const cookieStore = await cookies();

  cookieStore.set(
    APP_SESSION_COOKIE,
    buildSignedCookieValue(session),
    getCookieSettings({ expiresAt: session.expiresAt }),
  );
}

export async function getOptionalWalletSession() {
  const cookieStore = await cookies();
  const payload = readSignedPayload<WalletSession>(
    cookieStore.get(APP_SESSION_COOKIE)?.value,
  );

  if (!payload || isExpired(payload.expiresAt)) {
    return null;
  }

  return payload;
}

export async function requireWalletSession() {
  const session = await getOptionalWalletSession();

  if (!session) {
    redirect("/");
  }

  return session;
}

export async function clearWalletSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(APP_SESSION_COOKIE);
}

export function buildWalletSession(input: { userId: string; walletAddress: string }) {
  const issuedAt = new Date().toISOString();

  return {
    userId: input.userId,
    walletAddress: parseWalletAddress(input.walletAddress),
    issuedAt,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  } satisfies WalletSession;
}
