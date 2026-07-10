
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../../services/api";

import StudentNoticeSection from "../../notice/section/StudentNoticeSection";
import { Link } from "react-router-dom";

const EASE = [0.22, 1, 0.36, 1];

function NoticeSection() {
  const [studentNotices, setStudentNotices] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_API_URL || "";

  const getStatus = (expiryDate) => {
    return new Date(expiryDate) >= new Date() ? "Active" : "Expired";
  };

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const { data } = await api.get("/notices");

        const notices = Array.isArray(data?.data?.notices)
          ? data.data.notices
          : [];

        const students = notices
          .filter((notice) => notice.audience?.toLowerCase() === "student")
          .slice(0, 6);

        setStudentNotices(students);
      } catch (error) {
        console.error("Notice Fetch Error:", error);
        setStudentNotices([]);
      }
    };

    loadNotices();
  }, []);

  return (
    <section className="py-24 md:py-28 bg-linear-to-br from-slate-950 via-primary to-slate-900 text-white relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-3 text-amber-400 font-semibold text-xs tracking-[0.35em] uppercase">
            <span className="h-px w-8 bg-amber-400/50" />
            Notice Board
            <span className="h-px w-8 bg-amber-400/50" />
          </span>

          <h2 className="font-serif mt-5 text-4xl md:text-5xl font-semibold text-white tracking-tight">
            Latest Notices &amp; Announcements
          </h2>

          <p className="mt-4 text-white/60 max-w-3xl mx-auto text-sm md:text-base">
            Stay informed about examinations, admissions, academic
            schedules, events, circulars and important updates from the
            institution.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="bg-base-100 text-base-content rounded-4xl shadow-2xl border border-base-300/40 overflow-hidden"
        >
          {/* Top Banner */}
          <div className="bg-linear-to-r from-primary to-secondary text-primary-content px-8 py-7">
            <h3 className="font-serif text-2xl font-semibold">
              Student Notices
            </h3>
            <p className="text-white/80 mt-1 text-sm">
              Important notifications for students and guardians
            </p>
          </div>

          {/* Notices */}
          <div className="p-8">
            {studentNotices.length > 0 ? (
              <StudentNoticeSection
                notices={studentNotices}
                getStatus={getStatus}
                BACKEND_URL={BACKEND_URL}
              />
            ) : (
              <div className="text-center py-16">
                <h4 className="font-serif text-xl font-semibold text-amber-600">
                  No Notices Available
                </h4>
                <p className="text-base-content/50 mt-2 text-sm">
                  Please check back later for updates.
                </p>
              </div>
            )}

            <div className="flex justify-center mt-10">
              <Link
              to="/circular-notice"
              className="btn btn-primary btn-wide rounded-full">
                View All Notices
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default NoticeSection;