import { filterControlClassName } from "./filter-styles";

type SearchFilterProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchFilter({ value, onChange }: SearchFilterProps) {
  return (
    <label className="text-sm font-medium sm:col-span-2">
      Search by name
      <input
        type="search"
        name="search"
        placeholder="Search items…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={filterControlClassName}
      />
    </label>
  );
}
