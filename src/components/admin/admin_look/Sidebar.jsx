import { memo } from "react";

import {
  LayoutDashboard,
  GraduationCap,
  Building2,
  CreditCard,
  Bell,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { NavLink } from "react-router-dom";

/* ==========================================
   MENU CONFIG
========================================== */

const MENUS = [
  { title: "Dashboard", icon: <LayoutDashboard size={19} />, path: "/admin/dashboard" },
  { title: "Fees Structure", icon: <GraduationCap size={19} />, path: "/admin/fees-structure-control" },
  { title: "Faculty", icon: <Building2 size={19} />, path: "/admin/sub-control" },
  { title: "Students", icon: <Users size={19} />, path: "/admin/students-data" },
  { title: "Payments", icon: <CreditCard size={19} />, path: "/admin/admin-payment" },
  { title: "Notices", icon: <Bell size={19} />, path: "/admin/notice-control" },
];

/* ==========================================
   SIDEBAR
   `collapsed` doubles as the mobile "closed" state:
   below lg it drives an off-canvas drawer, at lg+ it
   drives the icon-rail / full-width toggle.
========================================== */

function Sidebar({ collapsed, setCollapsed }) {
  return (
    <>
      {/* MOBILE BACKDROP */}
      {!collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0
          h-screen z-40
          flex flex-col
          bg-base-100 border-r border-base-300
          shadow-2xl lg:shadow-none
          transition-all duration-300
          overflow-hidden
          w-72
          ${collapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "translate-x-0 lg:w-72"}
        `}
      >
        {/* HEADER */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-base-300 shrink-0">
          {!collapsed && (
            <div className="min-w-0">
              <h2 className="font-serif font-bold text-base leading-tight truncate">Admin</h2>
              <p className="text-[11px] text-base-content/50 truncate">Management Portal</p>
            </div>
          )}

          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed(!collapsed)}
            className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border border-base-300 hover:bg-base-200 transition-colors duration-200"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Admin navigation">
          {MENUS.map((menu) => (
            <NavLink
              key={menu.path}
              to={menu.path}
              title={collapsed ? menu.title : ""}
              end
              className={({ isActive }) => `
                group relative flex items-center gap-3.5
                px-3.5 py-2.5 rounded-xl
                text-[13.5px] font-medium
                transition-all duration-200
                ${isActive
                  ? "bg-primary/10 text-primary"
                  : "text-base-content/65 hover:bg-base-200 hover:text-base-content"}
              `}
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-primary transition-opacity duration-200 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="shrink-0">{menu.icon}</span>
                  {!collapsed && <span className="truncate">{menu.title}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* FOOTER */}
        {!collapsed && (
          <footer className="shrink-0 border-t border-base-300 px-4 py-4 text-[11px] leading-relaxed text-base-content/50 text-center">
            &copy; {new Date().getFullYear()} ERP Dashboard
            <br />
            Created by Akash Poddar, Debalina Halder &amp; Pragyna Karmakar
          </footer>
        )}
      </aside>
    </>
  );
}

export default memo(Sidebar);