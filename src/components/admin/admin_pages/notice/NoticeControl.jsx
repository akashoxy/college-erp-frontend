import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  FaBell,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaUsers,
  FaGraduationCap,
  FaFilePdf,
  FaStar,
  FaEye,
  FaTimes,
} from "react-icons/fa";

import api from "../../../../services/api";


import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";
import ConfirmModal from "../../../modals/ConfirmModal"

import {
  validateUpload,
} from "../../../../utils/validateUpload";

import {
  previewFile,
} from "../../../../utils/previewFile";

import {
  cleanupBlobUrl,
} from "../../../../utils/blobCleanup";

import {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  TITLES,
} from "../../../../utils/uploadMessages";

export default function NoticeControl() {

  /* ==========================================================
      DATA
  ========================================================== */

  const [loading, setLoading] =
    useState(true);

  const [notices, setNotices] =
    useState([]);

  const [editingId, setEditingId] =
    useState(null);

  /* ==========================================================
      SEARCH
  ========================================================== */

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    filterAudience,
    setFilterAudience,
  ] = useState("all");

  /* ==========================================================
      PDF
  ========================================================== */

  const [pdfFile, setPdfFile] =
    useState(null);

  const [existingPdf, setExistingPdf] =
    useState("");

  const [
    removeExistingPdf,
    setRemoveExistingPdf,
  ] = useState(false);

  const [fileInputKey, setFileInputKey] =
    useState(Date.now());

  const [preview, setPreview] =
    useState("");

  /* ==========================================================
      FORM
  ========================================================== */

  const [formData, setFormData] =
    useState({

      title: "",

      description: "",

      category: "General",

      audience: "student",

      noticeDate: "",

      expiryDate: "",

      featured: false,

    });

  /* ==========================================================
      STATUS MODAL
  ========================================================== */

  const [
    statusModal,
    setStatusModal,
  ] = useState({

    isOpen: false,

    type: "info",

    title: "",

    message: "",

  });

  /* ==========================================================
      DELETE MODAL
  ========================================================== */

  const [
    deleteModal,
    setDeleteModal,
  ] = useState({

    isOpen: false,

    id: null,

    itemName: "",

  });

  /* ==========================================================
      RESET MODAL
  ========================================================== */

  const [
    resetModal,
    setResetModal,
  ] = useState(false);

  /* ==========================================================
      FETCH NOTICES
  ========================================================== */

  const fetchNotices = async () => {

    try {

      setLoading(true);

      const { data } =
        await api.get("/notices");

      setNotices(
        data.data?.notices || []
      );

    } catch (error) {

      setStatusModal({

        isOpen: true,

        type: "error",

        title: TITLES.ERROR,

        message:
          error.response?.data?.message ||
          ERROR_MESSAGES.LOAD,

      });

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchNotices();

  }, []);

  /* ==========================================================
      CLEANUP PREVIEW
  ========================================================== */

  useEffect(() => {

    return () => {

      cleanupBlobUrl(preview);

    };

  }, [preview]);
    /* ==========================================================
      INPUT HANDLER
  ========================================================== */

  const handleChange = (e) => {
    const {
      name,
      value,
      checked,
      type,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* ==========================================================
      PDF HANDLER
  ========================================================== */

  const handlePdfChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const validation =
      validateUpload(file, {
        allowPdf: true,
      });

    if (!validation.valid) {
      setStatusModal({
        isOpen: true,
        type: "error",
        title: TITLES.ERROR,
        message:
          validation.message,
      });

      e.target.value = "";

      return;
    }

    cleanupBlobUrl(preview);

    const previewData =
      previewFile(file);

    setPdfFile(file);

    setPreview(
      previewData.preview
    );
  };

  /* ==========================================================
      RESET FORM
  ========================================================== */

  const resetForm = () => {
    cleanupBlobUrl(preview);

    setEditingId(null);

    setPdfFile(null);

    setPreview("");

    setExistingPdf("");

    setRemoveExistingPdf(false);

    setFileInputKey(
      Date.now()
    );

    setFormData({
      title: "",
      description: "",
      category: "General",
      audience: "student",
      noticeDate: "",
      expiryDate: "",
      featured: false,
    });
  };

  /* ==========================================================
      CREATE NOTICE
  ========================================================== */

  const createNotice =
    async () => {
      try {
        const form =
          new FormData();

        Object.entries(
          formData
        ).forEach(
          ([key, value]) =>
            form.append(
              key,
              value
            )
        );

        if (pdfFile) {
          form.append(
            "pdfFile",
            pdfFile
          );
        }

        await api.post(
          "/notices",
          form
        );

        setStatusModal({
          isOpen: true,
          type: "success",
          title:
            TITLES.SUCCESS,
          message:
            SUCCESS_MESSAGES.CREATE,
        });

        fetchNotices();

        resetForm();
      } catch (error) {
        setStatusModal({
          isOpen: true,
          type: "error",
          title:
            TITLES.ERROR,
          message:
            error.response
              ?.data
              ?.message ||
            ERROR_MESSAGES.SAVE,
        });
      }
    };

  /* ==========================================================
      UPDATE NOTICE
  ========================================================== */

  const updateNotice =
    async () => {
      try {
        const form =
          new FormData();

        Object.entries(
          formData
        ).forEach(
          ([key, value]) =>
            form.append(
              key,
              value
            )
        );

        form.append(
          "removeExistingPdf",
          removeExistingPdf
        );

        if (pdfFile) {
          form.append(
            "pdfFile",
            pdfFile
          );
        }

        await api.put(
          `/notices/${editingId}`,
          form
        );

        setStatusModal({
          isOpen: true,
          type: "success",
          title:
            TITLES.SUCCESS,
          message:
            SUCCESS_MESSAGES.UPDATE,
        });

        fetchNotices();

        resetForm();
      } catch (error) {
        setStatusModal({
          isOpen: true,
          type: "error",
          title:
            TITLES.ERROR,
          message:
            error.response
              ?.data
              ?.message ||
            ERROR_MESSAGES.SAVE,
        });
      }
    };

  /* ==========================================================
      DELETE NOTICE
  ========================================================== */

  const confirmDelete =
    async () => {
      try {
        await api.delete(
          `/notices/${deleteModal.id}`
        );

        setDeleteModal({
          isOpen: false,
          id: null,
          itemName: "",
        });

        setStatusModal({
          isOpen: true,
          type: "success",
          title:
            TITLES.SUCCESS,
          message:
            SUCCESS_MESSAGES.DELETE,
        });

        fetchNotices();
      } catch (error) {
        setDeleteModal({
          isOpen: false,
          id: null,
          itemName: "",
        });

        setStatusModal({
          isOpen: true,
          type: "error",
          title:
            TITLES.ERROR,
          message:
            error.response
              ?.data
              ?.message ||
            ERROR_MESSAGES.DELETE,
        });
      }
    };

  /* ==========================================================
      EDIT NOTICE
  ========================================================== */

  const editNotice = (
    notice
  ) => {
    cleanupBlobUrl(preview);

    setEditingId(
      notice._id
    );

    setPdfFile(null);

    setPreview("");

    setExistingPdf(
      notice.pdfFile || ""
    );

    setRemoveExistingPdf(
      false
    );

    setFileInputKey(
      Date.now()
    );

    setFormData({
      title:
        notice.title || "",
      description:
        notice.description ||
        "",
      category:
        notice.category ||
        "General",
      audience:
        notice.audience ||
        "student",
      noticeDate:
        notice.noticeDate
          ? notice.noticeDate.split(
              "T"
            )[0]
          : "",
      expiryDate:
        notice.expiryDate
          ? notice.expiryDate.split(
              "T"
            )[0]
          : "",
      featured:
        notice.featured ||
        false,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ==========================================================
      SUBMIT
  ========================================================== */

  const handleSubmit = (
    e
  ) => {
    e.preventDefault();

    if (
      !formData.title.trim()
    ) {
      return setStatusModal({
        isOpen: true,
        type: "warning",
        title:
          TITLES.WARNING,
        message:
          "Notice title is required.",
      });
    }

    if (
      !formData.noticeDate
    ) {
      return setStatusModal({
        isOpen: true,
        type: "warning",
        title:
          TITLES.WARNING,
        message:
          "Please select a notice date.",
      });
    }

    if (
      !formData.expiryDate
    ) {
      return setStatusModal({
        isOpen: true,
        type: "warning",
        title:
          TITLES.WARNING,
        message:
          "Please select an expiry date.",
      });
    }

    if (editingId) {
      updateNotice();
    } else {
      createNotice();
    }
  };

  /* ==========================================================
      FILTERED NOTICES
  ========================================================== */

  const filteredNotices =
    useMemo(() => {
      return notices.filter(
        (notice) => {
          const keyword =
            searchTerm.toLowerCase();

          const matchSearch =
            notice.title
              ?.toLowerCase()
              .includes(
                keyword
              ) ||
            notice.category
              ?.toLowerCase()
              .includes(
                keyword
              );

          const matchAudience =
            filterAudience ===
            "all"
              ? true
              : notice.audience ===
                filterAudience;

          return (
            matchSearch &&
            matchAudience
          );
        }
      );
    }, [
      notices,
      searchTerm,
      filterAudience,
    ]);

  /* ==========================================================
      DASHBOARD STATS
  ========================================================== */

  const totalNotices =
    notices.length;

  const studentNotices =
    notices.filter(
      (n) =>
        n.audience ===
        "student"
    ).length;

  const facultyNotices =
    notices.filter(
      (n) =>
        n.audience ===
        "faculty"
    ).length;

  const featuredNotices =
    notices.filter(
      (n) => n.featured
    ).length;

  /* ==========================================================
      STATUS
  ========================================================== */

  const getStatus = (
    expiryDate
  ) => {
    return new Date(
      expiryDate
    ) >= new Date()
      ? "Active"
      : "Expired";
  };

  /* ==========================================================
      CATEGORY LIST
  ========================================================== */

  const categories = [
    "Examination",
    "Admission",
    "Academic",
    "Holiday",
    "Scholarship",
    "Placement",
    "Seminar",
    "Workshop",
    "Faculty Recruitment",
    "Tender",
    "Research",
    "General",
  ];

  /* ==========================================================
      JSX
  ========================================================== */

  return (
    <>
      <LoadingModal
        isOpen={loading}
        title="Loading Notices"
        message="Fetching notices..."
      />

      <StatusModal
        isOpen={
          statusModal.isOpen
        }
        type={
          statusModal.type
        }
        title={
          statusModal.title
        }
        message={
          statusModal.message
        }
        onClose={() =>
          setStatusModal(
            (prev) => ({
              ...prev,
              isOpen: false,
            })
          )
        }
      />

      <DeleteModal
        isOpen={
          deleteModal.isOpen
        }
        itemName={
          deleteModal.itemName
        }
        onConfirm={
          confirmDelete
        }
        onCancel={() =>
          setDeleteModal({
            isOpen: false,
            id: null,
            itemName: "",
          })
        }
      />

      <ConfirmModal
        isOpen={resetModal}
        title="Reset Form"
        message="Discard all unsaved changes?"
        confirmText="Reset"
        confirmColor="btn-warning"
        onConfirm={() => {
          resetForm();
          setResetModal(false);
        }}
        onCancel={() =>
          setResetModal(false)
        }
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="min-h-screen bg-base-200 p-6"
      >

        <div className="max-w-7xl mx-auto">

          {/* ==========================================================
              HERO HEADER
              (Continue in Part 2)
          ========================================================== */}
                    {/* ==========================================================
              HERO HEADER
          ========================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
            }}
            className="mb-8"
          >

            <div className="hero rounded-3xl bg-linear-to-r from-primary to-secondary text-primary-content shadow-2xl">

              <div className="hero-content w-full flex-col lg:flex-row justify-between py-10">

                <div>

                  <h1 className="text-4xl lg:text-5xl font-black flex items-center gap-4">

                    <FaBell />

                    Notice Management

                  </h1>

                  <p className="mt-4 text-lg opacity-90 max-w-3xl">

                    Manage student notices,
                    faculty circulars,
                    placement updates,
                    tenders, recruitment,
                    scholarships,
                    examinations and all
                    institutional announcements
                    from a centralized ERP dashboard.

                  </p>

                </div>

                <div className="stats shadow bg-base-100 text-base-content">

                  <div className="stat">

                    <div className="stat-title">

                      Total Notices

                    </div>

                    <div className="stat-value text-primary">

                      {totalNotices}

                    </div>

                    <div className="stat-desc">

                      Available in the system

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </motion.div>

          {/* ==========================================================
              DASHBOARD STATISTICS
          ========================================================== */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

            {/* STUDENT */}

            <motion.div
              whileHover={{
                y: -5,
              }}
              transition={{
                duration: 0.2,
              }}
              className="card bg-base-100 border border-base-300 shadow-xl"
            >

              <div className="card-body">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-base-content/70">

                      Student Notices

                    </p>

                    <h2 className="text-4xl font-black text-success">

                      {studentNotices}

                    </h2>

                  </div>

                  <FaGraduationCap
                    className="text-5xl text-success opacity-80"
                  />

                </div>

              </div>

            </motion.div>

            {/* FACULTY */}

            <motion.div
              whileHover={{
                y: -5,
              }}
              transition={{
                duration: 0.2,
              }}
              className="card bg-base-100 border border-base-300 shadow-xl"
            >

              <div className="card-body">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-base-content/70">

                      Faculty Notices

                    </p>

                    <h2 className="text-4xl font-black text-info">

                      {facultyNotices}

                    </h2>

                  </div>

                  <FaUsers
                    className="text-5xl text-info opacity-80"
                  />

                </div>

              </div>

            </motion.div>

            {/* FEATURED */}

            <motion.div
              whileHover={{
                y: -5,
              }}
              transition={{
                duration: 0.2,
              }}
              className="card bg-base-100 border border-base-300 shadow-xl"
            >

              <div className="card-body">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-base-content/70">

                      Featured Notices

                    </p>

                    <h2 className="text-4xl font-black text-warning">

                      {featuredNotices}

                    </h2>

                  </div>

                  <FaStar
                    className="text-5xl text-warning opacity-80"
                  />

                </div>

              </div>

            </motion.div>

            {/* TOTAL */}

            <motion.div
              whileHover={{
                y: -5,
              }}
              transition={{
                duration: 0.2,
              }}
              className="card bg-base-100 border border-base-300 shadow-xl"
            >

              <div className="card-body">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-base-content/70">

                      Total Notices

                    </p>

                    <h2 className="text-4xl font-black text-primary">

                      {totalNotices}

                    </h2>

                  </div>

                  <FaBell
                    className="text-5xl text-primary opacity-80"
                  />

                </div>

              </div>

            </motion.div>

          </div>

          {/* ==========================================================
              CREATE / UPDATE FORM
              (Continue in Part 2A-2)
          ========================================================== */}
                    {/* ==========================================================
              FORM + LIVE PREVIEW
          ========================================================== */}

          <div className="grid xl:grid-cols-2 gap-8 mb-10">

            {/* ==========================================================
                NOTICE FORM
            ========================================================== */}

            <div className="card bg-base-100 shadow-2xl border border-base-300">

              <div className="card-body">

                <h2 className="card-title text-2xl mb-6">

                  {editingId ? (
                    <>
                      <FaEdit />
                      Update Notice
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Create Notice
                    </>
                  )}

                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >

                  {/* ======================================================
                      NOTICE TITLE
                  ====================================================== */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Notice Title

                      </span>

                    </label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter notice title..."
                      className="input input-bordered w-full"
                    />

                  </div>

                  {/* ======================================================
                      DESCRIPTION
                  ====================================================== */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Description

                      </span>

                    </label>

                    <textarea
                      rows={5}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter detailed notice description..."
                      className="textarea textarea-bordered w-full resize-none"
                    />

                  </div>

                  {/* ======================================================
                      CATEGORY
                  ====================================================== */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Category

                      </span>

                    </label>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                    >

                      {categories.map(
                        (category) => (

                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>

                        )
                      )}

                    </select>

                  </div>

                  {/* ======================================================
                      TARGET AUDIENCE
                  ====================================================== */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Target Audience

                      </span>

                    </label>

                    <select
                      name="audience"
                      value={formData.audience}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                    >

                      <option value="student">

                        Student

                      </option>

                      <option value="faculty">

                        Faculty / Tender

                      </option>

                    </select>

                  </div>

                  {/* ======================================================
                      NOTICE DATE & EXPIRY DATE
                  ====================================================== */}

                  <div className="grid md:grid-cols-2 gap-5">

                    <div>

                      <label className="label">

                        <span className="label-text font-semibold">

                          Notice Date

                        </span>

                      </label>

                      <input
                        type="date"
                        name="noticeDate"
                        value={formData.noticeDate}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                      />

                    </div>

                    <div>

                      <label className="label">

                        <span className="label-text font-semibold">

                          Expiry Date

                        </span>

                      </label>

                      <input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                      />

                    </div>

                  </div>

                  {/* ======================================================
                      PDF UPLOAD
                      (Continue in Part 2A-2b)
                  ====================================================== */}
                                    {/* ======================================================
                      PDF UPLOAD
                  ====================================================== */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Notice PDF (Optional)

                      </span>

                    </label>

                    <input
                      key={fileInputKey}
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfChange}
                      className="file-input file-input-bordered w-full"
                    />

                    {/* NEW PDF */}

                    {pdfFile && (

                      <div className="alert alert-success mt-4">

                        <FaFilePdf />

                        <div className="flex-1">

                          <h3 className="font-bold">

                            New PDF Selected

                          </h3>

                          <p className="text-sm">

                            {pdfFile.name}

                          </p>

                        </div>

                      </div>

                    )}

                    {/* EXISTING PDF */}

                    {!pdfFile &&
                      existingPdf && (

                      <div className="alert bg-base-200 border border-base-300 mt-4">

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">

                          <div>

                            <h3 className="font-bold">

                              Existing PDF

                            </h3>

                            <p className="text-sm opacity-70">

                              A PDF is currently attached to this notice.

                            </p>

                          </div>

                          <a
                            href={existingPdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm"
                          >

                            <FaEye />

                            View PDF

                          </a>

                        </div>

                      </div>

                    )}

                    {/* REMOVE EXISTING PDF */}

                    {!pdfFile &&
                      existingPdf && (

                      <label className="label cursor-pointer justify-start gap-3 mt-2">

                        <input
                          type="checkbox"
                          checked={removeExistingPdf}
                          onChange={(e) =>
                            setRemoveExistingPdf(
                              e.target.checked
                            )
                          }
                          className="checkbox checkbox-error"
                        />

                        <span className="label-text text-error font-semibold">

                          Remove Existing PDF

                        </span>

                      </label>

                    )}

                  </div>

                  {/* ======================================================
                      FEATURED NOTICE
                  ====================================================== */}

                  <div className="flex items-center gap-4">

                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="checkbox checkbox-warning"
                    />

                    <span className="font-semibold">

                      Mark as Featured Notice

                    </span>

                  </div>

                  {/* ======================================================
                      ACTION BUTTONS
                  ====================================================== */}

                  <div className="flex flex-wrap gap-3 pt-6">

                    <button
                      type="submit"
                      className={`btn ${
                        editingId
                          ? "btn-warning"
                          : "btn-primary"
                      }`}
                    >

                      {editingId ? (
                        <>
                          <FaEdit />
                          Update Notice
                        </>
                      ) : (
                        <>
                          <FaPlus />
                          Create Notice
                        </>
                      )}

                    </button>

                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() =>
                        setResetModal(true)
                      }
                    >

                      <FaTimes />

                      Reset

                    </button>

                  </div>

                </form>

              </div>

            </div>

            {/* ==========================================================
                LIVE PREVIEW
                (Continue in Part 2B)
            ========================================================== */}
                        {/* ==========================================================
                LIVE PREVIEW
            ========================================================== */}

            <div className="card bg-base-100 border border-base-300 shadow-2xl sticky top-6">

              <div className="card-body">

                <h2 className="card-title text-2xl">

                  <FaEye />

                  Live Preview

                </h2>

                <div className="divider"></div>

                <div className="rounded-3xl border border-base-300 bg-base-200 p-6">

                  {/* CATEGORY + FEATURED */}

                  <div className="flex flex-wrap justify-between items-center gap-3 mb-5">

                    <span className="badge badge-primary badge-lg">

                      {formData.category ||
                        "Category"}

                    </span>

                    {formData.featured && (

                      <span className="badge badge-warning badge-lg gap-2">

                        <FaStar />

                        Featured

                      </span>

                    )}

                  </div>

                  {/* TITLE */}

                  <h3 className="text-3xl font-bold mb-4 wrap-break-word">

                    {formData.title ||

                      "Notice Title Preview"}

                  </h3>

                  {/* DESCRIPTION */}

                  <p className="text-base-content/70 leading-relaxed whitespace-pre-wrap min-h-30">

                    {formData.description ||

                      "Notice description preview will appear here as you type."}

                  </p>

                  <div className="divider"></div>

                  {/* DETAILS */}

                  <div className="space-y-3">

                    <div className="flex justify-between">

                      <span className="font-semibold">

                        Audience

                      </span>

                      <span>

                        {formData.audience ===
                        "student"

                          ? "Student"

                          : "Faculty / Tender"}

                      </span>

                    </div>

                    <div className="flex justify-between">

                      <span className="font-semibold">

                        Notice Date

                      </span>

                      <span>

                        {formData.noticeDate ||

                          "--"}

                      </span>

                    </div>

                    <div className="flex justify-between">

                      <span className="font-semibold">

                        Expiry Date

                      </span>

                      <span>

                        {formData.expiryDate ||

                          "--"}

                      </span>

                    </div>

                    <div className="flex justify-between">

                      <span className="font-semibold">

                        Status

                      </span>

                      <span
                        className={`badge ${
                          formData.expiryDate &&
                          getStatus(
                            formData.expiryDate
                          ) === "Active"

                            ? "badge-success"

                            : "badge-error"
                        }`}
                      >

                        {formData.expiryDate

                          ? getStatus(
                              formData.expiryDate
                            )

                          : "Draft"}

                      </span>

                    </div>

                  </div>

                  <div className="divider"></div>

                  {/* PDF */}

                  <div>

                    <h4 className="font-semibold mb-3">

                      Attachment

                    </h4>

                    {pdfFile ? (

                      <div className="alert alert-success">

                        <FaFilePdf />

                        <div>

                          <h4 className="font-bold">

                            New PDF Ready

                          </h4>

                          <p className="text-sm">

                            {pdfFile.name}

                          </p>

                        </div>

                      </div>

                    ) : existingPdf &&
                      !removeExistingPdf ? (

                      <div className="alert bg-base-100 border border-base-300">

                        <FaFilePdf className="text-error" />

                        <div>

                          <h4 className="font-bold">

                            Existing PDF

                          </h4>

                          <p className="text-sm">

                            This notice already has an attached PDF.

                          </p>

                        </div>

                      </div>

                    ) : (

                      <div className="alert">

                        <span>

                          No PDF Attached

                        </span>

                      </div>

                    )}

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ==========================================================
              SEARCH & FILTER
              (Continue in Part 2B-1b)
          ========================================================== */}
                    {/* ==========================================================
              SEARCH & FILTER
          ========================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="card bg-base-100 border border-base-300 shadow-xl mb-8"
          >

            <div className="card-body">

              <div className="flex flex-col xl:flex-row gap-5 xl:items-end">

                {/* SEARCH */}

                <div className="flex-1">

                  <label className="label">

                    <span className="label-text font-semibold">

                      Search Notices

                    </span>

                  </label>

                  <label className="input input-bordered flex items-center gap-3">

                    <FaSearch className="text-primary" />

                    <input
                      type="text"
                      className="grow"
                      placeholder="Search by title or category..."
                      value={searchTerm}
                      onChange={(e) =>
                        setSearchTerm(
                          e.target.value
                        )
                      }
                    />

                  </label>

                </div>

                {/* AUDIENCE */}

                <div className="w-full xl:w-72">

                  <label className="label">

                    <span className="label-text font-semibold">

                      Audience Filter

                    </span>

                  </label>

                  <select
                    value={filterAudience}
                    onChange={(e) =>
                      setFilterAudience(
                        e.target.value
                      )
                    }
                    className="select select-bordered w-full"
                  >

                    <option value="all">

                      All Notices

                    </option>

                    <option value="student">

                      Student Notices

                    </option>

                    <option value="faculty">

                      Faculty / Tender

                    </option>

                  </select>

                </div>

                {/* CLEAR */}

                <div>

                  <button
                    type="button"
                    className="btn btn-outline w-full xl:w-auto"
                    onClick={() => {

                      setSearchTerm("");

                      setFilterAudience(
                        "all"
                      );

                    }}
                  >

                    <FaTimes />

                    Clear Filters

                  </button>

                </div>

              </div>

              <div className="divider my-6"></div>

              {/* FILTER SUMMARY */}

              <div className="flex flex-wrap items-center gap-3">

                <div className="badge badge-primary badge-lg">

                  {filteredNotices.length}

                  {" "}

                  Result
                  {filteredNotices.length !== 1
                    ? "s"
                    : ""}

                </div>

                {searchTerm && (

                  <div className="badge badge-outline">

                    Search:

                    {" "}

                    "{searchTerm}"

                  </div>

                )}

                {filterAudience !==
                  "all" && (

                  <div className="badge badge-secondary">

                    Audience:

                    {" "}

                    {filterAudience}

                  </div>

                )}

              </div>

            </div>

          </motion.div>

          {/* ==========================================================
              NOTICE MANAGEMENT
              (Continue in Part 2B-2)
          ========================================================== */}
                    {/* ==========================================================
              NOTICE MANAGEMENT
          ========================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="card bg-base-100 border border-base-300 shadow-2xl"
          >

            <div className="card-body">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                <div>

                  <h2 className="text-2xl font-bold">

                    Notice Management

                  </h2>

                  <p className="text-base-content/70 mt-1">

                    Create, edit, delete and monitor all published notices.

                  </p>

                </div>

                <div className="badge badge-primary badge-lg">

                  {filteredNotices.length}

                  {" "}

                  Record
                  {filteredNotices.length !== 1
                    ? "s"
                    : ""}

                </div>

              </div>

              {/* ======================================================
                  EMPTY STATE
              ====================================================== */}

              {filteredNotices.length === 0 ? (

                <div className="flex flex-col items-center justify-center py-20">

                  <FaBell className="text-7xl text-base-content/20 mb-5" />

                  <h3 className="text-2xl font-bold">

                    No Notices Found

                  </h3>

                  <p className="text-base-content/60 mt-2 text-center max-w-md">

                    No notices match your current search or filter.
                    Try changing the filters or create a new notice.

                  </p>

                  <button
                    type="button"
                    className="btn btn-primary mt-6"
                    onClick={() => {

                      setSearchTerm("");

                      setFilterAudience("all");

                    }}
                  >

                    Clear Filters

                  </button>

                </div>

              ) : (

                <>

                  {/* ==================================================
                      DESKTOP TABLE
                  ================================================== */}

                  <div className="hidden lg:block overflow-x-auto rounded-xl border border-base-300">

                    <table className="table table-zebra">

                      <thead>

                        <tr className="bg-base-200">

                          <th>

                            Title

                          </th>

                          <th>

                            Category

                          </th>

                          <th>

                            Audience

                          </th>

                          <th>

                            Status

                          </th>

                          <th>

                            Featured

                          </th>

                          <th>

                            PDF

                          </th>

                          <th className="text-center">

                            Actions

                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {filteredNotices.map(
                          (notice) => (

                            <tr
                              key={notice._id}
                            >

                              {/* TITLE */}

                              <td>

                                <div>

                                  <div className="font-bold">

                                    {notice.title}

                                  </div>

                                  <div className="text-xs opacity-60 mt-1">

                                    {new Date(
                                      notice.noticeDate
                                    ).toLocaleDateString()}

                                  </div>

                                </div>

                              </td>

                              {/* CATEGORY */}

                              <td>

                                <span className="badge badge-outline">

                                  {notice.category}

                                </span>

                              </td>

                              {/* AUDIENCE */}

                              <td>

                                <span
                                  className={`badge ${
                                    notice.audience ===
                                    "student"
                                      ? "badge-success"
                                      : "badge-info"
                                  }`}
                                >

                                  {notice.audience}

                                </span>

                              </td>

                              {/* STATUS */}

                              <td>

                                <span
                                  className={`badge ${
                                    getStatus(
                                      notice.expiryDate
                                    ) ===
                                    "Active"
                                      ? "badge-success"
                                      : "badge-error"
                                  }`}
                                >

                                  {getStatus(
                                    notice.expiryDate
                                  )}

                                </span>

                              </td>

                              {/* FEATURED */}

                              <td>

                                {notice.featured ? (

                                  <span className="badge badge-warning">

                                    <FaStar />

                                    Featured

                                  </span>

                                ) : (

                                  <span className="badge">

                                    Normal

                                  </span>

                                )}

                              </td>

                              {/* PDF */}

                              <td>

                                {notice.pdfFile ? (

                                  <a
                                    href={notice.pdfFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-error btn-xs"
                                  >

                                    <FaFilePdf />

                                  </a>

                                ) : (

                                  <span className="text-xs opacity-50">

                                    No PDF

                                  </span>

                                )}

                              </td>

                              {/* ACTIONS */}
                              {/* Continue in Part 2B-2b */}
                                                            {/* ACTIONS */}

                              <td>

                                <div className="flex justify-center gap-2">

                                  <button
                                    type="button"
                                    className="btn btn-warning btn-sm"
                                    onClick={() =>
                                      editNotice(
                                        notice
                                      )
                                    }
                                  >

                                    <FaEdit />

                                  </button>

                                  <button
                                    type="button"
                                    className="btn btn-error btn-sm"
                                    onClick={() =>
                                      setDeleteModal({
                                        isOpen: true,
                                        id: notice._id,
                                        itemName:
                                          notice.title,
                                      })
                                    }
                                  >

                                    <FaTrash />

                                  </button>

                                </div>

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                  {/* ==================================================
                      MOBILE CARDS
                  ================================================== */}

                  <div className="grid lg:hidden gap-5">

                    {filteredNotices.map(
                      (notice) => (

                        <motion.div
                          key={notice._id}
                          whileHover={{
                            y: -3,
                          }}
                          className="card bg-base-100 border border-base-300 shadow-xl"
                        >

                          <div className="card-body">

                            <div className="flex justify-between items-start gap-4">

                              <div className="flex-1">

                                <h3 className="font-bold text-lg">

                                  {notice.title}

                                </h3>

                                <p className="text-sm opacity-60 mt-1">

                                  {new Date(
                                    notice.noticeDate
                                  ).toLocaleDateString()}

                                </p>

                              </div>

                              {notice.featured && (

                                <span className="badge badge-warning">

                                  <FaStar />

                                </span>

                              )}

                            </div>

                            <div className="divider my-3"></div>

                            <div className="space-y-2">

                              <p>

                                <strong>

                                  Category:

                                </strong>{" "}

                                {notice.category}

                              </p>

                              <p>

                                <strong>

                                  Audience:

                                </strong>{" "}

                                {notice.audience}

                              </p>

                              <p>

                                <strong>

                                  Status:

                                </strong>{" "}

                                <span
                                  className={`badge ${
                                    getStatus(
                                      notice.expiryDate
                                    ) ===
                                    "Active"
                                      ? "badge-success"
                                      : "badge-error"
                                  }`}
                                >

                                  {getStatus(
                                    notice.expiryDate
                                  )}

                                </span>

                              </p>

                            </div>

                            <div className="divider my-3"></div>

                            <div className="flex flex-wrap gap-2">

                              {notice.pdfFile && (

                                <a
                                  href={notice.pdfFile}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-error btn-sm"
                                >

                                  <FaFilePdf />

                                  PDF

                                </a>

                              )}

                              <button
                                type="button"
                                className="btn btn-warning btn-sm"
                                onClick={() =>
                                  editNotice(
                                    notice
                                  )
                                }
                              >

                                <FaEdit />

                                Edit

                              </button>

                              <button
                                type="button"
                                className="btn btn-error btn-sm"
                                onClick={() =>
                                  setDeleteModal({
                                    isOpen: true,
                                    id: notice._id,
                                    itemName:
                                      notice.title,
                                  })
                                }
                              >

                                <FaTrash />

                                Delete

                              </button>

                            </div>

                          </div>

                        </motion.div>

                      )
                    )}

                  </div>

                </>

              )}

            </div>

          </motion.div>

        </div>

      </motion.div>

    </>

  );

}