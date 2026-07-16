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

   Desktop only — `hidden lg:flex`. There is no fixed,
   off-canvas, or backdrop variant here anymore: on phones
   and tablets this component renders nothing at all, and
   AdminNavbar's own drawer (with the complete section list)
   is the single source of mobile navigation. That removes
   the old failure mode where the sidebar could load "open"
   as a fixed overlay and obscure the navbar underneath it.

   `collapsed` only ever affects the `lg` rail: full width
   with labels, or icon-only.
========================================== */

function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside
      className={`
        hidden lg:sticky lg:top-0 lg:flex
        h-screen shrink-0 flex-col
        bg-base-100 border-r border-base-300
        transition-[width] duration-300 ease-out
        ${collapsed ? "lg:w-14" : "lg:w-52"}
      `}
    >
      {/* BRAND */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-base-300 shrink-0">
        <div
          className="w-9 h-9 rounded-xl bg-primary text-primary-content flex items-center justify-center font-serif font-black text-[12px] tracking-wide shrink-0"
          aria-hidden="true"
        >
          TCH
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <h2 className="font-serif font-bold text-[15px] leading-tight truncate">
              Admin Console
            </h2>
            <p className="text-[11px] text-base-content/50 truncate">
              Management Portal
            </p>
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Primary admin navigation">
        {!collapsed && (
          <p className="px-3.5 pb-2 text-[10.5px] font-bold uppercase tracking-widest text-base-content/40">
            Quick access
          </p>
        )}

        {MENUS.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            title={collapsed ? menu.title : undefined}
            end
            className={({ isActive }) => `
              group relative flex items-center gap-3.5
              ${collapsed ? "justify-center px-0" : "px-3.5"}
              py-2.5 rounded-xl
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

      {/* COLLAPSE TOGGLE */}
      <div className="shrink-0 border-t border-base-300 p-3">
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed(!collapsed)}
          className={`
            w-full h-10 rounded-xl border border-base-300
            flex items-center justify-center gap-2
            text-base-content/60 hover:bg-base-200 hover:text-base-content
            transition-colors duration-200
          `}
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <>
              <ChevronLeft size={16} />
              <span className="text-[12.5px] font-semibold">Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* FOOTER */}
      {!collapsed && (
        <footer className="shrink-0 border-t border-base-300 px-4 py-4 text-[11px] leading-relaxed text-base-content/45 text-center">
          &copy; {new Date().getFullYear()} ERP Dashboard
          <br />
          Crafted by Akash Poddar, Debalina Halder &amp; Pragyna Karmakar
        </footer>
      )}
    </aside>
  );
}

export default memo(Sidebar);