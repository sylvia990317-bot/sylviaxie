"use client";
import { createContext, useContext, useState, useMemo, useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createPinCoordinator } from "./pin-coordinator";
const PinContext = createContext<ReturnType<typeof createPinCoordinator> | null>(null);
export default function PinProvider({ children }: { children: ReactNode }) {
  const [coordinator] = useState(createPinCoordinator);
  const refresh = useRef(0);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    return () => cancelAnimationFrame(refresh.current);
  }, []);
  const value = useMemo(() => ({
    ...coordinator,
    markPinReady: (source: Parameters<typeof coordinator.markPinReady>[0]) => {
      coordinator.markPinReady(source);
      cancelAnimationFrame(refresh.current);
      refresh.current = requestAnimationFrame(() => ScrollTrigger.refresh());
    },
  }), [coordinator]);
  return <PinContext.Provider value={value}>{children}</PinContext.Provider>;
}
export function usePinCoordinator() {
  const coordinator = useContext(PinContext);
  if (!coordinator) throw new Error("HALOGRIP requires PinProvider");
  return coordinator;
}
