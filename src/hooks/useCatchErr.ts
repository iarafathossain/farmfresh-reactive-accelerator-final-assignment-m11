"use client";

import { useState } from "react";
import { catchErr as normalizeError } from "@/utils/catchErr";

/**
 * Hook wrapper around the pure error normalization utility.
 * Manages error state and provides normalized error messages.
 */
export const useCatchErr = () => {
  const [err, setErr] = useState<string | null>(null);

  const catchErr = (error: unknown, fallbackMsg = "Something went wrong!") => {
    const normalized = normalizeError(error, fallbackMsg);
    setErr(normalized.error);
    return normalized;
  };

  return { err, setErr, catchErr };
};
