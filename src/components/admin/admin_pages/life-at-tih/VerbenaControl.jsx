import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  SparklesIcon,
  CalendarDaysIcon,
  MapPinIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

import api from "../../../../services/api";


import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";

/* ==========================================================
   DATE FORMATTER
========================================================== */

const formatDate = (date) => {

  if (!date) return "";

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

};

/* ==========================================================
   INITIAL STATE
========================================================== */

const initialForm = {
  heroSubtitle: "",
  startDate: "",
  endDate: "",
  venue: "",
  registerLink: "",
  heroImage: "",
  heroImagePublicId: "",

  aboutTitle: "",
  aboutDescription: "",
  aboutImage: "",
  aboutImagePublicId: "",

  eventCategories: [],

  whyParticipate: [],

  timeline: [],

};

export default function VerbenaControl() {

  /* ==========================================================
     LOADING
  ========================================================== */

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

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
     DATA
  ========================================================== */

  const [
    form,
    setForm,
  ] = useState(initialForm);

  /* ==========================================================
     IMAGE UPLOAD LOADING STATE
     Keyed by "heroImage", "aboutImage",
     or "section-index" (e.g. "eventCategories-0")
  ========================================================== */

  const [
    uploadingFields,
    setUploadingFields,
  ] = useState({});

  /* ==========================================================
     LOAD DATA
  ========================================================== */

  const loadData =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.get(
            "/verbena"
          );

        const data =
          res.data.data ||
          initialForm;

        setForm({

          ...initialForm,

          ...data,

          eventCategories:
            data.eventCategories ||
            [],

          whyParticipate:
            data.whyParticipate ||
            [],

          timeline:
            data.timeline ||
            [],

        });

      } catch (error) {

        setStatusModal({

          isOpen: true,

          type: "error",

          title:
            "Loading Failed",

          message:
            error.response?.data
              ?.message ||
            "Failed to load Verbena CMS.",

        });

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    loadData();

  }, []);

  /* ==========================================================
     INPUT HANDLER
  ========================================================== */

  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;

      setForm(
        (prev) => ({

          ...prev,

          [name]: value,

        })
      );

    };

  /* ==========================================================
     IMAGE UPLOAD — TOP-LEVEL FIELDS (Hero / About)
  ========================================================== */

  const handleFieldImageUpload =
    async (
      e,
      fieldName,
      publicIdField
    ) => {

      const file =
        e.target.files?.[0];

      if (!file) return;

      setUploadingFields(
        (prev) => ({
          ...prev,
          [fieldName]: true,
        })
      );

      try {

        const formData =
          new FormData();

        formData.append(
          "image",
          file
        );

        if (form[publicIdField]) {

          formData.append(
            "oldPublicId",
            form[publicIdField]
          );

        }

        const res =
          await api.post(
            "/verbena/upload-image",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        const {
          url,
          publicId,
        } = res.data.data;

        setForm(
          (prev) => ({
            ...prev,
            [fieldName]: url,
            [publicIdField]: publicId,
          })
        );

      } catch (error) {

        setStatusModal({

          isOpen: true,

          type: "error",

          title: "Upload Failed",

          message:
            error.response?.data
              ?.message ||
            "Failed to upload image.",

        });

      } finally {

        setUploadingFields(
          (prev) => ({
            ...prev,
            [fieldName]: false,
          })
        );

        e.target.value = "";

      }

    };

  /* ==========================================================
     IMAGE UPLOAD — ARRAY ITEM FIELDS
     (Event Categories / Why Participate cards)
  ========================================================== */

  const handleArrayImageUpload =
    async (
      e,
      section,
      index,
      oldPublicId
    ) => {

      const file =
        e.target.files?.[0];

      if (!file) return;

      const key =
        `${section}-${index}`;

      setUploadingFields(
        (prev) => ({
          ...prev,
          [key]: true,
        })
      );

      try {

        const formData =
          new FormData();

        formData.append(
          "image",
          file
        );

        if (oldPublicId) {

          formData.append(
            "oldPublicId",
            oldPublicId
          );

        }

        const res =
          await api.post(
            "/verbena/upload-image",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        const {
          url,
          publicId,
        } = res.data.data;

        updateArrayField(
          section,
          index,
          "image",
          url
        );

        updateArrayField(
          section,
          index,
          "imagePublicId",
          publicId
        );

      } catch (error) {

        setStatusModal({

          isOpen: true,

          type: "error",

          title: "Upload Failed",

          message:
            error.response?.data
              ?.message ||
            "Failed to upload image.",

        });

      } finally {

        setUploadingFields(
          (prev) => ({
            ...prev,
            [key]: false,
          })
        );

        e.target.value = "";

      }

    };

  /* ==========================================================
     ARRAY UPDATE
  ========================================================== */

  const updateArrayField =
    (
      section,
      index,
      field,
      value
    ) => {

      setForm(
        (prev) => ({

          ...prev,

          [section]:
            prev[
              section
            ].map(
              (
                item,
                i
              ) =>
                i === index
                  ? {
                      ...item,
                      [field]:
                        value,
                    }
                  : item
            ),

        })
      );

    };

  /* ==========================================================
     DASHBOARD STATS
  ========================================================== */

  const stats =
    useMemo(
      () => ({

        categories:
          form
            .eventCategories
            ?.length || 0,

        participate:
          form
            .whyParticipate
            ?.length || 0,

        timeline:
          form.timeline
            ?.length || 0,

        hasVenue:
          !!form.venue,

        hasDates:
          !!form.startDate,

      }),
      [form]
    );

  /* ==========================================================
     Continue in Part 2
  ========================================================== */
    /* ==========================================================
     ADD ITEM
  ========================================================== */

  const addItem = (
    section,
    template
  ) => {

    setForm((prev) => ({

      ...prev,

      [section]: [

        ...(prev[section] || []),

        { ...template },

      ],

    }));

  };

  /* ==========================================================
     REMOVE ITEM
  ========================================================== */

  const removeItem = (
    section,
    index
  ) => {

    setForm((prev) => ({

      ...prev,

      [section]:
        prev[section].filter(
          (_, i) => i !== index
        ),

    }));

  };

  /* ==========================================================
     SAVE
  ========================================================== */

  const handleSave =
    async () => {

      try {

        setSaving(true);

        const res =
          await api.put(
            "/verbena",
            form
          );

        setStatusModal({

          isOpen: true,

          type: "success",

          title:
            "Saved Successfully",

          message:
            res.data.message,

        });

        await loadData();

      } catch (error) {

        setStatusModal({

          isOpen: true,

          type: "error",

          title:
            "Save Failed",

          message:
            error.response?.data
              ?.message ||
            "Failed to save Verbena CMS.",

        });

      } finally {

        setSaving(false);

      }

    };

  /* ==========================================================
     DELETE
  ========================================================== */

  const handleDelete =
    () => {

      setDeleteModal({

        isOpen: true,

        title:
          "Delete Verbena CMS",

        message:
          "This will permanently remove the Verbena CMS content. Continue?",

        onConfirm:
          async () => {

            try {

              const res =
                await api.delete(
                  "/verbena"
                );

              setForm(
                initialForm
              );

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
                  "Failed to delete Verbena CMS.",

              });

            } finally {

              setDeleteModal({

                isOpen: false,

                title: "",

                message: "",

                onConfirm: null,

              });

            }

          },

      });

    };

  /* ==========================================================
     RETURN
  ========================================================== */

  return (

    <>

      <LoadingModal
        isOpen={
          loading || saving
        }
        title={
          saving
            ? "Saving Verbena"
            : "Loading Verbena"
        }
        message={
          saving
            ? "Please wait while your changes are being saved..."
            : "Fetching Verbena CMS..."
        }
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
        title={
          deleteModal.title
        }
        message={
          deleteModal.message
        }
        onConfirm={
          deleteModal.onConfirm
        }
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
        className="
          min-h-screen
          bg-base-200
          p-4
          md:p-6
          lg:p-8
        "
      >

        <div className="max-w-7xl mx-auto space-y-8">

          {/* ==========================================================
              HERO
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
            className="
              hero
              rounded-3xl
              bg-linear-to-r
              from-primary
              via-secondary
              to-accent
              text-primary-content
              shadow-xl
            "
          >

            <div className="hero-content text-center py-10">

              <div>

                <SparklesIcon className="h-20 w-20 mx-auto mb-5" />

                <h1 className="text-4xl md:text-5xl font-black">

                  Verbena Festival CMS

                </h1>

                <p className="mt-3 text-lg opacity-90">

                  Manage the complete Verbena cultural festival
                  from one enterprise dashboard.

                </p>

              </div>

            </div>

          </motion.div>

          {/* ==========================================================
              DASHBOARD STATS
          ========================================================== */}

          <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5">

            <div className="stats bg-base-100 border border-base-300 shadow">

              <div className="stat">

                <div className="stat-title">

                  Categories

                </div>

                <div className="stat-value text-primary">

                  {stats.categories}

                </div>

              </div>

            </div>

            <div className="stats bg-base-100 border border-base-300 shadow">

              <div className="stat">

                <div className="stat-title">

                  Why Participate

                </div>

                <div className="stat-value text-secondary">

                  {stats.participate}

                </div>

              </div>

            </div>

            <div className="stats bg-base-100 border border-base-300 shadow">

              <div className="stat">

                <div className="stat-title">

                  Timeline

                </div>

                <div className="stat-value text-accent">

                  {stats.timeline}

                </div>

              </div>

            </div>

            <div className="stats bg-base-100 border border-base-300 shadow">

              <div className="stat">

                <div className="stat-title">

                  Venue

                </div>

                <div className="stat-value text-success text-lg">

                  {stats.hasVenue
                    ? "Ready"
                    : "Missing"}

                </div>

              </div>

            </div>

            <div className="stats bg-base-100 border border-base-300 shadow">

              <div className="stat">

                <div className="stat-title">

                  Event Dates

                </div>

                <div className="stat-value text-info text-lg">

                  {stats.hasDates
                    ? "Ready"
                    : "Pending"}

                </div>

              </div>

            </div>

          </div>

          {/* ==========================================================
              Continue in Part 3
          ========================================================== */}
                    {/* ==========================================================
              MAIN LAYOUT
          ========================================================== */}

          <div className="grid xl:grid-cols-[1.6fr_1fr] gap-6">

            {/* ==========================================================
                LEFT PANEL
            ========================================================== */}

            <div className="card bg-base-100 border border-base-300 shadow-xl">

              <div className="card-body">

                {/* ==========================================================
                    HERO SECTION
                ========================================================== */}

                <div className="flex items-center justify-between mb-6">

                  <div>

                    <h2 className="text-2xl font-black">

                      Hero Section

                    </h2>

                    <p className="text-base-content/70">

                      Configure the main festival information.

                    </p>

                  </div>

                  <div className="badge badge-primary badge-lg">

                    Single Document CMS

                  </div>

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  <div className="form-control">

                    <label className="label">

                      <span className="label-text font-semibold">

                        Hero Subtitle

                      </span>

                    </label>

                    <input
                      type="text"
                      name="heroSubtitle"
                      value={form.heroSubtitle}
                      onChange={handleChange}
                      placeholder="Annual Cultural Festival"
                      className="input input-bordered"
                    />

                  </div>

                </div>

                {/* ==========================================================
                    EVENT DETAILS
                ========================================================== */}

                <div className="divider">

                  Event Details

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  <div className="form-control">

                    <label className="label">

                      <span className="label-text">

                        Start Date

                      </span>

                    </label>

                    <input
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                      className="input input-bordered"
                    />

                  </div>

                  <div className="form-control">

                    <label className="label">

                      <span className="label-text">

                        End Date

                      </span>

                    </label>

                    <input
                      type="date"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleChange}
                      className="input input-bordered"
                    />

                  </div>

                </div>

                <div className="grid md:grid-cols-2 gap-5 mt-5">

                  <div className="form-control">

                    <label className="label">

                      <span className="label-text">

                        Venue

                      </span>

                    </label>

                    <input
                      type="text"
                      name="venue"
                      value={form.venue}
                      onChange={handleChange}
                      placeholder="College Auditorium"
                      className="input input-bordered"
                    />

                  </div>

                  <div className="form-control">

                    <label className="label">

                      <span className="label-text">

                        Registration Link

                      </span>

                    </label>

                    <input
                      type="url"
                      name="registerLink"
                      value={form.registerLink}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="input input-bordered"
                    />

                  </div>

                </div>

                {/* ==========================================================
                    HERO IMAGE
                ========================================================== */}

                <div className="divider">

                  Hero Image

                </div>

                <div className="form-control">

                  <label className="label">

                    <span className="label-text">

                      Hero Image

                    </span>

                  </label>

                  {form.heroImage && (

                    <img
                      src={form.heroImage}
                      alt="Hero preview"
                      className="w-full h-48 object-cover rounded-xl border border-base-300 mb-3"
                    />

                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFieldImageUpload(
                        e,
                        "heroImage",
                        "heroImagePublicId"
                      )
                    }
                    disabled={
                      uploadingFields.heroImage
                    }
                    className="file-input file-input-bordered w-full"
                  />

                  {uploadingFields.heroImage && (

                    <span className="text-sm text-base-content/60 mt-2">

                      Uploading...

                    </span>

                  )}

                </div>

                {/* ==========================================================
                    ABOUT SECTION
                ========================================================== */}

                <div className="divider">

                  About Section

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  <div className="form-control">

                    <label className="label">

                      <span className="label-text">

                        About Title

                      </span>

                    </label>

                    <input
                      type="text"
                      name="aboutTitle"
                      value={form.aboutTitle}
                      onChange={handleChange}
                      placeholder="About Verbena"
                      className="input input-bordered"
                    />

                  </div>

                  <div className="form-control">

                    <label className="label">

                      <span className="label-text">

                        About Image

                      </span>

                    </label>

                    {form.aboutImage && (

                      <img
                        src={form.aboutImage}
                        alt="About preview"
                        className="w-full h-40 object-cover rounded-xl border border-base-300 mb-3"
                      />

                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFieldImageUpload(
                          e,
                          "aboutImage",
                          "aboutImagePublicId"
                        )
                      }
                      disabled={
                        uploadingFields.aboutImage
                      }
                      className="file-input file-input-bordered w-full"
                    />

                    {uploadingFields.aboutImage && (

                      <span className="text-sm text-base-content/60 mt-2">

                        Uploading...

                      </span>

                    )}

                  </div>

                </div>

                <div className="form-control mt-5">

                  <label className="label">

                    <span className="label-text">

                      About Description

                    </span>

                  </label>

                  <textarea
                    rows={6}
                    name="aboutDescription"
                    value={form.aboutDescription}
                    onChange={handleChange}
                    className="textarea textarea-bordered"
                    placeholder="Describe the festival..."
                  />

                </div>

                {/* ==========================================================
                    Continue in Part 4
                ========================================================== */}
                                {/* ==========================================================
                    EVENT CATEGORIES
                ========================================================== */}

                <div className="divider">

                  Event Categories

                </div>

                <div className="card bg-base-200 border border-base-300">

                  <div className="card-body">

                    <div className="flex items-center justify-between mb-5">

                      <div>

                        <h3 className="text-xl font-black">

                          Festival Categories

                        </h3>

                        <p className="text-base-content/70">

                          Manage all cultural event categories.

                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          addItem(
                            "eventCategories",
                            {
                              title: "",
                              description: "",
                              image: "",
                              imagePublicId: "",
                            }
                          )
                        }
                        className="btn btn-primary"
                      >

                        Add Category

                      </button>

                    </div>

                    <div
                        className="
                          space-y-6
                          max-h-162.5
                          overflow-y-auto
                          pr-2
                          scrollbar-thin
                          scrollbar-thumb-base-300
                          scrollbar-track-transparent
                        "
                      >

                      {form.eventCategories.map(
                        (category, index) => (

                          <motion.div
                            key={index}
                            whileHover={{
                              y: -3,
                            }}
                            className="card bg-base-100 border border-base-300 shadow"
                          >

                            <div className="card-body">

                              <div className="grid lg:grid-cols-2 gap-5">

                                <input
                                  type="text"
                                  value={category.title}
                                  onChange={(e) =>
                                    updateArrayField(
                                      "eventCategories",
                                      index,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Category Title"
                                  className="input input-bordered"
                                />

                                <div className="form-control">

                                  {category.image && (

                                    <img
                                      src={category.image}
                                      alt={category.title || "Category preview"}
                                      className="w-full h-32 object-cover rounded-xl border border-base-300 mb-2"
                                    />

                                  )}

                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleArrayImageUpload(
                                        e,
                                        "eventCategories",
                                        index,
                                        category.imagePublicId
                                      )
                                    }
                                    disabled={
                                      uploadingFields[
                                        `eventCategories-${index}`
                                      ]
                                    }
                                    className="file-input file-input-bordered file-input-sm w-full"
                                  />

                                  {uploadingFields[
                                    `eventCategories-${index}`
                                  ] && (

                                    <span className="text-xs text-base-content/60 mt-1">

                                      Uploading...

                                    </span>

                                  )}

                                </div>

                              </div>

                              <textarea
                                rows={4}
                                value={category.description}
                                onChange={(e) =>
                                  updateArrayField(
                                    "eventCategories",
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="textarea textarea-bordered mt-5"
                                placeholder="Category description..."
                              />

                              <div className="flex justify-end mt-5">

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeItem(
                                      "eventCategories",
                                      index
                                    )
                                  }
                                  className="btn btn-error btn-sm"
                                >

                                  Remove

                                </button>

                              </div>

                            </div>

                          </motion.div>

                        )
                      )}

                    </div>

                  </div>

                </div>

                {/* ==========================================================
                    WHY PARTICIPATE
                ========================================================== */}

                <div className="divider">

                  Why Participate

                </div>

                <div className="card bg-base-200 border border-base-300">

                  <div className="card-body">

                    <div className="flex items-center justify-between mb-5">

                      <div>

                        <h3 className="text-xl font-black">

                          Participation Cards

                        </h3>

                        <p className="text-base-content/70">

                          Showcase why students should join.

                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          addItem(
                            "whyParticipate",
                            {
                              title: "",
                              image: "",
                              imagePublicId: "",
                            }
                          )
                        }
                        className="btn btn-primary"
                      >

                        Add Card

                      </button>

                    </div>

                    <div
                      className="
                        space-y-5
                        max-h-162.5
                        overflow-y-auto
                        pr-2
                        scrollbar-thin
                        scrollbar-thumb-base-300
                        scrollbar-track-transparent
                      "
                    >

                      {form.whyParticipate.map(
                        (card, index) => (

                          <motion.div
                            key={index}
                            whileHover={{
                              y: -3,
                            }}
                            className="card bg-base-100 border border-base-300 shadow"
                          >

                            <div className="card-body">

                              <div className="grid lg:grid-cols-2 gap-5">

                                <input
                                  type="text"
                                  value={card.title}
                                  onChange={(e) =>
                                    updateArrayField(
                                      "whyParticipate",
                                      index,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Card Title"
                                  className="input input-bordered"
                                />

                                <div className="form-control">

                                  {card.image && (

                                    <img
                                      src={card.image}
                                      alt={card.title || "Card preview"}
                                      className="w-full h-32 object-cover rounded-xl border border-base-300 mb-2"
                                    />

                                  )}

                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleArrayImageUpload(
                                        e,
                                        "whyParticipate",
                                        index,
                                        card.imagePublicId
                                      )
                                    }
                                    disabled={
                                      uploadingFields[
                                        `whyParticipate-${index}`
                                      ]
                                    }
                                    className="file-input file-input-bordered file-input-sm w-full"
                                  />

                                  {uploadingFields[
                                    `whyParticipate-${index}`
                                  ] && (

                                    <span className="text-xs text-base-content/60 mt-1">

                                      Uploading...

                                    </span>

                                  )}

                                </div>

                              </div>

                              <div className="flex justify-end mt-5">

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeItem(
                                      "whyParticipate",
                                      index
                                    )
                                  }
                                  className="btn btn-error btn-sm"
                                >

                                  Remove

                                </button>

                              </div>

                            </div>

                          </motion.div>

                        )
                      )}

                    </div>

                  </div>

                </div>

                {/* ==========================================================
                    Continue in Part 5
                ========================================================== */}
                                {/* ==========================================================
                    TIMELINE
                ========================================================== */}

                <div className="divider">

                  Festival Timeline

                </div>

                <div className="card bg-base-200 border border-base-300">

                  <div className="card-body">

                    <div className="flex items-center justify-between mb-5">

                      <div>

                        <h3 className="text-xl font-black">

                          Timeline Management

                        </h3>

                        <p className="text-base-content/70">

                          Configure the schedule of the festival.

                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          addItem(
                            "timeline",
                            {
                              day: "",
                              title: "",
                              description: "",
                            }
                          )
                        }
                        className="btn btn-primary"
                      >

                        Add Timeline

                      </button>

                    </div>

                    <div
                    className="
                      space-y-5
                      max-h-162.5
                      overflow-y-auto
                      pr-2
                      scrollbar-thin
                      scrollbar-thumb-base-300
                      scrollbar-track-transparent
                    "
>

                      {form.timeline.map(
                        (item, index) => (

                          <motion.div
                            key={index}
                            whileHover={{
                              y: -3,
                            }}
                            className="card bg-base-100 border border-base-300 shadow"
                          >

                            <div className="card-body">

                              <div className="grid lg:grid-cols-3 gap-5">

                                <input
                                  type="text"
                                  value={item.day}
                                  onChange={(e) =>
                                    updateArrayField(
                                      "timeline",
                                      index,
                                      "day",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Day 1"
                                  className="input input-bordered"
                                />

                                <input
                                  type="text"
                                  value={item.title}
                                  onChange={(e) =>
                                    updateArrayField(
                                      "timeline",
                                      index,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Opening Ceremony"
                                  className="input input-bordered"
                                />

                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(e) =>
                                    updateArrayField(
                                      "timeline",
                                      index,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Description"
                                  className="input input-bordered"
                                />

                              </div>

                              <div className="flex justify-end mt-5">

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeItem(
                                      "timeline",
                                      index
                                    )
                                  }
                                  className="btn btn-error btn-sm"
                                >

                                  Remove

                                </button>

                              </div>

                            </div>

                          </motion.div>

                        )
                      )}

                    </div>

                  </div>

                </div>

              </div>

              {/* ==========================================================
                  LIVE PREVIEW
              ========================================================== */}

              <div className="space-y-6 sticky top-6 h-fit">

                <div className="card bg-base-100 border border-base-300 shadow-xl">

                  <div className="card-body">

                    <h2 className="text-2xl font-black mb-6">

                      Live Preview

                    </h2>

                    <div className="rounded-3xl overflow-hidden bg-linear-to-br from-primary via-secondary to-accent text-primary-content">

                      {form.heroImage && (

                        <img
                          src={form.heroImage}
                          alt="Hero"
                          className="w-full h-56 object-cover"
                        />

                      )}

                      <div className="p-6">

                        <h2 className="text-3xl font-black">

                          Verbena

                        </h2>

                        <p className="mt-3 opacity-90">

                          {form.heroSubtitle ||
                            "Annual Cultural Festival"}

                        </p>

                        <div className="divider divider-neutral before:bg-white/20 after:bg-white/20"></div>

                        <div className="space-y-3">

                          <div className="flex items-center gap-3">

                            <CalendarDaysIcon className="h-5 w-5" />

                            <span>

                              {form.startDate
                                ? `${formatDate(form.startDate)} - ${formatDate(form.endDate)}`
                                : "Dates not configured"}

                            </span>

                          </div>

                          <div className="flex items-center gap-3">

                            <MapPinIcon className="h-5 w-5" />

                            <span>

                              {form.venue ||
                                "Venue not configured"}

                            </span>

                          </div>

                        </div>

                      </div>

                    </div>

                    <div className="stats stats-vertical shadow mt-6 w-full">

                      <div className="stat">

                        <div className="stat-title">

                          Categories

                        </div>

                        <div className="stat-value text-primary">

                          {stats.categories}

                        </div>

                      </div>

                      <div className="stat">

                        <div className="stat-title">

                          Why Participate

                        </div>

                        <div className="stat-value text-secondary">

                          {stats.participate}

                        </div>

                      </div>

                      <div className="stat">

                        <div className="stat-title">

                          Timeline

                        </div>

                        <div className="stat-value text-accent">

                          {stats.timeline}

                        </div>

                      </div>

                    </div>

                    <div className="divider"></div>

                    <div className="flex flex-col gap-3">

                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="btn btn-primary w-full"
                      >

                        {saving
                          ? "Saving..."
                          : "Save Changes"}

                      </button>

                      <button
                        type="button"
                        onClick={handleDelete}
                        className="btn btn-error w-full"
                      >

                        Delete CMS

                      </button>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </motion.div>

      {/* ==========================================================
                STICKY FOOTER
            ========================================================== */}

            <div className="sticky bottom-4 z-30">

              <div className="card bg-base-100 border border-base-300 shadow-2xl">

                <div className="card-body py-4">

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    <div>

                      <h3 className="font-black text-xl">

                        Verbena Festival CMS

                      </h3>

                      <p className="text-base-content/60">

                        Enterprise dashboard for managing
                        the complete Verbena cultural festival.

                      </p>

                    </div>

                  </div>

                  <div className="flex justify-end gap-3">

                    <button
                      type="button"
                      onClick={loadData}
                      className="btn btn-outline"
                    >

                      Refresh

                    </button>

                    <button
                      type="button"
                      onClick={handleSave}
                      className="btn btn-primary"
                    >

                      Save All

                    </button>

                  </div>

                </div>

              </div>

            </div>

    </>

  );

}