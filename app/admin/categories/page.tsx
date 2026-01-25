"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  getCategories,
  createCategory,
  updateCategory,
} from "@/lib/api/categories";
import { Plus, Pencil } from "lucide-react";
import toast from "react-hot-toast";

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

  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

  const handleSave = async (values: { name: string; code: string }) => {
    try {
      if (editCategory) {
        await updateCategory(editCategory.id, values);
        toast.success("Category updated");
      } else {
        await createCategory(values);
        toast.success("Category created");
      }
      setShowModal(false);
      setEditCategory(null);
      mutate(); // revalidate
    } catch (e: any) {
      toast.error(e?.message || "Failed to save category");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => {
            setEditCategory(null);
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      <div className="bg-white rounded shadow p-4">
        {/* Initial load only */}
        {isLoading && !categories ? (
          <div>Loading...</div>
        ) : (
          <>
            {/* Non-blocking offline / error banner */}
            {(error || isOffline) && (
              <div className="mb-3 text-sm text-yellow-600">
                You’re offline or having network issues. Showing last saved
                data.
              </div>
            )}

            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-2">Name</th>
                  <th className="py-2 px-2">Code</th>
                  <th className="py-2 px-2 w-12">Edit</th>
                </tr>
              </thead>
              <tbody>
                {categories?.map((cat) => (
                  <tr key={cat.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2">{cat.name}</td>
                    <td className="py-2 px-2">{cat.code}</td>
                    <td className="py-2 px-2">
                      <button
                        className="p-1 hover:bg-gray-200 rounded"
                        onClick={() => {
                          setEditCategory(cat);
                          setShowModal(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {!categories?.length && (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-500">
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSave({ name, code });
    } catch (e: any) {
      setError(e?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded shadow-lg p-8 w-full max-w-sm"
      >
        <h2 className="text-lg font-bold mb-4">
          {initial ? "Edit Category" : "New Category"}
        </h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Name</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Code</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {error && <div className="mb-2 text-red-600 text-sm">{error}</div>}

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
