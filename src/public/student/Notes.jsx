import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { motion } from "framer-motion";

import {
  FaBookOpen,
  FaSearch,
  FaEye,
  FaDownload,
  FaFilePdf,
  FaFilter,
  FaArrowLeft,
  FaGraduationCap,
  FaLayerGroup,
  FaFolderOpen,
} from "react-icons/fa";

export default function Notes() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");

  // =====================================
  // FETCH NOTES
  // =====================================

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);

      const res = await api.get("/faculty-notes/student");

console.log(res.data);

setNotes(res.data.data.notes || []);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // FILTER NOTES
  // =====================================

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        note.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        note.subject
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesProgram =
        !program ||
        note.program === program;

      const matchesSemester =
        !semester ||
        note.semester === semester;


      return (
        matchesSearch &&
        matchesProgram &&
        matchesSemester
      );
    });
  }, [
    notes,
    search,
    program,
    semester,
  ]);

  // =====================================
  // STATS
  // =====================================

  const stats = {
    total: notes.length,
    filtered: filteredNotes.length,
    programs: [
      ...new Set(
        notes.map(
          (item) => item.program
        )
      ),
    ].length,
  };

  const PROGRAM_OPTIONS = ["BCA", "BBA", "MCA"];
  const SEMESTER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

  const TONE_CLASSES = {
    primary: { icon: "bg-primary/10 text-primary", value: "text-primary" },
    success: { icon: "bg-success/10 text-success", value: "text-success" },
    secondary: { icon: "bg-secondary/10 text-secondary", value: "text-secondary" },
  };

  const STAT_CARDS = [
    { label: "Total Notes", value: stats.total, icon: FaBookOpen, tone: "primary" },
    { label: "Available Results", value: stats.filtered, icon: FaFolderOpen, tone: "success" },
    { label: "Programs", value: stats.programs, icon: FaGraduationCap, tone: "secondary" },
  ];

  return (
    <section className="min-h-screen bg-base-200">

      {/* Custom themed scrollbar for the results panel */}
      <style>{`
        .notes-scroll {
          scrollbar-width: thin;
          scrollbar-color: var(--fallback-p, oklch(var(--p) / 0.5)) transparent;
        }
        .notes-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .notes-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .notes-scroll::-webkit-scrollbar-thumb {
          background-color: var(--fallback-p, oklch(var(--p) / 0.45));
          border-radius: 999px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        .notes-scroll::-webkit-scrollbar-thumb:hover {
          background-color: var(--fallback-p, oklch(var(--p) / 0.7));
          background-clip: padding-box;
        }
      `}</style>

      {/* HERO */}
      <div className="relative overflow-hidden bg-base-100 border-b border-base-300">
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-xl h-144 rounded-full bg-primary/5 pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative max-w-4xl mx-auto px-4 py-14 sm:py-16 text-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-5">
            Student Learning Portal
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-base-content">
            Academic Notes Repository
          </h1>

          <p className="max-w-2xl mx-auto mt-4 text-base-content/60 text-sm sm:text-base leading-relaxed">
            Browse, preview and download faculty uploaded study materials,
            lecture notes, subject resources and academic content.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/profile")}
          className="inline-flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-primary transition-colors duration-200 mb-6"
        >
          <FaArrowLeft size={13} />
          Back to Profile
        </button>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
          {STAT_CARDS.map(({ label, value, icon: Icon, tone }) => (
            <div
              key={label}
              className="bg-base-100 border border-base-300 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-5 sm:p-6 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-base-content/55 truncate">
                  {label}
                </p>
                <h2 className={`font-serif text-2xl sm:text-3xl font-bold mt-1.5 ${TONE_CLASSES[tone].value}`}>
                  {value}
                </h2>
              </div>
              <span className={`w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center ${TONE_CLASSES[tone].icon}`}>
                <Icon size={20} />
              </span>
            </div>
          ))}
        </div>

        {/* SEARCH + FILTERS */}
        <div className="bg-base-100 border border-base-300 rounded-3xl shadow-sm p-6 sm:p-8 mb-8">

          <div className="mb-6">
            <label className="text-xs font-semibold uppercase tracking-wide text-base-content/55 mb-2 block">
              Search
            </label>
            <label className="input input-bordered rounded-xl flex items-center gap-3 w-full focus-within:input-primary">
              <FaSearch className="opacity-50 shrink-0" size={14} />
              <input
                type="text"
                className="grow"
                placeholder="Search by title or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>

          <div className="pt-6 border-t border-base-300">
            <div className="flex items-center gap-2 mb-4">
              <FaFilter className="text-primary" size={13} />
              <span className="text-xs font-semibold uppercase tracking-wide text-base-content/55">
                Filters
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-base-content/55 mb-2 block">
                  Program
                </label>
                <select
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="select select-bordered w-full rounded-xl focus:select-primary"
                >
                  <option value="">All Programs</option>
                  {PROGRAM_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-base-content/55 mb-2 block">
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="select select-bordered w-full rounded-xl focus:select-primary"
                >
                  <option value="">All Semesters</option>
                  {SEMESTER_OPTIONS.map((sem) => (
                    <option key={sem} value={`Semester ${sem}`}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS HEADER */}
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="font-serif text-lg sm:text-xl font-bold">
            Results
          </h2>
          <span className="text-xs font-semibold text-base-content/50">
            {stats.filtered} of {stats.total} notes
          </span>
        </div>

        {/* NOTES — scrollable results panel */}
        {loading ? (
          <div className="flex justify-center py-24">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="bg-base-100 border border-base-300 rounded-3xl shadow-sm text-center py-20 px-6">
            <FaBookOpen className="mx-auto text-5xl text-base-content/15 mb-4" />
            <h3 className="font-serif text-xl font-bold mb-1.5">
              No notes found
            </h3>
            <p className="text-base-content/55 text-sm">
              No faculty notes match your search criteria.
            </p>
          </div>
        ) : (
          <div className="notes-scroll max-h-[75vh] overflow-y-auto pr-1 sm:pr-2 rounded-3xl">
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 pb-2">
              {filteredNotes.map((note) => (
                <motion.div
                  key={note._id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 h-full flex flex-col p-6">

                    {/* TOP */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
                        {note.program}
                      </span>
                      <span className="w-9 h-9 rounded-lg bg-error/10 text-error flex items-center justify-center">
                        <FaFilePdf size={15} />
                      </span>
                    </div>

                    {/* TITLE */}
                    <h3 className="font-serif text-lg font-bold leading-snug mb-4">
                      {note.title}
                    </h3>

                    {/* DETAILS */}
                    <div className="space-y-2.5 text-sm text-base-content/70 mb-5">
                      <div className="flex items-center gap-2">
                        <FaBookOpen className="text-primary shrink-0" size={13} />
                        <span className="truncate">{note.subject}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaLayerGroup className="text-secondary shrink-0" size={13} />
                        <span>{note.semester}</span>
                      </div>

                      <div>
                        <span className="font-semibold text-base-content/85">Faculty:</span>{" "}
                        {note.facultyName}
                      </div>

                      <div className="text-xs text-base-content/45">
                        Uploaded on{" "}
                        {new Date(note.createdAt).toLocaleDateString("en-IN")}
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-auto pt-4 border-t border-base-200 flex justify-end gap-2">
                      {note.pdfFile ? (
                        <>
                          <a
                            href={note.pdfFile}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-primary btn-sm rounded-lg"
                          >
                            <FaEye size={12} />
                            View
                          </a>

                          <a
                            href={note.pdfFile}
                            download
                            className="btn btn-success btn-sm rounded-lg"
                          >
                            <FaDownload size={12} />
                            Download
                          </a>
                        </>
                      ) : (
                        <span className="text-error text-xs font-semibold">
                          No PDF attached
                        </span>
                      )}
                    </div>

                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}