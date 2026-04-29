import { headers } from "next/headers";

export async function getRequestId() {
  const requestHeaders = await headers();
  return (
    requestHeaders.get("x-request-id") ||
    requestHeaders.get("x-vercel-id") ||
    crypto.randomUUID()
  );
}
