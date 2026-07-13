import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  FaBook,
  FaDownload,
  FaEdit,
  FaEye,
  FaFilePdf,
  FaGraduationCap,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrash,
  FaUniversity,
} from "react-icons/fa";

import api from "../../../../services/api";


export default function PreviousQuestionControl() {
  // ==================================================
  // STATES
  // ==================================================

  const [papers, setPapers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [programFilter, setProgramFilter] =
    useState("ALL");

  const [semesterFilter, setSemesterFilter] =
    useState("ALL");

  const [yearFilter, setYearFilter] =
    useState("ALL");

  const [pdfFile, setPdfFile] =
    useState(null);

  const [pdfPreview, setPdfPreview] =
    useState("");

  const [existingPdf, setExistingPdf] =
    useState("");

  const [pdfRemoved, setPdfRemoved] =
    useState(false);

  const [formData, setFormData] =
    useState({
      title: "",
      program: "BCA",
      semester: "Semester 1",
      subject: "",
      year: new Date().getFullYear(),
      paperType: "New",
    });

  // ==================================================
  // FETCH PAPERS
  // ==================================================

  const fetchPapers = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        "/previous-papers"
      );

      setPapers(data.data || []);
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed to fetch previous question papers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  // ==================================================
  // INPUT HANDLER
  // ==================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==================================================
  // PDF HANDLER
  // ==================================================

  const handlePdfChange = (e) => {
    const file =
      e.target.files?.[0] || null;

    if (!file) return;

    if (
      file.type !==
      "application/pdf"
    ) {
      alert(
        "Only PDF files are allowed."
      );
      return;
    }

    if (
      file.size >
      20 * 1024 * 1024
    ) {
      alert(
        "Maximum PDF size is 20 MB."
      );
      return;
    }

    setPdfFile(file);

    setPdfPreview(
      URL.createObjectURL(file)
    );

    setPdfRemoved(false);
  };

  // ==================================================
  // REMOVE EXISTING PDF
  // ==================================================

  const removeExistingPdf = () => {
    setExistingPdf("");

    setPdfPreview("");

    setPdfFile(null);

    setPdfRemoved(true);
  };

  // ==================================================
  // RESET FORM
  // ==================================================

  const resetForm = () => {
    setEditingId(null);

    setPdfFile(null);

    setPdfPreview("");

    setExistingPdf("");

    setPdfRemoved(false);

    setFormData({
      title: "",
      subject: "",
      program: "BCA",
      semester: "Semester 1",
      year: new Date().getFullYear(),
      paperType: "New",
    });
  };

  // ==================================================
  // CREATE PAPER
  // ==================================================

  const createPaper = async () => {
    try {
      setSubmitting(true);

      const submitData =
        new FormData();

      Object.entries(formData).forEach(
        ([key, value]) => {
          submitData.append(
            key,
            value
          );
        }
      );

      if (pdfFile) {
        submitData.append(
          "pdfFile",
          pdfFile
        );
      }

      await api.post(
        "/previous-papers",
        submitData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert(
        "Question paper added successfully."
      );

      resetForm();

      fetchPapers();
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed to upload question paper."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==================================================
  // UPDATE PAPER
  // ==================================================

  const updatePaper = async () => {
    try {
      setSubmitting(true);

      const submitData =
        new FormData();

      Object.entries(formData).forEach(
        ([key, value]) => {
          submitData.append(
            key,
            value
          );
        }
      );

      if (pdfFile) {
        submitData.append(
          "pdfFile",
          pdfFile
        );
      }

      submitData.append(
        "existingPdf",
        existingPdf
      );

      submitData.append(
        "pdfRemoved",
        pdfRemoved
      );

      await api.put(
        `/previous-papers/${editingId}`,
        submitData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert(
        "Question paper updated successfully."
      );

      resetForm();

      fetchPapers();
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed to update question paper."
      );
    } finally {
      setSubmitting(false);
    }
  };
    // ==================================================
  // DELETE PAPER
  // ==================================================

  const deletePaper = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this question paper?"
      );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      await api.delete(
        `/previous-papers/${id}`
      );

      alert(
        "Question paper deleted successfully."
      );

      fetchPapers();
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed to delete question paper."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // EDIT PAPER
  // ==================================================

  const editPaper = (paper) => {
    setEditingId(paper._id);

    setPdfRemoved(false);

    setPdfFile(null);

    setExistingPdf(
      paper.pdfFile || ""
    );

    setPdfPreview(
      paper.pdfFile || ""
    );

    setFormData({
      title:
        paper.title || "",

      subject:
        paper.subject || "",

      program:
        paper.program || "BCA",

      semester:
        paper.semester ||
        "Semester 1",

      year:
        paper.year ||
        new Date().getFullYear(),

      paperType:
        paper.paperType ||
        "New",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==================================================
  // SEARCH + FILTER
  // ==================================================

  const filteredPapers =
    useMemo(() => {
      return papers.filter(
        (paper) => {
          const searchMatch =
            paper.title
              ?.toLowerCase()
              .includes(
                searchTerm.toLowerCase()
              ) ||
            paper.subject
              ?.toLowerCase()
              .includes(
                searchTerm.toLowerCase()
              );

          const programMatch =
            programFilter === "ALL"
              ? true
              : paper.program ===
                programFilter;

          const semesterMatch =
            semesterFilter ===
            "ALL"
              ? true
              : paper.semester ===
                semesterFilter;

          const yearMatch =
            yearFilter === "ALL"
              ? true
              : Number(
                  paper.year
                ) ===
                Number(
                  yearFilter
                );

          return (
            searchMatch &&
            programMatch &&
            semesterMatch &&
            yearMatch
          );
        }
      );
    }, [
      papers,
      searchTerm,
      programFilter,
      semesterFilter,
      yearFilter,
    ]);

  // ==================================================
  // DASHBOARD STATS
  // ==================================================

  const stats = useMemo(() => {
    return {
      total: papers.length,

      bca: papers.filter(
        (paper) =>
          paper.program ===
          "BCA"
      ).length,

      bba: papers.filter(
        (paper) =>
          paper.program ===
          "BBA"
      ).length,

      mca: papers.filter(
        (paper) =>
          paper.program ===
          "MCA"
      ).length,
    };
  }, [papers]);

  // ==================================================
  // JSX
  // ==================================================

  return (
    <div className="min-h-screen bg-base-200 p-6">

      {/* ====================================== */}
      {/* HERO */}
      {/* ====================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="mb-8"
      >
        <div className="hero rounded-3xl bg-linear-to-r from-primary to-secondary text-primary-content shadow-2xl">

          <div className="hero-content flex-col lg:flex-row justify-between w-full px-8 py-12">

            <div>

              <h1 className="text-4xl lg:text-5xl font-black">
                Previous Question Paper
                Management
              </h1>

              <p className="mt-4 max-w-3xl text-lg opacity-90">
                Upload,
                organize,
                edit and
                manage previous
                question papers
                stored securely on
                Cloudinary for your
                ERP.
              </p>

            </div>

            <div className="stats shadow bg-base-100 text-base-content">

              <div className="stat">

                <div className="stat-title">
                  Total Papers
                </div>

                <div className="stat-value text-primary">
                  {stats.total}
                </div>

              </div>

            </div>

          </div>

        </div>
      </motion.div>

      {/* ====================================== */}
      {/* DASHBOARD STATS */}
      {/* ====================================== */}

      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">

        <motion.div
          whileHover={{
            scale: 1.03,
          }}
          className="card bg-base-100 shadow-xl border border-base-300"
        >
          <div className="card-body">

            <FaFilePdf className="text-5xl text-error" />

            <p className="opacity-70">
              Total Papers
            </p>

            <h2 className="text-4xl font-black">
              {stats.total}
            </h2>

          </div>

        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.03,
          }}
          className="card bg-base-100 shadow-xl border border-base-300"
        >
          <div className="card-body">

            <FaGraduationCap className="text-5xl text-primary" />

            <p className="opacity-70">
              BCA Papers
            </p>

            <h2 className="text-4xl font-black">
              {stats.bca}
            </h2>

          </div>

        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.03,
          }}
          className="card bg-base-100 shadow-xl border border-base-300"
        >
          <div className="card-body">

            <FaBook className="text-5xl text-success" />

            <p className="opacity-70">
              BBA Papers
            </p>

            <h2 className="text-4xl font-black">
              {stats.bba}
            </h2>

          </div>

        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.03,
          }}
          className="card bg-base-100 shadow-xl border border-base-300"
        >
          <div className="card-body">

            <FaUniversity className="text-5xl text-warning" />

            <p className="opacity-70">
              MCA Papers
            </p>

            <h2 className="text-4xl font-black">
              {stats.mca}
            </h2>

          </div>

        </motion.div>

      </div>
            {/* ====================================== */}
      {/* FORM + LIVE PREVIEW */}
      {/* ====================================== */}

      <div className="grid xl:grid-cols-3 gap-8 mb-10">

        {/* ====================================== */}
        {/* FORM */}
        {/* ====================================== */}

        <div className="xl:col-span-2">

          <div className="card bg-base-100 shadow-2xl">

            <div className="card-body">

              <h2 className="card-title text-2xl mb-6">

                {editingId ? (
                  <>
                    <FaEdit />
                    Update Question Paper
                  </>
                ) : (
                  <>
                    <FaPlus />
                    Upload Question Paper
                  </>
                )}

              </h2>

              <div className="grid md:grid-cols-2 gap-4">

                {/* TITLE */}

                <input
                  type="text"
                  name="title"
                  placeholder="Paper Title/Paper Code"
                  className="input input-bordered w-full"
                  value={formData.title}
                  onChange={handleChange}
                />

                {/* SUBJECT */}

                <input
                  type="text"
                  name="subject"
                  placeholder="Subject Name"
                  className="input input-bordered w-full"
                  value={formData.subject}
                  onChange={handleChange}
                />

                {/* PROGRAM */}

                <select
                  name="program"
                  className="select select-bordered"
                  value={formData.program}
                  onChange={handleChange}
                >
                  <option value="BCA">
                    BCA
                  </option>

                  <option value="BBA">
                    BBA
                  </option>

                  <option value="MCA">
                    MCA
                  </option>
                </select>

                {/* SEMESTER */}

                <select
                  name="semester"
                  className="select select-bordered"
                  value={formData.semester}
                  onChange={handleChange}
                >
                  {[
                    "Semester 1",
                    "Semester 2",
                    "Semester 3",
                    "Semester 4",
                    "Semester 5",
                    "Semester 6",
                    "Semester 7",
                    "Semester 8",
                  ].map((semester) => (
                    <option
                      key={semester}
                      value={semester}
                    >
                      {semester}
                    </option>
                  ))}
                </select>

                {/* YEAR */}

                <select
                  name="year"
                  className="select select-bordered"
                  value={formData.year}
                  onChange={handleChange}
                >
                  {Array.from(
                    {
                      length: 10,
                    },
                    (_, i) =>
                      new Date().getFullYear() -
                      i
                  ).map((year) => (
                    <option
                      key={year}
                      value={year}
                    >
                      {year}
                    </option>
                  ))}
                </select>

                {/* PAPER TYPE */}

                <select
                  name="paperType"
                  className="select select-bordered"
                  value={
                    formData.paperType
                  }
                  onChange={handleChange}
                >
                  <option value="New">
                    New
                  </option>

                  <option value="Old">
                    Old
                  </option>
                </select>

              </div>

              {/* ====================================== */}
              {/* PDF UPLOAD */}
              {/* ====================================== */}

              <div className="mt-8">

                <label className="font-semibold mb-2 block">

                  Upload PDF

                </label>

                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  className="file-input file-input-bordered w-full"
                  onChange={
                    handlePdfChange
                  }
                />

                <p className="text-xs opacity-70 mt-2">
                  Supported format:
                  PDF (.pdf) •
                  Maximum file size:
                  20 MB
                </p>

                {/* EXISTING CLOUDINARY PDF */}

                {existingPdf &&
                  !pdfFile && (

                    <div className="alert bg-base-200 border border-base-300 mt-5">

                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">

                        <div>

                          <h3 className="font-bold">
                            Existing PDF
                          </h3>

                          <p className="text-sm opacity-70 break-all">
                            {existingPdf}
                          </p>

                        </div>

                        <div className="flex gap-2">

                          <a
                            href={
                              existingPdf
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-primary"
                          >
                            <FaEye />
                            View
                          </a>

                          <button
                            type="button"
                            className="btn btn-sm btn-error"
                            onClick={
                              removeExistingPdf
                            }
                          >
                            <FaTrash />
                            Remove
                          </button>

                        </div>

                      </div>

                    </div>

                  )}

                {/* NEW PDF */}

                {pdfFile && (

                  <div className="alert alert-success mt-5">

                    <FaFilePdf className="text-xl" />

                    <div>

                      <h3 className="font-bold">
                        New PDF Selected
                      </h3>

                      <p className="text-sm break-all">
                        {pdfFile.name}
                      </p>

                    </div>

                  </div>

                )}

              </div>

              {/* ====================================== */}
              {/* ACTION BUTTONS */}
              {/* ====================================== */}

              <div className="flex flex-wrap gap-3 mt-8">

                {editingId ? (

                  <>
                    <button
                      className="btn btn-warning"
                      disabled={
                        submitting
                      }
                      onClick={
                        updatePaper
                      }
                    >
                      <FaEdit />

                      {submitting
                        ? "Updating..."
                        : "Update Paper"}
                    </button>

                    <button
                      className="btn btn-outline"
                      disabled={
                        submitting
                      }
                      onClick={
                        resetForm
                      }
                    >
                      <FaTimes />
                      Cancel
                    </button>
                  </>

                ) : (

                  <button
                    className="btn btn-primary"
                    disabled={
                      submitting
                    }
                    onClick={
                      createPaper
                    }
                  >
                    <FaPlus />

                    {submitting
                      ? "Uploading..."
                      : "Upload Paper"}
                  </button>

                )}

              </div>

            </div>

          </div>

        </div>

        {/* ====================================== */}
        {/* LIVE PREVIEW */}
        {/* ====================================== */}

        <div>

          <div className="card bg-base-100 shadow-2xl sticky top-4">

            <div className="card-body">

              <h2 className="card-title">

                <FaEye />

                Live Preview

              </h2>

              <div className="divider my-2"></div>

              <div className="space-y-4">

                <div className="badge badge-primary">
                  {formData.program}
                </div>

                <h3 className="text-2xl font-bold">

                  {formData.title ||
                    "Question Paper Title"}

                </h3>

                <p>

                  <span className="font-semibold">
                    Subject:
                  </span>{" "}

                  {formData.subject ||
                    "Subject Name"}

                </p>

                <p>

                  <span className="font-semibold">
                    Semester:
                  </span>{" "}

                  {formData.semester}

                </p>

                <p>

                  <span className="font-semibold">
                    Year:
                  </span>{" "}

                  {formData.year}

                </p>

                <div className="badge badge-secondary">

                  {formData.paperType}

                </div>

                {pdfPreview ? (

                  <a
                    href={pdfPreview}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-primary w-full"
                  >
                    <FaFilePdf />

                    Preview PDF
                  </a>

                ) : (

                  <div className="alert">

                    <span>
                      No PDF Selected
                    </span>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      </div>
            {/* ====================================== */}
      {/* SEARCH + FILTERS */}
      {/* ====================================== */}

      <div className="card bg-base-100 shadow-xl mb-8">

        <div className="card-body">

          <h2 className="card-title mb-4">

            <FaSearch />

            Search & Filters

          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">

            {/* SEARCH */}

            <label className="input input-bordered flex items-center gap-2">

              <FaSearch />

              <input
                type="text"
                className="grow"
                placeholder="Search by title or subject..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

            </label>

            {/* PROGRAM */}

            <select
              className="select select-bordered"
              value={programFilter}
              onChange={(e) =>
                setProgramFilter(
                  e.target.value
                )
              }
            >
              <option value="ALL">
                All Programs
              </option>

              <option value="BCA">
                BCA
              </option>

              <option value="BBA">
                BBA
              </option>

              <option value="MCA">
                MCA
              </option>

            </select>

            {/* SEMESTER */}

            <select
              className="select select-bordered"
              value={semesterFilter}
              onChange={(e) =>
                setSemesterFilter(
                  e.target.value
                )
              }
            >
              <option value="ALL">
                All Semesters
              </option>

              {[
                "Semester 1",
                "Semester 2",
                "Semester 3",
                "Semester 4",
                "Semester 5",
                "Semester 6",
                "Semester 7",
                "Semester 8",
              ].map((semester) => (
                <option
                  key={semester}
                  value={semester}
                >
                  {semester}
                </option>
              ))}

            </select>

            {/* YEAR */}

            <select
              className="select select-bordered"
              value={yearFilter}
              onChange={(e) =>
                setYearFilter(
                  e.target.value
                )
              }
            >
              <option value="ALL">
                All Years
              </option>

              {Array.from(
                {
                  length: 10,
                },
                (_, i) =>
                  new Date().getFullYear() -
                  i
              ).map((year) => (
                <option
                  key={year}
                  value={year}
                >
                  {year}
                </option>
              ))}

            </select>

          </div>

        </div>

      </div>

      {/* ====================================== */}
      {/* QUESTION PAPER ARCHIVE */}
      {/* ====================================== */}

      <div className="card bg-base-100 shadow-2xl">

        <div className="card-body">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            <h2 className="card-title text-2xl">

              Previous Question Paper Archive

            </h2>

            <div className="badge badge-primary badge-lg">

              {filteredPapers.length} Records

            </div>

          </div>

          {/* LOADING */}

          {loading ? (

            <div className="flex justify-center items-center py-20">

              <span className="loading loading-spinner loading-lg text-primary"></span>

            </div>

          ) : filteredPapers.length === 0 ? (

            <div className="text-center py-20">

              <FaFilePdf className="mx-auto text-7xl opacity-20 mb-4" />

              <h3 className="text-2xl font-bold mb-2">

                No Question Papers Found

              </h3>

              <p className="opacity-70">

                Upload your first question paper to
                start building your academic archive.

              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="table table-zebra">

                <thead>

                  <tr>

                    <th>Title</th>

                    <th>Program</th>

                    <th>Semester</th>

                    <th>Subject</th>

                    <th>Year</th>

                    <th>Type</th>

                    <th>PDF</th>

                    <th>Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {filteredPapers.map(
                    (paper) => (

                      <tr
                        key={paper._id}
                      >

                        {/* TITLE */}

                        <td>

                          <div className="font-bold">

                            {paper.title}

                          </div>

                        </td>

                        {/* PROGRAM */}

                        <td>

                          <span className="badge badge-primary">

                            {paper.program}

                          </span>

                        </td>

                        {/* SEMESTER */}

                        <td>

                          {paper.semester}

                        </td>

                        {/* SUBJECT */}

                        <td>

                          {paper.subject}

                        </td>

                        {/* YEAR */}

                        <td>

                          {paper.year}

                        </td>

                        {/* TYPE */}

                        <td>

                          <span
                            className={`badge ${
                              paper.paperType ===
                              "New"
                                ? "badge-success"
                                : "badge-warning"
                            }`}
                          >
                            {paper.paperType}
                          </span>

                        </td>

                        {/* PDF */}

                        <td>

                          {paper.pdfFile ? (

                            <a
                              href={
                                paper.pdfFile
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-xs btn-outline btn-primary"
                            >
                              <FaFilePdf />

                              PDF
                            </a>

                          ) : (

                            <span className="badge badge-error">

                              No PDF

                            </span>

                          )}

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="flex flex-wrap gap-2">
                                                      {/* VIEW */}

                          {paper.pdfFile ? (

                            <a
                              href={paper.pdfFile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-info"
                            >
                              <FaEye />
                            </a>

                          ) : (

                            <button
                              className="btn btn-sm"
                              disabled
                            >
                              <FaEye />
                            </button>

                          )}

                          {/* DOWNLOAD */}

                          {paper.pdfFile ? (

                            <a
                              href={paper.pdfFile}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className="btn btn-sm btn-success"
                            >
                              <FaDownload />
                            </a>

                          ) : (

                            <button
                              className="btn btn-sm"
                              disabled
                            >
                              <FaDownload />
                            </button>

                          )}

                          {/* EDIT */}

                          <button
                            type="button"
                            className="btn btn-sm btn-warning"
                            onClick={() =>
                              editPaper(paper)
                            }
                          >
                            <FaEdit />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            className="btn btn-sm btn-error"
                            onClick={() =>
                              deletePaper(
                                paper._id
                              )
                            }
                          >
                            <FaTrash />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                  }

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}