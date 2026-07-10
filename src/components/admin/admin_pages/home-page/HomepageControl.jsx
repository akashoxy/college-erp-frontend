import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaHome,
  FaImage,
  FaSave,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

import api from "../../../../services/api";

import {
  LoadingModal,
  StatusModal,
  DeleteModal,
  ConfirmModal,
} from "../../../../components/modals";

import { validateUpload } from "../../../../utils/validateUpload";
import { previewFile } from "../../../../utils/previewFile";
import { cleanupBlobUrl } from "../../../../utils/blobCleanup";

import {
  TITLES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../../../../utils/uploadMessages";

export default function HomepageControl() {
  /* ===========================
      STATES
  =========================== */

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [homepage, setHomepage] = useState({
    _id: "",
    address: "",
    admissionText: "",
    slides: [],
  });

  const [slideForm, setSlideForm] = useState({
    image: "",
    publicId: "",
    fileType: "image",
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
  });

  const [preview, setPreview] = useState("");

  /* ===========================
      STATUS MODAL
  =========================== */

  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  /* ===========================
      DELETE MODAL
  =========================== */

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    index: null,
    itemName: "",
  });

  /* ===========================
      DELETE ALL MODAL
  =========================== */

  const [deleteAllModal, setDeleteAllModal] =
    useState(false);

  /* ===========================
      FETCH HOMEPAGE
  =========================== */

  const fetchHomepage = async () => {
    try {
      setLoading(true);

      const { data } =
        await api.get("/homepage");

      const homepageData =
        data.data || {};

      setHomepage({
        _id: homepageData._id || "",
        address:
          homepageData.address || "",
        admissionText:
          homepageData.admissionText ||
          "",
        slides:
          homepageData.slides || [],
      });
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
    fetchHomepage();
  }, []);

  useEffect(() => {
    return () => cleanupBlobUrl(preview);
  }, [preview]);

  /* ===========================
      INPUTS
  =========================== */

  const handleHomepageChange = (e) => {
    setHomepage((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const handleSlideChange = (e) => {
    setSlideForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  /* ===========================
      IMAGE UPLOAD
  =========================== */

  const handleFileUpload = async (
    e
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const validation =
      validateUpload(file, {
        allowImages: true,
      });

    if (!validation.valid) {
      return setStatusModal({
        isOpen: true,
        type: "error",
        title: TITLES.ERROR,
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

    try {
      setUploading(true);

      const formData =
        new FormData();

      formData.append(
        "image",
        file
      );

      const { data } =
        await api.post(
          "/homepage/upload-slider",
          formData
        );

      setSlideForm((prev) => ({
        ...prev,
        image:
          data.data.image.url,
        publicId:
          data.data.image.publicId,
        fileType: "image",
      }));
    } catch (error) {
      setStatusModal({
        isOpen: true,
        type: "error",
        title: TITLES.ERROR,
        message:
          error.response?.data?.message ||
          ERROR_MESSAGES.UPLOAD,
      });
    } finally {
      setUploading(false);
    }
  };

  /* ===========================
      CONTINUE IN PART 1A-2
  =========================== */
    /* ===========================
      ADD SLIDE
  =========================== */

  const addSlide = () => {
    if (!slideForm.image.trim()) {
      return setStatusModal({
        isOpen: true,
        type: "warning",
        title: TITLES.WARNING,
        message: "Please upload a slide image.",
      });
    }

    setHomepage((prev) => ({
      ...prev,
      slides: [
        ...prev.slides,
        {
          image: slideForm.image,
          publicId: slideForm.publicId,
          fileType: slideForm.fileType,
          title: slideForm.title.trim(),
          subtitle: slideForm.subtitle.trim(),
          buttonText: slideForm.buttonText.trim(),
          buttonLink: slideForm.buttonLink.trim(),
        },
      ],
    }));

    cleanupBlobUrl(preview);

    setPreview("");

    setSlideForm({
      image: "",
      publicId: "",
      fileType: "image",
      title: "",
      subtitle: "",
      buttonText: "",
      buttonLink: "",
    });
  };

  /* ===========================
      REMOVE SLIDE
  =========================== */

  const removeSlide = () => {
    setHomepage((prev) => ({
      ...prev,
      slides: prev.slides.filter(
        (_, index) =>
          index !== deleteModal.index
      ),
    }));

    setDeleteModal({
      isOpen: false,
      index: null,
      itemName: "",
    });

    setStatusModal({
      isOpen: true,
      type: "success",
      title: TITLES.SUCCESS,
      message: "Slide deleted successfully.",
    });
  };

  /* ===========================
      DELETE ALL SLIDES
  =========================== */

  const deleteAllSlides = () => {
    setHomepage((prev) => ({
      ...prev,
      slides: [],
    }));

    setDeleteAllModal(false);

    setStatusModal({
      isOpen: true,
      type: "success",
      title: TITLES.SUCCESS,
      message: "All slides deleted successfully.",
    });
  };

  /* ===========================
      SAVE HOMEPAGE
  =========================== */

  const handleSave = async () => {
    try {
      const payload = {
        address: homepage.address,
        admissionText:
          homepage.admissionText,
        slides: homepage.slides,
      };

      if (homepage._id) {
        await api.put(
          `/homepage/${homepage._id}`,
          payload
        );
      } else {
        const { data } =
          await api.post(
            "/homepage",
            payload
          );

        setHomepage((prev) => ({
          ...prev,
          _id:
            data.data._id ||
            data.data.id ||
            "",
        }));
      }

      setStatusModal({
        isOpen: true,
        type: "success",
        title: TITLES.SUCCESS,
        message:
          "Homepage saved successfully.",
      });

      fetchHomepage();
    } catch (error) {
      setStatusModal({
        isOpen: true,
        type: "error",
        title: TITLES.ERROR,
        message:
          error.response?.data?.message ||
          ERROR_MESSAGES.SAVE,
      });
    }
  };

  /* ===========================
      DASHBOARD STATS
  =========================== */

  const totalSlides = useMemo(
    () => homepage.slides.length,
    [homepage.slides]
  );

  const ctaSlides = useMemo(
    () =>
      homepage.slides.filter(
        (slide) =>
          slide.buttonText &&
          slide.buttonLink
      ).length,
    [homepage.slides]
  );

  /* ===========================
      JSX
  =========================== */

  return (
    <>
      <LoadingModal
        isOpen={loading || uploading}
        title={
          uploading
            ? "Uploading Image"
            : "Loading Homepage"
        }
        message={
          uploading
            ? "Please wait while the image uploads..."
            : "Fetching homepage content..."
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
        itemName={deleteModal.itemName}
        onConfirm={removeSlide}
        onCancel={() =>
          setDeleteModal({
            isOpen: false,
            index: null,
            itemName: "",
          })
        }
      />

      <ConfirmModal
        isOpen={deleteAllModal}
        title="Delete All Slides"
        message="This will permanently remove every homepage slide."
        confirmText="Delete All"
        confirmColor="btn-error"
        onConfirm={deleteAllSlides}
        onCancel={() =>
          setDeleteAllModal(false)
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
        transition={{
          duration: 0.35,
        }}
        className="space-y-8"
      >

        {/* Continue in Part 1B */}
                {/* ===========================
            HERO HEADER
        =========================== */}

        <div className="hero rounded-4xl bg-linear-to-r from-primary to-secondary text-primary-content shadow-2xl">

          <div className="hero-content w-full flex-col lg:flex-row justify-between py-10">

            <div>

              <h1 className="text-5xl font-black flex items-center gap-4">
                <FaHome />
                Homepage CMS
              </h1>

              <p className="mt-4 text-lg opacity-90 max-w-3xl">
                Manage homepage announcements, hero slider,
                address and admission banner from a
                centralized dashboard.
              </p>

               <div className="flex gap-3">

              <button
                onClick={() =>
                  setDeleteAllModal(true)
                }
                disabled={!homepage.slides.length}
                className="btn btn-error btn-sm"
              >
                <FaTrash />
                Delete All
              </button>

            </div>

            </div>

           

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
                Total Slides
              </p>

              <h2 className="text-4xl font-black text-primary">
                {totalSlides}
              </h2>

            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="card bg-base-100 border border-base-300 shadow-xl"
          >
            <div className="card-body">

              <p className="text-base-content/60">
                Slides With CTA
              </p>

              <h2 className="text-4xl font-black text-success">
                {ctaSlides}
              </h2>

            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="card bg-base-100 border border-base-300 shadow-xl"
          >
            <div className="card-body">

              <p className="text-base-content/60">
                Homepage Status
              </p>

              <h2 className="text-4xl font-black text-info">
                LIVE
              </h2>

            </div>
          </motion.div>

        </div>

        {/* ===========================
            MAIN GRID
        =========================== */}

        <div className="grid xl:grid-cols-5 gap-8">

          {/* ===========================
              LEFT SIDE
          =========================== */}

          <div className="xl:col-span-3">

            {/* Homepage Settings */}

            <div className="card bg-base-100 border border-base-300 shadow-xl">

              <div className="card-body">

                <h2 className="card-title text-2xl">
                  Homepage Settings
                </h2>

                <p className="text-base-content/60 mb-4">
                  Configure homepage information
                  displayed throughout the website.
                </p>

                <div className="space-y-6">

                  <div>

                    <label className="label">
                      <span className="label-text font-semibold">
                        Address
                      </span>
                    </label>

                    <textarea
                      name="address"
                      value={homepage.address}
                      onChange={handleHomepageChange}
                      placeholder="College Address..."
                      rows={4}
                      className="textarea textarea-bordered w-full"
                    />

                  </div>

                  <div>

                    <label className="label">
                      <span className="label-text font-semibold">
                        Admission Banner Text
                      </span>
                    </label>

                    <input
                      type="text"
                      name="admissionText"
                      value={homepage.admissionText}
                      onChange={handleHomepageChange}
                      placeholder="Admissions Open 2026..."
                      className="input input-bordered w-full"
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* Continue in Part 1B-2 */}
                        {/* ===========================
                HERO SLIDE BUILDER
            =========================== */}

            <div className="card bg-base-100 border border-base-300 shadow-xl mt-8">

              <div className="card-body">

                <h2 className="card-title text-2xl">
                  <FaImage />
                  Hero Slide Builder
                </h2>

                <p className="text-base-content/60 mb-6">
                  Create hero slides with an image,
                  heading, subtitle and CTA button.
                </p>

                <div className="space-y-6">

                  {/* Upload */}

                  <div>

                    <label className="label">
                      <span className="label-text font-semibold">
                        Upload Slide Image
                      </span>
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="file-input file-input-bordered w-full"
                    />

                  </div>

                  {/* Preview */}

                  {(preview || slideForm.image) && (

                    <div className="rounded-2xl overflow-hidden border border-base-300">

                      <img
                        src={preview || slideForm.image}
                        alt="Slide Preview"
                        className="w-full h-64 object-cover"
                      />

                    </div>

                  )}

                  {/* Title */}

                  <div>

                    <label className="label">
                      <span className="label-text font-semibold">
                        Slide Title
                      </span>
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={slideForm.title}
                      onChange={handleSlideChange}
                      className="input input-bordered w-full"
                      placeholder="Admissions Open 2026"
                    />

                  </div>

                  {/* Subtitle */}

                  <div>

                    <label className="label">
                      <span className="label-text font-semibold">
                        Slide Subtitle
                      </span>
                    </label>

                    <textarea
                      rows={4}
                      name="subtitle"
                      value={slideForm.subtitle}
                      onChange={handleSlideChange}
                      className="textarea textarea-bordered w-full"
                      placeholder="Shape your future with excellence..."
                    />

                  </div>

                  {/* CTA */}

                  <div className="grid md:grid-cols-2 gap-6">

                    <div>

                      <label className="label">
                        <span className="label-text font-semibold">
                          Button Text
                        </span>
                      </label>

                      <input
                        type="text"
                        name="buttonText"
                        value={slideForm.buttonText}
                        onChange={handleSlideChange}
                        className="input input-bordered w-full"
                        placeholder="Apply Now"
                      />

                    </div>

                    <div>

                      <label className="label">
                        <span className="label-text font-semibold">
                          Button Link
                        </span>
                      </label>

                      <input
                        type="text"
                        name="buttonLink"
                        value={slideForm.buttonLink}
                        onChange={handleSlideChange}
                        className="input input-bordered w-full"
                        placeholder="/admission"
                      />

                    </div>

                  </div>

                  {/* Validation */}

                  <div className="alert bg-base-200 border border-base-300">

                    <div className="space-y-2 text-sm w-full">

                      <div className={slideForm.image ? "text-success" : "text-error"}>
                        {slideForm.image
                          ? "✓ Slide image uploaded"
                          : "✗ Slide image required"}
                      </div>

                      <div className={slideForm.title ? "text-success" : "text-warning"}>
                        {slideForm.title
                          ? "✓ Title added"
                          : "Optional title"}
                      </div>

                      <div className={slideForm.subtitle ? "text-success" : "text-warning"}>
                        {slideForm.subtitle
                          ? "✓ Subtitle added"
                          : "Optional subtitle"}
                      </div>

                      <div
                        className={
                          slideForm.buttonText &&
                          slideForm.buttonLink
                            ? "text-success"
                            : "text-warning"
                        }
                      >
                        {slideForm.buttonText &&
                        slideForm.buttonLink
                          ? "✓ CTA configured"
                          : "Optional CTA"}
                      </div>

                    </div>

                  </div>

                  {/* Button */}

                  <button
                    type="button"
                    onClick={addSlide}
                    disabled={!slideForm.image}
                    className="btn btn-primary btn-lg w-full"
                  >
                    <FaPlus />
                    Add Hero Slide
                  </button>

                </div>

              </div>

            </div>

          </div>

          {/* ===========================
              RIGHT COLUMN
              Continue in Part 2
          =========================== */}

          <div className="xl:col-span-2">
                        {/* ===========================
                LIVE HERO PREVIEW
            =========================== */}

            <div className="card bg-base-100 border border-base-300 shadow-xl sticky top-6">

              <div className="card-body">

                <h2 className="card-title text-2xl">
                  Live Preview
                </h2>

                <p className="text-base-content/60 mb-5">
                  Preview how the current hero slide
                  will appear on the homepage.
                </p>

                <div className="relative rounded-2xl overflow-hidden border border-base-300 min-h-125 bg-base-200">

                  {slideForm.image ? (

                    <>
                      <img
                        src={preview || slideForm.image}
                        alt="Hero Preview"
                        className="w-full h-125 object-cover"
                      />

                      <div className="absolute inset-0 bg-black/60" />

                      <div className="absolute inset-0 flex flex-col justify-end p-8">

                        {slideForm.title && (
                          <h2 className="text-4xl font-black text-white">
                            {slideForm.title}
                          </h2>
                        )}

                        {slideForm.subtitle && (
                          <p className="text-white/90 mt-4 max-w-xl">
                            {slideForm.subtitle}
                          </p>
                        )}

                        {slideForm.buttonText && (
                          <button className="btn btn-primary mt-6 w-fit">

                            {slideForm.buttonText}

                          </button>
                        )}

                      </div>

                    </>

                  ) : (

                    <div className="h-125 flex flex-col items-center justify-center">

                      <FaImage className="text-7xl opacity-30 mb-4" />

                      <h3 className="text-2xl font-bold">

                        Hero Preview

                      </h3>

                      <p className="text-base-content/60 mt-2">

                        Upload an image to preview the hero banner.

                      </p>

                    </div>

                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ===========================
            HERO SLIDES
        =========================== */}

        <div className="card bg-base-100 border border-base-300 shadow-xl">

          <div className="card-body">

            <div className="flex items-center justify-between mb-4">

              <div>

                <h2 className="card-title text-2xl">

                  Hero Slides

                </h2>

                <p className="text-base-content/60">

                  Manage all homepage hero slides.

                </p>

              </div>

              <div className="badge badge-primary badge-lg">

                {homepage.slides.length} Slides

              </div>

            </div>

            {homepage.slides.length === 0 ? (

              <div className="py-20 text-center">

                <FaImage className="text-7xl opacity-20 mx-auto mb-5" />

                <h3 className="text-2xl font-bold">

                  No Slides Added

                </h3>

                <p className="text-base-content/60 mt-2">

                  Create your first homepage hero slide.

                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="table table-zebra">

                  <thead>

                    <tr>

                      <th>Preview</th>

                      <th>Title</th>

                      <th>CTA</th>

                      <th>Type</th>

                      <th>Actions</th>

                    </tr>

                  </thead>

                  <tbody>

                    {homepage.slides.map(
                      (slide, index) => (

                        <tr key={index}>

                          <td>

                            <img
                              src={slide.image}
                              alt={slide.title}
                              className="w-28 h-16 rounded-xl object-cover"
                            />

                          </td>

                          <td>

                            <div>

                              <div className="font-bold">

                                {slide.title || "-"}

                              </div>

                              <div className="text-xs opacity-60 mt-1">

                                {slide.subtitle
                                  ? slide.subtitle.length > 60
                                    ? `${slide.subtitle.substring(
                                        0,
                                        60
                                      )}...`
                                    : slide.subtitle
                                  : "-"}

                              </div>

                            </div>

                          </td>

                          <td>

                            {slide.buttonText ? (

                              <span className="badge badge-primary">

                                {slide.buttonText}

                              </span>

                            ) : (

                              "-"

                            )}

                          </td>

                          {/* Continue in Part 2B */}
                                                    <td>

                            <span className="badge badge-outline">

                              {slide.fileType || "image"}

                            </span>

                          </td>

                          <td>

                            <div className="flex gap-2">

                              <button
                                type="button"
                                className="btn btn-error btn-sm"
                                onClick={() =>
                                  setDeleteModal({
                                    isOpen: true,
                                    index,
                                    itemName:
                                      slide.title ||
                                      `Slide ${index + 1}`,
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

            )}

          </div>

        </div>

        {/* ===========================
            STICKY FOOTER
        =========================== */}

        <div className="sticky bottom-5 z-40">

          <div className="card bg-base-100 border border-base-300 shadow-2xl">

            <div className="card-body">

              <div className="flex flex-col md:flex-row justify-end gap-3">

                <button
                  type="button"
                  className="btn btn-error"
                  disabled={!homepage.slides.length}
                  onClick={() =>
                    setDeleteAllModal(true)
                  }
                >

                  <FaTrash />

                  Delete All Slides

                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                >

                  <FaSave />

                  Save Homepage

                </button>

              </div>

            </div>

          </div>

        </div>

      </motion.div>

    </>

  );

}