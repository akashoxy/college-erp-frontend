import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  LayoutDashboard,
  Gamepad2,
  Image,
  Save,
  Monitor,
  Sparkles,
  Trash2,
  Pencil,
  RefreshCw,
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

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const CommonRoomControl = () => {

  /* ==========================================
      INITIAL STATE
  ========================================== */

  const initialHero = {

    heroSubtitle:
      "",

    heroImage:
      "",

    aboutText:
      "",

  };

  const initialGame = {

    title: "",

    description: "",

    image: "",

    imageFile: null,

    featured: false,

  };

  /* ==========================================
      STATES
  ========================================== */

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    fetching,
    setFetching,
  ] = useState(true);

  const [
    heroData,
    setHeroData,
  ] = useState(initialHero);

  const [
    games,
    setGames,
  ] = useState([]);

  const [
    editingGameId,
    setEditingGameId,
  ] = useState(null);

  const [
    gameForm,
    setGameForm,
  ] = useState(initialGame);

  const [
    heroPreview,
    setHeroPreview,
  ] = useState("");

  const [
    deleteModalOpen,
    setDeleteModalOpen,
  ] = useState(false);

  const [
    gameDeleteId,
    setGameDeleteId,
  ] = useState(null);

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
          "/common-room"
        );

        const cms =
          data.data;

        setHeroData({

          heroSubtitle:
            cms?.heroSubtitle || "",

          heroImage:
            null,

          aboutText:
            cms?.aboutText || "",

        });

        setHeroPreview(

          cms?.heroImage || ""

        );

        setGames(

          cms?.games || []

        );

      }

      catch (

        error

      ) {

        showStatus(

          "error",

          "Load Failed",

          error.response?.data
            ?.message ||

            "Unable to load Common Room."

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

  useEffect(() => {

    return () => {

        cleanupBlobUrl(heroPreview);

        cleanupBlobUrl(gameForm.image);

    };

}, [heroPreview, gameForm.image]);

  /* ==========================================
      HERO IMAGE
  ========================================== */

  const handleHeroImage =
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

        heroPreview

      );

      const preview = previewFile(file);

setHeroPreview(preview.preview);

      setHeroData(

        (prev) => ({

          ...prev,

          heroImage:
            file,

        })

      );

    };

  /* ==========================================
      TEXT CHANGE
  ========================================== */

  const handleHeroChange =
    (e) => {

      const {

        name,

        value,

      } = e.target;

      setHeroData(

        (prev) => ({

          ...prev,

          [name]:
            value,

        })

      );

    };

  /* ==========================================
      RESET HERO
  ========================================== */

  const resetHero =
    () => {

      cleanupBlobUrl(

        heroPreview

      );

      setHeroData(initialHero);

setHeroPreview("");

loadData();

    };


    /* ==========================================
      SAVE COMMON ROOM
  ========================================== */

  const saveCommonRoom =
    async () => {

      try {

        setLoading(true);

        const formData =
          new FormData();

        formData.append(

          "heroSubtitle",

          heroData.heroSubtitle

        );

        formData.append(

          "aboutText",

          heroData.aboutText

        );

        if (
          heroData.heroImage
        ) {

          formData.append(

            "heroImage",

            heroData.heroImage

          );

        }

        const {
          data,
        } = await api.post(

          "/common-room",

          formData

        );

        showStatus(

          "success",

          "Saved",

          data.message

        );

        await loadData();

      }

      catch (

        error

      ) {

        showStatus(

          "error",

          "Save Failed",

          error.response?.data
            ?.message ||

            "Unable to save Common Room."

        );

      }

      finally {

        setLoading(
          false
        );

      }

    };

  /* ==========================================
      DELETE HERO IMAGE
  ========================================== */

  const deleteHeroImage =
    async () => {

      try {

        setLoading(true);

        const {
          data,
        } = await api.delete(

          "/common-room/hero-image"

        );

        showStatus(

          "success",

          "Deleted",

          data.message

        );

        cleanupBlobUrl(
          heroPreview
        );

        setHeroPreview("");

        setHeroData(

          (prev) => ({

            ...prev,

            heroImage: null,

          })

        );

      }

      catch (

        error

      ) {

        showStatus(

          "error",

          "Delete Failed",

          error.response?.data
            ?.message ||

            "Unable to delete hero image."

        );

      }

      finally {

        setLoading(
          false
        );

      }

    };

  /* ==========================================
      GAME IMAGE
  ========================================== */

  const handleGameImage =
    (file) => {

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

      if (

        gameForm.image?.startsWith(
          "blob:"
        )

      ) {

        cleanupBlobUrl(

          gameForm.image

        );

      }

      const preview = previewFile(file);

setGameForm(prev => ({
    ...prev,
    image: preview.preview,
    imageFile: file,
}));

    };

  /* ==========================================
      GAME INPUT
  ========================================== */

  const handleGameChange =
    (e) => {

      const {

        name,

        value,

        type,

        checked,

      } = e.target;

      setGameForm(

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

  /* ==========================================
      ADD GAME
  ========================================== */

  const addGame =
    async (e) => {

      e.preventDefault();
      if (!gameForm.title.trim()) {

    showStatus(
        "error",
        "Title Required",
        "Please enter the game title."
    );

    return;

}

if (!gameForm.description.trim()) {

    showStatus(
        "error",
        "Description Required",
        "Please enter the description."
    );

    return;

}

if (!editingGameId && !gameForm.imageFile) {

    showStatus(
        "error",
        "Image Required",
        "Please upload a game image."
    );

    return;

}

      try {

        setLoading(true);

        const formData =
          new FormData();

        formData.append(

          "title",

          gameForm.title

        );

        formData.append(

          "description",

          gameForm.description

        );

        formData.append(

          "featured",

          gameForm.featured

        );

        if (
          gameForm.imageFile
        ) {

          formData.append(

            "image",

            gameForm.imageFile

          );

        }

        const {
          data,
        } = await api.post(

          "/common-room/games",

          formData

        );

        showStatus(

          "success",

          "Game Added",

          data.message

        );

        if (

          gameForm.image?.startsWith(
            "blob:"
          )

        ) {

          cleanupBlobUrl(

            gameForm.image

          );

        }

        setGameForm(
          initialGame
        );

        await loadData();

      }

      catch (

        error

      ) {

        showStatus(

          "error",

          "Add Failed",

          error.response?.data
            ?.message ||

            "Unable to add game."

        );

      }

      finally {

        setLoading(
          false
        );

      }

    };

  /* ==========================================
      UPDATE GAME
  ========================================== */

  const updateGame =
    async (e) => {

      e.preventDefault();

      if (!gameForm.title.trim()) {

    showStatus(
        "error",
        "Title Required",
        "Please enter the game title."
    );

    return;

}

if (!gameForm.description.trim()) {

    showStatus(
        "error",
        "Description Required",
        "Please enter the description."
    );

    return;

}

if (!editingGameId && !gameForm.imageFile) {

    showStatus(
        "error",
        "Image Required",
        "Please upload a game image."
    );

    return;

}

      try {

        setLoading(true);

        const formData =
          new FormData();

        formData.append(

          "title",

          gameForm.title

        );

        formData.append(

          "description",

          gameForm.description

        );

        formData.append(

          "featured",

          gameForm.featured

        );

        if (
          gameForm.imageFile
        ) {

          formData.append(

            "image",

            gameForm.imageFile

          );

        }

        const {
          data,
        } = await api.put(

          `/common-room/games/${editingGameId}`,

          formData

        );

        showStatus(

          "success",

          "Updated",

          data.message

        );

        if (

          gameForm.image?.startsWith(
            "blob:"
          )

        ) {

          cleanupBlobUrl(

            gameForm.image

          );

        }

        setEditingGameId(
          null
        );

        setGameForm(
          initialGame
        );

        await loadData();

      }

      catch (

        error

      ) {

        showStatus(

          "error",

          "Update Failed",

          error.response?.data
            ?.message ||

            "Unable to update game."

        );

      }

      finally {

        setLoading(
          false
        );

      }

    };

  
    /* ==========================================
      DELETE GAME
  ========================================== */

 const confirmDeleteGame = async () => {

  if (!gameDeleteId) return;

  try {

    setDeleteModalOpen(false);
    setLoading(true);

    /* ======================================
       DELETE ENTIRE COMMON ROOM
    ====================================== */

    if (gameDeleteId === "DELETE_ALL") {

      const { data } = await api.delete(
        "/common-room"
      );

      showStatus(
        "success",
        "Deleted",
        data.message
      );

      setGameDeleteId(null);

      await loadData();

      return;

    }

    /* ======================================
       DELETE SINGLE GAME
    ====================================== */

    const { data } = await api.delete(
      `/common-room/games/${gameDeleteId}`
    );

    showStatus(
      "success",
      "Game Deleted",
      data.message
    );

    setGameDeleteId(null);

    await loadData();

  }

  catch (error) {

    showStatus(
      "error",
      "Delete Failed",
      error.response?.data?.message ||
      "Unable to delete."
    );

  }

  finally {

    setLoading(false);

  }

};

  /* ==========================================
      EDIT GAME
  ========================================== */

  const editGame =
    (game) => {

      if (

        gameForm.image?.startsWith(
          "blob:"
        )

      ) {

        cleanupBlobUrl(
          gameForm.image
        );

      }

      setEditingGameId(
        game._id
      );

      setGameForm({

        title:
          game.title || "",

        description:
          game.description || "",

        image:
          game.image || "",

        imageFile:
          null,

        featured:
          game.featured || false,

      });

      window.scrollTo({

        top: 0,

        behavior:
          "smooth",

      });

    };

  /* ==========================================
      RESET GAME FORM
  ========================================== */

  const resetGameForm =
    () => {

      if (

        gameForm.image?.startsWith(
          "blob:"
        )

      ) {

        cleanupBlobUrl(
          gameForm.image
        );

      }

      setEditingGameId(
        null
      );

      setGameForm(
        initialGame
      );

    };

  /* ==========================================
      DASHBOARD STATS
  ========================================== */

  const totalGames =
    games.length;

  const featuredGames =
    useMemo(

      () =>

        games.filter(

          (game) =>

            game.featured

        ).length,

      [games]

    );

  const hasHeroImage =
    !!heroPreview;

  /* ==========================================
      RETURN
  ========================================== */

  return (

    <div className="min-h-screen bg-base-200">

      {/* ==========================================
          HERO
      ========================================== */}

      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="hero bg-linear-to-r from-primary via-secondary to-accent text-primary-content rounded-b-3xl shadow-2xl"
      >

        <div className="hero-content text-center py-14">

          <div>

            <LayoutDashboard
              size={72}
              className="mx-auto mb-5"
            />

            <h1 className="text-5xl font-black">

              Common Room CMS

            </h1>

            <p className="mt-5 max-w-3xl text-lg opacity-90">

              Manage Common Room
              content, hero section,
              activities and games
              from one enterprise
              dashboard.

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

              <Gamepad2 size={34} />

            </div>

            <div className="stat-title">

              Total Games

            </div>

            <div className="stat-value text-primary">

              {totalGames}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

            <div className="stat-figure text-secondary">

              <Sparkles size={34} />

            </div>

            <div className="stat-title">

              Featured

            </div>

            <div className="stat-value text-secondary">

              {featuredGames}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

            <div className="stat-figure text-accent">

              <Image size={34} />

            </div>

            <div className="stat-title">

              Hero Image

            </div>

            <div className="stat-value text-accent text-lg">

              {hasHeroImage

                ? "Added"

                : "None"}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

            <div className="stat-figure">

              <Monitor size={34} />

            </div>

            <div className="stat-title">

              CMS

            </div>

            <div className="stat-value text-lg">

              Ready

            </div>

          </div>

        </div>

      </div>

      
            {/* ==========================================
          HERO SECTION
      ========================================== */}

      <div className="max-w-7xl mx-auto px-6 pb-8">

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >

          <div className="card bg-base-100 shadow-xl border border-base-300">

            <div className="card-body">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="card-title text-2xl">

                    Hero Section

                  </h2>

                  <p className="text-base-content/70 mt-1">

                    Configure the Common Room hero banner.

                  </p>

                </div>

                <div className="badge badge-primary badge-lg">

                  Hero CMS

                </div>

              </div>

              <div className="divider"></div>

              <div className="grid lg:grid-cols-2 gap-8">

                {/* LEFT */}

                <div className="space-y-6">

                  <div>

                    <label className="label">

                      <span className="label-text">

                        Page Title

                      </span>

                    </label>

                    <input
                      type="text"
                      value="Common Room"
                      disabled
                      className="input input-bordered w-full"
                    />

                  </div>

                  <div>

                    <label className="label">

                      <span className="label-text">

                        Hero Subtitle

                      </span>

                    </label>

                    <input
                      type="text"
                      name="heroSubtitle"
                      className="input input-bordered w-full"
                      placeholder="Relax • Refresh • Reconnect"
                      value={heroData.heroSubtitle}
                      onChange={handleHeroChange}
                    />

                  </div>

                  <div>

                    <label className="label">

                      <span className="label-text">

                        Hero Image

                      </span>

                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      className="file-input file-input-bordered w-full"
                      onChange={handleHeroImage}
                    />

                    <label className="label">

                      <span className="label-text-alt">

                        {getUploadMessage(
                          IMAGE_UPLOAD
                        )}

                      </span>

                    </label>

                  </div>

                  <div className="card-body">

              <div className="flex items-center gap-3">

                <Monitor className="text-primary" />

                <h2 className="text-2xl font-black">

                  About Common Room

                </h2>

              </div>

              <textarea
                name="aboutText"
                value={heroData.aboutText}
                onChange={handleHeroChange}
                placeholder="Write about the Common Room..."
                className="textarea textarea-bordered min-h-64 mt-5"
              />

              <div className="flex justify-between items-center">

                <span className="text-sm opacity-60">

                  Characters :

                  {" "}

                  {heroData.aboutText.length}

                </span>

              </div>

            </div>

                  <div className="flex gap-3 flex-wrap">

  <button
    className="btn btn-primary"
    onClick={saveCommonRoom}
  >
    <Save size={18}/>
    Save
  </button>

  <button
    className="btn btn-outline"
    onClick={resetHero}
  >
    <RefreshCw size={18}/>
    Reset
  </button>

  {heroPreview && (
    <button
      className="btn btn-error"
      onClick={deleteHeroImage}
    >
      <Trash2 size={18}/>
      Delete Hero Image
    </button>
  )}

  <button
    className="btn btn-error btn-outline"
    onClick={()=>{
      setGameDeleteId("DELETE_ALL");
      setDeleteModalOpen(true);
    }}
  >
    <Trash2 size={18}/>
    Delete All
  </button>

                  </div>

                </div>

                {/* RIGHT */}

                <div>

                  <div className="rounded-2xl overflow-hidden border border-base-300 bg-base-200 h-96">

                    {heroPreview ? (

                      <img
                        src={heroPreview}
                        alt="Hero Preview"
                        className="w-full h-full object-cover"
                      />

                    ) : (

                      <div className="h-full flex items-center justify-center">

                        <div className="text-center">

                          <Image
                            size={72}
                            className="mx-auto opacity-30"
                          />

                          <p className="mt-4 opacity-60">

                            Hero Image Preview

                          </p>

                        </div>

                      </div>

                    )}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

      {/* ==========================================
          ABOUT SECTION
      ========================================== */}

      {/* <div className="max-w-7xl mx-auto px-6 pb-8">

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >

          <div className="card bg-base-100 shadow-xl border border-base-300">

            

          </div>

        </motion.div>

      </div> */}


            {/* ==========================================
          GAMES MANAGEMENT
      ========================================== */}

      <div className="max-w-7xl mx-auto px-6 pb-8">

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >

          <div className="card bg-base-100 shadow-xl border border-base-300">

            <div className="card-body">

              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">

                <div>

                  <h2 className="card-title text-2xl">

                    <Gamepad2 className="text-primary" />

                    Games Management

                  </h2>

                  <p className="text-base-content/70">

                    Add, edit and manage Common Room games.

                  </p>

                </div>

                <div className="badge badge-primary badge-lg">

                  {games.length} Games

                </div>

              </div>

              <div className="divider"></div>

              <form
                onSubmit={
                  editingGameId
                    ? updateGame
                    : addGame
                }
                className="space-y-6"
              >

                <div className="grid lg:grid-cols-2 gap-6">

                  <div>

                    <label className="label">

                      <span className="label-text">

                        Game Title

                      </span>

                    </label>

                    <input
                      type="text"
                      name="title"
                      className="input input-bordered w-full"
                      placeholder="Game title"
                      value={gameForm.title}
                      onChange={handleGameChange}
                      required
                    />

                  </div>

                  <div>

                    <label className="label">

                      <span className="label-text">

                        Game Image

                      </span>

                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      className="file-input file-input-bordered w-full"
                      onChange={(e) =>
                        handleGameImage(
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

                  </div>

                </div>

                {gameForm.image && (

                  <div className="rounded-2xl overflow-hidden border border-base-300 h-64">

                    <img
                      src={gameForm.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />

                  </div>

                )}

                <div>

                  <label className="label">

                    <span className="label-text">

                      Description

                    </span>

                  </label>

                  <textarea
                    name="description"
                    className="textarea textarea-bordered min-h-40"
                    placeholder="Game description..."
                    value={gameForm.description}
                    onChange={handleGameChange}
                    required
                  />

                </div>

                <label className="label cursor-pointer justify-start gap-3">

                  <input
                    type="checkbox"
                    name="featured"
                    className="toggle toggle-primary"
                    checked={gameForm.featured}
                    onChange={handleGameChange}
                  />

                  <span>

                    Featured Game

                  </span>

                </label>

                <div className="flex gap-3 flex-wrap">

                  <button
                    type="submit"
                    className={`btn ${
                      editingGameId
                        ? "btn-warning"
                        : "btn-primary"
                    }`}
                  >

                    {editingGameId ? (

                      <>

                        <Pencil size={18} />

                        Update Game

                      </>

                    ) : (

                      <>

                        <Save size={18} />

                        Add Game

                      </>

                    )}

                  </button>

                  {editingGameId && (

                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={resetGameForm}
                    >

                      <RefreshCw size={18} />

                      Cancel

                    </button>

                  )}

                </div>

              </form>

            </div>

          </div>

        </motion.div>

      </div>

      {/* ==========================================
          GAMES GRID
      ========================================== */}

      <div className="max-w-7xl mx-auto px-6 pb-10">

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >

          {games.length > 0 ? (

            <div
      className="
        max-h-[80vh]
        overflow-y-auto
        pr-2
      "
    >
             <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

              {games.map((game) => (

                <div
                  key={game._id}
                  className="card bg-base-100 border border-base-300 shadow-xl"

                >

                  <figure className="h-56 bg-base-200">

                    {game.image ? (

                      <img
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-cover"
                      />

                    ) : (

                      <div className="flex items-center justify-center h-full">

                        <Image
                          size={60}
                          className="opacity-30"
                        />

                      </div>

                    )}

                  </figure>

                  <div className="card-body">

                    <div className="flex justify-between items-start">

                      <h3 className="card-title">

                        {game.title}

                      </h3>

                      {game.featured && (

                        <div className="badge badge-success">

                          Featured

                        </div>

                      )}

                    </div>

                    <p className="text-base-content/70 line-clamp-4">

                      {game.description}

                    </p>

                    <div className="divider my-1"></div>

                    <div className="card-actions justify-end">

                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() =>
                          editGame(game)
                        }
                      >

                        <Pencil size={16} />

                        Edit

                      </button>

                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => {

                          setGameDeleteId(
                            game._id
                          );

                          setDeleteModalOpen(
                            true
                          );

                        }}
                      >

                        <Trash2 size={16} />

                        Delete

                      </button>

                    </div>

                  </div>

                </div>

              ))}

              </div>
            </div>

          ) : (

            <div className="hero bg-base-100 rounded-3xl border border-base-300 shadow-xl py-20">

              <div className="hero-content text-center">

                <div>

                  <Gamepad2
                    size={72}
                    className="mx-auto opacity-30"
                  />

                  <h3 className="text-2xl font-bold mt-4">

                    No Games Available

                  </h3>

                  <p className="opacity-60 mt-2">

                    Add your first Common Room game.

                  </p>

                </div>

              </div>

            </div>

          )}

        </motion.div>

      </div>

     
            {/* ==========================================
          LIVE WEBSITE PREVIEW
      ========================================== */}

      <div className="max-w-7xl mx-auto px-6 pb-10">

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="card-title text-2xl">

                    Live Website Preview

                  </h2>

                  <p className="text-base-content/70 mt-1">

                    Preview how the Common Room page will appear on the website.

                  </p>

                </div>

                <div className="badge badge-success badge-lg">

                  Live Preview

                </div>

              </div>

              <div className="divider"></div>

              {/* ======================================
                  HERO PREVIEW
              ====================================== */}

              <div className="hero rounded-3xl overflow-hidden bg-base-200 border border-base-300">

                <div className="hero-content flex-col lg:flex-row gap-10 py-10">

                  <div className="lg:w-1/2">

                    <h1 className="text-4xl font-black">

                      Common Room

                    </h1>

                    <p className="mt-4 text-lg">

                      {heroData.heroSubtitle ||

                        "Relax • Refresh • Reconnect"}

                    </p>

                    <div className="mt-6">

                      <p className="leading-8 whitespace-pre-wrap">

                        {heroData.aboutText ||

                          "About Common Room content will appear here."}

                      </p>

                    </div>

                  </div>

                  <div className="lg:w-1/2">

                    <div className="rounded-3xl overflow-hidden border border-base-300 bg-base-100 h-80">

                      {heroPreview ? (

                        <img
                          src={heroPreview}
                          alt="Common Room"
                          className="w-full h-full object-cover"
                        />

                      ) : (

                        <div className="h-full flex items-center justify-center">

                          <div className="text-center">

                            <Image
                              size={80}
                              className="mx-auto opacity-30"
                            />

                            <p className="mt-4 opacity-60">

                              Hero Image Preview

                            </p>

                          </div>

                        </div>

                      )}

                    </div>

                  </div>

                </div>

              </div>

              {/* ======================================
                  GAMES PREVIEW
              ====================================== */}

              <div className="mt-12">

                <div className="flex items-center justify-between">

                  <h3 className="text-2xl font-bold">

                    Games & Activities

                  </h3>

                  <div className="badge badge-primary">

                    {games.length} Games

                  </div>

                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">

                  {games.length > 0 ? (

                    games.map((game) => (

                      <div
                        key={game._id}
                        className="card bg-base-200 border border-base-300 shadow"

                      >

                        <figure className="h-52 bg-base-100">

                          {game.image ? (

                            <img
                              src={game.image}
                              alt={game.title}
                              className="w-full h-full object-cover"
                            />

                          ) : (

                            <div className="flex items-center justify-center h-full">

                              <Image
                                size={60}
                                className="opacity-30"
                              />

                            </div>

                          )}

                        </figure>

                        <div className="card-body">

                          <div className="flex justify-between items-center">

                            <h4 className="card-title">

                              {game.title}

                            </h4>

                            {game.featured && (

                              <span className="badge badge-success">

                                Featured

                              </span>

                            )}

                          </div>

                          <p className="text-base-content/70 line-clamp-4">

                            {game.description}

                          </p>

                        </div>

                      </div>

                    ))

                  ) : (

                    <div className="col-span-full">

                      <div className="hero bg-base-200 rounded-2xl py-16">

                        <div className="hero-content text-center">

                          <div>

                            <Gamepad2
                              size={64}
                              className="mx-auto opacity-30"
                            />

                            <h3 className="text-xl font-bold mt-4">

                              No Games Available

                            </h3>

                            <p className="opacity-60 mt-2">

                              Games added from the CMS will appear here.

                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  )}

                </div>

              </div>

              {/* ======================================
                  CMS SUMMARY
              ====================================== */}

              <div className="mt-12">

                <div className="stats stats-vertical lg:stats-horizontal shadow w-full border border-base-300">

                  <div className="stat">

                    <div className="stat-title">

                      Hero Image

                    </div>

                    <div className="stat-value text-primary text-lg">

                      {hasHeroImage

                        ? "Available"

                        : "Missing"}

                    </div>

                  </div>

                  <div className="stat">

                    <div className="stat-title">

                      Total Games

                    </div>

                    <div className="stat-value text-secondary">

                      {totalGames}

                    </div>

                  </div>

                  <div className="stat">

                    <div className="stat-title">

                      Featured Games

                    </div>

                    <div className="stat-value text-accent">

                      {featuredGames}

                    </div>

                  </div>

                  <div className="stat">

                    <div className="stat-title">

                      CMS Status

                    </div>

                    <div className="stat-value text-success text-lg">

                      Ready

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

 
            {/* ==========================================
          STICKY FOOTER
      ========================================== */}

      <div className="sticky bottom-4 z-40 px-6 pb-6">

        <div className="card bg-base-100 border border-base-300 shadow-2xl">

          <div className="card-body py-5">

            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">

              <div>

                <h3 className="font-bold text-xl">

                  Common Room CMS Dashboard

                </h3>

                <p className="text-base-content/70 mt-2">

                  Hero Image :

                  {" "}

                  {hasHeroImage
                    ? "Configured"
                    : "Missing"}

                  <br />

                  Total Games :

                  {" "}

                  {totalGames}

                  <br />

                  Featured Games :

                  {" "}

                  {featuredGames}

                </p>

              </div>

              <div className="flex flex-wrap gap-3">

                <div className="badge badge-primary badge-lg">

                  Common Room

                </div>

                <div className="badge badge-secondary badge-lg">

                  Cloudinary

                </div>

                <div className="badge badge-accent badge-lg">

                  Single CMS

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
        isOpen={loading || fetching}
        title={
          fetching
            ? "Loading Common Room"
            : "Saving Changes"
        }
        message={
          fetching
            ? "Please wait while the Common Room data is loading..."
            : "Please wait while your changes are being processed..."
        }
      />

      {/* ==========================================
          DELETE MODAL
      ========================================== */}

     <DeleteModal
    isOpen={deleteModalOpen}
    itemName={
        gameDeleteId==="DELETE_ALL"
        ? "Entire Common Room"
        : "Game"
    }
        onCancel={() => {

          setDeleteModalOpen(false);

          setGameDeleteId(null);

        }}
        onConfirm={confirmDeleteGame}
      />

    </div>

  );

};

export default CommonRoomControl;