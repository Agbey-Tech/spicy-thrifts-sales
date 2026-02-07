import { useState } from "react";
import { reverseOrder } from "@/lib/api/orders";
import { X, RotateCcw } from "lucide-react";

interface ReverseOrderModalProps {
  orderId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ReverseOrderModal({
  orderId,
  onClose,
  onSuccess,
}: ReverseOrderModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReverse = async () => {
    setLoading(true);
    setError(null);
    try {
      await reverseOrder(orderId);
      setLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to reverse order.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-[#7c377f]" />
            <h2 className="text-xl font-bold text-[#7c377f]">Reverse Order</h2>
          </div>
          <button
            className="p-2 hover:bg-[#fadadd] rounded-lg"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-[#7c377f]" />
          </button>
        </div>
        <p className="mb-6 text-black/70">
          Are you sure you want to reverse this order? This will restore product
          quantities and permanently delete the order and its items.
        </p>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}
        <div className="flex gap-3">
          <button
            className="flex-1 py-3 px-6 rounded-xl bg-[#7c377f] text-white font-bold hover:bg-[#6b316f] transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
            onClick={handleReverse}
            disabled={loading}
          >
            <RotateCcw className="w-5 h-5" />
            {loading ? "Reversing..." : "Reverse Order"}
          </button>
          <button
            className="flex-1 py-3 px-6 rounded-xl bg-white border-2 border-gray-300 text-gray-700 font-bold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 active:scale-95"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
