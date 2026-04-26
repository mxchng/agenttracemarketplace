import { Buffer } from "node:buffer";
import { generateJwt } from "@coinbase/cdp-sdk/auth";
import { getAddress, isAddress } from "viem";
import type {
  IPaymentVerifier,
  PaymentChallenge,
  PaymentContext,
  PaymentPayload,
  PaymentRequiredResponse,
  PaymentRequirement,
  PaymentResult,
} from "@/lib/payment/interface";

type FacilitatorVerifyResponse = {
  isValid: boolean;
  payer?: string;
  invalidReason?: string;
  invalidMessage?: string;
};

type FacilitatorSettleResponse = {
  success: boolean;
  payer?: string;
  transaction?: string;
  network?: string;
  amount?: string;
  errorReason?: string;
  errorMessage?: string;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required for x402 payment mode.`);
  }

  return value;
}

function getFacilitatorBaseUrl() {
  const baseUrl = getRequiredEnv("X402_FACILITATOR_URL").replace(/\/$/, "");

  if (!/^https?:\/\//.test(baseUrl)) {
    throw new Error("X402_FACILITATOR_URL must be an absolute URL.");
  }

  return baseUrl;
}

async function getAuthorizationHeader(path: string) {
  const keyName = process.env.X402_FACILITATOR_KEY_NAME;
  const keySecret = process.env.X402_FACILITATOR_KEY_SECRET;

  if (keyName && keySecret) {
    const facilitatorUrl = new URL(`${getFacilitatorBaseUrl()}${path}`);

    const jwt = await generateJwt({
      apiKeyId: keyName,
      apiKeySecret: keySecret,
      requestMethod: "POST",
      requestHost: facilitatorUrl.host,
      requestPath: facilitatorUrl.pathname,
      expiresIn: 120,
    });

    return `Bearer ${jwt}`;
  }

  const bearerToken = process.env.X402_FACILITATOR_TOKEN;

  if (!bearerToken) {
    throw new Error(
      "Set X402_FACILITATOR_KEY_NAME and X402_FACILITATOR_KEY_SECRET, or provide X402_FACILITATOR_TOKEN.",
    );
  }

  return `Bearer ${bearerToken}`;
}

function getRequiredAddressEnv(name: string) {
  const value = getRequiredEnv(name);

  if (!isAddress(value, { strict: false })) {
    throw new Error(
      `${name} must be a valid EVM address. Update your .env.local with a real Base wallet address.`,
    );
  }

  return getAddress(value);
}

function getPaymentRequirement(context: PaymentContext): PaymentRequirement {
  return {
    scheme: "exact",
    network: process.env.X402_NETWORK_ID || "eip155:8453",
    asset: getRequiredAddressEnv("X402_ASSET_ADDRESS"),
    amount: context.amountAtomic,
    payTo: getRequiredAddressEnv("X402_PAY_TO"),
    maxTimeoutSeconds: Number(process.env.X402_MAX_TIMEOUT_SECONDS || "60"),
    extra: {
      name: process.env.X402_ASSET_NAME || "USDC",
      version: "2",
    },
  };
}

function toBase64Json(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString("base64");
}

function fromBase64Json<T>(value: string) {
  return JSON.parse(Buffer.from(value, "base64").toString("utf8")) as T;
}

function readPaymentSignature(request: Request) {
  const headerValue =
    request.headers.get("PAYMENT-SIGNATURE") ?? request.headers.get("X-PAYMENT");

  if (!headerValue) {
    return null;
  }

  try {
    return fromBase64Json<PaymentPayload>(headerValue);
  } catch {
    try {
      return JSON.parse(headerValue) as PaymentPayload;
    } catch {
      throw new Error("PAYMENT-SIGNATURE must be base64-encoded JSON.");
    }
  }
}

async function postToFacilitator<T>(path: string, payload: unknown) {
  const response = await fetch(`${getFacilitatorBaseUrl()}${path}`, {
    method: "POST",
    headers: {
      Authorization: await getAuthorizationHeader(path),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const rawBody = await response.text();
  let body:
    | T
    | { errorMessage?: string; message?: string }
    | null = null;

  if (rawBody) {
    try {
      body = JSON.parse(rawBody) as T | { errorMessage?: string; message?: string };
    } catch {
      body = { message: rawBody.trim() || undefined };
    }
  }

  if (!response.ok) {
    const failureBody = (body ?? {}) as {
      errorMessage?: string;
      message?: string;
      error?: string;
      detail?: string;
      invalidMessage?: string;
      invalidReason?: string;
      errorReason?: string;
      errors?: unknown;
      id?: string;
    };
    const detail =
      typeof failureBody.errorMessage === "string"
        ? failureBody.errorMessage
        : typeof failureBody.invalidMessage === "string"
          ? failureBody.invalidMessage
          : typeof failureBody.message === "string"
            ? failureBody.message
            : typeof failureBody.error === "string"
              ? failureBody.error
              : typeof failureBody.detail === "string"
                ? failureBody.detail
                : typeof failureBody.invalidReason === "string"
                  ? failureBody.invalidReason
                  : typeof failureBody.errorReason === "string"
                    ? failureBody.errorReason
                    : Array.isArray(failureBody.errors) && failureBody.errors.length > 0
                      ? JSON.stringify(failureBody.errors)
                      : typeof body === "object" && body
                        ? JSON.stringify(body)
                        : `Facilitator request failed with status ${response.status}.`;

    console.error("[x402] Facilitator request failed", {
      path,
      status: response.status,
      body,
    });

    throw new Error(detail);
  }

  return body as T;
}

export class X402PaymentVerifier implements IPaymentVerifier {
  async generateChallenge(context: PaymentContext): Promise<PaymentChallenge> {
    const body = {
      x402Version: 2,
      error: "PAYMENT-SIGNATURE header is required",
      resource: {
        url: context.resource.url,
        description: context.resource.description,
        mimeType: context.resource.mimeType,
      },
      accepts: [getPaymentRequirement(context)],
    } satisfies PaymentRequiredResponse;

    return {
      mode: "x402",
      status: 402,
      body,
      headers: {
        "PAYMENT-REQUIRED": toBase64Json(body),
        "Access-Control-Expose-Headers": "PAYMENT-REQUIRED, PAYMENT-RESPONSE",
      },
    };
  }

  async verify(request: Request, context: PaymentContext): Promise<PaymentResult> {
    const paymentPayload = readPaymentSignature(request);

    if (!paymentPayload) {
      throw new Error("PAYMENT-SIGNATURE header is required for x402 purchases.");
    }

    const paymentRequirements = getPaymentRequirement(context);

    const verifyResponse = await postToFacilitator<FacilitatorVerifyResponse>(
      "/verify",
      {
        x402Version: 2,
        paymentPayload,
        paymentRequirements,
      },
    );

    if (!verifyResponse.isValid) {
      throw new Error(
        verifyResponse.invalidMessage ??
          verifyResponse.invalidReason ??
          "Facilitator rejected the x402 payment payload.",
      );
    }

    const settleResponse = await postToFacilitator<FacilitatorSettleResponse>(
      "/settle",
      {
        x402Version: 2,
        paymentPayload,
        paymentRequirements,
      },
    );

    if (!settleResponse.success || !settleResponse.transaction) {
      throw new Error(
        settleResponse.errorMessage ??
          settleResponse.errorReason ??
          "Facilitator could not settle the x402 payment.",
      );
    }

    return {
      ok: true,
      mode: "x402",
      paymentTxHash: settleResponse.transaction,
      amountUsd: context.amountUsd,
      payer: settleResponse.payer,
      settlement: settleResponse,
    };
  }
}
