# ts-unions

TypeScript union types for Maybe and RemoteData with pattern matching.

[![npm version](https://badge.fury.io/js/ts-unions.svg)](https://badge.fury.io/js/ts-unions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @mvst-gmbh/ts-unions
```

## Usage

### Maybe Type

The `Maybe` type represents a value that might or might not exist. It's useful for handling 
nullable values in a type-safe way.

```typescript
import { Maybe, just, nothing, when } from "@mvst-gmbh/ts-unions";

// Creating Maybe values
const someValue: Maybe<number> = just(42);
const noValue: Maybe<number> = nothing();

// Pattern matching
const result = when(someValue, {
  just: (value) => `Value is ${value}`,
  nothing: () => "No value"
});

// Transforming values
const doubled = map((x) => x * 2, someValue);
```

#### Maybe API

- `just<T>(value: T): Maybe<T>` - Creates a Maybe with a value
- `nothing<T>(): Maybe<T>` - Creates a Maybe without a value
- `when<T, R>(maybe: Maybe<T>, pattern: { just?: (value: T) => R, nothing?: () => R, _?: () => R }): R` - Pattern matching
- `map<T, R>(fn: (value: T) => R, maybe: Maybe<T>): Maybe<R>` - Transform the value if it exists
- `andThen<T, R>(fn: (value: T) => Maybe<R>, maybe: Maybe<T>): Maybe<R>` - Chain Maybe operations
- `isJust<T>(maybe: Maybe<T>): boolean` - Check if Maybe has a value
- `isNothing<T>(maybe: Maybe<T>): boolean` - Check if Maybe has no value

### RemoteData Type

The `RemoteData` type represents the state of a remote data operation. It's perfect for 
handling API calls and async operations.

```typescript
import { RemoteData, notAsked, loading, success, error, when } from "@mvst-gmbh/ts-unions";

// Creating RemoteData values
const data: RemoteData<string> = notAsked();
const loadingData: RemoteData<string> = loading();
const successData: RemoteData<string> = success("Data loaded");
const errorData: RemoteData<string> = error(new Error("Failed to load"));

// Pattern matching
const result = when(data, {
  notAsked: () => "Not started",
  loading: () => "Loading...",
  success: (value) => `Data: ${value}`,
  error: (err) => `Error: ${err.message}`
});

// Transforming values
const transformed = map((value) => value.toUpperCase(), successData);
```

#### RemoteData API

- `notAsked<T>(): RemoteData<T>` - Initial state
- `loading<T>(): RemoteData<T>` - Loading state
- `success<T>(value: T): RemoteData<T>` - Success state with value
- `error<T>(error: Error): RemoteData<T>` - Error state with error
- `when<T, R>(data: RemoteData<T>, pattern: { notAsked?: () => R, loading?: () => R, success?: (value: T) => R, error?: (error: Error) => R, _?: () => R }): R` - Pattern matching
- `map<T, R>(fn: (value: T) => R, data: RemoteData<T>): RemoteData<R>` - Transform success value
- `andThen<T, R>(fn: (value: T) => RemoteData<R>, data: RemoteData<T>): RemoteData<R>` - Chain RemoteData operations
- `isNotAsked<T>(data: RemoteData<T>): boolean` - Check if not asked
- `isLoading<T>(data: RemoteData<T>): boolean` - Check if loading
- `isSuccess<T>(data: RemoteData<T>): boolean` - Check if success
- `isError<T>(data: RemoteData<T>): boolean` - Check if error

## Type Safety

Both `Maybe` and `RemoteData` are implemented as discriminated unions, providing full type safety 
and exhaustive pattern matching. TypeScript will ensure you handle all possible cases when using 
pattern matching.

All the values are immutable, meaning that operations like `map` and `andThen` return new instances
instead of modifying the original value. Also, the library is designed to be tree-shakable and the
values are serializable.

## Contributing

Please read [CONTRIBUTORS.md](CONTRIBUTORS.md) for details on our code of conduct and the process 
for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 
