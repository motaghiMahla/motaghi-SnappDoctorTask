import type { Item } from "./types";

const CATEGORIES = [
  "Electronics",
  "Books",
  "Clothing",
  "Home",
  "Sports",
] as const;

export function generateItems(count: number): Item[] {
  return Array.from({ length: count }, (_, index): Item => {
    const id = index + 1;

    return {
      id,
      name: `Item ${id}`,
      category: CATEGORIES[index % CATEGORIES.length],
      price: 100 + ((index * 37) % 9900),
      status: index % 3 === 0 ? "inactive" : "active",
    };
  });
}