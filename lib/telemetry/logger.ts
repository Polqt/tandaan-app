import pino from "pino";

type LogContext = Record<string, unknown>;

const baseLogger = pino({
  level: process.env.LOG_LEVEL || "info",
});

export function loggerWithRequest(requestId: string, context?: LogContext) {
  return baseLogger.child({
    ...(context ?? {}),
    requestId,
  });
}

export type AppLogger = ReturnType<typeof loggerWithRequest>;
