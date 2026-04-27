"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FieldErrors = Record<string, string[]>;

const SAMPLE_PREVIEW = JSON.stringify(
  [
    { step: 1, label: "Navigate to target", type: "tool_call", tool: "browser-use" },
    { step: 2, label: "Inspect result", type: "tool_result", tool: "browser-use" },
    { step: 3, label: "Complete task", type: "completion", tool: "agent" },
  ],
  null,
  2,
);

export function CreateListingForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    setGlobalError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    const tools = (data.get("tools") as string)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const body = {
      title: data.get("title") as string,
      description: data.get("description") as string,
      domain: data.get("domain") as string,
      taskType: data.get("taskType") as string,
      sourceType: data.get("sourceType") as string,
      verificationStatus: data.get("verificationStatus") as string,
      priceUsd: Number(data.get("priceUsd")),
      tools,
      samplePreview: data.get("samplePreview") as string,
      storageKey: (data.get("storageKey") as string) || undefined,
    };

    try {
      const res = await fetch("/api/supplier/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = (await res.json()) as { slug?: string; error?: string; issues?: FieldErrors };

      if (!res.ok) {
        if (json.issues) setFieldErrors(json.issues);
        setGlobalError(json.error ?? "Could not create listing.");
        setSubmitting(false);
        return;
      }

      router.push(`/supplier/listings`);
    } catch {
      setGlobalError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  function fieldError(name: string) {
    const msgs = fieldErrors[name];
    return msgs?.length ? (
      <span className="field-error" role="alert">
        {msgs[0]}
      </span>
    ) : null;
  }

  return (
    <form className="listing-form stack" onSubmit={(e) => void handleSubmit(e)} noValidate>
      {globalError ? (
        <p className="purchase-flow__error" role="alert">
          {globalError}
        </p>
      ) : null}

      <div className="field-group">
        <label className="field-label" htmlFor="title">
          Title
        </label>
        <input
          className="field-input"
          id="title"
          name="title"
          type="text"
          required
          placeholder="Browser QA traces for checkout flows"
        />
        {fieldError("title")}
      </div>

      <div className="field-group">
        <label className="field-label" htmlFor="description">
          Use case / description
        </label>
        <textarea
          className="field-input field-input--textarea"
          id="description"
          name="description"
          required
          rows={3}
          placeholder="What task does this trace bundle demonstrate? Who is it for?"
        />
        {fieldError("description")}
      </div>

      <div className="form-row">
        <div className="field-group">
          <label className="field-label" htmlFor="domain">
            Domain
          </label>
          <input
            className="field-input"
            id="domain"
            name="domain"
            type="text"
            required
            placeholder="QA automation"
          />
          {fieldError("domain")}
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="taskType">
            Task type
          </label>
          <input
            className="field-input"
            id="taskType"
            name="taskType"
            type="text"
            required
            placeholder="web task execution"
          />
          {fieldError("taskType")}
        </div>
      </div>

      <div className="form-row">
        <div className="field-group">
          <label className="field-label" htmlFor="sourceType">
            Source type
          </label>
          <select className="field-input field-input--select" id="sourceType" name="sourceType" required>
            <option value="SYNTHETIC">Synthetic</option>
            <option value="HYBRID">Hybrid</option>
            <option value="AGENT_GENERATED">Agent generated</option>
            <option value="HUMAN_GENERATED">Human generated</option>
          </select>
          {fieldError("sourceType")}
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="verificationStatus">
            Verification status
          </label>
          <select className="field-input field-input--select" id="verificationStatus" name="verificationStatus" required>
            <option value="PREVIEW_BOUNDARY_ENFORCED">Preview boundary enforced</option>
            <option value="SCHEMA_REVIEWED">Schema reviewed</option>
            <option value="HUMAN_REVIEWED">Human reviewed</option>
          </select>
          {fieldError("verificationStatus")}
        </div>
      </div>

      <div className="form-row">
        <div className="field-group">
          <label className="field-label" htmlFor="priceUsd">
            Price (USD)
          </label>
          <input
            className="field-input"
            id="priceUsd"
            name="priceUsd"
            type="number"
            min="0.01"
            step="0.01"
            required
            placeholder="5.00"
          />
          {fieldError("priceUsd")}
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="tools">
            Tools{" "}
            <span className="field-hint">(comma-separated)</span>
          </label>
          <input
            className="field-input"
            id="tools"
            name="tools"
            type="text"
            placeholder="browser-use, fetch, form fill"
          />
          {fieldError("tools")}
        </div>
      </div>

      <div className="field-group">
        <label className="field-label" htmlFor="samplePreview">
          Sample preview{" "}
          <span className="field-hint">(JSON array of step objects — shown to buyers before purchase)</span>
        </label>
        <textarea
          className="field-input field-input--textarea field-input--code"
          id="samplePreview"
          name="samplePreview"
          required
          rows={8}
          defaultValue={SAMPLE_PREVIEW}
        />
        {fieldError("samplePreview")}
      </div>

      <div className="field-group">
        <label className="field-label" htmlFor="storageKey">
          Storage key{" "}
          <span className="field-hint">(optional — path to trace file in storage)</span>
        </label>
        <input
          className="field-input"
          id="storageKey"
          name="storageKey"
          type="text"
          placeholder="uploads/my-trace-bundle.jsonl"
        />
        {fieldError("storageKey")}
      </div>

      <div className="button-row">
        <button type="submit" className="button-link" disabled={submitting}>
          {submitting ? "Creating..." : "Create listing"}
        </button>
      </div>
    </form>
  );
}
