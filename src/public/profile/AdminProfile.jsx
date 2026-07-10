import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaFileAlt,
  FaSignOutAlt,
  FaUserShield,
  FaBell,
  FaDatabase,
  FaArrowRight,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

// Accent color for this role — echoed as a hairline strip on every card
const ACCENT = "#1E3A5F";

export default function AdminProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardItems = [
    {
      title: "Manage Content",
      description:
        "Update homepage, notices, events, banners, testimonials, and website content.",
      icon: <FaFileAlt className="text-2xl" />,
      badge: "CMS",
      path: "/admin/dashboard",
    },
    {
      title: "Manage Students",
      description:
        "Handle student accounts, profiles, admissions, ERP records, and academic data.",
      icon: <FaUsers className="text-2xl" />,
      badge: "ERP",
      path: "/admin/students-data",
    },
  ];

  const quickStats = [
    { title: "Role", value: "Administrator", icon: <FaUserShield /> },
    { title: "Notifications", value: "Active", icon: <FaBell /> },
    { title: "Database", value: "Connected", icon: <FaDatabase /> },
  ];

  return (
    <main className="min-h-screen bg-base-200">
      {/* TOP BAR — logout lives here, not in a card */}
      <header className="sticky top-0 z-10 border-b border-base-300 bg-base-100/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-base-content/50">
              ERP Console
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-error"
          >
            <FaSignOutAlt />
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-6">
        {/* PROFILE / ID CARD */}
        <div className="relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
          <div className="h-1.5 w-full" style={{ backgroundColor: ACCENT }} />

          {/* Role ribbon */}
          <div
            className="absolute right-6 top-5 rounded-full px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-widest text-white"
            style={{ backgroundColor: ACCENT }}
          >
            Admin
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl text-3xl font-bold text-white"
                style={{ backgroundColor: ACCENT }}
              >
                {user?.email?.charAt(0)?.toUpperCase() || "A"}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold tracking-tight text-base-content md:text-3xl">
                  System Administrator
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-base-content/60 md:text-base">
                  Full access to CMS, ERP modules, student management, faculty
                  management, notices, admissions, placements, and analytics.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                Active session
              </div>
            </div>

            {/* Inline quick facts */}
            <div className="mt-8 grid grid-cols-1 divide-y divide-base-300 border-t border-base-300 pt-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {quickStats.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 py-3 sm:py-0 sm:pl-6 first:sm:pl-0"
                >
                  <span className="text-lg text-base-content/40">
                    {item.icon}
                  </span>
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-widest text-base-content/40">
                      {item.title}
                    </div>
                    <div className="text-sm font-semibold text-base-content">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DASHBOARD MODULES */}
        <section>
          <div className="mb-5 flex items-baseline justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-base-content">
                Dashboard modules
              </h2>
              <p className="mt-1 text-sm text-base-content/50">
                Access and manage every section of your ERP system.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {dashboardItems.map((item, index) => (
              <DashboardCard
                key={index}
                title={item.title}
                description={item.description}
                icon={item.icon}
                badge={item.badge}
                path={item.path}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function DashboardCard({ title, description, icon, badge, path }) {
  const navigate = useNavigate();

  return (
    <div
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      onClick={() => navigate(path)}
    >
      <div className="h-1 w-full" style={{ backgroundColor: ACCENT }} />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between">
          <div className="text-base-content/70">{icon}</div>
          <span className="rounded-md bg-base-200 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-base-content/50">
            {badge}
          </span>
        </div>

        <h3 className="mt-4 text-lg font-bold tracking-tight text-base-content">
          {title}
        </h3>

        <p className="mt-1.5 flex-1 text-sm text-base-content/60">
          {description}
        </p>

        <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-base-content/70 transition-colors group-hover:text-base-content">
          Open module
          <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
}