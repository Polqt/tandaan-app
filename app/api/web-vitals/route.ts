import { NextResponse } from "next/server";
import { loggerWithRequest } from "@/lib/logger";
import { getRequestId } from "@/lib/request-id";
import { withRequestHeaders } from "@/lib/response";

type VitalPayload = {
  id?: string;
  name?: string;
  rating?: string;
  value?: number;
};

export async function POST(request: Request) {
  const requestId = await getRequestId();
  const logger = loggerWithRequest(requestId, { route: "web-vitals" });

  try {
    const payload = (await request.json()) as VitalPayload;
    logger.info({ vitals: payload }, "Web vitals event");
    return withRequestHeaders(NextResponse.json({ success: true }), requestId);
  } catch (error) {
    logger.error({ error }, "Web vitals event failed");
    return withRequestHeaders(
      NextResponse.json({ error: "Invalid payload" }, { status: 400 }),
      requestId,
    );
  }
}
