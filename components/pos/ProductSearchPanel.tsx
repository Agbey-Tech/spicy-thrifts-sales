"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";
import { getVariants } from "@/lib/api/variants";
import { getCategories } from "@/lib/api/categories";
import { ProductVariant, Category, Product } from "@/app/types/database";

interface ProductWithVariants {
  product: Product;
  variants: ProductVariant[];
}

interface ProductSearchPanelProps {
  onAddToCart: (variant: ProductVariant) => void;
  refreshKey: string;
}

export function ProductSearchPanel({
  onAddToCart,
  refreshKey,
}: ProductSearchPanelProps) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");

  const {
    data: variants,
    isLoading,
    error,
  } = useSWR(["variants", refreshKey], () => getVariants({}), {
    revalidateOnFocus: false,
  });

  const { data: categories } = useSWR("categories", getCategories, {
    revalidateOnFocus: false,
  });

  const groupedProducts = useMemo(() => {
    if (!variants) return [];

    const filtered = variants.filter((v: any) => {
      const matchesSearch =
        !search ||
        v.sku.toLowerCase().includes(search.toLowerCase()) ||
        v.products?.name.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        !categoryId || v.products?.category_id === categoryId;

      return matchesSearch && matchesCategory;
    });

    const map = new Map<string, ProductWithVariants>();

    filtered.forEach((variant: any) => {
      const product = variant.products;
      if (!product) return;

      if (!map.has(product.id)) {
        map.set(product.id, { product, variants: [] });
      }
      map.get(product.id)!.variants.push(variant);
    });

    return Array.from(map.values());
  }, [variants, search, categoryId]);

  return (
    <section className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search by SKU or product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All Categories</option>
          {categories?.map((cat: Category) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div>Loading products...</div>
      ) : error ? (
        <div className="text-red-600">Failed to load products</div>
      ) : (
        <div className="space-y-6">
          {groupedProducts.map(({ product, variants }) => (
            <div
              key={product.id}
              className="border rounded p-4 bg-white space-y-3"
            >
              <div className="font-bold text-lg">{product.name}</div>

              {product.images && product.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={product.name}
                      className="h-24 w-24 object-cover rounded border"
                    />
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="border rounded p-2 flex flex-col gap-1"
                  >
                    <div className="font-semibold text-sm">{variant.sku}</div>
                    <div className="text-xs text-gray-500">
                      {variant.size || "-"} / {variant.primary_color || "-"}
                    </div>
                    <div className="font-bold text-blue-600">
                      ${variant.price.toFixed(2)}
                    </div>
                    <div className="text-xs">
                      Stock: {variant.stock_quantity}
                    </div>
                    <button
                      className="mt-1 text-sm px-2 py-1 rounded bg-blue-600 text-white disabled:bg-gray-300"
                      disabled={variant.stock_quantity === 0}
                      onClick={() => onAddToCart(variant)}
                    >
                      {variant.stock_quantity === 0
                        ? "Out of Stock"
                        : "Add to Cart"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
