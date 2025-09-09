import { curry } from "./utils.js";

export type RemoteData<TSuccess, TError = Error> =
  | { type: "Error"; error: TError }
  | { type: "Loading" }
  | { type: "NotAsked" }
  | { type: "Success"; value: TSuccess };

type Pattern<TSuccess, TError, TResult> = {
  _?: () => TResult;
  error?: (error: TError) => TResult;
  loading?: () => TResult;
  notAsked?: () => TResult;
  success?: (value: TSuccess) => TResult;
};

function notAsked<TSuccess, TError = Error>(): RemoteData<TSuccess, TError> {
  return { type: "NotAsked" };
}

function loading<TSuccess, TError = Error>(): RemoteData<TSuccess, TError> {
  return { type: "Loading" };
}

function success<TSuccess, TError = Error>(value: TSuccess): RemoteData<TSuccess, TError> {
  return { type: "Success", value };
}

function error<TSuccess, TError = Error>(error: TError): RemoteData<TSuccess, TError> {
  return { type: "Error", error };
}

function isSuccess<TSuccess, TError = Error>(remoteData: RemoteData<TSuccess, TError>) {
  return remoteData.type === "Success";
}

function isError<TSuccess, TError = Error>(remoteData: RemoteData<TSuccess, TError>) {
  return remoteData.type === "Error";
}

function isLoading<TSuccess, TError = Error>(remoteData: RemoteData<TSuccess, TError>) {
  return remoteData.type === "Loading";
}

function isNotAsked<TSuccess, TError = Error>(remoteData: RemoteData<TSuccess, TError>) {
  return remoteData.type === "NotAsked";
}

interface CurryWithDefault {
  <TSuccess, TError = Error>(
    defaultValue: TSuccess,
    remoteData: RemoteData<TSuccess, TError>,
  ): TSuccess;
  <TSuccess, TError = Error>(
    defaultValue: TSuccess,
  ): (remoteData: RemoteData<TSuccess, TError>) => TSuccess;
}

const withDefault: CurryWithDefault = curry(function withDefault<TSuccess, TResult, TError = Error>(
  defaultValue: TResult,
  remoteData: RemoteData<TSuccess, TError>,
) {
  return isSuccess(remoteData) ? remoteData.value : defaultValue;
});

interface CurriedWhen {
  <TSuccess, TError, TResult>(
    pattern: Pattern<TSuccess, TError, TResult>,
    remoteData: RemoteData<TSuccess, TError>,
  ): TResult;
  <TSuccess, TError, TResult>(
    pattern: Pattern<TSuccess, TError, TResult>,
  ): (remoteData: RemoteData<TSuccess, TError>) => TResult;
}

const when: CurriedWhen = curry(function when<TSuccess, TError, TResult>(
  pattern: Pattern<TSuccess, TError, TResult>,
  remoteData: RemoteData<TSuccess, TError>,
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
  <TSuccess, TError, TResult>(
    fn: (value: TSuccess) => TResult,
    remoteData: RemoteData<TSuccess, TError>,
  ): RemoteData<TResult, TError>;
  <TSuccess, TError, TResult>(
    fn: (value: TSuccess) => TResult,
  ): (remoteData: RemoteData<TSuccess, TError>) => RemoteData<TResult, TError>;
}

const map: CurriedMap = curry(function map<TSuccess, TError, TResult>(
  fn: (value: TSuccess) => TResult,
  remoteData: RemoteData<TSuccess, TError>,
) {
  return isSuccess(remoteData) ? success(fn(remoteData.value)) : remoteData;
});

interface CurriedAndThen {
  <TSuccess, TError, TResult>(
    fn: (value: TSuccess) => RemoteData<TResult, TError>,
    remoteData: RemoteData<TSuccess, TError>,
  ): RemoteData<TResult, TError>;
  <TSuccess, TError, TResult>(
    fn: (value: TSuccess) => RemoteData<TResult, TError>,
  ): (remoteData: RemoteData<TSuccess, TError>) => RemoteData<TResult, TError>;
}

const andThen: CurriedAndThen = curry(function andThen<TSuccess, TError, TResult>(
  fn: (value: TSuccess) => RemoteData<TResult, TError>,
  remoteData: RemoteData<TSuccess, TError>,
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
