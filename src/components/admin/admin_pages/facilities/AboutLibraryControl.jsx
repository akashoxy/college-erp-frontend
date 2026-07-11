import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  Library,
  BookOpen,
  Globe,
  UserRound,
  FileText,
  Image,
  Plus,
  Trash2,
  Save,
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
  PDF_UPLOAD,
} from "../../../../utils/uploadConstants";

import {
  getUploadMessage,
} from "../../../../utils/uploadMessages";

const AboutLibraryControl = () => {

  /* ==========================================
      INITIAL FORM
  ========================================== */

  const initialForm = {

    paragraph: "",

    sideImage: null,

    onlineLibrary: "",

    readingRoom: "",

    librarians: [],

    ebooks: [],

  };

  /* ==========================================
      STATES
  ========================================== */

  const [
    library,
    setLibrary,
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
      LOAD LIBRARY
  ========================================== */

  const loadLibrary =
    async () => {

      try {

        setFetching(true);

        const {
          data,
        } = await api.get(
          "/library"
        );

        if (
          data.success &&
          data.data
        ) {

          const lib =
            data.data;

          setLibrary(lib);

          setSidePreview(
            lib.sideImage || ""
          );

          setFormData({

            paragraph:
              lib.paragraph || "",

            sideImage:
              null,

            onlineLibrary:
              lib.onlineLibrary || "",

            readingRoom:
              lib.readingRoom || "",

            librarians:
              lib.librarians || [],

            ebooks:
              lib.ebooks || [],

          });

        }

      }

      catch (error) {

        showStatus(

          "error",

          "Load Failed",

          error.response?.data
            ?.message ||

            "Unable to load Library."

        );

      }

      finally {

        setFetching(
          false
        );

      }

    };

  useEffect(() => {

    loadLibrary();

  }, []);

  useEffect(() => {

    return () => {

        cleanupBlobUrl(sidePreview);

        formData.librarians.forEach((item) => {
            cleanupBlobUrl(item.avatar);
        });

    };

}, []);

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
      SIDE IMAGE
  ========================================== */

  const handleSideImage = (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const validation = validateUpload(file, IMAGE_UPLOAD);

  if (!validation.valid) {
    showStatus(
      "error",
      "Invalid Image",
      validation.message
    );
    return;
  }

  cleanupBlobUrl(sidePreview);

  const { preview } = previewFile(file);

  setFormData((prev) => ({
    ...prev,
    sideImage: file,
  }));

  setSidePreview(preview);
};

  /* ==========================================
      RESET
  ========================================== */
const resetForm = async () => {

    cleanupBlobUrl(sidePreview);

    setSidePreview("");

    await loadLibrary();

};

  /* ==========================================
      SAVE LIBRARY
  ========================================== */

  const handleSubmit =
    async () => {

      try {

        setLoading(true);

        const multipart =
          new FormData();

        if (
          formData.sideImage
        ) {

          multipart.append(

            "sideImage",

            formData.sideImage

          );

        }

        multipart.append(

          "paragraph",

          formData.paragraph

        );

        multipart.append(

          "readingRoom",

          formData.readingRoom

        );

        multipart.append(

          "onlineLibrary",

          formData.onlineLibrary

        );

        multipart.append(

          "librarians",

          JSON.stringify(

            formData.librarians.map(

              ({
                avatarFile,
                ...item
              }) => item

            )

          )

        );

        formData.librarians.forEach(

          (item) => {
            cleanupBlobUrl(item.avatar)

            if (
              item.avatarFile
            ) {

              multipart.append(

                "teacherAvatar",

                item.avatarFile

              );

            }

          }

        );

        multipart.append(

          "ebooks",

          JSON.stringify(

            formData.ebooks.map(

              ({
                pdfFileObject,
                ...item
              }) => item

            )

          )

        );

        formData.ebooks.forEach(

          (item) => {

            if (
              item.pdfFileObject
            ) {

              multipart.append(

                "ebookPdf",

                item.pdfFileObject

              );

            }

          }

        );

        const {
          data,
        } = await api.post(

          "/library",

          multipart

        );

        showStatus(

          "success",

          "Library Saved",

          data.message

        );

        await loadLibrary();

      }

      catch (error) {

        showStatus(

          "error",

          "Save Failed",

          error.response?.data
            ?.message ||

            "Unable to save Library."

        );

      }

      finally {

        setLoading(false);

      }

    };

  /* ==========================================
      DELETE LIBRARY
  ========================================== */

  const confirmDelete =
    async () => {

      try {

        setDeleteModalOpen(
          false
        );

        setLoading(true);

        const {
          data,
        } = await api.delete(
          "/library"
        );

        showStatus(

          "success",

          "Deleted",

          data.message

        );

        setLibrary(
          null
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

            "Unable to delete Library."

        );

      }

      finally {

        setLoading(false);

      }

    };

  /* ==========================================
      LIBRARIANS
  ========================================== */

  const addLibrarian =
    () => {

      setFormData(

        (prev) => ({

          ...prev,

          librarians: [

            ...prev.librarians,

            {

              avatar: "",

              avatarFile: null,

              name: "",

              designation: "",

              qualification: "",

            },

          ],

        })

      );

    };

  const updateLibrarian =
    (
      index,
      field,
      value
    ) => {

      const updated =

        [...formData.librarians];

      updated[index][field] =
        value;

      setFormData(

        (prev) => ({

          ...prev,

          librarians:
            updated,

        })

      );

    };

  const removeLibrarian =
    (index) => {

      const updated =

        [...formData.librarians];

      updated.splice(
        index,
        1
      );

      setFormData(

        (prev) => ({

          ...prev,

          librarians:
            updated,

        })

      );

    };

  const handleAvatar =
    (
      index,
      file
    ) => {

      if (!file)
        return;

const validation = validateUpload(file, IMAGE_UPLOAD);

if (!validation.valid) {
    showStatus(
        "error",
        "Invalid Image",
        validation.message
    );
    return;
}

     const preview = previewFile(file);

updateLibrarian(
    index,
    "avatar",
    preview.preview
);

updateLibrarian(
    index,
    "avatarFile",
    file
);

    };

  /* ==========================================
      EBOOKS
  ========================================== */

  const addEbook =
    () => {

      setFormData(

        (prev) => ({

          ...prev,

          ebooks: [

            ...prev.ebooks,

            {

              title: "",

              author: "",

              category: "",

              pdfFile: "",

              pdfFileObject: null,

            },

          ],

        })

      );

    };

  const updateEbook =
    (
      index,
      field,
      value
    ) => {

      const updated =

        [...formData.ebooks];

      updated[index][field] =
        value;

      setFormData(

        (prev) => ({

          ...prev,

          ebooks:
            updated,

        })

      );

    };

  const removeEbook =
    (index) => {

      const updated =

        [...formData.ebooks];

      updated.splice(
        index,
        1
      );

      setFormData(

        (prev) => ({

          ...prev,

          ebooks:
            updated,

        })

      );

    };

  const handlePdf =
    (
      index,
      file
    ) => {

      if (!file)
        return;

 const validation = validateUpload(file, PDF_UPLOAD);

if (!validation.valid) {
    showStatus(
        "error",
        "Invalid PDF",
        validation.message
    );
    return;
}

      updateEbook(

        index,

        "pdfFileObject",

        file

      );

      updateEbook(

        index,

        "pdfFile",

        file.name

      );

    };

  /* ==========================================
      DASHBOARD STATS
  ========================================== */

  const totalLibrarians =
    formData.librarians.length;

  const totalEbooks =
    formData.ebooks.length;

  const hasSideImage =
    !!sidePreview;

  /* ==========================================
      RETURN

      New section order:
      1. Hero
      2. Dashboard stats
      3. About Library
      4. Librarians
      5. Digital E-Books
      6. Side Image  |  Reading Room  (+ Online Library)
      7. Live Preview
      8. Sticky footer / modals
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

            <Library
              size={72}
              className="mx-auto mb-5"
            />

            <h1 className="text-5xl font-black">

              Library CMS

            </h1>

            <p className="mt-5 max-w-3xl text-lg opacity-90">

              Manage your Library,
              Reading Room,
              Online Library,
              Librarians and
              Digital E-Books from
              one enterprise dashboard.

            </p>

          </div>

        </div>

      </motion.section>

      {/* ==========================================
          DASHBOARD
      ========================================== */}

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="stat bg-base-100 rounded-3xl border border-base-300 shadow">

            <div className="stat-figure text-primary">

              <UserRound size={34} />

            </div>

            <div className="stat-title">

              Librarians

            </div>

            <div className="stat-value text-primary">

              {totalLibrarians}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl border border-base-300 shadow">

            <div className="stat-figure text-secondary">

              <BookOpen size={34} />

            </div>

            <div className="stat-title">

              E-Books

            </div>

            <div className="stat-value text-secondary">

              {totalEbooks}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl border border-base-300 shadow">

            <div className="stat-figure text-accent">

              <Image size={34} />

            </div>

            <div className="stat-title">

              Side Image

            </div>

            <div className="stat-value text-accent text-lg">

              {hasSideImage
                ? "Added"
                : "None"}

            </div>

          </div>

          <div className="stat bg-base-100 rounded-3xl border border-base-300 shadow">

            <div className="stat-figure">

              <Globe size={34} />

            </div>

            <div className="stat-title">

              Digital Library

            </div>

            <div className="stat-value text-lg">

              {formData.onlineLibrary
                ? "Available"
                : "Pending"}

            </div>

          </div>

        </div>

        {/* ==========================================
            1. ABOUT LIBRARY
        ========================================== */}

        <div className="card bg-base-100 shadow-xl border border-base-300 mt-8">

          <div className="card-body">

            <h2 className="card-title text-2xl">

              About Library

            </h2>

            <div className="divider mt-0"></div>

            <textarea
              name="paragraph"
              value={formData.paragraph}
              onChange={handleChange}
              className="textarea textarea-bordered h-56 w-full"
              placeholder="Write about the library..."
            />

          </div>

        </div>

        {/* ==========================================
            2. LIBRARIANS
        ========================================== */}

        <div className="card bg-base-100 shadow-xl border border-base-300 mt-8">

          <div className="card-body">

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

              <h2 className="card-title text-2xl">

                Librarians

              </h2>

              <button
                type="button"
                className="btn btn-primary"
                onClick={addLibrarian}
              >

                <Plus size={18} />

                Add Librarian

              </button>

            </div>

            <div className="divider"></div>

            {

              formData.librarians.length === 0 && (

                <div className="alert">

                  <span>

                    No librarians added yet.

                  </span>

                </div>

              )

            }

            <div  className="
              space-y-8
              max-h-[75vh]
              overflow-y-auto
              pr-2
              scrollbar-thin
            ">

              {

                formData.librarians.map(

                  (

                    librarian,

                    index

                  ) => (

                    <div
                      key={index}
                      className="rounded-2xl border border-base-300 bg-base-200 p-6"
                    >

                      <div className="flex justify-between items-center mb-6">

                        <h3 className="text-xl font-bold">

                          Librarian #

                          {index + 1}

                        </h3>

                        <button
                          type="button"
                          className="btn btn-error btn-sm"
                          onClick={() =>
                            removeLibrarian(index)
                          }
                        >

                          <Trash2 size={16} />

                          Remove

                        </button>

                      </div>

                      <div className="grid lg:grid-cols-3 gap-6">

                        {/* Avatar */}

                        <div>

                          <label className="label">

                            <span className="label-text">

                              Avatar

                            </span>

                          </label>

                          <input
                            type="file"
                            accept="image/*"
                            className="file-input file-input-bordered w-full"
                            onChange={(e) =>
                              handleAvatar(
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

                          {(librarian.avatar ||
                            librarian.avatarFile) && (

                            <img
                               src={librarian.avatar} 
                              alt="Avatar"
                              className="mt-4 w-full h-60 rounded-2xl object-cover border border-base-300"
                            />

                          )}

                        </div>

                        {/* Information */}

                        <div className="lg:col-span-2 grid gap-5">

                          <input
                            type="text"
                            className="input input-bordered"
                            placeholder="Full Name"
                            value={librarian.name}
                            onChange={(e) =>
                              updateLibrarian(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                          />

                          <input
                            type="text"
                            className="input input-bordered"
                            placeholder="Designation"
                            value={librarian.designation}
                            onChange={(e) =>
                              updateLibrarian(
                                index,
                                "designation",
                                e.target.value
                              )
                            }
                          />

                          <input
                            type="text"
                            className="input input-bordered"
                            placeholder="Qualification"
                            value={librarian.qualification}
                            onChange={(e) =>
                              updateLibrarian(
                                index,
                                "qualification",
                                e.target.value
                              )
                            }
                          />

                        </div>

                      </div>

                    </div>

                  )

                )

              }

            </div>

          </div>

        </div>

        {/* ==========================================
            3. DIGITAL E-BOOKS
        ========================================== */}

        <div className="card bg-base-100 shadow-xl border border-base-300 mt-8">

          <div className="card-body">

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

              <h2 className="card-title text-2xl">

                Digital E-Books

              </h2>

              <button
                type="button"
                className="btn btn-primary"
                onClick={addEbook}
              >

                <Plus size={18} />

                Add E-Book

              </button>

            </div>

            <div className="divider"></div>

            {

              formData.ebooks.length === 0 && (

                <div className="alert">

                  <span>

                    No E-Books added yet.

                  </span>

                </div>

              )

            }

            <div  className="
              space-y-8
               max-h-[75vh]
              overflow-y-auto
              pr-2
              scrollbar-thin
            ">

              {

                formData.ebooks.map(

                  (

                    ebook,

                    index

                  ) => (

                    <div
                      key={index}
                      className="rounded-2xl border border-base-300 bg-base-200 p-6"
                    >

                      <div className="flex justify-between items-center mb-6">

                        <h3 className="text-xl font-bold">

                          E-Book #

                          {index + 1}

                        </h3>

                        <button
                          type="button"
                          className="btn btn-error btn-sm"
                          onClick={() =>
                            removeEbook(index)
                          }
                        >

                          <Trash2 size={16} />

                          Remove

                        </button>

                      </div>

                      <div className="grid lg:grid-cols-2 gap-6">

                        <input
                          type="text"
                          className="input input-bordered"
                          placeholder="Book Title"
                          value={ebook.title}
                          onChange={(e)=>

                            updateEbook(

                              index,

                              "title",

                              e.target.value

                            )

                          }
                        />

                        <input
                          type="text"
                          className="input input-bordered"
                          placeholder="Author"
                          value={ebook.author}
                          onChange={(e)=>

                            updateEbook(

                              index,

                              "author",

                              e.target.value

                            )

                          }
                        />

                        <input
                          type="text"
                          className="input input-bordered"
                          placeholder="Category"
                          value={ebook.category}
                          onChange={(e)=>

                            updateEbook(

                              index,

                              "category",

                              e.target.value

                            )

                          }
                        />

                        <div>

                          <input
                            type="file"
                            accept=".pdf"
                            className="file-input file-input-bordered w-full"
                            onChange={(e)=>

                              handlePdf(

                                index,

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

                        </div>

                      </div>

                      {(ebook.pdfFile ||

                        ebook.pdfFileObject) && (

                        <div className="mt-6">

                          <div className="alert alert-success">

                            <FileText
                              size={18}
                            />

                            <span>

                              {

                                ebook.pdfFileObject

                                  ? ebook.pdfFileObject.name

                                  : ebook.pdfFile

                              }

                            </span>

                          </div>

                        </div>

                      )}

                    </div>

                  )

                )

              }

            </div>

          </div>

        </div>

        {/* ==========================================
            4. SIDE IMAGE  |  READING ROOM
        ========================================== */}

        <div className="card bg-base-100 shadow-xl border border-base-300 mt-8">

          <div className="card-body">

            <h2 className="card-title text-2xl">

              Side Image &amp; Reading Room

            </h2>

            <div className="divider mt-0"></div>

            <div className="grid lg:grid-cols-2 gap-8">

              {/* Side Image */}

              <div>

                <label className="label">

                  <span className="label-text font-semibold">

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
                    alt="Library"
                    className="mt-4 w-full h-72 rounded-2xl object-cover border border-base-300"
                  />

                )}

              </div>

              {/* Reading Room */}

              <div>

                <label className="label">

                  <span className="label-text font-semibold">

                    Reading Room

                  </span>

                </label>

                <textarea
                  name="readingRoom"
                  value={formData.readingRoom}
                  onChange={handleChange}
                  className="textarea textarea-bordered h-56 w-full"
                  placeholder="Reading room details..."
                />

              </div>

            </div>

            {/* Online Library */}

            <div className="mt-8">

              <label className="label">

                <span className="label-text font-semibold">

                  Online Library

                </span>

              </label>

              <textarea
                name="onlineLibrary"
                value={formData.onlineLibrary}
                onChange={handleChange}
                className="textarea textarea-bordered h-40 w-full"
                placeholder="Digital library information..."
              />

            </div>

          </div>

        </div>

      </div>

      {/* ==========================================
          LIVE WEBSITE PREVIEW
      ========================================== */}

      <div className="max-w-7xl mx-auto px-6 pb-10">

        <div className="card bg-base-100 shadow-xl border border-base-300">

          <div className="card-body">

            <h2 className="card-title text-2xl">

              Live Website Preview

            </h2>

            <div className="divider"></div>

            {/* About Library */}

            <div>

              <h3 className="font-bold mb-4">

                About Library

              </h3>

              <div className="rounded-2xl border border-base-300 bg-base-200 p-6 min-h-40 overflow-auto">

                <p className="leading-8 whitespace-pre-wrap">

                  {

                    formData.paragraph ||

                    "Library description will appear here."

                  }

                </p>

              </div>

            </div>

            {/* Librarians */}

            <div className="mt-10">

              <h3 className="font-bold text-xl mb-5">

                Librarians

              </h3>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                {

                  formData.librarians.length > 0

                    ? formData.librarians.map(

                        (

                          librarian,

                          index

                        ) => (

                          <div
                            key={index}
                            className="card bg-base-200 border border-base-300"
                          >

                            {

                              (

                                librarian.avatar ||

                                librarian.avatarFile

                              ) && (

                                <img
                                  src={librarian.avatar}
                                  alt={librarian.name}
                                  className="h-64 w-full object-cover"
                                />

                              )

                            }

                            <div className="card-body">

                              <h4 className="font-bold text-lg">

                                {

                                  librarian.name ||

                                  "Librarian"

                                }

                              </h4>

                              <p>

                                {

                                  librarian.designation ||

                                  "-"

                                }

                              </p>

                              <p>

                                {

                                  librarian.qualification ||

                                  "-"

                                }

                              </p>

                            </div>

                          </div>

                        )

                      )

                    : (

                      <div className="opacity-60">

                        No librarians added.

                      </div>

                    )

                }

              </div>

            </div>

            {/* E-Books */}

            <div className="mt-10">

              <h3 className="font-bold text-xl mb-5">

                Digital E-Books

              </h3>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                {

                  formData.ebooks.length > 0

                    ? formData.ebooks.map(

                        (

                          ebook,

                          index

                        ) => (

                          <div
                            key={index}
                            className="card bg-base-200 border border-base-300"
                          >

                            <div className="card-body">

                              <h4 className="font-bold">

                                {

                                  ebook.title ||

                                  "Untitled Book"

                                }

                              </h4>

                              <p>

                                <strong>

                                  Author:

                                </strong>

                                {" "}

                                {

                                  ebook.author ||

                                  "-"

                                }

                              </p>

                              <p>

                                <strong>

                                  Category:

                                </strong>

                                {" "}

                                {

                                  ebook.category ||

                                  "-"

                                }

                              </p>

                              {

                                ebook.pdfFile && (

                                  <div className="badge badge-success mt-3">

                                    PDF Ready

                                  </div>

                                )

                              }

                            </div>

                          </div>

                        )

                      )

                    : (

                      <div className="opacity-60">

                        No E-Books added.

                      </div>

                    )

                }

              </div>

            </div>

            {/* Side Image | Reading Room */}

            <div className="mt-10">

              <h3 className="font-bold text-xl mb-5">

                Side Image &amp; Reading Room

              </h3>

              <div className="grid lg:grid-cols-2 gap-8">

                <div className="rounded-2xl overflow-hidden border border-base-300 bg-base-200">

                  {sidePreview ? (

                    <img
                      src={sidePreview}
                      alt="Library"
                      className="w-full h-80 object-cover"
                    />

                  ) : (

                    <div className="h-80 flex flex-col items-center justify-center">

                      <Image
                        size={70}
                        className="opacity-30"
                      />

                      <p className="mt-4 opacity-60">

                        Library Image Preview

                      </p>

                    </div>

                  )}

                </div>

                <div className="rounded-2xl border border-base-300 bg-base-200 p-6 h-80 overflow-auto">

                  <p className="leading-8 whitespace-pre-wrap">

                    {

                      formData.readingRoom ||

                      "Reading room information."

                    }

                  </p>

                </div>

              </div>

              <div className="mt-8">

                <h4 className="font-bold mb-4">

                  Online Library

                </h4>

                <div className="rounded-2xl border border-base-300 bg-base-200 p-6">

                  <p className="leading-8 whitespace-pre-wrap">

                    {

                      formData.onlineLibrary ||

                      "Online library information."

                    }

                  </p>

                </div>

              </div>

            </div>

            {/* ACTION BUTTONS */}

            <div className="flex flex-wrap gap-4 mt-10">

              <button
                disabled={loading}
className="btn btn-primary flex-1"
                onClick={handleSubmit}
              >

                <Save size={18} />

                Save Library

              </button>

              <button
                className="btn btn-outline"
                onClick={resetForm}
              >

                <RefreshCw size={18} />

                Reset

              </button>

              <button
                disabled={!library}
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

                  Library Management Dashboard

                </h3>

                <p className="text-base-content/70 text-sm mt-2">

                  Librarians :

                  {" "}

                  {totalLibrarians}

                  <br />

                  E-Books :

                  {" "}

                  {totalEbooks}

                  <br />

                  Side Image :

                  {" "}

                  {hasSideImage

                    ? "Configured"

                    : "Not Configured"}

                </p>

              </div>

              <div className="flex flex-wrap gap-3">

                <div className="badge badge-primary badge-lg">

                  Library CMS

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
        title="Saving Library"
        message="Please wait while your changes are being processed..."
      />

      {/* ==========================================
          DELETE MODAL
      ========================================== */}

      <DeleteModal
        isOpen={deleteModalOpen}
        itemName="Library"
        onCancel={() =>
          setDeleteModalOpen(false)
        }
        onConfirm={confirmDelete}
      />

    </div>

  );

};

export default AboutLibraryControl;