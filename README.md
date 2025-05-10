# ts-unions

TypeScript union types for Maybe and RemoteData with pattern matching.

[![npm version](https://img.shields.io/npm/v/@mvst/ts-unions)](https://www.npmjs.com/package/@mvst/ts-unions)
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
- All the functions in the libray are curries, which means they can be parially applied.

## Currying and Composition

This makes it easy to create reusable functions and compose them together. The library also provides `compose` and `pipe` utilities to help with function composition, although you might already have access to similar functions if you're using any functional programming library.

### Currying Examples

#### Maybe

```typescript
import { Maybe, M } from "@mvst/ts-unions";

// Create reusable functions by partially applying map
const double = M.map((x: number) => x * 2);
const addOne = M.map((x: number) => x + 1);

// Use them with different Maybe values
const value1 = M.just(42);
const value2 = M.just(10);

const doubled1 = double(value1); // Just(84)
const doubled2 = double(value2); // Just(20)

// Compose functions using pipe
const doubleAndAddOne = pipe(double, addOne);
const result = doubleAndAddOne(value1); // Just(85)
```

#### RemoteData

```typescript
import { RemoteData, RD } from "@mvst/ts-unions";

// Create reusable functions by partially applying map
const format = RD.map((value: string) => value.toUpperCase());
const addTimestamp = RD.map((value: string) => `${value} (${new Date().toISOString()})`);

// Use them with different RemoteData values
const data = RD.success("Hello");

const formatted = format(data); // Success("HELLO")

// Compose functions using pipe
const formatAndAddTimestamp = pipe(format, addTimestamp);
const result = formatAndAddTimestamp(data1); // Success("HELLO (2024-03-21T12:00:00.000Z)")
```

The ability to curry functions and compose them together makes it easy to create reusable transformations that can be applied to any Maybe or RemoteData value. This is particularly useful when you have a set of common transformations that you want to apply in different combinations.

For example, you might have a set of validation functions that you want to apply to user input:

```typescript
import { Maybe, M } from "@mvst/ts-unions";

const validateEmail = (email: string): Maybe<string> => 
  email.includes('@') ? M.just(email) : M.nothing();

const validatePassword = (password: string): Maybe<string> =>
  password.length >= 8 ? M.just(password) : M.nothing();

// Compose validation functions
const validateUserInput = pipe(
  validateEmail,
  M.andThen(validatePassword)
);

const result = validateUserInput("user@example.com"); // Just("user@example.com")
const invalid = validateUserInput("invalid"); // Nothing
```

## Contributing

Please read [CONTRIBUTORS.md](CONTRIBUTORS.md) for details on our code of conduct and the process 
for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 
