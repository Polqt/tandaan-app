import { NextResponse } from "next/server";

export function withRequestHeaders(response: NextResponse, requestId: string) {
  response.headers.set("x-request-id", requestId);
  return response;
}
