import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  BookOpen,
  Upload,
  Search,
  Trash2,
  Eye,
  Download,
  FileText,
  RefreshCw,
  FolderOpen,
  Filter,
} from "lucide-react";

import api from "../../../../services/api";

import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";

/* ==========================================================
   COMPONENT
========================================================== */

export default function SyllabusControl() {

  /* ==========================================================
     STATES
  ========================================================== */

  const [

    syllabus,

    setSyllabus,

  ] = useState([]);

  const [

    loading,

    setLoading,

  ] = useState(true);

  const [

    uploading,

    setUploading,

  ] = useState(false);

  const [

    deleting,

    setDeleting,

  ] = useState(false);

  const [

    stream,

    setStream,

  ] = useState("MCA");

  const [

    semester,

    setSemester,

  ] = useState(1);

  const [

    syllabusType,

    setSyllabusType,

  ] = useState("new");

  const [

    pdfFile,

    setPdfFile,

  ] = useState(null);

  /* ==========================================================
     SEARCH & FILTER
  ========================================================== */

  const [

    search,

    setSearch,

  ] = useState("");

  const [

    filterStream,

    setFilterStream,

  ] = useState("All");

  const [

    filterSemester,

    setFilterSemester,

  ] = useState("All");

  const [

    filterType,

    setFilterType,

  ] = useState("All");

  /* ==========================================================
     MODALS
  ========================================================== */

  const [

    previewPdf,

    setPreviewPdf,

  ] = useState(null);

  const [

    selectedDelete,

    setSelectedDelete,

  ] = useState(null);

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
     SEMESTER OPTIONS
  ========================================================== */

  useEffect(() => {

    setSemester(1);

  }, [

    stream,

  ]);

  const semesterOptions =
    useMemo(() => {

      return stream === "MCA"

        ? [1, 2, 3, 4]

        : [1, 2, 3, 4, 5, 6, 7, 8];

    }, [

      stream,

    ]);

  /* ==========================================================
     FETCH SYLLABUS
  ========================================================== */

  const fetchSyllabus =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.get(
            "/syllabus"
          );

        setSyllabus(

          res.data.data || []

        );

      } catch (error) {

        setStatusModal({

          isOpen: true,

          type: "error",

          title:
            "Loading Failed",

          message:

            error.response?.data
              ?.message ||

            "Unable to load syllabus.",

        });

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    fetchSyllabus();

  }, []);


    /* ==========================================================
     UPLOAD SYLLABUS
  ========================================================== */

  const handleUpload =
    async (e) => {

      e.preventDefault();

      if (!pdfFile) {

        return setStatusModal({

          isOpen: true,

          type: "warning",

          title: "PDF Required",

          message:
            "Please select a syllabus PDF.",

        });

      }

      try {

        setUploading(true);

        const formData =
          new FormData();

        formData.append(
          "stream",
          stream
        );

        formData.append(
          "semester",
          semester
        );

        formData.append(
          "syllabusType",
          syllabusType
        );

        formData.append(
          "pdf",
          pdfFile
        );

        const res =
          await api.post(
            "/syllabus",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        setPdfFile(null);

        const input =
          document.getElementById(
            "syllabusPdf"
          );

        if (input) {

          input.value = "";

        }

        await fetchSyllabus();

        setStatusModal({

          isOpen: true,

          type: "success",

          title:
            "Upload Successful",

          message:
            res.data.message,

        });

      } catch (error) {

        setStatusModal({

          isOpen: true,

          type: "error",

          title:
            "Upload Failed",

          message:

            error.response?.data
              ?.message ||

            "Unable to upload syllabus.",

        });

      } finally {

        setUploading(false);

      }

    };

  /* ==========================================================
     DELETE SYLLABUS
  ========================================================== */

  const handleDelete =
    (item) => {

      setDeleteModal({

        isOpen: true,

        title:
          "Delete Syllabus",

        message: `Delete ${item.stream} Semester ${item.semester} (${item.syllabusType}) syllabus?`,

        onConfirm:
          async () => {

            try {

              setDeleting(true);

              const res =
                await api.delete(

                  `/syllabus/${item._id}`

                );

              setStatusModal({

                isOpen: true,

                type: "success",

                title:
                  "Deleted",

                message:
                  res.data.message,

              });

              await fetchSyllabus();

            } catch (error) {

              setStatusModal({

                isOpen: true,

                type: "error",

                title:
                  "Delete Failed",

                message:

                  error.response?.data
                    ?.message ||

                  "Unable to delete syllabus.",

              });

            } finally {

              setDeleting(false);

              setDeleteModal({

                isOpen: false,

                title: "",

                message: "",

                onConfirm: null,

              });

            }

          },

      });

    };

  /* ==========================================================
     CLEAR FILTERS
  ========================================================== */

  const clearFilters =
    () => {

      setSearch("");

      setFilterStream("All");

      setFilterSemester("All");

      setFilterType("All");

    };

  /* ==========================================================
     FILTERED DATA
  ========================================================== */

  const filteredSyllabus =
    useMemo(() => {

      return syllabus.filter(
        (item) => {

          const keyword =
            search.toLowerCase();

          const searchMatch =

            item.stream
              ?.toLowerCase()
              .includes(keyword) ||

            item.syllabusType
              ?.toLowerCase()
              .includes(keyword) ||

            item.semester
              ?.toString()
              .includes(keyword);

          const streamMatch =

            filterStream ===
              "All" ||

            item.stream ===
              filterStream;

          const semesterMatch =

            filterSemester ===
              "All" ||

            item.semester ===
              Number(
                filterSemester
              );

          const typeMatch =

            filterType ===
              "All" ||

            item.syllabusType ===
              filterType;

          return (

            searchMatch &&

            streamMatch &&

            semesterMatch &&

            typeMatch

          );

        }

      );

    }, [

      syllabus,

      search,

      filterStream,

      filterSemester,

      filterType,

    ]);

  /* ==========================================================
     DASHBOARD STATS
  ========================================================== */

  const stats =
    useMemo(() => ({

      total:
        syllabus.length,

      newCount:
        syllabus.filter(
          (item) =>
            item.syllabusType ===
            "new"
        ).length,

      oldCount:
        syllabus.filter(
          (item) =>
            item.syllabusType ===
            "old"
        ).length,

      mca:
        syllabus.filter(
          (item) =>
            item.stream ===
            "MCA"
        ).length,

      bca:
        syllabus.filter(
          (item) =>
            item.stream ===
            "BCA"
        ).length,

      bba:
        syllabus.filter(
          (item) =>
            item.stream ===
            "BBA"
        ).length,

    }), [

      syllabus,

    ]);

    /* ==========================================================
     RETURN
  ========================================================== */

  return (

    <>

      <LoadingModal
        isOpen={
          loading ||
          uploading ||
          deleting
        }
        title={
          uploading
            ? "Uploading Syllabus"
            : deleting
            ? "Deleting Syllabus"
            : "Loading Syllabus"
        }
        message={
          uploading
            ? "Uploading PDF to Cloudinary..."
            : deleting
            ? "Deleting syllabus..."
            : "Fetching syllabus records..."
        }
      />

      <StatusModal
        isOpen={
          statusModal.isOpen
        }
        type={
          statusModal.type
        }
        title={
          statusModal.title
        }
        message={
          statusModal.message
        }
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
        isOpen={
          deleteModal.isOpen
        }
        title={
          deleteModal.title
        }
        message={
          deleteModal.message
        }
        onConfirm={
          deleteModal.onConfirm
        }
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
          duration: 0.35,
        }}

        className="
          min-h-screen
          bg-base-200
          p-6
        "

      >

        <div className="max-w-7xl mx-auto space-y-8">

          {/* ==========================================================
              HERO
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

            className="
              hero
              rounded-3xl
              bg-linear-to-r
              from-primary
              via-secondary
              to-accent
              text-primary-content
              shadow-xl
            "

          >

            <div className="hero-content w-full flex-col lg:flex-row justify-between py-10">

              <div>

                <h1 className="text-4xl lg:text-5xl font-black">

                  Syllabus Management

                </h1>

                <p className="mt-4 max-w-3xl text-lg opacity-90">

                  Upload, organize and manage
                  semester-wise syllabus PDFs
                  for every academic programme.

                </p>

              </div>

              <button
                onClick={fetchSyllabus}
                className="btn btn-outline bg-base-100 text-base-content border-0"
              >

                <RefreshCw size={18} />

                Refresh

              </button>

            </div>

          </motion.div>

          {/* ==========================================================
              DASHBOARD
          ========================================================== */}

          <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5">

            <div className="stat bg-base-100 rounded-box shadow border border-base-300">

              <div className="stat-figure text-primary">

                <BookOpen size={28} />

              </div>

              <div className="stat-title">

                Total Files

              </div>

              <div className="stat-value text-primary">

                {stats.total}

              </div>

            </div>

            <div className="stat bg-base-100 rounded-box shadow border border-base-300">

              <div className="stat-title">

                New

              </div>

              <div className="stat-value text-success">

                {stats.newCount}

              </div>

            </div>

            <div className="stat bg-base-100 rounded-box shadow border border-base-300">

              <div className="stat-title">

                Old

              </div>

              <div className="stat-value text-warning">

                {stats.oldCount}

              </div>

            </div>

            <div className="stat bg-base-100 rounded-box shadow border border-base-300">

              <div className="stat-title">

                MCA

              </div>

              <div className="stat-value text-secondary">

                {stats.mca}

              </div>

            </div>

            <div className="stat bg-base-100 rounded-box shadow border border-base-300">

              <div className="stat-title">

                BCA + BBA

              </div>

              <div className="stat-value text-accent">

                {stats.bca + stats.bba}

              </div>

            </div>

          </div>

          {/* ==========================================================
              UPLOAD FORM
          ========================================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <h2 className="card-title text-2xl">

                <Upload size={22} />

                Upload Syllabus

              </h2>

              <form

                onSubmit={handleUpload}

                className="grid lg:grid-cols-4 gap-4 mt-5"

              >

                <select

                  className="select select-bordered"

                  value={stream}

                  onChange={(e) =>
                    setStream(
                      e.target.value
                    )
                  }

                >

                  <option>MCA</option>

                  <option>BCA</option>

                  <option>BBA</option>

                </select>

                <select

                  className="select select-bordered"

                  value={semester}

                  onChange={(e) =>
                    setSemester(
                      Number(
                        e.target.value
                      )
                    )
                  }

                >

                  {semesterOptions.map(
                    (sem) => (

                      <option
                        key={sem}
                        value={sem}
                      >

                        Semester {sem}

                      </option>

                    )
                  )}

                </select>

                <select

                  className="select select-bordered"

                  value={syllabusType}

                  onChange={(e) =>
                    setSyllabusType(
                      e.target.value
                    )
                  }

                >

                  <option value="new">

                    New Syllabus

                  </option>

                  <option value="old">

                    Old Syllabus

                  </option>

                </select>

                <input

                  id="syllabusPdf"

                  type="file"

                  accept=".pdf"

                  className="file-input file-input-bordered w-full"

                  onChange={(e) =>
                    setPdfFile(
                      e.target.files[0]
                    )
                  }

                />

                <button

                  type="submit"

                  disabled={uploading}

                  className="btn btn-primary lg:col-span-4"

                >

                  <Upload size={18} />

                  {uploading

                    ? "Uploading..."

                    : "Upload Syllabus"}

                </button>

              </form>

            </div>

          </div>

          
                    {/* ==========================================================
              SEARCH & FILTERS
          ========================================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex items-center gap-2 mb-5">

                <Filter size={20} />

                <h2 className="text-xl font-black">

                  Search & Filters

                </h2>

              </div>

              <div className="grid xl:grid-cols-5 gap-4">

                {/* SEARCH */}

                <label className="input input-bordered flex items-center gap-2">

                  <Search size={18} />

                  <input

                    type="text"

                    className="grow"

                    placeholder="Search Stream / Semester / Type"

                    value={search}

                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }

                  />

                </label>

                {/* STREAM */}

                <select

                  className="select select-bordered"

                  value={filterStream}

                  onChange={(e) =>
                    setFilterStream(
                      e.target.value
                    )
                  }

                >

                  <option>

                    All

                  </option>

                  <option>

                    MCA

                  </option>

                  <option>

                    BCA

                  </option>

                  <option>

                    BBA

                  </option>

                </select>

                {/* SEMESTER */}

                <select

                  className="select select-bordered"

                  value={filterSemester}

                  onChange={(e) =>
                    setFilterSemester(
                      e.target.value
                    )
                  }

                >

                  <option>

                    All

                  </option>

                  {[1,2,3,4,5,6,7,8].map(
                    (sem) => (

                      <option
                        key={sem}
                        value={sem}
                      >

                        Semester {sem}

                      </option>

                    )
                  )}

                </select>

                {/* TYPE */}

                <select

                  className="select select-bordered"

                  value={filterType}

                  onChange={(e) =>
                    setFilterType(
                      e.target.value
                    )
                  }

                >

                  <option>

                    All

                  </option>

                  <option value="new">

                    New

                  </option>

                  <option value="old">

                    Old

                  </option>

                </select>

                {/* CLEAR */}

                <button

                  type="button"

                  onClick={clearFilters}

                  className="btn btn-outline"

                >

                  Clear Filters

                </button>

              </div>

            </div>

          </div>

          {/* ==========================================================
              SYLLABUS GRID
          ========================================================== */}

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredSyllabus.length === 0 ? (

              <div className="col-span-full">

                <div className="hero bg-base-100 rounded-3xl border border-base-300">

                  <div className="hero-content py-20 text-center">

                    <div>

                      <FolderOpen

                        size={72}

                        className="mx-auto opacity-20"

                      />

                      <h2 className="text-3xl font-black mt-5">

                        No Syllabus Found

                      </h2>

                      <p className="text-base-content/60 mt-2">

                        Try changing the filters or upload a new syllabus.

                      </p>

                    </div>

                  </div>

                </div>

              </div>

            ) : (

              filteredSyllabus.map(
                (item) => (

                  <motion.div

                    key={item._id}

                    whileHover={{
                      y: -4,
                    }}

                    className="card bg-base-100 border border-base-300 shadow-xl"

                  >

                    <div className="card-body">

                      <div className="flex justify-between items-start">

                        <div>

                          <h2 className="text-2xl font-black">

                            {item.stream}

                          </h2>

                          <p className="text-base-content/60">

                            Semester {item.semester}

                          </p>

                        </div>

                        <span className="badge badge-primary">

                          {item.syllabusType.toUpperCase()}

                        </span>

                      </div>

                      <div className="divider"></div>

                      <div className="flex items-center gap-2">

                        <FileText
                          size={18}
                        />

                        <span>

                          Syllabus PDF

                        </span>

                      </div>

                      <div className="card-actions justify-end mt-6">

                        <button

                          type="button"

                          onClick={() =>
                            setPreviewPdf(
                              item
                            )
                          }

                          className="btn btn-info btn-sm"

                        >

                          <Eye size={16} />

                          View

                        </button>

                        <a

                          href={item.pdfFile}

                          target="_blank"

                          rel="noopener noreferrer"

                          className="btn btn-primary btn-sm"

                        >

                          <Download size={16} />

                          Download

                        </a>

                        <button

                          type="button"

                          onClick={() =>
                            handleDelete(
                              item
                            )
                          }

                          className="btn btn-error btn-sm"

                        >

                          <Trash2 size={16} />

                          Delete

                        </button>

                      </div>

                    </div>

                  </motion.div>

                )

              )

            )}

          </div>

         
                    {/* ==========================================================
              PDF PREVIEW MODAL
          ========================================================== */}

          {previewPdf && (

            <dialog className="modal modal-open">

              <div className="modal-box max-w-6xl">

                <div className="flex items-center justify-between mb-5">

                  <div>

                    <h3 className="text-2xl font-black">

                      {previewPdf.stream}

                      {" • "}

                      Semester {previewPdf.semester}

                    </h3>

                    <p className="text-base-content/60">

                      {previewPdf.syllabusType.toUpperCase()} Syllabus

                    </p>

                  </div>

                  <button
                    type="button"
                    className="btn btn-circle btn-sm"
                    onClick={() =>
                      setPreviewPdf(
                        null
                      )
                    }
                  >

                    ✕

                  </button>

                </div>

                <div className="rounded-xl overflow-hidden border border-base-300">

                  <iframe

                    src={previewPdf.pdfFile}

                    title="Syllabus Preview"

                    className="w-full h-[75vh]"

                  />

                </div>

                <div className="modal-action">

                  <a

                    href={previewPdf.pdfFile}

                    target="_blank"

                    rel="noopener noreferrer"

                    className="btn btn-primary"

                  >

                    <Download size={18} />

                    Download

                  </a>

                  <button

                    type="button"

                    className="btn"

                    onClick={() =>
                      setPreviewPdf(
                        null
                      )
                    }

                  >

                    Close

                  </button>

                </div>

              </div>

            </dialog>

          )}

          {/* ==========================================================
              STICKY FOOTER
          ========================================================== */}

          <div className="sticky bottom-4 z-30">

            <div className="card bg-base-100 border border-base-300 shadow-2xl">

              <div className="card-body py-4">

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

                  <div>

                    <h3 className="font-black text-xl">

                      Syllabus Management Dashboard

                    </h3>

                    <p className="text-base-content/60 mt-1">

                      Manage and organize syllabus PDFs for all
                      programmes and semesters from one
                      centralized ERP dashboard.

                    </p>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    <div className="badge badge-primary badge-lg">

                      Total {stats.total}

                    </div>

                    <div className="badge badge-success badge-lg">

                      New {stats.newCount}

                    </div>

                    <div className="badge badge-warning badge-lg">

                      Old {stats.oldCount}

                    </div>

                    <div className="badge badge-secondary badge-lg">

                      MCA {stats.mca}

                    </div>

                    <div className="badge badge-accent badge-lg">

                      BCA+BBA {stats.bca + stats.bba}

                    </div>

                  </div>

                </div>

                <div className="divider my-4"></div>

                <div className="flex justify-end gap-3">

                  <button

                    type="button"

                    onClick={fetchSyllabus}

                    disabled={loading}

                    className="btn btn-outline"

                  >

                    <RefreshCw size={18} />

                    Refresh

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </motion.div>

    </>

  );

}