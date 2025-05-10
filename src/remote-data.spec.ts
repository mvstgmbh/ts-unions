import { describe, it, expect } from "vitest";
import * as RD from "./remote-data";

describe("RemoteData", () => {
  describe("constructors", () => {
    it("should create a NotAsked value", () => {
      const value = RD.notAsked<number>();
      expect(value).toEqual({ type: "NotAsked" });
    });

    it("should create a Loading value", () => {
      const value = RD.loading<number>();
      expect(value).toEqual({ type: "Loading" });
    });

    it("should create a Success value", () => {
      const value = RD.success(42);
      expect(value).toEqual({ type: "Success", value: 42 });
    });

    it("should create an Error value", () => {
      const err = new Error("test");
      const value = RD.error<number>(err);
      expect(value).toEqual({ type: "Error", error: err });
    });

    it("should create values using RD namespace", () => {
      expect(RD.notAsked<number>()).toEqual({ type: "NotAsked" });
      expect(RD.loading<number>()).toEqual({ type: "Loading" });
      expect(RD.success(42)).toEqual({ type: "Success", value: 42 });
      expect(RD.error(new Error("test"))).toEqual({ type: "Error", error: new Error("test") });
    });
  });

  describe("when", () => {
    it("should handle NotAsked case", () => {
      const value = RD.notAsked<number>();
      const result = RD.when(
        {
          notAsked: () => "NotAsked",
          loading: () => "Loading",
          success: () => "Success",
          error: () => "Error",
        },
        value,
      );
      expect(result).toBe("NotAsked");
    });

    it("should handle Loading case", () => {
      const value = RD.loading<number>();
      const result = RD.when(
        {
          notAsked: () => "NotAsked",
          loading: () => "Loading",
          success: () => "Success",
          error: () => "Error",
        },
        value,
      );
      expect(result).toBe("Loading");
    });

    it("should handle Success case", () => {
      const value = RD.success(42);
      const result = RD.when(
        {
          notAsked: () => "NotAsked",
          loading: () => "Loading",
          success: (x) => `Success: ${x}`,
          error: () => "Error",
        },
        value,
      );
      expect(result).toBe("Success: 42");
    });

    it("should handle Error case", () => {
      const err = new Error("test");
      const value = RD.error<number>(err);
      const result = RD.when(
        {
          notAsked: () => "NotAsked",
          loading: () => "Loading",
          success: () => "Success",
          error: (e) => `Error: ${e.message}`,
        },
        value,
      );
      expect(result).toBe("Error: test");
    });

    it("should use fallback case if provided", () => {
      const value = RD.success(42);
      const result = RD.when(
        {
          notAsked: () => "NotAsked",
          loading: () => "Loading",
          success: (x) => `Success: ${x}`,
          error: () => "Error",
          _: () => "Fallback",
        },
        value,
      );
      expect(result).toBe("Success: 42");
    });
  });

  describe("map", () => {
    it("should transform Success value", () => {
      const value = RD.success(42);
      const result = RD.map((x) => x * 2, value);

      expect(result).toEqual({ type: "Success", value: 84 });
    });

    it("should preserve NotAsked", () => {
      const value = RD.notAsked<number>();
      const result = RD.map((x) => x * 2, value);
      expect(result).toEqual({ type: "NotAsked" });
    });

    it("should preserve Loading", () => {
      const value = RD.loading<number>();
      const result = RD.map((x) => x * 2, value);
      expect(result).toEqual({ type: "Loading" });
    });

    it("should preserve Error", () => {
      const err = new Error("test");
      const value = RD.error<number>(err);
      const result = RD.map((x) => x * 2, value);
      expect(result).toEqual({ type: "Error", error: err });
    });
  });

  describe("andThen", () => {
    it("should chain Success values", () => {
      const value = RD.success(42);
      const result = RD.andThen((x) => RD.success(x * 2), value);

      expect(result).toEqual({ type: "Success", value: 84 });
    });

    it("should handle NotAsked in chain", () => {
      const value = RD.notAsked<number>();
      const result = RD.andThen((x) => RD.success(x * 2), value);

      expect(result).toEqual({ type: "NotAsked" });
    });

    it("should handle Loading in chain", () => {
      const value = RD.loading<number>();
      const result = RD.andThen((x) => RD.success(x * 2), value);

      expect(result).toEqual({ type: "Loading" });
    });

    it("should handle Error in chain", () => {
      const err = new Error("test");
      const value = RD.error<number>(err);
      const result = RD.andThen((x) => RD.success(x * 2), value);

      expect(result).toEqual({ type: "Error", error: err });
    });

    it("should handle NotAsked from chained function", () => {
      const value = RD.success(42);
      const result = RD.andThen(() => RD.notAsked<number>(), value);

      expect(result).toEqual({ type: "NotAsked" });
    });

    it("should handle Loading from chained function", () => {
      const value = RD.success(42);
      const result = RD.andThen(() => RD.loading<number>(), value);

      expect(result).toEqual({ type: "Loading" });
    });

    it("should handle Error from chained function", () => {
      const value = RD.success(42);
      const err = new Error("test");
      const result = RD.andThen(() => RD.error<number>(err), value);

      expect(result).toEqual({ type: "Error", error: err });
    });
  });

  describe("withDefault", () => {
    it("should return the value when RemoteData is Success", () => {
      const value = RD.success(42);
      const result = RD.withDefault(0, value);

      expect(result).toBe(42);
    });

    it("should return the default value when RemoteData is NotAsked", () => {
      const value = RD.notAsked<number>();
      const result = RD.withDefault(0, value);

      expect(result).toBe(0);
    });

    it("should return the default value when RemoteData is Loading", () => {
      const value = RD.loading<number>();
      const result = RD.withDefault(0, value);

      expect(result).toBe(0);
    });

    it("should return the default value when RemoteData is Error", () => {
      const err = new Error("test");
      const value = RD.error<number>(err);
      const result = RD.withDefault(0, value);

      expect(result).toBe(0);
    });
  });

  describe("curried functions", () => {
    describe("map", () => {
      it("should work with partial application", () => {
        const double = RD.map((x: number) => x * 2);
        const value = RD.success(42);
        const result = double(value);

        expect(result).toEqual({ type: "Success", value: 84 });
      });

      it("should work with full application", () => {
        const value = RD.success(42);
        const result = RD.map((x) => x * 2, value);

        expect(result).toEqual({ type: "Success", value: 84 });
      });
    });

    describe("andThen", () => {
      it("should work with partial application", () => {
        const value = RD.success(42);
        const double = RD.andThen((x: number) => RD.success(x * 2));
        const result = double(value);

        expect(result).toEqual({ type: "Success", value: 84 });
      });

      it("should work with full application", () => {
        const value = RD.success(42);
        const result = RD.andThen((x) => RD.success(x * 2), value);

        expect(result).toEqual({ type: "Success", value: 84 });
      });
    });

    describe("when", () => {
      it("should work with partial application", () => {
        const pattern = {
          notAsked: () => "NotAsked",
          loading: () => "Loading",
          success: (x: number) => `Success: ${x}`,
          error: (e: Error) => `Error: ${e.message}`,
        };
        const matcher = RD.when(pattern);
        const value = RD.success(42);
        const result = matcher(value);

        expect(result).toBe("Success: 42");
      });

      it("should work with full application", () => {
        const pattern = {
          notAsked: () => "NotAsked",
          loading: () => "Loading",
          success: (x: number) => `Success: ${x}`,
          error: (e: Error) => `Error: ${e.message}`,
        };
        const value = RD.success(42);
        const result = RD.when(pattern, value);

        expect(result).toBe("Success: 42");
      });
    });

    describe("withDefault", () => {
      it("should work with partial application", () => {
        const withZero = RD.withDefault(1);
        const value = RD.success(42);
        const result = withZero(value);

        expect(result).toBe(42);
      });

      it("should work with full application", () => {
        const value = RD.success(42);
        const result = RD.withDefault(0, value);

        expect(result).toBe(42);
      });
    });
  });
});
