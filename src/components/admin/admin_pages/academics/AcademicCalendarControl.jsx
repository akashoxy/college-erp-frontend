import { useEffect, useState } from "react";
import {
  CalendarDays,
  Upload,
  Save,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import {
  Document,
  Page,
  pdfjs,
} from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import pdfWorker from
"pdfjs-dist/build/pdf.worker.min.mjs?url";

 pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

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

const AcademicCalendarControl = () => {

 
  /* ======================================================
      STATE
  ====================================================== */

  const [calendar, setCalendar] = useState({
    redirectUrl: "",
  });

  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  const [fetching, setFetching] = useState(true);

  const [statusModal, setStatusModal] =
    useState({
      open: false,
      type: "info",
      title: "",
      message: "",
    });

  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);
  const [fileType, setFileType] =
  useState("");

  /* ======================================================
      HELPERS
  ====================================================== */

  const uploadInfo =
    getUploadRequirements({
      images: true,
      pdf: true,
      maxSize: "10 MB",
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

  const fetchCalendar = async () => {
    try {
      setFetching(true);

      const { data } =
        await api.get("/calendar");

      if (
        data.success &&
        data.data
      ) {
       setCalendar({
    redirectUrl:
        data.data.redirectUrl || "",

    publicId:
        data.data.publicId || "",

    fileUrl:
        data.data.fileUrl || "",

    fileType:
        data.data.fileType || "",
});

setPreview(
  data.data.fileUrl || ""
);

setFileType(
  data.data.fileType || ""
);
      } else {
        setCalendar({
          redirectUrl: "",
        });

        setPreview("");
      }
    } catch (error) {
      showStatus(
        "error",
        TITLES.ERROR,
        error?.response?.data?.message ||
          "Unable to load Academic Calendar."
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  /* ======================================================
      CLEANUP BLOB URL
  ====================================================== */

  useEffect(() => {
    return () => {
      cleanupBlobUrl(preview);
    };
  }, [preview]);

  /* ======================================================
      FILE CHANGE
  ====================================================== */

  const handleFileChange = (
    e
  ) => {
    const selected =
      e.target.files?.[0];

    if (!selected) return;

    const validation =
      validateUpload(selected, {
        allowImages: true,
        allowPdf: true,
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

    const filePreview =
      previewFile(selected);

    setFile(selected);

setPreview(
  filePreview.preview
);

setFileType(
  filePreview.type
);
  };

  /* ======================================================
      SAVE
  ====================================================== */

  const handleSave = async () => {
    try {
      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "redirectUrl",
        calendar.redirectUrl
      );

      if (file) {
        formData.append(
          "file",
          file
        );
      }

      const { data } =
        await api.post(
          "/calendar/add",
          formData
        );

      showStatus(
        "success",
        TITLES.SUCCESS,
        data.message ||
          getSaveMessage(
            "Academic Calendar"
          )
      );

      setFile(null);

      fetchCalendar();
    } catch (error) {
      showStatus(
        "error",
        TITLES.ERROR,
        error?.response?.data?.message ||
          "Unable to save Academic Calendar."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
      REMOVE FILE
  ====================================================== */

  const handleRemoveFile =
    async () => {
      try {
        setLoading(true);

        const { data } =
          await api.delete(
            "/calendar/file"
          );

        showStatus(
          "success",
          TITLES.SUCCESS,
          data.message
        );

        fetchCalendar();
      } catch (error) {
        showStatus(
          "error",
          TITLES.ERROR,
          error?.response?.data?.message ||
            "Unable to remove Academic Calendar."
        );
      } finally {
        setLoading(false);
      }
    };

  const confirmRemoveFile =
    () => {
      setDeleteModalOpen(false);
      handleRemoveFile();
    };

  /* ======================================================
      PDF CHECK
  ====================================================== */

  const isPdf =
  fileType === "pdf";

  /* ======================================================
      RETURN
  ====================================================== */
    console.log("Preview:", preview);
console.log("File Type:", fileType);
  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
                {/* ======================================================
            HERO
        ====================================================== */}

        <div className="hero bg-linear-to-r from-primary to-secondary rounded-3xl shadow-xl">

          <div className="hero-content text-center text-primary-content py-12">

            <div>

              <CalendarDays
                size={64}
                className="mx-auto mb-5"
              />

              <h1 className="text-4xl md:text-5xl font-black">

                Academic Calendar CMS

              </h1>

              <p className="mt-4 max-w-3xl text-lg opacity-90">

                Upload, update and manage the
                Academic Calendar. Images and PDFs
                are securely stored in Cloudinary.

              </p>

            </div>

          </div>

        </div>

        {/* ======================================================
            DASHBOARD STATS
        ====================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Upload Status */}

          <div className="stats shadow bg-base-100 border border-base-300">

            <div className="stat">

              <div className="stat-figure text-primary">

                <Upload size={32} />

              </div>

              <div className="stat-title">

                Upload Status

              </div>

              <div className="stat-value text-primary text-2xl">

                {preview ? "Active" : "Empty"}

              </div>

            </div>

          </div>

          {/* File Type */}

          <div className="stats shadow bg-base-100 border border-base-300">

            <div className="stat">

              <div className="stat-figure text-secondary">

                <FileText size={32} />

              </div>

              <div className="stat-title">

                File Type

              </div>

              <div className="stat-value text-secondary text-2xl">

                {preview
                  ? isPdf
                    ? "PDF"
                    : "Image"
                  : "--"}

              </div>

            </div>

          </div>

          {/* Redirect */}

          <div className="stats shadow bg-base-100 border border-base-300">

            <div className="stat">

              <div className="stat-figure text-accent">

                <ExternalLink size={32} />

              </div>

              <div className="stat-title">

                Redirect URL

              </div>

              <div className="stat-value text-accent text-lg">

                {calendar.redirectUrl
                  ? "Configured"
                  : "Not Set"}

              </div>

            </div>

          </div>

        </div>

        {/* ======================================================
            MAIN GRID
        ====================================================== */}

        <div className="grid lg:grid-cols-5 gap-6">

          {/* ======================================================
              LEFT PANEL
          ====================================================== */}

          <div className="lg:col-span-2">

            <div className="card bg-base-100 border border-base-300 shadow-xl">

              <div className="card-body">

                <h2 className="card-title text-2xl font-black">

                  Upload Academic Calendar

                </h2>

                <p className="text-base-content/70">

                  Replace or upload a new Academic
                  Calendar.

                </p>

                {/* Upload */}

                <div className="mt-5">

                  <label className="label">

                    <span className="label-text font-semibold">

                      Academic Calendar File

                    </span>

                  </label>

                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered file-input-primary w-full"
                  />

                </div>

                {/* Upload Requirements */}

                <div className="alert alert-info mt-5">

                  <div>

                    <h3 className="font-bold">

                      {uploadInfo.title}

                    </h3>

                    <ul className="list-disc list-inside text-sm mt-2 space-y-1">

                      {uploadInfo.formats.map(
                        (item) => (

                          <li key={item}>

                            {item}

                          </li>

                        )
                      )}

                      <li>

                        Maximum Size :{" "}

                        {uploadInfo.maxSize}

                      </li>

                    </ul>

                  </div>

                </div>

                {/* Redirect URL */}

                <div className="mt-6">

                  <label className="label">

                    <span className="label-text font-semibold">

                      Redirect URL

                    </span>

                  </label>

                  <input
                    type="url"
                    className="input input-bordered w-full"
                    placeholder="https://example.com"
                    value={calendar.redirectUrl}
                    onChange={(e) =>
                      setCalendar({
                        ...calendar,
                        redirectUrl:
                          e.target.value,
                      })
                    }
                  />

                  <label className="label">

                    <span className="label-text-alt">

                      Optional. Users will be
                      redirected after clicking
                      the Academic Calendar.

                    </span>

                  </label>

                </div>

                {/* Action Buttons */}

                <div className="grid grid-cols-2 gap-4 mt-8">

                  <button
                    className="btn btn-outline btn-error"
                    type="button"
                    onClick={() =>
                      setDeleteModalOpen(true)
                    }
                  >

                    <Trash2 size={18} />

                    Remove File

                  </button>

                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleSave}
                    disabled={loading}
                  >

                    <Save size={18} />

                    Save Changes

                  </button>

                </div>

              </div>

            </div>

          </div>

          {/* ======================================================
              RIGHT PANEL
          ====================================================== */}

          <div className="lg:col-span-3">

            <div className="card bg-base-100 border border-base-300 shadow-xl">

              <div className="card-body">

                <div className="flex items-center justify-between">

                  <h2 className="card-title text-2xl font-black">

                    Live Preview

                  </h2>

                  {preview && (

                    <div className="badge badge-success badge-lg">

                      Current File

                    </div>

                  )}

                </div>
                                {/* ======================================================
                    PREVIEW CONTENT
                ====================================================== */}

                {fetching ? (

                  <div className="space-y-5 mt-6">

                    <div className="skeleton h-10 w-60 rounded-xl"></div>

                    <div className="skeleton h-162.5 w-full rounded-3xl"></div>

                  </div>

                ) : !preview ? (

                  /* ======================================================
                      EMPTY STATE
                  ====================================================== */

                  <div className="h-162.5 rounded-3xl border-2 border-dashed border-base-300 bg-base-200 flex flex-col justify-center items-center text-center px-8">

                    <ImageIcon
                      size={90}
                      className="text-base-content/40 mb-6"
                    />

                    <h2 className="text-3xl font-black">

                      No Academic Calendar Uploaded

                    </h2>

                    <p className="text-base-content/60 mt-4 max-w-xl">

                      Upload an Academic Calendar
                      image or PDF.

                      <br />

                      Once uploaded, it will
                      appear here automatically.

                    </p>

                  </div>

                ) : isPdf ? (

                  /* ======================================================
                      PDF PREVIEW
                  ====================================================== */

                  <div className="space-y-5 mt-5">

                    <div className="alert alert-success">

                      <FileText size={20} />

                      <div>

                        <h3 className="font-bold">

                          PDF Preview

                        </h3>

                        <div className="text-sm">

                          Academic Calendar PDF
                          detected successfully.

                        </div>

                      </div>

                    </div>

                    {preview === "PDF" ? (

                      <div className="hero h-162.5 rounded-3xl bg-base-200 border border-base-300">

                        <div className="hero-content text-center">

                          <div>

                            <FileText
                              size={100}
                              className="mx-auto text-primary mb-6"
                            />

                            <h2 className="text-3xl font-black">

                              Ready to Upload

                            </h2>

                            <p className="text-base-content/70 mt-4 max-w-xl">

                              Save your changes
                              to upload this PDF.

                            </p>

                          </div>

                        </div>

                      </div>

                    ) : (

                      <div className="card bg-base-100 border border-base-300 shadow-xl">

  <div className="card-body">

    <div className="flex items-center justify-between mb-6">

      <div>

        <h2 className="text-xl font-bold">
          Academic Calendar Preview
        </h2>

        <p className="text-sm opacity-70">
          Preview of the uploaded Academic Calendar
        </p>

      </div>

      <a
        href={preview}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary btn-sm"
      >
        Open Original PDF
      </a>

    </div>

    <div className="rounded-2xl border border-base-300 bg-base-200 p-4 flex justify-center overflow-auto max-h-175">

      <Document
        file={preview}
        loading={
          <span className="loading loading-spinner loading-lg" />
        }
        error={
          <div className="text-error">
            Failed to load PDF
          </div>
        }
      >
        <Page
          pageNumber={1}
          width={700}
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      </Document>

    </div>

  </div>

</div>

                    )}

                  </div>

                ) : (

                  /* ======================================================
                      IMAGE PREVIEW
                  ====================================================== */
                    
                  <div className="space-y-5 mt-5">

                    <div className="flex justify-between items-center">

                      <div className="badge badge-primary badge-lg">

                        IMAGE PREVIEW

                      </div>
                      
                      <a
                         href={preview}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                      >

                        <ExternalLink size={16} />

                        Open Original

                      </a>

                    </div>

                    <div className="rounded-3xl overflow-hidden border border-base-300 shadow-lg bg-base-200">

                      <img
                        src={preview}
                        alt="Academic Calendar"
                        className="w-full max-h-187.5 object-contain"
                      />

                    </div>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>
                {/* ======================================================
            STICKY ACTION BAR
        ======================================================= */}

        <div className="sticky bottom-4 z-40">

          <div className="card bg-base-100 border border-base-300 shadow-2xl">

            <div className="card-body py-5">

              <div className="flex flex-col lg:flex-row justify-between items-center gap-5">

                <div>

                  <h3 className="font-bold text-lg">

                    Academic Calendar Management

                  </h3>

                  <p className="text-base-content/70 text-sm mt-1">

                    Supported Formats :

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

                  Save Changes

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          STATUS MODAL
      ======================================================= */}

      <StatusModal
        isOpen={statusModal.open}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={closeStatus}
      />

      {/* ======================================================
          LOADING MODAL
      ======================================================= */}

      <LoadingModal
        isOpen={loading}
        title="Uploading Academic Calendar"
        message="Please wait while your file is uploaded to Cloudinary."
      />

      {/* ======================================================
          DELETE MODAL
      ======================================================= */}

      <DeleteModal
        isOpen={deleteModalOpen}
        itemName="Academic Calendar File"
        onCancel={() =>
          setDeleteModalOpen(false)
        }
        onConfirm={confirmRemoveFile}
      />

    </div>

  );

};

export default AcademicCalendarControl;