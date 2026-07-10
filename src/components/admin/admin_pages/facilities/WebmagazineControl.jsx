import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  BookOpen,
  FileText,
  Search,
  Save,
  Pencil,
  Trash2,
  X,
  RefreshCw,
  Upload,
  Eye,
  Newspaper,
  CalendarDays,
  ImagePlus,
  LayoutGrid,
  Table2,
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

const WebMagazineControl = () => {

  /* ======================================================
      INITIAL FORM
  ====================================================== */

  const initialForm = {

    image: null,

    title: "",

    subtitle: "",

    author: "",

    category:
      "Annual Magazine",

    edition: "",

    publicationDate: "",

    year:
      new Date().getFullYear(),

    pdfFile: null,

  };

  /* ======================================================
      STATES
  ====================================================== */

  const [
    magazines,
    setMagazines,
  ] = useState([]);

  const [
    formData,
    setFormData,
  ] = useState(
    initialForm
  );

  const [
    editingId,
    setEditingId,
  ] = useState(null);

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    fetching,
    setFetching,
  ] = useState(true);

  const [
    imagePreview,
    setImagePreview,
  ] = useState("");

  const [
    pdfName,
    setPdfName,
  ] = useState("");

  const [
    deleteModalOpen,
    setDeleteModalOpen,
  ] = useState(false);

  const [
    deleteId,
    setDeleteId,
  ] = useState(null);

  const [
    viewMode,
    setViewMode,
  ] = useState(
    "cards"
  );

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

  const closeStatus =
    () => {

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

        setFetching(
          true
        );

        const {
          data,
        } = await api.get(
          "/web-magazine"
        );

        if (
          data.success
        ) {

          setMagazines(
            data.data || []
          );

        }

      }

      catch (error) {

        showStatus(

          "error",

          "Load Failed",

          error.response?.data
            ?.message ||

            "Unable to load publications."

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
      TEXT INPUT
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
      IMAGE
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
        imagePreview
      );
const preview = previewFile(file);

setImagePreview(preview.preview);

      setFormData(

        (prev) => ({

          ...prev,

          image:
            file,

        })

      );

  return next;

    };

  /* ======================================================
      PDF
  ====================================================== */

  const handlePdfChange =
    (e) => {

      const file =
        e.target.files?.[0];

      if (!file)
        return;

     const validation = validateUpload(file, {
  allowPdf: true,
});

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

      setPdfName(
        file.name
      );

      setFormData(

        (prev) => ({

          ...prev,

          pdfFile:
            file,

        })

      );

    };

  /* ======================================================
      RESET
  ====================================================== */

  const resetForm =
    () => {

      cleanupBlobUrl(
        imagePreview
      );

      setImagePreview("");

      setPdfName("");

      setEditingId(
        null
      );

      setFormData(
        initialForm
      );

    };

  /* ======================================================
      PART 2 STARTS HERE

      Save
      Update
      Delete
      Edit
      Search
      Stats
      Hero
  ====================================================== */
    /* ======================================================
      SAVE MAGAZINE
  ====================================================== */

  const handleSubmit =
    async () => {

      try {

        setLoading(
          true
        );

        const payload =
          new FormData();

        Object.entries(
          formData
        ).forEach(
          ([key, value]) => {

            if (
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


        let response;

        if (editingId) {

          response =
            await api.put(

              `/web-magazine/${editingId}`,

              payload

            );

        } else {

          response =
            await api.post(

              "/web-magazine",

              payload

            );

        }

        showStatus(

          "success",

          editingId
            ? "Publication Updated"
            : "Publication Created",

          response.data.message

        );

        await loadData();

        resetForm();

      }

      catch (error) {

        showStatus(

          "error",

          editingId
            ? "Update Failed"
            : "Save Failed",

          error.response?.data
            ?.message ||

            "Operation failed."

        );

      }

      finally {

        setLoading(
          false
        );

      }

    };

  /* ======================================================
      EDIT
  ====================================================== */

  const handleEdit =
    (item) => {

      cleanupBlobUrl(
        imagePreview
      );

      setEditingId(
        item._id
      );

      setPdfName("");

      setImagePreview(
        item.image || ""
      );

      setFormData({

        image: null,

        title:
          item.title || "",

        subtitle:
          item.subtitle || "",

        author:
          item.author || "",

        category:
          item.category ||
          "Annual Magazine",

        edition:
          item.edition || "",

        publicationDate:
          item.publicationDate

            ? new Date(
                item.publicationDate
              )
                .toISOString()
                .split("T")[0]

            : "",

        year:
          item.year ||

          new Date().getFullYear(),

        pdfFile: null,

      });

      window.scrollTo({

        top: 0,

        behavior:
          "smooth",

      });

    };

  /* ======================================================
      DELETE
  ====================================================== */

  const askDelete =
    (id) => {

      setDeleteId(id);

      setDeleteModalOpen(
        true
      );

    };

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

          `/web-magazine/${deleteId}`

        );

        showStatus(

          "success",

          "Publication Deleted",

          data.message

        );

        await loadData();

        if (
          editingId ===
          deleteId
        ) {

          resetForm();

        }

      }

      catch (error) {

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

  /* ======================================================
      SEARCH
  ====================================================== */

  const filteredMagazines =
    useMemo(() => {

      const keyword =
        searchTerm.toLowerCase();

      return magazines.filter(

        (item) =>

          item.title

            ?.toLowerCase()

            ?.includes(
              keyword
            )

          ||

          item.author

            ?.toLowerCase()

            ?.includes(
              keyword
            )

          ||

          item.category

            ?.toLowerCase()

            ?.includes(
              keyword
            )

      );

    }, [

      magazines,

      searchTerm,

    ]);

  /* ======================================================
      DASHBOARD STATS
  ====================================================== */

  const totalPublications =
    magazines.length;

  const totalCategories =
    new Set(

      magazines.map(

        (item) =>
          item.category

      )

    ).size;

  const currentYear =
    new Date().getFullYear();

  const currentYearPublications =
    magazines.filter(

      (item) =>

        Number(item.year) ===

        currentYear

    ).length;

  const latestEdition =
    magazines.length > 0

      ? magazines[0]
          ?.edition || "N/A"

      : "N/A";

  /* ======================================================
      RETURN
  ====================================================== */

  return (

    <div className="min-h-screen bg-base-200">

      {/* ======================================================
          HERO
      ====================================================== */}

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

            <BookOpen
              size={72}
              className="mx-auto mb-5"
            />

            <h1 className="text-5xl font-black">

              Web Magazine Management

            </h1>

            <p className="mt-5 max-w-3xl text-lg opacity-90">

              Manage annual magazines,
              research journals,
              newsletters and digital
              publications using the
              enterprise Cloudinary CMS.

            </p>

          </div>

        </div>

      </motion.section>

      {/* ======================================================
          PART 3 STARTS HERE

          Dashboard Cards
          Search
          View Toggle
          Publication Form
      ====================================================== */}
            {/* ======================================================
          DASHBOARD
      ====================================================== */}

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

            <div className="stat-figure text-primary">

              <BookOpen size={34} />

            </div>

            <div className="stat-title">

              Total Publications

            </div>

            <div className="stat-value text-primary">

              {totalPublications}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

            <div className="stat-figure text-secondary">

              <Newspaper size={34} />

            </div>

            <div className="stat-title">

              Categories

            </div>

            <div className="stat-value text-secondary">

              {totalCategories}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

            <div className="stat-figure text-accent">

              <CalendarDays size={34} />

            </div>

            <div className="stat-title">

              {currentYear}

            </div>

            <div className="stat-value text-accent">

              {currentYearPublications}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl shadow border border-base-300">

            <div className="stat-figure">

              <FileText size={34} />

            </div>

            <div className="stat-title">

              Latest Edition

            </div>

            <div className="stat-value text-lg">

              {latestEdition}

            </div>

          </div>

        </div>

        {/* ======================================================
            PUBLICATION FORM
        ====================================================== */}

        <div className="card bg-base-100 shadow-xl border border-base-300 mt-8">

          <div className="card-body">

            <h2 className="card-title text-2xl">

              {editingId
                ? "Update Publication"
                : "Add New Publication"}

            </h2>

            <div className="grid lg:grid-cols-2 gap-6">

              {/* ==========================================
                  LEFT
              ========================================== */}

              <div className="space-y-5">

                <div>

                  <label className="label">

                    <span className="label-text">

                      Cover Image

                    </span>

                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                    onChange={
                      handleImageChange
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

                <div>

                  <label className="label">

                    <span className="label-text">

                      PDF Magazine

                    </span>

                  </label>

                  <input
                    type="file"
                    accept=".pdf"
                    className="file-input file-input-bordered w-full"
                    onChange={
                      handlePdfChange
                    }
                  />

                  <label className="label">

                    <span className="label-text-alt">

                      {pdfName ||

                        getUploadMessage(
                          PDF_UPLOAD
                        )}

                    </span>

                  </label>

                </div>

                <div>

                  <label className="label">

                    <span className="label-text">

                      Title

                    </span>

                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />

                </div>

                <div>

                  <label className="label">

                    <span className="label-text">

                      Subtitle

                    </span>

                  </label>

                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />

                </div>

                <div>

                  <label className="label">

                    <span className="label-text">

                      Author

                    </span>

                  </label>

                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />

                </div>
                              <div>

                <label className="label">

                  <span className="label-text">

                    Category

                  </span>

                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                >

                  <option>

                    Annual Magazine

                  </option>

                  <option>

                    Research Journal

                  </option>

                  <option>

                    Newsletter

                  </option>

                  <option>

                    Event Magazine

                  </option>

                  <option>

                    Technical Journal

                  </option>

                </select>

              </div>

              <div>

                <label className="label">

                  <span className="label-text">

                    Edition

                  </span>

                </label>

                <input
                  type="text"
                  name="edition"
                  value={formData.edition}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="2026 Edition"
                />

              </div>

              <div>

                <label className="label">

                  <span className="label-text">

                    Publication Date

                  </span>

                </label>

                <input
                  type="date"
                  name="publicationDate"
                  value={formData.publicationDate}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />

              </div>

              <div>

                <label className="label">

                  <span className="label-text">

                    Year

                  </span>

                </label>

                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  min="2000"
                  max="2100"
                />

              </div>

            </div>

            {/* ==========================================
                LIVE PREVIEW
            ========================================== */}

            <div className="space-y-5">

              <div>

                <h3 className="font-bold text-lg mb-4">

                  Live Preview

                </h3>

                <div className="rounded-3xl border border-base-300 bg-base-200 overflow-hidden">

                  {(imagePreview ||

                    (editingId &&
                      magazines.find(
                        (m) =>
                          m._id ===
                          editingId
                      )?.image))

                    ? (

                      <img
                        src={
                          imagePreview ||

                          magazines.find(
                            (m) =>
                              m._id ===
                              editingId
                          )?.image
                        }
                        alt="Magazine"
                        className="w-full h-72 object-cover"
                      />

                    ) : (

                      <div className="h-72 flex flex-col items-center justify-center">

                        <ImagePlus
                          size={60}
                          className="opacity-30"
                        />

                        <p className="mt-3 opacity-60">

                          Cover Preview

                        </p>

                      </div>

                    )}

                  <div className="p-6 space-y-3">

                    <h2 className="text-2xl font-bold">

                      {formData.title ||

                        "Magazine Title"}

                    </h2>

                    <p className="text-base-content/70">

                      {formData.subtitle ||

                        "Magazine subtitle..."}

                    </p>

                    <div className="flex flex-wrap gap-2">

                      <div className="badge badge-primary">

                        {formData.category}

                      </div>

                      <div className="badge badge-secondary">

                        {formData.year}

                      </div>

                      {formData.edition && (

                        <div className="badge badge-accent">

                          {formData.edition}

                        </div>

                      )}

                    </div>

                    <div className="text-sm text-base-content/70">

                      <strong>

                        Author:

                      </strong>

                      {" "}

                      {formData.author ||

                        "-"}

                    </div>

                    <div className="text-sm text-base-content/70">

                      <strong>

                        Publication Date:

                      </strong>

                      {" "}

                      {formData.publicationDate ||

                        "-"}

                    </div>

                    <div className="text-sm text-success">

                      {pdfName

                        ? `PDF Selected: ${pdfName}`

                        : "No PDF Selected"}

                    </div>

                  </div>

                </div>

              </div>

              {/* ==========================================
                  ACTION BUTTONS
              ========================================== */}

              <div className="flex flex-wrap gap-3">

                <button
                  type="button"
                  className={`btn flex-1 ${
                    editingId
                      ? "btn-warning"
                      : "btn-primary"
                  }`}
                  onClick={handleSubmit}
                >

                  {editingId ? (

                    <>

                      <Pencil
                        size={18}
                      />

                      Update Publication

                    </>

                  ) : (

                    <>

                      <Save
                        size={18}
                      />

                      Save Publication

                    </>

                  )}

                </button>

                {editingId && (

                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={resetForm}
                  >

                    <X
                      size={18}
                    />

                    Cancel

                  </button>

                )}

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={loadData}
                >

                  <RefreshCw
                    size={18}
                  />

                  Refresh

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
       {/* ======================================================
            SEARCH + VIEW TOGGLE
        ====================================================== */}

        <div className="card bg-base-100 shadow-xl border border-base-300 mt-8">

          <div className="card-body">

            <div className="flex flex-col lg:flex-row gap-5 justify-between">

              <div className="relative flex-1">

                <Search
                  size={20}
                  className="absolute left-4 top-4 text-base-content/50"
                />

                <input
                  type="text"
                  placeholder="Search by title, author or category..."
                  className="input input-bordered w-full pl-12"
                  value={searchTerm}
                  onChange={(e)=>
                    setSearchTerm(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="join">

                <button
                  type="button"
                  className={`join-item btn ${
                    viewMode === "cards"
                      ? "btn-primary"
                      : "btn-outline"
                  }`}
                  onClick={()=>
                    setViewMode(
                      "cards"
                    )
                  }
                >

                  <LayoutGrid
                    size={18}
                  />

                  Cards

                </button>

                <button
                  type="button"
                  className={`join-item btn ${
                    viewMode === "table"
                      ? "btn-primary"
                      : "btn-outline"
                  }`}
                  onClick={()=>
                    setViewMode(
                      "table"
                    )
                  }
                >

                  <Table2
                    size={18}
                  />

                  Table

                </button>

              </div>

            </div>

          </div>
          

        </div>
              {/* ======================================================
          PUBLICATION CARD VIEW
      ====================================================== */}

      {viewMode === "cards" && (

        <div className="max-w-7xl mx-auto px-6 pb-10">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-3xl font-bold">

              Publications

            </h2>

            <div className="badge badge-primary badge-lg">

              {filteredMagazines.length}

              {" "}

              Records

            </div>

          </div>

          {filteredMagazines.length === 0 ? (

            <div className="card bg-base-100 border border-base-300 shadow-xl">

              <div className="card-body items-center text-center py-20">

                <BookOpen
                  size={70}
                  className="opacity-30"
                />

                <h3 className="text-2xl font-bold mt-5">

                  No Publications Found

                </h3>

                <p className="text-base-content/60">

                  Create your first web magazine or
                  change the search keyword.

                </p>

              </div>

            </div>

          ) : (

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

              {filteredMagazines.map(
                (item) => (

                  <motion.div
                    key={item._id}
                    whileHover={{
                      y: -6,
                    }}
                    className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden"
                  >

                    {/* ======================================
                        COVER IMAGE
                    ====================================== */}

                    <figure className="h-60 bg-base-200">

                      {item.image ? (

                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />

                      ) : (

                        <div className="flex flex-col items-center justify-center h-full">

                          <ImagePlus
                            size={60}
                            className="opacity-30"
                          />

                          <p className="mt-3 opacity-60">

                            No Cover Image

                          </p>

                        </div>

                      )}

                    </figure>

                    {/* ======================================
                        BODY
                    ====================================== */}

                    <div className="card-body">

                      <div className="flex justify-between items-start gap-3">

                        <h2 className="card-title">

                          {item.title}

                        </h2>

                        <div className="badge badge-primary">

                          {item.year}

                        </div>

                      </div>

                      {item.subtitle && (

                        <p className="text-base-content/70">

                          {item.subtitle}

                        </p>

                      )}

                      <div className="flex flex-wrap gap-2 mt-2">

                        <div className="badge badge-secondary">

                          {item.category}

                        </div>

                        {item.edition && (

                          <div className="badge badge-accent">

                            {item.edition}

                          </div>

                        )}

                      </div>

                      <div className="divider my-2"></div>

                      <div className="space-y-2 text-sm">

                        <p>

                          <strong>

                            Author

                          </strong>

                          {" : "}

                          {item.author || "-"}

                        </p>

                        <p>

                          <strong>

                            Published

                          </strong>

                          {" : "}

                          {item.publicationDate

                            ? new Date(
                                item.publicationDate
                              ).toLocaleDateString()

                            : "-"}

                        </p>

                        <p>

                          <strong>

                            PDF

                          </strong>

                          {" : "}

                          {item.pdfFile

                            ? "Available"

                            : "Not Uploaded"}

                        </p>

                      </div>

                      {/* ======================================
                          ACTIONS
                      ====================================== */}

                      <div className="card-actions justify-between mt-6">

                        <div className="flex gap-2">

                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() =>
                              handleEdit(item)
                            }
                          >

                            <Pencil
                              size={16}
                            />

                            Edit

                          </button>

                          <button
                            className="btn btn-error btn-sm"
                            onClick={() =>
                              askDelete(
                                item._id
                              )
                            }
                          >

                            <Trash2
                              size={16}
                            />

                            Delete

                          </button>

                        </div>

                        {item.pdfFile && (

                          <a
                            href={item.pdfFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm"
                          >

                            <Eye
                              size={16}
                            />

                            View PDF

                          </a>

                        )}

                      </div>

                    </div>

                  </motion.div>

                )
              )}

            </div>

          )}

        </div>

      )}
            {/* ======================================================
          PUBLICATION TABLE VIEW
      ====================================================== */}

      {viewMode === "table" && (

        <div className="max-w-7xl mx-auto px-6 pb-10">

          <div className="card bg-base-100 shadow-xl border border-base-300">

            <div className="card-body">

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-bold">

                  Publications Table

                </h2>

                <div className="badge badge-primary badge-lg">

                  {filteredMagazines.length} Records

                </div>

              </div>

              <div className="overflow-x-auto">

                <table className="table table-zebra">

                  <thead>

                    <tr>

                      <th>Cover</th>

                      <th>Title</th>

                      <th>Category</th>

                      <th>Author</th>

                      <th>Edition</th>

                      <th>Year</th>

                      <th>Published</th>

                      <th>PDF</th>

                      <th className="text-center">

                        Actions

                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredMagazines.length === 0 ? (

                      <tr>

                        <td
                          colSpan={9}
                          className="text-center py-12"
                        >

                          <BookOpen
                            size={60}
                            className="mx-auto opacity-30 mb-4"
                          />

                          <p className="font-semibold">

                            No Publications Found

                          </p>

                        </td>

                      </tr>

                    ) : (

                      filteredMagazines.map(
                        (item) => (

                          <tr key={item._id}>

                            {/* Cover */}

                            <td>

                              {item.image ? (

                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-16 h-16 rounded-xl object-cover border border-base-300"
                                />

                              ) : (

                                <div className="w-16 h-16 rounded-xl bg-base-200 flex items-center justify-center">

                                  <ImagePlus
                                    size={26}
                                    className="opacity-40"
                                  />

                                </div>

                              )}

                            </td>

                            {/* Title */}

                            <td>

                              <div className="font-bold">

                                {item.title}

                              </div>

                              {item.subtitle && (

                                <div className="text-xs opacity-70">

                                  {item.subtitle}

                                </div>

                              )}

                            </td>

                            {/* Category */}

                            <td>

                              <span className="badge badge-secondary">

                                {item.category}

                              </span>

                            </td>

                            {/* Author */}

                            <td>

                              {item.author || "-"}

                            </td>

                            {/* Edition */}

                            <td>

                              {item.edition || "-"}

                            </td>

                            {/* Year */}

                            <td>

                              <span className="badge badge-primary">

                                {item.year}

                              </span>

                            </td>

                            {/* Publication Date */}

                            <td>

                              {item.publicationDate

                                ? new Date(
                                    item.publicationDate
                                  ).toLocaleDateString()

                                : "-"}

                            </td>

                            {/* PDF */}

                            <td>

                              {item.pdfFile ? (

                                <a
                                  href={item.pdfFile}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-success btn-xs"
                                >

                                  <Eye size={14} />

                                  View

                                </a>

                              ) : (

                                <span className="badge badge-ghost">

                                  None

                                </span>

                              )}

                            </td>

                            {/* Actions */}

                            <td>

                              <div className="flex justify-center gap-2">

                                <button
                                  className="btn btn-warning btn-sm"
                                  onClick={() =>
                                    handleEdit(item)
                                  }
                                >

                                  <Pencil size={16} />

                                </button>

                                <button
                                  className="btn btn-error btn-sm"
                                  onClick={() =>
                                    askDelete(item._id)
                                  }
                                >

                                  <Trash2 size={16} />

                                </button>

                              </div>

                            </td>

                          </tr>

                        )

                      )

                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        </div>

      )}
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
        title={
          editingId
            ? "Updating Publication"
            : "Saving Publication"
        }
        message="Please wait while your publication is being processed..."
      />

      {/* ======================================================
          DELETE MODAL
      ====================================================== */}

      <DeleteModal
        isOpen={deleteModalOpen}
        itemName="Web Magazine"
        onCancel={() =>
          setDeleteModalOpen(false)
        }
        onConfirm={confirmDelete}
      />

    </div>

  );

};

export default WebMagazineControl;