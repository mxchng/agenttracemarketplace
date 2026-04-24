import { z } from "zod";

export const traceStepSchema = z.object({
  step_id: z.number(),
  timestamp: z.string().optional(),
  type: z.enum([
    "reasoning",
    "tool_call",
    "tool_result",
    "retry",
    "fallback",
    "completion",
  ]),
  tool: z.string().optional(),
  input: z.unknown().optional(),
  output: z.unknown().optional(),
  error: z.string().optional(),
  annotation: z.string().optional(),
});

export const traceSchema = z.object({
  schema_version: z.literal("1.0"),
  task_id: z.string(),
  source_type: z.enum(["agent-generated", "human-generated", "hybrid", "synthetic"]),
  domain: z.string(),
  task_description: z.string(),
  model: z.string().optional(),
  tools_available: z.array(z.string()),
  steps: z.array(traceStepSchema),
  outcome: z.enum(["success", "failure", "partial"]),
  quality_annotations: z
    .object({
      completeness: z.number().min(0).max(1).optional(),
      human_reviewed: z.boolean(),
    })
    .optional(),
});

export const tracePreviewSchema = z.object({
  task_id: z.string(),
  source_type: z.enum(["agent-generated", "human-generated", "hybrid", "synthetic"]),
  domain: z.string(),
  task_description: z.string(),
  steps: z.array(
    z.object({
      step_id: z.number(),
      type: traceStepSchema.shape.type,
      tool: z.string().optional(),
      timestamp: z.string().optional(),
      annotation: z.string().optional(),
    }),
  ),
  preview_boundary_note: z.literal("inputs/outputs withheld until purchase"),
});

export type TraceDocument = z.infer<typeof traceSchema>;
export type TracePreview = z.infer<typeof tracePreviewSchema>;
