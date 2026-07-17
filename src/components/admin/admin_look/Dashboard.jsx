import {
  GraduationCap,
  Bell,
  Database,
  Mail,
} from "lucide-react";

/* ===========================================
   Add these once, e.g. in index.html <head>:

   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
=========================================== */

const quickAccess = [
  {
    code: "N-01",
    label: "Notice board",
    hint: "Post & manage circulars",
    icon: Bell,
    href: "/admin/notice-control",
  },
  {
    code: "D-02",
    label: "Database",
    hint: "Student & staff records",
    icon: Database,
    href: "/admin/students-data",
  },
  {
    code: "E-03",
    label: "Enquiries",
    hint: "Admissions inbox",
    icon: Mail,
    href: "/admin/admission-enquiry",
  },
  {
    code: "P-04",
    label: "Payments",
    hint: "Courses & intake",
    icon: GraduationCap,
    href: "/admin/admin-payment",
  },
];

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "short",
  day: "numeric",
});

export default function Dashboard() {
  return (
    <div
      className="min-h-full space-y-10 pb-4"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* ===== HEADER ===== */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E1E3DE] pb-6">
        <div className="pl-5">
          <span
            className="text-[11px] tracking-[0.25em] uppercase text-[#A6763D]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Registrar's Overview
          </span>
          <h1
            className="text-4xl text-[#182333] mt-2"
            style={{ fontFamily: "Fraunces, serif", fontWeight: 600 }}
          >
            Welcome back, Admin
          </h1>
        </div>
        <span
          className="text-xs text-[#182333]/50 pr-5"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {today}
        </span>
      </div>

      {/* ===== QUICK ACCESS ===== */}
      <div className="flex flex-col pl-5 pr-5">
        <h2
          className="text-sm tracking-[0.2em] uppercase text-[#182333]/60 mb-4"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          Quick Access
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickAccess.map(({ code, label, hint, icon: Icon, href }) => (
            <a
              key={code}
              href={href}
              className="
                group relative block text-left
                bg-white border border-[#E1E3DE] rounded-sm
                px-5 pt-5 pb-6
                transition-all duration-200
                hover:border-[#A6763D]/50 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-8px_rgba(24,35,51,0.15)]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A6763D] focus-visible:ring-offset-2
              "
            >
              {/* catalog code */}
              <span
                className="absolute top-4 right-5 text-[11px] text-[#182333]/35 group-hover:text-[#A6763D] transition-colors"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {code}
              </span>

              <Icon
                className="text-[#182333] group-hover:text-[#A6763D] transition-colors"
                size={26}
                strokeWidth={1.75}
              />

              <div className="h-px w-8 bg-[#A6763D]/40 my-4" />

              <div
                className="text-base text-[#182333]"
                style={{ fontFamily: "Fraunces, serif", fontWeight: 600 }}
              >
                {label}
              </div>
              <div className="text-xs text-[#182333]/50 mt-1">{hint}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}