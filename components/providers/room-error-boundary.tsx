"use client";

import { AlertTriangle } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "../ui/button";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export default class RoomErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Editor room crashed:", error, errorInfo);
  }

  public render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl bg-[#f4f4f0] p-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#eeede8] text-es-primary">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-es-ink">Editor crashed</p>
          <p className="mt-2 text-xs text-es-muted">
            Something went wrong in the collaboration engine. Reload to recover.
          </p>
          <Button
            className="mt-4 h-8 rounded-lg bg-es-ink px-3 text-xs text-white hover:bg-[#3d4239]"
            onClick={() => window.location.reload()}
            size="sm"
            type="button"
          >
            Reload editor
          </Button>
        </div>
      </div>
    );
  }
}
