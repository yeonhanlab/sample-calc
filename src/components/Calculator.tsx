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
      <div className="flex w-full max-w-4xl flex-col items-start justify-center gap-6 lg:flex-row">
        {/* ---- console -------------------------------------------------- */}
        <section className="bevel relative mx-auto w-full max-w-sm bg-plum-2 p-4 sm:p-5 lg:mx-0">
          <Screws />

          <header className="mb-3 flex items-end justify-between">
            <h1 className="font-pixel text-sm leading-tight text-pink-hot text-shadow-pixel">
              RETRO
              <br />
              CALC
            </h1>
            <Grille />
          </header>

          <Display
            value={state.value}
            expression={state.expression}
            operator={state.operator}
            memoryActive={memoryActive}
            grouping={settings.grouping}
            error={state.error}
          />

          <div className="my-3 flex flex-wrap gap-2">
            <Toggle
              label="SOUND"
              on={settings.sound}
              onClick={() => setSetting("sound", !settings.sound)}
            />
            <Toggle
              label="1,000"
              on={settings.grouping}
              onClick={() => setSetting("grouping", !settings.grouping)}
            />
            <Toggle
              label="LOG"
              on={settings.showHistory}
              onClick={() => setSetting("showHistory", !settings.showHistory)}
            />
          </div>

          <Keypad onKey={handleKey} />
        </section>

        {/* ---- history ------------------------------------------------- */}
        {settings.showHistory && (
          <HistoryPanel
            entries={history}
            onPick={pickHistory}
            onDelete={deleteHistory}
            onClear={clearHistory}
          />
        )}
      </div>

      <p className="text-center font-pixel text-[8px] leading-relaxed text-berry">
        NEXT.JS 16 · TYPESCRIPT · DECIMAL.JS · TAILWIND
        <br />
        KEYBOARD READY · SAVED TO THIS BROWSER
      </p>
    </main>
  );
}

/* -------------------------------------------------------------------------- */

function Toggle({
  label,
  on,
  onClick,
}: {
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
        "key flex h-8 items-center gap-1 px-2 text-[8px]",
        on ? "bg-pink-hot text-void" : "bg-plum text-pink-pale",
      )}
    >
      <span
        className={cn(
          "inline-block h-2 w-2 border-2 border-void",
          on ? "bg-void" : "bg-transparent",
        )}
      />
      {label}
    </button>
  );
}

function Screws() {
  const spots = [
    "left-1 top-1",
    "right-1 top-1",
    "bottom-1 left-1",
    "bottom-1 right-1",
  ];
  return (
    <>
      {spots.map((s) => (
        <span
          key={s}
          aria-hidden
          className={cn("absolute h-2 w-2 bg-void", s)}
        />
      ))}
    </>
  );
}

function Grille() {
  return (
    <div aria-hidden className="grid grid-cols-4 gap-[3px]">
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} className="h-1 w-1 bg-berry" />
      ))}
    </div>
  );
}
