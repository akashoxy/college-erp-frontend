import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function AdmissionProcedure() {
  const [programs, setPrograms] = useState([]);
  const [activeProgram, setActiveProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH PROGRAMS
  ========================= */

  const fetchPrograms = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/admission-procedure");

      if (data.success) {
        setPrograms(data.data || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return (
    <>
      {/* Display/utility fonts only — every color below comes from the
          active daisyUI theme, so this adapts automatically if the theme
          is switched (light, dark, or a custom one). */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
        .adm-scope { font-family: 'Inter', sans-serif; }
        .adm-scope .f-display { font-family: 'Fraunces', serif; }
        .adm-scope .f-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      <section className="adm-scope min-h-screen bg-base-100">
        {/* ============ HERO ============ */}
        <div className="relative overflow-hidden bg-neutral text-neutral-content">
          {/* ruled-ledger texture, tinted with the theme's accent color */}
          <div
            className="absolute inset-0 opacity-[0.1] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent, transparent 30px, var(--color-accent) 31px)",
            }}
          />
          <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
            <p className="f-mono text-xs tracking-[0.3em] uppercase text-accent">
              Techno College Hooghly &nbsp;·&nbsp; Registrar&rsquo;s Office
            </p>

            <h1 className="f-display mt-6 text-5xl md:text-6xl font-medium">
              Admission Procedure
            </h1>

            <div className="mx-auto mt-6 h-px w-16 bg-accent" />

            <p className="mt-6 text-base md:text-lg leading-relaxed max-w-2xl mx-auto text-neutral-content/75">
              Eligibility criteria, the admission process, entrance details, and
              programme-specific information — set out for prospective students.
            </p>
          </div>
        </div>

        {/* ============ PROGRAMS ============ */}
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-12">
            <p className="f-mono text-xs tracking-[0.25em] uppercase text-accent">
              Register of Programmes
            </p>
            <h2 className="f-display mt-2 text-3xl md:text-4xl font-medium text-base-content">
              Programmes on offer
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <span className="loading loading-spinner loading-lg text-accent" />
              <p className="f-mono text-xs tracking-widest uppercase text-base-content/60">
                Retrieving programme records…
              </p>
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-20 border border-base-300 bg-base-200 rounded-sm">
              <h3 className="f-display text-2xl font-medium text-base-content">
                No programmes listed
              </h3>
              <p className="mt-3 text-base-content/60">
                The registrar hasn&rsquo;t published any admission programmes yet.
                Please check back soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {programs.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="group flex rounded-sm overflow-hidden border border-base-300 bg-base-100 transition-shadow duration-300 hover:shadow-lg"
                >
                  {/* catalog tab */}
                  <div className="w-16 shrink-0 flex items-center justify-center bg-neutral text-neutral-content">
                    <span
                      className="f-mono text-[11px] tracking-[0.2em] uppercase whitespace-nowrap"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    >
                      {p.code}
                    </span>
                  </div>

                  {/* body */}
                  <div className="flex-1 p-6 flex flex-col">
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.code}
                        className="w-full h-36 object-cover rounded-sm mb-4 border border-base-300"
                      />
                    )}

                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="f-display text-2xl font-medium text-base-content">
                        {p.code}
                      </h3>
                      <span className="f-mono text-[11px] uppercase tracking-widest shrink-0 text-accent">
                        {p.duration}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-base-content/70 line-clamp-4">
                      {p.details}
                    </p>

                    <div className="flex gap-3 mt-6 pt-2">
                      <button
                          className="btn btn-primary rounded-sm flex-1"
                          onClick={() => setActiveProgram(p)}
                        >
                          View Details
                        </button>

                      <Link to="/admission-form" className="flex-1">
                        <button className="btn btn-primary rounded-sm w-full">
                          Apply now
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ============ DETAIL DOSSIER (modal) ============ */}
        {activeProgram && (
          <dialog className="modal modal-open">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="
      modal-box
      max-w-2xl
      max-h-[90vh]
      overflow-y-auto
      rounded-sm
      p-0
      border
      border-base-300
      bg-base-100
    "
            >
              {/* header */}
              <div className="bg-neutral text-neutral-content p-8">
                <p className="f-mono text-[11px] uppercase tracking-[0.25em] text-accent">
                  Programme dossier
                </p>
                <h2 className="f-display mt-2 text-3xl font-medium">{activeProgram.code}</h2>
                <p className="mt-1 text-sm text-neutral-content/70">{activeProgram.duration}</p>
              </div>

              {/* content */}
              <div className="p-8">
                <div className="rounded-sm border border-base-300 bg-base-200 p-6">
                  <p className="whitespace-pre-wrap leading-relaxed text-sm text-base-content/70">
                    {activeProgram.details}
                  </p>
                </div>

                <div className="modal-action mt-8">
                  <button
                    className="btn btn-outline btn-neutral rounded-sm"
                    onClick={() => setActiveProgram(null)}
                  >
                    Close
                  </button>

                  <Link to="/admission-form">
                    <button className="btn btn-primary rounded-sm">Admission enquiry</button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </dialog>
        )}

        {/* ============ GENERAL INSTRUCTION (notice plaque) ============ */}
        <div className="py-20 bg-base-200">
          <div className="max-w-4xl mx-auto px-6">
            <div className="relative rounded-sm p-10 border border-base-300 bg-base-100">
              {/* corner ticks */}
              {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map(
                (pos) => (
                  <span key={pos} className={`absolute ${pos} w-2 h-2 border border-accent`} />
                )
              )}

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-full border-2 border-accent text-accent flex items-center justify-center shrink-0 f-display text-xl">
                  i
                </div>

                <div>
                  <p className="f-mono text-[11px] uppercase tracking-[0.25em] text-accent">
                    Notice
                  </p>
                  <h3 className="f-display mt-1 text-2xl font-medium text-base-content">
                    General instruction
                  </h3>

                  <p className="mt-4 text-base leading-relaxed text-base-content/70">
                    All fees must be paid by{" "}
                    <strong className="text-base-content">Demand Draft</strong> in favour of{" "}
                    <strong className="text-base-content">Techno College Hooghly</strong>,
                    payable at Kolkata. Cash transactions will not be entertained under any
                    circumstances.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}