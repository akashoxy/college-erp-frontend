import { useState, useCallback, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";

/* ==========================================
   NAV CONFIG — single source of truth
   Add / remove admin sections here only.
========================================== */

const NAV_ITEMS = [
  {
    key: "home",
    label: "Home",
    items: [
      { to: "/admin/dashboard", label: "Dashboard" },
      { to: "/admin/aboutus-control", label: "About Us" },
      { to: "/admin/award-control", label: "Awards" },
      { to: "/admin/homepage", label: "Homepage Control" },
      { to: "/admin/visionmission-control", label: "Vision & Mission" },
      { to: "/admin/approval-control", label: "Approval Control" },
    ],
  },
  {
    key: "academics",
    label: "Academics",
    items: [
      { to: "/admin/bba", label: "B.B.A Control" },
      { to: "/admin/bca", label: "B.C.A Control" },
      { to: "/admin/mca", label: "M.C.A Control" },
      { to: "/admin/research-control", label: "Faculty & Research" },
      { to: "/admin/aca-control", label: "Academic Calendar" },
      { to: "/admin/holiday-control", label: "Holiday Control" },
    ],
  },
  {
    key: "facilities",
    label: "Facilities",
    items: [
      { to: "/admin/cet", label: "CET Control" },
      { to: "/admin/jeca", label: "JECA Control" },
      { to: "/admin/radiotih", label: "Radio TIH" },
      { to: "/admin/webmagazine-control", label: "Web Magazine" },
      { to: "/admin/library-control", label: "Central Library" },
      { to: "/admin/computer-laboratory", label: "Computer Laboratory" },
      { to: "/admin/antiragging-control", label: "Anti Ragging" },
      { to: "/admin/journal-control", label: "Journal Control" },
      { to: "/admin/common-control", label: "Common Control" },
    ],
  },
  {
    key: "life-at-tih",
    label: "Life at TIH",
    items: [
      { to: "/admin/sports-control", label: "Sports" },
      { to: "/admin/academic-work-control", label: "Academic Work" },
      { to: "/admin/spark-control", label: "Spark Quest" },
      { to: "/admin/verbena-control", label: "Verbena" },
    ],
  },
  {
    key: "admission",
    label: "Admission",
    items: [
      { to: "/admin/fees-structure-control", label: "Fees Structure" },
      { to: "/admin/admission-control", label: "Admission CMS" },
      { to: "/admin/admin-payment", label: "Fees Database" },
      { to: "/admin/admission-enquiry", label: "Admission-Enquiry" },
    ],
  },
  {
    key: "campus-tour",
    label: "Campus Tour",
    items: [
      { to: "/admin/videogallery-control", label: "Video Gallery" },
      { to: "/admin/photo-control", label: "Photo Gallery" },
      { to: "/admin/placement-control", label: "Placement Control" },
    ],
  },
  {
    key: "faculty",
    label: "Faculty",
    items: [
      { to: "/admin/sub-management", label: "Subject Management" },
      { to: "/admin/sub-control", label: "Faculty Subject" },
      { to: "/admin/attendance-control", label: "Attendance Report" },
    ],
  },
  {
    key: "student",
    label: "Student",
    items: [
      { to: "/admin/students-data", label: "Student Database" },
      { to: "/admin/pyq-control", label: "Previous Year Questions" },
      { to: "/admin/syllabus-control", label: "Syllabus Control" },
    ],
  },
];

const DIRECT_LINKS = [
  { to: "/admin/contactenquiry-control", label: "Contact Enquiry" },
  { to: "/admin/notice-control", label: "Notice" },
];

const AUTH_KEYS = ["token", "user"];

/* ==========================================
   DESKTOP DROPDOWN

   Sizing steps down at `lg` (tightest available width,
   especially when the sidebar is expanded) and steps back
   up at `xl` and `2xl` as more room becomes available.
========================================== */

const Dropdown = ({ title, menuKey, open, setOpen, active, children }) => {
  const isOpen = open === menuKey;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(menuKey)}
      onMouseLeave={() => setOpen(null)}
    >
      <button
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`
          h-10 px-1.5 lg:px-1.5 xl:px-2 2xl:px-2.5
          flex items-center gap-1 shrink-0
          text-[12px] lg:text-[12px] xl:text-[12.5px] 2xl:text-[13px]
          font-semibold tracking-wide whitespace-nowrap rounded-lg
          transition-colors duration-200
          hover:text-primary
          ${isOpen || active ? "text-primary" : "text-base-content/75"}
        `}
      >
        {title}
        <ChevronDown
          size={12}
          aria-hidden="true"
          className={`transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : "opacity-50"}`}
        />
      </button>

      {/* Invisible bridge — prevents menu closing when moving mouse from button to panel */}
      <div className="absolute left-0 top-full h-2 w-full" aria-hidden="true" />

      <div
        role="menu"
        className={`
          absolute left-0 top-full pt-2 z-[70]
          transition-all duration-200
          ${isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"}
        `}
      >
        <div className="w-80 max-w-[85vw] max-h-[70vh] overflow-y-auto rounded-2xl bg-base-100 border border-base-300 shadow-2xl p-2.5">
          <div className="flex flex-col gap-0.5">{children}</div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   MENU ITEM
========================================== */

const MenuItem = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    role="menuitem"
    className="
      group flex items-center justify-between
      px-4 py-2.5 rounded-xl
      text-[13.5px] font-medium text-base-content/80
      hover:bg-primary/8 hover:text-primary
      transition-all duration-200
    "
  >
    {children}
  </Link>
);

/* ==========================================
   ADMIN NAVBAR

   Breakpoint policy: everything below `lg` uses the
   hamburger + full-screen drawer. Everything `lg` and up
   uses the inline dropdown nav — matching Sidebar's own
   `lg:flex` breakpoint exactly, so there's no width range
   where both the drawer and desktop rail try to own
   navigation at once.

   No scrolling and no clipping on the inline nav row:
   sizing instead steps down at `lg` (tightest available
   width, especially with an expanded sidebar) and steps
   back up at `xl`/`2xl` as more room becomes available.
========================================== */

export default function AdminNavbar() {
  const [open, setOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close any open dropdown / mobile drawer on route change
  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = useCallback(() => {
    AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
    navigate("/");
  }, [navigate]);

  const handleBackToProfile = useCallback(() => {
    navigate("/admin/profile");
  }, [navigate]);

  const isGroupActive = (items) =>
    items.some((item) => location.pathname.startsWith(item.to));

  return (
    <>
      <header className="sticky top-0 z-50 bg-base-100/95 backdrop-blur border-b border-base-300">
        <div className="flex items-center justify-between gap-2 lg:gap-3 xl:gap-4 px-4 sm:px-6 h-16">

          {/* Left cluster — menu, primary nav */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              className="lg:hidden w-9 h-9 -ml-1 rounded-lg flex items-center justify-center hover:bg-base-200 transition-colors duration-200 shrink-0"
            >
              <Menu size={20} />
            </button>

            <nav
              aria-label="Admin navigation"
              className="
                hidden lg:flex items-center gap-0
                min-w-0 flex-1 flex-nowrap
              "
            >
              {NAV_ITEMS.map(({ key, label, items }) => (
                <div key={key} className="shrink-0">
                  <Dropdown
                    title={label}
                    menuKey={key}
                    open={open}
                    setOpen={setOpen}
                    active={isGroupActive(items)}
                  >
                    {items.map(({ to, label: itemLabel }) => (
                      <MenuItem key={to} to={to}>
                        {itemLabel}
                      </MenuItem>
                    ))}
                  </Dropdown>
                </div>
              ))}

              {DIRECT_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`
                    h-10 px-1.5 lg:px-1.5 xl:px-2 2xl:px-3 rounded-lg flex items-center shrink-0
                    text-[12px] lg:text-[12px] xl:text-[12.5px] 2xl:text-[13px]
                    font-semibold whitespace-nowrap
                    transition-colors duration-200
                    ${location.pathname.startsWith(to)
                      ? "text-primary"
                      : "text-base-content/75 hover:bg-base-200 hover:text-primary"}
                  `}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handleBackToProfile}
              className="
                h-9 pl-2.5 pr-3 xl:pl-3 xl:pr-3.5 rounded-full
                flex items-center gap-1.5
                border border-base-300
                text-[12px] xl:text-[12.5px] font-semibold text-base-content/70
                hover:border-primary/40 hover:text-primary hover:bg-primary/5
                transition-colors duration-200
                shrink-0
              "
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Back to Profile</span>
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE / TABLET DRAWER — everything below `lg` */}
      <div
        className={`
          fixed inset-0 z-[60] lg:hidden overflow-hidden
          transition-all duration-200
          ${mobileOpen ? "visible opacity-100" : "invisible opacity-0"}
        `}
        aria-modal="true"
        role="dialog"
        aria-label="Admin navigation menu"
      >
        <div
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        <div
          className={`
            absolute top-0 left-0
            w-[85%] max-w-[320px] h-dvh max-h-dvh
            bg-base-100 border-r border-base-300 shadow-2xl
            flex flex-col overflow-hidden
            transition-transform duration-200 will-change-transform
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="flex items-center justify-between px-5 py-5 border-b border-base-300 shrink-0">
            <h1 className="font-serif text-lg font-black text-primary tracking-tight">TIH ERP</h1>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="w-10 h-10 rounded-xl border border-base-300 flex items-center justify-center hover:bg-base-200 transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-5 py-5 flex flex-col gap-1" aria-label="Mobile admin navigation">
            <MenuItem to="/admin/profile" onClick={() => setMobileOpen(false)}>
              <span className="flex items-center gap-2">
                <ArrowLeft size={15} />
                Back to Profile
              </span>
            </MenuItem>

            {NAV_ITEMS.map(({ key, label, items }) => (
              <div key={key} className="mb-2">
                <p className="mb-1 px-4 text-[10.5px] font-bold uppercase tracking-widest text-base-content/40">
                  {label}
                </p>
                {items.map(({ to, label: itemLabel }) => (
                  <MenuItem key={to} to={to} onClick={() => setMobileOpen(false)}>
                    {itemLabel}
                  </MenuItem>
                ))}
              </div>
            ))}

            <p className="mb-1 px-4 text-[10.5px] font-bold uppercase tracking-widest text-base-content/40">
              More
            </p>
            {DIRECT_LINKS.map(({ to, label }) => (
              <MenuItem key={to} to={to} onClick={() => setMobileOpen(false)}>
                {label}
              </MenuItem>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}