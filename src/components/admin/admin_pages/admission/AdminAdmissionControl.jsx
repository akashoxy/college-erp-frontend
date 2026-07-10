import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";

import {
  Trash2,
  Pencil,
  Plus,
  BookOpen,
  Save,
} from "lucide-react";

import api from "../../../../services/api";

import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";

export default function AdminAdmissionControl() {

  /* ==========================================================
      INITIAL FORM
  ========================================================== */

  const initialForm = {
    code: "",
    duration: "",
    details: "",
    image: "",
    imagePublicId: "",
  };

  /* ==========================================================
      STATES
  ========================================================== */

  const [programs, setPrograms] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] =
    useState(initialForm);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  /* ==========================================================
      STATUS MODAL
  ========================================================== */

  const [
    statusModal,
    setStatusModal,
  ] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  /* ==========================================================
      DELETE MODAL
  ========================================================== */

  const [
    deleteModal,
    setDeleteModal,
  ] = useState({
    isOpen: false,
    program: null,
  });

  /* ==========================================================
      DASHBOARD STATS
  ========================================================== */

  const stats = useMemo(
    () => ({
      totalPrograms:
        programs.length,

      editing:
        !!editingId,
    }),

    [
      programs,
      editingId,
    ]
  );

  /* ==========================================================
      Continue in Part 2
  ========================================================== */
    /* ==========================================================
      FETCH PROGRAMS
  ========================================================== */

  const fetchPrograms = async () => {
    try {

      setLoading(true);

      const { data } =
        await api.get(
          "/admission-procedure"
        );

      setPrograms(
        data.data || []
      );

    } catch (error) {

      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message:
          error.response?.data
            ?.message ||
          "Failed to load admission procedures.",
      });

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  /* ==========================================================
      INPUT CHANGE
  ========================================================== */

  const handleChange = ({
    target,
  }) => {

    const {
      name,
      value,
    } = target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ==========================================================
      IMAGE UPLOAD
  ========================================================== */

  const handleImageUpload = async (e) => {

    const file = e.target.files?.[0];

    if (!file) return;

    setUploadingImage(true);

    try {

      const formData = new FormData();

      formData.append("image", file);

      if (form.imagePublicId) {

        formData.append(
          "oldPublicId",
          form.imagePublicId
        );

      }

      const res = await api.post(
        "/admission-procedure/upload-image",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      const { url, publicId } =
        res.data.data;

      setForm((prev) => ({
        ...prev,
        image: url,
        imagePublicId: publicId,
      }));

    } catch (error) {

      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Upload Failed",
        message:
          error.response?.data
            ?.message ||
          "Failed to upload image.",
      });

    } finally {

      setUploadingImage(false);

      e.target.value = "";

    }

  };

  /* ==========================================================
      RESET FORM
  ========================================================== */

  const resetForm = () => {

    setForm(initialForm);

    setEditingId(null);

  };

  /* ==========================================================
      Continue in Part 3
  ========================================================== */
    /* ==========================================================
      CREATE / UPDATE
  ========================================================== */

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {

      setSaving(true);

      if (editingId) {

        await api.put(
          `/admission-procedure/${editingId}`,
          form
        );

      } else {

        await api.post(
          "/admission-procedure",
          form
        );

      }

      await fetchPrograms();

      resetForm();

      setStatusModal({
        isOpen: true,
        type: "success",
        title: "Success",
        message: editingId
          ? "Program updated successfully."
          : "Program created successfully.",
      });

    } catch (error) {

      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message:
          error.response?.data
            ?.message ||
          "Operation failed.",
      });

    } finally {

      setSaving(false);

    }
  };

  /* ==========================================================
      EDIT
  ========================================================== */

  const handleEdit = (
    program
  ) => {

    setEditingId(
      program._id
    );

    setForm({
      code:
        program.code || "",
      duration:
        program.duration || "",
      details:
        program.details || "",
      image:
        program.image || "",
      imagePublicId:
        program.imagePublicId || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };

  /* ==========================================================
      DELETE
  ========================================================== */

  const handleDelete =
    async () => {

      if (
        !deleteModal.program
      ) {
        return;
      }

      try {

        setSaving(true);

        await api.delete(
          `/admission-procedure/${deleteModal.program._id}`
        );

        await fetchPrograms();

        if (
          editingId ===
          deleteModal.program._id
        ) {
          resetForm();
        }

        setDeleteModal({
          isOpen: false,
          program: null,
        });

        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Deleted",
          message:
            "Program deleted successfully.",
        });

      } catch (error) {

        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Error",
          message:
            error.response?.data
              ?.message ||
            "Delete failed.",
        });

      } finally {

        setSaving(false);

      }

    };

  /* ==========================================================
      JSX
  ========================================================== */

  return (
    <>
          {/* ==========================================================
          MODALS
      ========================================================== */}

      <LoadingModal
        isOpen={loading || saving}
        title={
          saving
            ? "Saving Program"
            : "Loading Programs"
        }
        message={
          saving
            ? "Please wait while your changes are being saved..."
            : "Fetching admission procedures..."
        }
      />

      <StatusModal
        isOpen={statusModal.isOpen}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() =>
          setStatusModal((prev) => ({
            ...prev,
            isOpen: false,
          }))
        }
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        itemName={
          deleteModal.program?.code
        }
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteModal({
            isOpen: false,
            program: null,
          })
        }
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 15,
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
              HERO
          ========================================================== */}

          <div className="hero rounded-3xl bg-linear-to-r from-primary to-secondary text-primary-content shadow-2xl">

            <div className="hero-content text-center py-10">

              <div>

                <BookOpen
                  size={60}
                  className="mx-auto mb-4"
                />

                <h1 className="text-4xl md:text-5xl font-black">

                  Admission Procedure CMS

                </h1>

                <p className="mt-3 text-lg opacity-90">

                  Manage admission procedure
                  cards dynamically from one
                  dashboard.

                </p>

              </div>

            </div>

          </div>

          {/* ==========================================================
              DASHBOARD
          ========================================================== */}

          <div className="stats shadow bg-base-100 border border-base-300 w-full">

            <div className="stat">

              <div className="stat-figure text-primary">

                <BookOpen size={32} />

              </div>

              <div className="stat-title">

                Total Programs

              </div>

              <div className="stat-value text-primary">

                {stats.totalPrograms}

              </div>

            </div>

            <div className="stat">

              <div className="stat-figure text-warning">

                <Pencil size={30} />

              </div>

              <div className="stat-title">

                Editing

              </div>

              <div className="stat-value text-warning">

                {stats.editing
                  ? "YES"
                  : "NO"}

              </div>

            </div>

          </div>

          {/* ==========================================================
              FORM
          ========================================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <h2 className="card-title text-3xl font-black">

                {editingId
                  ? "Update Program"
                  : "Create Program"}

              </h2>

              <p className="text-base-content/70">

                Manage admission procedure
                information displayed on the
                website.

              </p>

              <form
                onSubmit={handleSubmit}
                className="space-y-6 mt-6"
              >

                {/* PROGRAM CODE */}

                <div>

                  <label className="label">

                    <span className="label-text font-semibold">

                      Program Code

                    </span>

                  </label>

                  <input
                    type="text"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="BCA / BBA / MCA"
                    className="input input-bordered w-full"
                    required
                  />

                </div>

                {/* DURATION */}

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
                    placeholder="4 Years (Honours)"
                    className="input input-bordered w-full"
                    required
                  />

                </div>

                {/* PROGRAM IMAGE */}

                <div>

                  <label className="label">

                    <span className="label-text font-semibold">

                      Program Image

                    </span>

                  </label>

                  {form.image && (

                    <img
                      src={form.image}
                      alt="Program preview"
                      className="w-full h-44 object-cover rounded-xl border border-base-300 mb-3"
                    />

                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="file-input file-input-bordered w-full"
                  />

                  {uploadingImage && (

                    <span className="text-sm text-base-content/60 mt-2 block">

                      Uploading...

                    </span>

                  )}

                </div>

                {/* DETAILS */}

                <div>

                  <label className="label">

                    <span className="label-text font-semibold">

                      Details

                    </span>

                  </label>

                  <textarea
                    name="details"
                    value={form.details}
                    onChange={handleChange}
                    rows={8}
                    placeholder="Write admission procedure..."
                    className="textarea textarea-bordered w-full"
                    required
                  />

                </div>

                <div className="flex gap-3">

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >

                    {editingId ? (
                      <>
                        <Save size={18} />
                        Update Program
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        Create Program
                      </>
                    )}

                  </button>

                  {editingId && (

                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={resetForm}
                    >

                      Cancel

                    </button>

                  )}

                </div>

              </form>

            </div>

          </div>

          {/* ==========================================================
              Continue in Part 5
          ========================================================== */}
                    {/* ==========================================================
              PROGRAM CARDS
          ========================================================== */}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {loading ? (

              <div className="col-span-full flex justify-center py-20">

                <span className="loading loading-spinner loading-lg text-primary" />

              </div>

            ) : programs.length === 0 ? (

              <div className="col-span-full">

                <div className="card bg-base-100 border border-base-300 shadow-xl">

                  <div className="card-body text-center py-16">

                    <BookOpen
                      size={60}
                      className="mx-auto opacity-40"
                    />

                    <h2 className="text-3xl font-bold mt-4">

                      No Programs Found

                    </h2>

                    <p className="text-base-content/60 mt-2">

                      Create your first admission
                      procedure card.

                    </p>

                  </div>

                </div>

              </div>

            ) : (

              programs.map((program) => (

                <motion.div
                  key={program._id}
                  whileHover={{
                    y: -5,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="card bg-base-100 border border-base-300 shadow-xl overflow-hidden"
                >

                  {/* ==========================
                      CARD IMAGE / HEADER
                  ========================== */}

                  {program.image ? (

                    <>
                      <img
                        src={program.image}
                        alt={program.code}
                        className="w-full h-44 object-cover"
                      />

                      <div className="bg-linear-to-r from-primary to-secondary text-primary-content p-6">

                        <h2 className="text-3xl font-black">

                          {program.code}

                        </h2>

                        <p className="mt-2 opacity-90">

                          {program.duration}

                        </p>

                      </div>
                    </>

                  ) : (

                    <div className="bg-linear-to-r from-primary to-secondary text-primary-content p-6">

                      <h2 className="text-3xl font-black">

                        {program.code}

                      </h2>

                      <p className="mt-2 opacity-90">

                        {program.duration}

                      </p>

                    </div>

                  )}

                  {/* ==========================
                      CARD BODY
                  ========================== */}

                  <div className="card-body">

                    <p
                      className="
                        text-base-content/70
                        leading-relaxed
                        whitespace-pre-line
                        line-clamp-6
                      "
                    >

                      {program.details}

                    </p>

                    <div className="divider my-2" />

                    {/* ==========================
                        ACTIONS
                    ========================== */}

                    <div className="flex gap-3">

                      <button
                        className="btn btn-info flex-1"
                        onClick={() =>
                          handleEdit(program)
                        }
                      >

                        <Pencil size={16} />

                        Edit

                      </button>

                      <button
                        className="btn btn-error flex-1"
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            program,
                          })
                        }
                      >

                        <Trash2 size={16} />

                        Delete

                      </button>

                    </div>

                  </div>

                </motion.div>

              ))

            )}

          </div>

        </div>

      </motion.div>

    </>

  );

}