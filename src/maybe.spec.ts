import * as M from "./maybe";
import { describe, it, expect } from "vitest";

describe("Maybe", () => {
  describe("constructors", () => {
    it("should create a Just value", () => {
      const value = M.just(42);
      expect(value).toEqual({ type: "Just", value: 42 });
    });

    it("should create a Nothing value", () => {
      const value = M.nothing<number>();
      expect(value).toEqual({ type: "Nothing" });
    });

    it("should create values using M namespace", () => {
      expect(M.just(42)).toEqual({ type: "Just", value: 42 });
      expect(M.nothing<number>()).toEqual({ type: "Nothing" });
    });
  });

  describe("when", () => {
    it("should handle Just case", () => {
      const value = M.just(42);
      const result = M.when({ just: (x) => x * 2, nothing: () => 0 }, value);

      expect(result).toBe(84);
    });

    it("should handle Nothing case", () => {
      const value = M.nothing<number>();
      const result = M.when({ just: (x) => x * 2, nothing: () => 0 }, value);

      expect(result).toBe(0);
    });

    it("should use fallback case if provided", () => {
      const value = M.just(42);
      const result = M.when({ just: (x) => x * 2, nothing: () => 0, _: () => -1 }, value);

      expect(result).toBe(84);
    });
  });

  describe("map", () => {
    it("should transform Just value", () => {
      const value = M.just(42);
      const result = M.map((x) => x * 2, value);

      expect(result).toEqual({ type: "Just", value: 84 });
    });

    it("should preserve Nothing", () => {
      const value = M.nothing<number>();
      const result = M.map((x) => x * 2, value);

      expect(result).toEqual({ type: "Nothing" });
    });
  });

  describe("andThen", () => {
    it("should chain Just values", () => {
      const value = M.just(42);
      const result = M.andThen((x) => M.just(x * 2), value);

      expect(result).toEqual({ type: "Just", value: 84 });
    });

    it("should handle Nothing in chain", () => {
      const value = M.nothing<number>();
      const result = M.andThen((x) => M.just(x * 2), value);

      expect(result).toEqual({ type: "Nothing" });
    });

    it("should handle Nothing from chained function", () => {
      const value = M.just(42);
      const result = M.andThen(() => M.nothing(), value);

      expect(result).toEqual({ type: "Nothing" });
    });
  });

  describe("withDefault", () => {
    it("should return the value when Maybe is Just", () => {
      const value = M.just(42);
      const result = M.withDefault(0, value);

      expect(result).toBe(42);
    });

    it("should return the default value when Maybe is Nothing", () => {
      const value = M.nothing<number>();
      const result = M.withDefault(0, value);

      expect(result).toBe(0);
    });

    it("should work with different types", () => {
      const value = M.nothing<number>();
      const result = M.withDefault("default", value);

      expect(result).toBe("default");
    });
  });

  describe("curried functions", () => {
    describe("map", () => {
      it("should work with partial application", () => {
        const double = M.map((x: number) => x * 2);
        const value = M.just(42);
        const result = double(value);

        expect(result).toEqual({ type: "Just", value: 84 });
      });

      it("should work with full application", () => {
        const value = M.just(42);
        const result = M.map((x: number) => x * 2, value);

        expect(result).toEqual({ type: "Just", value: 84 });
      });
    });

    describe("andThen", () => {
      it("should work with partial application", () => {
        const double = M.andThen((x: number) => M.just(x * 2));
        const value = M.just(42);
        const result = double(value);

        expect(result).toEqual({ type: "Just", value: 84 });
      });

      it("should work with full application", () => {
        const value = M.just(42);
        const result = M.andThen((x: number) => M.just(x * 2), value);

        expect(result).toEqual({ type: "Just", value: 84 });
      });
    });

    describe("when", () => {
      it("should work with partial application", () => {
        const pattern = {
          just: (x: number) => x * 2,
          nothing: () => 0,
        };
        const matcher = M.when(pattern);
        const value = M.just(42);
        const result = matcher(value);

        expect(result).toBe(84);
      });

      it("should work with full application", () => {
        const pattern = {
          just: (x: number) => x * 2,
          nothing: () => 0,
        };
        const value = M.just(42);
        const result = M.when(pattern, value);

        expect(result).toBe(84);
      });
    });

    describe("withDefault", () => {
      it("should work with partial application", () => {
        const withZero = M.withDefault(0);
        const value = M.just(42);
        const result = withZero(value);

        expect(result).toBe(42);
      });

      it("should work with full application", () => {
        const value = M.just(42);
        const result = M.withDefault(0, value);

        expect(result).toBe(42);
      });
    });
  });
});
