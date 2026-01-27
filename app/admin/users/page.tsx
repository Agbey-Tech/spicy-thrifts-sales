"use client";

import { useState, Fragment } from "react";
import { toast } from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import { Plus, Pencil, X, Users, Search } from "lucide-react";
import { createUser, listUsers, updateUser } from "@/lib/api/auth";
import useSWR from "swr";

type User = {
  id: string;
  email: string;
  full_name: string;
  role: "ADMIN" | "SALES";
  is_active: boolean;
};

const initialEditState = {
  id: "",
  full_name: "",
  role: "SALES" as "ADMIN" | "SALES",
  is_active: true,
};

const initialAddState = {
  email: "",
  password: "",
  full_name: "",
  role: "SALES" as "ADMIN" | "SALES",
};

export default function AdminUsersPage() {
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState(initialEditState);
  const [addUser, setAddUser] = useState(initialAddState);
  const [searchQuery, setSearchQuery] = useState("");

  // Use SWR for fetching and mutating users
  const {
    data: users = [],
    mutate,
    isLoading: loading,
    error,
  } = useSWR<User[]>("/api/auth", listUsers, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: false,
  });

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      "",
  );

  // Handle edit
  const openEdit = (user: User) => {
    setEditUser({
      id: user.id,
      full_name: user.full_name || "",
      role: user.role,
      is_active: user.is_active,
    });
    setEditOpen(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.checked;
    setEditUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.promise(
      updateUser(editUser.id, {
        full_name: editUser.full_name,
        role: editUser.role,
        is_active: editUser.is_active,
      }).then(async () => {
        await mutate();
        setEditOpen(false);
      }),
      {
        loading: "Updating user...",
        success: "User updated!",
        error: "Failed to update user",
      },
    );
  };

  // Handle add
  const handleAddChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setAddUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.promise(
      createUser(addUser).then(async () => {
        await mutate();
        setAddOpen(false);
        setAddUser(initialAddState);
      }),
      {
        loading: "Creating user...",
        success: "User created!",
        error: "Failed to create user",
      },
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-8 h-8" />
                Manage Users
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Add, edit, and manage user accounts
              </p>
            </div>
            <button
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="w-5 h-5" />
              Add User
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors bg-white"
            />
          </div>
        </div>

        {/* Users Grid/Table - Responsive */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                      <p className="mt-2 text-gray-500">Loading users...</p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      {searchQuery
                        ? "No users match your search."
                        : "No users found."}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {user.full_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            user.role === "ADMIN"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.is_active ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          onClick={() => openEdit(user)}
                          title="Edit User"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-200">
            {loading ? (
              <div className="px-6 py-12 text-center">
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
                <p className="mt-2 text-gray-500">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                {searchQuery
                  ? "No users match your search."
                  : "No users found."}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {user.full_name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                    </div>
                    <button
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => openEdit(user)}
                      title="Edit User"
                    >
                      <Pencil size={18} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        user.role === "ADMIN"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                    {user.is_active ? (
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">
              Total Users
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {users.length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">
              Active Users
            </p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {users.filter((u) => u.is_active).length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">
              Admins
            </p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              {users.filter((u) => u.role === "ADMIN").length}
            </p>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      <Transition appear show={editOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setEditOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 shadow-2xl transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <Dialog.Title className="text-2xl font-bold text-gray-900">
                      Edit User
                    </Dialog.Title>
                    <button
                      onClick={() => setEditOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={editUser.full_name}
                        onChange={handleEditChange}
                        minLength={2}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Role
                      </label>
                      <select
                        name="role"
                        value={editUser.role}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors cursor-pointer"
                        required
                      >
                        <option value="ADMIN">Administrator</option>
                        <option value="SALES">Sales Associate</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={editUser.is_active}
                        onChange={handleEditChange}
                        id="is_active"
                        className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                      />
                      <label
                        htmlFor="is_active"
                        className="text-sm font-semibold text-gray-700 uppercase tracking-wide cursor-pointer"
                      >
                        User is Active
                      </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        className="flex-1 px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors"
                        onClick={() => setEditOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={submitEdit}
                        className="flex-1 px-6 py-3 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-semibold transition-colors shadow-lg"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Add User Modal */}
      <Transition appear show={addOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setAddOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 shadow-2xl transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <Dialog.Title className="text-2xl font-bold text-gray-900">
                      Add New User
                    </Dialog.Title>
                    <button
                      onClick={() => setAddOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={addUser.email}
                        onChange={handleAddChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors"
                        placeholder="user@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={addUser.password}
                        onChange={handleAddChange}
                        minLength={6}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors"
                        placeholder="••••••••"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Minimum 6 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={addUser.full_name}
                        onChange={handleAddChange}
                        minLength={2}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Role
                      </label>
                      <select
                        name="role"
                        value={addUser.role}
                        onChange={handleAddChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors cursor-pointer"
                        required
                      >
                        <option value="SALES">Sales Associate</option>
                        <option value="ADMIN">Administrator</option>
                      </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        className="flex-1 px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors"
                        onClick={() => setAddOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={submitAdd}
                        className="flex-1 px-6 py-3 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-semibold transition-colors shadow-lg"
                      >
                        Create User
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
