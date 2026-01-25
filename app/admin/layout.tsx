import { AdminSidebar, AdminTopbar } from "@/components/layout/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />
        <main className="flex-1 bg-gray-50 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
