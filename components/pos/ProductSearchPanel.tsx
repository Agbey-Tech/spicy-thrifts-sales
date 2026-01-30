"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";
import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { Category, Product } from "@/app/types/database";
import { Search, ShoppingCart, Package, Grid3x3, List } from "lucide-react";
import { Sp } from "@/app/types/database";
interface ProductSearchPanelProps {
  onAddToCart: (product: Product) => void;
  refreshKey: string;
  products?: Product[];
  sps?: Sp[];
}

export function ProductSearchPanel({
  onAddToCart,
  refreshKey,
  products,
  sps,
}: ProductSearchPanelProps) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Only fetch products if not provided as prop
  const {
    data: fetchedProducts,
    isLoading,
    error,
  } = useSWR(!products ? ["products", refreshKey] : null, getProducts, {
    revalidateOnFocus: false,
  });
  const { data: categories } = useSWR("categories", getCategories, {
    revalidateOnFocus: false,
  });

  const allProducts = products || fetchedProducts;

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    return allProducts.filter((p: Product) => {
      const matchesSearch =
        !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryId || p.category_id === categoryId;
      return matchesSearch && matchesCategory;
    });
  }, [allProducts, search, categoryId]);

  return (
    <section className="space-y-6">
      {/* Search and Filter Header */}
      <div className="bg-[#fadadd] rounded-2xl p-6 shadow-sm border-2 border-[#fadadd]">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#7c377f] transition-colors" />
            <input
              type="text"
              placeholder="Search by SKU or product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-[#fadadd] focus:border-[#7c377f] focus:ring-4 focus:ring-[#fadadd] transition-all outline-none bg-white shadow-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="lg:w-64">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border-2 border-[#fadadd] focus:border-[#7c377f] focus:ring-4 focus:ring-[#fadadd] transition-all outline-none bg-white shadow-sm appearance-none cursor-pointer"
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
          <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-sm border-2 border-[#fadadd]">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 rounded-lg transition-all font-bold ${
                viewMode === "grid"
                  ? "bg-[#7c377f] text-white shadow-md"
                  : "text-black hover:bg-[#fadadd]"
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 rounded-lg transition-all font-bold ${
                viewMode === "list"
                  ? "bg-[#7c377f] text-white shadow-md"
                  : "text-black hover:bg-[#fadadd]"
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
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <Package className="w-16 h-16 text-gray-300" />
          <p className="text-gray-500 font-medium">No products found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-[#fadadd]"
            >
              <div className="bg-[#fadadd] px-6 py-4 border-b-2 border-[#fadadd]">
                <h3 className="font-bold text-xl text-[#7c377f]">
                  {product.name}
                </h3>
              </div>
              <div
                className={`p-6 ${viewMode === "grid" ? "grid grid-cols-1" : "space-y-3"}`}
              >
                <div
                  className={`group bg-white border-2 border-[#fadadd] rounded-xl overflow-hidden hover:border-[#7c377f] hover:shadow-lg transition-all duration-300 ${viewMode === "list" ? "flex gap-4" : "flex flex-col"}`}
                >
                  {/* Icon */}
                  <div
                    className={`bg-[#fadadd] ${viewMode === "list" ? "w-20 h-20 shrink-0" : "w-full aspect-square max-h-24"} flex items-center justify-center p-2 border-b-2 border-[#fadadd]`}
                  >
                    <Package className="w-8 h-8 text-[#7c377f] mb-1" />
                  </div>
                  {/* Details */}
                  <div
                    className={`p-4 flex flex-col ${viewMode === "list" ? "flex-1 justify-between" : ""}`}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="font-semibold text-[#7c377f]">
                        {product.name}
                      </div>
                      <div className="font-bold text-2xl text-[#7c377f]">
                        {sps
                          ? (() => {
                              const sp = sps.find(
                                (sp) => sp.id === product.sp_id,
                              );
                              return sp
                                ? `GH₵${sp.base_price.toFixed(2)}`
                                : "Price: N/A";
                            })()
                          : "Price: N/A"}
                      </div>
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#fadadd] text-[#7c377f]`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${product.stock_quantity > 10 ? "bg-green-500" : product.stock_quantity > 0 ? "bg-yellow-500" : "bg-red-500"}`}
                        ></div>
                        Stock: {product.stock_quantity}
                      </div>
                    </div>
                    <button
                      className="mt-3 w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-[#7c377f] text-white hover:bg-[#fadadd] hover:text-[#7c377f] hover:shadow-lg active:scale-95"
                      disabled={product.stock_quantity === 0}
                      onClick={() => onAddToCart(product)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>
                        {product.stock_quantity === 0
                          ? "Out of Stock"
                          : "Add to Cart"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No modal overlay for products, as there are no variants or images to show */}
    </section>
  );
}
