import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  FaPlus,
  FaSearch,
  FaTrash,
  FaEdit,
  FaStar,
  FaSync,
  FaImages,
} from "react-icons/fa";

import api from "../../../../services/api";


import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";

/* ==========================================================
   CONSTANTS
========================================================== */

const categories = [
  "Industrial Visit",
  "Workshop",
  "Faculty Development Program",
  "Seminar",
  "Internship",
  "Research Activity",
  "Guest Lecture",
  "Hackathon",
  "Training Program",
];

const initialForm = {
  title: "",
  category: "Workshop",
  description: "",
  activityDate: "",
  organizer: "",
  location: "",
  participants: "",
  featured: false,
  status: "Published",
};

const RecentAcademicWorkControl =
  () => {
    /* ==========================================================
       DATA
    ========================================================== */

    const [
      activities,
      setActivities,
    ] = useState([]);

    const [
      loading,
      setLoading,
    ] = useState(false);

    const [
      saving,
      setSaving,
    ] = useState(false);

    const [
      editingId,
      setEditingId,
    ] = useState(null);

    /* ==========================================================
       FORM
    ========================================================== */

    const [
      formData,
      setFormData,
    ] = useState(initialForm);

    const [
      coverImage,
      setCoverImage,
    ] = useState(null);

    const [
      coverPreview,
      setCoverPreview,
    ] = useState("");

    const [
      galleryImages,
      setGalleryImages,
    ] = useState([]);

    const [
      galleryPreview,
      setGalleryPreview,
    ] = useState([]);

    /* ==========================================================
       FILTERS
    ========================================================== */

    const [
      searchTerm,
      setSearchTerm,
    ] = useState("");

    const [
      categoryFilter,
      setCategoryFilter,
    ] = useState("All");

    const [
      statusFilter,
      setStatusFilter,
    ] = useState("All");

    /* ==========================================================
       BULK
    ========================================================== */

    const [
      selectedItems,
      setSelectedItems,
    ] = useState([]);

    /* ==========================================================
       MODALS
    ========================================================== */

    const [
      statusModal,
      setStatusModal,
    ] = useState({
      isOpen: false,
      type: "success",
      title: "",
      message: "",
    });

    const [
      deleteModal,
      setDeleteModal,
    ] = useState({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
    });

    /* ==========================================================
       FETCH
    ========================================================== */

    const fetchActivities =
      async () => {
        try {

          setLoading(true);

          const res =
            await api.get(
              "/academic-works"
            );

          setActivities(
            res.data.data || []
          );

        } catch (error) {

          setStatusModal({
            isOpen: true,
            type: "error",
            title:
              "Loading Failed",
            message:
              error.response?.data
                ?.message ||
              "Failed to load academic activities.",
          });

        } finally {

          setLoading(false);

        }
      };

    useEffect(() => {

      fetchActivities();

    }, []);

    /* ==========================================================
       DASHBOARD STATS
    ========================================================== */

    const stats =
      useMemo(
        () => ({
          total:
            activities.length,

          featured:
            activities.filter(
              (item) =>
                item.featured
            ).length,

          published:
            activities.filter(
              (item) =>
                item.status ===
                "Published"
            ).length,

          draft:
            activities.filter(
              (item) =>
                item.status ===
                "Draft"
            ).length,
        }),
        [activities]
      );

    /* ==========================================================
       FILTERED DATA
    ========================================================== */

    const filteredActivities =
      useMemo(() => {

        return activities.filter(
          (activity) => {

            const matchesSearch =
              activity.title
                ?.toLowerCase()
                .includes(
                  searchTerm.toLowerCase()
                ) ||
              activity.description
                ?.toLowerCase()
                .includes(
                  searchTerm.toLowerCase()
                );

            const matchesCategory =
              categoryFilter ===
              "All"
                ? true
                : activity.category ===
                  categoryFilter;

            const matchesStatus =
              statusFilter ===
              "All"
                ? true
                : activity.status ===
                  statusFilter;

            return (
              matchesSearch &&
              matchesCategory &&
              matchesStatus
            );

          }
        );

      }, [
        activities,
        searchTerm,
        categoryFilter,
        statusFilter,
      ]);


        /* ==========================================================
       FORM INPUT
    ========================================================== */

    const handleInputChange = (
      e
    ) => {

      const {
        name,
        value,
        checked,
        type,
      } = e.target;

      setFormData(
        (prev) => ({

          ...prev,

          [name]:
            type ===
            "checkbox"
              ? checked
              : value,

        })
      );

    };

    /* ==========================================================
       RESET FORM
    ========================================================== */

    const resetForm =
      () => {

        if (
          coverPreview?.startsWith(
            "blob:"
          )
        ) {

          URL.revokeObjectURL(
            coverPreview
          );

        }

        galleryPreview.forEach(
          (image) => {

            if (
              image.startsWith(
                "blob:"
              )
            ) {

              URL.revokeObjectURL(
                image
              );

            }

          }
        );

        setEditingId(
          null
        );

        setFormData(
          initialForm
        );

        setCoverImage(
          null
        );

        setCoverPreview(
          ""
        );

        setGalleryImages(
          []
        );

        setGalleryPreview(
          []
        );

      };

    /* ==========================================================
       COVER IMAGE
    ========================================================== */

    const handleCoverImage =
      (e) => {

        const file =
          e.target
            .files?.[0];

        if (!file)
          return;

        if (
          coverPreview?.startsWith(
            "blob:"
          )
        ) {

          URL.revokeObjectURL(
            coverPreview
          );

        }

        setCoverImage(
          file
        );

        setCoverPreview(
          URL.createObjectURL(
            file
          )
        );

      };

    /* ==========================================================
       GALLERY IMAGES
    ========================================================== */

    const handleGalleryImages =
      (e) => {

        const files =
          Array.from(
            e.target
              .files ||
              []
          );

        if (
          !files.length
        )
          return;

        setGalleryImages(
          (prev) => [
            ...prev,
            ...files,
          ]
        );

        setGalleryPreview(
          (prev) => [

            ...prev,

            ...files.map(
              (file) =>
                URL.createObjectURL(
                  file
                )
            ),

          ]
        );

      };

    /* ==========================================================
       EDIT
    ========================================================== */

    const handleEdit =
      (
        activity
      ) => {

        setEditingId(
          activity._id
        );

        setFormData({

          title:
            activity.title ||
            "",

          category:
            activity.category ||
            "Workshop",

          description:
            activity.description ||
            "",

          activityDate:
            activity.activityDate
              ? activity.activityDate.split(
                  "T"
                )[0]
              : "",

          organizer:
            activity.organizer ||
            "",

          location:
            activity.location ||
            "",

          participants:
            activity.participants ||
            "",

          featured:
            activity.featured ||
            false,

          status:
            activity.status ||
            "Published",

        });

        setCoverImage(
          null
        );

        setGalleryImages(
          []
        );

        setCoverPreview(
          activity.image ||
            ""
        );

        setGalleryPreview(

          activity.gallery?.map(
            (
              item
            ) =>
              item.image
          ) || []

        );

        window.scrollTo({

          top: 0,

          behavior:
            "smooth",

        });

      };

    /* ==========================================================
       CANCEL EDIT
    ========================================================== */

    const handleCancelEdit =
      () => {

        resetForm();

        window.scrollTo({

          top: 0,

          behavior:
            "smooth",

        });

      };

    /* ==========================================================
       REFRESH
    ========================================================== */

    const handleRefresh =
      async () => {

        await fetchActivities();

      };

    /* ==========================================================
       FORM MODE
    ========================================================== */

    const isEditing =
      Boolean(
        editingId
      );

    const formTitle =
      isEditing
        ? "Edit Academic Activity"
        : "Add Academic Activity";

    const submitButtonText =
      isEditing
        ? "Update Activity"
        : "Create Activity";

    
        /* ==========================================================
       CREATE ACTIVITY
    ========================================================== */

    const handleCreate =
      async (e) => {

        e.preventDefault();

        try {

          setSaving(true);

          const payload =
            new FormData();

          Object.entries(
            formData
          ).forEach(
            ([key, value]) =>
              payload.append(
                key,
                value
              )
          );

          if (
            coverImage
          ) {

            payload.append(
              "image",
              coverImage
            );

          }

          galleryImages.forEach(
            (file) =>
              payload.append(
                "gallery",
                file
              )
          );

          const res =
            await api.post(
              "/academic-works",
              payload
            );

          await fetchActivities();

          resetForm();

          setStatusModal({

            isOpen: true,

            type: "success",

            title:
              "Success",

            message:
              res.data.message,

          });

        } catch (error) {

          setStatusModal({

            isOpen: true,

            type: "error",

            title:
              "Create Failed",

            message:
              error.response?.data
                ?.message ||
              "Failed to create activity.",

          });

        } finally {

          setSaving(false);

        }

      };

    /* ==========================================================
       UPDATE ACTIVITY
    ========================================================== */

    const handleUpdate =
      async (e) => {

        e.preventDefault();

        try {

          setSaving(true);

          const payload =
            new FormData();

          Object.entries(
            formData
          ).forEach(
            ([key, value]) =>
              payload.append(
                key,
                value
              )
          );

          if (
            coverImage
          ) {

            payload.append(
              "image",
              coverImage
            );

          }

          galleryImages.forEach(
            (file) =>
              payload.append(
                "gallery",
                file
              )
          );

          const res =
            await api.put(
              `/academic-works/${editingId}`,
              payload
            );

          await fetchActivities();

          resetForm();

          setStatusModal({

            isOpen: true,

            type: "success",

            title:
              "Updated",

            message:
              res.data.message,

          });

        } catch (error) {

          setStatusModal({

            isOpen: true,

            type: "error",

            title:
              "Update Failed",

            message:
              error.response?.data
                ?.message ||
              "Failed to update activity.",

          });

        } finally {

          setSaving(false);

        }

      };

    /* ==========================================================
       SUBMIT
    ========================================================== */

    const handleSubmit =
      (e) => {

        if (
          editingId
        ) {

          handleUpdate(
            e
          );

        } else {

          handleCreate(
            e
          );

        }

      };

    /* ==========================================================
       DELETE
    ========================================================== */

    const handleDelete =
      (id) => {

        setDeleteModal({

          isOpen: true,

          title:
            "Delete Activity",

          message:
            "Are you sure you want to permanently delete this activity?",

          onConfirm:
            async () => {

              try {

                const res =
                  await api.delete(
                    `/academic-works/${id}`
                  );

                if (
                  editingId ===
                  id
                ) {

                  resetForm();

                }

                await fetchActivities();

                setStatusModal({

                  isOpen: true,

                  type: "success",

                  title:
                    "Deleted",

                  message:
                    res.data.message,

                });

              } catch (error) {

                setStatusModal({

                  isOpen: true,

                  type: "error",

                  title:
                    "Delete Failed",

                  message:
                    error.response?.data
                      ?.message ||
                    "Failed to delete activity.",

                });

              } finally {

                setDeleteModal({

                  isOpen: false,

                  title: "",

                  message: "",

                  onConfirm:
                    null,

                });

              }

            },

        });

      };

    /* ==========================================================
       DELETE ALL
    ========================================================== */

    const handleDeleteAll =
      () => {

        setDeleteModal({

          isOpen: true,

          title:
            "Delete All Activities",

          message:
            "This will permanently delete every academic activity. Continue?",

          onConfirm:
            async () => {

              try {

                const res =
                  await api.delete(
                    "/academic-works"
                  );

                resetForm();

                setSelectedItems(
                  []
                );

                await fetchActivities();

                setStatusModal({

                  isOpen: true,

                  type: "success",

                  title:
                    "Deleted",

                  message:
                    res.data.message,

                });

              } catch (error) {

                setStatusModal({

                  isOpen: true,

                  type: "error",

                  title:
                    "Delete Failed",

                  message:
                    error.response?.data
                      ?.message ||
                    "Failed to delete all activities.",

                });

              } finally {

                setDeleteModal({

                  isOpen: false,

                  title: "",

                  message: "",

                  onConfirm:
                    null,

                });

              }

            },

        });

      };

    /* ==========================================================
       BULK DELETE
    ========================================================== */

    const handleBulkDelete =
      () => {

        if (
          !selectedItems.length
        ) {

          return setStatusModal({

            isOpen: true,

            type: "warning",

            title:
              "No Selection",

            message:
              "Please select one or more activities first.",

          });

        }

        setDeleteModal({

          isOpen: true,

          title:
            "Delete Selected",

          message:
            `Delete ${selectedItems.length} selected activities?`,

          onConfirm:
            async () => {

              try {

                await Promise.all(

                  selectedItems.map(
                    (id) =>
                      api.delete(
                        `/academic-works/${id}`
                      )
                  )

                );

                setSelectedItems(
                  []
                );

                await fetchActivities();

                setStatusModal({

                  isOpen: true,

                  type: "success",

                  title:
                    "Deleted",

                  message:
                    "Selected activities deleted successfully.",

                });

              } catch (error) {

                setStatusModal({

                  isOpen: true,

                  type: "error",

                  title:
                    "Bulk Delete Failed",

                  message:
                    error.response?.data
                      ?.message ||
                    "Failed to delete selected activities.",

                });

              } finally {

                setDeleteModal({

                  isOpen: false,

                  title: "",

                  message: "",

                  onConfirm:
                    null,

                });

              }

            },

        });

      };

    /* ==========================================================
       FEATURE TOGGLE
    ========================================================== */

    const toggleFeatured =
      async (id) => {

        try {

          await api.patch(
            `/academic-works/${id}/featured`
          );

          await fetchActivities();

        } catch (error) {

          setStatusModal({

            isOpen: true,

            type: "error",

            title:
              "Update Failed",

            message:
              error.response?.data
                ?.message ||
              "Failed to update featured status.",

          });

        }

      };

    /* ==========================================================
       SELECT
    ========================================================== */

    const toggleSelect =
      (id) => {

        setSelectedItems(
          (prev) =>
            prev.includes(id)
              ? prev.filter(
                  (item) =>
                    item !==
                    id
                )
              : [
                  ...prev,
                  id,
                ]
        );

      };

    const toggleSelectAll =
      () => {

        if (

          selectedItems.length ===
          filteredActivities.length

        ) {

          setSelectedItems(
            []
          );

        } else {

          setSelectedItems(

            filteredActivities.map(
              (item) =>
                item._id
            )

          );

        }

      };

   
        /* ==========================================================
       RETURN
    ========================================================== */

    return (

      <>

        <LoadingModal
          isOpen={loading || saving}
          title={
            saving
              ? "Saving Academic Activity"
              : "Loading Academic Activities"
          }
          message={
            saving
              ? "Please wait while your changes are being saved..."
              : "Fetching academic activities..."
          }
        />

        <StatusModal
          isOpen={statusModal.isOpen}
          type={statusModal.type}
          title={statusModal.title}
          message={statusModal.message}
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
          isOpen={deleteModal.isOpen}
          title={deleteModal.title}
          message={deleteModal.message}
          onConfirm={deleteModal.onConfirm}
          onCancel={() =>
            setDeleteModal({
              isOpen: false,
              title: "",
              message: "",
              onConfirm: null,
            })
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
            duration: 0.35,
          }}
          className="min-h-screen bg-base-200 p-4 md:p-6 lg:p-8"
        >

          <div className="max-w-7xl mx-auto space-y-8">

            {/* ==========================================================
                HERO
            ========================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: -25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="hero rounded-3xl bg-linear-to-r from-primary to-secondary text-primary-content shadow-xl"
            >

              <div className="hero-content text-center py-10">

                <div>

                  <FaImages className="text-6xl mx-auto mb-5" />

                  <h1 className="text-4xl md:text-5xl font-black">

                    Academic Activities CMS

                  </h1>

                  <p className="mt-3 text-lg opacity-90">

                    Manage workshops,
                    seminars,
                    industrial visits,
                    FDPs,
                    hackathons,
                    research activities
                    and training programs
                    from one enterprise dashboard.

                  </p>

                </div>

              </div>

            </motion.div>

            {/* ==========================================================
                DASHBOARD STATS
            ========================================================== */}

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

              <motion.div
                whileHover={{
                  y: -5,
                }}
                className="stats bg-base-100 border border-base-300 shadow"
              >

                <div className="stat">

                  <div className="stat-title">

                    Total Activities

                  </div>

                  <div className="stat-value text-primary">

                    {stats.total}

                  </div>

                </div>

              </motion.div>

              <motion.div
                whileHover={{
                  y: -5,
                }}
                className="stats bg-base-100 border border-base-300 shadow"
              >

                <div className="stat">

                  <div className="stat-title">

                    Published

                  </div>

                  <div className="stat-value text-success">

                    {stats.published}

                  </div>

                </div>

              </motion.div>

              <motion.div
                whileHover={{
                  y: -5,
                }}
                className="stats bg-base-100 border border-base-300 shadow"
              >

                <div className="stat">

                  <div className="stat-title">

                    Featured

                  </div>

                  <div className="stat-value text-warning">

                    {stats.featured}

                  </div>

                </div>

              </motion.div>

              <motion.div
                whileHover={{
                  y: -5,
                }}
                className="stats bg-base-100 border border-base-300 shadow"
              >

                <div className="stat">

                  <div className="stat-title">

                    Draft

                  </div>

                  <div className="stat-value text-error">

                    {stats.draft}

                  </div>

                </div>

              </motion.div>

            </div>

            {/* ==========================================================
                PAGE HEADER
            ========================================================== */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div>

                <h2 className="text-3xl md:text-4xl font-black">

                  Academic Activity Management

                </h2>

                <p className="text-base-content/70 mt-2">

                  Create,
                  update,
                  feature,
                  search,
                  and manage all academic activities
                  from one centralized dashboard.

                </p>

              </div>

              <div className="flex flex-wrap gap-3">

                <button
                  onClick={handleRefresh}
                  className="btn btn-outline"
                >

                  <FaSync />

                  Refresh

                </button>

                <button
                  onClick={handleCancelEdit}
                  className="btn btn-primary"
                >

                  <FaPlus />

                  New Activity

                </button>

              </div>

            </div>

            
                        {/* ==========================================================
                FORM CARD
            ========================================================== */}

            <div className="card bg-base-100 border border-base-300 shadow-xl">

              <div className="card-body">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                  <div>

                    <h3 className="text-2xl font-black">

                      {formTitle}

                    </h3>

                    <p className="text-base-content/70">

                      Fill in the activity details below.

                    </p>

                  </div>

                  {isEditing && (

                    <div className="badge badge-warning badge-lg">

                      Editing Mode

                    </div>

                  )}

                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >

                  {/* =======================================
                      BASIC INFORMATION
                  ======================================= */}

                  <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

                    <div className="xl:col-span-2">

                      <label className="label">

                        <span className="label-text font-semibold">

                          Activity Title

                        </span>

                      </label>

                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter activity title"
                        className="input input-bordered w-full"
                        required
                      />

                    </div>

                    <div>

                      <label className="label">

                        <span className="label-text font-semibold">

                          Category

                        </span>

                      </label>

                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
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

                    <div>

                      <label className="label">

                        <span className="label-text font-semibold">

                          Activity Date

                        </span>

                      </label>

                      <input
                        type="date"
                        name="activityDate"
                        value={formData.activityDate}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        required
                      />

                    </div>

                    <div>

                      <label className="label">

                        <span className="label-text">

                          Organizer

                        </span>

                      </label>

                      <input
                        type="text"
                        name="organizer"
                        value={formData.organizer}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        placeholder="Organizer"
                      />

                    </div>

                    <div>

                      <label className="label">

                        <span className="label-text">

                          Location

                        </span>

                      </label>

                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        placeholder="Location"
                      />

                    </div>

                    <div>

                      <label className="label">

                        <span className="label-text">

                          Participants

                        </span>

                      </label>

                      <input
                        type="text"
                        name="participants"
                        value={formData.participants}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        placeholder="Participants"
                      />

                    </div>

                    <div>

                      <label className="label">

                        <span className="label-text">

                          Status

                        </span>

                      </label>

                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="select select-bordered w-full"
                      >

                        <option value="Published">

                          Published

                        </option>

                        <option value="Draft">

                          Draft

                        </option>

                      </select>

                    </div>

                    <div className="flex items-end">

                      <label className="label cursor-pointer gap-4">

                        <span className="label-text">

                          Featured Activity

                        </span>

                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                          className="toggle toggle-warning"
                        />

                      </label>

                    </div>

                  </div>

                  {/* =======================================
                      DESCRIPTION
                  ======================================= */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Description

                      </span>

                    </label>

                    <textarea
                      rows={6}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter activity description..."
                      className="textarea textarea-bordered w-full"
                      required
                    />

                  </div>

                  {/* =======================================
                      COVER IMAGE
                  ======================================= */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Cover Image

                      </span>

                    </label>

                    <label className="btn btn-outline w-full">

                      Choose Cover Image

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverImage}
                      />

                    </label>

                    {coverPreview && (

                      <div className="mt-5 overflow-hidden rounded-2xl border border-base-300">

                        <img
                          src={coverPreview}
                          alt="Cover Preview"
                          className="w-full max-h-90 object-cover"
                        />

                      </div>

                    )}

                  </div>

                                    {/* =======================================
                      GALLERY IMAGES
                  ======================================= */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Activity Gallery

                      </span>

                    </label>

                    <label className="btn btn-outline w-full">

                      <FaImages />

                      Choose Gallery Images

                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleGalleryImages}
                        className="hidden"
                      />

                    </label>

                    {galleryPreview.length > 0 && (

                      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 mt-5">

                        {galleryPreview.map(
                          (
                            image,
                            index
                          ) => (

                            <motion.div
                              key={index}
                              whileHover={{
                                scale: 1.04,
                              }}
                              className="aspect-square rounded-2xl overflow-hidden border border-base-300 shadow"
                            >

                              <img
                                src={image}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-full object-cover"
                              />

                            </motion.div>

                          )
                        )}

                      </div>

                    )}

                  </div>

                  {/* =======================================
                      ACTION BUTTONS
                  ======================================= */}

                  <div className="flex flex-wrap justify-end gap-3 pt-6 border-t border-base-300">

                    {isEditing && (

                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="btn btn-warning"
                      >

                        Cancel Edit

                      </button>

                    )}

                    <button
                      type="submit"
                      disabled={saving}
                      className="btn btn-primary"
                    >

                      <FaPlus />

                      {submitButtonText}

                    </button>

                  </div>

                </form>

              </div>

            </div>

            {/* ==========================================================
                SEARCH & FILTERS
            ========================================================== */}

            <div className="card bg-base-100 border border-base-300 shadow-xl">

              <div className="card-body">

                <div className="flex items-center gap-3 mb-5">

                  <FaSearch className="text-primary text-xl" />

                  <h3 className="text-2xl font-black">

                    Search & Filters

                  </h3>

                </div>

                <div className="grid md:grid-cols-3 gap-5">

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                    placeholder="Search academic activities..."
                    className="input input-bordered w-full"
                  />

                  <select
                    value={categoryFilter}
                    onChange={(e) =>
                      setCategoryFilter(
                        e.target.value
                      )
                    }
                    className="select select-bordered w-full"
                  >

                    <option value="All">

                      All Categories

                    </option>

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

                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value
                      )
                    }
                    className="select select-bordered w-full"
                  >

                    <option value="All">

                      All Status

                    </option>

                    <option value="Published">

                      Published

                    </option>

                    <option value="Draft">

                      Draft

                    </option>

                  </select>

                </div>

              </div>

            </div>

          
                        {/* ==========================================================
                BULK ACTIONS
            ========================================================== */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div className="flex flex-wrap gap-3">

                <button
                  onClick={handleBulkDelete}
                  disabled={!selectedItems.length}
                  className="btn btn-error"
                >

                  <FaTrash />

                  Delete Selected

                </button>

                <button
                  onClick={handleDeleteAll}
                  className="btn btn-outline btn-error"
                >

                  <FaTrash />

                  Delete All

                </button>

              </div>

              <div className="flex flex-wrap gap-2">

                <div className="badge badge-primary badge-lg">

                  {filteredActivities.length}

                  {" "}

                  Activities

                </div>

                <div className="badge badge-success badge-lg">

                  {stats.published}

                  {" "}

                  Published

                </div>

                <div className="badge badge-warning badge-lg">

                  {stats.featured}

                  {" "}

                  Featured

                </div>

                {selectedItems.length > 0 && (

                  <div className="badge badge-secondary badge-lg">

                    {selectedItems.length}

                    {" "}

                    Selected

                  </div>

                )}

              </div>

            </div>

            {/* ==========================================================
                ACTIVITIES TABLE
            ========================================================== */}

            <div className="card bg-base-100 border border-base-300 shadow-xl">

              <div className="card-body p-0">

                <div className="overflow-x-auto">

                  <table className="table table-zebra">

                    <thead>

                      <tr>

                        <th>

                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary"
                            checked={
                              filteredActivities.length >
                                0 &&
                              selectedItems.length ===
                                filteredActivities.length
                            }
                            onChange={
                              toggleSelectAll
                            }
                          />

                        </th>

                        <th>

                          Cover

                        </th>

                        <th>

                          Title

                        </th>

                        <th>

                          Category

                        </th>

                        <th>

                          Date

                        </th>

                        <th>

                          Status

                        </th>

                        <th>

                          Featured

                        </th>

                        <th className="text-right">

                          Actions

                        </th>

                      </tr>

                    </thead>

                    <tbody>

                     
                                            {loading ? (

                        <tr>

                          <td
                            colSpan="8"
                            className="py-12 text-center"
                          >

                            <span className="loading loading-spinner loading-lg text-primary"></span>

                          </td>

                        </tr>

                      ) : filteredActivities.length === 0 ? (

                        <tr>

                          <td
                            colSpan="8"
                            className="py-14 text-center"
                          >

                            <div className="flex flex-col items-center gap-4">

                              <FaImages className="text-6xl text-base-content/30" />

                              <h3 className="text-2xl font-bold">

                                No Academic Activities Found

                              </h3>

                              <p className="text-base-content/60">

                                Create your first academic activity to get started.

                              </p>

                            </div>

                          </td>

                        </tr>

                      ) : (

                        filteredActivities.map(
                          (
                            activity
                          ) => (

                            <motion.tr
                              key={activity._id}
                              initial={{
                                opacity: 0,
                                y: 10,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              whileHover={{
                                backgroundColor:
                                  "rgba(0,0,0,0.02)",
                              }}
                            >

                              <td>

                                <input
                                  type="checkbox"
                                  className="checkbox checkbox-primary"
                                  checked={selectedItems.includes(
                                    activity._id
                                  )}
                                  onChange={() =>
                                    toggleSelect(
                                      activity._id
                                    )
                                  }
                                />

                              </td>

                              <td>

                                <div className="avatar">

                                  <div className="w-20 h-16 rounded-xl border border-base-300">

                                    <img
                                      src={
                                        activity.image ||
                                        "https://placehold.co/300x200?text=No+Image"
                                      }
                                      alt={
                                        activity.title
                                      }
                                      className="object-cover"
                                    />

                                  </div>

                                </div>

                              </td>

                              <td>

                                <div>

                                  <h4 className="font-bold">

                                    {activity.title}

                                  </h4>

                                  <p className="text-sm text-base-content/60 line-clamp-2 max-w-xs">

                                    {activity.description}

                                  </p>

                                </div>

                              </td>

                              <td>

                                <span className="badge badge-outline whitespace-nowrap">

                                  {activity.category}

                                </span>

                              </td>

                              <td>

                                {activity.activityDate
                                  ? new Date(
                                      activity.activityDate
                                    ).toLocaleDateString()
                                  : "-"}

                              </td>

                              <td>

                                {activity.status ===
                                "Published" ? (

                                  <span className="badge badge-success">

                                    Published

                                  </span>

                                ) : (

                                  <span className="badge badge-warning">

                                    Draft

                                  </span>

                                )}

                              </td>

                              <td>

                                <button
                                  onClick={() =>
                                    toggleFeatured(
                                      activity._id
                                    )
                                  }
                                  className={`btn btn-sm ${
                                    activity.featured
                                      ? "btn-warning"
                                      : "btn-outline"
                                  }`}
                                >

                                  <FaStar />

                                </button>

                              </td>

                              <td>

                                <div className="flex justify-end gap-2">

                                  <button
                                    onClick={() =>
                                      handleEdit(
                                        activity
                                      )
                                    }
                                    className="btn btn-info btn-sm"
                                  >

                                    <FaEdit />

                                  </button>

                                  <button
                                    onClick={() =>
                                      handleDelete(
                                        activity._id
                                      )
                                    }
                                    className="btn btn-error btn-sm"
                                  >

                                    <FaTrash />

                                  </button>

                                </div>

                              </td>

                            </motion.tr>

                          )
                        )

                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

         

          </div>

        </motion.div>

      </>

    );

};

export default RecentAcademicWorkControl;