"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  getCategories,
  createCategory,
  updateCategory,
} from "@/lib/api/categories";
import {
  Plus,
  Pencil,
  Tag,
  Grid3x3,
  List,
  AlertCircle,
  Folder,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { generateCategoryCode } from "@/lib/generators/categories";

type Category = {
  id: string;
  name: string;
  code: string;
};

export default function CategoriesPage() {
  const {
    data: categories,
    mutate,
    isLoading,
    error,
  } = useSWR<Category[]>("/api/categories", getCategories, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

  const handleSave = async (values: { name: string; code: string }) => {
    try {
      if (editCategory) {
        await updateCategory(editCategory.id, values);
        toast.success("Category updated successfully");
      } else {
        await createCategory(values);
        toast.success("Category created successfully");
      }
      setShowModal(false);
      setEditCategory(null);
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Failed to save category");
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-br from-[#7c377f] to-[#fadadd] p-3 rounded-xl shadow-lg">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#7c377f]">
                  Categories
                </h1>
                <p className="text-sm text-black/70">
                  Manage product categories and classifications
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-sm border-2 border-[#fadadd]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-[#7c377f] text-white shadow-md"
                      : "text-black hover:bg-[#fadadd]"
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-[#7c377f] text-white shadow-md"
                      : "text-black hover:bg-[#fadadd]"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Add Button */}
              <button
                className="flex items-center gap-2 bg-linear-to-r from-[#7c377f] to-[#fadadd] text-white px-4 py-3 rounded-xl font-semibold hover:from-[#fadadd] hover:to-[#7c377f] transition-all duration-300 hover:shadow-lg active:scale-95"
                onClick={() => {
                  setEditCategory(null);
                  setShowModal(true);
                }}
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">New Category</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-[#fadadd] overflow-hidden">
          {isLoading && !categories ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">Loading categories...</p>
            </div>
          ) : (
            <>
              {/* Offline/Error Banner */}
              {(error || isOffline) && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
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
                    {categories?.map((cat) => (
                      <div
                        key={cat.id}
                        className="group relative bg-white border-2 border-[#fadadd] rounded-xl p-5 hover:border-[#7c377f] hover:shadow-lg transition-all duration-300"
                      >
                        {/* Icon */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="bg-linear-to-br from-[#7c377f] to-[#fadadd] p-3 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                            <Folder className="w-5 h-5 text-white" />
                          </div>
                          <button
                            className="p-2 hover:bg-[#fadadd] rounded-lg transition-colors text-black hover:text-[#7c377f]"
                            onClick={() => {
                              setEditCategory(cat);
                              setShowModal(true);
                            }}
                            title="Edit category"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Content */}
                        <div>
                          <h3 className="font-bold text-lg text-[#7c377f] mb-1 truncate">
                            {cat.name}
                          </h3>
                          <div className="inline-flex items-center gap-1.5 bg-[#fadadd] text-[#7c377f] px-3 py-1 rounded-full text-xs font-semibold">
                            <Tag className="w-3 h-3" />
                            {cat.code}
                          </div>
                        </div>
                      </div>
                    ))}

                    {!categories?.length && (
                      <div className="col-span-full flex flex-col items-center justify-center py-16">
                        <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-full p-8 mb-4">
                          <Tag className="w-16 h-16 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#7c377f] mb-2">
                          No categories yet
                        </h3>
                        <p className="text-sm text-black/60">
                          Create your first category to get started
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
                        <tr className="bg-linear-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                          <th className="py-4 px-6 text-left text-sm font-bold text-gray-700">
                            Category Name
                          </th>
                          <th className="py-4 px-6 text-left text-sm font-bold text-gray-700">
                            Code
                          </th>
                          <th className="py-4 px-6 text-center text-sm font-bold text-gray-700 w-24">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories?.map((cat) => (
                          <tr
                            key={cat.id}
                            className="border-b border-gray-100 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="bg-linear-to-br from-[#7c377f] to-[#fadadd] p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
                                  <Folder className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-semibold text-[#7c377f]">
                                  {cat.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center gap-1.5 bg-[#fadadd] text-[#7c377f] px-3 py-1.5 rounded-full text-xs font-semibold">
                                <Tag className="w-3 h-3" />
                                {cat.code}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <button
                                className="p-2 hover:bg-[#fadadd] rounded-lg transition-colors text-black hover:text-[#7c377f]"
                                onClick={() => {
                                  setEditCategory(cat);
                                  setShowModal(true);
                                }}
                                title="Edit category"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}

                        {!categories?.length && (
                          <tr>
                            <td colSpan={3} className="py-16">
                              <div className="flex flex-col items-center justify-center text-center">
                                <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-full p-8 mb-4">
                                  <Tag className="w-16 h-16 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-[#7c377f] mb-2">
                                  No categories yet
                                </h3>
                                <p className="text-sm text-black/60">
                                  Create your first category to get started
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
                    {categories?.map((cat) => (
                      <div
                        key={cat.id}
                        className="bg-linear-to-br from-white to-[#fadadd] border-2 border-[#fadadd] rounded-xl p-4 hover:border-[#7c377f] hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-linear-to-br from-[#7c377f] to-[#fadadd] p-2 rounded-lg shadow-md">
                              <Folder className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-[#7c377f]">
                                {cat.name}
                              </h3>
                              <span className="inline-flex items-center gap-1 bg-[#fadadd] text-[#7c377f] px-2 py-0.5 rounded-full text-xs font-semibold mt-1">
                                <Tag className="w-3 h-3" />
                                {cat.code}
                              </span>
                            </div>
                          </div>
                          <button
                            className="p-2 hover:bg-[#fadadd] rounded-lg transition-colors text-black hover:text-[#7c377f]"
                            onClick={() => {
                              setEditCategory(cat);
                              setShowModal(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {!categories?.length && (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-full p-8 mb-4">
                          <Tag className="w-16 h-16 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#7c377f] mb-2">
                          No categories yet
                        </h3>
                        <p className="text-sm text-black/60">
                          Create your first category to get started
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
        <CategoryModal
          initial={editCategory}
          onClose={() => {
            setShowModal(false);
            setEditCategory(null);
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

function CategoryModal({
  initial,
  onClose,
  onSave,
}: {
  initial: Category | null;
  onClose: () => void;
  onSave: (values: { name: string; code: string }) => Promise<void>;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [code, setCode] = useState(initial?.code || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (value: string) => {
    setName(value);
    setCode(generateCategoryCode(value));
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      // Generate code if not provided
      const finalCode = code.trim() || generateCategoryCode(name);
      await onSave({ name: name.trim(), code: finalCode });
    } catch (e: any) {
      setError(e?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border-2 border-[#fadadd]">
        {/* Header */}
        <div className="bg-linear-to-r from-[#7c377f] to-[#fadadd] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Tag className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">
              {initial ? "Edit Category" : "New Category"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#fadadd]/40 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-semibold text-[#7c377f] mb-2">
              Category Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Code Input */}
          <div>
            <label className="block text-sm font-semibold text-[#7c377f] mb-2">
              Category Code
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-mono"
              placeholder="Auto-generated from name"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              disabled={true}
            />
            <p className="text-xs text-black/60 mt-1">
              Leave empty to auto-generate from name (first 3 characters)
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              className="flex-1 px-4 py-3 rounded-xl bg-[#fadadd] text-black font-semibold hover:bg-[#7c377f] hover:text-white transition-colors"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-[#7c377f] to-[#fadadd] text-white font-semibold hover:from-[#fadadd] hover:to-[#7c377f] transition-all duration-300 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !name.trim()}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
