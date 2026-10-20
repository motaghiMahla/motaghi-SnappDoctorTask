import type { ItemFilters } from "@/lib/items/types";

type PriceRange = Pick<ItemFilters, "minPrice" | "maxPrice">;
type PriceRangeFilterProps = PriceRange & {
  onChange: (changes: Partial<PriceRange>) => void;
  inputClassName: string;
};

export function PriceRangeFilter({
  minPrice,
  maxPrice,
  onChange,
  inputClassName,
}: PriceRangeFilterProps) {
  return (
    <>
      <label className="text-sm font-medium">
        Minimum price (USD)
        <input
          type="number"
          name="minPrice"
          step="any"
          placeholder="No minimum"
          value={minPrice ?? ""}
          onChange={(event) => {
            const value = event.target.valueAsNumber;
            onChange({
              minPrice: Number.isFinite(value) ? value : null,
            });
          }}
          className={inputClassName}
        />
      </label>
      <label className="text-sm font-medium">
        Maximum price (USD)
        <input
          type="number"
          name="maxPrice"
          step="any"
          placeholder="No maximum"
          value={maxPrice ?? ""}
          onChange={(event) => {
            const value = event.target.valueAsNumber;
            onChange({
              maxPrice: Number.isFinite(value) ? value : null,
            });
          }}
          className={inputClassName}
        />
      </label>
    </>
  );
}
