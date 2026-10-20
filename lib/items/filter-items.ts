import type { Item, ItemFilters } from "./types";

export function filterItems(
  items: readonly Item[],
  filters: Readonly<ItemFilters>,
): Item[] {
  const normalizedSearch = filters.search.trim().toLowerCase();

  const hasSearch = normalizedSearch.length > 0;
  const hasCategory = filters.category.length > 0;
  const hasMinPrice = filters.minPrice !== null;
  const hasMaxPrice = filters.maxPrice !== null;
  const hasStatus = filters.status.length > 0;

  return items.filter((item) => {
    if (
      hasSearch &&
      !item.name.toLowerCase().includes(normalizedSearch)
    ) {
      return false;
    }

    if (hasCategory && item.category !== filters.category) {
      return false;
    }

    if (hasMinPrice && item.price < filters.minPrice!) {
      return false;
    }

    if (hasMaxPrice && item.price > filters.maxPrice!) {
      return false;
    }

    if (hasStatus && item.status !== filters.status) {
      return false;
    }

    return true;
  });
}