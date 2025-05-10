export function curry<A, B, R>(
  fn: (a: A, b: B) => R,
): {
  (a: A, b: B): R;
  (a: A): (b: B) => R;
};
export function curry<A, B, R>(fn: (a: A, b: B) => R) {
  return function curried(a: A, b?: B) {
    // If both args passed, Call directly
    if (arguments.length >= 2) {
      // `b!` is safe because we know arguments.length >= 2
      return fn(a, b!);
    }
    // Otherwise return a function awaiting `b`
    return (b: B) => fn(a, b);
  };
}

export function compose<T>(...fns: Array<(arg: T) => T>) {
  return (x: T) => fns.reduceRight((acc, fn) => fn(acc), x);
}

export function pipe<T>(...fns: Array<(arg: T) => T>) {
  return (x: T) => fns.reduce((acc, fn) => fn(acc), x);
}
