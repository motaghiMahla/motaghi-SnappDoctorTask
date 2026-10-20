import type { ItemFilters as FilterValues } from "@/lib/items/types";
import { CategoryFilter } from "./category-filter";
import { filterControlClassName } from "./filter-styles";
import { PriceRangeFilter } from "./price-range-filter";
import { ResetFiltersButton } from "./reset-filters-button";
import { SearchFilter } from "./search-filter";
import { StatusFilter } from "./status-filter";

type ItemFiltersProps = {
  filters: FilterValues;
  categories: readonly string[];
  onChange: (changes: Partial<FilterValues>) => void;
  onReset: () => void;
};

export function ItemFilters({
  filters,
  categories,
  onChange,
  onReset,
}: ItemFiltersProps) {
  return (
    <form
      role="search"
      aria-label="Filter items"
      onSubmit={(event) => event.preventDefault()}
      onReset={(event) => {
        event.preventDefault();
        onReset();
      }}
      className="mb-6 grid gap-4 rounded-2xl border border-border bg-surface p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4"
    >
      <SearchFilter
        value={filters.search}
        onChange={(search) => onChange({ search })}
      />
      <CategoryFilter
        value={filters.category}
        categories={categories}
        onChange={(category) => onChange({ category })}
      />
      <StatusFilter
        value={filters.status}
        onChange={(status) => onChange({ status })}
      />
      <PriceRangeFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onChange={onChange}
        inputClassName={filterControlClassName}
      />
      <div className="flex items-end sm:col-span-2">
        <ResetFiltersButton />
      </div>
    </form>
  );
}
