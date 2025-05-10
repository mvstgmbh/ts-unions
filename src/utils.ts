export function compose<T>(...fns: Array<(arg: T) => T>) {
  return (x: T) => fns.reduceRight((acc, fn) => fn(acc), x);
}

export function pipe<T>(...fns: Array<(arg: T) => T>) {
  return (x: T) => fns.reduce((acc, fn) => fn(acc), x);
}
