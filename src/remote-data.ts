import { curry } from "./utils";

export type RemoteData<T> =
  | { type: "Error"; error: Error }
  | { type: "Loading" }
  | { type: "NotAsked" }
  | { type: "Success"; value: T };

type Pattern<T, TResult> = {
  _?: () => TResult;
  error?: (error: Error) => TResult;
  loading?: () => TResult;
  notAsked?: () => TResult;
  success?: (value: T) => TResult;
};

function notAsked<T>(): RemoteData<T> {
  return { type: "NotAsked" };
}

function loading<T>(): RemoteData<T> {
  return { type: "Loading" };
}

function success<T>(value: T): RemoteData<T> {
  return { type: "Success", value };
}

function error<T>(error: Error): RemoteData<T> {
  return { type: "Error", error };
}

function isSuccess<T>(remoteData: RemoteData<T>) {
  return remoteData.type === "Success";
}

function isError<T>(remoteData: RemoteData<T>) {
  return remoteData.type === "Error";
}

function isLoading<T>(remoteData: RemoteData<T>) {
  return remoteData.type === "Loading";
}

function isNotAsked<T>(remoteData: RemoteData<T>) {
  return remoteData.type === "NotAsked";
}

interface CurryWithDefault {
  <T>(defaultValue: T, remoteData: RemoteData<T>): T;
  <T>(defaultValue: T): (remoteData: RemoteData<T>) => T;
}

const withDefault: CurryWithDefault = curry(function withDefault<T, TResult>(
  defaultValue: TResult,
  remoteData: RemoteData<T>,
) {
  return isSuccess(remoteData) ? remoteData.value : defaultValue;
});

interface CurriedWhen {
  <T, TResult>(pattern: Pattern<T, TResult>, remoteData: RemoteData<T>): TResult;
  <T, TResult>(pattern: Pattern<T, TResult>): (remoteData: RemoteData<T>) => TResult;
}

const when: CurriedWhen = curry(function when<T, TResult>(
  pattern: Pattern<T, TResult>,
  remoteData: RemoteData<T>,
): TResult {
  const { notAsked, loading, success, error, _ = Function.prototype } = pattern;

  switch (remoteData.type) {
    case "NotAsked":
      return typeof notAsked === "function" ? notAsked() : _();

    case "Loading":
      return typeof loading === "function" ? loading() : _();

    case "Success":
      return typeof success === "function" ? success(remoteData.value) : _();

    case "Error":
      return typeof error === "function" ? error(remoteData.error) : _();
  }
});

interface CurriedMap {
  <T, TResult>(fn: (value: T) => TResult, remoteData: RemoteData<T>): RemoteData<TResult>;
  <T, TResult>(fn: (value: T) => TResult): (remoteData: RemoteData<T>) => RemoteData<TResult>;
}

const map: CurriedMap = curry(function map<T, TResult>(
  fn: (value: T) => TResult,
  remoteData: RemoteData<T>,
) {
  return isSuccess(remoteData) ? success(fn(remoteData.value)) : remoteData;
});

interface CurriedAndThen {
  <T, TResult>(
    fn: (value: T) => RemoteData<TResult>,
    remoteData: RemoteData<T>,
  ): RemoteData<TResult>;
  <T, TResult>(
    fn: (value: T) => RemoteData<TResult>,
  ): (remoteData: RemoteData<T>) => RemoteData<TResult>;
}

const andThen: CurriedAndThen = curry(function andThen<T, TResult>(
  fn: (value: T) => RemoteData<TResult>,
  remoteData: RemoteData<T>,
) {
  return isSuccess(remoteData) ? fn(remoteData.value) : remoteData;
});

export {
  andThen,
  error,
  isError,
  isLoading,
  isNotAsked,
  isSuccess,
  loading,
  map,
  notAsked,
  success,
  when,
  withDefault,
};
