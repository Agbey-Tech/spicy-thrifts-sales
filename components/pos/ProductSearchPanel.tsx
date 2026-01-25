import useSWR from "swr";
import { useState } from "react";
import { getVariants } from "@/lib/api/variants";
import { ProductVariant, Category } from "@/app/types/database";

interface ProductSearchPanelProps {
  onAddToCart: (variant: ProductVariant) => void;
  refreshKey: string;
}

export function ProductSearchPanel({
  onAddToCart,
  refreshKey,
}: ProductSearchPanelProps) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const {
    data: variants,
    isLoading,
    error,
    mutate,
  } = useSWR(
    ["variants", search, categoryId, refreshKey],
    () =>
      getVariants({
        sku: search || undefined,
        category_id: categoryId || undefined,
      }),
    { revalidateOnFocus: false },
  );

  // TODO: Fetch categories for filter dropdown

  return (
    <section className="mb-4">
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Search by SKU, name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full"
        />
        {/* Category filter dropdown here */}
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">Error loading variants</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {variants?.map((variant: ProductVariant) => (
            <div
              key={variant.id}
              className="card border p-2 flex flex-col gap-1"
            >
              <div className="font-bold text-sm">{variant.sku}</div>
              <div className="text-xs text-gray-500">
                {variant.size || "-"} / {variant.primary_color || "-"}
              </div>
              <div className="font-bold text-blue-600">
                ${variant.price.toFixed(2)}
              </div>
              <div className="text-xs">Stock: {variant.stock_quantity}</div>
              <button
                className="btn btn-sm btn-primary mt-1"
                disabled={variant.stock_quantity === 0}
                onClick={() => onAddToCart(variant)}
              >
                {variant.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
