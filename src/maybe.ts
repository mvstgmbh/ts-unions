import { curry } from "./utils";

export type Maybe<T> = { type: "Nothing" } | { type: "Just"; value: T };

type Pattern<T, TResult> = {
  _?: () => TResult;
  nothing?: () => TResult;
  just?: (value: T) => TResult;
};

function nothing<T>(): Maybe<T> {
  return { type: "Nothing" };
}

function just<T>(value: T): Maybe<T> {
  return { type: "Just", value };
}

function isJust<T>(maybe: Maybe<T>) {
  return maybe.type === "Just";
}

function isNothing<T>(maybe: Maybe<T>) {
  return maybe.type === "Nothing";
}

interface CurriedWithDefault {
  <T, TResult>(defaultValue: TResult, maybe: Maybe<T>): TResult;
  <T, TResult>(defaultValue: TResult): (maybe: Maybe<T>) => TResult;
}

const withDefault: CurriedWithDefault = curry(function withDefault<T, TResult>(
  defaultValue: TResult,
  maybe: Maybe<T>,
) {
  return isJust(maybe) ? maybe.value : defaultValue;
});

interface CurriedWhen {
  <T, TResult>(pattern: Pattern<T, TResult>, maybe: Maybe<T>): TResult;
  <T, TResult>(pattern: Pattern<T, TResult>): (maybe: Maybe<T>) => TResult;
}

const when: CurriedWhen = curry(function when<T, TResult>(
  pattern: Pattern<T, TResult>,
  maybe: Maybe<T>,
): TResult {
  const { nothing, just, _ = Function.prototype } = pattern;

  switch (maybe.type) {
    case "Nothing":
      return typeof nothing === "function" ? nothing() : _();

    case "Just":
      return typeof just === "function" ? just(maybe.value) : _();
  }
});

interface CurriedMap {
  <T, TResult>(fn: (value: T) => TResult, maybe: Maybe<T>): Maybe<TResult>;
  <T, TResult>(fn: (value: T) => TResult): (maybe: Maybe<T>) => Maybe<TResult>;
}

const map: CurriedMap = curry(function map<T, TResult>(fn: (value: T) => TResult, maybe: Maybe<T>) {
  return isJust(maybe) ? just(fn(maybe.value)) : maybe;
});

interface CurriedAndThen {
  <T, TResult>(fn: (value: T) => Maybe<TResult>, maybe: Maybe<T>): Maybe<TResult>;
  <T, TResult>(fn: (value: T) => Maybe<TResult>): (maybe: Maybe<T>) => Maybe<TResult>;
}

const andThen: CurriedAndThen = curry(function andThen<T, TResult>(
  fn: (value: T) => Maybe<TResult>,
  maybe: Maybe<T>,
) {
  return isJust(maybe) ? fn(maybe.value) : maybe;
});

export { andThen, isJust, isNothing, just, map, nothing, when, withDefault };
