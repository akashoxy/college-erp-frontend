import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  CalendarDaysIcon,
  MapPinIcon,
  LinkIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";

import api from "../../../../services/api";


import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";

/* ==========================================================
   DATE FORMATTER
========================================================== */

const formatDate = (
  date
) => {

  if (!date)
    return "";

  return new Date(
    date
  ).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

};

/* ==========================================================
   INITIAL FORM
========================================================== */

const initialForm = {
    heroSubtitle:"",
    about:"",
    startDate:"",
    endDate:"",
    eventVenue:"",
    registerLink:"",
    hackathons:"",
    roboticsDrones:"",
    gamingArena:"",
    techTalks:"",
    heroImage:"",
    heroImagePreview:"",
    whyParticipate:[]
};

export default function SparkControl() {

  /* ==========================================================
     STATES
  ========================================================== */

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    form,
    setForm,
  ] = useState(
    initialForm
  );

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
     LOAD DATA
  ========================================================== */

  const loadData =
    async () => {

      try {

        setLoading(
          true
        );

        const res =
          await api.get(
            "/spark"
          );

        if (
          res.data?.data
        ) {

          const data = res.data.data || {};

setForm({
  ...initialForm,
  ...data,

  startDate: data.startDate
    ? data.startDate.split("T")[0]
    : "",

  endDate: data.endDate
    ? data.endDate.split("T")[0]
    : "",

  heroImagePreview:
    data.heroImage || "",
});

        }

      } catch (error) {

        setStatusModal({

          isOpen: true,

          type: "error",

          title:
            "Loading Failed",

          message:
            error.response?.data
              ?.message ||
            "Failed to load Spark Quest data.",

        });

      } finally {

        setLoading(
          false
        );

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

          [name]:
            value,

        })
      );

    };

    const handleHeroImage = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setForm((prev) => ({
    ...prev,
    heroImage: file,
    heroImagePreview:
      URL.createObjectURL(file),
  }));
};

  /* ==========================================================
     DASHBOARD STATS
  ========================================================== */

  const stats =
    useMemo(
      () => ({

        whyCards:
          form
            .whyParticipate
            ?.length || 0,

        hasVenue:
          Boolean(
            form.eventVenue
          ),

        hasDates:
          Boolean(
            form.startDate
          ),

        hasRegister:
          Boolean(
            form.registerLink
          ),

      }),
      [form]
    );

  /* ==========================================================
     Continue in Part 2
  ========================================================== */
    /* ==========================================================
     SAVE DATA
  ========================================================== */

  const handleSave = async () => {
  try {
    setSaving(true);

    const formData = new FormData();

    formData.append("heroSubtitle", form.heroSubtitle);
    formData.append("about", form.about);
    formData.append("startDate", form.startDate);
    formData.append("endDate", form.endDate);
    formData.append("eventVenue", form.eventVenue);
    formData.append("registerLink", form.registerLink);

    formData.append("hackathons", form.hackathons);
    formData.append("roboticsDrones", form.roboticsDrones);
    formData.append("gamingArena", form.gamingArena);
    formData.append("techTalks", form.techTalks);

    formData.append(
      "whyParticipate",
      JSON.stringify(form.whyParticipate)
    );

    if (form.heroImage instanceof File) {
      formData.append(
        "heroImage",
        form.heroImage
      );
    }

    const res = await api.put(
      "/spark",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    setStatusModal({
      isOpen: true,
      type: "success",
      title: "Success",
      message: res.data.message,
    });

    await loadData();
  } catch (error) {
    setStatusModal({
      isOpen: true,
      type: "error",
      title: "Save Failed",
      message:
        error.response?.data?.message ||
        "Failed to save Spark Quest data.",
    });
  } finally {
    setSaving(false);
  }
};

  /* ==========================================================
     DELETE DATA
  ========================================================== */

  const handleDelete =
    () => {

      setDeleteModal({

        isOpen: true,

        title: "Delete Spark Quest",

        message:
          "This will permanently delete all Spark Quest data. Continue?",

        onConfirm:
          async () => {

            try {

              const res =
                await api.delete(
                  "/spark"
                );

              setForm(
                initialForm
              );

              setStatusModal({

                isOpen: true,

                type: "success",

                title: "Deleted",

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
                  "Failed to delete Spark Quest data.",

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
     WHY PARTICIPATE
  ========================================================== */

  const addWhyCard =
    () => {

      setForm(
        (prev) => ({

          ...prev,

          whyParticipate: [

            ...(prev.whyParticipate || []),

            {
              title: "",
              image: "",
            },

          ],

        })
      );

    };

  const updateWhyCard =
    (
      index,
      field,
      value
    ) => {

      setForm(
        (prev) => {

          const updated = [
            ...prev.whyParticipate,
          ];

          updated[index] = {

            ...updated[index],

            [field]:
              value,

          };

          return {

            ...prev,

            whyParticipate:
              updated,

          };

        }
      );

    };

  const removeWhyCard =
    (index) => {

      setForm(
        (prev) => ({

          ...prev,

          whyParticipate:
            prev.whyParticipate.filter(
              (_, i) =>
                i !== index
            ),

        })
      );

    };

  /* ==========================================================
     RESET
  ========================================================== */

  const resetForm =
    () => {

      setForm(
        initialForm
      );

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
            ? "Saving Spark Quest"
            : "Loading Spark Quest"
        }
        message={
          saving
            ? "Please wait while your changes are being saved..."
            : "Fetching Spark Quest data..."
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
        className="min-h-screen bg-base-200 p-4 md:p-6 lg:p-8"
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

                <RocketLaunchIcon className="h-20 w-20 mx-auto mb-5" />

                <h1 className="text-4xl md:text-5xl font-black">

                  Spark Quest CMS

                </h1>

                <p className="mt-3 text-lg opacity-90">

                  Manage the complete
                  Spark Quest Festival
                  from one centralized
                  enterprise dashboard.

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
                y: -4,
              }}
              className="stats bg-base-100 border border-base-300 shadow"
            >

              <div className="stat">

                <div className="stat-title">

                  Why Cards

                </div>

                <div className="stat-value text-primary">

                  {stats.whyCards}

                </div>

              </div>

            </motion.div>

            <motion.div
              whileHover={{
                y: -4,
              }}
              className="stats bg-base-100 border border-base-300 shadow"
            >

              <div className="stat">

                <div className="stat-title">

                  Event Date

                </div>

                <div className="stat-value text-success text-lg">

                  {stats.hasDates
                    ? "Configured"
                    : "Pending"}

                </div>

              </div>

            </motion.div>

            <motion.div
              whileHover={{
                y: -4,
              }}
              className="stats bg-base-100 border border-base-300 shadow"
            >

              <div className="stat">

                <div className="stat-title">

                  Venue

                </div>

                <div className="stat-value text-error text-lg">

                  {stats.hasVenue
                    ? "Available"
                    : "Missing"}

                </div>

              </div>

            </motion.div>

            <motion.div
              whileHover={{
                y: -4,
              }}
              className="stats bg-base-100 border border-base-300 shadow"
            >

              <div className="stat">

                <div className="stat-title">

                  Registration

                </div>

                <div className="stat-value text-info text-lg">

                  {stats.hasRegister
                    ? "Ready"
                    : "Missing"}

                </div>

              </div>

            </motion.div>

          </div>

          {/* ==========================================================
              MAIN GRID
          ========================================================== */}

          <div className="grid xl:grid-cols-[1.6fr_1fr] gap-6">

            <div className="card bg-base-100 border border-base-300 shadow-xl">

              <div className="card-body">

                <div className="flex items-center justify-between mb-6">

                  <div>

                    <h2 className="text-2xl font-black">

                      Event Information

                    </h2>

                    <p className="text-base-content/70">

                      Configure the main details of the Spark Quest event.

                    </p>

                  </div>

                  <div className="badge badge-primary badge-lg">

                    Single Record CMS

                  </div>

                </div>

                {/* ==========================================
                    HERO INFORMATION
                ========================================== */}

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
                      placeholder="Annual Technical Festival"
                      className="input input-bordered w-full"
                    />

                  </div>

                  <div className="form-control md:col-span-2">

  <label className="label">

    <span className="label-text font-semibold">

      Hero Image

    </span>

  </label>

  <input
    type="file"
    accept="image/*"
    onChange={handleHeroImage}
    className="file-input file-input-bordered w-full"
  />

  {form.heroImagePreview && (
  <img
    src={form.heroImagePreview}
    alt="Hero Preview"
    className="mt-4 h-56 w-full rounded-xl object-cover"
  />
)}

</div>

                </div>

                {/* ==========================================
                    EVENT DATES
                ========================================== */}

                <div className="divider">

                  Event Schedule

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  <div className="form-control">

                    <label className="label">

                      <span className="label-text font-semibold">

                        Start Date

                      </span>

                    </label>

                    <input
                      type="date"
                      name="startDate"
                      value={form.startDate || ""}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                    />

                  </div>

                  <div className="form-control">

                    <label className="label">

                      <span className="label-text font-semibold">

                        End Date

                      </span>

                    </label>

                    <input
                      type="date"
                      name="endDate"
                      value={form.endDate || ""}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                    />

                  </div>

                </div>

                {/* ==========================================
                    VENUE
                ========================================== */}

                <div className="divider">

                  Venue Information

                </div>

                <div className="form-control">

                  <label className="label">

                    <span className="label-text font-semibold">

                      Event Venue

                    </span>

                  </label>

                  <input
                    type="text"
                    name="eventVenue"
                    value={form.eventVenue}
                    onChange={handleChange}
                    placeholder="College Auditorium"
                    className="input input-bordered w-full"
                  />

                </div>

                {/* ==========================================
                    REGISTRATION LINK
                ========================================== */}

                <div className="form-control mt-5">

                  <label className="label">

                    <span className="label-text font-semibold">

                      Registration Link

                    </span>

                  </label>

                  <input
                    type="url"
                    name="registerLink"
                    value={form.registerLink}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="input input-bordered w-full"
                  />

                  <label className="label">

                    <span className="label-text-alt text-base-content/60">

                      Students will be redirected here when they click
                      "Register Now".

                    </span>

                  </label>

                </div>

                
                                {/* ==========================================================
                    ABOUT SPARK QUEST
                ========================================================== */}

                <div className="divider">

                  About Spark Quest

                </div>

                <div className="form-control">

                  <label className="label">

                    <span className="label-text font-semibold">

                      About the Event

                    </span>

                  </label>

                  <textarea
                    name="about"
                    value={form.about}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Write a brief overview of Spark Quest..."
                    className="textarea textarea-bordered w-full"
                  />

                </div>

                {/* ==========================================================
                    EVENT CATEGORIES
                ========================================================== */}

                <div className="divider">

                  Event Categories

                </div>

                {/* =========================
                    Hackathons
                ========================== */}

                <div className="form-control">

                  <label className="label">

                    <span className="label-text font-semibold">

                      Hackathons

                    </span>

                  </label>

                  <textarea
                    name="hackathons"
                    value={form.hackathons}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe hackathon competitions..."
                    className="textarea textarea-bordered w-full"
                  />

                </div>

                {/* =========================
                    Robotics & Drones
                ========================== */}

                <div className="form-control mt-5">

                  <label className="label">

                    <span className="label-text font-semibold">

                      Robotics & Drones

                    </span>

                  </label>

                  <textarea
                    name="roboticsDrones"
                    value={form.roboticsDrones}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe robotics and drone events..."
                    className="textarea textarea-bordered w-full"
                  />

                </div>

                {/* =========================
                    Gaming Arena
                ========================== */}

                <div className="form-control mt-5">

                  <label className="label">

                    <span className="label-text font-semibold">

                      Gaming Arena

                    </span>

                  </label>

                  <textarea
                    name="gamingArena"
                    value={form.gamingArena}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe gaming competitions..."
                    className="textarea textarea-bordered w-full"
                  />

                </div>

                {/* =========================
                    Tech Talks
                ========================== */}

                <div className="form-control mt-5">

                  <label className="label">

                    <span className="label-text font-semibold">

                      Tech Talks

                    </span>

                  </label>

                  <textarea
                    name="techTalks"
                    value={form.techTalks}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe keynote sessions and technical talks..."
                    className="textarea textarea-bordered w-full"
                  />

                </div>

                
                                {/* ==========================================================
                    WHY PARTICIPATE
                ========================================================== */}

                <div className="divider">

                  Why Participate

                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                  <div>

                    <h3 className="text-xl font-black">

                      Why Participate Cards

                    </h3>

                    <p className="text-base-content/70">

                      Showcase the key reasons students should join Spark Quest.

                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={addWhyCard}
                    className="btn btn-primary"
                  >

                    Add Card

                  </button>

                </div>

                <div className="
                  space-y-6
                  max-h-[75vh]
                  overflow-y-auto
                  pr-2
                ">

                  {form.whyParticipate?.map(
                    (
                      card,
                      index
                    ) => (

                      <motion.div
                        key={index}
                        whileHover={{
                          y: -3,
                        }}
                        className="card bg-base-200 border border-base-300 shadow-md"
                      >

                        <div className="card-body">

                          <div className="grid lg:grid-cols-2 gap-5">

                            {/* Card Title */}

                            <div className="form-control">

                              <label className="label">

                                <span className="label-text font-semibold">

                                  Card Title

                                </span>

                              </label>

                              <input
                                type="text"
                                value={card.title}
                                onChange={(e) =>
                                  updateWhyCard(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                placeholder="Innovation Challenge"
                                className="input input-bordered w-full"
                              />

                            </div>

                            {/* Image URL */}

                            <div className="form-control">

                              <label className="label">

                                <span className="label-text font-semibold">

                                  Image / GIF URL

                                </span>

                              </label>

                              <input
                                type="text"
                                value={card.image}
                                onChange={(e) =>
                                  updateWhyCard(
                                    index,
                                    "image",
                                    e.target.value
                                  )
                                }
                                placeholder="https://..."
                                className="input input-bordered w-full"
                              />

                            </div>

                          </div>

                          {/* ==========================================================
                              IMAGE PREVIEW
                          ========================================================== */}

                          {card.image && (

                            <motion.div
                              initial={{
                                opacity: 0,
                              }}
                              animate={{
                                opacity: 1,
                              }}
                              className="mt-5 overflow-hidden rounded-2xl border border-base-300"
                            >

                              <img
                                src={card.image}
                                alt={
                                  card.title ||
                                  "Preview"
                                }
                                className="w-full h-56 object-cover"
                              />

                            </motion.div>

                          )}

                          {/* ==========================================================
                              REMOVE BUTTON
                          ========================================================== */}

                          <div className="flex justify-end mt-5">

                            <button
                              type="button"
                              onClick={() =>
                                removeWhyCard(
                                  index
                                )
                              }
                              disabled={
                                form.whyParticipate.length === 1
                              }
                              className="btn btn-error btn-sm"
                            >

                              Remove Card

                            </button>

                          </div>

                        </div>

                      </motion.div>

                    )
                  )}

                </div>

               
                                {/* ==========================================================
                    ACTIONS
                ========================================================== */}

                <div className="divider">

                  Actions

                </div>

                <div className="flex flex-wrap justify-end gap-3">

                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={saving}
                    className="btn btn-outline"
                  >

                    Reset

                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={saving}
                    className="btn btn-error"
                  >

                    Delete All

                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary"
                  >

                    {saving
                      ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>

                          Saving...

                        </>
                      )
                      : (
                        "Save Changes"
                      )}

                  </button>

                </div>

              </div>

            </div>

            {/* ==========================================================
                LIVE PREVIEW
            ========================================================== */}

            <div
              className="
                card
                bg-base-100
                border
                border-base-300
                shadow-xl
                sticky
                top-6
                h-[90vh]
                overflow-hidden
              "
            >

              <div
                  className="
                    card-body
                    overflow-y-auto
                    scrollbar-custom
                  "
                >

                <h2 className="text-2xl font-black mb-6">

                  Live Preview

                </h2>

                {/* ==========================================
                    HERO PREVIEW
                ========================================== */}

                <div
                  className="
                    rounded-3xl
                    p-8
                    bg-linear-to-br
                    from-primary
                    via-secondary
                    to-accent
                    text-primary-content
                  "
                >

                  <h1 className="text-4xl font-black">

                    SPARK QUEST

                  </h1>

                  <p className="mt-3 text-primary-content/90">

                    {form.heroSubtitle ||
                      "Annual Technical Festival"}

                  </p>

                  <div className="divider divider-neutral before:bg-white/20 after:bg-white/20 my-6"></div>

                  <div className="space-y-3">

                    <div className="flex items-center gap-3">

                      <CalendarDaysIcon className="h-5 w-5" />

                      <span>

                        {form.startDate
                          ? `${formatDate(
                              form.startDate
                            )} → ${formatDate(
                              form.endDate
                            )}`
                          : "Date Not Configured"}

                      </span>

                    </div>

                    <div className="flex items-center gap-3">

                      <MapPinIcon className="h-5 w-5" />

                      <span>

                        {form.eventVenue ||
                          "Venue Not Configured"}

                      </span>

                    </div>

                    <div className="flex items-center gap-3">

                      <LinkIcon className="h-5 w-5" />

                      <span className="truncate">

                        {form.registerLink ||
                          "Registration Link Not Configured"}

                      </span>

                    </div>

                  </div>

                </div>

                {/* ==========================================================
                    ABOUT PREVIEW
                ========================================================== */}

               <div className="mt-8">

  <h3 className="font-bold text-xl mb-3">

    About

  </h3>

  <div
    className="
      rounded-2xl
      border
      border-base-300
      bg-base-200
      p-6
      h-72
      overflow-y-auto
    "
  >

    <p className="whitespace-pre-wrap leading-8">

      {form.about ||

        "No description available."}

    </p>

  </div>

</div>

             
                                {/* ==========================================================
                    WHY PARTICIPATE PREVIEW
                ========================================================== */}

                {form.whyParticipate?.length > 0 && (

                  <div className="mt-8">

                    <h3 className="text-xl font-black mb-4">

                      Why Participate

                    </h3>

                    <div
                        className="
                          grid
                          grid-cols-2
                          gap-4
                          max-h-72
                          overflow-y-auto
                          pr-2
                          scrollbar-custom
                        "
                      >

                      {form.whyParticipate
                        .slice(0, 4)
                        .map(
                          (
                            card,
                            index
                          ) => (

                            <motion.div
                              key={index}
                              whileHover={{
                                y: -3,
                                scale: 1.02,
                              }}
                              className="
                                card
                                bg-base-200
                                border
                                border-base-300
                                shadow
                              "
                            >

                              <div className="card-body p-3">

                                {card.image ? (

                                  <img
                                    src={card.image}
                                    alt={
                                      card.title
                                    }
                                    className="
                                      w-full
                                      h-24
                                      rounded-xl
                                      object-cover
                                    "
                                  />

                                ) : (

                                  <div
                                    className="
                                      w-full
                                      h-24
                                      rounded-xl
                                      bg-base-300
                                      flex
                                      items-center
                                      justify-center
                                      text-base-content/40
                                      text-sm
                                    "
                                  >

                                    No Image

                                  </div>

                                )}

                                <h4 className="text-sm font-bold text-center mt-2 line-clamp-2">

                                  {card.title ||
                                    "Card Title"}

                                </h4>

                              </div>

                            </motion.div>

                          )
                        )}

                    </div>

                  </div>

                )}

                {/* ==========================================================
                    REGISTER BUTTON PREVIEW
                ========================================================== */}

                <a
                  href={
                    form.registerLink ||
                    "#"
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="
                    btn
                    btn-warning
                    w-full
                    mt-8
                  "
                >

                  Register Now

                </a>

                {/* ==========================================================
                    LIVE STATUS
                ========================================================== */}

                <div className="alert alert-info mt-6">

                  <RocketLaunchIcon className="h-5 w-5" />

                  <div>

                    <h3 className="font-bold">

                      Live Preview Enabled

                    </h3>

                    <div className="text-xs">

                      Changes made in the CMS
                      are reflected instantly
                      in this preview panel.

                    </div>

                  </div>

                </div>

                {/* ==========================================================
                    DASHBOARD SUMMARY
                ========================================================== */}

                <div className="stats stats-vertical shadow mt-6 w-full">

                  <div className="stat">

                    <div className="stat-title">

                      Why Participate Cards

                    </div>

                    <div className="stat-value text-primary">

                      {stats.whyCards}

                    </div>

                  </div>

                  <div className="stat">

                    <div className="stat-title">

                      Event Date

                    </div>

                    <div className="stat-value text-success text-lg">

                      {stats.hasDates
                        ? "Configured"
                        : "Pending"}

                    </div>

                  </div>

                  <div className="stat">

                    <div className="stat-title">

                      Registration

                    </div>

                    <div className="stat-value text-info text-lg">

                      {stats.hasRegister
                        ? "Available"
                        : "Missing"}

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

      
                    {/* ==========================================================
              STICKY FOOTER
          ========================================================== */}

          <div className="sticky bottom-4 z-30 mt-8">

            <div className="card bg-base-100 border border-base-300 shadow-2xl">

              <div className="card-body py-4">

                <div className="flex flex-wrap justify-end gap-3">

                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={saving}
                    className="btn btn-outline"
                  >

                    Reset

                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={saving}
                    className="btn btn-error"
                  >

                    Delete All

                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary"
                  >

                    {saving ? (

                      <>

                        <span className="loading loading-spinner loading-sm"></span>

                        Saving...

                      </>

                    ) : (

                      "Save Changes"

                    )}

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </motion.div>

    </>

  );

}