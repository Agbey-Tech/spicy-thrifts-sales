"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import toast from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Grid3x3,
  List,
  AlertCircle,
  Box,
  X,
  Layers,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function ProductsPage() {
  const {
    data: products,
    mutate,
    isLoading,
    error,
  } = useSWR("/api/products", () => getProducts({ includeVariants: true }), {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: false,
  });

  const { data: categories } = useSWR("/api/categories", getCategories, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

  const handleSave = async (values: any) => {
    try {
      if (editProduct) {
        await updateProduct(editProduct.id, values);
        toast.success("Product updated successfully");
      } else {
        await createProduct(values);
        toast.success("Product created successfully");
      }
      setShowModal(false);
      setEditProduct(null);
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Failed to save product");
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await deleteProduct(productId);
      toast.success("Product deleted successfully");
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                <p className="text-sm text-gray-600">
                  Manage your product catalog
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-sm border-2 border-gray-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-purple-500 text-white shadow-md"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-purple-500 text-white shadow-md"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Add Button */}
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:shadow-lg active:scale-95"
                onClick={() => {
                  setEditProduct(null);
                  setShowModal(true);
                }}
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">New Product</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
          {isLoading && !products ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">Loading products...</p>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products?.map((prod: any) => (
                      <div
                        key={prod.id}
                        className="group relative bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-lg transition-all duration-300"
                      >
                        {/* Icon & Actions */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                            <Box className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex gap-1">
                            <button
                              className="p-2 hover:bg-purple-50 rounded-lg transition-colors text-gray-400 hover:text-purple-600"
                              onClick={() => {
                                setEditProduct(prod);
                                setShowModal(true);
                              }}
                              title="Edit product"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600"
                              onClick={() => handleDelete(prod.id)}
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">
                              {prod.name}
                            </h3>
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {prod.description || "No description"}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <div className="flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-xs text-gray-600 font-medium">
                                {prod.variants?.length ?? 0} variants
                              </span>
                            </div>
                            {prod.is_active ? (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span className="text-xs font-semibold">
                                  Active
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-gray-400">
                                <XCircle className="w-3.5 h-3.5" />
                                <span className="text-xs font-semibold">
                                  Inactive
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                            {categories?.find((c) => c.id === prod.category_id)
                              ?.name || "No category"}
                          </div>
                        </div>
                      </div>
                    ))}

                    {!products?.length && (
                      <div className="col-span-full flex flex-col items-center justify-center py-16">
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 mb-4">
                          <Package className="w-16 h-16 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          No products yet
                        </h3>
                        <p className="text-sm text-gray-500">
                          Create your first product to get started
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                          <th className="py-4 px-6 text-left text-sm font-bold text-gray-700">
                            Product Name
                          </th>
                          <th className="py-4 px-6 text-left text-sm font-bold text-gray-700">
                            Category
                          </th>
                          <th className="py-4 px-6 text-center text-sm font-bold text-gray-700">
                            Active
                          </th>
                          <th className="py-4 px-6 text-center text-sm font-bold text-gray-700">
                            Variants
                          </th>
                          <th className="py-4 px-6 text-center text-sm font-bold text-gray-700 w-32">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {products?.map((prod: any) => (
                          <tr
                            key={prod.id}
                            className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 group"
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
                                  <Box className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-800 block">
                                    {prod.name}
                                  </span>
                                  <span className="text-xs text-gray-500 line-clamp-1">
                                    {prod.description || "No description"}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                                {categories?.find(
                                  (c) => c.id === prod.category_id,
                                )?.name || "-"}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              {prod.is_active ? (
                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                                  <CheckCircle className="w-3 h-3" />
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-xs font-semibold">
                                  <XCircle className="w-3 h-3" />
                                  Inactive
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                                <Layers className="w-3 h-3" />
                                {prod.variants?.length ?? 0}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  className="p-2 hover:bg-purple-100 rounded-lg transition-colors text-gray-600 hover:text-purple-600"
                                  onClick={() => {
                                    setEditProduct(prod);
                                    setShowModal(true);
                                  }}
                                  title="Edit product"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  className="p-2 hover:bg-red-100 rounded-lg transition-colors text-gray-600 hover:text-red-600"
                                  onClick={() => handleDelete(prod.id)}
                                  title="Delete product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}

                        {!products?.length && (
                          <tr>
                            <td colSpan={5} className="py-16">
                              <div className="flex flex-col items-center justify-center text-center">
                                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 mb-4">
                                  <Package className="w-16 h-16 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                  No products yet
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Create your first product to get started
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile List */}
                  <div className="md:hidden p-4 space-y-3">
                    {products?.map((prod: any) => (
                      <div
                        key={prod.id}
                        className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 rounded-lg shadow-md flex-shrink-0">
                              <Box className="w-5 h-5 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-gray-800 truncate">
                                {prod.name}
                              </h3>
                              <p className="text-xs text-gray-500 line-clamp-1">
                                {prod.description || "No description"}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                  {categories?.find(
                                    (c) => c.id === prod.category_id,
                                  )?.name || "-"}
                                </span>
                                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                  <Layers className="w-3 h-3" />
                                  {prod.variants?.length ?? 0}
                                </span>
                                {prod.is_active ? (
                                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                    <CheckCircle className="w-3 h-3" />
                                    Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                                    <XCircle className="w-3 h-3" />
                                    Inactive
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1 ml-2 flex-shrink-0">
                            <button
                              className="p-2 hover:bg-purple-50 rounded-lg transition-colors text-gray-400 hover:text-purple-600"
                              onClick={() => {
                                setEditProduct(prod);
                                setShowModal(true);
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600"
                              onClick={() => handleDelete(prod.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {!products?.length && (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 mb-4">
                          <Package className="w-16 h-16 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          No products yet
                        </h3>
                        <p className="text-sm text-gray-500">
                          Create your first product to get started
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

      {/* Modal */}
      {showModal && (
        <ProductModal
          initial={editProduct}
          categories={categories || []}
          onClose={() => {
            setShowModal(false);
            setEditProduct(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

/* ===========================
   Modal
=========================== */

function ProductModal({
  initial,
  categories,
  onClose,
  onSave,
}: {
  initial: any;
  categories: any[];
  onClose: () => void;
  onSave: (values: any) => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [categoryId, setCategoryId] = useState(initial?.category_id || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [isUnique, setIsUnique] = useState(initial?.is_unique || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      await onSave({
        name,
        category_id: categoryId,
        description,
        is_unique: isUnique,
      });
      onClose();
    } catch (e: any) {
      setError(e?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">
              {initial ? "Edit Product" : "New Product"}
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
        <div className="p-6 space-y-5">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={loading}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none"
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={loading}
            />
          </div>

          {/* Is Unique Checkbox */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <input
              type="checkbox"
              id="isUnique"
              checked={isUnique}
              onChange={(e) => setIsUnique(e.target.checked)}
              disabled={loading}
              className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-2"
            />
            <label
              htmlFor="isUnique"
              className="font-semibold text-gray-700 cursor-pointer flex-1"
            >
              Is Unique Product
            </label>
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
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !name.trim() || !categoryId}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : (
                "Save Product"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
