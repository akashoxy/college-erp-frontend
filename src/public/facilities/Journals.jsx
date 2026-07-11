import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  Globe,
  Library,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react";


const displayFont = { fontFamily: "'Fraunces', 'Georgia', serif" };
const monoFont = { fontFamily: "'JetBrains Mono', monospace" };

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function Journals() {
  const [journalData, setJournalData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadJournalData = async () => {
    try {
      const res = await api.get("/journal");
setJournalData(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJournalData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="skeleton h-96 w-full rounded-none" />
          <div className="grid md:grid-cols-2 gap-10 mt-16">
            <div className="skeleton h-72 w-full rounded-none" />
            <div className="space-y-4">
              <div className="skeleton h-6 w-full" />
              <div className="skeleton h-6 w-full" />
              <div className="skeleton h-6 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const journals = journalData?.journalList || [];
  const publications = journalData?.researchPublications || [];

  return (
    <div className="bg-base-100 overflow-hidden">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section
        className="relative min-h-[85vh] flex items-end bg-neutral text-neutral-content bg-cover bg-center"
        style={{
          backgroundImage: journalData?.bannerImage
            ? `url(${journalData.bannerImage})`
            : "none",
        }}
      >
        {/* Ink wash so type stays legible over any photograph */}
        <div className="absolute inset-0 bg-linear-to-t from-neutral via-neutral/70 to-neutral/20" />

        {/* Fine grid, follows theme text color */}
        <div
          className="absolute inset-0 opacity-[0.06] text-primary"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pb-20 pt-40 w-full">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            <motion.div
              variants={item}
              className="inline-flex items-center gap-3 pb-3 mb-8 border-b border-primary/30"
            >
              <GraduationCap size={15} className="text-primary" />
              <span
                className="text-xs tracking-[0.25em] uppercase text-primary"
                style={monoFont}
              >
                Academic Publications
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              style={{ ...displayFont, fontWeight: 600 }}
              className="text-5xl md:text-7xl leading-[1.02] tracking-tight"
            >
              Journals &amp;
              <br />
              <span className="text-primary italic font-medium">
                Research Publications
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-7 max-w-xl text-lg leading-8 text-neutral-content/80"
            >
              Academic excellence through innovation, research and scholarly
              publications.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-10 flex flex-wrap items-center gap-8"
            >
              <div>
                <p style={displayFont} className="text-3xl font-semibold text-primary">
                  {journals.length}
                </p>
                <p className="text-xs tracking-widest uppercase text-neutral-content/60" style={monoFont}>
                  Journals
                </p>
              </div>
              <div className="w-px h-10 bg-primary/20" />
              <div>
                <p style={displayFont} className="text-3xl font-semibold text-primary">
                  {publications.length}
                </p>
                <p className="text-xs tracking-widest uppercase text-neutral-content/60" style={monoFont}>
                  Publications
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          RESEARCH CULTURE — asymmetric intro
      ========================================================= */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <div className="absolute -inset-3 border border-primary/30 pointer-events-none" />
              <div className="relative overflow-hidden aspect-4/5 bg-base-300">
                {journalData?.sideImage ? (
                  <img
                    src={journalData.sideImage}
                    alt="Research"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen size={90} className="text-primary/20" />
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <span className="text-xs tracking-[0.25em] uppercase text-primary" style={monoFont}>
                Research Culture
              </span>

              <h2
                style={displayFont}
                className="mt-4 text-4xl md:text-5xl font-semibold leading-tight text-base-content"
              >
                A record of
                <span className="italic text-secondary"> inquiry</span>
              </h2>

              <p className="mt-7 text-lg leading-8 text-base-content/80 whitespace-pre-line">
                {journalData?.paragraph ||
                  "Our research culture is documented here as it happens — subscriptions, publications and the work that comes out of them."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SUBSCRIBED JOURNALS — library index
      ========================================================= */}
      <section className="py-24 bg-neutral text-neutral-content">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-12 flex-wrap gap-4"
          >
            <div>
              <span className="text-xs tracking-[0.25em] uppercase text-primary" style={monoFont}>
                Library Index
              </span>
              <h2 style={displayFont} className="mt-3 text-4xl md:text-5xl font-semibold">
                Subscribed Journals
              </h2>
            </div>
            <div className="flex items-center gap-2 text-neutral-content/60">
              <Library size={16} className="text-primary" />
              <span className="text-sm" style={monoFont}>
                {journals.length} in circulation
              </span>
            </div>
          </motion.div>

          {journals.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-content/10 border border-neutral-content/10"
            >
              {journals.map((journal, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="flex items-center gap-4 px-6 py-5 bg-neutral"
                >
                  <span
                    className="text-xs text-primary tabular-nums"
                    style={monoFont}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span style={displayFont} className="text-lg">
                    {journal}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-neutral-content/60" style={monoFont}>
              No journals listed yet.
            </p>
          )}
        </div>
      </section>

      {/* =========================================================
          RESEARCH PUBLICATIONS — citation cards
      ========================================================= */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 max-w-2xl"
          >
            <span className="text-xs tracking-[0.25em] uppercase text-primary" style={monoFont}>
              Bibliography
            </span>
            <h2
              style={displayFont}
              className="mt-3 text-4xl md:text-5xl font-semibold leading-tight text-base-content"
            >
              Research Publications
            </h2>
            <p className="mt-5 text-base-content/70 leading-7">
              Explore our published research work.
            </p>
          </motion.div>

          {publications.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {publications.map((publication, index) => (
                <motion.div
                  key={publication._id}
                  variants={item}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-full flex flex-col border border-base-300 bg-base-100 p-7">
                    <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary" />
                    <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary" />

                    <span
                      className="text-xs text-primary tabular-nums"
                      style={monoFont}
                    >
                      [{String(index + 1).padStart(2, "0")}]
                    </span>

                    <h3
                      style={displayFont}
                      className="mt-3 text-xl font-semibold leading-snug text-base-content line-clamp-2"
                    >
                      {publication.title}
                    </h3>

                    <p className="mt-2 text-sm italic text-secondary">
                      {publication.authors}
                    </p>

                    <p className="mt-4 text-sm leading-7 text-base-content/70 line-clamp-5 flex-1">
                      {publication.description}
                    </p>

                    <div className="mt-6 pt-5 border-t border-base-300 flex flex-wrap gap-2">
                      {publication.pdfUrl && (
                        <button
                          onClick={() => window.open(publication.pdfUrl, "_blank")}
                          className="btn btn-sm btn-primary rounded-none gap-2"
                        >
                          <FileText size={14} />
                          View PDF
                        </button>
                      )}

                      {publication.websiteUrl && (
                        <button
                          onClick={() => window.open(publication.websiteUrl, "_blank")}
                          className="btn btn-sm btn-outline rounded-none gap-2"
                        >
                          <Globe size={14} />
                          Visit Site
                          <ArrowUpRight size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="border border-base-300 py-20 text-center">
              <FileText size={56} className="mx-auto text-base-content/20" />
              <h3 style={displayFont} className="mt-5 text-2xl font-semibold text-base-content">
                No Publications Yet
              </h3>
              <p className="mt-2 text-base-content/60">
                Research publications will appear here once added.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}