import { useEffect, useState } from "react";

import {
  GraduationCap,
  Briefcase,
  Target,
  Save,
  Trash2,
} from "lucide-react";

import api from "../../../../services/api";


import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";


import { validateUpload } from "../../../../utils/validateUpload";

import { previewFile } from "../../../../utils/previewFile";

import { cleanupBlobUrl } from "../../../../utils/blobCleanup";

import {
  TITLES,
  getSaveMessage,
  getUploadRequirements,
} from "../../../../utils/uploadMessages";

const BcaControl = () => {

  /* ======================================================
      STATES
  ====================================================== */

  const [loading, setLoading] =
    useState(false);

  const [fetching, setFetching] =
    useState(true);

  const [hasData, setHasData] =
    useState(false);

  const [form, setForm] =
    useState({

      image: null,

      imagePreview: "",

      bcaDescription: "",

      objectives: "",

      valueAddedPrograms: "",

      jobProspects: "",

      placementAssistance: "",

      courseDetails: "",

      duration: "",

      eligibility: "",

    });

  /* ======================================================
      MODALS
  ====================================================== */

  const [statusModal, setStatusModal] =
    useState({

      open: false,

      type: "info",

      title: "",

      message: "",

    });

  const [deleteModalOpen,
    setDeleteModalOpen] =
    useState(false);

  /* ======================================================
      HELPERS
  ====================================================== */

  const uploadInfo =
    getUploadRequirements({

      images: true,

      maxSize: "5 MB",

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

    setStatusModal((prev) => ({

      ...prev,

      open: false,

    }));

  };

  /* ======================================================
      FETCH
  ====================================================== */

  const fetchData =
    async () => {

      try {

        setFetching(true);

        const { data } =
          await api.get("/bca");

        if (
          data.success &&
          data.data
        ) {

          setHasData(true);

          setForm({

            image: null,

            imagePreview:
              data.data.image || "",

            bcaDescription:
              data.data.bcaDescription || "",

            objectives:
              data.data.objectives?.join(", ") || "",

            valueAddedPrograms:
              data.data.valueAddedPrograms?.join(", ") || "",

            jobProspects:
              data.data.jobProspects?.join(", ") || "",

            placementAssistance:
              data.data.placementAssistance || "",

            courseDetails:
              data.data.courseDetails || "",

            duration:
              data.data.duration || "",

            eligibility:
              data.data.eligibility || "",

          });

        } else {

          setHasData(false);

        }

      } catch (error) {

        showStatus(

          "error",

          TITLES.ERROR,

          error.response?.data?.message ||

          "Unable to load BCA information."

        );

      } finally {

        setFetching(false);

      }

    };

  useEffect(() => {

    fetchData();

  }, []);

  /* ======================================================
      CLEANUP
  ====================================================== */

  useEffect(() => {

    return () => {

      cleanupBlobUrl(
        form.imagePreview
      );

    };

  }, [form.imagePreview]);

  /* ======================================================
      INPUT CHANGE
  ====================================================== */

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  };

  /* ======================================================
      IMAGE CHANGE
  ====================================================== */

  const handleImageChange = (
    e
  ) => {

    const file =
      e.target.files?.[0];

    if (!file)
      return;

    const validation =
      validateUpload(file, {

        allowImages: true,

      });

    if (!validation.valid) {

      showStatus(

        "warning",

        TITLES.WARNING,

        validation.message

      );

      e.target.value = "";

      return;

    }

    const preview =
      previewFile(file);

    setForm((prev) => ({

      ...prev,

      image: file,

      imagePreview:
        preview.preview,

    }));

  };

  /* ======================================================
      SAVE
  ====================================================== */

  const handleSave =
    async () => {

      try {

        setLoading(true);

        const formData =
          new FormData();

        if (form.image) {

          formData.append(
            "image",
            form.image
          );

        }

        formData.append(
          "bcaDescription",
          form.bcaDescription
        );

        formData.append(
          "placementAssistance",
          form.placementAssistance
        );

        formData.append(
          "courseDetails",
          form.courseDetails
        );

        formData.append(
          "duration",
          form.duration
        );

        formData.append(
          "eligibility",
          form.eligibility
        );

        formData.append(
          "objectives",
          JSON.stringify(
            form.objectives
              .split(",")
              .map((i) => i.trim())
              .filter(Boolean)
          )
        );

        formData.append(
          "valueAddedPrograms",
          JSON.stringify(
            form.valueAddedPrograms
              .split(",")
              .map((i) => i.trim())
              .filter(Boolean)
          )
        );

        formData.append(
          "jobProspects",
          JSON.stringify(
            form.jobProspects
              .split(",")
              .map((i) => i.trim())
              .filter(Boolean)
          )
        );

        const { data } =
          await api.post(
            "/bca/add",
            formData
          );

        showStatus(

          "success",

          TITLES.SUCCESS,

          data.message ||

          getSaveMessage(
            "BCA Course"
          )

        );

        setForm((prev) => ({
          ...prev,
          image: null,
        }));

        fetchData();

      } catch (error) {

        showStatus(

          "error",

          TITLES.ERROR,

          error.response?.data?.message ||

          "Unable to save BCA information."

        );

      } finally {

        setLoading(false);

      }

    };
      /* ======================================================
      REMOVE BANNER IMAGE
  ====================================================== */

  const handleRemoveImage =
    async () => {

      try {

        setLoading(true);

        const { data } =
          await api.delete(
            "/bca/image"
          );

        showStatus(

          "success",

          TITLES.SUCCESS,

          data.message

        );

        fetchData();

      } catch (error) {

        showStatus(

          "error",

          TITLES.ERROR,

          error.response?.data?.message ||

          "Unable to remove banner image."

        );

      } finally {

        setLoading(false);

      }

    };

  /* ======================================================
      DELETE CMS
  ====================================================== */

  const handleDelete =
    async () => {

      try {

        setLoading(true);

        const { data } =
          await api.delete(
            "/bca/delete"
          );

        showStatus(

          "success",

          TITLES.SUCCESS,

          data.message

        );

        setHasData(false);

        setForm({

          image: null,

          imagePreview: "",

          bcaDescription: "",

          objectives: "",

          valueAddedPrograms: "",

          jobProspects: "",

          placementAssistance: "",

          courseDetails: "",

          duration: "",

          eligibility: "",

        });

      } catch (error) {

        showStatus(

          "error",

          TITLES.ERROR,

          error.response?.data?.message ||

          "Unable to delete BCA information."

        );

      } finally {

        setLoading(false);

      }

    };

  const confirmDelete = () => {

    setDeleteModalOpen(false);

    handleDelete();

  };

  /* ======================================================
      RETURN
  ====================================================== */

  return (

    <div className="min-h-screen bg-base-200 p-4 md:p-6">

      <div className="max-w-7xl mx-auto space-y-6">

        {/* ======================================================
            HERO
        ====================================================== */}

        <div className="hero bg-linear-to-r from-primary to-secondary rounded-3xl shadow-xl">

          <div className="hero-content text-center text-primary-content py-10">

            <div>

              <GraduationCap
                size={70}
                className="mx-auto mb-5"
              />

              <h1 className="text-4xl md:text-5xl font-black">

                BCA CMS Dashboard

              </h1>

              <p className="mt-4 text-lg opacity-90 max-w-3xl">

                Manage the Bachelor of Business
                Administration page including banner,
                description, objectives, placement,
                course details and more.

              </p>

            </div>

          </div>

        </div>

        {/* ======================================================
            STATS
        ====================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="stats shadow bg-base-100 border border-base-300">

            <div className="stat">

              <div className="stat-figure text-primary">

                <GraduationCap size={30} />

              </div>

              <div className="stat-title">

                Course

              </div>

              <div className="stat-value text-primary">

                BCA

              </div>

            </div>

          </div>

          <div className="stats shadow bg-base-100 border border-base-300">

            <div className="stat">

              <div className="stat-figure text-secondary">

                <Target size={30} />

              </div>

              <div className="stat-title">

                Objectives

              </div>

              <div className="stat-value text-secondary">

                {
                  form.objectives
                    .split(",")
                    .filter(
                      (item) =>
                        item.trim() !== ""
                    ).length
                }

              </div>

            </div>

          </div>

          <div className="stats shadow bg-base-100 border border-base-300">

            <div className="stat">

              <div className="stat-figure text-accent">

                <Briefcase size={30} />

              </div>

              <div className="stat-title">

                Job Prospects

              </div>

              <div className="stat-value text-accent">

                {
                  form.jobProspects
                    .split(",")
                    .filter(
                      (item) =>
                        item.trim() !== ""
                    ).length
                }

              </div>

            </div>

          </div>

        </div>

        {/* ======================================================
            ACTION BUTTONS
        ====================================================== */}

        <div className="flex flex-wrap justify-end gap-4">

          <button
            className="btn btn-outline btn-warning"
            onClick={handleRemoveImage}
            disabled={
              !form.imagePreview ||
              loading
            }
          >

            <Trash2 size={18} />

            Remove Banner

          </button>

          <button
            className="btn btn-error"
            onClick={() =>
              setDeleteModalOpen(true)
            }
          >

            <Trash2 size={18} />

            Delete CMS

          </button>

          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading}
          >

            <Save size={18} />

            {hasData
              ? "Update Content"
              : "Create Content"}

          </button>

        </div>

        {/* ======================================================
            MAIN GRID
        ====================================================== */}

        <div className="grid grid-cols-1 2xl:grid-cols-5 gap-8">

          {/* ======================================================
              LEFT FORM
          ====================================================== */}

          <div className="2xl:col-span-3">

            <div className="card bg-base-100 border border-base-300 shadow-xl">

              <div className="card-body">

                <h2 className="card-title text-3xl font-black">

                  Course Information

                </h2>

                <p className="text-base-content/70">

                  Manage all BCA Course
                  information displayed on
                  the website.

                </p>

                <div className="space-y-6 mt-6">

                  {/* ======================================================
                      BANNER IMAGE
                  ====================================================== */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Banner Image

                      </span>

                    </label>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="file-input file-input-bordered file-input-primary w-full"
                      onChange={handleImageChange}
                    />

                    <div className="alert alert-info mt-4">

                      <div>

                        <h3 className="font-bold">

                          {uploadInfo.title}

                        </h3>

                        <ul className="list-disc list-inside text-sm mt-2">

                          {uploadInfo.formats.map(
                            (item) => (

                              <li key={item}>

                                {item}

                              </li>

                            )
                          )}

                          <li>

                            Maximum Size :

                            {" "}

                            {uploadInfo.maxSize}

                          </li>

                          <li>

                            Storage :

                            Cloudinary

                          </li>

                        </ul>

                      </div>

                    </div>

                  </div>
                                    {/* ======================================================
                      COURSE DESCRIPTION
                  ====================================================== */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Course Description

                      </span>

                    </label>

                    <textarea
                      name="bcaDescription"
                      value={form.bcaDescription}
                      onChange={handleChange}
                      placeholder="Enter complete BCA Course description..."
                      className="textarea textarea-bordered h-40 w-full"
                    />

                  </div>

                  {/* ======================================================
                      OBJECTIVES
                  ====================================================== */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Objectives

                      </span>

                    </label>

                    <textarea
                      name="objectives"
                      value={form.objectives}
                      onChange={handleChange}
                      placeholder="Separate objectives using commas"
                      className="textarea textarea-bordered h-32 w-full"
                    />

                    <label className="label">

                      <span className="label-text-alt">

                        Example:
                        Leadership, Management,
                        Entrepreneurship,
                        Communication Skills

                      </span>

                    </label>

                  </div>

                  {/* ======================================================
                      VALUE ADDED PROGRAMS
                  ====================================================== */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Value Added Programs

                      </span>

                    </label>

                    <textarea
                      name="valueAddedPrograms"
                      value={form.valueAddedPrograms}
                      onChange={handleChange}
                      placeholder="Separate programs using commas"
                      className="textarea textarea-bordered h-32 w-full"
                    />

                    <label className="label">

                      <span className="label-text-alt">

                        Example:
                        Excel, Digital Marketing,
                        Tally, SAP, AI Tools

                      </span>

                    </label>

                  </div>

                  {/* ======================================================
                      JOB PROSPECTS
                  ====================================================== */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Job Prospects

                      </span>

                    </label>

                    <textarea
                      name="jobProspects"
                      value={form.jobProspects}
                      onChange={handleChange}
                      placeholder="Separate job prospects using commas"
                      className="textarea textarea-bordered h-32 w-full"
                    />

                    <label className="label">

                      <span className="label-text-alt">

                        Example:
                        HR Executive,
                        Business Analyst,
                        Marketing Manager,
                        Sales Executive

                      </span>

                    </label>

                  </div>

                  {/* ======================================================
                      DURATION + ELIGIBILITY
                  ====================================================== */}

                  <div className="grid md:grid-cols-2 gap-6">

                    <div>

                      <label className="label">

                        <span className="label-text font-semibold">

                          Duration

                        </span>

                      </label>

                      <input
                        type="text"
                        name="duration"
                        value={form.duration}
                        onChange={handleChange}
                        placeholder="3 Years"
                        className="input input-bordered w-full"
                      />

                    </div>

                    <div>

                      <label className="label">

                        <span className="label-text font-semibold">

                          Eligibility

                        </span>

                      </label>

                      <input
                        type="text"
                        name="eligibility"
                        value={form.eligibility}
                        onChange={handleChange}
                        placeholder="10+2 Passed"
                        className="input input-bordered w-full"
                      />

                    </div>

                  </div>

                  {/* ======================================================
                      PLACEMENT ASSISTANCE
                  ====================================================== */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Placement Assistance

                      </span>

                    </label>

                    <textarea
                      name="placementAssistance"
                      value={form.placementAssistance}
                      onChange={handleChange}
                      placeholder="Describe placement support..."
                      className="textarea textarea-bordered h-40 w-full"
                    />

                  </div>

                  {/* ======================================================
                      COURSE DETAILS
                  ====================================================== */}

                  <div>

                    <label className="label">

                      <span className="label-text font-semibold">

                        Course Details

                      </span>

                    </label>

                    <textarea
                      name="courseDetails"
                      value={form.courseDetails}
                      onChange={handleChange}
                      placeholder="Enter complete course details..."
                      className="textarea textarea-bordered h-48 w-full"
                    />

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ======================================================
              RIGHT PREVIEW
          ====================================================== */}

          <div className="2xl:col-span-2">

            <div className="card bg-base-100 border border-base-300 shadow-xl sticky top-24 overflow-hidden">

              {/* ======================================================
                  HERO PREVIEW
              ====================================================== */}

              <div className="relative">

                {fetching ? (

                  <div className="skeleton h-80 w-full" />

                ) : form.imagePreview ? (

                  <img
                    src={form.imagePreview}
                    alt="BCA Banner"
                    className="w-full h-80 object-cover"
                  />

                ) : (

                  <div className="h-80 bg-base-300 flex items-center justify-center">

                    <div className="text-center">

                      <GraduationCap
                        size={70}
                        className="mx-auto mb-4 opacity-40"
                      />

                      <h3 className="text-2xl font-bold">

                        No Banner Uploaded

                      </h3>

                    </div>

                  </div>

                )}

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">

                  <div className="badge badge-primary badge-lg mb-3">

                    LIVE PREVIEW

                  </div>

                  <h2 className="text-3xl font-black text-white">

                    Bachelor of Computer Applications

                  </h2>

                </div>

              </div>

              <div className="card-body space-y-8">
                                {/* ======================================================
                    DESCRIPTION
                ====================================================== */}

                <div>

                  <h3 className="text-2xl font-bold mb-4">

                    Description

                  </h3>

                  <p className="leading-8 text-base-content/80 whitespace-pre-line">

                    {form.bcaDescription ||

                      "Course description preview will appear here."}

                  </p>

                </div>

                {/* ======================================================
                    OBJECTIVES
                ====================================================== */}

                <div>

                  <h3 className="text-2xl font-bold mb-4">

                    Objectives

                  </h3>

                  <div className="space-y-3">

                    {form.objectives
                      .split(",")
                      .filter(item => item.trim() !== "")
                      .map((item, index) => (

                        <div
                          key={index}
                          className="bg-base-200 rounded-2xl px-5 py-4"
                        >

                          {item.trim()}

                        </div>

                      ))}

                  </div>

                </div>

                {/* ======================================================
                    VALUE ADDED PROGRAMS
                ====================================================== */}

                <div>

                  <h3 className="text-2xl font-bold mb-4">

                    Value Added Programs

                  </h3>

                  <div className="flex flex-wrap gap-3">

                    {form.valueAddedPrograms
                      .split(",")
                      .filter(item => item.trim() !== "")
                      .map((item, index) => (

                        <div
                          key={index}
                          className="badge badge-secondary badge-lg p-4"
                        >

                          {item.trim()}

                        </div>

                      ))}

                  </div>

                </div>

                {/* ======================================================
                    JOB PROSPECTS
                ====================================================== */}

                <div>

                  <h3 className="text-2xl font-bold mb-4">

                    Job Prospects

                  </h3>

                  <div className="flex flex-wrap gap-3">

                    {form.jobProspects
                      .split(",")
                      .filter(item => item.trim() !== "")
                      .map((item, index) => (

                        <div
                          key={index}
                          className="badge badge-outline badge-lg p-4"
                        >

                          {item.trim()}

                        </div>

                      ))}

                  </div>

                </div>

                {/* ======================================================
                    DURATION + ELIGIBILITY
                ====================================================== */}

                <div className="grid md:grid-cols-2 gap-4">

                  <div className="bg-base-200 rounded-3xl p-5">

                    <p className="text-sm text-base-content/60">

                      Duration

                    </p>

                    <h4 className="text-xl font-bold mt-2">

                      {form.duration ||

                        "Not Specified"}

                    </h4>

                  </div>

                  <div className="bg-base-200 rounded-3xl p-5">

                    <p className="text-sm text-base-content/60">

                      Eligibility

                    </p>

                    <h4 className="text-xl font-bold mt-2">

                      {form.eligibility ||

                        "Not Specified"}

                    </h4>

                  </div>

                </div>

                {/* ======================================================
                    PLACEMENT ASSISTANCE
                ====================================================== */}

                <div>

                  <h3 className="text-2xl font-bold mb-4">

                    Placement Assistance

                  </h3>

                  <div className="bg-base-200 rounded-3xl p-5">

                    <p className="leading-8 whitespace-pre-line">

                      {form.placementAssistance ||

                        "Placement assistance preview will appear here."}

                    </p>

                  </div>

                </div>

                {/* ======================================================
                    COURSE DETAILS
                ====================================================== */}

                <div>

                  <h3 className="text-2xl font-bold mb-4">

                    Course Details

                  </h3>

                  <div className="bg-base-200 rounded-3xl p-5">

                    <p className="leading-8 whitespace-pre-line">

                      {form.courseDetails ||

                        "Course details preview will appear here."}

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ======================================================
            STICKY SAVE BAR
        ====================================================== */}

        <div className="sticky bottom-4 z-40">

          <div className="card bg-base-100 border border-base-300 shadow-2xl">

            <div className="card-body py-5">

              <div className="flex flex-col lg:flex-row justify-between items-center gap-5">

                <div>

                  <h3 className="font-bold text-lg">

                    BCA Content Management

                  </h3>

                  <p className="text-base-content/70 text-sm mt-1">

                    Supported Uploads :

                    {" "}

                    {uploadInfo.formats.join(", ")}

                    <br />

                    Maximum Upload Size :

                    {" "}

                    {uploadInfo.maxSize}

                    <br />

                    Storage :

                    Cloudinary

                  </p>

                </div>

                <button
                  className="btn btn-primary btn-wide"
                  onClick={handleSave}
                  disabled={loading}
                >

                  <Save size={18} />

                  {hasData
                    ? "Update Content"
                    : "Create Content"}

                </button>

              </div>

            </div>

          </div>

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
        title="Saving BCA Information"
        message="Please wait while your content is uploaded to Cloudinary..."
      />

      {/* ======================================================
          DELETE MODAL
      ====================================================== */}

      <DeleteModal
        isOpen={deleteModalOpen}
        itemName="BCA CMS Content"
        onCancel={() =>
          setDeleteModalOpen(false)
        }
        onConfirm={confirmDelete}
      />

    </div>

  );

};

export default BcaControl;