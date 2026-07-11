import { memo, useState } from "react";
import { Outlet } from "react-router-dom";

import AdminNavbar from "./AdminNavbar";
import Sidebar from "./Sidebar";


function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-base-200">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <header className="shrink-0">
          <AdminNavbar />
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          <section className="min-h-full rounded-3xl border border-base-300 bg-base-100 shadow-sm p-6">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}

export default memo(AdminLayout);