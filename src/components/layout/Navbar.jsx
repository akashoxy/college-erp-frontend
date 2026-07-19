import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoClose, IoChevronDown } from "react-icons/io5";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import AccessibilityButton from "../layout/AccessibilityButton";
import AccessibilityModal from "../layout/AccessibilityModal";

import tihLogo from "../../assets/images/tih-logo.png";

/* ==========================================
   NAV CONFIG — single source of truth
   Edit here; no need to touch JSX below.
========================================== */

const NAV_ITEMS = [
  {
    key: "home",
    label: "Home",
    items: [
      { to: "/about-us", label: "About Us" },
      { to: "/vision-mission", label: "Vision & Mission" },
      { to: "/awards", label: "Awards" },
    ],
  },
  {
    key: "academics",
    label: "Academics",
    items: [
      { to: "/mca-main", label: "M.C.A", group: "Academic Units" },
      { to: "/bba-main", label: "B.B.A" },
      { to: "/bca-main", label: "B.C.A" },
      { divider: true },
      { to: "/faculty-research", label: "Faculty & Research" },
      { to: "/aca-calendar", label: "Academic Calendar" },
      { to: "/list-holidays", label: "List of Holidays" },
    ],
  },
  {
    key: "facilities",
    label: "Facilities",
    items: [
      { to: "/anti-ragging", label: "Anti Ragging Cell" },
      { to: "/computer-laboratory", label: "Computer Laboratory" },
      { to: "/central-library", label: "Central Library" },
      { to: "/common", label: "Common Room" },
      { to: "/canteen", label: "College Canteen" },
      { to: "/journals", label: "Journals" },
      { to: "/jeca-main", label: "JECA" },
      { to: "/cet-main", label: "CET" },
      { to: "/radio-main", label: "Radio TIH" },
      { to: "/web-magazine", label: "Web Magazine" },
    ],
  },
  {
    key: "life",
    label: "Life at TIH",
    items: [
      { to: "/aca-works", label: "Academic Works" },
      { to: "/verbena", label: "Verbena (Cultural Fest)" },
      { to: "/spark-quest", label: "Spark Quest (Technical Fest)" },
      { to: "/sports", label: "Annual Sports Meet" },
    ],
  },
  {
    key: "admission",
    label: "Admission",
    width: "w-64",
    items: [
      { to: "/admission-procedure", label: "Admission" },
      { to: "/fees-structure", label: "Fees Structure" },
    ],
  },
  {
    key: "campus",
    label: "Campus Tour",
    width: "w-64",
    items: [
      { to: "/campus-placement", label: "Campus Placement" },
      { to: "/photo-gallery", label: "Photo Gallery" },
      { to: "/video-gallery", label: "Video Gallery" },
      { to: "/virtual-tour", label: "Campus Tour" },
    ],
  },
  {
    key: "student",
    label: "Student",
    width: "w-72",
    items: [
      { to: "/previous-question", label: "Previous Year Question" },
      { to: "/syllabus", label: "Syllabus" },
    ],
  },
];

const DIRECT_LINKS = [
  { to: "/contact", label: "Contact" },
  { to: "/circular-notice", label: "Notice" },
];

/* ==========================================
   REUSABLE DROPDOWN
========================================== */

const Dropdown = ({ title, menuKey, open, setOpen, children, width = "w-72" }) => {
  const isOpen = open === menuKey;

  return (
    <div
      className="relative h-full flex items-center"
      onPointerEnter={() => setOpen(menuKey)}
      onPointerLeave={() => setOpen(null)}
    >
      <button
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center gap-1 whitespace-nowrap text-[12px] font-semibold tracking-wide text-white/85 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-md px-1"
      >
        {title}
        <IoChevronDown
          size={12}
          aria-hidden="true"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-primary-content" : "opacity-60"}`}
        />
      </button>

      {/* Invisible bridge so the menu doesn't close when moving mouse from button to panel */}
      <div className="absolute left-0 top-full h-3 w-full" aria-hidden="true" />

      <div
        role="menu"
        className={`
          absolute left-0 top-full mt-3
          ${width}
          bg-base-100 text-base-content
          border border-base-300 shadow-2xl rounded-2xl p-2.5 z-50
          transition-all duration-200 origin-top
          ${isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"}
        `}
      >
        <div className="flex flex-col gap-0.5">{children}</div>
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
      group relative flex items-center
      pl-4 pr-3 py-2.5 rounded-xl
      text-base-content/80
      hover:bg-primary/8 hover:text-primary
      transition-all duration-200
      text-[13.5px] font-medium
    "
  >
    <span className="absolute left-1.5 w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    {children}
  </Link>
);

/* ==========================================
   GROUP LABEL (dropdown section header)
========================================== */

const GroupLabel = ({ label }) => (
  <p className="px-4 pt-2 pb-1 text-[10.5px] font-bold uppercase tracking-widest text-base-content/40">
    {label}
  </p>
);

/* ==========================================
   NAVBAR
========================================== */

function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isLoginPage = location.pathname === "/login";

  const [open, setOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Close mobile menu on route change
  useEffect(() => {
    closeMobile();
  }, [location.pathname, closeMobile]);

  // Subtle elevation once the page scrolls
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Trap focus & close on Escape for mobile sidebar
  const sidebarRef = useRef(null);
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeMobile();
    };
    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll while sidebar is open
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen, closeMobile]);

  return (
    <>
      {/* NAVBAR */}
      <header
        className={`
          sticky top-0 z-50 h-18 md:h-20
          bg-linear-to-r from-slate-900 via-primary to-slate-900
          text-white border-b border-white/10 backdrop-blur
          transition-shadow duration-300
          ${scrolled ? "shadow-lg shadow-black/10" : "shadow-none"}
        `}
      >
        <nav
          className="max-w-362.5 mx-auto h-full px-4 sm:px-6 flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 shrink-0 min-w-0">
            <div className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden bg-white/10 ring-1 ring-white/20 flex items-center justify-center shrink-0">
              <img
                src={tihLogo}
                alt="Techno India Hooghly"
                width={40}
                height={40}
                loading="eager"
                decoding="async"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover"
              />
            </div>
            <div className="hidden sm:block min-w-0">
              <h2 className="font-serif text-sm md:text-base font-bold tracking-wide truncate">
                Techno College Hooghly
              </h2>
              <p className="text-[11px] text-white/60 truncate">A Technical &amp; Management College</p>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden xl:flex items-center gap-4 h-full">
            {NAV_ITEMS.map(({ key, label, items, width }) => (
              <Dropdown
                key={key}
                title={label}
                menuKey={key}
                open={open}
                setOpen={setOpen}
                width={width}
              >
                {items.map((item, idx) => {
                  if (item.divider) {
                    return <div key={`divider-${idx}`} className="h-px bg-base-300 my-1.5 mx-1" />;
                  }
                  if (item.group) {
                    return (
                      <React.Fragment key={item.to}>
                        <GroupLabel label={item.group} />
                        <MenuItem to={item.to}>{item.label}</MenuItem>
                      </React.Fragment>
                    );
                  }
                  return (
                    <MenuItem key={item.to} to={item.to}>
                      {item.label}
                    </MenuItem>
                  );
                })}
              </Dropdown>
            ))}

            {DIRECT_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="whitespace-nowrap text-[12px] font-semibold tracking-wide text-white/85 hover:text-white transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-2 sm:gap-3 2xl:gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="hidden md:flex w-10 h-10 rounded-full items-center justify-center border border-white/15 hover:bg-white/10 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              aria-label={theme === "sunset" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "sunset" ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <AccessibilityButton onClick={() => setAccessibilityOpen(true)} />

            {/* Auth button — desktop */}
            {!isLoginPage && (
              <Link
                to={user ? "/profile" : "/login"}
                className="hidden md:inline-flex items-center h-10 px-5 rounded-full bg-white text-primary text-[13px] font-semibold hover:bg-white/90 transition-colors duration-200"
              >
                {user ? user.name || "Profile" : "Login"}
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="xl:hidden w-10 h-10 rounded-xl border border-white/15 flex items-center justify-center hover:bg-white/10 transition-colors duration-200"
            >
              <HiOutlineMenuAlt3 size={22} />
            </button>
          </div>
        </nav>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <div
        className={`
          fixed inset-0 z-60 xl:hidden
          transition-all duration-200
          ${mobileOpen ? "visible opacity-100" : "invisible opacity-0"}
        `}
        aria-modal="true"
        role="dialog"
        aria-label="Mobile navigation"
      >
        {/* Backdrop */}
        <div
          onClick={closeMobile}
          aria-hidden="true"
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`
            absolute top-0 right-0
            w-[88%] max-w-sm h-screen
            bg-base-100 border-l border-base-300 shadow-2xl
            flex flex-col
            transition-transform duration-200
            ${mobileOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {/* MOBILE HEADER */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-base-300 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={tihLogo}
                alt="Techno India Hooghly logo"
                width={40}
                height={40}
                loading="lazy"
                decoding="async"
                className="w-10 h-10 object-contain rounded-full"
              />
              <div className="min-w-0">
                <p className="font-serif font-bold text-sm truncate">Techno India Hooghly</p>
                <p className="text-xs text-base-content/60 truncate">Management College</p>
              </div>
            </div>

            <button
              onClick={closeMobile}
              aria-label="Close menu"
              className="w-10 h-10 shrink-0 rounded-xl border border-base-300 flex items-center justify-center hover:bg-base-200 transition-colors duration-200"
            >
              <IoClose size={22} />
            </button>
          </div>

          {/* MOBILE LINKS — flat list derived from NAV_ITEMS */}
          <nav className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-1" aria-label="Mobile navigation links">
            <MenuItem to="/" onClick={closeMobile}>Home</MenuItem>

            {/* Render each nav group as a labelled section */}
            {NAV_ITEMS.map(({ key, label, items }) => (
              <React.Fragment key={key}>
                <p className="mt-4 mb-1 px-4 text-[10.5px] font-bold uppercase tracking-widest text-base-content/40">
                  {label}
                </p>
                {items
                  .filter((item) => !item.divider)
                  .map((item) => (
                    <MenuItem key={item.to} to={item.to} onClick={closeMobile}>
                      {item.label}
                    </MenuItem>
                  ))}
              </React.Fragment>
            ))}

            <p className="mt-4 mb-1 px-4 text-[10.5px] font-bold uppercase tracking-widest text-base-content/40">
              More
            </p>
            {DIRECT_LINKS.map(({ to, label }) => (
              <MenuItem key={to} to={to} onClick={closeMobile}>
                {label}
              </MenuItem>
            ))}
          </nav>

          {/* MOBILE FOOTER ACTIONS */}
          <div className="shrink-0 border-t border-base-300 p-5 flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-11 h-11 rounded-xl border border-base-300 flex items-center justify-center hover:bg-base-200 transition-colors duration-200"
              aria-label={theme === "sunset" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "sunset" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {!isLoginPage && (
              <Link
                to={user ? "/profile" : "/login"}
                onClick={closeMobile}
                className="flex-1 inline-flex items-center justify-center h-11 rounded-xl bg-primary text-primary-content font-semibold text-sm"
              >
                {user ? user.name || "Profile" : "Login"}
              </Link>
            )}
          </div>
        </div>
      </div>

      <AccessibilityModal
        open={accessibilityOpen}
        onClose={() => setAccessibilityOpen(false)}
      />
    </>
  );
}

export default Navbar;