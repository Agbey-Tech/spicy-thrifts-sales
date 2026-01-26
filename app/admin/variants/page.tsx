"use client";

import { useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";

import {
  Plus,
  Pencil,
  Box,
  Filter,
  X,
  AlertCircle,
  Image as ImageIcon,
  Upload,
  Trash2,
  DollarSign,
  Package2,
  Palette,
  Ruler,
  BarChart3,
  Grid3x3,
  List,     
} from "lucide-react";

import { getVariants, updateVariant, createVariant } from "@/lib/api/variants";
import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { uploadImage } from "@/lib/uploads/uploadProfileImage";
import { useUserStore } from "@/lib/auth/userStore";
import type { ProductVariant } from "@/app/types/database";

export default function VariantsPage() {
  const user = useUserStore((s) => s.user);
  const isAdmin = user?.role === "ADMIN";

  // Filters
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productId, setProductId] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Data
  const {
    data: variants,
    mutate,
    isLoading,
    error,
  } = useSWR(
    ["/api/variants", sku, categoryId, productId],
    () => getVariants({ sku, category_id: categoryId }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
    },
  );
  const { data: products } = useSWR("/api/products", getProducts);
  const { data: categories } = useSWR("/api/categories", getCategories);

  // Modal state
  const [modalType, setModalType] = useState<"add" | "edit" | null>(null);
  const [modalVariant, setModalVariant] = useState<ProductVariant | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

  // Add Variant
  const handleAdd = async (values: Partial<ProductVariant>) => {
    try {
      if (!values.product_id) {
        throw new Error("SKU and Product are required");
      }
      await createVariant(values);
      toast.success("Variant added successfully");
      setShowModal(false);
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Failed to add variant");
    }
  };

  // Edit Variant
  const handleEdit = async (values: Partial<ProductVariant>) => {
    try {
      if (!modalVariant) return;
      await updateVariant(modalVariant.id, values);
      toast.success("Variant updated successfully");
      setShowModal(false);
      setModalVariant(null);
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Failed to update variant");
    }
  };

  const hasActiveFilters = sku || categoryId || productId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
                  <Box className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Variants</h1>
                  <p className="text-sm text-gray-600">
                    Manage product variants and inventory
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg active:scale-95 ${
                    hasActiveFilters
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                      : "bg-white text-gray-700 border-2 border-gray-200"
                  }`}
                >
                  <Filter className="w-5 h-5" />
                  <span className="hidden sm:inline">Filters</span>
                  {hasActiveFilters && (
                    <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                      {[sku, categoryId, productId].filter(Boolean).length}
                    </span>
                  )}
                </button>

                {/* View Toggle */}
                <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-sm border-2 border-gray-200">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "bg-emerald-500 text-white shadow-md"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 rounded-lg transition-all ${
                      viewMode === "list"
                        ? "bg-emerald-500 text-white shadow-md"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                {/* Add Button */}
                {isAdmin && (
                  <button
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:shadow-lg active:scale-95"
                    onClick={() => {
                      setModalType("add");
                      setShowModal(true);
                    }}
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Add Variant</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 animate-in slide-in-from-top duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Filter by SKU
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                      placeholder="Enter SKU"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Filter by Category
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Filter by Product
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                    >
                      <option value="">All Products</option>
                      {products?.map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        setSku("");
                        setCategoryId("");
                        setProductId("");
                      }}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
          {isLoading && !variants ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">Loading variants...</p>
            </div>
          ) : (
            <>
              {/* Offline/Error Banner */}
              {(error || isOffline) && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-800">
                      Network Issue
                    </p>
                    <p className="text-sm text-yellow-700">
                      You're offline or having network issues. Showing last
                      saved data.
                    </p>
                  </div>
                </div>
              )}

              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {variants?.map((variant) => (
                      <div
                        key={variant.id}
                        className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl overflow-hidden hover:border-emerald-400 hover:shadow-lg transition-all duration-300"
                      >
                        {/* Image */}
                        <div className="bg-white w-full aspect-square flex items-center justify-center p-3 border-b border-gray-100">
                          {variant.images && variant.images.length > 0 ? (
                            <img
                              src={variant.images[0]}
                              alt={variant.sku}
                              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
                              <Package2 className="w-12 h-12 text-gray-400 mb-2" />
                              <span className="text-xs text-gray-500">
                                No Image
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="p-4 space-y-3">
                          <div>
                            <span className="font-mono text-sm font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded inline-block mb-2">
                              {variant.sku}
                            </span>
                            <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">
                              {products?.find(
                                (p) => p.id === variant.product_id,
                              )?.name || "-"}
                            </h3>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                              {categories?.find(
                                (c) =>
                                  c.id ===
                                  products?.find(
                                    (p) => p.id === variant.product_id,
                                  )?.category_id,
                              )?.name || "-"}
                            </span>
                            {variant.size && (
                              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                <Ruler className="w-3 h-3" />
                                {variant.size}
                              </span>
                            )}
                            {variant.primary_color && (
                              <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                <Palette className="w-3 h-3" />
                                {variant.primary_color}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-emerald-600" />
                              <span className="text-lg font-bold text-emerald-600">
                                {variant.price}
                              </span>
                            </div>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                variant.stock_quantity > 10
                                  ? "bg-green-100 text-green-700"
                                  : variant.stock_quantity > 0
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              <BarChart3 className="w-3 h-3" />
                              {variant.stock_quantity}
                            </span>
                          </div>

                          <button
                            className="w-full p-2 hover:bg-emerald-50 rounded-lg transition-colors text-gray-600 hover:text-emerald-600 flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-emerald-300"
                            onClick={() => {
                              setModalType("edit");
                              setModalVariant(variant);
                              setShowModal(true);
                            }}
                            title="Edit variant"
                          >
                            <Pencil className="w-4 h-4" />
                            <span className="text-sm font-semibold">Edit</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {!variants?.length && (
                      <div className="col-span-full flex flex-col items-center justify-center py-16">
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 mb-4">
                          <Box className="w-16 h-16 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          No variants found
                        </h3>
                        <p className="text-sm text-gray-500">
                          {hasActiveFilters
                            ? "Try adjusting your filters"
                            : "Create your first variant to get started"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* List View - Desktop Table */}
              {viewMode === "list" && (
                <>
                  {/* Desktop Table */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                          <th className="py-4 px-6 text-left text-sm font-bold text-gray-700">
                            SKU
                          </th>
                          <th className="py-4 px-6 text-left text-sm font-bold text-gray-700">
                            Product
                          </th>
                          <th className="py-4 px-6 text-left text-sm font-bold text-gray-700">
                            Category
                          </th>
                          <th className="py-4 px-6 text-center text-sm font-bold text-gray-700">
                            Size
                          </th>
                          <th className="py-4 px-6 text-center text-sm font-bold text-gray-700">
                            Color
                          </th>
                          <th className="py-4 px-6 text-center text-sm font-bold text-gray-700">
                            Stock
                          </th>
                          <th className="py-4 px-6 text-center text-sm font-bold text-gray-700">
                            Price
                          </th>
                          <th className="py-4 px-6 text-center text-sm font-bold text-gray-700">
                            Status
                          </th>
                          <th className="py-4 px-6 text-center text-sm font-bold text-gray-700 w-24">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {variants?.map((variant) => (
                          <tr
                            key={variant.id}
                            className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200 group"
                          >
                            <td className="py-4 px-6">
                              <span className="font-mono text-sm font-semibold text-gray-800">
                                {variant.sku}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="font-semibold text-gray-800">
                                {products?.find(
                                  (p) => p.id === variant.product_id,
                                )?.name || "-"}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                                {categories?.find(
                                  (c) =>
                                    c.id ===
                                    products?.find(
                                      (p) => p.id === variant.product_id,
                                    )?.category_id,
                                )?.name || "-"}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                                <Ruler className="w-3 h-3" />
                                {variant.size || "-"}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                                <Palette className="w-3 h-3" />
                                {variant.primary_color || "-"}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  variant.stock_quantity > 10
                                    ? "bg-green-100 text-green-700"
                                    : variant.stock_quantity > 0
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                }`}
                              >
                                <BarChart3 className="w-3 h-3" />
                                {variant.stock_quantity}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                                <DollarSign className="w-3 h-3" />
                                {variant.price}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              {variant.stock_quantity > 0 ? (
                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-xs font-semibold">
                                  Inactive
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <button
                                className="p-2 hover:bg-emerald-100 rounded-lg transition-colors text-gray-600 hover:text-emerald-600"
                                onClick={() => {
                                  setModalType("edit");
                                  setModalVariant(variant);
                                  setShowModal(true);
                                }}
                                title="Edit variant"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}

                        {!variants?.length && (
                          <tr>
                            <td colSpan={9} className="py-16">
                              <div className="flex flex-col items-center justify-center text-center">
                                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 mb-4">
                                  <Box className="w-16 h-16 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                  No variants found
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {hasActiveFilters
                                    ? "Try adjusting your filters"
                                    : "Create your first variant to get started"}
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="lg:hidden p-4 space-y-3">
                    {variants?.map((variant) => (
                      <div
                        key={variant.id}
                        className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-mono text-sm font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                                {variant.sku}
                              </span>
                              {variant.stock_quantity > 0 ? (
                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                                  Inactive
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-gray-800 mb-1">
                              {products?.find(
                                (p) => p.id === variant.product_id,
                              )?.name || "-"}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                {categories?.find(
                                  (c) =>
                                    c.id ===
                                    products?.find(
                                      (p) => p.id === variant.product_id,
                                    )?.category_id,
                                )?.name || "-"}
                              </span>
                              {variant.size && (
                                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                  <Ruler className="w-3 h-3" />
                                  {variant.size}
                                </span>
                              )}
                              {variant.primary_color && (
                                <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                  <Palette className="w-3 h-3" />
                                  {variant.primary_color}
                                </span>
                              )}
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  variant.stock_quantity > 10
                                    ? "bg-green-100 text-green-700"
                                    : variant.stock_quantity > 0
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                }`}
                              >
                                <BarChart3 className="w-3 h-3" />
                                Stock: {variant.stock_quantity}
                              </span>
                              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                <DollarSign className="w-3 h-3" />
                                {variant.price}
                              </span>
                            </div>
                          </div>
                          <button
                            className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-gray-400 hover:text-emerald-600 flex-shrink-0 ml-2"
                            onClick={() => {
                              setModalType("edit");
                              setModalVariant(variant);
                              setShowModal(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {!variants?.length && (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 mb-4">
                          <Box className="w-16 h-16 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          No variants found
                        </h3>
                        <p className="text-sm text-gray-500">
                          {hasActiveFilters
                            ? "Try adjusting your filters"
                            : "Create your first variant to get started"}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {showModal && modalType && (
        <VariantModal
          type={modalType}
          initial={modalVariant}
          products={products || []}
          categories={categories || []}
          onClose={() => {
            setShowModal(false);
            setModalVariant(null);
          }}
          onSave={modalType === "add" ? handleAdd : handleEdit}
        />
      )}
    </div>
  );
}

export function VariantModal({
  type,
  initial,
  products,
  categories,
  onClose,
  onSave,
}: {
  type: "add" | "edit";
  initial: ProductVariant | null;
  products: any[];
  categories: any[];
  onClose: () => void;
  onSave: (values: Partial<ProductVariant>) => Promise<void>;
}) {
  const [sku, setSku] = useState(initial?.sku || "");
  const [productId, setProductId] = useState(initial?.product_id || "");
  const [size, setSize] = useState(initial?.size || "");
  const [color, setColor] = useState(initial?.primary_color || "");
  const [price, setPrice] = useState(initial?.price || 0);
  const [stock, setStock] = useState(initial?.stock_quantity || 0);
  const [images, setImages] = useState<string[]>(initial?.images || []);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploadingImages(true);
    const urls: string[] = [];

    for (const file of files) {
      try {
        const url = await uploadImage(file);
        if (url) urls.push(url);
        else toast.error("Failed to upload image");
      } catch (err) {
        toast.error("Failed to upload image");
      }
    }

    setImages((prev) => [...prev, ...urls]);
    setUploadingImages(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (type === "add") {
        await onSave({
          sku,
          product_id: productId,
          size,
          primary_color: color,
          price,
          stock_quantity: stock,
          images,
        });
      } else {
        await onSave({ price, stock_quantity: stock, images });
      }
      onClose();
    } catch (e: any) {
      setError(e?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Package2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">
              {type === "add" ? "Add Variant" : "Edit Variant"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
          {type === "add" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none font-mono"
                    placeholder="Enter SKU"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Select Product</option>
                    {products.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Size
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                    placeholder="e.g., S, M, L, XL"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                    placeholder="e.g., Red, Blue"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min={0}
                step={0.01}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                min={0}
                step={1}
                disabled={loading}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-emerald-500 transition-colors">
              <input
                type="file"
                id="imageUpload"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading || uploadingImages}
                className="hidden"
              />
              <label
                htmlFor="imageUpload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-full mb-3">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  {uploadingImages
                    ? "Uploading images..."
                    : "Click to upload images"}
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </label>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-emerald-500 transition-all"
                  >
                    <img
                      src={img}
                      alt={`Preview ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      disabled={loading}
                      type="button"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                loading ||
                uploadingImages ||
                (type === "add" && (!sku || !productId))
              }
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {type === "add" ? "Adding..." : "Saving..."}
                </span>
              ) : uploadingImages ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </span>
              ) : type === "add" ? (
                "Add Variant"
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
