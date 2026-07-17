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



const fraunces = { fontFamily: "Fraunces, serif" };
const mono = { fontFamily: "'IBM Plex Mono', monospace" };

export default function Syllabus() {
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(null);
  // Closed by default — every mount / reload starts fully collapsed.
  const [openProgram, setOpenProgram] = useState(null);

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
        className="min-h-screen pb-24 bg-base-200"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        {/* ===== HERO ===== */}
        <div className="max-w-5xl mx-auto pt-20 px-6 text-center relative">
          <SealStamp />

          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="block text-[11px] tracking-[0.3em] uppercase mt-6 text-primary"
            style={mono}
          >
            Academic Records
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-5xl md:text-6xl mt-3 text-base-content"
            style={{ ...fraunces, fontWeight: 600 }}
          >
            Syllabus Archive
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="mt-4 max-w-lg mx-auto text-base-content/70"
          >
            The full semester-wise catalog syllabus for MCA, BCA and BBA.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
            className="h-px w-24 mx-auto mt-8 origin-center bg-primary/40"
          />
        </div>

        {/* ===== BODY ===== */}
        <div className="max-w-5xl mx-auto px-6 mt-14">
          {loading ? (
            <div className="grid gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-sm border border-base-300 bg-base-100 p-6"
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
                    className={`relative rounded-sm border bg-base-100 overflow-hidden transition-colors duration-300 ${
                      isOpen ? "border-primary/60" : "border-base-300"
                    }`}
                  >
                    {/* catalog tab */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300 ${
                        isOpen ? "bg-primary" : "bg-base-300"
                      }`}
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
                          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                            isOpen
                              ? "bg-primary text-primary-content"
                              : "bg-base-200 text-base-content"
                          }`}
                        >
                          <GraduationCap size={22} strokeWidth={1.75} />
                        </div>
                        <div>
                          <h2
                            className="text-2xl flex items-center gap-3 text-base-content"
                            style={{ ...fraunces, fontWeight: 600 }}
                          >
                            {program.program}
                            <span
                              className="text-[11px] tracking-widest uppercase px-2 py-0.5 rounded-full text-primary border border-primary/40"
                              style={mono}
                            >
                              {program.duration}
                            </span>
                          </h2>
                          <p className="text-sm mt-0.5 text-base-content/70">
                            {program.fullName}
                          </p>
                        </div>
                      </div>

                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="text-base-content"
                      >
                        <ChevronDown size={20} />
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
                          <div className="px-7 pb-7 pt-1 grid md:grid-cols-2 gap-4 border-t border-base-300">
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
                                  className="rounded-sm border border-base-300 bg-base-200 p-5 relative"
                                >
                                  <div className="flex items-center justify-between mb-4">
                                    <h3
                                      className="text-base text-base-content"
                                      style={{ ...fraunces, fontWeight: 600 }}
                                    >
                                      Semester {semester}
                                    </h3>
                                    <span
                                      className="text-[11px] text-base-content/40"
                                      style={mono}
                                    >
                                      {code}
                                    </span>
                                  </div>

                                  <RecordRow
                                    label="New Syllabus"
                                    tone="success"
                                    pdf={newPdf}
                                    onView={() => setSelectedPdf(newPdf)}
                                  />
                                  <div className="h-3" />
                                  <RecordRow
                                    label="Old Syllabus"
                                    tone="warning"
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral/60 backdrop-blur-sm"
              onClick={() => setSelectedPdf(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-base-100 rounded-sm w-full max-w-5xl overflow-hidden border border-base-300"
              >
                <div className="flex justify-between items-center px-6 py-4 border-b border-base-300">
                  <div>
                    <span
                      className="text-[11px] tracking-[0.2em] uppercase text-primary"
                      style={mono}
                    >
                      Document Preview
                    </span>
                    <h3
                      className="text-xl mt-0.5 text-base-content"
                      style={{ ...fraunces, fontWeight: 600 }}
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

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-base-300">
                  <a
                    href={selectedPdf.pdfFile}
                    download
                    className="btn btn-sm btn-primary"
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
function RecordRow({ label, tone, pdf, onView }) {
  const borderTone = tone === "success" ? "border-l-success" : "border-l-warning";
  const btnTone = tone === "success" ? "btn-success" : "btn-warning";

  return (
    <div
      className={`flex items-center justify-between rounded-sm border border-base-300 border-l-4 ${borderTone} px-4 py-3 bg-base-100`}
    >
      <div>
        <p className="text-sm font-semibold text-base-content">{label}</p>
        {!pdf && (
          <span className="text-[11px] text-base-content/50">
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
            className={`btn btn-xs ${btnTone}`}
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
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="264"
          className="text-primary"
          initial={{ strokeDashoffset: 264 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-base-content/25"
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
            <div className="w-full h-full flex items-center justify-center text-base-content">
              <BookOpen size={26} strokeWidth={1.6} />
            </div>
          </foreignObject>
        </motion.g>
      </svg>
    </motion.div>
  );
}