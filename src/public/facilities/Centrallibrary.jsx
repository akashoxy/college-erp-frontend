import React, { useEffect, useState } from "react";
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
    <div className="min-h-screen bg-base-200">
      {/* ================= HERO ================= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative overflow-hidden bg-linear-to-r from-primary via-secondary to-accent text-primary-content py-20"
      >
        {/* soft decorative glow, no washed-out overlay */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
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
              <h1 className="text-4xl md:text-6xl font-bold">Central Library</h1>
              <p className="mt-3 text-lg opacity-90">Knowledge Resource Centre</p>
            </motion.div>

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
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <FileText size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-base-content">
                    About the Library
                  </h2>
                </div>
                <p className="whitespace-pre-wrap leading-relaxed text-justify text-base-content/80">
                  {libraryData.paragraph}
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* ================= LIBRARIANS ================= */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary">
              <UserRound size={24} />
            </div>
            <h2 className="text-3xl font-bold text-base-content">Librarians</h2>
          </div>

          {hasLibrarians ? (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {libraryData.librarians.map((librarian, index) => (
                <motion.div
                  key={librarian._id || index}
                  variants={cardItem}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="card bg-base-100 border border-base-300 shadow-xl"
                >
                  <div className="card-body items-center text-center">
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

                    <h3 className="text-xl font-bold mt-4">
                      {librarian.name || "Librarian"}
                    </h3>

                    {librarian.designation && (
                      <p className="text-base-content/80">
                        <strong>Designation:</strong> {librarian.designation}
                      </p>
                    )}

                    {librarian.qualification && (
                      <p className="text-base-content/80">
                        <strong>Qualification:</strong> {librarian.qualification}
                      </p>
                    )}
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
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
                    <Globe size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-base-content">
                    Online Library
                  </h2>
                </div>
                <p className="whitespace-pre-wrap leading-relaxed text-base-content/80">
                  {libraryData.onlineLibrary}
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* ================= E-BOOKS ================= */}
        <motion.section
  variants={fadeUp}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.15 }}
>
  {/* ==========================================
      SECTION HEADER
  ========================================== */}

  <div className="flex items-center gap-3 mb-6">

    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">

      <BookOpen size={24} />

    </div>

    <h2 className="text-3xl font-bold text-base-content">

      E-Books

    </h2>

  </div>

  {/* ==========================================
      EBOOK LIST
  ========================================== */}

  {hasEbooks ? (

    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="
        flex
        gap-6
        overflow-x-auto
        overflow-y-hidden
        pb-5
        snap-x
        snap-mandatory
        scroll-smooth
      "
    >

      {libraryData.ebooks.map(

        (book, index) => (

          <motion.div
            key={book._id || index}
            variants={cardItem}
            whileHover={{
              y: -8,
              scale: 1.03,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="
              card
              bg-base-100
              border
              border-base-300
              shadow-xl
              w-80
              min-w-80
              shrink-0
              snap-start
              hover:shadow-2xl
              transition-all
              duration-300
            "
          >

            <div className="card-body">

              <h3 className="font-bold text-xl line-clamp-2">

                {book.title || "Untitled Book"}

              </h3>

              {book.author && (

                <p className="text-base-content/70">

                  <strong>

                    Author:

                  </strong>{" "}

                  {book.author}

                </p>

              )}

              {book.category && (

                <div className="badge badge-outline badge-primary mt-2 w-fit">

                  {book.category}

                </div>

              )}

              <div className="divider my-2"></div>

              <div className="flex gap-3">

                {book.pdfFile ? (

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      window.open(
                        book.pdfFile,
                        "_blank"
                      )
                    }
                  >

                    <FileText size={16} />

                    Open

                  </button>

                ) : (

                  <div className="flex items-center gap-2 text-base-content/50">

                    <FileWarning size={18} />

                    File Unavailable

                  </div>

                )}

              </div>

            </div>

          </motion.div>

        )

      )}

    </motion.div>

  ) : (

    <div className="alert">

      No E-Books Available

    </div>

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
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary">
                <DoorOpen size={24} />
              </div>
              <h2 className="text-3xl font-bold text-base-content">Reading Room</h2>
            </div>

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
                    className="w-full h-full rounded-xl object-cover"
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
  );
}