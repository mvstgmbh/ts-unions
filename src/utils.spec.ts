import { describe, it, expect } from "vitest";
import { compose, pipe } from "./utils";

describe("Utils", () => {
  describe("compose", () => {
    it("should compose functions from right to left", () => {
      const addOne = (x: number) => x + 1;
      const multiplyByTwo = (x: number) => x * 2;
      const square = (x: number) => x * x;

      const composed = compose(square, multiplyByTwo, addOne);
      expect(composed(2)).toBe(36); // (2 + 1) * 2 = 6, then 6 * 6 = 36
    });

    it("should work with a single function", () => {
      const addOne = (x: number) => x + 1;
      const composed = compose(addOne);
      expect(composed(2)).toBe(3);
    });

    it("should work with no functions", () => {
      const composed = compose();
      expect(composed(2)).toBe(2);
    });

    it("should work with string transformations", () => {
      const toUpperCase = (s: string) => s.toUpperCase();
      const addExclamation = (s: string) => s + "!";
      const addPrefix = (s: string) => "Hello " + s;

      const composed = compose(addExclamation, toUpperCase, addPrefix);
      expect(composed("world")).toBe("HELLO WORLD!");
    });
  });

  describe("pipe", () => {
    it("should pipe functions from left to right", () => {
      const addOne = (x: number) => x + 1;
      const multiplyByTwo = (x: number) => x * 2;
      const square = (x: number) => x * x;

      const piped = pipe(addOne, multiplyByTwo, square);
      expect(piped(2)).toBe(36); // (2 + 1) * 2 = 6, then 6 * 6 = 36
    });

    it("should work with a single function", () => {
      const addOne = (x: number) => x + 1;
      const piped = pipe(addOne);
      expect(piped(2)).toBe(3);
    });

    it("should work with no functions", () => {
      const piped = pipe();
      expect(piped(2)).toBe(2);
    });

    it("should work with string transformations", () => {
      const toUpperCase = (s: string) => s.toUpperCase();
      const addExclamation = (s: string) => s + "!";
      const addPrefix = (s: string) => "Hello " + s;

      const piped = pipe(addPrefix, toUpperCase, addExclamation);
      expect(piped("world")).toBe("HELLO WORLD!");
    });
  });
});

