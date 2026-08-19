import type { CategoriesConfig } from '../schemas/config.js';

export interface CategoryMeta {
  id: string;
  label: string;
  description?: string;
}

/** Resolve a category's display metadata (label / description). */
export function getCategoryMeta(config: CategoriesConfig, id: string): CategoryMeta {
  const found = config.categories.find((c) => c.id === id);
  if (found) return { id: found.id, label: found.label, description: found.description };
  return { id, label: id, description: undefined };
}

/** Stable ordering of categories for output (falls back to config declaration order). */
export function categoryOrder(config: CategoriesConfig): string[] {
  if (config.category_order && config.category_order.length > 0) return config.category_order;
  return config.categories.map((c) => c.id);
}
