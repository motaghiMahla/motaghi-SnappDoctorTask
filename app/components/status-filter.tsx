import type { Item } from "@/lib/items/types";
import { filterControlClassName } from "./filter-styles";

type StatusFilterProps = {
  value: Item["status"] | "";
  onChange: (value: Item["status"] | "") => void;
};

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <label className="text-sm font-medium">
      Status
      <select
        name="status"
        value={value}
        onChange={(event) => {
          const status = event.target.value;
          if (status === "" || status === "active" || status === "inactive") {
            onChange(status);
          }
        }}
        className={filterControlClassName}
      >
        <option value="">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </label>
  );
}
