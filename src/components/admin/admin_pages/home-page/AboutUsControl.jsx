import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";

import {
  FaUniversity,
  FaImage,
  FaUserTie,
  FaEye,
  FaSave,
  FaTrash,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";

import api from "../../../../services/api";


import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";

import {
  validateUpload,
} from "../../../../utils/validateUpload";

import { previewFile } from "../../../../utils/previewFile";
import {cleanupBlobUrl } from "../../../../utils/blobCleanup";


export default function AboutUsControl() {

  /* ==========================================================
      INITIAL FORM
  ========================================================== */

  const initialForm = {
    heroTitle: "",
    heroDescription: "",

    campusImage: "",
    campusTitle: "",
    campusDescription1: "",
    campusDescription2: "",

    visionTitle: "",
    visionDescription1: "",
    visionDescription2: "",

    principalImage: "",
    principalName: "",
    principalDesignation: "",
    principalQuote: "",
    principalMessage: "",

    closingMessage: "",
  };

  /* ==========================================================
      STATES
  ========================================================== */

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [exists, setExists] =
    useState(false);

  const [formData, setFormData] =
    useState(initialForm);

  /* ==========================================================
      IMAGE PREVIEWS
  ========================================================== */

  const [
    campusPreview,
    setCampusPreview,
  ] = useState("");

  const [
    principalPreview,
    setPrincipalPreview,
  ] = useState("");

  /* ==========================================================
      EXISTING IMAGES
  ========================================================== */

  const [
    existingCampusImage,
    setExistingCampusImage,
  ] = useState("");

  const [
    existingPrincipalImage,
    setExistingPrincipalImage,
  ] = useState("");

  /* ==========================================================
      STATUS MODAL
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

  /* ==========================================================
      DELETE MODAL
  ========================================================== */

  const [
    deleteModal,
    setDeleteModal,
  ] = useState(false);

  /* ==========================================================
      DASHBOARD STATS
  ========================================================== */

  const stats = useMemo(
    () => ({
      sections: 5,

      campus:
        campusPreview ||
        existingCampusImage,

      principal:
        !!formData.principalName,

      live: exists,
    }),

    [
      campusPreview,
      existingCampusImage,
      formData.principalName,
      exists,
    ]
  );

 
    /* ==========================================================
      FETCH ABOUT US
  ========================================================== */

  const fetchAbout = async () => {
    try {
      setLoading(true);

      const { data } =
        await api.get("/about-us");

      const about =
        data.data || {};

      if (
        Object.keys(about).length
      ) {
        setExists(true);

        setFormData({
          heroTitle:
            about.heroTitle || "",

          heroDescription:
            about.heroDescription ||
            "",

          campusImage:
            about.campusImage || "",

          campusTitle:
            about.campusTitle || "",

          campusDescription1:
            about.campusDescription1 ||
            "",

          campusDescription2:
            about.campusDescription2 ||
            "",

          visionTitle:
            about.visionTitle || "",

          visionDescription1:
            about.visionDescription1 ||
            "",

          visionDescription2:
            about.visionDescription2 ||
            "",

          principalImage:
            about.principalImage || "",

          principalName:
            about.principalName || "",

          principalDesignation:
            about.principalDesignation ||
            "",

          principalQuote:
            about.principalQuote || "",

          principalMessage:
            about.principalMessage ||
            "",

          closingMessage:
            about.closingMessage || "",
        });

        setExistingCampusImage(
          about.campusImage || ""
        );

        setExistingPrincipalImage(
          about.principalImage || ""
        );

      } else {

        resetForm();

      }

    } catch (error) {

      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message:
          error.response?.data
            ?.message ||
          "Failed to load About Us.",
      });

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  useEffect(() => {
    return () => {
      cleanupBlobUrl(
        campusPreview
      );

      cleanupBlobUrl(
        principalPreview
      );
    };
  }, [
    campusPreview,
    principalPreview,
  ]);

  /* ==========================================================
      INPUT CHANGE
  ========================================================== */

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

  /* ==========================================================
      CAMPUS IMAGE
  ========================================================== */

  const handleCampusImage =
    (e) => {

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

      cleanupBlobUrl(
        campusPreview
      );

      const preview =
        previewFile(file);

      setCampusPreview(
        preview.preview
      );

      setFormData((prev) => ({
        ...prev,
        campusImage: file,
      }));
    };

  /* ==========================================================
      PRINCIPAL IMAGE
  ========================================================== */

  const handlePrincipalImage =
    (e) => {

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

      cleanupBlobUrl(
        principalPreview
      );

      const preview =
        previewFile(file);

      setPrincipalPreview(
        preview.preview
      );

      setFormData((prev) => ({
        ...prev,
        principalImage: file,
      }));
    };

  /* ==========================================================
      RESET FORM
  ========================================================== */

  const resetForm = () => {

    cleanupBlobUrl(
      campusPreview
    );

    cleanupBlobUrl(
      principalPreview
    );

    setCampusPreview("");

    setPrincipalPreview("");

    setExistingCampusImage("");

    setExistingPrincipalImage("");

    setExists(false);

    setFormData(
      initialForm
    );
  };


    /* ==========================================================
      CREATE / UPDATE
  ========================================================== */

  const handleSubmit = async (
    e
  ) => {
    if (e) e.preventDefault();

    try {
      setSaving(true);

      const payload =
        new FormData();

      Object.entries(
        formData
      ).forEach(
        ([key, value]) => {
          if (
            value !==
              undefined &&
            value !== null &&
            value !== ""
          ) {
            payload.append(
              key,
              value
            );
          }
        }
      );

      if (exists) {
        await api.put(
          "/about-us",
          payload
        );
      } else {
        await api.post(
          "/about-us",
          payload
        );
      }

      await fetchAbout();

      setStatusModal({
        isOpen: true,
        type: "success",
        title: "Success",
        message: exists
          ? "About Us updated successfully."
          : "About Us created successfully.",
      });

    } catch (error) {

      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message:
          error.response?.data
            ?.message ||
          "Failed to save About Us.",
      });

    } finally {

      setSaving(false);

    }
  };

  /* ==========================================================
      DELETE
  ========================================================== */

  const handleDelete =
    async () => {

      try {

        setSaving(true);

        await api.delete(
          "/about-us"
        );

        resetForm();

        setDeleteModal(
          false
        );

        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Deleted",
          message:
            "About Us deleted successfully.",
        });

      } catch (error) {

        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Error",
          message:
            error.response?.data
              ?.message ||
            "Delete failed.",
        });

      } finally {

        setSaving(false);

      }

    };

  /* ==========================================================
      JSX
  ========================================================== */

  return (
    <>

      <LoadingModal
        isOpen={
          loading ||
          saving
        }
        title={
          saving
            ? "Saving About Us"
            : "Loading About Us"
        }
        message={
          saving
            ? "Please wait..."
            : "Fetching About Us..."
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
          deleteModal
        }
        itemName="About Us Page"
        onConfirm={
          handleDelete
        }
        onCancel={() =>
          setDeleteModal(
            false
          )
        }
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="space-y-8"
      >

       
                {/* ==========================================================
            HERO HEADER
        ========================================================== */}

        <div className="hero rounded-3xl bg-linear-to-r from-primary to-secondary text-primary-content shadow-2xl">

          <div className="hero-content w-full flex-col lg:flex-row justify-between py-10">

            <div>

              <h1 className="text-5xl font-black flex items-center gap-4">

                <FaUniversity />

                About Us CMS

              </h1>

              <p className="mt-4 max-w-3xl text-lg opacity-90">

                Manage institutional profile,
                campus information, vision,
                principal message and About Us
                content from one place.

              </p>

            </div>

            <div className="badge badge-lg badge-primary">

              {exists
                ? "LIVE"
                : "NOT CREATED"}

            </div>

          </div>

        </div>

        {/* ==========================================================
            DASHBOARD
        ========================================================== */}

        <div className="grid gap-6 md:grid-cols-4">

          <motion.div
            whileHover={{
              y: -4,
            }}
            className="card bg-base-100 border border-base-300 shadow-xl"
          >

            <div className="card-body">

              <p className="text-base-content/60">

                Sections

              </p>

              <h2 className="text-4xl font-black text-primary">

                {stats.sections}

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

                Campus Image

              </p>

              <h2 className="text-4xl font-black text-success">

                {stats.campus
                  ? "✓"
                  : "0"}

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

                Principal

              </p>

              <h2 className="text-4xl font-black text-info">

                {stats.principal
                  ? "✓"
                  : "0"}

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

                Status

              </p>

              <h2 className="text-4xl font-black text-warning">

                {stats.live
                  ? "LIVE"
                  : "EMPTY"}

              </h2>

            </div>

          </motion.div>

        </div>

        {/* ==========================================================
            MAIN GRID
        ========================================================== */}

        <div className="grid gap-8 xl:grid-cols-5">

          {/* ==========================================================
              LEFT PANEL
          ========================================================== */}

          <div className="xl:col-span-3">

            {/* ==========================================================
                HERO INFORMATION
            ========================================================== */}

            <div className="card bg-base-100 border border-base-300 shadow-xl">

              <div className="card-body">

                <h2 className="card-title text-3xl">

                  Hero Information

                </h2>

                <p className="text-base-content/60">

                  Configure the About Us hero
                  section displayed on the website.

                </p>

                <div className="space-y-5 mt-6">

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Hero Title

                      </span>

                    </label>

                    <input
                      type="text"
                      name="heroTitle"
                      value={formData.heroTitle}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="About Our Institution"
                    />

                  </div>

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Hero Description

                      </span>

                    </label>

                    <textarea
                      rows={5}
                      name="heroDescription"
                      value={formData.heroDescription}
                      onChange={handleChange}
                      className="textarea textarea-bordered w-full"
                      placeholder="Write the introduction..."
                    />

                  </div>

                </div>

              </div>

            </div>

          
                        {/* ==========================================================
                CAMPUS INFORMATION
            ========================================================== */}

            <div className="card bg-base-100 border border-base-300 shadow-xl mt-8">

              <div className="card-body">

                <h2 className="card-title text-3xl">

                  Campus Information

                </h2>

                <p className="text-base-content/60">

                  Showcase your campus and
                  institutional environment.

                </p>

                <div className="space-y-6 mt-6">

                  {/* CAMPUS IMAGE */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Campus Image

                      </span>

                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      className="file-input file-input-bordered w-full"
                      onChange={handleCampusImage}
                    />

                  </div>

                  {/* IMAGE PREVIEW */}

                  {(campusPreview ||
                    existingCampusImage) && (

                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0.95,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      className="relative overflow-hidden rounded-2xl border border-base-300"
                    >

                      <img
                        src={
                          campusPreview ||
                          existingCampusImage
                        }
                        alt="Campus Preview"
                        className="w-full h-72 object-cover"
                      />

                      <button
                        type="button"
                        className="btn btn-error btn-circle btn-sm absolute top-4 right-4"
                        onClick={() => {

                          cleanupBlobUrl(
                            campusPreview
                          );

                          setCampusPreview("");

                          setExistingCampusImage("");

                          setFormData(
                            (prev) => ({
                              ...prev,
                              campusImage: "",
                            })
                          );

                        }}
                      >

                        <FaTrash />

                      </button>

                    </motion.div>

                  )}

                  {/* CAMPUS TITLE */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Campus Title

                      </span>

                    </label>

                    <input
                      type="text"
                      name="campusTitle"
                      value={
                        formData.campusTitle
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Our Beautiful Campus"
                      className="input input-bordered w-full"
                    />

                  </div>

                  
                                    {/* CAMPUS DESCRIPTION 1 */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Campus Description 1

                      </span>

                    </label>

                    <textarea
                      rows={4}
                      name="campusDescription1"
                      value={
                        formData.campusDescription1
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Describe your campus, infrastructure and learning environment..."
                      className="textarea textarea-bordered w-full"
                    />

                  </div>

                  {/* CAMPUS DESCRIPTION 2 */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Campus Description 2

                      </span>

                    </label>

                    <textarea
                      rows={4}
                      name="campusDescription2"
                      value={
                        formData.campusDescription2
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Additional campus facilities and student life..."
                      className="textarea textarea-bordered w-full"
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* ==========================================================
                VISION INFORMATION
            ========================================================== */}

            <div className="card bg-base-100 border border-base-300 shadow-xl mt-8">

              <div className="card-body">

                <h2 className="card-title text-3xl">

                  Vision Information

                </h2>

                <p className="text-base-content/60">

                  Define your institution's
                  vision and long-term goals.

                </p>

                <div className="space-y-5 mt-6">

                  {/* VISION TITLE */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Vision Title

                      </span>

                    </label>

                    <input
                      type="text"
                      name="visionTitle"
                      value={
                        formData.visionTitle
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Our Vision"
                      className="input input-bordered w-full"
                    />

                  </div>

                  {/* VISION DESCRIPTION 1 */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Vision Description 1

                      </span>

                    </label>

                    <textarea
                      rows={4}
                      name="visionDescription1"
                      value={
                        formData.visionDescription1
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Primary vision statement..."
                      className="textarea textarea-bordered w-full"
                    />

                  </div>

                  {/* VISION DESCRIPTION 2 */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Vision Description 2

                      </span>

                    </label>

                    <textarea
                      rows={4}
                      name="visionDescription2"
                      value={
                        formData.visionDescription2
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Additional vision statement..."
                      className="textarea textarea-bordered w-full"
                    />

                  </div>

                </div>

              </div>

            </div>

           
                        {/* ==========================================================
                PRINCIPAL INFORMATION
            ========================================================== */}

            <div className="card bg-base-100 border border-base-300 shadow-xl mt-8">

              <div className="card-body">

                <h2 className="card-title text-3xl">

                  Principal Information

                </h2>

                <p className="text-base-content/60">

                  Manage the principal profile,
                  leadership message and institutional
                  vision.

                </p>

                <div className="space-y-6 mt-6">

                  {/* PRINCIPAL IMAGE */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Principal Image

                      </span>

                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      className="file-input file-input-bordered w-full"
                      onChange={handlePrincipalImage}
                    />

                  </div>

                  {/* IMAGE PREVIEW */}

                  {(principalPreview ||
                    existingPrincipalImage) && (

                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0.95,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      className="flex justify-center"
                    >

                      <div className="relative">

                        <img
                          src={
                            principalPreview ||
                            existingPrincipalImage
                          }
                          alt="Principal Preview"
                          className="w-52 h-60 rounded-3xl object-cover border border-base-300 shadow-lg"
                        />

                        <button
                          type="button"
                          className="btn btn-error btn-circle btn-sm absolute top-3 right-3"
                          onClick={() => {

                            cleanupBlobUrl(
                              principalPreview
                            );

                            setPrincipalPreview("");

                            setExistingPrincipalImage("");

                            setFormData(
                              (prev) => ({
                                ...prev,
                                principalImage: "",
                              })
                            );

                          }}
                        >

                          <FaTrash />

                        </button>

                      </div>

                    </motion.div>

                  )}

                  {/* PRINCIPAL NAME */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Principal Name

                      </span>

                    </label>

                    <input
                      type="text"
                      name="principalName"
                      value={
                        formData.principalName
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Dr. John Doe"
                      className="input input-bordered w-full"
                    />

                  </div>

                  {/* DESIGNATION */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Designation

                      </span>

                    </label>

                    <input
                      type="text"
                      name="principalDesignation"
                      value={
                        formData.principalDesignation
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Principal"
                      className="input input-bordered w-full"
                    />

                  </div>

                  {/* QUOTE */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Principal Quote

                      </span>

                    </label>

                    <textarea
                      rows={3}
                      name="principalQuote"
                      value={
                        formData.principalQuote
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Inspirational quote..."
                      className="textarea textarea-bordered w-full"
                    />

                  </div>

                  {/* MESSAGE */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Principal Message

                      </span>

                    </label>

                    <textarea
                      rows={8}
                      name="principalMessage"
                      value={
                        formData.principalMessage
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Principal message..."
                      className="textarea textarea-bordered w-full"
                    />

                  </div>

                  {/* CLOSING MESSAGE */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Closing Message

                      </span>

                    </label>

                    <textarea
                      rows={4}
                      name="closingMessage"
                      value={
                        formData.closingMessage
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Final institutional message..."
                      className="textarea textarea-bordered w-full"
                    />

                  </div>

                </div>

              </div>

            </div>

          </div>

          
                    {/* ==========================================================
              RIGHT PANEL
          ========================================================== */}

          <div className="xl:col-span-2">

            <div className="sticky top-6">

              <div className="card bg-base-100 border border-base-300 shadow-xl">

                <div className="card-body">

                  <div className="flex items-center gap-3 mb-6">

                    <FaEye className="text-primary text-2xl" />

                    <div>

                      <h2 className="card-title text-2xl">

                        Live Preview

                      </h2>

                      <p className="text-base-content/60">

                        Website Preview

                      </p>

                    </div>

                  </div>

                  {/* ==========================================================
                      HERO PREVIEW
                  ========================================================== */}

                  <div className="rounded-3xl overflow-hidden bg-linear-to-r from-primary to-secondary text-primary-content p-8">

                    <h1 className="text-4xl font-black">

                      {formData.heroTitle ||
                        "About Our Institution"}

                    </h1>

                    <p className="mt-5 leading-relaxed opacity-90">

                      {formData.heroDescription ||
                        "Hero description preview..."}

                    </p>

                  </div>

                  {/* ==========================================================
                      CAMPUS PREVIEW
                  ========================================================== */}

                  {(campusPreview ||
                    existingCampusImage) && (

                    <div className="card bg-base-200 mt-8 shadow">

                      <figure>

                        <img
                          src={
                            campusPreview ||
                            existingCampusImage
                          }
                          alt="Campus"
                          className="w-full h-64 object-cover"
                        />

                      </figure>

                      <div className="card-body">

                        <h3 className="card-title">

                          {formData.campusTitle ||
                            "Campus Title"}

                        </h3>

                        <p>

                          {formData.campusDescription1 ||
                            "Campus description preview..."}

                        </p>

                        {formData.campusDescription2 && (

                          <p>

                            {
                              formData.campusDescription2
                            }

                          </p>

                        )}

                      </div>

                    </div>

                  )}

               
                                    {/* ==========================================================
                      VISION PREVIEW
                  ========================================================== */}

                  <div className="card bg-base-200 mt-8 shadow">

                    <div className="card-body">

                      <h3 className="card-title text-primary">

                        {formData.visionTitle ||
                          "Our Vision"}

                      </h3>

                      <p>

                        {formData.visionDescription1 ||
                          "Vision description preview..."}

                      </p>

                      {formData.visionDescription2 && (

                        <p>

                          {formData.visionDescription2}

                        </p>

                      )}

                    </div>

                  </div>

                  {/* ==========================================================
                      PRINCIPAL PREVIEW
                  ========================================================== */}

                  <div className="card bg-base-200 mt-8 shadow">

                    <div className="card-body">

                      <div className="flex flex-col items-center text-center">

                        {(principalPreview ||
                          existingPrincipalImage) && (

                          <div className="avatar mb-5">

                            <div className="w-40 rounded-3xl border border-base-300">

                              <img
                                src={
                                  principalPreview ||
                                  existingPrincipalImage
                                }
                                alt="Principal"
                              />

                            </div>

                          </div>

                        )}

                        <h3 className="text-2xl font-black">

                          {formData.principalName ||
                            "Principal Name"}

                        </h3>

                        <p className="text-primary font-semibold mt-2">

                          {formData.principalDesignation ||
                            "Principal"}

                        </p>

                      </div>

                      {formData.principalQuote && (

                        <div className="alert alert-info mt-6">

                          <FaInfoCircle />

                          <span>

                            "{formData.principalQuote}"

                          </span>

                        </div>

                      )}

                      {formData.principalMessage && (

                        <p className="mt-6 leading-relaxed">

                          {formData.principalMessage}

                        </p>

                      )}

                    </div>

                  </div>

                  {/* ==========================================================
                      CLOSING MESSAGE
                  ========================================================== */}

                  {formData.closingMessage && (

                    <div className="alert alert-success mt-8">

                      <FaCheckCircle />

                      <span>

                        {formData.closingMessage}

                      </span>

                    </div>

                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ==========================================================
            STICKY ACTION BAR
        ========================================================== */}

        <div className="sticky bottom-5 z-40">

          <div className="card bg-base-100 border border-base-300 shadow-2xl">

            <div className="card-body">

              <div className="flex flex-wrap justify-end gap-3">

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
                  disabled={!exists}
                  onClick={() =>
                    setDeleteModal(true)
                  }
                >

                  <FaTrash />

                  Delete

                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={saving}
                  onClick={handleSubmit}
                >

                  <FaSave />

                  {exists
                    ? "Update About Us"
                    : "Create About Us"}

                </button>

              </div>

            </div>

          </div>

        </div>

      </motion.div>

    </>

  );

}