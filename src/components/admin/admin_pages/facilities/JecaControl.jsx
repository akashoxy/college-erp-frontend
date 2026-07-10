import {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  GraduationCap,
  ImagePlus,
  Save,
  Trash2,
  RefreshCw,
  Eye,
  Database,
  Upload,
} from "lucide-react";

import api from "../../../../services/api";


import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";

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
  IMAGE_UPLOAD,
} from "../../../../utils/uploadConstants";

import {
  getUploadMessage,
} from "../../../../utils/uploadMessages";

const JecaControl = () => {

  /* ======================================================
      INITIAL FORM
  ====================================================== */

  const initialForm = {

    paragraph: "",

    bannerImage: null,

  };

  /* ======================================================
      STATES
  ====================================================== */

  const [formData,
    setFormData] =
    useState(initialForm);

  const [jecaData,
    setJecaData] =
    useState(null);

  const [previewImage,
    setPreviewImage] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const [fetching,
    setFetching] =
    useState(true);

  const [deleteModalOpen,
    setDeleteModalOpen] =
    useState(false);

  /* ======================================================
      STATUS MODAL
  ====================================================== */

  const [statusModal,
    setStatusModal] =
    useState({

      open: false,

      type: "success",

      title: "",

      message: "",

    });

  const showStatus = (
    type,
    title,
    message
  ) => {

    setStatusModal({

      open: true,

      type,

      title,

      message,

    });

  };

  const closeStatus = () => {

    setStatusModal(

      (prev) => ({

        ...prev,

        open: false,

      })

    );

  };

  /* ======================================================
      LOAD DATA
  ====================================================== */

  const loadData = async () => {

  try {

    setFetching(true);

    const { data } = await api.get("/jeca");

    if (data.success && data.data) {

      setJecaData(data.data);

      setFormData({
        paragraph: data.data.paragraph || "",
        bannerImage: null,
      });

      setPreviewImage(
        data.data.bannerImage || ""
      );

    } else {

      setJecaData(null);

      setFormData(initialForm);

      setPreviewImage("");

    }

  } finally {

    setFetching(false);

  }

};

  useEffect(() => {

    loadData();

  }, []);

  /* ======================================================
      IMAGE UPLOAD
  ====================================================== */

  const handleImageChange =
    (e) => {

      const file =
        e.target.files?.[0];

      if (!file)
        return;

     const validation = validateUpload(file, {
  allowImages: true,
});

      if (
        !validation.valid
      ) {

        showStatus(

          "error",

          "Invalid Image",

          validation.message

        );

        return;

      }

      cleanupBlobUrl(
        previewImage
      );

      const preview =
  previewFile(file);

setPreviewImage(
  preview.preview
);

      setFormData(

        (prev) => ({

          ...prev,

          bannerImage:
            file,

        })

      );

    };

  /* ======================================================
      INPUT CHANGE
  ====================================================== */

  const handleChange =
    (e) => {

      const {

        name,

        value,

      } = e.target;

      setFormData(

        (prev) => ({

          ...prev,

          [name]:
            value,

        })

      );

    };

  /* ======================================================
      RESET
  ====================================================== */

  const resetForm = () => {

    cleanupBlobUrl(previewImage);

    if (jecaData) {

        setFormData({
            paragraph:
                jecaData.paragraph || "",
            bannerImage: null,
        });

        setPreviewImage(
            jecaData.bannerImage || ""
        );

    } else {

        setFormData(initialForm);

        setPreviewImage("");

    }

};

  /* ======================================================
      SAVE
  ====================================================== */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const payload =
          new FormData();

        payload.append(

          "paragraph",

          formData.paragraph

        );

        if (
          formData.bannerImage
        ) {

          payload.append(

            "bannerImage",

            formData.bannerImage

          );

        }

        const { data } =
          await api.post(

            "/jeca",

            payload

          );

        showStatus(

          "success",

          "Saved",

          data.message

        );

        await loadData();

      }

      catch (error) {

        showStatus(

          "error",

          "Save Failed",

          error.response?.data?.message ||

          "Unable to save JECA."

        );

      }

      finally {

        setLoading(false);

      }

    };

  /* ======================================================
      DELETE
  ====================================================== */

  const confirmDelete =
    async () => {

      try {

        setDeleteModalOpen(
          false
        );

        setLoading(true);

        const { data } =
          await api.delete(
            "/jeca"
          );

        showStatus(

          "success",

          "Deleted",

          data.message

        );

       await loadData();

      }

      catch (error) {

        showStatus(

          "error",

          "Delete Failed",

          error.response?.data?.message ||

          "Unable to delete JECA."

        );

      }

      finally {

        setLoading(false);

      }

    };

  /* ======================================================
      DESCRIPTION LENGTH
  ====================================================== */

  const descriptionLength =
    formData.paragraph.length;

  /* ======================================================
      RETURN
  ====================================================== */

  return (

    <div className="min-h-screen bg-base-200">
            <div className="max-w-7xl mx-auto p-6 space-y-8">

        {/* ======================================================
            HERO
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="hero rounded-3xl bg-linear-to-r from-primary to-secondary text-primary-content shadow-2xl"
        >

          <div className="hero-content text-center py-12">

            <div>

              <GraduationCap
                size={70}
                className="mx-auto mb-5"
              />

              <h1 className="text-5xl font-black">

                JECA Content Management

              </h1>

              <p className="mt-4 max-w-3xl opacity-90 text-lg">

                Manage the JECA banner image and
                description with a professional,
                Cloudinary-powered enterprise CMS.

              </p>

            </div>

          </div>

        </motion.div>

        {/* ======================================================
            DASHBOARD STATS
        ====================================================== */}

        <div className="grid md:grid-cols-3 gap-6">

          {/* TOTAL RECORD */}

          <div className="stat bg-base-100 rounded-3xl border border-base-300 shadow">

            <div className="stat-figure text-primary">

              <Database size={34} />

            </div>

            <div className="stat-title">

              Records

            </div>

            <div className="stat-value text-primary">

              {jecaData ? 1 : 0}

            </div>

          </div>

          {/* IMAGE */}

          <div className="stat bg-base-100 rounded-3xl border border-base-300 shadow">

            <div className="stat-figure text-secondary">

              <ImagePlus size={34} />

            </div>

            <div className="stat-title">

              Banner Image

            </div>

            <div className="stat-value text-secondary text-2xl">

              {(previewImage ||

                jecaData?.bannerImage)

                ? "Ready"

                : "Empty"}

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="stat bg-base-100 rounded-3xl border border-base-300 shadow">

            <div className="stat-figure text-accent">

              <Eye size={34} />

            </div>

            <div className="stat-title">

              Characters

            </div>

            <div className="stat-value text-accent">

              {descriptionLength}

            </div>

          </div>

        </div>

        {/* ======================================================
            FORM + PREVIEW
        ====================================================== */}

        <div className="grid lg:grid-cols-2 gap-8">

          {/* ======================================================
              FORM
          ====================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="card bg-base-100 border border-base-300 shadow-xl"
          >

            <div className="card-body">

              <h2 className="card-title text-2xl">

                JECA CMS

              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {/* ======================================================
                    IMAGE
                ====================================================== */}

                <div>

                  <label className="label">

                    <span className="label-text font-semibold">

                      Banner Image

                    </span>

                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input file-input-bordered w-full"
                  />

                  <label className="label">

                    <span className="label-text-alt">

                      {getUploadMessage(
                        IMAGE_UPLOAD
                      )}

                    </span>

                  </label>

                  <div className="alert alert-info mt-4">

                    <Upload
                      size={20}
                    />

                    <div>

                      <h3 className="font-bold">

                        Upload Requirements

                      </h3>

                      <p className="text-sm">

                        ✔ JPG

                        <br />

                        ✔ PNG

                        <br />

                        ✔ WEBP

                        <br />

                        ✔ Maximum File Size :
                        {" "}
                        {IMAGE_UPLOAD.maxSizeMB} MB

                        <br />

                        ✔ Stored securely in
                        Cloudinary

                      </p>

                    </div>

                  </div>

                </div>

                {/* ======================================================
                    PREVIEW
                ====================================================== */}

                <div>

                  <label className="label">

                    <span className="label-text font-semibold">

                      Banner Preview

                    </span>

                  </label>

                  {(previewImage ||

                    jecaData?.bannerImage)

                    ? (

                      <img
                        src={
                          previewImage ||

                          jecaData.bannerImage
                        }
                        alt="Preview"
                        className="w-full h-64 rounded-2xl object-cover border border-base-300"
                      />

                    )

                    : (

                      <div className="h-64 rounded-2xl border-2 border-dashed border-base-300 flex flex-col justify-center items-center bg-base-200">

                        <ImagePlus
                          size={55}
                          className="opacity-30"
                        />

                        <p className="mt-3 opacity-60">

                          Banner Preview

                        </p>

                      </div>

                    )}

                </div>

                {/* ======================================================
                    PARAGRAPH
                ====================================================== */}

                <div>

                  <label className="label">

                    <span className="label-text font-semibold">

                      JECA Description

                    </span>

                  </label>

                  <textarea
                  name="paragraph"
                  value={formData.paragraph}
                  onChange={handleChange}
                  className="textarea textarea-bordered w-full h-96 overflow-y-auto resize-none"
                  placeholder="Enter Jeca description..."
                  required
                />

                </div>

                {/* ======================================================
                    BUTTONS
                ====================================================== */}

                <div className="flex flex-wrap gap-4">

                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={loading}
                  >

                    <Save
                      size={18}
                    />

                   {jecaData
                    ? "Update Content"
                    : "Save Content"}

                  </button>

                  {jecaData && (

                    <button
                      type="button"
                      className="btn btn-error"
                      onClick={() =>
                        setDeleteModalOpen(
                          true
                        )
                      }
                    >

                      <Trash2
                        size={18}
                      />

                      Delete

                    </button>

                  )}

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

          {/* ======================================================
              PART 3 STARTS HERE
              LIVE WEBSITE PREVIEW
          ====================================================== */}
                    {/* ======================================================
              LIVE WEBSITE PREVIEW
          ====================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="card bg-base-100 border border-base-300 shadow-xl"
          >

            <div className="card-body">

              <h2 className="card-title text-2xl">

                Live Website Preview

              </h2>

              <div className="divider"></div>

              {/* ======================================================
                  BANNER
              ====================================================== */}

              {(previewImage ||

                jecaData?.bannerImage)

                ? (

                  <img
                    src={previewImage}
                    alt="JECA Banner"
                    className="w-full h-72 rounded-2xl object-cover border border-base-300"
                  />

                )

                : (

                  <div className="h-72 rounded-2xl bg-base-200 border-2 border-dashed border-base-300 flex flex-col justify-center items-center">

                    <ImagePlus
                      size={60}
                      className="opacity-30"
                    />

                    <p className="mt-4 opacity-60">

                      Banner Preview

                    </p>

                  </div>

                )}

              {/* ======================================================
                  DESCRIPTION
              ====================================================== */}

              <div className="mt-6">

                <h3 className="font-bold text-xl mb-3">

                  Description Preview

                </h3>

                <div className="rounded-2xl bg-base-200 border border-base-300 p-6 min-h-60">

                  {(formData.paragraph ||

                    jecaData?.paragraph)

                    ? (

                      <p className="whitespace-pre-wrap
                          wrap-break-word
                          overflow-auto
                          max-h-96
                          text-base-content
                          leading-7">

                       {formData.paragraph}

                      </p>

                    )

                    : (

                      <div className="flex justify-center items-center h-full">

                        <p className="text-base-content/50">

                          JECA description preview

                        </p>

                      </div>

                    )}

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </div>

      {/* ======================================================
          STATUS MODAL
      ====================================================== */}

      <StatusModal
        isOpen={statusModal.open}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={closeStatus}
      />

      {/* ======================================================
          LOADING MODAL
      ====================================================== */}

      <LoadingModal
        isOpen={loading}
        title="Saving JECA Content"
        message="Please wait while your changes are being saved..."
      />

      {/* ======================================================
          DELETE MODAL
      ====================================================== */}

      <DeleteModal
        isOpen={deleteModalOpen}
        itemName="JECA Content"
        onCancel={() =>
          setDeleteModalOpen(false)
        }
        onConfirm={confirmDelete}
      />

    </div>

  );

};

export default JecaControl;