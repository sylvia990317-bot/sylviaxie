const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const path = require('node:path');

function harness() {
  const timers = new Map();
  let id = 0;
  const api = {};
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../app/work/halogrip/pin-coordinator.ts'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  vm.runInNewContext(code, { exports: api,
    setTimeout: (fn, delay) => { timers.set(++id, { fn, delay }); return id; },
    clearTimeout: (key) => timers.delete(key),
  });
  return { create: api.createPinCoordinator, timers,
    flush() { for (const [key, task] of [...timers]) { if (timers.delete(key)) task.fn(); } },
  };
}

test('already-ready delivery can be cancelled before the next task', () => {
  const h = harness(); const c = h.create(); let calls = 0;
  c.markPinReady('scroll-intro');
  c.onPinsReady(['scroll-intro'], () => calls++)();
  h.flush(); assert.equal(calls, 0); assert.equal(h.timers.size, 0);
});
test('waiting delivery remains cancellable after readiness', () => {
  const h = harness(); const c = h.create(); let calls = 0;
  const cancel = c.onPinsReady(['scroll-intro'], () => calls++);
  c.markPinReady('scroll-intro'); cancel(); h.flush();
  assert.equal(calls, 0); assert.equal(h.timers.size, 0);
});
test('all dependencies are required and delivery occurs once', () => {
  const h = harness(); const c = h.create(); let calls = 0;
  c.onPinsReady(['scroll-intro', 'design-gap-sequence'], () => calls++);
  c.markPinReady('scroll-intro'); assert.equal(calls, 0);
  c.markPinReady('design-gap-sequence'); c.markPinReady('design-gap-sequence');
  h.flush(); h.flush(); assert.equal(calls, 1); assert.equal(h.timers.size, 0);
});
test('fallback deadline delivers once and removes its waiter', () => {
  const h = harness(); const c = h.create(); let calls = 0;
  c.onPinsReady(['scroll-intro'], () => calls++);
  h.flush(); c.markPinReady('scroll-intro'); h.flush();
  assert.equal(calls, 1); assert.equal(h.timers.size, 0);
});
test('page instances do not inherit readiness from a previous visit', () => {
  const h = harness(); const first = h.create(); const second = h.create();
  first.markPinReady('scroll-intro');
  let calls = 0;
  const cancel = second.onPinsReady(['scroll-intro'], () => calls++);
  assert.equal([...h.timers.values()][0].delay, 20000);
  assert.equal(calls, 0); cancel(); assert.equal(h.timers.size, 0);
  second.markPinReady('scroll-intro');
  second.onPinsReady(['scroll-intro'], () => calls++); h.flush();
  assert.equal(calls, 1);
});
test('unmount before readiness leaves no pending timeout', () => {
  const h = harness(); const c = h.create(); let calls = 0;
  c.onPinsReady(['scroll-intro'], () => calls++)();
  c.markPinReady('scroll-intro'); h.flush();
  assert.equal(calls, 0); assert.equal(h.timers.size, 0);
});
