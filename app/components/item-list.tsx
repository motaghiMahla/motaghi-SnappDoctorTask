"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Item } from "@/lib/items/types";
import { formatPrice } from "@/lib/utils/format-price";
import { ItemsEmptyState } from "./items-empty-state";

const rowHeight = 88;

export function ItemList({ items }: { items: readonly Item[] }) {
  "use no memo";

  const scrollRef = useRef<HTMLDivElement>(null);
  const getItemKey = useCallback((index: number) => items[index].id, [items]);
   
 
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    getItemKey,
    overscan: 5,
  });

  useLayoutEffect(() => {

    virtualizer.scrollToOffset(0, { behavior: "auto" });
  }, [items, virtualizer]);

  return (
    <div
      ref={scrollRef}
      role="region"
      aria-label="Item catalog"
      tabIndex={0}
      className="h-[min(640px,70dvh)] overflow-auto rounded-2xl border border-border bg-surface outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary p-5"
    >
      {items.length === 0 ? (
        <ItemsEmptyState />
      ) : (
        <ul
          className="relative m-0 list-none p-0"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualizer.getVirtualItems().map((row) => {
            const item = items[row.index];

            return (
              <li
                key={item.id}
                aria-posinset={row.index + 1}
                aria-setsize={items.length}
                className="absolute left-0 top-0 flex w-full items-center justify-between gap-3 border-b border-border px-4 hover:bg-surface-hover sm:px-6"
                style={{
                  height: rowHeight,
                  transform: `translateY(${row.start}px)`,
                }}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">
                    {item.name}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {item.category}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-medium tabular-nums text-foreground">
                    {formatPrice(item.price)}
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-1 text-xs capitalize ${
                      item.status === "active"
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
