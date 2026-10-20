"use client";

import { useMemo, useState } from "react";
import { ItemList } from "./item-list";
import { ItemFilters } from "./item-filters";
import { filterItems } from "@/lib/items/filter-items";
import { generateItems } from "@/lib/items/generate-items";
import type { ItemFilters as FilterValues } from "@/lib/items/types";

const items = generateItems(100_000);
const categories = [...new Set(items.map((item) => item.category))];
const defaultFilters: FilterValues = {
  search: "",
  category: "",
  minPrice: null,
  maxPrice: null,
  status: "",
};

export function ItemsView() {
  const [filters, setFilters] = useState(defaultFilters);
  const filteredItems = useMemo(() => filterItems(items, filters), [filters]);

  return (
    <main className="min-h-screen bg-background px-4 py-8 font-sans sm:px-8 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-medium text-primary">
              Mock inventory
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Item catalog
            </h1>
          </div>
          <p className="text-sm text-muted">
            <span className="font-semibold tabular-nums text-primary">
              {items.length.toLocaleString("en-US")}
            </span>{" "}
            total items
          </p>
        </header>
        <ItemFilters
          filters={filters}
          categories={categories}
          onChange={(changes) =>
            setFilters((current) => ({ ...current, ...changes }))
          }
          onReset={() => setFilters(defaultFilters)}
        />
        <p role="status" className="mb-3 text-sm text-muted">
          <span className="font-semibold tabular-nums text-primary">
            {filteredItems.length.toLocaleString("en-US")}
          </span>{" "}
          matching items
        </p>
        <ItemList key={JSON.stringify(filters)} items={filteredItems} />
      </div>
    </main>
  );
}
