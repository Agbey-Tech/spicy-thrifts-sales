"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";
import { getVariants } from "@/lib/api/variants";
import { getCategories } from "@/lib/api/categories";
import { ProductVariant, Category, Product } from "@/app/types/database";
import { Search, X, ShoppingCart, Package, Grid3x3, List } from "lucide-react";

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
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

    return Array.from(map.values()).filter((p) => p.variants.length > 0);
  }, [variants, search, categoryId]);

  return (
    <section className="space-y-6">
      {/* Search and Filter Header */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-sm border border-blue-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by SKU or product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white shadow-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="lg:w-64">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white shadow-sm appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
            >
              <option value="">All Categories</option>
              {categories?.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-sm border-2 border-gray-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading products...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium">Failed to load products</p>
        </div>
      ) : groupedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <Package className="w-16 h-16 text-gray-300" />
          <p className="text-gray-500 font-medium">No products found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedProducts.map(({ product, variants }) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="bg-linear-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h3 className="font-bold text-xl text-gray-800">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-gray-600 text-sm mt-1">
                    {product.description}
                  </p>
                )}
              </div>

              <div
                className={`p-6 ${
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    : "space-y-3"
                }`}
              >
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    className={`group bg-linear-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all duration-300 ${
                      viewMode === "list" ? "flex gap-4" : "flex flex-col"
                    }`}
                  >
                    {/* Image */}
                    <div
                      onClick={() => setSelectedVariant(variant)}
                      className={`bg-white ${viewMode === "list" ? "w-32 h-32 shrink-0" : "w-full aspect-square"} flex items-center justify-center p-3 border-b border-gray-100`}
                    >
                      {variant.images && variant.images.length > 0 ? (
                        <img
                          src={variant.images[0]}
                          alt={variant.sku}
                          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 rounded-lg">
                          <Package className="w-12 h-12 text-gray-400 mb-2" />
                          <span className="text-xs text-gray-500">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div
                      className={`p-4 flex flex-col ${viewMode === "list" ? "flex-1 justify-between" : ""}`}
                    >
                      <div className="space-y-2 flex-1">
                        <div className="font-semibold text-gray-800">
                          {variant.sku}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="bg-gray-100 px-2 py-1 rounded-md">
                            {variant.size || "-"}
                          </span>
                          <span className="bg-gray-100 px-2 py-1 rounded-md">
                            {variant.primary_color || "-"}
                          </span>
                        </div>
                        <div className="font-bold text-2xl text-blue-600">
                          ${variant.price.toFixed(2)}
                        </div>
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            variant.stock_quantity > 10
                              ? "bg-green-100 text-green-700"
                              : variant.stock_quantity > 0
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              variant.stock_quantity > 10
                                ? "bg-green-500"
                                : variant.stock_quantity > 0
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          ></div>
                          Stock: {variant.stock_quantity}
                        </div>
                      </div>

                      <button
                        className="mt-3 w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg active:scale-95"
                        disabled={variant.stock_quantity === 0}
                        onClick={() => onAddToCart(variant)}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>
                          {variant.stock_quantity === 0
                            ? "Out of Stock"
                            : "Add to Cart"}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Overlay */}
      {selectedVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="sticky top-0 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-bold text-xl">Product Details</h3>
              <button
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                onClick={() => setSelectedVariant(null)}
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Images */}
              <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                {selectedVariant.images && selectedVariant.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {selectedVariant.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Variant image ${idx + 1}`}
                        className="w-full aspect-square object-cover rounded-lg border-2 border-white shadow-md hover:scale-105 transition-transform duration-300"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="aspect-video flex flex-col items-center justify-center bg-linear-to-br from-gray-200 to-gray-300 rounded-lg">
                    <Package className="w-16 h-16 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      No Images Available
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">SKU</div>
                  <div className="font-bold text-xl text-gray-800">
                    {selectedVariant.sku}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Size</div>
                    <div className="bg-gray-100 px-3 py-2 rounded-lg font-medium">
                      {selectedVariant.size || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Color</div>
                    <div className="bg-gray-100 px-3 py-2 rounded-lg font-medium">
                      {selectedVariant.primary_color || "-"}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Price</div>
                  <div className="font-bold text-3xl text-blue-600">
                    ${selectedVariant.price.toFixed(2)}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Availability</div>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                      selectedVariant.stock_quantity > 10
                        ? "bg-green-100 text-green-700"
                        : selectedVariant.stock_quantity > 0
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        selectedVariant.stock_quantity > 10
                          ? "bg-green-500"
                          : selectedVariant.stock_quantity > 0
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    ></div>
                    {selectedVariant.stock_quantity} units in stock
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl active:scale-95"
                disabled={selectedVariant.stock_quantity === 0}
                onClick={() => {
                  onAddToCart(selectedVariant);
                  setSelectedVariant(null);
                }}
              >
                <ShoppingCart className="w-6 h-6" />
                <span>
                  {selectedVariant.stock_quantity === 0
                    ? "Out of Stock"
                    : "Add to Cart"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
