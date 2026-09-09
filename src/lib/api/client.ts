import type { z } from "zod";
import { kpilyEnvelope } from "@/lib/schemas/common";

const KPILY_BASE_URL = "https://kpily-api.azurewebsites.net";

export class KpilyApiError extends Error {
  status: number;
  details: string | null;

  constructor(message: string, status: number, details: string | null) {
    super(message);
    this.name = "KpilyApiError";
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = {
  token?: string;
  body?: unknown;
  isFormData?: boolean;
};

async function request<T extends z.ZodTypeAny>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  contentSchema: T,
  options: RequestOptions = {},
): Promise<z.infer<T>> {
  const headers: Record<string, string> = {};
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  let body: BodyInit | undefined;
  if (options.body !== undefined) {
    if (options.isFormData) {
      body = options.body as FormData;
      // do not set Content-Type, fetch sets the multipart boundary itself
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(options.body);
    }
  }

  const res = await fetch(`${KPILY_BASE_URL}${path}`, {
    method,
    headers,
    body,
  });

  const json = await res.json();
  const envelope = kpilyEnvelope(contentSchema).safeParse(json);

  if (!envelope.success) {
    throw new KpilyApiError(
      "Response did not match expected shape",
      res.status,
      envelope.error.message,
    );
  }

  if (res.status !== 200 || envelope.data.result.status !== 0) {
    throw new KpilyApiError(
      envelope.data.result.message,
      res.status,
      envelope.data.result.details,
    );
  }

  return envelope.data.content;
}

export const kpilyApi = {
  get: <T extends z.ZodTypeAny>(
    path: string,
    contentSchema: T,
    options?: RequestOptions,
  ) => request("GET", path, contentSchema, options),

  post: <T extends z.ZodTypeAny>(
    path: string,
    contentSchema: T,
    options?: RequestOptions,
  ) => request("POST", path, contentSchema, options),

  put: <T extends z.ZodTypeAny>(
    path: string,
    contentSchema: T,
    options?: RequestOptions,
  ) => request("PUT", path, contentSchema, options),

  delete: <T extends z.ZodTypeAny>(
    path: string,
    contentSchema: T,
    options?: RequestOptions,
  ) => request("DELETE", path, contentSchema, options),
};
