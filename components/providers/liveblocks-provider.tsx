"use client";

import { LiveblocksProvider as BaseLiveblocksProvider } from "@liveblocks/react/suspense";
import { type ReactNode, Component } from "react";
import { Button } from "@/components/ui/button";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

/**
 * Error boundary to catch Liveblocks provider errors
 */
class LiveblocksErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("LiveblocksErrorBoundary caught an error:", error.message, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl border border-red-200 bg-red-50/50 p-8 text-center">
          <p className="text-sm font-medium text-red-700">
            Connection lost. Please check your internet and try again.
          </p>
          <Button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            size="sm"
            variant="outline"
          >
            Reconnect
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

function InnerLiveblocksProvider({ children }: { children: ReactNode }) {
  return (
    <BaseLiveblocksProvider
      throttle={16}
      authEndpoint="/api/auth-endpoint"
      resolveUsers={async ({ userIds }) => {
        const searchParams = new URLSearchParams(
          userIds.map((userId) => ["userIds", userId]),
        );
        const response = await fetch(`/api/users?${searchParams}`);

        if (!response.ok) {
          throw new Error("Problem resolving users");
        }

        const users = await response.json();
        return users;
      }}
    >
      {children}
    </BaseLiveblocksProvider>
  );
}

export default function LiveBlocksProvider({
  children,
}: {
  children: ReactNode;
}) {
  if (!process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY) {
    throw new Error("LIVEBLOCKS_PUBLIC_KEY is not defined");
  }

  return (
    <LiveblocksErrorBoundary>
      <InnerLiveblocksProvider>{children}</InnerLiveblocksProvider>
    </LiveblocksErrorBoundary>
  );
}