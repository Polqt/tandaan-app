type LogContext = Record<string, unknown>;
type LogLevel = "debug" | "info" | "warn" | "error";
type LogMethod = (
  messageOrContext: string | LogContext,
  messageOrContext2?: string | LogContext,
) => void;

interface Logger {
  debug: LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
  child(context: LogContext): Logger;
}

class SimpleLogger {
  private level: LogLevel;

  constructor(level: LogLevel = "info") {
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ["debug", "info", "warn", "error"];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : "";
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
  }

  private normalizeArgs(
    messageOrContext: string | LogContext,
    messageOrContext2?: string | LogContext,
  ) {
    if (
      typeof messageOrContext === "string" &&
      typeof messageOrContext2 === "object"
    ) {
      return { message: messageOrContext, context: messageOrContext2 };
    }

    if (
      typeof messageOrContext === "object" &&
      typeof messageOrContext2 === "string"
    ) {
      return { message: messageOrContext2, context: messageOrContext };
    }

    if (typeof messageOrContext === "string") {
      return { message: messageOrContext, context: undefined };
    }

    const { msg, message, ...context } = messageOrContext;
    return {
      message:
        typeof msg === "string"
          ? msg
          : typeof message === "string"
            ? message
            : "Log event",
      context,
    };
  }

  debug: LogMethod = (messageOrContext, messageOrContext2) => {
    if (this.shouldLog("debug")) {
      const { message, context } = this.normalizeArgs(
        messageOrContext,
        messageOrContext2,
      );
      console.debug(this.formatMessage("debug", message, context));
    }
  };

  info: LogMethod = (messageOrContext, messageOrContext2) => {
    if (this.shouldLog("info")) {
      const { message, context } = this.normalizeArgs(
        messageOrContext,
        messageOrContext2,
      );
      console.info(this.formatMessage("info", message, context));
    }
  };

  warn: LogMethod = (messageOrContext, messageOrContext2) => {
    if (this.shouldLog("warn")) {
      const { message, context } = this.normalizeArgs(
        messageOrContext,
        messageOrContext2,
      );
      console.warn(this.formatMessage("warn", message, context));
    }
  };

  error: LogMethod = (messageOrContext, messageOrContext2) => {
    if (this.shouldLog("error")) {
      const { message, context } = this.normalizeArgs(
        messageOrContext,
        messageOrContext2,
      );
      console.error(this.formatMessage("error", message, context));
    }
  };

  child(context: LogContext): Logger {
    const childLogger = new SimpleLogger(this.level);
    const parentContext = context;
    const withParent =
      (level: LogLevel): LogMethod =>
      (messageOrContext, messageOrContext2) => {
        const { message, context: childContext } = this.normalizeArgs(
          messageOrContext,
          messageOrContext2,
        );
        childLogger[level](message, { ...parentContext, ...childContext });
      };

    return {
      debug: withParent("debug"),
      info: withParent("info"),
      warn: withParent("warn"),
      error: withParent("error"),
      child: (childContext: LogContext) =>
        childLogger.child({ ...parentContext, ...childContext }),
    };
  }
}

const baseLogger = new SimpleLogger(
  (process.env.LOG_LEVEL as LogLevel) || "info"
);

export function loggerWithRequest(requestId: string, context?: LogContext) {
  return baseLogger.child({
    requestId,
    ...context,
  });
}

export type AppLogger = Logger;
