import type { ItemFilters as FilterValues } from "@/lib/items/types";
import { PriceRangeFilter } from "./price-range-filter";



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
      <label className="text-sm font-medium sm:col-span-2">
        Search by name
        <input
          type="search"
          name="search"
          placeholder="Search items…"
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          className={"mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-base text-foreground placeholder:text-muted focus:border-primary focus:outline-2 focus:outline-primary"}
        />
      </label>
      <label className="text-sm font-medium">
        Category
        <select
          name="category"
          value={filters.category}
          onChange={(event) => onChange({ category: event.target.value })}
          className={"mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-base text-foreground placeholder:text-muted focus:border-primary focus:outline-2 focus:outline-primary"}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </label>
      <label className="text-sm font-medium">
        Status
        <select
          name="status"
          value={filters.status}
          onChange={(event) => {
            const status = event.target.value;
            if (status === "" || status === "active" || status === "inactive") {
              onChange({ status });
            }
          }}
          className={"mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-base text-foreground placeholder:text-muted focus:border-primary focus:outline-2 focus:outline-primary"}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </label>
      <PriceRangeFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onChange={onChange}
        inputClassName={"mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-base text-foreground placeholder:text-muted focus:border-primary focus:outline-2 focus:outline-primary"}
      />
      <div className="flex items-end sm:col-span-2">
        <button
          type="reset"
          className="rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-medium text-white hover:border-primary-hover hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Reset Filters
        </button>
      </div>
    </form>
  );
}
