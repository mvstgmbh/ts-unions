# ts-unions

A TypeScript library providing Maybe and RemoteData union types with pattern matching, functor, and monad implementations.

## Installation

```bash
npm install ts-unions
```

## Maybe

The Maybe type represents an optional value. It can be either `Just` containing a value or `Nothing`.

### Usage

```typescript
import { M } from 'ts-unions';

// Creating Maybe values
const justValue = M.just(42);
const nothing = M.nothing<number>();

// Pattern matching
const result = M.when(justValue, {
  just: (value) => `Got value: ${value}`,
  nothing: () => 'No value',
});

// Using map (functor)
const doubled = M.map(justValue, (x) => x * 2);

// Using chain (monad)
const chained = M.chain(justValue, (x) => M.just(x * 2));

// Chaining multiple operations
const result = M.chain(
  M.map(justValue, (x) => x * 2),
  (x) => M.just(x + 1)
);
```

## RemoteData

The RemoteData type represents the state of a remote data request. It can be one of:
- `NotAsked`: Initial state
- `Loading`: Request in progress
- `Success`: Request succeeded with data
- `Error`: Request failed with an error

### Usage

```typescript
import { RD } from 'ts-unions';

// Creating RemoteData values
const notAsked = RD.notAsked<number>();
const loading = RD.loading<number>();
const success = RD.success(42);
const error = RD.error(new Error('Failed'));

// Pattern matching
const result = RD.when(success, {
  notAsked: () => 'Not started',
  loading: () => 'Loading...',
  success: (value) => `Got value: ${value}`,
  error: (err) => `Error: ${err.message}`,
});

// Using map (functor)
const doubled = RD.map(success, (x) => x * 2);

// Using chain (monad)
const chained = RD.chain(success, (x) => RD.success(x * 2));

// Chaining multiple operations
const result = RD.chain(
  RD.map(success, (x) => x * 2),
  (x) => RD.success(x + 1)
);

// Handling API calls
async function fetchUser(id: number): Promise<RemoteData<User, Error>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      return RD.error(new Error('Failed to fetch user'));
    }
    const user = await response.json();
    return RD.success(user);
  } catch (err) {
    return RD.error(err instanceof Error ? err : new Error('Unknown error'));
  }
}
```

## Type Safety

Both Maybe and RemoteData are fully type-safe. TypeScript will ensure you handle all possible cases 
in pattern matching and maintain type safety throughout your transformations.

## API Reference

### Maybe

- `M.nothing<T>()`: Creates a Nothing value
- `M.just<T>(value: T)`: Creates a Just value
- `M.when<T, R>(maybe: Maybe<T>, pattern: MaybePattern<T, R>)`: Pattern matching
- `M.map<T, U>(maybe: Maybe<T>, fn: (value: T) => U)`: Functor implementation
- `M.chain<T, U>(maybe: Maybe<T>, fn: (value: T) => Maybe<U>)`: Monad implementation

### RemoteData

- `RD.notAsked<T, E>()`: Creates a NotAsked value
- `RD.loading<T, E>()`: Creates a Loading value
- `RD.success<T, E>(value: T)`: Creates a Success value
- `RD.error<T, E>(error: E)`: Creates an Error value
- `RD.when<T, E, R>(remoteData: RemoteData<T, E>, pattern: RemoteDataPattern<T, E, R>)`: Pattern matching
- `RD.map<T, U, E>(remoteData: RemoteData<T, E>, fn: (value: T) => U)`: Functor implementation
- `RD.chain<T, U, E>(remoteData: RemoteData<T, E>, fn: (value: T) => RemoteData<U, E>)`: Monad implementation

## License

MIT 
