import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  Download,
  Eye,
  FileText,
  GraduationCap,
  X,
} from "lucide-react";
import LogoStrip from "../../styles/Logostrip";

/* ===========================================
   Shares the type system with the Dashboard:
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
=========================================== */

const INK = "#182333";
const PAPER = "#F7F4EC";
const HAIRLINE = "#E1E3DE";
const AMBER = "#A6763D";

const fraunces = { fontFamily: "Fraunces, serif" };
const mono = { fontFamily: "'IBM Plex Mono', monospace" };

export default function Syllabus() {
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [openProgram, setOpenProgram] = useState("MCA");

  const programs = [
    {
      program: "MCA",
      fullName: "Master of Computer Applications",
      duration: "2 Years",
      semesters: [1, 2, 3, 4],
    },
    {
      program: "BCA",
      fullName: "Bachelor of Computer Applications",
      duration: "4 Years",
      semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    {
      program: "BBA",
      fullName: "Bachelor of Business Administration",
      duration: "4 Years",
      semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    },
  ];

  useEffect(() => {
    fetchSyllabus();
  }, []);

  const fetchSyllabus = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/syllabus");
      setSyllabus(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const groupedData = useMemo(() => {
    const grouped = {};
    syllabus.forEach((item) => {
      const key = `${item.stream}-${item.semester}`;
      if (!grouped[key]) grouped[key] = {};
      grouped[key][item.syllabusType] = item;
    });
    return grouped;
  }, [syllabus]);

  return (
    <>
      <section
        className="min-h-screen pb-24"
        style={{ background: PAPER, fontFamily: "Inter, system-ui, sans-serif" }}
      >
        {/* ===== HERO ===== */}
        <div className="max-w-5xl mx-auto pt-20 px-6 text-center relative">
          <SealStamp />

          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="block text-[11px] tracking-[0.3em] uppercase mt-6"
            style={{ ...mono, color: AMBER }}
          >
            Academic Records &mdash; Registrar's Office
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-5xl md:text-6xl mt-3"
            style={{ ...fraunces, fontWeight: 600, color: INK }}
          >
            Syllabus Archive
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="mt-4 max-w-lg mx-auto"
            style={{ color: `${INK}99` }}
          >
            The full semester-wise catalog of current and superseded
            syllabi for MCA, BCA and BBA — indexed and ready to view.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
            className="h-px w-24 mx-auto mt-8 origin-center"
            style={{ background: `${AMBER}70` }}
          />
        </div>

        {/* ===== BODY ===== */}
        <div className="max-w-5xl mx-auto px-6 mt-14">
          {loading ? (
            <div className="grid gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-sm border p-6"
                  style={{ borderColor: HAIRLINE, background: "#fff" }}
                >
                  <div className="skeleton h-8 w-52 mb-3"></div>
                  <div className="skeleton h-4 w-72 mb-6"></div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="skeleton h-28 w-full"></div>
                    <div className="skeleton h-28 w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {programs.map((program, index) => {
                const isOpen = openProgram === program.program;
                return (
                  <motion.div
                    key={program.program}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 * index }}
                    className="relative rounded-sm border bg-white overflow-hidden"
                    style={{ borderColor: isOpen ? `${AMBER}60` : HAIRLINE }}
                  >
                    {/* catalog tab */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300"
                      style={{ background: isOpen ? AMBER : HAIRLINE }}
                    />

                    {/* header / toggle */}
                    <button
                      onClick={() =>
                        setOpenProgram(isOpen ? null : program.program)
                      }
                      className="w-full flex items-center justify-between gap-4 px-7 py-6 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                          style={{
                            background: isOpen ? AMBER : `${INK}08`,
                            color: isOpen ? "#fff" : INK,
                            transition: "all .3s ease",
                          }}
                        >
                          <GraduationCap size={22} strokeWidth={1.75} />
                        </div>
                        <div>
                          <h2
                            className="text-2xl flex items-center gap-3"
                            style={{ ...fraunces, fontWeight: 600, color: INK }}
                          >
                            {program.program}
                            <span
                              className="text-[11px] tracking-widest uppercase px-2 py-0.5 rounded-full"
                              style={{
                                ...mono,
                                color: AMBER,
                                border: `1px solid ${AMBER}50`,
                              }}
                            >
                              {program.duration}
                            </span>
                          </h2>
                          <p className="text-sm mt-0.5" style={{ color: `${INK}80` }}>
                            {program.fullName}
                          </p>
                        </div>
                      </div>

                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                      >
                        <ChevronDown size={20} style={{ color: INK }} />
                      </motion.div>
                    </button>

                    {/* content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <div
                            className="px-7 pb-7 pt-1 grid md:grid-cols-2 gap-4 border-t"
                            style={{ borderColor: HAIRLINE }}
                          >
                            {program.semesters.map((semester, si) => {
                              const data =
                                groupedData[`${program.program}-${semester}`] ||
                                {};
                              const newPdf = data.new;
                              const oldPdf = data.old;
                              const code = `${program.program}-${String(
                                semester
                              ).padStart(2, "0")}`;

                              return (
                                <motion.div
                                  key={semester}
                                  initial={{ opacity: 0, y: 14 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    duration: 0.35,
                                    delay: 0.06 * si + 0.15,
                                  }}
                                  whileHover={{ y: -2 }}
                                  className="rounded-sm border p-5 relative"
                                  style={{ borderColor: HAIRLINE, background: PAPER }}
                                >
                                  <div className="flex items-center justify-between mb-4">
                                    <h3
                                      className="text-base"
                                      style={{
                                        ...fraunces,
                                        fontWeight: 600,
                                        color: INK,
                                      }}
                                    >
                                      Semester {semester}
                                    </h3>
                                    <span
                                      className="text-[11px]"
                                      style={{ ...mono, color: `${INK}45` }}
                                    >
                                      {code}
                                    </span>
                                  </div>

                                  <RecordRow
                                    label="New Syllabus"
                                    accent="#4A7C59"
                                    pdf={newPdf}
                                    onView={() => setSelectedPdf(newPdf)}
                                  />
                                  <div className="h-3" />
                                  <RecordRow
                                    label="Old Syllabus"
                                    accent={AMBER}
                                    pdf={oldPdf}
                                    onView={() => setSelectedPdf(oldPdf)}
                                  />
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* ===== PDF PREVIEW MODAL ===== */}
        <AnimatePresence>
          {selectedPdf && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: "rgba(24,35,51,0.55)", backdropFilter: "blur(4px)" }}
              onClick={() => setSelectedPdf(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-sm w-full max-w-5xl overflow-hidden border"
                style={{ borderColor: HAIRLINE }}
              >
                <div
                  className="flex justify-between items-center px-6 py-4 border-b"
                  style={{ borderColor: HAIRLINE }}
                >
                  <div>
                    <span
                      className="text-[11px] tracking-[0.2em] uppercase"
                      style={{ ...mono, color: AMBER }}
                    >
                      Document Preview
                    </span>
                    <h3
                      className="text-xl mt-0.5"
                      style={{ ...fraunces, fontWeight: 600, color: INK }}
                    >
                      {selectedPdf.stream} &middot; Semester{" "}
                      {selectedPdf.semester} &middot;{" "}
                      {selectedPdf.syllabusType?.toUpperCase()}
                    </h3>
                  </div>

                  <button
                    onClick={() => setSelectedPdf(null)}
                    className="btn btn-circle btn-sm btn-ghost"
                  >
                    <X size={16} />
                  </button>
                </div>

                <iframe
                  src={selectedPdf.pdfFile}
                  title="PDF Preview"
                  className="w-full h-[70vh]"
                />

                <div
                  className="flex justify-end gap-3 px-6 py-4 border-t"
                  style={{ borderColor: HAIRLINE }}
                >
                  <a
                    href={selectedPdf.pdfFile}
                    download
                    className="btn btn-sm"
                    style={{ background: INK, color: "#fff", border: "none" }}
                  >
                    <Download size={15} />
                    Download PDF
                  </a>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => setSelectedPdf(null)}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <LogoStrip />
    </>
  );
}

/* ---------- Record row: one PDF entry (new / old) ---------- */
function RecordRow({ label, accent, pdf, onView }) {
  return (
    <div
      className="flex items-center justify-between rounded-sm border px-4 py-3 bg-white"
      style={{ borderColor: HAIRLINE, borderLeft: `3px solid ${accent}` }}
    >
      <div>
        <p className="text-sm font-semibold" style={{ color: INK }}>
          {label}
        </p>
        {!pdf && (
          <span className="text-[11px]" style={{ color: `${INK}55` }}>
            Not available
          </span>
        )}
      </div>

      {pdf && (
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onView}
            className="btn btn-xs btn-outline"
          >
            <Eye size={13} />
          </motion.button>
          <motion.a
            whileTap={{ scale: 0.92 }}
            href={pdf.pdfFile}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-xs"
            style={{ background: accent, color: "#fff", border: "none" }}
          >
            <Download size={13} />
          </motion.a>
        </div>
      )}
    </div>
  );
}

/* ---------- Signature element: an ink seal that stamps in on load ---------- */
function SealStamp() {
  return (
    <motion.div
      className="mx-auto w-16 h-16 relative"
      initial={{ scale: 2.2, opacity: 0, rotate: -8 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke={AMBER}
          strokeWidth="2"
          strokeDasharray="264"
          initial={{ strokeDashoffset: 264 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke={INK}
          strokeWidth="1"
          strokeOpacity="0.25"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          style={{ transformOrigin: "50px 50px" }}
        />
        <motion.g
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 1.05 }}
          style={{ transformOrigin: "50px 50px" }}
        >
          <foreignObject x="27" y="27" width="46" height="46">
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen size={26} strokeWidth={1.6} color={INK} />
            </div>
          </foreignObject>
        </motion.g>
      </svg>
    </motion.div>
  );
}