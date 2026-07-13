import React, { useEffect, useMemo, useRef, useState } from "react";

import api from "../../services/api";

import {
  FaBell,
  FaSearch,
  FaFilePdf,
  FaDownload,
  FaCalendarAlt,
  FaBullhorn,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import StudentNoticeSection from "./section/StudentNoticeSection";
import LogoStrip from "../../styles/Logostrip";

export default function CircularNotice() {
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [featuredNotices, setFeaturedNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ==========================================
  // FETCH DATA
  // ==========================================

  const fetchData = async () => {
    try {
      setLoading(true);

      const [allRes, featuredRes] = await Promise.all([
        api.get("/notices"),
        api.get("/notices/featured"),
      ]);

      setNotices(allRes.data.data?.notices || []);

setFeaturedNotices(
  featuredRes.data.data?.notices || []
);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // FEATURED NOTICE SLIDER
  // ==========================================

  const [slideIndex, setSlideIndex] = useState(0);
  const [slidePaused, setSlidePaused] = useState(false);
  const slideTimer = useRef(null);

  useEffect(() => {
    if (featuredNotices.length <= 1 || slidePaused) return;

    slideTimer.current = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % featuredNotices.length);
    }, 6000);

    return () => clearInterval(slideTimer.current);
  }, [featuredNotices.length, slidePaused]);

  // Keep index in range if the featured list shrinks (e.g. after a refetch)
  useEffect(() => {
    if (slideIndex >= featuredNotices.length) setSlideIndex(0);
  }, [featuredNotices.length, slideIndex]);

  const goToSlide = (i) => setSlideIndex(i);
  const goPrev = () =>
    setSlideIndex((prev) => (prev - 1 + featuredNotices.length) % featuredNotices.length);
  const goNext = () => setSlideIndex((prev) => (prev + 1) % featuredNotices.length);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredNotices = useMemo(() => {
    return notices.filter(
      (notice) =>
        notice.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [notices, searchTerm]);

  // ==========================================
  // SPLIT DATA
  // ==========================================

  const studentNotices = filteredNotices.filter((notice) => notice.audience === "student");
  const facultyNotices = filteredNotices.filter((notice) => notice.audience === "faculty");

  // ==========================================
  // STATUS
  // ==========================================

  const getStatus = (expiryDate) => (new Date(expiryDate) >= new Date() ? "Active" : "Expired");

  return (
    <>
      {/* Display/utility fonts — colors below come from the active daisyUI theme */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
        .cn-scope { font-family: 'Inter', sans-serif; }
        .cn-scope .f-display { font-family: 'Fraunces', serif; }
        .cn-scope .f-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      <div className="cn-scope min-h-screen bg-base-100">
        {/* HERO */}
        <section className="relative overflow-hidden bg-neutral text-neutral-content py-24">
          <div
            className="absolute inset-0 opacity-[0.1] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent, transparent 30px, var(--color-accent) 31px)",
            }}
          />
          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 border border-accent/50 text-accent px-5 py-2 rounded-sm mb-6">
              <FaBullhorn />
              <span className="f-mono text-xs font-medium uppercase tracking-widest">
                Official Notice Board
              </span>
            </div>

            <h1 className="f-display text-5xl md:text-6xl font-medium">
              Circulars &amp; Notices
            </h1>

            <div className="mx-auto mt-6 h-px w-16 bg-accent" />

            <p className="mt-6 max-w-3xl mx-auto text-lg leading-relaxed text-neutral-content/75">
              Stay informed with official academic circulars, examination
              notices, scholarship updates, faculty announcements, tender
              notices and important institutional communications.
            </p>
          </div>
        </section>

        {/* FEATURED NOTICES — SLIDER */}
        {featuredNotices.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 py-10">
            <div
              className="relative border border-warning/40 border-l-4 border-l-warning bg-base-100 rounded-sm shadow-sm overflow-hidden"
              onMouseEnter={() => setSlidePaused(true)}
              onMouseLeave={() => setSlidePaused(false)}
            >
              {/* track */}
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${slideIndex * 100}%)` }}
              >
                {featuredNotices.map((notice) => (
                  <div key={notice._id} className="w-full shrink-0 p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div>
                        <p className="f-mono text-[11px] font-medium uppercase tracking-widest text-warning flex items-center gap-2">
                          <FaBell /> Important Announcement
                        </p>

                        <h2 className="f-display text-2xl md:text-3xl font-medium text-base-content mt-3 mb-3">
                          {notice.title}
                        </h2>

                        <div className="flex flex-wrap items-center gap-3">
                          <span className="badge badge-outline rounded-sm">
                            {notice.category}
                          </span>

                          <span
                            className={`badge rounded-sm ${
                              getStatus(notice.expiryDate) === "Active"
                                ? "badge-success"
                                : "badge-error"
                            }`}
                          >
                            {getStatus(notice.expiryDate)}
                          </span>

                          <span className="f-mono text-xs text-base-content/60">
                            Published {new Date(notice.noticeDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {notice.pdfFile && (
                        <div className="flex gap-3 shrink-0">
                          <a
                            href={notice.pdfFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm rounded-sm gap-2"
                          >
                            <FaFilePdf />
                            View Notice
                          </a>

                          <a
                            href={notice.pdfFile}
                            download
                            className="btn btn-outline btn-sm rounded-sm gap-2"
                          >
                            <FaDownload />
                            Download
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* prev / next arrows — only when there's something to navigate to */}
              {featuredNotices.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous featured notice"
                    className="absolute left-3 top-1/2 -translate-y-1/2 btn btn-circle btn-sm btn-ghost bg-base-100/80 hover:bg-base-100"
                  >
                    <FaChevronLeft />
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next featured notice"
                    className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-circle btn-sm btn-ghost bg-base-100/80 hover:bg-base-100"
                  >
                    <FaChevronRight />
                  </button>

                  {/* dots */}
                  <div className="flex justify-center gap-2 pb-5">
                    {featuredNotices.map((notice, i) => (
                      <button
                        key={notice._id}
                        type="button"
                        onClick={() => goToSlide(i)}
                        aria-label={`Go to featured notice ${i + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === slideIndex ? "w-6 bg-warning" : "w-2 bg-base-300"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* SEARCH */}
        <section className="max-w-7xl mx-auto px-6 pb-10">
          <div className="max-w-2xl mx-auto relative">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-base-content/40" />

            <input
              type="text"
              placeholder="Search notices by title, category or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered rounded-sm w-full h-14 pl-14 pr-5 bg-base-100 border-base-300 focus:border-accent focus:outline-none"
            />
          </div>
        </section>

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-32">
            <span className="loading loading-spinner loading-lg text-accent"></span>
            <p className="mt-4 f-mono text-xs uppercase tracking-widest text-base-content/60">
              Loading notices…
            </p>
          </div>
        ) : (
          <section className="max-w-7xl mx-auto px-6 pb-20">
            <div className="space-y-16">
              {/* STUDENT NOTICES */}
              <StudentNoticeSection notices={studentNotices} getStatus={getStatus} />

              {/* FACULTY & TENDER NOTICES */}
              <section>
                <div className="mb-8">
                  <p className="f-mono text-[11px] uppercase tracking-widest text-primary">
                    Audience: Faculty &amp; Vendors
                  </p>
                  <h2 className="f-display text-3xl font-medium text-base-content mt-2">
                    Faculty &amp; Tender Notices
                  </h2>
                </div>

                <div className="max-h-175 overflow-y-auto pr-2 space-y-4">
                  {facultyNotices.length > 0 ? (
                    facultyNotices.map((notice) => (
                      <div
                        key={notice._id}
                        className="border border-base-300 bg-base-100 rounded-sm p-6 hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <span className="badge badge-primary rounded-sm">
                                {notice.category}
                              </span>

                              <span
                                className={`badge rounded-sm ${
                                  getStatus(notice.expiryDate) === "Active"
                                    ? "badge-success"
                                    : "badge-error"
                                }`}
                              >
                                {getStatus(notice.expiryDate)}
                              </span>
                            </div>

                            <h3 className="f-display text-xl font-medium text-base-content mb-2">
                              {notice.title}
                            </h3>

                            <p className="text-base-content/70 leading-relaxed mb-4">
                              {notice.description}
                            </p>

                            <div className="flex items-center gap-2 text-sm text-base-content/50 f-mono">
                              <FaCalendarAlt />
                              Published on {new Date(notice.noticeDate).toLocaleDateString()}
                            </div>
                          </div>

                          {notice.pdfFile && (
                            <div className="flex flex-wrap gap-3 shrink-0">
                              <a
                                href={notice.pdfFile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary btn-sm rounded-sm gap-2"
                              >
                                <FaFilePdf />
                                View Notice
                              </a>

                              <a
                                href={notice.pdfFile}
                                download
                                className="btn btn-outline btn-sm rounded-sm gap-2"
                              >
                                <FaDownload />
                                Download
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-base-content/60">
                      No faculty or tender notices found.
                    </div>
                  )}
                </div>
              </section>
            </div>
          </section>
        )}
      </div>
      <LogoStrip/>
    </>
  );
}