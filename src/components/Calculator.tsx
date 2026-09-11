"use client";

import { useLayoutEffect, useRef, useState } from "react";
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

  // The keypad's natural height can exceed short phone screens. Rather than
  // letting the first screen scroll or clip, measure the console against
  // the viewport and scale it down vertically so it always fits on one
  // screen — history and the footer credits live below it in normal,
  // scrollable flow.
  const screenRef = useRef<HTMLDivElement>(null);
  const caseRef = useRef<HTMLElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const screen = screenRef.current;
    const caseEl = caseRef.current;
    if (!screen || !caseEl) return;

    const fit = () => {
      const caseHeight = caseEl.scrollHeight;
      if (!caseHeight) return;
      // The case's width is already bounded by the same max-w-sm + side
      // padding as the history panel below, so it never needs to shrink
      // horizontally — only scale vertically, or the calculator would end
      // up visibly narrower than the history panel whenever height is the
      // tight dimension.
      const style = getComputedStyle(screen);
      const availHeight =
        screen.clientHeight -
        parseFloat(style.paddingTop) -
        parseFloat(style.paddingBottom);
      const next = Math.min(1, availHeight / caseHeight);
      setScale(Number.isFinite(next) && next > 0 ? next : 1);
    };

    fit();

    const observer = new ResizeObserver(fit);
    observer.observe(screen);
    observer.observe(caseEl);
    window.addEventListener("resize", fit);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  return (
    <main className="flex w-full flex-col items-center">
      {/* ---- first screen: just the calculator, always fits, no scroll - */}
      <div
        ref={screenRef}
        className="flex h-dvh w-full items-center justify-center overflow-hidden px-4 py-6 sm:px-8 sm:py-10"
      >
        <section
          ref={caseRef}
          style={{ transform: `scaleY(${scale})`, transformOrigin: "center" }}
          className="case relative w-full max-w-sm bg-gradient-to-b from-case-hi to-case p-4 sm:p-5"
        >
          <header className="mb-5 flex items-start justify-between gap-2">
            <h1 className="font-pixel text-[19px] leading-[1.12] text-ink text-shadow-pixel">
              RETRO
              <br />
              CALC
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
      </div>

      {/* ---- history + footer: scroll down from the first screen ------- */}
      <div className="flex w-full flex-col items-center px-4 pt-6 pb-8 sm:px-8 sm:pt-10 sm:pb-10">
        {/* same max-w-sm + side padding as the console above, so the
            history panel lines up at the same width as the calculator */}
        <div className="flex w-full max-w-sm flex-col items-center gap-6">
          {settings.showHistory && (
            <HistoryPanel
              entries={history}
              onPick={pickHistory}
              onDelete={deleteHistory}
              onClear={clearHistory}
            />
          )}

          <p className="text-center font-pixel text-[8px] leading-relaxed text-ink-soft">
            NEXT.JS 16 · TYPESCRIPT · DECIMAL.JS · TAILWIND
            <br />
            KEYBOARD READY · SAVED TO THIS BROWSER
          </p>
        </div>
      </div>
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
