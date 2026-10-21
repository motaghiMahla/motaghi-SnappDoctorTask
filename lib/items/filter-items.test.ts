import { describe, expect, it } from "@jest/globals";
import { filterItems } from "./filter-items";
import type { Item, ItemFilters } from "./types";


const items: readonly Item[] = Object.freeze(
  ([
    { id: 1, name: "Alpha Phone", category: "electronics", price: 100, status: "active" },
    { id: 2, name: "ALPHA Tablet", category: "electronics", price: 200, status: "inactive" },
    { id: 3, name: "Beta Phone", category: "electronics", price: 175, status: "active" },
    { id: 4, name: "Alpha Desk", category: "furniture", price: 200, status: "active" },
    { id: 5, name: "Cedar Chair", category: "furniture", price: 100, status: "inactive" },
    { id: 6, name: "alpha Lamp", category: "electronics", price: 150, status: "active" },
    { id: 7, name: "Delta Book", category: "books", price: 0, status: "inactive" },
    { id: 8, name: "Omega Desk", category: "furniture", price: 300, status: "active" },
  ] satisfies Item[]).map((item) => Object.freeze(item)),
);

const defaultFilters: Readonly<ItemFilters> = Object.freeze({
  search: "",
  category: "",
  minPrice: null,
  maxPrice: null,
  status: "",
});

describe("filterItems", () => {
  describe("search", () => {
    it.each<[description: string, search: string, expectedIds: number[]]>([
      ["matches names case-insensitively", "aLpHa", [1, 2, 4, 6]],
      ["matches part of a name", "phon", [1, 3]],
      ["trims leading and trailing whitespace", " \talpha \n", [1, 2, 4, 6]],
      ["returns no items for an unmatched query", "missing", []],
    ])("%s", (_description, search, expectedIds) => {
      const result = filterItems(items, { ...defaultFilters, search });

      expect(result.map((item) => item.id)).toEqual(expectedIds);
    });

    it.each(["", " \t\n"])(
      "returns all items for an empty or whitespace-only query (%j)",
      (search) => {
        expect(filterItems(items, { ...defaultFilters, search })).toEqual(items);
      },
    );
  });

  describe("category", () => {
    it("returns only items in the selected category", () => {
      const result = filterItems(items, {
        ...defaultFilters,
        category: "furniture",
      });

      expect(result.map((item) => item.id)).toEqual([4, 5, 8]);
    });

    it("allows all categories when category is empty", () => {
      expect(filterItems(items, { ...defaultFilters, category: "" })).toEqual(items);
    });
  });

  describe("price range", () => {
    it.each<[
      description: string,
      minPrice: number | null,
      maxPrice: number | null,
      expectedIds: number[],
    ]>([
      ["includes the minimum and disables a null maximum", 100, null, [1, 2, 3, 4, 5, 6, 8]],
      ["includes the maximum and disables a null minimum", null, 200, [1, 2, 3, 4, 5, 6, 7]],
      ["applies both bounds inclusively", 100, 200, [1, 2, 3, 4, 5, 6]],
      ["allows all prices when both bounds are null", null, null, [1, 2, 3, 4, 5, 6, 7, 8]],
      ["treats a zero maximum as an active bound", null, 0, [7]],
      ["includes prices equal to both bounds", 200, 200, [2, 4]],
      ["returns no items when the minimum exceeds the maximum", 200, 100, []],
    ])("%s", (_description, minPrice, maxPrice, expectedIds) => {
      const result = filterItems(items, {
        ...defaultFilters,
        minPrice,
        maxPrice,
      });

      expect(result.map((item) => item.id)).toEqual(expectedIds);
    });
  });

  it("preserves decimal precision and includes fractional price boundaries", () => {
    const decimalItems: Item[] = [100.24, 100.25, 100.75, 100.76].map((price, id) => ({
      id, name: `Item ${id}`, category: "electronics", price, status: "active",
    }));

    const result = filterItems(decimalItems, {
      ...defaultFilters,
      minPrice: 100.25,
      maxPrice: 100.75,
    });

    expect(result.map((item) => item.price)).toEqual([100.25, 100.75]);
  });

  describe("status", () => {
    it.each<{ status: ItemFilters["status"]; expectedIds: number[] }>([
      { status: "active", expectedIds: [1, 3, 4, 6, 8] },
      { status: "inactive", expectedIds: [2, 5, 7] },
      { status: "", expectedIds: [1, 2, 3, 4, 5, 6, 7, 8] },
    ])("filters by status '$status' (empty allows both)", ({ status, expectedIds }) => {
      const result = filterItems(items, { ...defaultFilters, status });

      expect(result.map((item) => item.id)).toEqual(expectedIds);
    });
  });

  describe("combined filters", () => {
    it.each<{
      description: string;
      filters: Partial<ItemFilters>;
      expectedIds: number[];
    }>([
      {
        description: "search and category",
        filters: { search: "alpha", category: "electronics" },
        expectedIds: [1, 2, 6],
      },
      {
        description: "category and price range",
        filters: { category: "electronics", minPrice: 150, maxPrice: 200 },
        expectedIds: [2, 3, 6],
      },
      {
        description: "category, price range, and status",
        filters: { category: "electronics", minPrice: 150, maxPrice: 200, status: "active" },
        expectedIds: [3, 6],
      },
      {
        description: "search, category, price range, and status",
        filters: { search: "alpha", category: "electronics", minPrice: 150, maxPrice: 200, status: "active" },
        expectedIds: [6],
      },
      {
        description: "conflicting search and category",
        filters: { search: "phone", category: "furniture" },
        expectedIds: [],
      },
    ])("uses AND logic for $description", ({ filters, expectedIds }) => {
      const result = filterItems(items, { ...defaultFilters, ...filters });

      expect(result.map((item) => item.id)).toEqual(expectedIds);
    });
  });

  describe("purity and edge cases", () => {
    it("leaves the input array, item objects, and filters unchanged", () => {
      const filters = Object.freeze({
        ...defaultFilters,
        search: "  ALPHA  ",
        category: "electronics",
        minPrice: 150,
        maxPrice: 200,
        status: "active" as const,
      });
      const originalItems = items.map((item) => ({ ...item }));
      const originalReferences = [...items];
      const originalFilters = { ...filters };

      expect(filterItems(items, filters).map((item) => item.id)).toEqual([6]);

      expect(items).toEqual(originalItems);
      items.forEach((item, index) => {
        expect(item).toBe(originalReferences[index]);
      });
      expect(filters).toEqual(originalFilters);
    });

    it("returns an empty result for an empty input array", () => {
      expect(filterItems([], defaultFilters)).toEqual([]);
    });

    it("preserves the input order of matching items", () => {
      const reorderedItems = [items[5], items[3], items[1], items[0], items[2]];
      const result = filterItems(reorderedItems, {
        ...defaultFilters,
        search: "alpha",
        category: "electronics",
      });

      expect(result.map((item) => item.id)).toEqual([6, 2, 1]);
    });
  });
});
