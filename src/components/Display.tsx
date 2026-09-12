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
  if (len <= 8) return "text-[48px]";
  if (len <= 11) return "text-[38px]";
  if (len <= 15) return "text-[28px]";
  return "text-[21px]";
}

const MEM_SLOTS = ["M1", "M2", "M3", "M4"] as const;

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
    <div className="crt relative overflow-hidden rounded-[28px] border-2 border-[#5a2636] bg-gradient-to-b from-wine-2 to-wine px-5 py-6">
      {/* corner sparkles + registration marks */}
      <span aria-hidden className="pointer-events-none absolute left-4 top-3 text-lcd-ink/45 text-lg">
        ✦
      </span>
      <span aria-hidden className="pointer-events-none absolute left-7 top-9 text-lcd-dim/40 text-[10px]">
        +
      </span>
      <span aria-hidden className="pointer-events-none absolute left-4 bottom-4 text-lcd-dim/45 text-sm">
        +
      </span>
      <span aria-hidden className="pointer-events-none absolute right-20 bottom-4 text-lcd-dim/45 text-sm">
        +
      </span>
      <span aria-hidden className="pointer-events-none absolute right-5 bottom-4 text-lcd-ink/45 text-lg">
        ✦
      </span>

      <div className="relative z-[2] flex items-stretch gap-2">
        {/* left: expression + result */}
        <div className="min-w-0 flex-1">
          <div className="flex min-h-5 items-center font-lcd text-[15px] leading-none text-lcd-dim">
            <span className="truncate">{expression || " "}</span>
          </div>

          <div
            className={cn(
              "mt-3 overflow-hidden whitespace-nowrap text-right font-lcd leading-none tabular-nums text-lcd-ink",
              sizeClass(shown.length),
            )}
            style={{ textShadow: "0 0 7px rgba(244, 184, 211, 0.5)" }}
            aria-live="polite"
            role="status"
          >
            {shown}
          </div>

          <div className="mt-1 flex h-4 items-center justify-end font-lcd text-[14px] text-lcd-dim/70">
            {operator && <span>{operator}</span>}
          </div>
        </div>

        {/* right: memory slot rail */}
        <ul
          aria-hidden
          className="flex shrink-0 flex-col justify-start gap-0.5 pl-1 font-lcd text-[13px] leading-tight text-lcd-dim"
        >
          {MEM_SLOTS.map((m, i) => (
            <li
              key={m}
              className={cn(
                "flex items-center gap-1",
                i === 0 && "text-lcd-ink",
                i === 0 && memoryActive && "drop-shadow-[0_0_6px_rgba(244,184,211,0.8)]",
              )}
            >
              <span className="w-2 text-[0.8em]">{i === 0 ? "▶" : ""}</span>
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
