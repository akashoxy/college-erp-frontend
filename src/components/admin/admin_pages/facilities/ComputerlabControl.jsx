import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  Monitor,
  Image,
  Plus,
  Trash2,
  Save,
  Pencil,
  RefreshCw,
  Search,
  Building2,
  Cpu,
  X,
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

const ComputerlabControl = () => {

  /* ==========================================
      INITIAL FORM
  ========================================== */

  const initialForm = {

    paragraph: "",

    facilities: [],

    laboratoryUnits: [],

  };

  /* ==========================================
      STATES
  ========================================== */

  const [
    laboratory,
    setLaboratory,
  ] = useState(null);

  const [
    formData,
    setFormData,
  ] = useState(initialForm);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    fetching,
    setFetching,
  ] = useState(true);

  const [
    bannerImage,
    setBannerImage,
  ] = useState(null);

  const [
    sideImage,
    setSideImage,
  ] = useState(null);

  const [
    bannerPreview,
    setBannerPreview,
  ] = useState("");

  const [
    sidePreview,
    setSidePreview,
  ] = useState("");

  const [
    deleteModalOpen,
    setDeleteModalOpen,
  ] = useState(false);

  /* ==========================================
      STATUS MODAL
  ========================================== */

  const [
    statusModal,
    setStatusModal,
  ] = useState({

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

  const closeStatus =
    () => {

      setStatusModal(

        (prev) => ({

          ...prev,

          open: false,

        })

      );

    };

  /* ==========================================
      LOAD DATA
  ========================================== */

  const loadData =
    async () => {

      try {

        setFetching(true);

        const {
          data,
        } = await api.get(
          "/computer-laboratory"
        );

        if (
          data.success &&
          data.data
        ) {

          const lab =
            data.data;

          setLaboratory(
            lab
          );

          setBannerPreview(
            lab.bannerImage || ""
          );

          setSidePreview(
            lab.sideImage || ""
          );

          setFormData({

            paragraph:
              lab.paragraph || "",

            facilities:
              lab.facilities || [],

            laboratoryUnits:
              lab.laboratoryUnits || [],

          });

        }

      }

      catch (error) {

        showStatus(

          "error",

          "Load Failed",

          error.response?.data
            ?.message ||

            "Unable to load Computer Laboratory."

        );

      }

      finally {

        setFetching(false);

      }

    };

  useEffect(() => {

    loadData();

  }, []);

  useEffect(() => {

  return () => {

    cleanupBlobUrl(bannerPreview);

    cleanupBlobUrl(sidePreview);

    formData.laboratoryUnits.forEach((unit) => {
      cleanupBlobUrl(unit.labImage);
    });

  };

}, [bannerPreview, sidePreview, formData.laboratoryUnits]);

  /* ==========================================
      TEXT INPUT
  ========================================== */

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

  /* ==========================================
      BANNER IMAGE
  ========================================== */

  const handleBannerImage =
    (e) => {

      const file =
        e.target.files?.[0];

      if (!file)
        return;

      const validation =
        validateUpload(

          file,

          IMAGE_UPLOAD

        );

      if (
        !validation.valid
      ) {

        showStatus(

          "error",

          "Invalid Banner",

          validation.message

        );

        return;

      }

      cleanupBlobUrl(
        bannerPreview
      );

      const preview = previewFile(file);

setBannerPreview(preview.preview);

setBannerImage(file);

    };

  /* ==========================================
      SIDE IMAGE
  ========================================== */

  const handleSideImage =
    (e) => {

      const file =
        e.target.files?.[0];

      if (!file)
        return;

      const validation =
        validateUpload(

          file,

          IMAGE_UPLOAD

        );

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
        sidePreview
      );

     const preview = previewFile(file);

setSidePreview(preview.preview);

setSideImage(file);

    };

  /* ==========================================
      RESET
  ========================================== */

 const resetForm = () => {

  cleanupBlobUrl(bannerPreview);

  cleanupBlobUrl(sidePreview);

  formData.laboratoryUnits.forEach((unit) => {
    cleanupBlobUrl(unit.labImage);
  });

  setBannerImage(null);

  setSideImage(null);

  loadData();

};


    /* ==========================================
      SAVE COMPUTER LABORATORY
  ========================================== */

  const handleSubmit =
    async () => {

      try {

        setLoading(true);

        const multipart =
          new FormData();

        if (bannerImage) {

          multipart.append(
            "bannerImage",
            bannerImage
          );

        }

        if (sideImage) {

          multipart.append(
            "sideImage",
            sideImage
          );

        }

        multipart.append(

          "paragraph",

          formData.paragraph

        );

        multipart.append(

          "facilities",

          JSON.stringify(
            formData.facilities
          )

        );

        multipart.append(

          "laboratoryUnits",

          JSON.stringify(

            formData.laboratoryUnits.map(

              ({
                labImageFile,
                ...unit
              }) => unit

            )

          )

        );

        formData.laboratoryUnits.forEach(

          (unit) => {

            if (
              unit.labImageFile
            ) {

              multipart.append(

                "labImages",

                unit.labImageFile

              );

            }

          }

        );

        const { data } =
          await api.post(

            "/computer-laboratory",

            multipart

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

          error.response?.data
            ?.message ||

            "Unable to save Computer Laboratory."

        );

      }

      finally {

        setLoading(false);

      }

    };

  /* ==========================================
      DELETE
  ========================================== */

  const confirmDelete =
    async () => {

      try {

        setDeleteModalOpen(
          false
        );

        setLoading(true);

        const { data } =
          await api.delete(

            "/computer-laboratory"

          );

        showStatus(

          "success",

          "Deleted",

          data.message

        );

        setLaboratory(
          null
        );

        setBannerImage(
          null
        );

        setSideImage(
          null
        );

        setBannerPreview(
          ""
        );

        setSidePreview(
          ""
        );

        setFormData(
          initialForm
        );

      }

      catch (error) {

        showStatus(

          "error",

          "Delete Failed",

          error.response?.data
            ?.message ||

            "Unable to delete."

        );

      }

      finally {

        setLoading(false);

      }

    };

  /* ==========================================
      FACILITIES
  ========================================== */

  const addFacility =
    () => {

      setFormData(

        (prev) => ({

          ...prev,

          facilities: [

            ...prev.facilities,

            "",

          ],

        })

      );

    };

  const updateFacility =
    (
      index,
      value
    ) => {

      const updated =

        [...formData.facilities];

      updated[index] =
        value;

      setFormData(

        (prev) => ({

          ...prev,

          facilities:
            updated,

        })

      );

    };

  const removeFacility =
    (index) => {

      const updated =

        [...formData.facilities];

      updated.splice(
        index,
        1
      );

      setFormData(

        (prev) => ({

          ...prev,

          facilities:
            updated,

        })

      );

    };

  /* ==========================================
      LABORATORY UNITS
  ========================================== */

  const addUnit =
    () => {

      setFormData(

        (prev) => ({

          ...prev,

          laboratoryUnits: [

            ...prev.laboratoryUnits,

            {

              labName: "",

              labTeacher: "",

              designation: "",

              qualification: "",

              labImage: "",

              labImageFile:
                null,

            },

          ],

        })

      );

    };

  const updateUnit =
    (
      index,
      field,
      value
    ) => {

      const updated =

        [
          ...formData.laboratoryUnits,
        ];

      updated[index][field] =
        value;

      setFormData(

        (prev) => ({

          ...prev,

          laboratoryUnits:
            updated,

        })

      );

    };

  const removeUnit =
    (index) => {

      const updated =

        [
          ...formData.laboratoryUnits,
        ];

      updated.splice(
        index,
        1
      );

      setFormData(

        (prev) => ({

          ...prev,

          laboratoryUnits:
            updated,

        })

      );

    };

  const handleUnitImage =
    (
      index,
      file
    ) => {

      if (!file)
        return;

      const validation =
        validateUpload(

          file,

          IMAGE_UPLOAD

        );

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

  const preview = previewFile(file);

const updated = [...formData.laboratoryUnits];

updated[index] = {
  ...updated[index],
  labImage: preview.preview,
  labImageFile: file,
};

setFormData((prev) => ({
  ...prev,
  laboratoryUnits: updated,
}));

    };

  /* ==========================================
      DASHBOARD STATS
  ========================================== */

  const totalFacilities =
    formData.facilities.length;

  const totalUnits =
    formData
      .laboratoryUnits
      .length;

  const hasBanner =
    !!bannerPreview;

  const hasSideImage =
    !!sidePreview;


    /* ==========================================
      RETURN
  ========================================== */

  return (

    <div className="min-h-screen bg-base-200">

      {/* ==========================================
          HERO
      ========================================== */}

      <motion.section
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="hero bg-linear-to-r from-primary via-secondary to-accent text-primary-content rounded-b-3xl shadow-2xl"
      >

        <div className="hero-content text-center py-14">

          <div>

            <Monitor
              size={72}
              className="mx-auto mb-5"
            />

            <h1 className="text-5xl font-black">

              Computer Laboratory CMS

            </h1>

            <p className="mt-5 max-w-3xl text-lg opacity-90">

              Manage Computer Laboratory
              information, facilities,
              laboratory units and images
              through the enterprise CMS.

            </p>

          </div>

        </div>

      </motion.section>

      {/* ==========================================
          DASHBOARD
      ========================================== */}

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

            <div className="stat-figure text-primary">

              <Building2 size={34} />

            </div>

            <div className="stat-title">

              Facilities

            </div>

            <div className="stat-value text-primary">

              {totalFacilities}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

            <div className="stat-figure text-secondary">

              <Cpu size={34} />

            </div>

            <div className="stat-title">

              Laboratory Units

            </div>

            <div className="stat-value text-secondary">

              {totalUnits}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

            <div className="stat-figure text-accent">

              <Image size={34} />

            </div>

            <div className="stat-title">

              Banner

            </div>

            <div className="stat-value text-accent text-lg">

              {hasBanner
                ? "Added"
                : "None"}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

            <div className="stat-figure">

              <Monitor size={34} />

            </div>

            <div className="stat-title">

              Side Image

            </div>

            <div className="stat-value text-lg">

              {hasSideImage
                ? "Added"
                : "None"}

            </div>

          </div>

        </div>

        {/* ==========================================
            MAIN FORM
        ========================================== */}

        <div className="card bg-base-100 shadow-xl border border-base-300 mt-8">

          <div className="card-body">

            <h2 className="card-title text-2xl">

              Computer Laboratory Details

            </h2>

            <div className="grid lg:grid-cols-2 gap-8">

              {/* ======================================
                  LEFT SIDE
              ====================================== */}

              <div className="space-y-6">

                {/* Banner */}

                <div>

                  <label className="label">

                    <span className="label-text">

                      Banner Image

                    </span>

                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                    onChange={handleBannerImage}
                  />

                  <label className="label">

                    <span className="label-text-alt">

                      {getUploadMessage(
                        IMAGE_UPLOAD
                      )}

                    </span>

                  </label>

                  {bannerPreview && (

                    <img
                      src={bannerPreview}
                      alt="Banner"
                      className="w-full h-64 object-cover rounded-2xl mt-4 border border-base-300"
                    />

                  )}

                </div>

                {/* Paragraph */}

                <div>

                  <label className="label">

                    <span className="label-text">

                      Laboratory Description

                    </span>

                  </label>

                  <textarea
                    name="paragraph"
                    value={formData.paragraph}
                    onChange={handleChange}
                    className="textarea textarea-bordered h-56 w-full"
                    placeholder="Describe the Computer Laboratory..."
                  />

                </div>

              </div>

              {/* ======================================
                  RIGHT SIDE
              ====================================== */}

              <div className="space-y-6">

                <div>

                  <label className="label">

                    <span className="label-text">

                      Side Image

                    </span>

                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                    onChange={handleSideImage}
                  />

                  <label className="label">

                    <span className="label-text-alt">

                      {getUploadMessage(
                        IMAGE_UPLOAD
                      )}

                    </span>

                  </label>

                  {sidePreview && (

                    <img
                      src={sidePreview}
                      alt="Side"
                      className="w-full h-64 object-cover rounded-2xl mt-4 border border-base-300"
                    />

                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      
            {/* ==========================================
          FACILITIES
      ========================================== */}

      <div className="max-w-7xl mx-auto px-6 pb-8">

        <div className="card bg-base-100 shadow-xl border border-base-300">

          <div className="card-body">

            <div className="flex justify-between items-center">

              <h2 className="card-title text-2xl">

                Laboratory Facilities

              </h2>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={addFacility}
              >

                <Plus size={18} />

                Add Facility

              </button>

            </div>

            <div className="divider"></div>

              <div
                className="
                  space-y-4
                  max-h-87.5
                  overflow-y-auto
                  pr-2
                "
              >

              {formData.facilities.length === 0 && (

                <div className="alert">

                  No facilities added yet.

                </div>

              )}

              {formData.facilities.map(

                (facility, index) => (

                  <div
                    key={index}
                    className="flex gap-3"
                  >

                    <input
                      type="text"
                      value={facility}
                      placeholder={`Facility ${index + 1}`}
                      onChange={(e)=>

                        updateFacility(

                          index,

                          e.target.value

                        )

                      }
                      className="input input-bordered flex-1"
                    />

                    <button
                      type="button"
                      className="btn btn-error"
                      onClick={()=>

                        removeFacility(index)

                      }
                    >

                      <Trash2 size={18} />

                    </button>

                  </div>

                )

              )}

            </div>

          </div>

        </div>

      </div>

      {/* ==========================================
          LABORATORY UNITS
      ========================================== */}

      <div className="max-w-7xl mx-auto px-6 pb-10">

        <div className="card bg-base-100 shadow-xl border border-base-300">

          <div className="card-body">

            <div className="flex justify-between items-center">

              <h2 className="card-title text-2xl">

                Laboratory Units

              </h2>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={addUnit}
              >

                <Plus size={18} />

                Add Unit

              </button>

            </div>

            <div className="divider"></div>

            <div
  className="
    space-y-8
    max-h-[75vh]
    overflow-y-auto
    pr-3
    scrollbar-custom
  "
>

              {formData.laboratoryUnits.length === 0 && (

                <div className="alert">

                  No laboratory units available.

                </div>

              )}

              {formData.laboratoryUnits.map(

                (unit, index) => (

                  <div
                    key={index}
                    className="rounded-2xl border border-base-300 bg-base-200 p-6"
                  >

                    <div className="flex justify-between items-center mb-5">

                      <h3 className="text-xl font-bold">

                        Unit #{index + 1}

                      </h3>

                      <button
                        type="button"
                        className="btn btn-error btn-sm"
                        onClick={()=>

                          removeUnit(index)

                        }
                      >

                        <Trash2 size={16} />

                        Remove

                      </button>

                    </div>

                    <div className="grid lg:grid-cols-2 gap-5">

                      <input
                        type="text"
                        placeholder="Laboratory Name"
                        className="input input-bordered"
                        value={unit.labName}
                        onChange={(e)=>

                          updateUnit(

                            index,

                            "labName",

                            e.target.value

                          )

                        }
                      />

                      <input
                        type="text"
                        placeholder="Faculty / Teacher"
                        className="input input-bordered"
                        value={unit.labTeacher}
                        onChange={(e)=>

                          updateUnit(

                            index,

                            "labTeacher",

                            e.target.value

                          )

                        }
                      />

                      <input
                        type="text"
                        placeholder="Designation"
                        className="input input-bordered"
                        value={unit.designation}
                        onChange={(e)=>

                          updateUnit(

                            index,

                            "designation",

                            e.target.value

                          )

                        }
                      />

                      <input
                        type="text"
                        placeholder="Qualification"
                        className="input input-bordered"
                        value={unit.qualification}
                        onChange={(e)=>

                          updateUnit(

                            index,

                            "qualification",

                            e.target.value

                          )

                        }
                      />

                    </div>

                    <div className="mt-6">

                      <label className="label">

                        <span className="label-text">

                          Laboratory Image

                        </span>

                      </label>

                      <input
                        type="file"
                        accept="image/*"
                        className="file-input file-input-bordered w-full"
                        onChange={(e)=>

                          handleUnitImage(

                            index,

                            e.target.files?.[0]

                          )

                        }
                      />

                      <label className="label">

                        <span className="label-text-alt">

                          {getUploadMessage(
                            IMAGE_UPLOAD
                          )}

                        </span>

                      </label>

                      {(unit.labImage ||
                        unit.labImageFile) && (

                        <img
    src={unit.labImage}
    alt={unit.labName}
    className="w-full h-56 rounded-2xl object-cover border border-base-300 mt-4"
/>

                      )}

                    </div>

                  </div>

                )

              )}

            </div>

          </div>

        </div>

      </div>

     
            {/* ==========================================
          LIVE WEBSITE PREVIEW
      ========================================== */}

      <div className="max-w-7xl mx-auto px-6 pb-8">

        <div className="card bg-base-100 border border-base-300 shadow-xl">

          <div className="card-body">

            <h2 className="card-title text-2xl">

              Live Website Preview

            </h2>

            <div className="divider"></div>

            <div className="grid lg:grid-cols-2 gap-8">

              {/* Banner */}

              <div>

                <h3 className="font-bold mb-4">

                  Banner Preview

                </h3>

                <div className="rounded-2xl overflow-hidden border border-base-300 bg-base-200">

                  {bannerPreview ? (

                    <img
                      src={bannerPreview}
                      alt="Banner Preview"
                      className="w-full h-72 object-cover"
                    />

                  ) : (

                    <div className="h-72 flex flex-col items-center justify-center">

                      <Image
                        size={70}
                        className="opacity-30"
                      />

                      <p className="mt-4 opacity-60">

                        Banner Preview

                      </p>

                    </div>

                  )}

                </div>

              </div>

              {/* Side */}

              <div>

                <h3 className="font-bold mb-4">

                  Side Image Preview

                </h3>

                <div className="rounded-2xl overflow-hidden border border-base-300 bg-base-200">

                  {sidePreview ? (

                    <img
                      src={sidePreview}
                      alt="Side Preview"
                      className="w-full h-72 object-cover"
                    />

                  ) : (

                    <div className="h-72 flex flex-col items-center justify-center">

                      <Image
                        size={70}
                        className="opacity-30"
                      />

                      <p className="mt-4 opacity-60">

                        Side Image Preview

                      </p>

                    </div>

                  )}

                </div>

              </div>

            </div>

            {/* Description */}

            <div className="mt-8 rounded-2xl border border-base-300 bg-base-200 p-6">

              <h3 className="font-bold text-xl mb-4">

                Laboratory Description

              </h3>

              <p className="leading-8 whitespace-pre-wrap">

                {formData.paragraph ||

                  "Computer Laboratory description will appear here."}

              </p>

            </div>

            {/* Facilities */}

            <div className="mt-8">

              <h3 className="font-bold text-xl mb-5">

                Facilities

              </h3>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">

                {formData.facilities.length > 0 ? (

                  formData.facilities.map(

                    (facility, index) => (

                      <div
                        key={index}
                        className="rounded-xl border border-base-300 bg-base-200 p-4"
                      >

                        {facility}

                      </div>

                    )

                  )

                ) : (

                  <div className="opacity-60">

                    No facilities available.

                  </div>

                )}

              </div>

            </div>

            {/* Laboratory Units */}

            <div className="mt-10">

              <h3 className="font-bold text-xl mb-5">

                Laboratory Units

              </h3>

              <div className="grid lg:grid-cols-2 gap-6">

                {formData.laboratoryUnits.length > 0 ? (

                  formData.laboratoryUnits.map(

                    (unit, index) => (

                      <div
                        key={index}
                        className="rounded-2xl border border-base-300 bg-base-200 overflow-hidden"
                      >

                        {(unit.labImage ||

                          unit.labImageFile) && (

                          <img
                            src={unit.labImage}
                            alt={unit.labName}
                            className="w-full h-52 object-cover"
                          />

                        )}

                        <div className="p-5">

                          <h4 className="font-bold text-lg">

                            {unit.labName ||

                              "Laboratory Name"}

                          </h4>

                          <p className="mt-2">

                            <strong>

                              Faculty:

                            </strong>{" "}

                            {unit.labTeacher ||

                              "-"}

                          </p>

                          <p>

                            <strong>

                              Designation:

                            </strong>{" "}

                            {unit.designation ||

                              "-"}

                          </p>

                          <p>

                            <strong>

                              Qualification:

                            </strong>{" "}

                            {unit.qualification ||

                              "-"}

                          </p>

                        </div>

                      </div>

                    )

                  )

                ) : (

                  <div className="opacity-60">

                    No laboratory units added.

                  </div>

                )}

              </div>

            </div>

            {/* ======================================
                ACTION BUTTONS
            ====================================== */}

            <div className="flex flex-wrap gap-4 mt-10">

              <button
                className="btn btn-primary flex-1"
                onClick={handleSubmit}
              >

                <Save size={18} />

                Save Computer Laboratory

              </button>

              <button
                className="btn btn-outline"
                onClick={resetForm}
              >

                <RefreshCw size={18} />

                Reset

              </button>

              <button
                className="btn btn-error"
                onClick={() =>
                  setDeleteModalOpen(true)
                }
              >

                <Trash2 size={18} />

                Delete

              </button>

            </div>

          </div>

        </div>

      </div>

            {/* ==========================================
          STICKY FOOTER
      ========================================== */}

      <div className="sticky bottom-4 z-40 px-6 pb-6">

        <div className="card bg-base-100 border border-base-300 shadow-2xl">

          <div className="card-body py-5">

            <div className="flex flex-col lg:flex-row justify-between items-center gap-5">

              <div>

                <h3 className="font-bold text-lg">

                  Computer Laboratory Management Dashboard

                </h3>

                <p className="text-base-content/70 text-sm mt-2">

                  Facilities :

                  {" "}

                  {totalFacilities}

                  <br />

                  Laboratory Units :

                  {" "}

                  {totalUnits}

                  <br />

                  Banner :

                  {" "}

                  {hasBanner ? "Configured" : "Not Configured"}

                  <br />

                  Side Image :

                  {" "}

                  {hasSideImage ? "Configured" : "Not Configured"}

                </p>

              </div>

              <div className="flex flex-wrap gap-3">

                <div className="badge badge-primary badge-lg">

                  CMS

                </div>

                <div className="badge badge-secondary badge-lg">

                  Cloudinary

                </div>

                <div className="badge badge-accent badge-lg">

                  Single Document

                </div>

                <div className="badge badge-success badge-lg">

                  Vercel Ready

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ==========================================
          STATUS MODAL
      ========================================== */}

      <StatusModal
        isOpen={statusModal.open}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={closeStatus}
      />

      {/* ==========================================
          LOADING MODAL
      ========================================== */}

      <LoadingModal
        isOpen={loading}
        title="Saving Computer Laboratory"
        message="Please wait while your changes are being processed..."
      />

      {/* ==========================================
          DELETE MODAL
      ========================================== */}

      <DeleteModal
        isOpen={deleteModalOpen}
        itemName="Computer Laboratory"
        onCancel={() =>
          setDeleteModalOpen(false)
        }
        onConfirm={confirmDelete}
      />

    </div>

  );

};

export default ComputerlabControl;