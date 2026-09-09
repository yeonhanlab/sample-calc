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
    <aside className="bevel mx-auto flex max-h-[420px] w-full max-w-sm flex-col bg-plum-2 p-3 lg:mx-0 lg:max-h-[560px] lg:w-64">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-pixel text-[10px] text-pink">HISTORY</h2>
        <button
          type="button"
          onClick={onClear}
          disabled={entries.length === 0}
          className="key h-7 bg-pink-hot px-2 text-[8px] text-void"
        >
          CLEAR
        </button>
      </div>

      <ul className="scrollbar-pixel flex flex-1 flex-col gap-1 overflow-y-auto pr-1">
        {entries.length === 0 && (
          <li className="select-none py-10 text-center font-lcd text-xl text-berry">
            - NO RECORDS -
          </li>
        )}

        {entries.map((e) => (
          <li key={e.id} className="border-2 border-void bg-plum p-2">
            <div className="flex items-start justify-between gap-2">
              <button
                type="button"
                onClick={() => onPick(e.result)}
                className="min-w-0 flex-1 text-left"
                title="이 결과 불러오기"
              >
                <div className="truncate font-lcd text-base text-pink-pale/70">
                  {e.expression}
                </div>
                <div className="truncate font-lcd text-2xl text-lcd-ink">
                  = {formatForDisplay(e.result)}
                </div>
              </button>
              <button
                type="button"
                aria-label="기록 삭제"
                onClick={() => onDelete(e.id)}
                className="key h-6 w-6 shrink-0 bg-berry text-[8px] text-pink-pale"
              >
                x
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
