"use client";

import { cn } from "@/lib/cn";
import { useCalculator, type Settings } from "@/hooks/useCalculator";
import { Display } from "./Display";
import { Keypad } from "./Keypad";
import { HistoryPanel } from "./HistoryPanel";

export function Calculator() {
  const {
    state,
    history,
    settings,
    handleKey,
    setSetting,
    pickHistory,
    deleteHistory,
    clearHistory,
  } = useCalculator();

  const memoryActive = state.memory !== "0" && state.memory !== "";

  return (
    <main className="flex min-h-full w-full flex-col items-center justify-center gap-6 p-4 sm:p-8">
      <div className="flex w-full max-w-sm flex-col items-center justify-center gap-6">
        {/* ---- console -------------------------------------------------- */}
        <section className="case relative w-full bg-gradient-to-b from-case-hi to-case p-4 sm:p-5">
          <header className="mb-5 flex items-start justify-between gap-2">
            <h1 className="font-pixel text-[19px] leading-[1.12] text-ink text-shadow-pixel">
              RETRO CALC
            </h1>

            <div className="text-xl leading-none tracking-[0.15em] text-hot-2" aria-hidden>
              ♥ ♥ ♡
            </div>
          </header>

          <Display
            value={state.value}
            expression={state.expression}
            operator={state.operator}
            memoryActive={memoryActive}
            grouping={settings.grouping}
            error={state.error}
          />

          <div className="my-5 flex gap-2.5">
            <Toggle
              icon="♪"
              label="SOUND"
              on={settings.sound}
              onClick={() => setSetting("sound", !settings.sound)}
            />
            <Toggle
              icon=","
              label="1,000"
              on={settings.grouping}
              onClick={() => setSetting("grouping", !settings.grouping)}
            />
            <Toggle
              icon="≡"
              label="LOG"
              on={settings.showHistory}
              onClick={() => setSetting("showHistory", !settings.showHistory)}
            />
          </div>

          <Keypad onKey={handleKey} />
        </section>

        {/* ---- history (below the console) --------------------------- */}
        {settings.showHistory && (
          <HistoryPanel
            entries={history}
            onPick={pickHistory}
            onDelete={deleteHistory}
            onClear={clearHistory}
          />
        )}
      </div>

      <p className="text-center font-pixel text-[8px] leading-relaxed text-ink-soft">
        NEXT.JS 16 · TYPESCRIPT · DECIMAL.JS · TAILWIND
        <br />
        KEYBOARD READY · SAVED TO THIS BROWSER
      </p>
    </main>
  );
}

/* -------------------------------------------------------------------------- */

function Toggle({
  icon,
  label,
  on,
  onClick,
}: {
  icon: string;
  label: keyof Settings | string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        "key flex h-12 min-w-0 flex-1 items-center gap-1.5 rounded-full px-3 font-pixel text-[8px] tracking-[0.06em]",
        "bg-gradient-to-b from-pale-2 to-pale text-ink",
        !on && "opacity-70",
      )}
    >
      <span aria-hidden className="shrink-0 text-[12px] leading-none">
        {icon}
      </span>
      <span className="whitespace-nowrap">{label}</span>
      <span
        aria-hidden
        className={cn(
          "ml-auto inline-block h-2 w-2 shrink-0 rounded-full",
          on
            ? "bg-hot-2 shadow-[0_0_5px_rgba(232,95,151,0.85)]"
            : "bg-hot-2/45",
        )}
      />
    </button>
  );
}
