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
      const result = M.when(value, { just: (x) => x * 2, nothing: () => 0 });

      expect(result).toBe(84);
    });

    it("should handle Nothing case", () => {
      const value = M.nothing<number>();
      const result = M.when(value, { just: (x) => x * 2, nothing: () => 0 });

      expect(result).toBe(0);
    });

    it("should use fallback case if provided", () => {
      const value = M.just(42);
      const result = M.when(value, { just: (x) => x * 2, nothing: () => 0, _: () => -1 });

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
});
