"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  initialState,
  reducer,
  type CalculatorAction,
  type CalculatorState,
} from "@/lib/calculator";
import { KEYS, loadJSON, saveJSON } from "@/lib/storage";
import { playSound, type SoundKind } from "@/lib/sound";
import type { KeyId } from "@/lib/keys";

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  ts: number;
}

export interface Settings {
  sound: boolean;
  grouping: boolean;
  showHistory: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  sound: false,
  grouping: true,
  showHistory: true,
};

const KEY_TO_SOUND: Record<KeyId, SoundKind> = {
  mc: "memory",
  mr: "memory",
  "m+": "memory",
  "m-": "memory",
  ac: "clear",
  back: "digit",
  pct: "operator",
  div: "operator",
  "7": "digit",
  "8": "digit",
  "9": "digit",
  mul: "operator",
  "4": "digit",
  "5": "digit",
  "6": "digit",
  sub: "operator",
  "1": "digit",
  "2": "digit",
  "3": "digit",
  add: "operator",
  neg: "operator",
  "0": "digit",
  dot: "digit",
  eq: "equals",
};

function idToAction(id: KeyId): CalculatorAction {
  switch (id) {
    case "mc":
      return { type: "memoryClear" };
    case "mr":
      return { type: "memoryRecall" };
    case "m+":
      return { type: "memoryAdd" };
    case "m-":
      return { type: "memorySubtract" };
    case "ac":
      return { type: "clear" };
    case "back":
      return { type: "backspace" };
    case "pct":
      return { type: "percent" };
    case "neg":
      return { type: "negate" };
    case "add":
      return { type: "operator", operator: "+" };
    case "sub":
      return { type: "operator", operator: "-" };
    case "mul":
      return { type: "operator", operator: "×" };
    case "div":
      return { type: "operator", operator: "÷" };
    case "eq":
      return { type: "equals" };
    case "dot":
      return { type: "decimal" };
    default:
      return { type: "digit", digit: id };
  }
}

function makeId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function sanitizeValue(v: unknown): string {
  if (typeof v !== "string" || v === "" || v === "Error") return "0";
  if (!/^-?\d*\.?\d*(e[+-]?\d+)?$/i.test(v)) return "0";
  return v;
}

export function useCalculator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  const soundRef = useRef(false);
  const lastLogged = useRef("");

  useEffect(() => {
    soundRef.current = settings.sound;
  }, [settings.sound]);

  // ---- hydrate from localStorage (client only) --------------------------------
  // The working value/expression always starts fresh at 0 on launch — only
  // memory, history, and settings carry over between sessions.
  useEffect(() => {
    const savedMemory = loadJSON<{ memory: string }>(KEYS.memory, {
      memory: "0",
    });
    const savedHistory = loadJSON<HistoryEntry[]>(KEYS.history, []);
    const savedSettings = loadJSON<Partial<Settings>>(KEYS.settings, {});

    dispatch({
      type: "hydrate",
      state: {
        memory: sanitizeValue(savedMemory.memory),
      },
    });
    setHistory(Array.isArray(savedHistory) ? savedHistory : []);
    setSettings({ ...DEFAULT_SETTINGS, ...savedSettings });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveJSON(KEYS.memory, { memory: state.memory });
  }, [state.memory, hydrated]);

  useEffect(() => {
    if (hydrated) saveJSON(KEYS.history, history);
  }, [history, hydrated]);

  useEffect(() => {
    if (hydrated) saveJSON(KEYS.settings, settings);
  }, [settings, hydrated]);

  // ---- log completed calculations to history ------------------------------
  useEffect(() => {
    if (state.error || !/=\s*$/.test(state.expression)) return;
    const key = `${state.expression}|${state.value}`;
    if (lastLogged.current === key) return;
    lastLogged.current = key;
    const entry: HistoryEntry = {
      id: makeId(),
      expression: state.expression.replace(/\s*=\s*$/, ""),
      result: state.value,
      ts: Date.now(),
    };
    setHistory((prev) => [entry, ...prev].slice(0, 100));
  }, [state.expression, state.value, state.error]);

  // ---- key handling -------------------------------------------------------
  const handleKey = useCallback((id: KeyId) => {
    if (soundRef.current) playSound(KEY_TO_SOUND[id]);
    dispatch(idToAction(id));
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key;
      let id: KeyId | null = null;
      if (/^[0-9]$/.test(k)) id = k as KeyId;
      else if (k === ".") id = "dot";
      else if (k === "+") id = "add";
      else if (k === "-") id = "sub";
      else if (k === "*") id = "mul";
      else if (k === "/") id = "div";
      else if (k === "Enter" || k === "=") id = "eq";
      else if (k === "Backspace") id = "back";
      else if (k === "Delete" || k === "Escape") id = "ac";
      else if (k === "%") id = "pct";
      if (!id) return;
      e.preventDefault();
      handleKey(id);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKey]);

  // ---- settings + history controls --------------------------------------
  const setSetting = useCallback(
    <K extends keyof Settings>(key: K, val: Settings[K]) => {
      setSettings((s) => {
        if (key === "sound" && val) playSound("toggle");
        return { ...s, [key]: val };
      });
    },
    [],
  );

  const pickHistory = useCallback((result: string) => {
    if (soundRef.current) playSound("memory");
    dispatch({
      type: "hydrate",
      state: { value: result, overwrite: true, error: false },
    });
  }, []);

  const deleteHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  return {
    state,
    history,
    settings,
    hydrated,
    handleKey,
    setSetting,
    pickHistory,
    deleteHistory,
    clearHistory,
  };
}
