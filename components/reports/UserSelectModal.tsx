import { useEffect, useState } from "react";
import { listUsers } from "@/lib/api/auth";
import { X } from "lucide-react";

interface UserSelectModalProps {
  onSelect: (userId: string | null) => void;
  onClose: () => void;
}

export function UserSelectModal({ onSelect, onClose }: UserSelectModalProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch users.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#7c377f]">Select User</h2>
          <button
            className="p-2 hover:bg-[#fadadd] rounded-lg"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-[#7c377f]" />
          </button>
        </div>
        {loading ? (
          <div className="text-center py-8 text-[#7c377f]">
            Loading users...
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        ) : (
          <div className="space-y-3">
            <button
              className="w-full py-2 px-4 rounded-lg bg-[#fadadd] text-[#7c377f] font-semibold border border-[#7c377f] hover:bg-[#7c377f] hover:text-white transition-colors"
              onClick={() => onSelect(null)}
            >
              All Users
            </button>
            {users.map((user) => (
              <button
                key={user.id}
                className="w-full py-2 px-4 rounded-lg bg-white text-[#7c377f] font-semibold border border-[#fadadd] hover:bg-[#fadadd] hover:text-[#7c377f] transition-colors"
                onClick={() => onSelect(user.id)}
              >
                {user.full_name} ({user.email})
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
