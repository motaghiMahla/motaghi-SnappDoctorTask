export type Item = {
  id: number;
  name: string;
  category: string;
  price: number;
  status: "active" | "inactive";
};

export type ItemFilters = {
  search: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  status: "active" | "inactive" | "";
};