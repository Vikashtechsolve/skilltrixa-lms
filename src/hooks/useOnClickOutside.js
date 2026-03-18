import { useEffect } from "react";

export default function useOnClickOutside(ref, handler) {
  useEffect(() => {
    if (!ref?.current) return;
    const onPointer = (e) => {
      if (!ref.current.contains(e.target)) handler(e);
    };
    const onKey = (e) => {
      if (e.key === "Escape") handler(e);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, handler]);
}
