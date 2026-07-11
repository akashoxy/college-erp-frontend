import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSearch,
  FaGlobe,
  FaCheckCircle,
  FaLink,
  FaUniversity,
} from "react-icons/fa";

import api from "../../../../services/api";


import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";
import ConfirmModal from "../../../modals/ConfirmModal";

import {
  validateUpload,
} from "../../../../utils/validateUpload";

import { previewFile } from "../../../../utils/previewFile";
import {cleanupBlobUrl } from "../../../../utils/blobCleanup";

export default function ApprovalControl() {

  /* ===========================
      INITIAL FORM
  =========================== */

  const initialForm = {
    title: "",
    websiteLink: "",
    logo: "",
    publicId: "",
    file: null,
  };

  /* ===========================
      STATES
  =========================== */

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [approvals, setApprovals] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [editingApproval, setEditingApproval] =
    useState(null);

  const [formData, setFormData] =
    useState(initialForm);

  const [preview, setPreview] =
    useState("");

  /* ===========================
      STATUS MODAL
  =========================== */

  const [statusModal, setStatusModal] =
    useState({
      isOpen: false,
      type: "success",
      title: "",
      message: "",
    });

  /* ===========================
      DELETE MODAL
  =========================== */

  const [deleteModal, setDeleteModal] =
    useState({
      isOpen: false,
      approval: null,
    });

  /* ===========================
      DELETE ALL MODAL
  =========================== */

  const [
    deleteAllModal,
    setDeleteAllModal,
  ] = useState(false);

  
    const fetchApprovals = async () => {
    try {
      setLoading(true);

      const { data } =
        await api.get("/approvals");

      setApprovals(
        data.data?.approvals || []
      );
    } catch (error) {
      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message:
          error.response?.data?.message ||
          "Failed to load approvals.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  useEffect(() => {
    return () =>
      cleanupBlobUrl(preview);
  }, [preview]);

  /* ===========================
      INPUT CHANGE
  =========================== */

  const handleChange = ({
    target,
  }) => {
    const {
      name,
      value,
    } = target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ===========================
      LOGO UPLOAD
  =========================== */

  const handleImageChange =
    async (e) => {
      const file =
        e.target.files?.[0];

      if (!file) return;

      const validation =
        validateUpload(file, {
          allowImages: true,
          maxSizeMB: 5,
        });

      if (!validation.valid) {
        return setStatusModal({
          isOpen: true,
          type: "error",
          title: "Upload Failed",
          message:
            validation.message,
        });
      }

      cleanupBlobUrl(preview);

      const previewData =
        previewFile(file);

      setPreview(
        previewData.preview
      );

      setFormData((prev) => ({
        ...prev,
        file,
      }));
    };

  /* ===========================
      RESET FORM
  =========================== */

  const resetForm = () => {
    cleanupBlobUrl(preview);

    setPreview("");

    setEditingApproval(null);

    setFormData(initialForm);
  };

 
    /* ===========================
      CREATE / UPDATE
  =========================== */

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    try {
      setSaving(true);

      const payload =
        new FormData();

      payload.append(
        "title",
        formData.title
      );

      payload.append(
        "websiteLink",
        formData.websiteLink
      );

      if (formData.file) {
        payload.append(
          "logo",
          formData.file
        );
      }

      if (editingApproval) {
        await api.put(
          `/approvals/${editingApproval._id}`,
          payload
        );
      } else {
        await api.post(
          "/approvals",
          payload
        );
      }

      await fetchApprovals();

      resetForm();

      setStatusModal({
        isOpen: true,
        type: "success",
        title: "Success",
        message: editingApproval
          ? "Approval updated successfully."
          : "Approval created successfully.",
      });

    } catch (error) {

      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message:
          error.response?.data
            ?.message ||
          "Failed to save approval.",
      });

    } finally {

      setSaving(false);

    }
  };

  /* ===========================
      EDIT APPROVAL
  =========================== */

  const handleEdit = (
    approval
  ) => {

    cleanupBlobUrl(preview);

    setEditingApproval(
      approval
    );

    setPreview(
      approval.logo || ""
    );

    setFormData({
      title:
        approval.title || "",
      websiteLink:
        approval.websiteLink ||
        "",
      logo:
        approval.logo || "",
      publicId:
        approval.publicId ||
        "",
      file: null,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };

  /* ===========================
      DELETE APPROVAL
  =========================== */

  const handleDelete =
    async () => {

      try {

        await api.delete(
          `/approvals/${deleteModal.approval._id}`
        );

        await fetchApprovals();

        setDeleteModal({
          isOpen: false,
          approval: null,
        });

        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Deleted",
          message:
            "Approval deleted successfully.",
        });

      } catch (error) {

        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Error",
          message:
            error.response?.data
              ?.message ||
            "Failed to delete approval.",
        });

      }

    };

  /* ===========================
      DELETE ALL
  =========================== */

  const handleDeleteAll =
    async () => {

      try {

        await api.delete(
          "/approvals"
        );

        await fetchApprovals();

        resetForm();

        setDeleteAllModal(
          false
        );

        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Deleted",
          message:
            "All approvals deleted successfully.",
        });

      } catch (error) {

        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Error",
          message:
            error.response?.data
              ?.message ||
            "Failed to delete approvals.",
        });

      }

    };

  /* ===========================
      FILTERS
  =========================== */

  const filteredApprovals =
    useMemo(() => {

      const search =
        searchTerm.toLowerCase();

      return approvals.filter(
        (approval) =>
          approval.title
            ?.toLowerCase()
            .includes(search)
      );

    }, [
      approvals,
      searchTerm,
    ]);

  /* ===========================
      DASHBOARD STATS
  =========================== */

  const totalApprovals =
    approvals.length;

  const websiteCount =
    approvals.filter(
      (approval) =>
        approval.websiteLink
    ).length;

    return (
    <>
      {/* ===========================
          MODALS
      =========================== */}

      <LoadingModal
        isOpen={loading || saving}
        title={
          saving
            ? "Saving Approval"
            : "Loading Approvals"
        }
        message={
          saving
            ? "Please wait while your changes are being saved..."
            : "Fetching approvals..."
        }
      />

      <StatusModal
        isOpen={statusModal.isOpen}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() =>
          setStatusModal((prev) => ({
            ...prev,
            isOpen: false,
          }))
        }
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        itemName={
          deleteModal.approval?.title
        }
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteModal({
            isOpen: false,
            approval: null,
          })
        }
      />

      <ConfirmModal
        isOpen={deleteAllModal}
        title="Delete All Approvals"
        message="This action will permanently delete every approval."
        confirmText="Delete All"
        confirmColor="btn-error"
        onConfirm={handleDeleteAll}
        onCancel={() =>
          setDeleteAllModal(false)
        }
      />

      {/* ===========================
          PAGE
      =========================== */}

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
        className="space-y-8"
      >

        {/* ===========================
            HERO
        =========================== */}

        <div className="hero rounded-3xl bg-linear-to-r from-primary to-secondary text-primary-content shadow-2xl">

          <div className="hero-content w-full flex-col lg:flex-row justify-between py-10">

            <div>

              <h1 className="text-5xl font-black flex items-center gap-4">

                <FaUniversity />

                Approval Management

              </h1>

              <p className="mt-4 max-w-3xl text-lg opacity-90">

                Manage AICTE, NBA, UGC,
                MAKAUT and every institutional
                approval from one dashboard.

              </p>

            </div>

            <button
              className="btn btn-error btn-lg"
              disabled={!approvals.length}
              onClick={() =>
                setDeleteAllModal(true)
              }
            >

              <FaTrash />

              Delete All

            </button>

          </div>

        </div>

        {/* ===========================
            DASHBOARD
        =========================== */}

        <div className="grid gap-6 md:grid-cols-3">

          <motion.div
            whileHover={{
              y: -4,
            }}
            className="card bg-base-100 border border-base-300 shadow-xl"
          >

            <div className="card-body">

              <p className="text-base-content/60">

                Total Approvals

              </p>

              <h2 className="text-4xl font-black text-primary">

                {totalApprovals}

              </h2>

            </div>

          </motion.div>

          <motion.div
            whileHover={{
              y: -4,
            }}
            className="card bg-base-100 border border-base-300 shadow-xl"
          >

            <div className="card-body">

              <p className="text-base-content/60">

                Website Links

              </p>

              <h2 className="text-4xl font-black text-info">

                {websiteCount}

              </h2>

            </div>

          </motion.div>

          <motion.div
            whileHover={{
              y: -4,
            }}
            className="card bg-base-100 border border-base-300 shadow-xl"
          >

            <div className="card-body">

              <p className="text-base-content/60">

                Search

              </p>

              <label className="input input-bordered flex items-center gap-3 mt-3">

                <FaSearch className="text-primary" />

                <input
                  type="text"
                  className="grow"
                  placeholder="Search approvals..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(
                      e.target.value
                    )
                  }
                />

              </label>

            </div>

          </motion.div>

        </div>

      
                {/* ===========================
            APPROVAL FORM
        =========================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-base-100 border border-base-300 shadow-xl"
        >

          <div className="card-body">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="card-title text-2xl">

                  {editingApproval
                    ? "Edit Approval"
                    : "Add New Approval"}

                </h2>

                <p className="text-base-content/60">

                  {editingApproval
                    ? "Update the selected approval."
                    : "Create a new approval record."}

                </p>

              </div>

              {editingApproval && (

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>

              )}

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* TITLE */}

              <div>

                <label className="label">

                  <span className="label-text font-semibold">
                    Approval Title
                  </span>

                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="AICTE"
                  className="input input-bordered w-full"
                  required
                />

              </div>

              {/* WEBSITE */}

              <div>

                <label className="label">

                  <span className="label-text font-semibold">
                    Official Website
                  </span>

                </label>

                <input
                  type="url"
                  name="websiteLink"
                  value={formData.websiteLink}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="input input-bordered w-full"
                />

              </div>

              {/* LOGO */}

              <div>

                <label className="label">

                  <span className="label-text font-semibold">
                    Approval Logo
                  </span>

                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input file-input-bordered w-full"
                />

              </div>

              {/* LOGO PREVIEW */}

              {(preview || formData.logo) && (

                <AnimatePresence>

                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.95,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                    }}
                    className="relative rounded-2xl overflow-hidden border border-base-300"
                  >

                    <img
                      src={
                        preview ||
                        formData.logo
                      }
                      alt="Approval Preview"
                      className="w-full md:w-72 h-52 object-contain bg-base-200"
                    />

                    <button
                      type="button"
                      className="btn btn-error btn-circle btn-sm absolute top-3 right-3"
                      onClick={() => {

                        cleanupBlobUrl(
                          preview
                        );

                        setPreview("");

                        setFormData(
                          (prev) => ({
                            ...prev,
                            logo: "",
                            publicId: "",
                            file: null,
                          })
                        );

                      }}
                    >

                      <FaTrash />

                    </button>

                  </motion.div>

                </AnimatePresence>

              )}

              {/* VALIDATION */}

              <div className="rounded-xl border border-base-300 bg-base-200 p-5">

                <h3 className="font-semibold mb-4">

                  Form Status

                </h3>

                <div className="space-y-2 text-sm">

                  <div
                    className={
                      formData.title
                        ? "text-success"
                        : "text-error"
                    }
                  >

                    {formData.title
                      ? "✓ Approval title added"
                      : "✗ Approval title is required"}

                  </div>

                  <div
                    className={
                      formData.websiteLink
                        ? "text-success"
                        : "text-warning"
                    }
                  >

                    {formData.websiteLink
                      ? "✓ Website link added"
                      : "Website link is optional"}

                  </div>

                  <div
                    className={
                      formData.file ||
                      formData.logo
                        ? "text-success"
                        : "text-warning"
                    }
                  >

                    {formData.file ||
                    formData.logo
                      ? "✓ Logo ready"
                      : "Logo is optional"}

                  </div>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="flex flex-wrap gap-3">

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >

                  {editingApproval ? (
                    <>
                      <FaEdit />
                      Update Approval
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Add Approval
                    </>
                  )}

                </button>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={resetForm}
                >

                  Reset

                </button>

                <button
                  type="button"
                  className="btn btn-error"
                  disabled={
                    !approvals.length
                  }
                  onClick={() =>
                    setDeleteAllModal(
                      true
                    )
                  }
                >

                  <FaTrash />

                  Delete All

                </button>

              </div>

            </form>

          </div>

        </motion.div>

      
                {/* ===========================
            LIVE PREVIEW
        =========================== */}

        <div className="grid gap-8 lg:grid-cols-2">

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <h2 className="card-title">
                Live Preview
              </h2>

              <div className="flex flex-col items-center justify-center rounded-2xl border border-base-300 bg-base-200 p-8 text-center">

                <div className="w-36 h-36 rounded-full overflow-hidden bg-base-100 border border-base-300 flex items-center justify-center">

                  {preview || formData.logo ? (

                    <img
                      src={
                        preview ||
                        formData.logo
                      }
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />

                  ) : (

                    <FaUniversity className="text-6xl text-primary" />

                  )}

                </div>

                <h3 className="mt-6 text-2xl font-bold">

                  {formData.title ||
                    "Approval Title"}

                </h3>

                {formData.websiteLink && (

                  <a
                    href={
                      formData.websiteLink
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary mt-5"
                  >

                    <FaGlobe />

                    Visit Website

                  </a>

                )}

              </div>

            </div>

          </div>

          {/* ===========================
              EXISTING APPROVALS
          =========================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <h2 className="card-title">
                Existing Approvals
              </h2>

              {filteredApprovals.length ===
              0 ? (

                <div className="py-16 text-center">

                  <FaUniversity className="mx-auto text-6xl text-base-content/20" />

                  <h3 className="mt-5 text-xl font-bold">

                    No Approvals

                  </h3>

                </div>

              ) : (

                <div className="grid grid-cols-2 gap-4">

                  {filteredApprovals
                    .slice(0, 6)
                    .map(
                      (
                        approval
                      ) => (

                        <div
                          key={
                            approval._id
                          }
                          className="rounded-xl border border-base-300 bg-base-200 p-4 text-center"
                        >

                          <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-base-300 bg-base-100">

                            {approval.logo ? (

                              <img
                                src={
                                  approval.logo
                                }
                                alt={
                                  approval.title
                                }
                                className="h-full w-full object-contain"
                              />

                            ) : (

                              <FaUniversity className="text-3xl text-primary" />

                            )}

                          </div>

                          <h3 className="mt-4 line-clamp-2 font-bold">

                            {
                              approval.title
                            }

                          </h3>

                          {approval.websiteLink && (

                            <a
                              href={
                                approval.websiteLink
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-primary btn-sm mt-4"
                            >

                              <FaGlobe />

                              Website

                            </a>

                          )}

                        </div>

                      )
                    )}

                </div>

              )}

            </div>

          </div>

        </div>

        {/* ===========================
            APPROVAL TABLE
        =========================== */}

        <div className="card bg-base-100 border border-base-300 shadow-xl">

          <div className="card-body">

            <h2 className="card-title mb-4">

              Approval Records

            </h2>

            <div className="overflow-x-auto">

              <table className="table">

                <thead>

                  <tr>

                    <th>Logo</th>

                    <th>Title</th>

                    <th>Website</th>

                    <th>Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {filteredApprovals.length ===
                  0 ? (

                    <tr>

                      <td
                        colSpan={4}
                        className="py-12 text-center"
                      >

                        No approval records found.

                      </td>

                    </tr>

                  ) : (

                    filteredApprovals.map(
                      (
                        approval
                      ) => (

                        <tr
                          key={
                            approval._id
                          }
                        >

                          <td>

                            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-base-300 bg-base-200">

                              {approval.logo ? (

                                <img
                                  src={
                                    approval.logo
                                  }
                                  alt={
                                    approval.title
                                  }
                                  className="h-full w-full object-contain"
                                />

                              ) : (

                                <FaUniversity className="text-primary" />

                              )}

                            </div>

                          </td>

                          <td>

                            <span className="font-semibold">

                              {
                                approval.title
                              }

                            </span>

                          </td>

                          <td>

                            {approval.websiteLink ? (

                              <a
                                href={
                                  approval.websiteLink
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-primary btn-sm"
                              >

                                <FaGlobe />

                                Visit

                              </a>

                            ) : (

                              <span className="badge badge-outline">

                                No Website

                              </span>

                            )}

                          </td>

                          <td>

                            <div className="flex gap-2">

                              <button
                                className="btn btn-warning btn-sm"
                                onClick={() =>
                                  handleEdit(
                                    approval
                                  )
                                }
                              >

                                <FaEdit />

                              </button>

                              <button
                                className="btn btn-error btn-sm"
                                onClick={() =>
                                  setDeleteModal(
                                    {
                                      isOpen: true,
                                      approval,
                                    }
                                  )
                                }
                              >

                                <FaTrash />

                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

        {/* ===========================
            STICKY ACTION BAR
        =========================== */}

        <div className="sticky bottom-5 z-40">

          <div className="card bg-base-100 border border-base-300 shadow-2xl">

            <div className="card-body">

              <div className="flex flex-wrap justify-end gap-3">

                <button
                  className="btn btn-outline"
                  onClick={resetForm}
                >

                  Reset Form

                </button>

                <button
                  className="btn btn-error"
                  disabled={
                    !approvals.length
                  }
                  onClick={() =>
                    setDeleteAllModal(
                      true
                    )
                  }
                >

                  <FaTrash />

                  Delete All

                </button>

                <button
                  className="btn btn-primary"
                  onClick={() =>
                    document
                      .querySelector(
                        "form"
                      )
                      ?.requestSubmit()
                  }
                >

                  {editingApproval ? (
                    <>
                      <FaEdit />
                      Update Approval
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Add Approval
                    </>
                  )}

                </button>

              </div>

            </div>

          </div>

        </div>

      </motion.div>

    </>

  );

}