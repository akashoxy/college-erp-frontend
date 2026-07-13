import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  BookOpen,
  Globe,
  UserRound,
  FileText,
  FileWarning,
  DoorOpen,
} from "lucide-react";

import tihlogo from "../../assets/images/tih-logo.png";
import LogoStrip from "../../styles/Logostrip";

/* ==========================================================
   ANIMATION VARIANTS
========================================================== */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* ==========================================================
   BOOK SPINE COLORS
   Cycled by index across daisyUI semantic tokens only, so the
   shelf always matches whatever theme is active.
========================================================== */

const SPINE_STYLES = [
  { bg: "bg-primary", content: "text-primary-content", edge: "bg-primary-content/25" },
  { bg: "bg-secondary", content: "text-secondary-content", edge: "bg-secondary-content/25" },
  { bg: "bg-accent", content: "text-accent-content", edge: "bg-accent-content/25" },
  { bg: "bg-neutral", content: "text-neutral-content", edge: "bg-neutral-content/25" },
];

/* ==========================================================
   SHARED PIECES
========================================================== */

const ICON_BOX = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
};

function SectionHeading({ icon: Icon, accent, title }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`p-2.5 rounded-xl ${ICON_BOX[accent]}`}>
        <Icon size={24} />
      </div>
      <h2 className="lib-display text-3xl font-bold text-base-content">{title}</h2>
    </div>
  );
}

function LedgerRow({ label, value }) {
  if (!value) return null;

  return (
    <div className="flex items-baseline gap-2 text-sm w-full">
      <span className="whitespace-nowrap text-base-content/50">{label}</span>
      <span className="flex-1 border-b border-dotted border-base-300 translate-y-[-3px]" />
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

export default function CentralLibrary() {
  const [libraryData, setLibraryData] = useState(null);
  const [error, setError] = useState(false);

  const loadData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/library`
      );
      setLibraryData(res.data.data);
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!libraryData) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col justify-center items-center gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="lib-mono text-xs uppercase tracking-[0.2em] text-base-content/50">
          opening the library…
        </p>
        {error && (
          <p className="text-base-content/60 text-sm">
            Unable to load library information right now.
          </p>
        )}
      </div>
    );
  }

  const hasLibrarians = libraryData?.librarians?.length > 0;
  const hasEbooks = libraryData?.ebooks?.length > 0;



  return (
    <>
    <div className="min-h-screen bg-base-200">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Bitter:wght@600;700;800&family=Special+Elite&display=swap"
      />

      <style>{`
        .lib-display {
          font-family: "Bitter", ui-serif, Georgia, serif;
        }

        .lib-mono {
          font-family: "Special Elite", ui-monospace, monospace;
        }
      `}</style>

      {/* ================= HERO ================= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative overflow-hidden bg-linear-to-r from-primary via-secondary to-accent text-primary-content py-20"
      >
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              {/* bookend */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.08, rotate: 4 }}
                className="w-24 h-24 rounded-full overflow-hidden shadow-xl bg-base-100 border border-base-300"
              >
                <img src={tihlogo} alt="Logo" className="w-full h-full object-cover" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="lib-mono inline-block text-[11px] tracking-[0.25em] uppercase bg-black/15 border border-white/30 rounded px-3 py-1 mb-4 -rotate-1">
                  Knowledge Resource Centre
                </div>

                <h1 className="lib-display text-4xl md:text-6xl font-bold">
                  Central Library
                </h1>

                <p className="mt-3 text-lg opacity-90">
                  Where the institute keeps its books, its research, and its quiet.
                </p>
              </motion.div>

              {/* bookend */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6, rotate: 15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.08, rotate: -4 }}
                className="w-24 h-24 rounded-full overflow-hidden shadow-xl bg-base-100 border border-base-300"
              >
                <img src={tihlogo} alt="Logo" className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-12 space-y-16">
        {/* ================= ABOUT LIBRARY ================= */}
        {libraryData.paragraph && (
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="card bg-base-100 border border-base-300 shadow-xl">
              <div className="card-body">
                <SectionHeading icon={FileText} accent="primary" title="About the Library" />
                <p className="whitespace-pre-wrap leading-relaxed text-justify text-base-content/80">
                  {libraryData.paragraph}
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* ================= LIBRARIANS — card catalog ================= */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <SectionHeading icon={UserRound} accent="secondary" title="Librarians" />

          {hasLibrarians ? (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
            >
              {libraryData.librarians.map((librarian, index) => (
                <motion.div
                  key={librarian._id || index}
                  variants={cardItem}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="card bg-base-100 border border-base-300 shadow-xl overflow-hidden"
                >
                  <div className="px-5 pt-4 flex items-center justify-between">
                    <span className="lib-mono text-[10px] tracking-widest text-secondary">
                      LIB CARD &middot; {String(index + 1).padStart(3, "0")}
                    </span>
                  </div>

                  <div className="card-body items-center text-center pt-2">
                    {librarian.avatar ? (
                      <img
                        src={librarian.avatar}
                        alt={librarian.name}
                        loading="lazy"
                        className="w-36 h-36 rounded-full object-cover border-4 border-base-300 shadow-lg"
                      />
                    ) : (
                      <div className="w-36 h-36 rounded-full bg-base-200 border-4 border-base-300 flex items-center justify-center">
                        <UserRound size={48} className="text-base-content/40" />
                      </div>
                    )}

                    <h3 className="lib-display text-xl font-bold mt-4">
                      {librarian.name || "Librarian"}
                    </h3>

                    <div className="w-full mt-4 space-y-1.5 text-left">
                      <LedgerRow label="Designation" value={librarian.designation} />
                      <LedgerRow label="Qualification" value={librarian.qualification} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="alert">No Librarian Information Available</div>
          )}
        </motion.section>

        {/* ================= ONLINE LIBRARY ================= */}
        {libraryData.onlineLibrary && (
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="card bg-base-100 border border-base-300 shadow-xl">
              <div className="card-body">
                <SectionHeading icon={Globe} accent="accent" title="Online Library" />
                <p className="whitespace-pre-wrap leading-relaxed text-base-content/80">
                  {libraryData.onlineLibrary}
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* ================= E-BOOKS — the shelf ================= */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <SectionHeading icon={BookOpen} accent="primary" title="E-Books" />

          {hasEbooks ? (
            <div className="relative">
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="flex items-end gap-5 overflow-x-auto overflow-y-hidden pb-2 pt-2 px-1 snap-x snap-mandatory scroll-smooth"
              >
                {libraryData.ebooks.map((book, index) => {
                  const style = SPINE_STYLES[index % SPINE_STYLES.length];

                  return (
                    <motion.div
                      key={book._id || index}
                      variants={cardItem}
                      whileHover={{ y: -10 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      style={{ minHeight: `${18 + (index % 3) * 1.5}rem` }}
                      className={`relative w-48 min-w-48 shrink-0 snap-start rounded-r-lg rounded-l-sm shadow-xl flex flex-col ${style.bg} ${style.content}`}
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-3 rounded-l-sm ${style.edge}`} />

                      <div className="p-5 pl-8 flex-1 flex flex-col">
                        <span className="lib-mono text-[10px] tracking-widest opacity-75 mb-2">
                          {book.category || "general"}
                        </span>

                        <h3 className="lib-display font-bold text-lg leading-snug line-clamp-4">
                          {book.title || "Untitled Book"}
                        </h3>

                        {book.author && (
                          <p className="mt-2 text-sm opacity-80">{book.author}</p>
                        )}

                        <div className="mt-auto pt-4">
                          {book.pdfFile ? (
                            <button
                              className="btn btn-sm bg-base-100 text-base-content hover:bg-base-100/90 border-none w-full"
                              onClick={() => window.open(book.pdfFile, "_blank")}
                            >
                              <FileText size={14} />
                              Open
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs opacity-70">
                              <FileWarning size={14} />
                              File Unavailable
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* shelf ledge the books rest on */}
              <div className="h-4 rounded-full bg-base-300 shadow-inner mx-1" />
              <div className="h-2 rounded-b-md bg-base-content/10 mx-2" />
            </div>
          ) : (
            <div className="alert">No E-Books Available</div>
          )}
        </motion.section>

        {/* ================= READING ROOM ================= */}
        {libraryData.readingRoom && (
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <SectionHeading icon={DoorOpen} accent="secondary" title="Reading Room" />

            <div className="card bg-base-100 border border-base-300 shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-8 p-6">
                {libraryData.sideImage ? (
                  <motion.img
                    initial={{ opacity: 0, scale: 1.05 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    src={libraryData.sideImage}
                    alt="Reading Room"
                    loading="lazy"
                    className="w-full h-full rounded-xl object-cover border border-base-300"
                  />
                ) : (
                  <div className="w-full h-64 md:h-full rounded-xl bg-base-200 flex items-center justify-center">
                    <FileWarning size={48} className="text-base-content/40" />
                  </div>
                )}

                <div className="flex items-center">
                  <p className="whitespace-pre-wrap leading-relaxed text-justify text-base-content/80">
                    {libraryData.readingRoom}
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </div>
    <LogoStrip/>
    </>
  );
}