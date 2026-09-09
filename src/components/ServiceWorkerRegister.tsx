"use client";

import { useEffect } from "react";

/**
 * Registers /sw.js so the app is installable and launches standalone.
 * Renders nothing and has no effect on the calculator UI or logic.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof navigator === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* ignore registration failures */
      });
    };

    if (document.readyState === "complete") {
      register();
      return;
    }
    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
