
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

export default function AdmissionCTASection({
  admissionTitle = "Ready To Shape Your Future?",
  admissionSubtitle = "Admissions Open",
  brochureUrl = "",
}) {
  return (
    <section className="relative py-24 md:py-28 bg-linear-to-br from-slate-950 via-primary to-slate-900 text-white overflow-hidden">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]">
        <div className="w-140 h-140 border border-white rounded-full" />
        <div className="absolute w-95 h-95 border border-white rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="max-w-4xl mx-auto px-6 text-center relative"
      >
        <span className="inline-flex items-center gap-3 text-amber-400 font-semibold text-xs tracking-[0.35em] uppercase mb-6">
          <span className="h-px w-8 bg-amber-400/60" />
          {admissionSubtitle}
          <span className="h-px w-8 bg-amber-400/60" />
        </span>

        <h2 className="font-serif text-4xl md:text-6xl font-semibold leading-tight tracking-tight">
          {admissionTitle}
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Link
            to="/admission-form"
            className="btn btn-neutral rounded-full px-9 shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            Apply Now
          </Link>

          {brochureUrl && (
            <a
              href={brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline text-white border-white/30 hover:bg-white hover:text-primary rounded-full px-9 transition-all duration-300"
            >
              Download Brochure
            </a>
          )}
        </div>
      </motion.div>
    </section>
  );
}