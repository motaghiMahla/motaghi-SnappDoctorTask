import { useEffect, useRef, useState } from "react";
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
  const minInput = useRef<HTMLInputElement>(null);
  const maxInput = useRef<HTMLInputElement>(null);
  const [invalid, setInvalid] = useState({ minPrice: false, maxPrice: false });

  useEffect(() => {
    const form = minInput.current?.form;
    const resetValidation = () => {
      setInvalid({ minPrice: false, maxPrice: false });
      // Clear native invalid drafts even when the active constraint was already null.
      if (minInput.current) minInput.current.value = "";
      if (maxInput.current) maxInput.current.value = "";
    };
    form?.addEventListener("reset", resetValidation);
    return () => form?.removeEventListener("reset", resetValidation);
  }, []);

  function changePrice(field: keyof PriceRange, input: HTMLInputElement) {
    const isInvalid = input.validity.badInput ||
      (input.value !== "" && !Number.isFinite(input.valueAsNumber));
    setInvalid((current) => ({ ...current, [field]: isInvalid }));
    if (!isInvalid) {
      onChange({ [field]: input.value === "" ? null : input.valueAsNumber });
    }
  }

  return (
    <>
      <label className="text-sm font-medium">
        Minimum price (USD)
        <input
          ref={minInput}
          type="number"
          name="minPrice"
          step="any"
          placeholder="No minimum"
          value={invalid.minPrice ? "" : minPrice ?? ""}
          onInput={(event) => changePrice("minPrice", event.currentTarget)}
          aria-invalid={invalid.minPrice || undefined}
          aria-describedby={invalid.minPrice ? "min-price-error" : undefined}
          className={inputClassName}
        />
        {invalid.minPrice && (
          <span id="min-price-error" role="alert" className="mt-1 block text-xs text-red-700">
            Enter a valid number. The price filter is unchanged.
          </span>
        )}
      </label>
      <label className="text-sm font-medium">
        Maximum price (USD)
        <input
          ref={maxInput}
          type="number"
          name="maxPrice"
          step="any"
          placeholder="No maximum"
          value={invalid.maxPrice ? "" : maxPrice ?? ""}
          onInput={(event) => changePrice("maxPrice", event.currentTarget)}
          aria-invalid={invalid.maxPrice || undefined}
          aria-describedby={invalid.maxPrice ? "max-price-error" : undefined}
          className={inputClassName}
        />
        {invalid.maxPrice && (
          <span id="max-price-error" role="alert" className="mt-1 block text-xs text-red-700">
            Enter a valid number. The price filter is unchanged.
          </span>
        )}
      </label>
    </>
  );
}
