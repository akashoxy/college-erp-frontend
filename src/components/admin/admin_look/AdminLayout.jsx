import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout() {
  // Defaults to collapsed (icon-only) so the navbar always has
  // maximum available width on first load. The admin can still
  // expand it manually via the toggle in Sidebar's footer.
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex min-h-screen bg-base-200/30">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 min-w-0 flex flex-col">
        <AdminNavbar />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}