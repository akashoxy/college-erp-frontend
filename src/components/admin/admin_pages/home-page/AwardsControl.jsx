import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaAward,
  FaPlus,
  FaEdit,
  FaTrash,
  FaImage,
  FaSearch,
  FaStar,
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


export default function AwardsControl() {

  /* ===========================
      STATES
  =========================== */

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [awards, setAwards] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [editingAward, setEditingAward] =
    useState(null);

  const initialForm = {
    title: "",
    recipient: "",
    awardee: "",
    awardDate: "",
    description: "",
    featured: false,
    image: "",
    publicId: "",
    file: null,
  };

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
      award: null,
    });

  /* ===========================
      DELETE ALL MODAL
  =========================== */

  const [
    deleteAllModal,
    setDeleteAllModal,
  ] = useState(false);

  /* ===========================
      FETCH AWARDS
  =========================== */

  const fetchAwards = async () => {
    try {
      setLoading(true);

      const { data } =
        await api.get("/awards");

      setAwards(
        data.data.awards || []
      );

    } catch (error) {

      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message:
          error.response?.data
            ?.message ||
          "Failed to fetch awards.",
      });

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  useEffect(() => {
    return () => {
      cleanupBlobUrl(preview);
    };
  }, [preview]);

 
    /* ===========================
      FORM HANDLERS
  =========================== */

  const handleChange = ({ target }) => {
    const { name, value, type, checked } = target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const validation = validateUpload(file, {
      allowImages: true,
      maxSizeMB: 5,
    });

    if (!validation.valid) {
      return setStatusModal({
        isOpen: true,
        type: "error",
        title: "Upload Failed",
        message: validation.message,
      });
    }

    cleanupBlobUrl(preview);

    const previewData = previewFile(file);

    setPreview(previewData.preview);

    setFormData((prev) => ({
      ...prev,
      file,
    }));
  };

  const resetForm = () => {
    cleanupBlobUrl(preview);

    setPreview("");

    setEditingAward(null);

    setFormData(initialForm);
  };

  /* ===========================
      SAVE AWARD
  =========================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = new FormData();

      payload.append("title", formData.title);
      payload.append(
        "recipient",
        formData.recipient
      );
      payload.append(
        "awardee",
        formData.awardee
      );
      payload.append(
        "awardDate",
        formData.awardDate
      );
      payload.append(
        "description",
        formData.description
      );
      payload.append(
        "featured",
        formData.featured
      );

      if (formData.file) {
        payload.append(
          "image",
          formData.file
        );
      }

      if (editingAward) {
        await api.put(
          `/awards/${editingAward._id}`,
          payload
        );
      } else {
        await api.post(
          "/awards",
          payload
        );
      }

      await fetchAwards();

      resetForm();

      setStatusModal({
        isOpen: true,
        type: "success",
        title: "Success",
        message: editingAward
          ? "Award updated successfully."
          : "Award created successfully.",
      });
    } catch (error) {
      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message:
          error.response?.data?.message ||
          "Failed to save award.",
      });
    } finally {
      setSaving(false);
    }
  };

  /* ===========================
      EDIT AWARD
  =========================== */

  const editAward = (award) => {
    cleanupBlobUrl(preview);

    setEditingAward(award);

    setPreview(award.image || "");

    setFormData({
      title: award.title || "",
      recipient:
        award.recipient || "",
      awardee:
        award.awardee || "",
      awardDate:
        award.awardDate?.split("T")[0] ||
        "",
      description:
        award.description || "",
      featured:
        award.featured || false,
      image: award.image || "",
      publicId:
        award.publicId || "",
      file: null,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ===========================
      DELETE
  =========================== */

  const handleDeleteAward =
    async () => {
      try {
        await api.delete(
          `/awards/${deleteModal.award._id}`
        );

        await fetchAwards();

        setDeleteModal({
          isOpen: false,
          award: null,
        });

        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Deleted",
          message:
            "Award deleted successfully.",
        });
      } catch (error) {
        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Error",
          message:
            error.response?.data
              ?.message ||
            "Failed to delete award.",
        });
      }
    };

  const handleDeleteAll =
    async () => {
      try {
        await api.delete("/awards");

        await fetchAwards();

        setDeleteAllModal(false);

        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Deleted",
          message:
            "All awards deleted successfully.",
        });
      } catch (error) {
        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Error",
          message:
            error.response?.data
              ?.message ||
            "Failed to delete awards.",
        });
      }
    };

  /* ===========================
      FILTERS & STATS
  =========================== */

  const filteredAwards = useMemo(() => {
    const search =
      searchTerm.toLowerCase();

    return awards.filter(
      (award) =>
        award.title
          ?.toLowerCase()
          .includes(search) ||
        award.recipient
          ?.toLowerCase()
          .includes(search) ||
        award.awardee
          ?.toLowerCase()
          .includes(search)
    );
  }, [awards, searchTerm]);

  const totalAwards =
    awards.length;

  const featuredAwards =
    awards.filter(
      (award) =>
        award.featured
    ).length;

  const totalImages =
    awards.filter(
      (award) =>
        award.image
    ).length;


    return (
    <>
      {/* ===========================
          MODALS
      =========================== */}

      <LoadingModal
        isOpen={loading || saving}
        title={saving ? "Saving Award" : "Loading Awards"}
        message={
          saving
            ? "Please wait while your changes are saved..."
            : "Fetching awards..."
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
        itemName={deleteModal.award?.title}
        onConfirm={handleDeleteAward}
        onCancel={() =>
          setDeleteModal({
            isOpen: false,
            award: null,
          })
        }
      />

      <ConfirmModal
        isOpen={deleteAllModal}
        title="Delete All Awards"
        message="This action will permanently delete all awards."
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
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >

        {/* ===========================
            HERO
        =========================== */}

        <div className="hero rounded-3xl bg-linear-to-r from-primary to-secondary text-primary-content shadow-2xl">

          <div className="hero-content w-full flex-col lg:flex-row justify-between py-10">

            <div>

              <h1 className="text-5xl font-black flex items-center gap-4">
                <FaAward />
                Awards Management
              </h1>

              <p className="mt-4 max-w-3xl text-lg opacity-90">
                Create, edit and manage all
                college awards and recognitions
                from one place.
              </p>

            </div>

            <button
              className="btn btn-error btn-lg"
              disabled={!awards.length}
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
            DASHBOARD STATS
        =========================== */}

        <div className="grid gap-6 md:grid-cols-3">

          <motion.div
            whileHover={{ y: -4 }}
            className="card bg-base-100 border border-base-300 shadow-xl"
          >

            <div className="card-body">

              <p className="text-base-content/60">
                Total Awards
              </p>

              <h2 className="text-4xl font-black text-primary">
                {totalAwards}
              </h2>

            </div>

          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="card bg-base-100 border border-base-300 shadow-xl"
          >

            <div className="card-body">

              <p className="text-base-content/60">
                Featured Awards
              </p>

              <h2 className="text-4xl font-black text-warning">
                {featuredAwards}
              </h2>

            </div>

          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="card bg-base-100 border border-base-300 shadow-xl"
          >

            <div className="card-body">

              <p className="text-base-content/60">
                Images Uploaded
              </p>

              <h2 className="text-4xl font-black text-success">
                {totalImages}
              </h2>

            </div>

          </motion.div>

        </div>

        {/* ===========================
            SEARCH
        =========================== */}

        <div className="card bg-base-100 border border-base-300 shadow-xl">

          <div className="card-body">

            <label className="input input-bordered flex items-center gap-3">

              <FaSearch className="text-primary" />

              <input
                type="text"
                className="grow"
                placeholder="Search by award, recipient or awardee..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

            </label>

          </div>

        </div>

        
                {/* ===========================
            AWARD FORM
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

                  {editingAward
                    ? "Edit Award"
                    : "Add New Award"}

                </h2>

                <p className="text-base-content/60">

                  {editingAward
                    ? "Update the selected award."
                    : "Create a new award entry."}

                </p>

              </div>

              {editingAward && (

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

              {/* Award Title */}

              <div>

                <label className="label">

                  <span className="label-text font-semibold">
                    Award Title
                  </span>

                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Best Engineering College"
                  className="input input-bordered w-full"
                  required
                />

              </div>

              {/* Recipient & Awardee */}

              <div className="grid md:grid-cols-2 gap-6">

                <div>

                  <label className="label">

                    <span className="label-text font-semibold">
                      Recipient
                    </span>

                  </label>

                  <input
                    type="text"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleChange}
                    placeholder="College Name"
                    className="input input-bordered w-full"
                    required
                  />

                </div>

                <div>

                  <label className="label">

                    <span className="label-text font-semibold">
                      Awardee
                    </span>

                  </label>

                  <input
                    type="text"
                    name="awardee"
                    value={formData.awardee}
                    onChange={handleChange}
                    placeholder="Organization"
                    className="input input-bordered w-full"
                    required
                  />

                </div>

              </div>

              {/* Award Date */}

              <div>

                <label className="label">

                  <span className="label-text font-semibold">
                    Award Date
                  </span>

                </label>

                <input
                  type="date"
                  name="awardDate"
                  value={formData.awardDate}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />

              </div>

              {/* Description */}

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
                  placeholder="Write a short description..."
                  className="textarea textarea-bordered w-full"
                />

              </div>

             
                            {/* Award Image */}

              <div>

                <label className="label">
                  <span className="label-text font-semibold">
                    Award Image
                  </span>
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input file-input-bordered w-full"
                />

              </div>

              {/* Image Preview */}

              {(preview || formData.image) && (

                <AnimatePresence>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative rounded-2xl overflow-hidden border border-base-300"
                  >

                    <img
                      src={preview || formData.image}
                      alt="Award Preview"
                      className="w-full md:w-80 h-56 object-cover"
                    />

                    <button
                      type="button"
                      className="btn btn-error btn-circle btn-sm absolute top-3 right-3"
                      onClick={() => {

                        cleanupBlobUrl(preview);

                        setPreview("");

                        setFormData((prev) => ({
                          ...prev,
                          image: "",
                          publicId: "",
                          file: null,
                        }));

                      }}
                    >

                      <FaTrash />

                    </button>

                  </motion.div>

                </AnimatePresence>

              )}

              {/* Featured */}

              <div className="rounded-xl border border-base-300 bg-base-200 p-5">

                <label className="flex items-center justify-between cursor-pointer">

                  <div>

                    <h3 className="font-semibold">
                      Featured Award
                    </h3>

                    <p className="text-sm text-base-content/60">
                      Display this award in featured sections.
                    </p>

                  </div>

                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="toggle toggle-warning toggle-lg"
                  />

                </label>

              </div>

              {/* Buttons */}

              <div className="flex flex-wrap gap-3 pt-2">

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >

                  {editingAward ? (
                    <>
                      <FaEdit />
                      Update Award
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Add Award
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

              </div>

            </form>

          </div>

        </motion.div>

       
                {/* ===========================
            AWARDS GALLERY
        =========================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h2 className="text-2xl font-bold">
                Awards Gallery
              </h2>

              <p className="text-base-content/60">
                Showing{" "}
                <span className="font-semibold">
                  {filteredAwards.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold">
                  {totalAwards}
                </span>{" "}
                award
                {totalAwards !== 1 ? "s" : ""}
              </p>

            </div>

            <div className="badge badge-primary badge-lg">

              {featuredAwards} Featured

            </div>

          </div>

          {/* ===========================
              EMPTY STATE
          =========================== */}

          {filteredAwards.length === 0 ? (

            <div className="card bg-base-100 border border-base-300 shadow-xl">

              <div className="card-body py-20 text-center">

                <FaAward
                  size={70}
                  className="mx-auto text-base-content/20"
                />

                <h3 className="text-2xl font-bold mt-5">

                  No Awards Found

                </h3>

                <p className="text-base-content/60 mt-2">

                  Create your first award or adjust
                  the search criteria.

                </p>

              </div>

            </div>

          ) : (

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

              <AnimatePresence>

                {filteredAwards.map(
                  (award, index) => (

                    <motion.div
                      key={award._id}
                      layout
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                      }}
                      transition={{
                        delay: index * 0.05,
                      }}
                      whileHover={{
                        y: -6,
                      }}
                      className="card bg-base-100 border border-base-300 shadow-xl overflow-hidden"
                    >

                      {/* IMAGE */}

                      <figure className="relative h-64 overflow-hidden">

                        {award.image ? (

                          <img
                            src={award.image}
                            alt={award.title}
                            className="w-full h-full object-cover transition duration-500 hover:scale-110"
                          />

                        ) : (

                          <div className="w-full h-full flex items-center justify-center bg-base-200">

                            <FaImage
                              size={60}
                              className="text-base-content/20"
                            />

                          </div>

                        )}

                        {award.featured && (

                          <span className="badge badge-warning absolute top-4 right-4 gap-2">

                            <FaStar />

                            Featured

                          </span>

                        )}

                      </figure>

                      {/* CONTENT */}

                      <div className="card-body">

                        <h3 className="card-title line-clamp-2">

                          {award.title}

                        </h3>

                        <div className="space-y-2 text-sm">

                          <p>

                            <span className="font-semibold">
                              Recipient:
                            </span>{" "}

                            {award.recipient}

                          </p>

                          <p>

                            <span className="font-semibold">
                              Awardee:
                            </span>{" "}

                            {award.awardee}

                          </p>

                          <p>

                            <span className="font-semibold">
                              Date:
                            </span>{" "}

                            {award.awardDate
                              ? new Date(
                                  award.awardDate
                                ).toLocaleDateString()
                              : "-"}

                          </p>

                        </div>

                        {award.description && (

                          <p className="text-sm text-base-content/70 line-clamp-3 mt-3">

                            {award.description}

                          </p>

                        )}

                        
                                                {/* ACTIONS */}

                        <div className="card-actions justify-end mt-5">

                          <button
                            type="button"
                            className="btn btn-warning btn-sm"
                            onClick={() => editAward(award)}
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
                                award,
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

              </AnimatePresence>

            </div>

          )}

        </motion.div>

        {/* ===========================
            STICKY ACTION BAR
        =========================== */}

        <div className="sticky bottom-5 z-40">

          <div className="card bg-base-100 border border-base-300 shadow-2xl">

            <div className="card-body">

              <div className="flex flex-col md:flex-row justify-end gap-3">

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={resetForm}
                >

                  Reset Form

                </button>

                <button
                  type="button"
                  className="btn btn-error"
                  disabled={!awards.length}
                  onClick={() =>
                    setDeleteAllModal(true)
                  }
                >

                  <FaTrash />

                  Delete All

                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    document
                      .querySelector("form")
                      ?.requestSubmit()
                  }
                >

                  {editingAward ? (
                    <>
                      <FaEdit />
                      Update Award
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Add Award
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