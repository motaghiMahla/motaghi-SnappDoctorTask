import { filterControlClassName } from "./filter-styles";

type CategoryFilterProps = {
  value: string;
  categories: readonly string[];
  onChange: (value: string) => void;
};

export function CategoryFilter({
  value,
  categories,
  onChange,
}: CategoryFilterProps) {
  return (
    <label className="text-sm font-medium">
      Category
      <select
        name="category"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={filterControlClassName}
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
    </label>
  );
}
