import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";

import {
  Video,
  PlayCircle,
  Users,
  Plus,
  Trash2,
  Save,
} from "lucide-react";

import api from "../../../../services/api";


import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";

export default function VideogalleryControl() {

  /* ==========================================================
      STATE
  ========================================================== */

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    videoData,
    setVideoData,
  ] = useState({
    bannerVideo: "",
    promoVideo: "",
    paragraph: "",
    alumniTalks: [],
  });

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
      DASHBOARD STATS
  ========================================================== */

  const stats = useMemo(
    () => ({

      banner:
        videoData.bannerVideo
          ? 1
          : 0,

      promo:
        videoData.promoVideo
          ? 1
          : 0,

      talks:
        videoData
          .alumniTalks
          ?.length || 0,

    }),
    [videoData]
  );

  /* ==========================================================
      HELPERS
  ========================================================== */

  const resetGallery =
    () => {

      setVideoData({

        bannerVideo: "",

        promoVideo: "",

        paragraph: "",

        alumniTalks: [],

      });

    };

  /* ==========================================================
      Continue in Part 2
  ========================================================== */
    /* ==========================================================
      LOAD DATA
  ========================================================== */

  const loadData =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.get(
            "/videogallery"
          );

        if (
          res.data.data
        ) {

          setVideoData(
            res.data.data
          );

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
            "Failed to load Video Gallery.",
        });

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    loadData();

  }, []);

  /* ==========================================================
      YOUTUBE EMBED
  ========================================================== */

  const getEmbedUrl =
    (url) => {

      if (!url)
        return "";

      if (
        url.includes(
          "youtu.be/"
        )
      ) {

        const videoId =
          url
            .split(
              "youtu.be/"
            )[1]
            .split("?")[0];

        return `https://www.youtube.com/embed/${videoId}`;

      }

      if (
        url.includes(
          "watch?v="
        )
      ) {

        const videoId =
          url
            .split(
              "watch?v="
            )[1]
            .split("&")[0];

        return `https://www.youtube.com/embed/${videoId}`;

      }

      if (
        url.includes(
          "/embed/"
        )
      ) {

        return url;

      }

      return "";

    };

  /* ==========================================================
      INPUT CHANGE
  ========================================================== */

  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;

      setVideoData(
        (prev) => ({

          ...prev,

          [name]:
            value,

        })
      );

    };

  /* ==========================================================
      Continue in Part 3
  ========================================================== */
    /* ==========================================================
      ALUMNI TALKS
  ========================================================== */

  const addAlumniTalk =
    () => {

      setVideoData(
        (prev) => ({

          ...prev,

          alumniTalks: [

            ...prev.alumniTalks,

            {
              title: "",
              videoUrl: "",
            },

          ],

        })
      );

    };

  const updateAlumniTalk =
    (
      index,
      field,
      value
    ) => {

      setVideoData(
        (prev) => {

          const talks =
            [
              ...prev.alumniTalks,
            ];

          talks[index] = {

            ...talks[index],

            [field]:
              value,

          };

          return {

            ...prev,

            alumniTalks:
              talks,

          };

        }
      );

    };

  const removeAlumniTalk =
    (index) => {

      setVideoData(
        (prev) => ({

          ...prev,

          alumniTalks:
            prev.alumniTalks.filter(
              (
                _,
                i
              ) =>
                i !==
                index
            ),

        })
      );

    };

  /* ==========================================================
      CREATE
  ========================================================== */

  const createGallery =
    async () => {

      try {

        setSaving(true);

        const res =
          await api.post(
            "/videogallery",
            videoData
          );

        setStatusModal({

          isOpen: true,

          type: "success",

          title:
            "Success",

          message:
            res.data.message,

        });

        await loadData();

      } catch (error) {

        setStatusModal({

          isOpen: true,

          type: "error",

          title:
            "Creation Failed",

          message:
            error.response?.data
              ?.message ||
            "Failed to create Video Gallery.",

        });

      } finally {

        setSaving(false);

      }

    };

  /* ==========================================================
      UPDATE
  ========================================================== */

  const updateGallery =
    async () => {

      try {

        setSaving(true);

        const res =
          await api.put(
            "/videogallery",
            videoData
          );

        setStatusModal({

          isOpen: true,

          type: "success",

          title:
            "Success",

          message:
            res.data.message,

        });

        await loadData();

      } catch (error) {

        setStatusModal({

          isOpen: true,

          type: "error",

          title:
            "Update Failed",

          message:
            error.response?.data
              ?.message ||
            "Failed to update Video Gallery.",

        });

      } finally {

        setSaving(false);

      }

    };

  /* ==========================================================
      DELETE
  ========================================================== */

  const deleteGallery =
    () => {

      setDeleteModal({

        isOpen: true,

        title:
          "Delete Video Gallery",

        message:
          "This will permanently delete the entire Video Gallery. Continue?",

        onConfirm:
          async () => {

            try {

              const res =
                await api.delete(
                  "/videogallery"
                );

              resetGallery();

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
                  "Failed to delete Video Gallery.",

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
      JSX
  ========================================================== */

  if (loading) {

    return (

      <LoadingModal
        isOpen
        title="Loading Video Gallery"
        message="Fetching gallery content..."
      />

    );

  }

  return (

    <>

      <LoadingModal
        isOpen={saving}
        title="Please Wait"
        message="Saving changes..."
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
          duration: 0.3,
        }}
        className="min-h-screen bg-base-200 p-4 md:p-6"
      >

        <div className="max-w-7xl mx-auto space-y-6">

          {/* ==========================================================
              Continue in Part 4
          ========================================================== */}
                    {/* ==========================================================
              HERO HEADER
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
            className="hero bg-linear-to-r from-primary to-secondary rounded-3xl shadow-xl"
          >

            <div className="hero-content text-center text-primary-content py-10">

              <div>

                <Video
                  size={64}
                  className="mx-auto mb-4"
                />

                <h1 className="text-4xl md:text-5xl font-black">

                  Video Gallery CMS

                </h1>

                <p className="mt-3 text-lg opacity-90">

                  Manage Banner Video,
                  Promotional Video and
                  Alumni Talks from one
                  enterprise dashboard.

                </p>

              </div>

            </div>

          </motion.div>

          {/* ==========================================================
              DASHBOARD STATS
          ========================================================== */}

          <div className="grid md:grid-cols-3 gap-6">

            <motion.div
              whileHover={{
                y: -5,
              }}
              className="stats bg-base-100 shadow border border-base-300"
            >

              <div className="stat">

                <div className="stat-figure text-primary">

                  <Video size={30} />

                </div>

                <div className="stat-title">

                  Banner Video

                </div>

                <div className="stat-value text-primary">

                  {stats.banner}

                </div>

              </div>

            </motion.div>

            <motion.div
              whileHover={{
                y: -5,
              }}
              className="stats bg-base-100 shadow border border-base-300"
            >

              <div className="stat">

                <div className="stat-figure text-secondary">

                  <PlayCircle size={30} />

                </div>

                <div className="stat-title">

                  Promotional Video

                </div>

                <div className="stat-value text-secondary">

                  {stats.promo}

                </div>

              </div>

            </motion.div>

            <motion.div
              whileHover={{
                y: -5,
              }}
              className="stats bg-base-100 shadow border border-base-300"
            >

              <div className="stat">

                <div className="stat-figure text-success">

                  <Users size={30} />

                </div>

                <div className="stat-title">

                  Alumni Talks

                </div>

                <div className="stat-value text-success">

                  {stats.talks}

                </div>

              </div>

            </motion.div>

          </div>

          {/* ==========================================================
              MAIN CONTENT
          ========================================================== */}

          <div className="grid lg:grid-cols-2 gap-8">

            {/* ==========================================================
                LEFT PANEL
            ========================================================== */}

            <div className="space-y-6">

              {/* ==========================================================
                  BANNER VIDEO
              ========================================================== */}

              <div className="card bg-base-100 border border-base-300 shadow-xl">

                <div className="card-body">

                  <h2 className="card-title text-2xl font-black">

                    Banner Video

                  </h2>

                  <input
                    type="text"
                    name="bannerVideo"
                    value={videoData.bannerVideo}
                    onChange={handleChange}
                    placeholder="Paste YouTube URL"
                    className="input input-bordered w-full"
                  />

                  {videoData.bannerVideo && (

                    <div className="mt-4 overflow-hidden rounded-2xl">

                      <iframe
                        src={getEmbedUrl(
                          videoData.bannerVideo
                        )}
                        title="Banner Video"
                        className="w-full h-62.5 rounded-2xl"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />

                    </div>

                  )}

                </div>

              </div>

              {/* ==========================================================
                  Continue in Part 5
              ========================================================== */}
                            {/* ==========================================================
                  DESCRIPTION
              ========================================================== */}

              <div className="card bg-base-100 border border-base-300 shadow-xl">

                <div className="card-body">

                  <h2 className="card-title text-2xl font-black">

                    Gallery Description

                  </h2>

                  <textarea
                    rows="8"
                    name="paragraph"
                    value={videoData.paragraph}
                    onChange={handleChange}
                    placeholder="Enter gallery description..."
                    className="textarea textarea-bordered w-full"
                  />

                </div>

              </div>

              {/* ==========================================================
                  PROMOTIONAL VIDEO
              ========================================================== */}

              <div className="card bg-base-100 border border-base-300 shadow-xl">

                <div className="card-body">

                  <h2 className="card-title text-2xl font-black">

                    Promotional Video

                  </h2>

                  <input
                    type="text"
                    name="promoVideo"
                    value={videoData.promoVideo}
                    onChange={handleChange}
                    placeholder="Paste YouTube URL"
                    className="input input-bordered w-full"
                  />

                  {videoData.promoVideo && (

                    <div className="mt-4 overflow-hidden rounded-2xl">

                      <iframe
                        src={getEmbedUrl(
                          videoData.promoVideo
                        )}
                        title="Promotional Video"
                        className="w-full h-62.5 rounded-2xl"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />

                    </div>

                  )}

                </div>

              </div>

              {/* ==========================================================
                  Continue in Part 6
              ========================================================== */}
                            {/* ==========================================================
                  ALUMNI TALKS
              ========================================================== */}

              <div className="card bg-base-100 border border-base-300 shadow-xl">

                <div className="card-body">

                  <div className="flex items-center justify-between">

                    <h2 className="card-title text-2xl font-black">

                      Alumni Talks

                    </h2>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={addAlumniTalk}
                    >

                      <Plus size={18} />

                      Add Talk

                    </button>

                  </div>

                  <div className="space-y-5
                        max-h-[75vh]
                        overflow-y-auto
                        pr-2
                    ">

                    {videoData.alumniTalks.length > 0 ? (

                      videoData.alumniTalks.map(
                        (
                          talk,
                          index
                        ) => (

                          <motion.div
                            key={index}
                            whileHover={{
                              y: -3,
                            }}
                            className="border border-base-300 rounded-3xl p-5 bg-base-200"
                          >

                            <div className="grid gap-4">

                              <input
                                type="text"
                                placeholder="Alumni Talk Title"
                                className="input input-bordered w-full"
                                value={talk.title}
                                onChange={(e) =>
                                  updateAlumniTalk(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                              />

                              <input
                                type="text"
                                placeholder="Paste YouTube URL"
                                className="input input-bordered w-full"
                                value={talk.videoUrl}
                                onChange={(e) =>
                                  updateAlumniTalk(
                                    index,
                                    "videoUrl",
                                    e.target.value
                                  )
                                }
                              />

                              {talk.videoUrl && (

                                <div className="overflow-hidden rounded-2xl">

                                  <iframe
                                    src={getEmbedUrl(
                                      talk.videoUrl
                                    )}
                                    title={
                                      talk.title ||
                                      `Talk-${index}`
                                    }
                                    className="w-full h-55 rounded-2xl"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />

                                </div>

                              )}

                              <div className="flex justify-end">

                                <button
                                  type="button"
                                  className="btn btn-error btn-sm"
                                  onClick={() =>
                                    removeAlumniTalk(
                                      index
                                    )
                                  }
                                >

                                  <Trash2
                                    size={16}
                                  />

                                  Remove Talk

                                </button>

                              </div>

                            </div>

                          </motion.div>

                        )
                      )

                    ) : (

                      <div className="text-center py-12">

                        <Users
                          size={60}
                          className="mx-auto opacity-30"
                        />

                        <h3 className="text-xl font-bold mt-4">

                          No Alumni Talks

                        </h3>

                        <p className="text-base-content/60 mt-2">

                          Click <strong>Add Talk</strong> to
                          showcase alumni success stories.

                        </p>

                      </div>

                    )}

                  </div>

                </div>

              </div>

              {/* ==========================================================
                  Continue in Part 7
              ========================================================== */}
                            {/* ==========================================================
                  ACTION BUTTONS
              ========================================================== */}

              <div className="card bg-base-100 border border-base-300 shadow-xl">

                <div className="card-body">

                  <div className="grid md:grid-cols-3 gap-4">

                    <button
                      type="button"
                      onClick={createGallery}
                      disabled={saving}
                      className="btn btn-success"
                    >

                      <Save size={18} />

                      {saving
                        ? "Processing..."
                        : "Create"}

                    </button>

                    <button
                      type="button"
                      onClick={updateGallery}
                      disabled={saving}
                      className="btn btn-warning"
                    >

                      <Save size={18} />

                      {saving
                        ? "Processing..."
                        : "Update"}

                    </button>

                    <button
                      type="button"
                      onClick={deleteGallery}
                      disabled={saving}
                      className="btn btn-error"
                    >

                      <Trash2 size={18} />

                      Delete Gallery

                    </button>

                  </div>

                </div>

              </div>

            </div>

            {/* ==========================================================
                RIGHT PANEL
            ========================================================== */}

            <div>

              <div className="sticky top-24">

                <div className="card bg-base-100 border border-base-300 shadow-2xl">

                  <div className="card-body">

                    <h2 className="card-title text-3xl font-black mb-4">

                      Live Preview

                    </h2>

                    {/* ==========================================================
                        BANNER PREVIEW
                    ========================================================== */}

                    {videoData.bannerVideo && (

                      <div className="mb-8">

                        <h3 className="font-bold text-lg mb-3">

                          Banner Video

                        </h3>

                        <div className="overflow-hidden rounded-3xl">

                          <iframe
                            src={getEmbedUrl(
                              videoData.bannerVideo
                            )}
                            title="Banner Preview"
                            className="w-full h-62.5 rounded-2xl"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />

                        </div>

                      </div>

                    )}

                    {/* ==========================================================
                        DESCRIPTION PREVIEW
                    ========================================================== */}

                    {videoData.paragraph && (

                      <div className="mb-8">

                        <h3 className="font-bold text-lg mb-3">

                          Description

                        </h3>

                        <div className="bg-base-200 rounded-3xl p-5">

                          <p className="leading-relaxed whitespace-pre-wrap">

                            {videoData.paragraph}

                          </p>

                        </div>

                      </div>

                    )}

                    {/* ==========================================================
                        Continue in Part 8
                    ========================================================== */}
                                        {/* ==========================================================
                        PROMOTIONAL VIDEO PREVIEW
                    ========================================================== */}

                    {videoData.promoVideo && (

                      <div className="mb-8">

                        <h3 className="font-bold text-lg mb-3">

                          Promotional Video

                        </h3>

                        <div className="overflow-hidden rounded-3xl">

                          <iframe
                            src={getEmbedUrl(
                              videoData.promoVideo
                            )}
                            title="Promo Preview"
                            className="w-full h-62.5 rounded-2xl"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />

                        </div>

                      </div>

                    )}

                    {/* ==========================================================
                        ALUMNI TALKS PREVIEW
                    ========================================================== */}

                    {videoData.alumniTalks.length > 0 && (

                      <div>

                        <h3 className="font-bold text-lg mb-4">

                          Alumni Talks

                        </h3>

                        <div className="grid gap-4">

                          {videoData.alumniTalks.map(
                            (
                              talk,
                              index
                            ) => (

                              <motion.div
                                key={index}
                                whileHover={{
                                  y: -3,
                                }}
                                className="bg-base-200 rounded-3xl p-4 border border-base-300"
                              >

                                <h4 className="font-bold text-center mb-3">

                                  {talk.title ||
                                    "Untitled Alumni Talk"}

                                </h4>

                                {talk.videoUrl ? (

                                  <iframe
                                    src={getEmbedUrl(
                                      talk.videoUrl
                                    )}
                                    title={
                                      talk.title ||
                                      `Talk-${index}`
                                    }
                                    className="w-full h-55 rounded-2xl"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />

                                ) : (

                                  <div className="h-55 rounded-2xl bg-base-300 flex items-center justify-center text-base-content/60">

                                    No video selected

                                  </div>

                                )}

                              </motion.div>

                            )
                          )}

                        </div>

                      </div>

                    )}

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ==========================================================
              Continue in Part 9
          ========================================================== */}
                    {/* ==========================================================
              STICKY FOOTER
          ========================================================== */}

          <div className="sticky bottom-4 z-50 mt-6">

            <div className="card bg-base-100 border border-base-300 shadow-2xl">

              <div className="card-body py-4">

                <div className="flex flex-col lg:flex-row justify-between items-center gap-4">

                  <div>

                    <h3 className="font-black text-lg">

                      Video Gallery CMS

                    </h3>

                    <p className="text-base-content/60">

                      Manage banner videos,
                      promotional videos and
                      alumni talks from one
                      enterprise dashboard.

                    </p>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    <div className="badge badge-primary badge-lg">

                      Banner:
                      {" "}
                      {stats.banner}

                    </div>

                    <div className="badge badge-secondary badge-lg">

                      Promo:
                      {" "}
                      {stats.promo}

                    </div>

                    <div className="badge badge-success badge-lg">

                      Talks:
                      {" "}
                      {stats.talks}

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </motion.div>

    </>

  );

}
