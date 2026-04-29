"use client";

import { Toaster } from "sonner";

export default function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "rounded-2xl border-[#ebe9e6] shadow-lg text-sm",
        },
      }}
    />
  );
}
