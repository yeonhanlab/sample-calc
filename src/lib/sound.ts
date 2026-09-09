export type SoundKind =
  | "digit"
  | "operator"
  | "equals"
  | "clear"
  | "memory"
  | "toggle";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function blip(
  freq: number,
  duration: number,
  type: OscillatorType = "square",
  delay = 0,
): void {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(0.13, t0 + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

/** Tiny 8-bit blips synthesised on the fly — no audio assets. */
export function playSound(kind: SoundKind): void {
  switch (kind) {
    case "digit":
      blip(660, 0.05);
      break;
    case "operator":
      blip(440, 0.06);
      break;
    case "equals":
      blip(523.25, 0.06);
      blip(783.99, 0.09, "square", 0.05);
      break;
    case "clear":
      blip(220, 0.05);
      blip(120, 0.12, "square", 0.04);
      break;
    case "memory":
      blip(330, 0.07);
      break;
    case "toggle":
      blip(880, 0.04);
      break;
  }
}
