import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  BookOpen,
  FileText,
  Image,
  Save,
  Trash2,
  Pencil,
  RefreshCw,
  Globe,
  Upload,
  LayoutDashboard,
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
  PDF_UPLOAD,
} from "../../../../utils/uploadConstants";

import {
  getUploadMessage,
} from "../../../../utils/uploadMessages";

const fadeUp = {

  hidden: {

    opacity: 0,

    y: 25,

  },

  visible: {

    opacity: 1,

    y: 0,

  },

};

const JournalsAdmin = () => {

  /* ==========================================
      INITIAL STATE
  ========================================== */

  const initialJournal = {

    bannerImage: null,

    paragraph: "",

    journalList: "",

    sideImage: null,

  };

  const initialPublication = {

    title: "",

    authors: "",

    description: "",

    websiteUrl: "",

    pdfFile: null,

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
    journalData,
    setJournalData,
  ] = useState(null);

  const [
    formData,
    setFormData,
  ] = useState(initialJournal);

  const [
    publicationForm,
    setPublicationForm,
  ] = useState(initialPublication);

  const [
    editingPublicationId,
    setEditingPublicationId,
  ] = useState(null);

  const [
    bannerPreview,
    setBannerPreview,
  ] = useState("");

  const [
    sidePreview,
    setSidePreview,
  ] = useState("");

  // Kept in sync with the preview state so the unmount
  // cleanup below always revokes the *current* blob URL
  // instead of the empty string it was initialized with.
  const bannerPreviewRef = useRef("");
  const sidePreviewRef = useRef("");

  useEffect(() => {
    bannerPreviewRef.current = bannerPreview;
  }, [bannerPreview]);

  useEffect(() => {
    sidePreviewRef.current = sidePreview;
  }, [sidePreview]);

  // Forces the PDF <input type="file"> to remount so its
  // displayed filename actually clears after an add, update,
  // or cancel — file inputs can't be reset via value/state.
  const [
    pdfInputKey,
    setPdfInputKey,
  ] = useState(0);

  const [
    deleteModal,
    setDeleteModal,
  ] = useState({

    open: false,

    type: "",

    id: null,

  });

  const [
    statusModal,
    setStatusModal,
  ] = useState({

    open: false,

    type: "success",

    title: "",

    message: "",

  });

  /* ==========================================
      STATUS MODAL
  ========================================== */

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
      LOAD JOURNAL
  ========================================== */

  const loadJournal =
    async () => {

      try {

        setFetching(true);

        const {

          data,

        } = await api.get(
          "/journal"
        );

        const cms =
          data.data;

        setJournalData(
          cms
        );

        setFormData({

          bannerImage: null,

          paragraph:
            cms?.paragraph || "",

          journalList:

            cms?.journalList?.join(
              "\n"
            ) || "",

          sideImage: null,

        });

        setBannerPreview(

          cms?.bannerImage || ""

        );

        setSidePreview(

          cms?.sideImage || ""

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

            "Unable to load Journal CMS."

        );

      }

      finally {

        setFetching(
          false
        );

      }

    };

  useEffect(() => {

    loadJournal();

    return () => {

      // Read from refs, not state — this closure is only ever
      // created once (empty dependency array), so reading
      // bannerPreview/sidePreview directly here would always
      // revoke the initial empty-string value, never the
      // actual blob URL that was current at unmount time.
      cleanupBlobUrl(
        bannerPreviewRef.current
      );

      cleanupBlobUrl(
        sidePreviewRef.current
      );

    };

  }, []);

  /* ==========================================
      IMAGE HELPERS
  ========================================== */

  const handleBannerImage =
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

      cleanupBlobUrl(
        bannerPreview
      );

      setBannerPreview(

        previewFile(file)

      );

      setFormData(

        (prev) => ({

          ...prev,

          bannerImage:
            file,

        })

      );

    };

  const handleSideImage =
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

      cleanupBlobUrl(
        sidePreview
      );

      setSidePreview(

        previewFile(file)

      );

      setFormData(

        (prev) => ({

          ...prev,

          sideImage:
            file,

        })

      );

    };

  /* ==========================================
      DASHBOARD STATS
  ========================================== */

  const publicationCount =
    journalData
      ?.researchPublications
      ?.length || 0;

  const journalCount =
    useMemo(

      () =>

        formData
          .journalList
          .split("\n")
          .filter(Boolean)
          .length,

      [formData.journalList]

    );


    /* ==========================================
      SAVE JOURNAL CMS
  ========================================== */

  const saveJournal =
    async () => {

      try {

        setLoading(true);

        const form =
          new FormData();

        if (
          formData.bannerImage
        ) {

          form.append(

            "bannerImage",

            formData.bannerImage

          );

        }

        if (
          formData.sideImage
        ) {

          form.append(

            "sideImage",

            formData.sideImage

          );

        }

        form.append(

          "paragraph",

          formData.paragraph

        );

        const journals =
          formData.journalList
            .split("\n")
            .map((item) =>
              item.trim()
            )
            .filter(Boolean);

        form.append(

          "journalList",

          JSON.stringify(
            journals
          )

        );

        const {
          data,
        } = await api.post(

          "/journal",

          form

        );

        showStatus(

          "success",

          "Saved",

          data.message

        );

        await loadJournal();

      }

      catch (

        error

      ) {

        showStatus(

          "error",

          "Save Failed",

          error.response?.data
            ?.message ||

            "Unable to save Journal CMS."

        );

      }

      finally {

        setLoading(
          false
        );

      }

    };

  /* ==========================================
      DELETE JOURNAL CMS
  ========================================== */

  const deleteJournal =
    async () => {

      try {

        setDeleteModal({

          open: false,

          type: "",

          id: null,

        });

        setLoading(true);

        const {
          data,
        } = await api.delete(

          "/journal"

        );

        showStatus(

          "success",

          "Deleted",

          data.message

        );

        cleanupBlobUrl(
          bannerPreview
        );

        cleanupBlobUrl(
          sidePreview
        );

        setBannerPreview("");

        setSidePreview("");

        setJournalData(
          null
        );

        setEditingPublicationId(
          null
        );

        setFormData(
          initialJournal
        );

        setPublicationForm(
          initialPublication
        );

        setPdfInputKey(
          (key) => key + 1
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

            "Unable to delete Journal CMS."

        );

      }

      finally {

        setLoading(
          false
        );

      }

    };

  /* ==========================================
      PDF
  ========================================== */

  const handlePdf =
    (file) => {

      if (!file)
        return;

      const validation =
        validateUpload(

          file,

          PDF_UPLOAD

        );

      if (

        !validation.valid

      ) {

        showStatus(

          "error",

          "Invalid PDF",

          validation.message

        );

        return;

      }

      setPublicationForm(

        (prev) => ({

          ...prev,

          pdfFile:
            file,

        })

      );

    };

  /* ==========================================
      PUBLICATION INPUT
  ========================================== */

  const handlePublicationChange =
    (e) => {

      const {

        name,

        value,

      } = e.target;

      setPublicationForm(

        (prev) => ({

          ...prev,

          [name]:
            value,

        })

      );

    };

  /* ==========================================
      ADD PUBLICATION
  ========================================== */

  const addPublication =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const form =
          new FormData();

        form.append(

          "title",

          publicationForm.title

        );

        form.append(

          "authors",

          publicationForm.authors

        );

        form.append(

          "description",

          publicationForm.description

        );

        form.append(

          "websiteUrl",

          publicationForm.websiteUrl

        );

        if (
          publicationForm.pdfFile
        ) {

          form.append(

            "pdfFile",

            publicationForm.pdfFile

          );

        }

        const {
          data,
        } = await api.post(

          "/journal/publication",

          form

        );

        showStatus(

          "success",

          "Publication Added",

          data.message

        );

        setPublicationForm(
          initialPublication
        );

        setPdfInputKey(
          (key) => key + 1
        );

        await loadJournal();

      }

      catch (

        error

      ) {

        showStatus(

          "error",

          "Add Failed",

          error.response?.data
            ?.message ||

            "Unable to add publication."

        );

      }

      finally {

        setLoading(
          false
        );

      }

    };

  /* ==========================================
      UPDATE PUBLICATION
  ========================================== */

  const updatePublication =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const form =
          new FormData();

        form.append(
          "title",
          publicationForm.title
        );

        form.append(
          "authors",
          publicationForm.authors
        );

        form.append(
          "description",
          publicationForm.description
        );

        form.append(
          "websiteUrl",
          publicationForm.websiteUrl
        );

        if (
          publicationForm.pdfFile
        ) {

          form.append(
            "pdfFile",
            publicationForm.pdfFile
          );

        }

        const {
          data,
        } = await api.put(

          `/journal/publication/${editingPublicationId}`,

          form

        );

        showStatus(

          "success",

          "Updated",

          data.message

        );

        setEditingPublicationId(
          null
        );

        setPublicationForm(
          initialPublication
        );

        setPdfInputKey(
          (key) => key + 1
        );

        await loadJournal();

      }

      catch (

        error

      ) {

        showStatus(

          "error",

          "Update Failed",

          error.response?.data
            ?.message ||

            "Unable to update publication."

        );

      }

      finally {

        setLoading(
          false
        );

      }

    };

 
    /* ==========================================
      EDIT PUBLICATION
  ========================================== */

  const editPublication =
    (publication) => {

      setEditingPublicationId(
        publication._id
      );

      setPublicationForm({

        title:
          publication.title || "",

        authors:
          publication.authors || "",

        description:
          publication.description || "",

        websiteUrl:
          publication.websiteUrl || "",

        pdfFile: null,

      });

      setPdfInputKey(
        (key) => key + 1
      );

      window.scrollTo({

        top: document.body.scrollHeight,

        behavior: "smooth",

      });

    };

  /* ==========================================
      DELETE PUBLICATION
  ========================================== */

  const confirmDeletePublication =
    async () => {

      if (!deleteModal.id)
        return;

      try {

        setDeleteModal({

          open: false,

          type: "",

          id: null,

        });

        setLoading(true);

        const {
          data,
        } = await api.delete(

          `/journal/publication/${deleteModal.id}`

        );

        showStatus(

          "success",

          "Publication Deleted",

          data.message

        );

        await loadJournal();

      }

      catch (

        error

      ) {

        showStatus(

          "error",

          "Delete Failed",

          error.response?.data
            ?.message ||

            "Unable to delete publication."

        );

      }

      finally {

        setLoading(
          false
        );

      }

    };

  /* ==========================================
      RESET PUBLICATION
  ========================================== */

  const resetPublication =
    () => {

      setEditingPublicationId(
        null
      );

      setPublicationForm(
        initialPublication
      );

      setPdfInputKey(
        (key) => key + 1
      );

    };

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

              Journals CMS

            </h1>

            <p className="mt-5 max-w-3xl text-lg opacity-90">

              Manage journals,
              subscriptions,
              research publications
              and website content
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

              <BookOpen size={34} />

            </div>

            <div className="stat-title">

              Journals

            </div>

            <div className="stat-value text-primary">

              {journalCount}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

            <div className="stat-figure text-secondary">

              <FileText size={34} />

            </div>

            <div className="stat-title">

              Publications

            </div>

            <div className="stat-value text-secondary">

              {publicationCount}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

            <div className="stat-figure text-accent">

              <Image size={34} />

            </div>

            <div className="stat-title">

              Images

            </div>

            <div className="stat-value text-accent text-lg">

              {(bannerPreview || sidePreview)

                ? "Ready"

                : "None"}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

            <div className="stat-figure">

              <Globe size={34} />

            </div>

            <div className="stat-title">

              CMS

            </div>

            <div className="stat-value text-success text-lg">

              Active

            </div>

          </div>

        </div>

      </div>

      
            {/* ==========================================
          JOURNAL CMS
      ========================================== */}

      <div className="max-w-7xl mx-auto px-6 pb-8">

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

                    Journal Page Content

                  </h2>

                  <p className="text-base-content/70 mt-1">

                    Manage the Journal page displayed on the website.

                  </p>

                </div>

                <div className="badge badge-primary badge-lg">

                  Journal CMS

                </div>

              </div>

              <div className="divider"></div>

              <div className="grid lg:grid-cols-2 gap-8">

                {/* ======================================
                    LEFT
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
                      onChange={(e) =>
                        handleBannerImage(
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

                  {/* Paragraph */}

                  <div>

                    <label className="label">

                      <span className="label-text">

                        Introduction

                      </span>

                    </label>

                    <textarea
                      rows={8}
                      className="textarea textarea-bordered w-full"
                      placeholder="Write the journal introduction..."
                      value={formData.paragraph}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          paragraph: e.target.value,
                        }))
                      }
                    />

                    <div className="text-right text-xs opacity-60 mt-2">

                      {formData.paragraph.length}

                      {" "}Characters

                    </div>

                  </div>

                  {/* Journal List */}

                  <div>

                    <label className="label">

                      <span className="label-text">

                        Subscribed Journals

                      </span>

                    </label>

                    <textarea
                      rows={10}
                      className="textarea textarea-bordered w-full"
                      placeholder={`Sadhana
Resonance
Journal of Genetics
IFCAI Computer Science`}
                      value={formData.journalList}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          journalList: e.target.value,
                        }))
                      }
                    />

                    <div className="mt-4">

                      <h3 className="font-semibold mb-3">

                        Live Preview

                      </h3>

                      <div className="flex flex-wrap gap-2">

                        {formData.journalList
                          .split("\n")
                          .filter(Boolean)
                          .map((item, index) => (

                            <span
                              key={index}
                              className="badge badge-primary badge-lg"
                            >
                              {item}
                            </span>

                          ))}

                      </div>

                    </div>

                  </div>

                  {/* Side Image */}

                  <div>

                    <label className="label">

                      <span className="label-text">

                        Research Side Image

                      </span>

                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      className="file-input file-input-bordered w-full"
                      onChange={(e) =>
                        handleSideImage(
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

                  {/* Buttons */}

                  <div className="flex flex-wrap gap-3">

                    <button
                      className="btn btn-primary"
                      onClick={saveJournal}
                    >

                      <Save size={18} />

                      Save Journal

                    </button>

                    <button
                      className="btn btn-outline"
                      onClick={loadJournal}
                    >

                      <RefreshCw size={18} />

                      Reset

                    </button>

                    <button
                      className="btn btn-error"
                      onClick={() =>
                        setDeleteModal({
                          open: true,
                          type: "journal",
                          id: null,
                        })
                      }
                    >

                      <Trash2 size={18} />

                      Delete CMS

                    </button>

                  </div>

                </div>

                {/* ======================================
                    RIGHT
                ====================================== */}

                <div className="space-y-6">

                  <div>

                    <h3 className="font-bold text-lg mb-3">

                      Banner Preview

                    </h3>

                    <div className="rounded-2xl overflow-hidden border border-base-300 bg-base-200 h-72">

                      {bannerPreview ? (

                        <img
                          src={bannerPreview}
                          alt="Banner"
                          className="w-full h-full object-cover"
                        />

                      ) : (

                        <div className="flex items-center justify-center h-full">

                          <Image
                            size={70}
                            className="opacity-30"
                          />

                        </div>

                      )}

                    </div>

                  </div>

                  <div>

                    <h3 className="font-bold text-lg mb-3">

                      Research Image Preview

                    </h3>

                    <div className="rounded-2xl overflow-hidden border border-base-300 bg-base-200 h-72">

                      {sidePreview ? (

                        <img
                          src={sidePreview}
                          alt="Research"
                          className="w-full h-full object-cover"
                        />

                      ) : (

                        <div className="flex items-center justify-center h-full">

                          <Image
                            size={70}
                            className="opacity-30"
                          />

                        </div>

                      )}

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

      
            {/* ==========================================
          RESEARCH PUBLICATIONS
      ========================================== */}

      <div className="max-w-7xl mx-auto px-6 pb-8">

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

                    Research Publications

                  </h2>

                  <p className="text-base-content/70 mt-1">

                    Add and manage research publications.

                  </p>

                </div>

                <div className="badge badge-secondary badge-lg">

                  {publicationCount} Publications

                </div>

              </div>

              <div className="divider"></div>

              <form
                onSubmit={
                  editingPublicationId
                    ? updatePublication
                    : addPublication
                }
                className="space-y-6"
              >

                {/* ======================================
                    BASIC DETAILS
                ====================================== */}

                <div className="grid lg:grid-cols-2 gap-6">

                  <div>

                    <label className="label">

                      <span className="label-text">

                        Research Title

                      </span>

                    </label>

                    <input
                      type="text"
                      name="title"
                      className="input input-bordered w-full"
                      placeholder="Enter research title"
                      value={publicationForm.title}
                      onChange={handlePublicationChange}
                      required
                    />

                  </div>

                  <div>

                    <label className="label">

                      <span className="label-text">

                        Authors / Published By

                      </span>

                    </label>

                    <input
                      type="text"
                      name="authors"
                      className="input input-bordered w-full"
                      placeholder="Authors"
                      value={publicationForm.authors}
                      onChange={handlePublicationChange}
                      required
                    />

                  </div>

                </div>

                {/* ======================================
                    DESCRIPTION
                ====================================== */}

                <div>

                  <label className="label">

                    <span className="label-text">

                      Description

                    </span>

                  </label>

                  <textarea
                    name="description"
                    rows={7}
                    className="textarea textarea-bordered w-full"
                    placeholder="Research description..."
                    value={publicationForm.description}
                    onChange={handlePublicationChange}
                    required
                  />

                </div>

                {/* ======================================
                    WEBSITE
                ====================================== */}

                <div>

                  <label className="label">

                    <span className="label-text">

                      Website URL

                    </span>

                  </label>

                  <input
                    type="url"
                    name="websiteUrl"
                    className="input input-bordered w-full"
                    placeholder="https://example.com"
                    value={publicationForm.websiteUrl}
                    onChange={handlePublicationChange}
                  />

                </div>

                {/* ======================================
                    PDF
                ====================================== */}

                <div>

                  <label className="label">

                    <span className="label-text">

                      Upload PDF

                    </span>

                  </label>

                  <input
                    key={pdfInputKey}
                    type="file"
                    accept=".pdf"
                    className="file-input file-input-bordered w-full"
                    onChange={(e) =>
                      handlePdf(
                        e.target.files?.[0]
                      )
                    }
                  />

                  <label className="label">

                    <span className="label-text-alt">

                      {getUploadMessage(
                        PDF_UPLOAD
                      )}

                    </span>

                  </label>

                  {publicationForm.pdfFile && (

                    <div className="alert alert-success mt-4">

                      <Upload size={18} />

                      <span>

                        {publicationForm.pdfFile.name}

                      </span>

                    </div>

                  )}

                </div>

                {/* ======================================
                    ACTION BUTTONS
                ====================================== */}

                <div className="flex flex-wrap gap-3">

                  <button
                    type="submit"
                    className={`btn ${
                      editingPublicationId
                        ? "btn-warning"
                        : "btn-primary"
                    }`}
                  >

                    {editingPublicationId ? (

                      <>

                        <Pencil size={18} />

                        Update Publication

                      </>

                    ) : (

                      <>

                        <Save size={18} />

                        Add Publication

                      </>

                    )}

                  </button>

                  {editingPublicationId && (

                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={resetPublication}
                    >

                      <RefreshCw size={18} />

                      Cancel Edit

                    </button>

                  )}

                </div>

              </form>

            </div>

          </div>

        </motion.div>

      </div>

     
            {/* ==========================================
          PUBLICATIONS GRID
      ========================================== */}

      <div className="max-w-7xl mx-auto px-6 pb-8">

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >

          {journalData?.researchPublications?.length ? (

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

              {journalData.researchPublications.map(
                (publication) => (

                  <div
                    key={publication._id}
                    className="card bg-base-100 border border-base-300 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >

                    <div className="card-body">

                      <div className="flex justify-between items-start">

                        <h3 className="card-title line-clamp-2">

                          {publication.title}

                        </h3>

                        <div className="badge badge-primary">

                          PDF

                        </div>

                      </div>

                      <p className="font-semibold text-primary">

                        {publication.authors}

                      </p>

                      <p className="text-base-content/70 line-clamp-5">

                        {publication.description}

                      </p>

                      <div className="divider my-1"></div>

                      <div className="flex flex-wrap gap-2">

                        {publication.pdfUrl && (

                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              window.open(
                                publication.pdfUrl,
                                "_blank"
                              )
                            }
                          >

                            <FileText size={16} />

                            PDF

                          </button>

                        )}

                        {publication.websiteUrl && (

                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() =>
                              window.open(
                                publication.websiteUrl,
                                "_blank"
                              )
                            }
                          >

                            <Globe size={16} />

                            Website

                          </button>

                        )}

                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() =>
                            editPublication(
                              publication
                            )
                          }
                        >

                          <Pencil size={16} />

                          Edit

                        </button>

                        <button
                          className="btn btn-error btn-sm"
                          onClick={() =>
                            setDeleteModal({

                              open: true,

                              type: "publication",

                              id: publication._id,

                            })
                          }
                        >

                          <Trash2 size={16} />

                          Delete

                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="hero bg-base-100 rounded-3xl border border-base-300 shadow-xl py-20">

              <div className="hero-content text-center">

                <div>

                  <BookOpen
                    size={72}
                    className="mx-auto opacity-30"
                  />

                  <h3 className="text-2xl font-bold mt-4">

                    No Publications Added

                  </h3>

                  <p className="opacity-60 mt-2">

                    Research publications will appear here.

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

              <div className="flex justify-between items-center">

                <div>

                  <h2 className="card-title text-2xl">

                    Live Website Preview

                  </h2>

                  <p className="text-base-content/70">

                    Preview the Journal page before publishing.

                  </p>

                </div>

                <div className="badge badge-success badge-lg">

                  Live Preview

                </div>

              </div>

              <div className="divider"></div>

              {/* Banner */}

              <div className="rounded-3xl overflow-hidden border border-base-300 h-80 bg-base-200">

                {bannerPreview ? (

                  <img
                    src={bannerPreview}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <div className="flex items-center justify-center h-full">

                    <Image
                      size={80}
                      className="opacity-30"
                    />

                  </div>

                )}

              </div>

              {/* Intro */}

              <div className="mt-10">

                <h2 className="text-3xl font-black">

                  Journals

                </h2>

                <p className="mt-5 whitespace-pre-wrap leading-8">

                  {formData.paragraph ||

                    "Journal introduction will appear here."}

                </p>

              </div>

              {/* Journal List */}

              <div className="mt-10">

                <h3 className="text-2xl font-bold mb-5">

                  Subscribed Journals

                </h3>

                <div className="flex flex-wrap gap-3">

                  {formData.journalList
                    .split("\n")
                    .filter(Boolean)
                    .map((journal, index) => (

                      <div
                        key={index}
                        className="badge badge-primary badge-lg"
                      >

                        {journal}

                      </div>

                    ))}

                </div>

              </div>

              {/* Research Section */}

              <div className="grid lg:grid-cols-2 gap-8 mt-12">

                <div>

                  <h3 className="text-2xl font-bold mb-4">

                    Research

                  </h3>

                  <p>

                    Research publications uploaded from the CMS
                    will automatically appear in this section.

                  </p>

                </div>

                <div className="rounded-2xl overflow-hidden border border-base-300 h-72 bg-base-200">

                  {sidePreview ? (

                    <img
                      src={sidePreview}
                      alt="Research"
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <div className="flex items-center justify-center h-full">

                      <Image
                        size={70}
                        className="opacity-30"
                      />

                    </div>

                  )}

                </div>

              </div>

              {/* Publications Preview */}

              <div className="mt-12">

                <h3 className="text-2xl font-bold mb-6">

                  Research Publications

                </h3>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

                  {journalData?.researchPublications
                    ?.slice(0, 3)
                    .map((publication) => (

                      <div
                        key={publication._id}
                        className="card bg-base-200 border border-base-300"
                      >

                        <div className="card-body">

                          <h4 className="font-bold line-clamp-2">

                            {publication.title}

                          </h4>

                          <p className="text-primary">

                            {publication.authors}

                          </p>

                          <p className="line-clamp-4 text-sm">

                            {publication.description}

                          </p>

                        </div>

                      </div>

                    ))}

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

                  Journals CMS Dashboard

                </h3>

                <p className="text-base-content/70 mt-2">

                  Subscribed Journals :

                  {" "}

                  {journalCount}

                  <br />

                  Research Publications :

                  {" "}

                  {publicationCount}

                  <br />

                  Banner :

                  {" "}

                  {bannerPreview
                    ? "Configured"
                    : "Missing"}

                </p>

              </div>

              <div className="flex flex-wrap gap-3">

                <div className="badge badge-primary badge-lg">

                  Journals

                </div>

                <div className="badge badge-secondary badge-lg">

                  Research

                </div>

                <div className="badge badge-accent badge-lg">

                  Cloudinary

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
            ? "Loading Journal CMS"
            : "Processing Request"
        }
        message={
          fetching
            ? "Please wait while Journal CMS data is loading..."
            : "Please wait while your changes are being saved..."
        }
      />

      {/* ==========================================
          DELETE MODAL
      ========================================== */}

      <DeleteModal
        isOpen={deleteModal.open}
        itemName={
          deleteModal.type ===
          "journal"
            ? "Journal CMS"
            : "Research Publication"
        }
        onCancel={() =>
          setDeleteModal({

            open: false,

            type: "",

            id: null,

          })
        }
        onConfirm={() => {

          if (
            deleteModal.type ===
            "journal"
          ) {

            deleteJournal();

          }

          else {

            confirmDeletePublication();

          }

        }}
      />

    </div>

  );

};

export default JournalsAdmin;