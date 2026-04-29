import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"output">) {
  return (
    <output
      aria-label="Loading"
      className={cn("inline-flex size-4", className)}
      {...props}
    >
      <Loader2Icon aria-hidden="true" className="size-full animate-spin" />
    </output>
  );
}

export { Spinner };
