import React, {
  useEffect,
  useState,
  useMemo,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FaBook,
  FaUpload,
  FaEdit,
  FaTrash,
  FaSearch,
  FaDownload,
  FaEye,
  FaTimes,
  FaFilePdf,
  FaArrowLeft,
} from "react-icons/fa";

import {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
} from "../../services/facultyNoteApi";


import toast from "react-hot-toast";

export default function FacultyNotes() {
  const navigate = useNavigate();

  // ==========================================
  // USER
  // ==========================================

  const user = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("user")
      );
    } catch {
      return null;
    }
  }, []);

  // ==========================================
  // NOTES STATES
  // ==========================================

  const [notes, setNotes] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  // ==========================================
  // FORM STATES
  // ==========================================

  const [formData, setFormData] =
    useState({
      program: "",
      semester: "",
      subject: "",
      title: "",
    });

  const [pdfFile, setPdfFile] =
    useState(null);

  const [existingPdf, setExistingPdf] =
    useState("");

  const [removePdf, setRemovePdf] =
    useState(false);

  // ==========================================
  // SEARCH STATES
  // ==========================================

  const [searchFilters, setSearchFilters] =
    useState({
      keyword: "",
      program: "",
      semester: "",
    });

  // ==========================================
  // FETCH NOTES
  // ==========================================

  const fetchNotes = async () => {
    try {
      setLoading(true);

      const { notes } = await getAllNotes();
setNotes(notes);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load notes"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchNotes();
  }, []);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE SEARCH CHANGE
  // ==========================================

  const handleSearchChange = (e) => {
    const { name, value } =
      e.target;

    setSearchFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // PDF CHANGE
  // ==========================================

  const handlePdfChange = (e) => {
    const file =
      e.target.files[0];

    if (file) {
      setPdfFile(file);
    }
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      program: "",
      semester: "",
      subject: "",
      title: "",
    });

    setPdfFile(null);

    setExistingPdf("");

    setRemovePdf(false);

    setEditingId(null);
  };

  // ==========================================
  // CREATE / UPDATE NOTE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const submitData =
        new FormData();

      submitData.append(
        "program",
        formData.program
      );

      submitData.append(
        "semester",
        formData.semester
      );

      submitData.append(
        "subject",
        formData.subject
      );

      submitData.append(
        "title",
        formData.title
      );

      submitData.append(
        "removePdf",
        removePdf
      );

      if (pdfFile) {
        submitData.append(
          "pdfFile",
          pdfFile
        );
      }

      if (editingId) {
        await updateNote(
          editingId,
          submitData
        );

        toast.success(
          "Note updated successfully"
        );
      } else {
        await createNote(
          submitData
        );

        toast.success(
          "Note uploaded successfully"
        );
      }

      resetForm();
      fetchNotes();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Operation failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // EDIT NOTE
  // ==========================================

  const handleEdit = (note) => {
    setEditingId(note._id);

    setFormData({
      program:
        note.program || "",
      semester:
        note.semester || "",
      subject:
        note.subject || "",
      title:
        note.title || "",
    });

    setExistingPdf(
      note.pdfFile || ""
    );

    setRemovePdf(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE NOTE
  // ==========================================

  const handleDelete = async (
    id
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this note?"
      );

    if (!confirmDelete) return;

    try {
      await deleteNote(id);

      toast.success(
        "Note deleted successfully"
      );

      fetchNotes();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  // ==========================================
  // SEARCH NOTES
  // ==========================================

  const handleSearch =
    async () => {
      try {
        setLoading(true);

        const data =
          await searchNotes(
            searchFilters
          );

        setNotes(
          data.notes || []
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Search failed"
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================================
  // RESET SEARCH
  // ==========================================

  const resetSearch = () => {
    setSearchFilters({
      keyword: "",
      program: "",
      semester: "",
    });

    fetchNotes();
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalNotes =
    notes.length;

  const myNotes =
    notes.filter(
      (note) =>
        note.uploadedBy ===
        user?._id
    ).length;

  const totalPrograms =
    new Set(
      notes.map(
        (note) =>
          note.program
      )
    ).size;

  const totalSubjects =
    new Set(
      notes.map(
        (note) =>
          note.subject
      )
    ).size;

  const PROGRAM_OPTIONS = ["MCA", "BCA", "BBA"];
  const SEMESTER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

  const TONE_CLASSES = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    info: "bg-info/10 text-info",
    error: "bg-error/10 text-error",
  };

  const STAT_CARDS = [
    { label: "Total Notes", value: totalNotes, icon: FaBook, tone: "primary" },
    { label: "My Notes", value: myNotes, icon: FaUpload, tone: "success" },
    { label: "Programs", value: totalPrograms, icon: FaBook, tone: "info" },
    { label: "Subjects", value: totalSubjects, icon: FaFilePdf, tone: "error" },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-primary transition-colors duration-200 mb-5"
          >
            <FaArrowLeft size={13} />
            Back to Profile
          </button>

          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary via-primary to-secondary text-primary-content px-6 py-9 sm:px-10 sm:py-11 shadow-lg">
            <div
              className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none"
              aria-hidden="true"
            />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-content/70 mb-3">
                Faculty Workspace
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                Faculty Notes Repository
              </h1>
              <p className="text-primary-content/80 text-base sm:text-lg max-w-xl">
                Upload, manage and share academic notes with fellow faculty members.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* STATISTICS CARDS */}
        {/* ========================================= */}

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-8">
          {STAT_CARDS.map(({ label, value, icon: Icon, tone }) => (
            <div
              key={label}
              className="bg-base-100 border border-base-300 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-base-content/55 truncate">
                    {label}
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1.5">
                    {value}
                  </h2>
                </div>
                <span className={`w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl flex items-center justify-center ${TONE_CLASSES[tone]}`}>
                  <Icon className="text-lg sm:text-xl" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================= */}
        {/* FORM + SEARCH GRID */}
        {/* ========================================= */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 mb-8 items-start">

          {/* ========================================= */}
          {/* UPLOAD FORM */}
          {/* ========================================= */}

          <div className="xl:col-span-2">
            <div className="bg-base-100 border border-base-300 rounded-3xl shadow-sm p-6 sm:p-8">

              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-base-300">
                <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <FaUpload />
                </span>
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                    {editingId ? "Update Note" : "Upload New Note"}
                  </h2>
                  <p className="text-xs text-base-content/50 mt-0.5">
                    {editingId ? "Editing an existing entry" : "Share a new resource with faculty"}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* PROGRAM */}
                  <div>
                    <label className="label pb-1.5">
                      <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Program
                      </span>
                    </label>
                    <select
                      name="program"
                      value={formData.program}
                      onChange={handleChange}
                      className="select select-bordered w-full rounded-xl focus:select-primary"
                      required
                    >
                      <option value="">Select Program</option>
                      {PROGRAM_OPTIONS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  {/* SEMESTER */}
                  <div>
                    <label className="label pb-1.5">
                      <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Semester
                      </span>
                    </label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      className="select select-bordered w-full rounded-xl focus:select-primary"
                      required
                    >
                      <option value="">Select Semester</option>
                      {SEMESTER_OPTIONS.map((sem) => (
                        <option key={sem} value={`Semester ${sem}`}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* SUBJECT */}
                <div>
                  <label className="label pb-1.5">
                    <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/60">
                      Subject
                    </span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="input input-bordered w-full rounded-xl focus:input-primary"
                    placeholder="e.g. Data Structures"
                    required
                  />
                </div>

                {/* TITLE */}
                <div>
                  <label className="label pb-1.5">
                    <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/60">
                      Note Title
                    </span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input input-bordered w-full rounded-xl focus:input-primary"
                    placeholder="e.g. Unit 3 — Linked Lists"
                    required
                  />
                </div>

                {/* PDF FILE */}
                <div>
                  <label className="label pb-1.5">
                    <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/60">
                      Upload PDF
                    </span>
                  </label>

                  <input
                    type="file"
                    accept=".pdf"
                    className="file-input file-input-bordered w-full rounded-xl"
                    onChange={handlePdfChange}
                  />

                  {existingPdf && !removePdf && (
                    <div className="mt-3 flex flex-col gap-2 rounded-xl bg-base-200/70 border border-base-300 p-3">
                      <a
                        href={existingPdf}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline w-fit"
                      >
                        <FaFilePdf />
                        View Existing PDF
                      </a>

                      {editingId && (
                        <label className="flex items-center gap-2 cursor-pointer w-fit">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-error checkbox-sm"
                            checked={removePdf}
                            onChange={(e) => setRemovePdf(e.target.checked)}
                          />
                          <span className="text-xs font-medium text-error">
                            Remove existing PDF
                          </span>
                        </label>
                      )}
                    </div>
                  )}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary rounded-xl px-6"
                  >
                    {submitting ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : editingId ? (
                      <FaEdit />
                    ) : (
                      <FaUpload />
                    )}
                    {editingId ? "Update Note" : "Upload Note"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn btn-ghost border border-base-300 rounded-xl px-6"
                    >
                      <FaTimes />
                      Cancel
                    </button>
                  )}
                </div>

              </form>

            </div>
          </div>

          {/* ========================================= */}
          {/* SEARCH PANEL */}
          {/* ========================================= */}

          <div>
            <div className="bg-base-100 border border-base-300 rounded-3xl shadow-sm p-6 sm:p-8 xl:sticky xl:top-6">

              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-base-300">
                <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <FaSearch />
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold">
                  Search Notes
                </h2>
              </div>

              <div className="space-y-4">

                {/* KEYWORD */}
                <input
                  type="text"
                  name="keyword"
                  value={searchFilters.keyword}
                  onChange={handleSearchChange}
                  className="input input-bordered w-full rounded-xl focus:input-primary"
                  placeholder="Search by title"
                />

                {/* PROGRAM */}
                <select
                  name="program"
                  value={searchFilters.program}
                  onChange={handleSearchChange}
                  className="select select-bordered w-full rounded-xl focus:select-primary"
                >
                  <option value="">All Programs</option>
                  {PROGRAM_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>

                {/* SEMESTER */}
                <select
                  name="semester"
                  value={searchFilters.semester}
                  onChange={handleSearchChange}
                  className="select select-bordered w-full rounded-xl focus:select-primary"
                >
                  <option value="">All Semesters</option>
                  {SEMESTER_OPTIONS.map((sem) => (
                    <option key={sem} value={`Semester ${sem}`}>
                      Semester {sem}
                    </option>
                  ))}
                </select>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col gap-2.5 pt-2">
                  <button
                    onClick={handleSearch}
                    className="btn btn-primary rounded-xl"
                  >
                    <FaSearch />
                    Search
                  </button>

                  <button
                    onClick={resetSearch}
                    className="btn btn-ghost border border-base-300 rounded-xl"
                  >
                    Reset Filters
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* ========================================= */}
        {/* NOTES TABLE */}
        {/* ========================================= */}

        <div className="bg-base-100 border border-base-300 rounded-3xl shadow-sm overflow-hidden">

          <div className="px-6 sm:px-8 py-6 border-b border-base-300 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                Faculty Notes Archive
              </h2>
              <p className="text-sm text-base-content/55 mt-1">
                View and manage faculty uploaded notes
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center rounded-full bg-base-200 px-3.5 py-1.5 text-xs font-semibold text-base-content/60">
              {totalNotes} {totalNotes === 1 ? "record" : "records"}
            </span>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : notes.length === 0 ? (

            <div className="text-center py-24 px-6">
              <FaBook className="mx-auto text-5xl text-base-content/15 mb-4" />
              <h3 className="font-serif text-xl font-bold mb-1.5">
                No notes found
              </h3>
              <p className="text-base-content/55 text-sm">
                Upload your first note to get started.
              </p>
            </div>

          ) : (

            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="border-b border-base-300">
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50">#</th>
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50">Title</th>
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50">Subject</th>
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50">Program</th>
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50">Semester</th>
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50">Faculty</th>
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50">Date</th>
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50">PDF</th>
                    <th className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {notes.map((note, index) => {

                    const isOwner =
                      note.uploadedBy === user?._id ||
                      note.uploadedBy?._id === user?._id;

                    return (
                      <tr
                        key={note._id}
                        className="border-b border-base-200 last:border-none hover:bg-base-200/40 transition-colors duration-150"
                      >
                        {/* SERIAL */}
                        <td className="text-base-content/50 text-sm">{index + 1}</td>

                        {/* TITLE */}
                        <td>
                          <div className="font-semibold text-sm max-w-52 truncate">
                            {note.title}
                          </div>
                        </td>

                        {/* SUBJECT */}
                        <td className="text-sm text-base-content/70">{note.subject}</td>

                        {/* PROGRAM */}
                        <td>
                          <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
                            {note.program}
                          </span>
                        </td>

                        {/* SEMESTER */}
                        <td>
                          <span className="inline-flex items-center rounded-full bg-secondary/10 text-secondary px-3 py-1 text-xs font-semibold">
                            {note.semester}
                          </span>
                        </td>

                        {/* FACULTY */}
                        <td className="text-sm font-medium">{note.facultyName}</td>

                        {/* DATE */}
                        <td className="text-sm text-base-content/60 whitespace-nowrap">
                          {new Date(note.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        {/* PDF */}
                        <td>
                          {note.pdfFile ? (
                            <div className="flex gap-2">
                              <a
                                href={note.pdfFile}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="View PDF"
                                className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-content transition-colors duration-200"
                              >
                                <FaEye size={13} />
                              </a>
                              <a
                                href={note.pdfFile}
                                download
                                aria-label="Download PDF"
                                className="w-8 h-8 rounded-lg bg-success/10 text-success flex items-center justify-center hover:bg-success hover:text-success-content transition-colors duration-200"
                              >
                                <FaDownload size={13} />
                              </a>
                            </div>
                          ) : (
                            <span className="text-error text-xs font-semibold">
                              No PDF
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td>
                          {isOwner && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(note)}
                                aria-label="Edit note"
                                className="w-8 h-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center hover:bg-warning hover:text-warning-content transition-colors duration-200"
                              >
                                <FaEdit size={13} />
                              </button>
                              <button
                                onClick={() => handleDelete(note._id)}
                                aria-label="Delete note"
                                className="w-8 h-8 rounded-lg bg-error/10 text-error flex items-center justify-center hover:bg-error hover:text-error-content transition-colors duration-200"
                              >
                                <FaTrash size={13} />
                              </button>
                            </div>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>

          )}

        </div>

      </div>
    </div>
  );
}