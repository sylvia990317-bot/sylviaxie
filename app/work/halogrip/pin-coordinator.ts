export type Source = "scroll-intro" | "design-gap-sequence" | "overview-backdrop";

/** A registry belongs to one mounted page; every deferred delivery is cancellable. */
export function createPinCoordinator() {
  const ready = new Set<Source>();
  const pending = new Set<() => void>();
  function markPinReady(source: Source) {
    ready.add(source);
    pending.forEach((check) => check());
  }
  function onPinsReady(deps: readonly Source[], callback: () => void) {
    let cancelled = false;
    let scheduled = false;
    let delivery: ReturnType<typeof setTimeout> | undefined;
    function finish() {
      if (cancelled) return;
      cancelled = true;
      clearTimeout(timeout);
      pending.delete(check);
      callback();
    }
    function check() {
      if (!scheduled && deps.every((source) => ready.has(source))) {
        scheduled = true;
        clearTimeout(timeout);
        delivery = setTimeout(finish, 0);
      }
    }
    const timeout = setTimeout(finish, 20000);
    pending.add(check);
    check();
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      clearTimeout(delivery);
      pending.delete(check);
    };
  }
  return { markPinReady, onPinsReady, resetPin: (source: Source) => ready.delete(source) };
}
