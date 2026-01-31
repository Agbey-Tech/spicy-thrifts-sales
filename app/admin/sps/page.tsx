"use client";
import { useState } from "react";
import useSWR from "swr";
import { getSps, createSp, updateSp, deleteSp } from "@/lib/api/sp";
import { Package, Plus, Pencil, Trash2, X, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Sp } from "@/app/types/database";

export default function SpsPage() {
  const {
    data: sps,
    mutate,
    isLoading,
    error,
  } = useSWR("/api/sp", getSps, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [editSp, setEditSp] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [confirmDelete, setConfirmDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

  const handleSave = async (values: any) => {
    try {
      if (editSp) {
        await updateSp(editSp.id, values);
        toast.success("SP updated successfully");
      } else {
        await createSp(values);
        toast.success("SP created successfully");
      }
      setShowModal(false);
      setEditSp(null);
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Failed to save SP");
    }
  };

  const handleDelete = async (spId: string) => {
    setConfirmDelete(sps?.find((sp: any) => sp.id === spId) || null);
  };

  const confirmDeleteSp = async () => {
    if (!confirmDelete) return;
    try {
      await deleteSp(confirmDelete.id);
      toast.success("SP deleted successfully");
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete SP");
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fadadd] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#7c377f] p-3 rounded-xl shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#7c377f]">
                  Special Prices
                </h1>
                <p className="text-sm text-black/70">
                  Manage base prices for SP items
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-sm border-2 border-[#fadadd]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg transition-all font-bold ${viewMode === "grid" ? "bg-[#7c377f] text-white shadow-md" : "text-black hover:bg-[#fadadd]"}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-lg transition-all font-bold ${viewMode === "list" ? "bg-[#7c377f] text-white shadow-md" : "text-black hover:bg-[#fadadd]"}`}
                >
                  List
                </button>
              </div>
              {/* Add Button */}
              <button
                className="flex items-center gap-2 bg-[#7c377f] text-white px-4 py-3 rounded-xl font-semibold hover:bg-[#fadadd] hover:text-[#7c377f] transition-all duration-300 hover:shadow-lg active:scale-95"
                onClick={() => {
                  setEditSp(null);
                  setShowModal(true);
                }}
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">New SP</span>
              </button>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-[#fadadd] overflow-hidden">
          {isLoading && !sps ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">
                Loading special prices...
              </p>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sps?.map((sp: any) => (
                      <div
                        key={sp.id}
                        className="group relative bg-white border-2 border-[#fadadd] rounded-xl p-5 hover:border-[#7c377f] hover:shadow-lg transition-all duration-300"
                      >
                        {/* Icon & Actions */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="bg-[#7c377f] p-3 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                            <Package className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex gap-1">
                            <button
                              className="p-2 hover:bg-[#fadadd] rounded-lg transition-colors text-black hover:text-[#7c377f]"
                              onClick={() => {
                                setEditSp(sp);
                                setShowModal(true);
                              }}
                              title="Edit SP"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 hover:bg-[#fadadd] rounded-lg transition-colors text-black hover:text-red-600"
                              onClick={() => handleDelete(sp.id)}
                              title="Delete SP"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {/* Content */}
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-bold text-lg text-[#7c377f] mb-1 truncate">
                              {sp.name}
                            </h3>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <span className="text-xs text-gray-600 font-medium">
                              Base Price:
                            </span>
                            <span className="text-xs font-bold text-[#7c377f]">
                              GH₵{sp.base_price?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {!sps?.length && (
                      <div className="col-span-full flex flex-col items-center justify-center py-16">
                        <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-full p-8 mb-4">
                          <Package className="w-16 h-16 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#7c377f] mb-2">
                          No special prices yet
                        </h3>
                        <p className="text-sm text-black/60">
                          Create your first SP to get started
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* List View */}
              {viewMode === "list" && (
                <div className="overflow-x-auto p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#fadadd] border-b-2 border-[#fadadd]">
                        <th className="py-4 px-6 text-left text-sm font-bold text-[#7c377f]">
                          Name
                        </th>
                        <th className="py-4 px-6 text-left text-sm font-bold text-[#7c377f]">
                          Base Price
                        </th>
                        <th className="py-4 px-6 text-center text-sm font-bold text-[#7c377f] w-32">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sps?.map((sp: any) => (
                        <tr
                          key={sp.id}
                          className="border-b border-[#fadadd] hover:bg-[#fadadd] transition-all duration-200 group"
                        >
                          <td className="py-4 px-6 font-semibold text-[#7c377f]">
                            {sp.name}
                          </td>
                          <td className="py-4 px-6">
                            GH₵{sp.base_price?.toLocaleString()}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="p-2 hover:bg-[#fadadd] rounded-lg transition-colors text-black hover:text-[#7c377f]"
                                onClick={() => {
                                  setEditSp(sp);
                                  setShowModal(true);
                                }}
                                title="Edit SP"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                className="p-2 hover:bg-[#fadadd] rounded-lg transition-colors text-black hover:text-red-600"
                                onClick={() => handleDelete(sp.id)}
                                title="Delete SP"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {!sps?.length && (
                        <tr>
                          <td colSpan={3} className="py-16">
                            <div className="flex flex-col items-center justify-center text-center">
                              <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-full p-8 mb-4">
                                <Package className="w-16 h-16 text-gray-400" />
                              </div>
                              <h3 className="text-lg font-semibold text-[#7c377f] mb-2">
                                No special prices yet
                              </h3>
                              <p className="text-sm text-black/60">
                                Create your first SP to get started
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <SpModal
          initial={editSp}
          onClose={() => {
            setShowModal(false);
            setEditSp(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* Custom Confirm Delete Modal */}
      {confirmDelete && (
        <DeleteConfirmModal
          sp={confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onConfirm={confirmDeleteSp}
        />
      )}
    </div>
  );
}

function SpModal({
  initial,
  onClose,
  onSave,
}: {
  initial: any;
  onClose: () => void;
  onSave: (values: any) => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [basePrice, setBasePrice] = useState(initial?.base_price || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      await onSave({
        name,
        base_price: Number(basePrice),
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border-2 border-[#fadadd]">
        {/* Header */}
        <div className="bg-[#7c377f] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">
              {initial ? "Edit SP" : "New SP"}
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
              SP Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#fadadd] focus:border-[#7c377f] focus:ring-4 focus:ring-[#fadadd] transition-all outline-none"
              placeholder="Enter SP name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>
          {/* Base Price Input */}
          <div>
            <label className="block text-sm font-semibold text-[#7c377f] mb-2">
              Base Price
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#fadadd] focus:border-[#7c377f] focus:ring-4 focus:ring-[#fadadd] transition-all outline-none"
              placeholder="Enter base price"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              min={0}
              step={0.01}
              disabled={loading}
            />
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
              className="flex-1 px-4 py-3 rounded-xl bg-[#7c377f] text-white font-semibold hover:bg-[#fadadd] hover:text-[#7c377f] transition-all duration-300 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !name.trim() || !basePrice}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : (
                "Save SP"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({
  sp,
  onClose,
  onConfirm,
}: {
  sp: { id: string; name: string };
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border-2 border-[#fadadd]">
        <div className="px-6 py-6 flex flex-col items-center">
          <div className="bg-red-100 rounded-full p-4 mb-4">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-[#7c377f] mb-2">Delete SP?</h2>
          <p className="text-black/70 mb-6 text-center">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{sp.name}</span>? Deleting an SP
            will remove all products associated with it. This action cannot be
            undone.
          </p>
          <div className="flex gap-3 w-full">
            <button
              className="flex-1 px-4 py-3 rounded-xl bg-[#fadadd] text-black font-semibold hover:bg-[#7c377f] hover:text-white transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
              onClick={handleConfirm}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
