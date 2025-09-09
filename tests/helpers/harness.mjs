const tests = [];

export function it(name, fn) {
  tests.push({ name, fn });
}

export function expect(received) {
  return {
    toBe(expected) {
      if (!Object.is(received, expected)) {
        throw new Error(`Expected ${String(received)} to be ${String(expected)}`);
      }
    },
    toEqual(expected) {
      const r = JSON.stringify(received);
      const e = JSON.stringify(expected);
      if (r !== e) {
        throw new Error(`Expected ${r} to equal ${e}`);
      }
    },
    toBeGreaterThan(n) {
      if (!(received > n)) throw new Error(`Expected ${received} > ${n}`);
    },
  };
}

export async function run() {
  let pass = 0, fail = 0;
  for (const t of tests) {
    try {
      const res = t.fn();
      if (res && typeof res.then === 'function') await res;
      console.log(`\u2713 ${t.name}`);
      pass++;
    } catch (e) {
      console.error(`\u2717 ${t.name}`);
      console.error('    ' + (e && e.message ? e.message : String(e)));
      fail++;
    }
  }
  console.log(`\n${pass} passed, ${fail} failed`);
  if (fail > 0) process.exit(1);
}

