import * as Sentry from "@sentry/nextjs";

type RequestObservabilityContext = {
  requestId?: string | null;
  roomId?: string | null;
  route: string;
  tags?: Record<string, string | number | boolean>;
  userId?: string | null;
};

export function setSentryRequestContext({
  requestId = null,
  roomId = null,
  route,
  tags,
  userId = null,
}: RequestObservabilityContext) {
  if (userId) {
    Sentry.setUser({ id: userId });
  } else {
    Sentry.setUser(null);
  }

  Sentry.setTag("route", route);

  if (requestId) {
    Sentry.setTag("request_id", requestId);
    Sentry.setContext("request", { requestId });
  }

  if (roomId) {
    Sentry.setTag("room_id", roomId);
    Sentry.setContext("document", { roomId });
  }

  if (tags) {
    for (const [key, value] of Object.entries(tags)) {
      Sentry.setTag(key, String(value));
    }
  }
}
