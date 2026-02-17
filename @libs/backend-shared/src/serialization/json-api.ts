import { literal, object, string, ZodObject, type ZodTypeAny } from "zod";
import { z } from "zod";

export const makeJsonApiDocumentSchema = <T extends ZodObject>(
  type: string,
  attributesSchema: T,
): ZodObject<
  {
    id: z.ZodString;
    type: z.ZodLiteral<string>;
    attributes: T;
  },
  z.core.$strip
> =>
  object({
    id: string(),
    type: literal(type),
    attributes: attributesSchema,
  });

export const makeSingleJsonApiTopDocument = <T extends ZodTypeAny>(
  dataSchema: T,
): ZodObject<{
  data: T;
  meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}> =>
  object({
    data: dataSchema,
    meta: z.optional(z.record(z.string(), z.unknown())),
  });

export const jsonApiErrorSchema = object({
  id: string().optional(),
  links: object({
    about: string().optional(),
    type: string().optional(),
  }).optional(),
  status: string(),
  code: string().optional(),
  title: string(),
  detail: string().optional(),
  source: object({
    pointer: string().optional(),
    parameter: string().optional(),
    header: string().optional(),
  }).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export const jsonApiErrorDocumentSchema = object({
  errors: z.array(jsonApiErrorSchema),
});

export type JsonApiError = z.infer<typeof jsonApiErrorSchema>;
export type JsonApiErrorDocument = z.infer<typeof jsonApiErrorDocumentSchema>;

export function makeJsonApiError(
  status: number,
  title: string,
  options?: {
    code?: string;
    detail?: string;
    source?: { pointer?: string; parameter?: string; header?: string };
  },
): JsonApiErrorDocument {
  return {
    errors: [
      {
        status: String(status),
        title,
        code: options?.code,
        detail: options?.detail,
        source: options?.source,
      },
    ],
  };
}
