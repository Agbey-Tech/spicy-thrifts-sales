"use client";

import { useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import { Plus, Pencil } from "lucide-react";
import { getVariants, updateVariant, createVariant } from "@/lib/api/variants";
import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { useUserStore } from "@/lib/auth/userStore";
import type { ProductVariant } from "@/app/types/database";

export default function VariantsPage() {
  const user = useUserStore((s) => s.user);
  const isAdmin = user?.role === "ADMIN";

  // Filters
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productId, setProductId] = useState("");

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

  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

  // Add Variant
  const handleAdd = async (values: Partial<ProductVariant>) => {
    try {
      if (!values.product_id) {
        throw new Error("SKU and Product are required");
      }
      //   TODO: generate the SKU for consistency from every variant/product
      await createVariant(values);
      toast.success("Variant added");
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
      toast.success("Variant updated");
      setShowModal(false);
      setModalVariant(null);
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Failed to update variant");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Variants</h1>
        <div className="flex gap-2">
          <input
            className="border px-2 py-1 rounded"
            placeholder="Filter by SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
          <select
            className="border px-2 py-1 rounded"
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
          <select
            className="border px-2 py-1 rounded"
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
          {isAdmin && (
            <button
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => {
                setModalType("add");
                setShowModal(true);
              }}
            >
              <Plus className="w-4 h-4" /> Add Variant
            </button>
          )}
        </div>
      </div>
      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        {isLoading && !variants ? (
          <div>Loading...</div>
        ) : (
          <>
            {(error || isOffline) && (
              <div className="mb-3 text-sm text-yellow-600">
                You’re offline or having network issues. Showing last saved
                data.
              </div>
            )}
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-2">SKU</th>
                  <th className="py-2 px-2">Product</th>
                  <th className="py-2 px-2">Category</th>
                  <th className="py-2 px-2">Size</th>
                  <th className="py-2 px-2">Color</th>
                  <th className="py-2 px-2">Stock</th>
                  <th className="py-2 px-2">Price</th>
                  <th className="py-2 px-2">Active</th>
                  <th className="py-2 px-2 w-12">Edit</th>
                </tr>
              </thead>
              <tbody>
                {variants?.map((variant) => (
                  <tr key={variant.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2">{variant.sku}</td>
                    <td className="py-2 px-2">
                      {products?.find((p) => p.id === variant.product_id)
                        ?.name || "-"}
                    </td>
                    <td className="py-2 px-2">
                      {categories?.find(
                        (c) =>
                          c.id ===
                          products?.find((p) => p.id === variant.product_id)
                            ?.category_id,
                      )?.name || "-"}
                    </td>
                    <td className="py-2 px-2">{variant.size || "-"}</td>
                    <td className="py-2 px-2">
                      {variant.primary_color || "-"}
                    </td>
                    <td className="py-2 px-2">{variant.stock_quantity}</td>
                    <td className="py-2 px-2">${variant.price}</td>
                    <td className="py-2 px-2">
                      {variant.stock_quantity > 0 ? "Yes" : "No"}
                    </td>
                    <td className="py-2 px-2">
                      <button
                        className="p-1 hover:bg-gray-200 rounded"
                        onClick={() => {
                          setModalType("edit");
                          setModalVariant(variant);
                          setShowModal(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!variants?.length && (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-gray-500">
                      No variants found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
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

function VariantModal({
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        });
      } else {
        await onSave({ price, stock_quantity: stock });
      }
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
        className="bg-white rounded shadow-lg p-8 w-full max-w-sm"
      >
        <h2 className="text-lg font-bold mb-4">
          {type === "add" ? "Add Variant" : "Edit Variant"}
        </h2>
        {type === "add" && (
          <>
            <div className="mb-4">
              <label className="block mb-1 font-medium">SKU</label>
              <input
                className="w-full border px-3 py-2 rounded"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Product</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
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
            <div className="mb-4">
              <label className="block mb-1 font-medium">Size</label>
              <input
                className="w-full border px-3 py-2 rounded"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Color</label>
              <input
                className="w-full border px-3 py-2 rounded"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                disabled={loading}
              />
            </div>
          </>
        )}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Price</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            min={0}
            step={0.01}
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Stock Quantity</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            required
            min={0}
            step={1}
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
            {loading
              ? type === "add"
                ? "Adding..."
                : "Saving..."
              : type === "add"
                ? "Add"
                : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
