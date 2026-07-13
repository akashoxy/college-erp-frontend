import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  IndianRupee,
  FileText,
  Download,
  BookOpen,
} from "lucide-react";
import LogoStrip from "../../styles/Logostrip";

/* ==========================================================
   NOTE ON DAISYUI SETUP
   ----------------------------------------------------------
   This component now uses DaisyUI semantic classes (primary,
   secondary, base-100/200/300, etc.) instead of hardcoded hex
   values, so it responds correctly to DaisyUI theming.

   Add a "ledger" theme to your tailwind.config.js so the
   colors below map to this component's original palette:

   // tailwind.config.js
   module.exports = {
     // ...
     plugins: [require("daisyui")],
     daisyui: {
       themes: [
         {
           ledger: {
             "primary": "#142238",
             "primary-content": "#F3F0E6",
             "secondary": "#B8912F",
             "secondary-content": "#142238",
             "accent": "#2F6259",
             "accent-content": "#F3F0E6",
             "neutral": "#142238",
             "neutral-content": "#F3F0E6",
             "base-100": "#FDFCF7",
             "base-200": "#F3F0E6",
             "base-300": "#DCD5C1",
             "base-content": "#142238",
             "info": "#2F6259",
             "success": "#2F6259",
             "warning": "#B8912F",
             "error": "#B23A3A",
           },
         },
       ],
     },
   };

   Then set data-theme="ledger" on <html> (or a parent element),
   or add "ledger" to your list of selectable themes.
========================================================== */

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap";

const useLedgerFonts = () => {
  useEffect(() => {
    if (document.getElementById("ledger-fonts")) return;
    const link = document.createElement("link");
    link.id = "ledger-fonts";
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);
};

const display = { fontFamily: "'Fraunces', serif" };
const mono = { fontFamily: "'IBM Plex Mono', monospace" };

/* ==========================================================
   COUNT UP — total fee reads like a ledger being tallied
========================================================== */

function useCountUp(value, duration = 900) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const to = Number(value) || 0;
    const start = performance.now();
    let frame;

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(to * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return shown;
}

/* ==========================================================
   DOTTED LEDGER ROW
========================================================== */

const LedgerRow = ({ left, right, delay = 0, emphasis = false }) => (
  <motion.div
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay }}
    className="flex items-baseline gap-3 py-2.5"
  >
    <span
      className={`shrink-0 flex items-center gap-2 ${
        emphasis ? "text-base-content font-semibold" : "text-base-content/80"
      }`}
    >
      {left}
    </span>
    <span className="flex-1 border-b border-dotted border-base-300 translate-y-[-3px]" />
    <span
      className={`shrink-0 tabular-nums ${
        emphasis ? "text-secondary text-lg font-semibold" : "text-base-content"
      }`}
      style={mono}
    >
      {right}
    </span>
  </motion.div>
);

/* ==========================================================
   MAIN
========================================================== */

const FeeStructure = () => {
  useLedgerFonts();

  const [loading, setLoading] = useState(true);
  const [feeStructures, setFeeStructures] = useState([]);
  const [selectedStream, setSelectedStream] = useState(null);
  const [semesterOpen, setSemesterOpen] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  // Reset the collapse open whenever the selected program changes
  useEffect(() => {
    setSemesterOpen(false);
  }, [selectedStream?._id]);

  const loadData = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/fee-structure");
      const feeList = data?.data?.feeStructures || [];

      const order = { BCA: 1, BBA: 2, MCA: 3 };
      const sorted = [...feeList].sort(
        (a, b) => (order[a.stream] || 999) - (order[b.stream] || 999)
      );

      setFeeStructures(sorted);
      if (sorted.length > 0) setSelectedStream(sorted[0]);
    } catch (error) {
      console.error("Fee Structure Load Error", error);
    } finally {
      setLoading(false);
    }
  };

  const calculatedTotal =
    Number(selectedStream?.admissionFee || 0) +
    (selectedStream?.semesterFees || []).reduce((sum, semester, index) => {
      if (index === 0) return sum;
      return sum + Number(semester.amount || 0);
    }, 0);

  const total = useCountUp(calculatedTotal);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-secondary" />
      </div>
    );
  }

  return (
    <>
    <div
      className="min-h-screen bg-base-200"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, hsl(var(--bc) / 0.05) 1px, transparent 0)",
        backgroundSize: "22px 22px",
      }}
    >
      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden bg-primary text-primary-content">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <div className="absolute -top-20 -left-10 w-96 h-96 rounded-full bg-secondary blur-3xl" />
          <div className="absolute -bottom-24 right-0 w-[28rem] h-[28rem] rounded-full bg-accent blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="badge badge-outline border-secondary/50 text-secondary gap-2 py-3 px-3 uppercase tracking-[0.2em] mb-6"
              style={mono}
            >
              <BookOpen size={13} />
              Admission Ledger
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold" style={display}>
              Fee Structure
            </h1>

            <div className="divider before:bg-secondary after:bg-secondary w-16 mx-auto my-6 opacity-100 before:h-[2px] after:h-0" />

            <p className="max-w-xl mx-auto text-base md:text-lg text-primary-content/75">
              Semester-wise fees for every program, recorded plainly.
              Choose a program to open its page in the ledger.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= BODY ================= */}

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-8">
          {/* ---------- PROGRAM TABS ---------- */}

          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-10 space-y-3">
              <p
                className="text-xs uppercase tracking-[0.2em] text-base-content/50 mb-4"
                style={mono}
              >
                Programs
              </p>

              {feeStructures.map((item, i) => {
                const active = selectedStream?._id === item._id;
                return (
                  <motion.button
                    key={item._id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    whileHover={{ x: active ? 0 : 4 }}
                    onClick={() => setSelectedStream(item)}
                    className={`card card-side w-full text-left border transition-colors duration-200 overflow-hidden ${
                      active
                        ? "bg-primary border-primary"
                        : "bg-base-100 border-base-300 hover:border-secondary/60"
                    }`}
                  >
                    <div className="flex w-full">
                      <div
                        className={`w-1.5 shrink-0 ${
                          active ? "bg-secondary" : "bg-transparent"
                        }`}
                      />
                      <div className="flex-1 p-4 flex items-center justify-between gap-3">
                        <div>
                          <h3
                            className={`text-2xl font-semibold ${
                              active ? "text-primary-content" : "text-base-content"
                            }`}
                            style={display}
                          >
                            {item.stream}
                          </h3>
                          <p
                            className={`text-xs mt-0.5 ${
                              active ? "text-primary-content/60" : "text-base-content/50"
                            }`}
                          >
                            {item.duration}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-[10px] uppercase tracking-wider ${
                              active ? "text-primary-content/50" : "text-base-content/40"
                            }`}
                            style={mono}
                          >
                            Total
                          </p>
                          <p
                            className={`font-semibold tabular-nums ${
                              active ? "text-secondary" : "text-secondary"
                            }`}
                            style={mono}
                          >
                            ₹
                            {(
                              Number(item.admissionFee || 0) +
                              (item.semesterFees || []).reduce((sum, semester, index) => {
                                if (index === 0) return sum;
                                return sum + Number(semester.amount || 0);
                              }, 0)
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* ---------- LEDGER SHEET ---------- */}

          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {selectedStream && (
                <motion.div
                  key={selectedStream._id}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="space-y-6"
                >
                  {/* HEADER */}

                  <div className="card bg-base-100 border border-base-300 p-7 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div>
                        
                        <h2
                          className="text-3xl font-semibold text-base-content"
                          style={display}
                        >
                          {selectedStream.stream} Program
                        </h2>
                        <p className="text-base-content/60 mt-2 text-sm">
                          Duration&nbsp;
                          <span className="text-base-content">{selectedStream.duration}</span>
                          <span className="mx-2 text-base-content/30">·</span>
                          Batch&nbsp;
                          <span className="text-base-content">{selectedStream.batch || "—"}</span>
                        </p>
                      </div>

                      <div className="stat p-0 w-auto items-end text-right">
                        <div
                          className="stat-title text-[10px] uppercase tracking-[0.2em] text-base-content/45"
                          style={mono}
                        >
                          Total Program Fee
                        </div>
                        <div
                          className="stat-value text-4xl text-secondary tabular-nums flex items-center gap-1"
                          style={mono}
                        >
                          <IndianRupee size={26} />
                          {total.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SEMESTER LEDGER — collapsible */}

                  <div
                    className={`collapse collapse-arrow bg-base-100 border border-base-300 ${
                      semesterOpen ? "collapse-open" : "collapse-close"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSemesterOpen((open) => !open)}
                      className="collapse-title text-lg font-semibold text-base-content flex items-center gap-2 cursor-pointer w-full text-left"
                      style={display}
                      aria-expanded={semesterOpen}
                    >
                      <BookOpen size={18} className="text-secondary shrink-0" />
                      Semester Wise Fee
                    </button>

                    <div className="collapse-content">
                      <div className="divide-y divide-base-300/60">
                        {selectedStream.semesterFees?.map((fee, index) => (
                          <LedgerRow
                            key={index}
                            left={<>{fee.semester}</>}
                            right={
                              index === 0
                                ? "Included in Admission Fee"
                                : `₹${Number(fee.amount).toLocaleString()}`
                            }
                          />
                        ))}
                      </div>

                      <div className="mt-3 pt-3 border-t border-base-300 space-y-1">
                        <LedgerRow
                          left={
                            <>
                              Admission Fee
                              <span className="text-[10px] text-base-content/45 normal-case font-normal">
                                (incl. Semester 1)
                              </span>
                            </>
                          }
                          right={`₹${Number(selectedStream?.admissionFee || 0).toLocaleString()}`}
                        />
                        <LedgerRow
                          left="Total Fee"
                          right={`₹${calculatedTotal.toLocaleString()}`}
                          emphasis
                        />
                      </div>
                    </div>
                  </div>

                  {/* PDF */}

                  {selectedStream.pdfFile && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="card bg-primary text-primary-content p-6 md:flex-row items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="text-secondary" />
                        <div>
                          <p className="font-semibold" style={display}>
                            Official Fee Structure
                          </p>
                          <p className="text-sm text-primary-content/60">
                            Download the signed document for your records.
                          </p>
                        </div>
                      </div>
                      <a
                        href={selectedStream.pdfFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm md:btn-md mt-4 md:mt-0"
                      >
                        <Download size={16} />
                        Download PDF
                      </a>
                    </motion.div>
                  )}

                  {/* NOTES */}

                  {selectedStream.notes?.length > 0 && (
                    <div className="card bg-base-100 border border-base-300 p-7">
                      <h3 className="text-lg font-semibold text-base-content mb-4" style={display}>
                        Admission Instructions
                      </h3>
                      <div className="space-y-2.5">
                        {selectedStream.notes.map((note, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex gap-3 text-sm text-base-content/80"
                          >
                            <span className="text-accent mt-0.5">—</span>
                            <p>{note}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {feeStructures.length === 0 && (
              <div className="card bg-base-100 border border-base-300 p-16 text-center">
                <GraduationCap size={56} className="mx-auto text-base-content/20" />
                <h3 className="text-xl font-semibold text-base-content mt-4" style={display}>
                  No fee structures published yet
                </h3>
                <p className="text-base-content/50 mt-1 text-sm">
                  Check back once admissions publish the fee ledger.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
    <LogoStrip/>
    </>
  );
};

export default FeeStructure;