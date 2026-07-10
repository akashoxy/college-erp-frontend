import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { FiMail, FiPhone, FiArrowUpRight } from "react-icons/fi";

import tihlogo from "../../assets/images/tih-logo.png";

/* ==========================================
   CONSTANTS
========================================== */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SOCIAL_LINKS = [
  { icon: <FaFacebookF />, label: "Facebook", url: "#" },
  { icon: <FaWhatsapp />, label: "WhatsApp", url: "#" },
  { icon: <FaTwitter />, label: "Twitter", url: "#" },
  { icon: <FaPinterestP />, label: "Pinterest", url: "#" },
  { icon: <FaLinkedinIn />, label: "LinkedIn", url: "#" },
];

/**
 * All footer link sections — single source of truth.
 * To add/remove a link, edit here only.
 */
const FOOTER_SECTIONS = [
  {
    title: "Home",
    links: [
      { to: "/about-us", label: "About Us" },
      { to: "/vision-mission", label: "Vision & Mission" },
      { to: "/circular-notice", label: "Circular & Notices" },
      { to: "/awards", label: "Awards" },
    ],
  },
  {
    title: "Academics",
    links: [
      { to: "/mca-main", label: "MCA" },
      { to: "/bba-main", label: "BBA" },
      { to: "/bca-main", label: "BCA" },
      { to: "/faculty-research", label: "Research" },
      { to: "/aca-calendar", label: "Academic Calendar" },
      { to: "/list-holidays", label: "List of Holidays" },
    ],
  },
  {
    title: "Facilities",
    links: [
      { to: "/anti-ragging", label: "Anti Ragging Cell" },
      { to: "/computer-laboratory", label: "Computer Laboratory" },
      { to: "/central-library", label: "Central Library" },
      { to: "/common", label: "Common Room" },
      { to: "/canteen", label: "College Canteen" },
      { to: "/journals", label: "Journals" },
      { to: "/jeca-main", label: "JECA" },
      { to: "/cet-main", label: "CET" },
      { to: "/radio-tih", label: "Radio TIH" },
      { to: "/web-magazine", label: "Web Magazine" },
    ],
  },
  {
    title: "Student",
    links: [
      { to: "/previous-question", label: "Previous Year Question Papers" },
      { to: "/syllabus", label: "Syllabus" },
      { to: "/fees-payment", label: "Fees Payment" },
    ],
  },
  {
    title: "Life At TIH",
    links: [
      { to: "/aca-works", label: "Academic Works" },
      { to: "/verbena", label: "Verbena Festival" },
      { to: "/spark-quest", label: "Spark Quest" },
      { to: "/sports", label: "Annual Sports Meet" },
    ],
  },
  {
    title: "Admission",
    links: [
      { to: "/admission-procedure", label: "Admission Procedure" },
      { to: "/fees-structure", label: "Fees Structure" },
    ],
  },
  {
    title: "Campus Tour",
    links: [
      { to: "/campus-placement", label: "Campus Placement" },
      { to: "/photo-gallery", label: "Photo Gallery" },
      { to: "/video-gallery", label: "Video Gallery" },
      { to: "/virtual-tour", label: "Campus Tour" },
    ],
  },
];

const LEGAL_LINKS = [
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/sitemap", label: "Sitemap" },
];

/* ==========================================
   HELPERS
========================================== */

/**
 * Resolve an approval logo URL.
 * If the logo is already absolute (starts with http), use it directly.
 * Otherwise prepend the API base URL.
 */
const resolveLogoUrl = (logo) =>
  logo?.startsWith("http") ? logo : `${API_URL}${logo}`;

/* ==========================================
   SUB-COMPONENTS
========================================== */

const FooterSection = ({ title, links }) => (
  <div className="flex flex-col gap-3.5">
    <h3 className="font-serif text-[0.95rem] font-semibold tracking-wide text-base-content/90 relative pb-2">
      {title}
      <span className="absolute left-0 bottom-0 h-px w-8 bg-primary/60" />
    </h3>
    <div className="flex flex-col gap-2.5">
      {links.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          className="group flex items-center gap-1.5 text-[13.5px] text-base-content/60 hover:text-primary transition-colors duration-300 w-fit"
        >
          <span className="h-1 w-1 rounded-full bg-base-content/25 group-hover:bg-primary transition-colors duration-300 shrink-0" />
          <span className="border-b border-transparent group-hover:border-primary/40 leading-snug">
            {label}
          </span>
        </Link>
      ))}
    </div>
  </div>
);

/* ==========================================
   FOOTER
========================================== */

export default function Footer() {
  const [approvals, setApprovals] = useState([]);
  const [visitorCount, setVisitorCount] = useState(0);

  // Fetch approvals and visitor count in parallel
  useEffect(() => {
    const fetchData = async () => {
      const [approvalsResult, visitorsResult] = await Promise.allSettled([
        axios.get(`${API_URL}/api/approvals`),
        axios.get(`${API_URL}/api/visitors/count`),
      ]);

     if (approvalsResult.status === "fulfilled") {
  const response = approvalsResult.value.data;

  setApprovals(
    response?.data?.approvals || []
  );
} else {
  setApprovals([]);
}

      if (visitorsResult.status === "fulfilled") {
        setVisitorCount(visitorsResult.value.data?.count ?? 0);
      } else {
        console.error("[Footer] Failed to load visitor count:", visitorsResult.reason);
      }
    };

    fetchData();
  }, []); // API_URL is a module-level constant, safe to omit from deps

  return (
    <footer className="relative overflow-hidden bg-linear-to-r from-base-300 via-primary/20 to-secondary/20 backdrop-blur-xl text-base-content border-t border-base-content/10">

      {/* BACKGROUND GLOWS */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* TOP BAR — social + phone */}
        <div className="py-6 border-b border-base-content/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

            {/* Social icons */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-base-content/50 hidden sm:block">
                Follow Us
              </span>
              <div className="flex gap-2.5">
                {SOCIAL_LINKS.map(({ icon, label, url }) => (
                  <a
                    key={label}
                    href={url}
                    aria-label={label}
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-base-100/5 border border-base-content/10 text-base-content/70 hover:bg-primary hover:text-primary-content hover:border-primary hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Phone */}
            <a
              href="tel:+913326802389"
              className="flex items-center gap-3 text-sm font-medium text-base-content/80 hover:text-primary transition-colors duration-300"
            >
              <span className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                <FiPhone size={14} aria-hidden="true" />
              </span>
              (+91) 33 2680 2389
            </a>

          </div>
        </div>

        {/* MAIN GRID */}
        <div className="py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">

            {/* COLLEGE INFO */}
            <div className="lg:col-span-4">
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">

                {/* Logo */}
                <div className="w-20 h-20 rounded-full overflow-hidden bg-base-100 ring-1 ring-primary/30 ring-offset-4 ring-offset-neutral shadow-lg mb-6">
                  <img
                    src={tihlogo}
                    alt="Techno India Hooghly"
                    width={80}
                    height={80}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>

                <h2 className="font-serif text-2xl font-bold tracking-tight">
                  Techno College Hooghly
                </h2>

                <p className="mt-4 text-sm leading-relaxed text-base-content/60 max-w-xs">
                  A technical &amp; management college under Techno India Group,
                  affiliated to M.A.K.A.U.T, West Bengal.
                </p>

                <a
                  href="mailto:info@technoindiahooghly.org"
                  className="mt-6 inline-flex items-center gap-2 text-sm text-base-content/70 hover:text-primary transition-colors duration-300"
                >
                  <FiMail aria-hidden="true" />
                  info@technoindiahooghly.org
                </a>

              </div>
            </div>

            {/* QUICK LINKS GRID */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {FOOTER_SECTIONS.map((section) => (
                <FooterSection key={section.title} {...section} />
              ))}
            </div>

          </div>
        </div>

        {/* ACCREDITATIONS */}
        <div className="py-12 border-t border-base-content/10">
          <div className="flex items-center justify-center gap-4 mb-8">
  <span className="h-px w-20 md:w-40 bg-base-content/10" />
  <span className="text-xs font-semibold uppercase tracking-widest text-base-content/50 whitespace-nowrap">
    Accreditations &amp; Affiliations
  </span>
  <span className="h-px w-20 md:w-40 bg-base-content/10" />
</div>

          {approvals.length > 0 && (
           <div className="flex flex-wrap justify-center items-center gap-6">
              {approvals.map((item) => (
                <a
                  key={item._id}
                  href={item.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.title}
                  className="group"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-base-100 ring-1 ring-base-content/10 shadow-md transition-all duration-300 group-hover:ring-primary group-hover:-translate-y-1 group-hover:shadow-xl">
                    <img
                      src={resolveLogoUrl(item.logo)}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* VISITOR COUNTER */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-4 rounded-2xl border border-base-content/10 bg-base-100/5 px-6 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-base-content/50">
                  Website Visitors
                </p>
                <p className="font-serif text-2xl font-bold text-primary leading-tight">
                  {visitorCount.toLocaleString()}
                </p>
              </div>
              <span className="text-xs text-base-content/40 border-l border-base-content/10 pl-4">
                Since Launch
              </span>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-base-content/10 py-7">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-base-content/50 text-center lg:text-left">

            <div>
              <p>
                &copy; {new Date().getFullYear()}{" "}
                <span className="font-semibold text-base-content/70">
                  Techno India Hooghly
                </span>
                . All rights reserved &mdash; Akash Poddar, Debalina Halder, Pragyna Karmakar.
              </p>
            </div>

            <nav aria-label="Legal links" className="flex items-center gap-4 flex-wrap justify-center">
              {LEGAL_LINKS.map(({ to, label }, i) => (
                <React.Fragment key={to}>
                  {i > 0 && <span className="opacity-30" aria-hidden="true">&middot;</span>}
                  <Link
                    to={to}
                    className="inline-flex items-center gap-1 hover:text-primary transition-colors duration-300"
                  >
                    {label}
                    <FiArrowUpRight size={11} className="opacity-0 group-hover:opacity-100" aria-hidden="true" />
                  </Link>
                </React.Fragment>
              ))}
            </nav>

          </div>
        </div>

      </div>
    </footer>
  );
}