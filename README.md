# ts-unions

TypeScript union types for Maybe and RemoteData with pattern matching.

[![npm version](https://badge.fury.io/js/ts-unions.svg)](https://badge.fury.io/js/ts-unions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @mvst/ts-unions
```

## Usage

### Maybe Type

The `Maybe` type represents a value that might or might not exist. It's useful for handling 
nullable values in a type-safe way.

```typescript
import { Maybe, M } from "@mvst/ts-unions";

// Creating Maybe values
const someValue: Maybe<number> = M.just(42);
const noValue: Maybe<number> = M.nothing();

// Pattern matching
M.when(someValue, {
  just: (value) => `Value is ${value}`,
  nothing: () => "No value"
});

M.when(someValue, {
  _: () => "This is the fallack case"
});


// Transforming values
const doubled: Maybe<number> = M.map((x) => x * 2, someValue);

// Chaining operations
const chained: Maybe<number> = M.andThen((x) => M.just(x + 1), someValue);

// Unwrapping values
const value: number = M.withDefault(0, someValue); // Unwraps the value or returns 0 if nothing
```

#### Maybe API

- `M.just(value: T): Maybe<T>` - Creates a Maybe with a value
- `M.nothing(): Maybe<T>` - Creates a Maybe without a value
- `M.when(pattern: Pattern , maybe: Maybe<T>): R` - Pattern matching
- `M.map(fn: (value: T) => R, maybe: Maybe<T>): Maybe<R>` - Transform the value if it exists
- `M.andThen(fn: (value: T) => Maybe<R>, maybe: Maybe<T>): Maybe<R>` - Chain Maybe operations
- `M.isJust(maybe: Maybe<T>): boolean` - Check if Maybe has a value
- `M.isNothing(maybe: Maybe<T>): boolean` - Check if Maybe has no value

### RemoteData Type

The `RemoteData` type represents the state of a remote data operation. It's perfect for 
handling API calls and async operations.

```typescript
import { RemoteData, RD } from "@mvst/ts-unions";

// Creating RemoteData values
const data: RemoteData<string> = RD.notAsked();
const loadingData: RemoteData<string> = RD.loading();
const successData: RemoteData<string> = RD.success("Data loaded");
const errorData: RemoteData<string> = RD.error(new Error("Failed to load"));

// Pattern matching
RD.when(data, {
  notAsked: () => "Not started",
  loading: () => "Loading...",
  success: (value) => `Data: ${value}`,
  error: (err) => `Error: ${err.message}`
});

RD.when(data, {
  success: (value) => `Data: ${value}`,
  _: () => "This is the fallback case, all other cases are handled here"
});

// Transforming values
const transformed = RD.map((value) => value.toUpperCase(), successData);

// Chaining operations
const chained = RD.andThen((value) => RD.success(value + "!!!"), successData);

// Unwrapping values
const unwrapped = RD.withDefault("No data", successData); // Unwraps the value or returns "No data" if not success
```

#### RemoteData API

- `RD.notAsked(): RemoteData<T>` - Initial state
- `RD.loading(): RemoteData<T>` - Loading state
- `RD.success(value: T): RemoteData<T>` - Success state with value
- `RD.error(error: Error): RemoteData<T>` - Error state with error
- `RD.when(pattern: Pattern, data: RemoteData<T>): R` - Pattern matching
- `RD.map(fn: (value: T) => R, data: RemoteData<T>): RemoteData<R>` - Transform success value
- `RD.andThen(fn: (value: T) => RemoteData<R>, data: RemoteData<T>): RemoteData<R>` - Chain RemoteData operations
- `RD.isNotAsked(data: RemoteData<T>): boolean` - Check if not asked
- `RD.isLoading(data: RemoteData<T>): boolean` - Check if loading
- `RD.isSuccess(data: RemoteData<T>): boolean` - Check if success
- `RD.isError(data: RemoteData<T>): boolean` - Check if error

## Features

- All the values are immutable, meaning that operations like `map` and `andThen` return new instances
instead of modifying the original value. 
- The library is designed to be tree-shakable
- All the values are serializable, meaning that you can easily convert them to JSON and back.

## Contributing

Please read [CONTRIBUTORS.md](CONTRIBUTORS.md) for details on our code of conduct and the process 
for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 
