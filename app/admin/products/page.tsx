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
import { Plus, Pencil, Trash2 } from "lucide-react";

// Dummy uploadImage function (replace with real implementation)
async function uploadImage(file: File): Promise<string | null> {
  await new Promise((r) => setTimeout(r, 800));
  return URL.createObjectURL(file);
}

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

  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

  const handleSave = async (values: any) => {
    try {
      if (editProduct) {
        await updateProduct(editProduct.id, values);
        toast.success("Product updated");
      } else {
        await createProduct(values);
        toast.success("Product created");
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
      toast.success("Product deleted");
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete product");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => {
            setEditProduct(null);
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4" /> New Product
        </button>
      </div>

      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        {/* Initial load only */}
        {isLoading && !products ? (
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

            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-2">Name</th>
                  <th className="py-2 px-2">Category</th>
                  <th className="py-2 px-2">Active</th>
                  <th className="py-2 px-2">Variant Count</th>
                  <th className="py-2 px-2 w-20">Edit</th>
                  <th className="py-2 px-2 w-20">Delete</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((prod: any) => (
                  <tr key={prod.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2">{prod.name}</td>
                    <td className="py-2 px-2">
                      {categories?.find((c) => c.id === prod.category_id)
                        ?.name || "-"}
                    </td>
                    <td className="py-2 px-2">
                      {prod.is_active ? "Yes" : "No"}
                    </td>
                    <td className="py-2 px-2">{prod.variants?.length ?? 0}</td>
                    <td className="py-2 px-2">
                      <button
                        className="p-1 hover:bg-gray-200 rounded"
                        onClick={() => {
                          setEditProduct(prod);
                          setShowModal(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="py-2 px-2">
                      <button
                        className="p-1 hover:bg-red-100 rounded"
                        onClick={() => handleDelete(prod.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}

                {!products?.length && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>

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
   Modal (unchanged logic)
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
  const [images, setImages] = useState<string[]>(initial?.images || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setLoading(true);

    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadImage(file);
      if (url) urls.push(url);
      else toast.error("Failed to upload image");
    }

    setImages(urls);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSave({
        name,
        category_id: categoryId,
        description,
        is_unique: isUnique,
        images,
      });
      onClose();
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
        className="bg-white rounded shadow-lg p-8 w-full max-w-lg"
      >
        <h2 className="text-lg font-bold mb-4">
          {initial ? "Edit Product" : "New Product"}
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
          <label className="block mb-1 font-medium">Category</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
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

        <div className="mb-4">
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
          />
          <div className="flex gap-2 mt-2 flex-wrap">
            {images.map((img, i) => (
              <div
                key={i}
                className="w-20 h-20 bg-gray-100 rounded overflow-hidden border"
              >
                <img
                  src={img}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={isUnique}
            onChange={(e) => setIsUnique(e.target.checked)}
            disabled={loading}
          />
          <label className="font-medium">Is Unique</label>
        </div>

        {error && <div className="mb-2 text-red-600 text-sm">{error}</div>}

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
