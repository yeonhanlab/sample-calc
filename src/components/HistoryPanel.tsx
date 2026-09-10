"use client";

import { formatForDisplay } from "@/lib/format";
import type { HistoryEntry } from "@/hooks/useCalculator";

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onPick: (result: string) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function HistoryPanel({
  entries,
  onPick,
  onDelete,
  onClear,
}: HistoryPanelProps) {
  return (
    <aside className="case flex max-h-[420px] w-full flex-col bg-gradient-to-b from-case-hi to-case p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-pixel text-[10px] tracking-[0.12em] text-ink">
          HISTORY
        </h2>
        <button
          type="button"
          onClick={onClear}
          disabled={entries.length === 0}
          className="key h-8 rounded-full bg-gradient-to-b from-pale-2 to-pale px-3 font-pixel text-[8px] tracking-[0.1em] text-ink"
        >
          CLEAR
        </button>
      </div>

      <ul className="scrollbar-pixel flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {entries.length === 0 && (
          <li className="select-none py-10 text-center font-lcd text-xl text-ink-soft">
            - NO RECORDS -
          </li>
        )}

        {entries.map((e) => (
          <li
            key={e.id}
            className="rounded-2xl border-2 border-case-edge bg-pale-2/70 p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <button
                type="button"
                onClick={() => onPick(e.result)}
                className="min-w-0 flex-1 text-left"
                title="이 결과 불러오기"
              >
                <div className="truncate font-lcd text-base text-ink-soft">
                  {e.expression}
                </div>
                <div className="truncate font-lcd text-2xl text-ink">
                  = {formatForDisplay(e.result)}
                </div>
              </button>
              <button
                type="button"
                aria-label="기록 삭제"
                onClick={() => onDelete(e.id)}
                className="key h-7 w-7 shrink-0 rounded-full bg-gradient-to-b from-pale-2 to-pale text-[10px] text-ink"
              >
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
