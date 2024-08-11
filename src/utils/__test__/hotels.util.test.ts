import { describe, expect, it } from "vitest";
import { mergeNotes } from "../hotels.util";

describe("Hotels Service", () => {
  describe("mergeNotes", () => {
    it("should return empty array if existingNotes and newNotes is null or undefined", () => {
      const mockExistingNotes = undefined;
      const mockNewNotes = undefined;
      const result = mergeNotes(mockExistingNotes, mockNewNotes);
      expect(result).toEqual([]);
    });
    it("should return newNotes if existingNotes is null or undefined", () => {
      const mockExistingNotes = undefined;
      const mockNewNotes = ["note1", "note2"];
      const result = mergeNotes(mockExistingNotes, mockNewNotes);
      expect(result).toEqual(mockNewNotes);
    });
    it("should return existingNotes if newNotes is null or undefined", () => {
      const mockExistingNotes = ["note1", "note2"];
      const mockNewNotes = undefined;
      const result = mergeNotes(mockExistingNotes, mockNewNotes);
      expect(result).toEqual(mockExistingNotes);
    });
  });
});
