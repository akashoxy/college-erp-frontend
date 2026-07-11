import {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  Radio,
  List,
  Save,
  Trash2,
  Eye,
  Database,
} from "lucide-react";

import {
  Video,
} from "lucide-react";

import api from "../../../../services/api";


import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";

const RadioTihControl = () => {

  /* ======================================================
      INITIAL FORM
  ====================================================== */

  const initialForm = {

    bannerVideo: "",

    programList: "",

  };

  /* ======================================================
      STATES
  ====================================================== */

  const [
    formData,
    setFormData,
  ] = useState(
    initialForm
  );

  const [
    radioData,
    setRadioData,
  ] = useState(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    fetching,
    setFetching,
  ] = useState(true);

  const [
    deleteModalOpen,
    setDeleteModalOpen,
  ] = useState(false);

  /* ======================================================
      STATUS MODAL
  ====================================================== */

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

  const loadData =
    async () => {

      try {

        setFetching(true);

        const {
          data,
        } = await api.get(
          "/radio-tih"
        );

       if (data.success && data.data) {
  setRadioData(data.data);

  setFormData({
    bannerVideo: data.data.bannerVideo || "",
    programList: (data.data.programList || []).join("\n"),
  });
}

      }

      catch (error) {

        showStatus(

          "error",

          "Load Failed",

          error.response?.data
            ?.message ||

            "Unable to load Radio TIH."

        );

      }

      finally {

        setFetching(
          false
        );

      }

    };

  useEffect(() => {

    loadData();

  }, []);

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

  const resetForm =
    () => {

      setFormData(
        initialForm
      );

    };

    /* ======================================================
    EDIT
====================================================== */

const handleEdit = () => {
  if (!radioData) return;

  setFormData({
    bannerVideo: radioData.bannerVideo || "",
    programList: (radioData.programList || []).join("\n"),
  });
};

  /* ======================================================
      YOUTUBE ID
  ====================================================== */

  const getYoutubeId =
    (url) => {

      if (!url)
        return "";

      if (
        url.includes(
          "youtu.be/"
        )
      ) {

        return url
          .split(
            "youtu.be/"
          )[1]
          .split("?")[0];

      }

      if (
        url.includes(
          "watch?v="
        )
      ) {

        return url
          .split(
            "watch?v="
          )[1]
          .split("&")[0];

      }

      return "";

    };

  /* ======================================================
      SAVE
  ====================================================== */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(
          true
        );

        const payload = {

          bannerVideo:
            formData.bannerVideo.trim(),

          programList:

            formData.programList

              .split(/[\n,]+/)

              .map(
                (item) =>
                  item.trim()
              )

              .filter(Boolean),

        };

        const {
          data,
        } = await api.post(

          "/radio-tih",

          payload

        );

        showStatus(

          "success",

          "Saved",

          data.message

        );

        await loadData();

        resetForm();

      }

      catch (error) {

        showStatus(

          "error",

          "Save Failed",

          error.response?.data
            ?.message ||

            "Unable to save Radio TIH."

        );

      }

      finally {

        setLoading(
          false
        );

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

        setLoading(
          true
        );

        const {
          data,
        } = await api.delete(
          "/radio-tih"
        );

        showStatus(

          "success",

          "Deleted",

          data.message

        );

        setRadioData(
          null
        );

        resetForm();

      }

      catch (error) {

        showStatus(

          "error",

          "Delete Failed",

          error.response?.data
            ?.message ||

            "Unable to delete Radio TIH."

        );

      }

      finally {

        setLoading(
          false
        );

      }

    };

  /* ======================================================
      STATS
  ====================================================== */

  const totalPrograms =

    formData.programList

      ? formData.programList

          .split(/[\n,]+/)

          .filter(Boolean)

          .length

      : radioData?.programList
          ?.length || 0;

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

              <Radio
                size={70}
                className="mx-auto mb-5"
              />

              <h1 className="text-5xl font-black">

                Radio TIH Management

              </h1>

              <p className="mt-4 text-lg opacity-90 max-w-3xl">

                Manage Radio Techno India Hooghly
                banner videos and radio programs
                through a professional ERP dashboard.

              </p>

            </div>

          </div>

        </motion.div>

        {/* ======================================================
            DASHBOARD STATS
        ====================================================== */}

        <div className="grid md:grid-cols-3 gap-6">

          <div className="stat bg-base-100 rounded-3xl border border-base-300 shadow">

            <div className="stat-figure text-primary">

              <Database size={34} />

            </div>

            <div className="stat-title">

              Status

            </div>

            <div className="stat-value text-primary">

              {radioData ? "Ready" : "Empty"}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl border border-base-300 shadow">

            <div className="stat-figure text-secondary">

              <List size={34} />

            </div>

            <div className="stat-title">

              Programs

            </div>

            <div className="stat-value text-secondary">

              {totalPrograms}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl border border-base-300 shadow">

            <div className="stat-figure text-accent">

              <Video  size={34} />

            </div>

            <div className="stat-title">

              Video

            </div>

            <div className="stat-value text-accent">

              {(formData.bannerVideo ||
                radioData?.bannerVideo)

                ? "Ready"

                : "Pending"}

            </div>

          </div>

        </div>

        {/* ======================================================
            FORM + LIVE PREVIEW
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

                Radio TIH CMS

              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {/* ======================================================
                    PROGRAM LIST
                ====================================================== */}

                <div>

                  <label className="label">

                    <span className="label-text font-semibold">

                      Program List

                    </span>

                  </label>

                  <textarea
                    name="programList"
                    value={formData.programList}
                    onChange={handleChange}
                    rows={10}
                    className="textarea textarea-bordered w-full"
                    placeholder="One program per line or comma separated..."
                  />

                  <label className="label">

                    <span className="label-text-alt">

                      Total Programs :
                      {" "}
                      {totalPrograms}

                    </span>

                  </label>

                </div>

                {/* ======================================================
                    VIDEO URL
                ====================================================== */}

                <div>

                  <label className="label">

                    <span className="label-text font-semibold">

                      YouTube Video URL

                    </span>

                  </label>

                  <input
                    type="url"
                    name="bannerVideo"
                    value={formData.bannerVideo}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />

                  <label className="label">

                    <span className="label-text-alt">

                      Supports YouTube watch and
                      youtu.be links

                    </span>

                  </label>

                </div>

                {/* ======================================================
                    ACTION BUTTONS
                ====================================================== */}

                <div className="flex flex-wrap gap-4">

                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={loading}
                  >

                    <Save size={18} />

                    Save Content

                  </button>
                   {radioData && (
                      <button
                        type="button"
                        className="btn btn-info"
                        onClick={handleEdit}
                      >
                        <Eye size={18} />
                        Edit Content
                      </button>
                    )}

                  {radioData && (

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

                      Delete Content

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
                  VIDEO PREVIEW
              ====================================================== */}

              {(formData.bannerVideo ||

                radioData?.bannerVideo)

                ? (

                  <div className="aspect-video rounded-2xl overflow-hidden border border-base-300">

                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${getYoutubeId(

                        formData.bannerVideo ||

                        radioData?.bannerVideo

                      )}`}
                      title="Radio TIH Preview"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />

                  </div>

                )

                : (

                  <div className="aspect-video rounded-2xl border-2 border-dashed border-base-300 bg-base-200 flex items-center justify-center">

                    <div className="text-center">

                      <Video 
                        size={70}
                        className="mx-auto opacity-30"
                      />

                      <p className="mt-4 text-base-content/60">

                        YouTube Video Preview

                      </p>

                    </div>

                  </div>

                )}

              {/* ======================================================
                  PROGRAM LIST PREVIEW
              ====================================================== */}

              <div className="mt-8">

                <h3 className="font-bold text-xl mb-4">

                  Program Preview

                </h3>

                <div className="rounded-2xl bg-base-200 border border-base-300 p-6 min-h-65">

                  {formData.programList ? (

                    <ul className="space-y-3 list-disc list-inside">

                      {formData.programList

                        .split(/[\n,]+/)

                        .filter(

                          (item) =>

                            item.trim() !== ""

                        )

                        .map(

                          (

                            program,

                            index

                          ) => (

                            <li
                              key={index}
                            >

                              {program.trim()}

                            </li>

                          )

                        )}

                    </ul>

                  ) : radioData?.programList?.length ? (

                    <ul className="space-y-3 list-disc list-inside">

                      {radioData.programList.map(

                        (

                          program,

                          index

                        ) => (

                          <li
                            key={index}
                          >

                            {program}

                          </li>

                        )

                      )}

                    </ul>

                  ) : (

                    <div className="h-full flex items-center justify-center">

                      <p className="text-base-content/50">

                        Program List Preview

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
        title="Saving Radio TIH Content"
        message="Please wait while your changes are being saved..."
      />

      {/* ======================================================
          DELETE MODAL
      ====================================================== */}

      <DeleteModal
        isOpen={deleteModalOpen}
        itemName="Radio TIH Content"
        onCancel={() =>
          setDeleteModalOpen(false)
        }
        onConfirm={confirmDelete}
      />

    </div>

  );

};

export default RadioTihControl;