"use client";

import { cn } from "@/lib/cn";
import { formatForDisplay } from "@/lib/format";
import type { Operator } from "@/lib/calculator";

interface DisplayProps {
  value: string;
  expression: string;
  operator: Operator | null;
  memoryActive: boolean;
  grouping: boolean;
  error: boolean;
}

function sizeClass(len: number): string {
  if (len <= 9) return "text-6xl";
  if (len <= 12) return "text-5xl";
  if (len <= 16) return "text-4xl";
  return "text-3xl";
}

export function Display({
  value,
  expression,
  operator,
  memoryActive,
  grouping,
  error,
}: DisplayProps) {
  const shown = error ? "ERROR" : formatForDisplay(value, grouping);

  return (
    <div className="crt bevel mb-1 overflow-hidden bg-lcd px-3 py-3">
      {/* top strip: memory flag + running expression */}
      <div className="relative z-[2] flex min-h-6 items-center justify-between font-lcd text-lg leading-none text-lcd-ink/70">
        <span
          className={cn(
            "border-2 px-1",
            memoryActive
              ? "border-lcd-ink text-lcd-ink"
              : "border-transparent text-transparent",
          )}
        >
          M
        </span>
        <span className="max-w-[72%] truncate text-right">
          {expression || " "}
        </span>
      </div>

      {/* main number */}
      <div
        className={cn(
          "relative z-[2] break-all text-right font-lcd leading-none tabular-nums text-lcd-ink",
          sizeClass(shown.length),
        )}
        style={{ textShadow: "0 0 8px rgba(255, 158, 203, 0.55)" }}
        aria-live="polite"
        role="status"
      >
        {shown}
        {!error && <span className="blink ml-1">_</span>}
      </div>

      {/* bottom strip: active operator */}
      <div className="relative z-[2] flex h-5 items-center justify-end font-lcd text-base text-lcd-ink/60">
        {operator && (
          <span className="border-2 border-lcd-ink/60 px-1">{operator}</span>
        )}
      </div>
    </div>
  );
}
