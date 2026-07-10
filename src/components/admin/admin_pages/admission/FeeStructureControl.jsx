import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";

import {
  GraduationCap,
  FileText,
  IndianRupee,
  Upload,
  Save,
  Pencil,
  Trash2,
} from "lucide-react";

import api from "../../../../services/api";


import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";


/* ==========================================================
    ANIMATION
========================================================== */

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

/* ==========================================================
    SEMESTER HELPER
========================================================== */

const generateSemesters = (
  stream
) => {

  const total =
    stream === "MCA"
      ? 4
      : 8;

  return Array.from(
    {
      length: total,
    },
    (_, index) => ({
      semester: `Semester ${
        index + 1
      }`,
      amount: "",
    })
  );

};

const initialForm = {
  stream: "BCA",
  duration: "",
  admissionFee: "",
  batch: "",
  semesterFees:
    generateSemesters(
      "BCA"
    ),
  notes: [""],
  pdfFile: "",
};

export default function FeeStructureControl() {

  /* ==========================================================
      STATES
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
    editingId,
    setEditingId,
  ] = useState(null);

  const [
    pdfFile,
    setPdfFile,
  ] = useState(null);

  const [
    pdfKey,
    setPdfKey,
  ] = useState(
    Date.now()
  );

  const [
    feeStructures,
    setFeeStructures,
  ] = useState([]);

  const [
    formData,
    setFormData,
  ] = useState(
    initialForm
  );

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
    item: null,
  });

  /* ==========================================================
      DASHBOARD STATS
  ========================================================== */

  const stats = useMemo(
    () => ({
      total:
        feeStructures.length,

      editing:
        !!editingId,

      totalFee:
        Number(
          formData.admissionFee || 0
        ) +
        formData.semesterFees.reduce(
          (
            total,
            semester
          ) =>
            total +
            Number(
              semester.amount || 0
            ),
          0
        ),
    }),
    [
      feeStructures,
      editingId,
      formData,
    ]
  );

  /* ==========================================================
      Continue in Part 2
  ========================================================== */
    /* ==========================================================
      LOAD DATA
  ========================================================== */

  const loadData = async () => {

    try {

      setLoading(true);

     const { data } =
  await api.get(
    "/fee-structure"
  );

setFeeStructures(
  data.data.feeStructures || []
);

    } catch (error) {

      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Load Failed",
        message:
          error.response?.data
            ?.message ||
          "Failed to load fee structures.",
      });

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadData();

  }, []);

  /* ==========================================================
      TOTAL FEE
  ========================================================== */

  const calculateTotalFee =
    () => {

      const admission =
        Number(
          formData.admissionFee
        ) || 0;

      const semesterTotal =
        formData.semesterFees.reduce(
          (
            sum,
            semester
          ) =>
            sum +
            (Number(
              semester.amount
            ) || 0),
          0
        );

      return (
        admission +
        semesterTotal
      );

    };

  /* ==========================================================
      SEMESTER FEE
  ========================================================== */

  const handleSemesterAmount =
    (
      index,
      value
    ) => {

      setFormData(
        (prev) => {

          const updated =
            [
              ...prev.semesterFees,
            ];

          updated[
            index
          ] = {
            ...updated[
              index
            ],
            amount:
              value.replace(
                /\D/g,
                ""
              ),
          };

          return {
            ...prev,
            semesterFees:
              updated,
          };

        }
      );

    };

  /* ==========================================================
      NOTES
  ========================================================== */

  const handleNoteChange =
    (
      index,
      value
    ) => {

      setFormData(
        (prev) => {

          const updated =
            [...prev.notes];

          updated[index] =
            value;

          return {
            ...prev,
            notes: updated,
          };

        }
      );

    };

  const addNote = () => {

    setFormData(
      (prev) => ({
        ...prev,
        notes: [
          ...prev.notes,
          "",
        ],
      })
    );

  };

  const removeNote =
    (index) => {

      setFormData(
        (prev) => ({
          ...prev,
          notes:
            prev.notes.filter(
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
      Continue in Part 3
  ========================================================== */
    /* ==========================================================
      RESET FORM
  ========================================================== */

  const resetForm = () => {

    setEditingId(null);

    setPdfFile(null);

    setPdfKey(
      Date.now()
    );

    setFormData({
  ...initialForm,
  semesterFees:
    generateSemesters("BCA"),
});

  };

  /* ==========================================================
      EDIT
  ========================================================== */

  const handleEdit = (
    fee
  ) => {

    setEditingId(
      fee._id
    );

    setPdfFile(null);

    setPdfKey(
      Date.now()
    );

    setFormData({
      stream:
        fee.stream,
      duration:
        fee.duration,
      admissionFee:
        fee.admissionFee,
      batch:
        fee.batch,
      semesterFees:
  fee.semesterFees?.length
    ? fee.semesterFees
    : generateSemesters(
        fee.stream
      ),
      notes:
        fee.notes?.length
          ? fee.notes
          : [""],
      pdfFile:
        fee.pdfFile,
    });

    window.scrollTo({
      top: 0,
      behavior:
        "smooth",
    });

  };

  /* ==========================================================
    DELETE FEE STRUCTURE
========================================================== */

const handleDelete = async () => {

  if (!deleteModal.item) {

    return;

  }

  try {

    setSaving(true);

    await api.delete(
      `/fee-structure/${deleteModal.item._id}`
    );

    await loadData();

    setDeleteModal({

      isOpen: false,

      item: null,

    });

    if (
      editingId ===
      deleteModal.item._id
    ) {

      resetForm();

    }

    setStatusModal({

      isOpen: true,

      type: "success",

      title: "Deleted",

      message:
        "Fee Structure deleted successfully.",

    });

  } catch (error) {

    setStatusModal({

      isOpen: true,

      type: "error",

      title: "Delete Failed",

      message:

        error.response?.data
          ?.message ||

        "Failed to delete Fee Structure.",

    });

  } finally {

    setSaving(false);

  }

};

  /* ==========================================================
      CREATE / UPDATE
  ========================================================== */

  const saveFeeStructure =
    async () => {

      const invalidSemester =
        formData.semesterFees.find(
          (semester) =>
            !semester.amount ||
            Number(
              semester.amount
            ) <= 0
        );

      if (
        invalidSemester
      ) {

        return setStatusModal({
          isOpen: true,
          type: "warning",
          title:
            "Validation",
          message:
            "Please enter all semester fees.",
        });

      }

      if (
        !formData.duration.trim()
      ) {

        return setStatusModal({
          isOpen: true,
          type: "warning",
          title:
            "Validation",
          message:
            "Duration is required.",
        });

      }

      try {

        setSaving(true);

        const payload =
          new FormData();

        payload.append(
          "stream",
          formData.stream
        );

        payload.append(
          "duration",
          formData.duration
        );

        payload.append(
          "admissionFee",
          formData.admissionFee
        );

        payload.append(
          "batch",
          formData.batch
        );

        payload.append(
          "semesterFees",
          JSON.stringify(
            formData.semesterFees
          )
        );

        payload.append(
          "notes",
          JSON.stringify(
            formData.notes
          )
        );

        if (
          pdfFile
        ) {

          payload.append(
            "pdfFile",
            pdfFile
          );

        }

        if (
          editingId
        ) {

          await api.put(
            `/fee-structure/${editingId}`,
            payload,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        } else {

          await api.post(
            "/fee-structure",
            payload,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        }

        await loadData();

        resetForm();

        setStatusModal({
          isOpen: true,
          type: "success",
          title:
            "Success",
          message:
            editingId
              ? "Fee Structure updated successfully."
              : "Fee Structure created successfully.",
        });

      } catch (error) {

        setStatusModal({
          isOpen: true,
          type: "error",
          title:
            "Error",
          message:
            error.response?.data
              ?.message ||
            "Failed to save Fee Structure.",
        });

      } finally {

        setSaving(
          false
        );

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
            ? "Saving Fee Structure"
            : "Loading Fee Structures"
        }
        message={
          saving
            ? "Please wait while changes are being saved..."
            : "Fetching fee structure records..."
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
          deleteModal.item?.stream ||
          "Fee Structure"
        }
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteModal({
            isOpen: false,
            item: null,
          })
        }
      />

      <div className="min-h-screen bg-base-200 p-6">

        <div className="max-w-7xl mx-auto space-y-6">

          {/* ==========================================================
              HERO
          ========================================================== */}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >

            <div className="hero rounded-3xl bg-linear-to-r from-primary via-secondary to-accent text-primary-content shadow-2xl">

              <div className="hero-content py-14 text-center">

                <div>

                  <div className="flex justify-center mb-4">

                    <div className="p-5 rounded-full bg-white/20">

                      <GraduationCap
                        size={60}
                      />

                    </div>

                  </div>

                  <h1 className="text-5xl font-black">

                    Fee Structure CMS

                  </h1>

                  <p className="mt-4 text-lg opacity-90">

                    Manage Fee Structures
                    for BCA, BBA & MCA

                  </p>

                </div>

              </div>

            </div>

          </motion.div>

          {/* ==========================================================
              STREAM DETAILS
          ========================================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <h2 className="card-title text-2xl">

                <FileText />

                Stream Details

              </h2>

              <div className="grid lg:grid-cols-2 gap-5">

                <select
                  className="select select-bordered"
                  value={formData.stream}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stream: e.target.value,
                      semesterFees:
                        editingId
                          ? prev.semesterFees
                          : generateSemesters(
                              e.target.value
                            ),
                    }))
                  }
                >

                  <option>BCA</option>

                  <option>BBA</option>

                  <option>MCA</option>

                </select>

                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="Duration"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration:
                        e.target.value,
                    }))
                  }
                />

                <input
                  type="text"
                  inputMode="numeric"
                  className="input input-bordered"
                  placeholder="Admission Fee"
                  value={
                    formData.admissionFee
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      admissionFee:
                        e.target.value.replace(
                          /\D/g,
                          ""
                        ),
                    }))
                  }
                />

                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="Batch"
                  value={formData.batch}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      batch:
                        e.target.value,
                    }))
                  }
                />

              </div>

            </div>

          </div>

          {/* ==========================================================
              Continue in Part 5
          ========================================================== */}
                    {/* ==========================================================
              TOTAL FEE
          ========================================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="card bg-base-200 border border-base-300">

                <div className="card-body">

                  <div className="flex items-center justify-between">

                    <h3 className="text-xl font-black inline-flex items-center gap-2">

                      <IndianRupee size={20} />

                      Total Program Fee

                    </h3>

                    <div className="text-3xl font-black text-primary">

                      ₹
                      {calculateTotalFee().toLocaleString()}

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ==========================================================
              PDF UPLOAD
          ========================================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <h2 className="card-title text-2xl">

                <Upload />

                Fee Structure PDF

              </h2>

              <input
                key={pdfKey}
                type="file"
                accept=".pdf"
                className="file-input file-input-bordered w-full"
                onChange={(e) =>
                  setPdfFile(
                    e.target.files?.[0] ||
                      null
                  )
                }
              />

              {formData.pdfFile && (

             <a
  href={formData.pdfFile}
  target="_blank"
  rel="noreferrer"
  className="btn btn-outline btn-primary mt-4 w-fit"
>
  View Existing PDF
</a>

              )}

            </div>

          </div>

          {/* ==========================================================
              SEMESTER FEES
          ========================================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <h2 className="text-2xl font-black">

                Semester Fee Structure

              </h2>

              <div className="overflow-x-auto mt-4">

                <table className="table">

                  <thead>

                    <tr>

                      <th>

                        Semester

                      </th>

                      <th>

                        Fee Amount

                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {formData.semesterFees.map(
                      (
                        semester,
                        index
                      ) => (

                        <tr
                          key={index}
                        >

                          <td>

                            <div className="badge badge-primary badge-lg">

                              {
                                semester.semester
                              }

                            </div>

                          </td>

                          <td>

                            <input
                              type="text"
                              inputMode="numeric"
                              className="input input-bordered w-full"
                              placeholder="Enter Fee"
                              value={
                                semester.amount
                              }
                              onChange={(e) =>
                                handleSemesterAmount(
                                  index,
                                  e.target.value
                                )
                              }
                            />

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

          {/* ==========================================================
              Continue in Part 6
          ========================================================== */}
                    {/* ==========================================================
              ADMISSION NOTES
          ========================================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex items-center justify-between">

                <h2 className="text-2xl font-black">

                  Admission Notes

                </h2>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={addNote}
                >

                  Add Note

                </button>

              </div>

              <div className="space-y-4
                  max-h-[75vh]
                  overflow-y-auto
                  pr-2">

                {formData.notes.map(
                  (
                    note,
                    index
                  ) => (

                    <div
                      key={index}
                      className="flex flex-col md:flex-row gap-3"
                    >

                      <textarea
                        rows={2}
                        className="textarea textarea-bordered flex-1"
                        placeholder={`Note ${
                          index + 1
                        }`}
                        value={note}
                        onChange={(e) =>
                          handleNoteChange(
                            index,
                            e.target.value
                          )
                        }
                      />

                      <button
                        type="button"
                        className="btn btn-error md:self-start"
                        disabled={
                          formData.notes.length === 1
                        }
                        onClick={() =>
                          removeNote(
                            index
                          )
                        }
                      >

                        <Trash2
                          size={18}
                        />

                        Remove

                      </button>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

          {/* ==========================================================
              Continue in Part 7
          ========================================================== */}
                    {/* ==========================================================
              EXISTING FEE STRUCTURES
          ========================================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <h2 className="text-2xl font-black">

                Existing Fee Structures

              </h2>

              {feeStructures.length > 0 ? (

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mt-6">

                  {feeStructures.map(
                    (fee) => (

                      <motion.div
                        key={fee._id}
                        whileHover={{
                          y: -5,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                        className="card bg-base-200 border border-base-300 shadow-lg"
                      >

                        <div className="card-body">

                          <h3 className="text-2xl font-black">

                            {fee.stream}

                          </h3>

                          <p className="text-base-content/70">

                            {fee.duration}

                          </p>

                          <div className="divider" />

                          <div className="space-y-2">

                            <div className="flex justify-between">

                              <span>

                                Admission Fee

                              </span>

                              <strong>

                                ₹
                                {Number(
                                  fee.admissionFee
                                ).toLocaleString()}

                              </strong>

                            </div>

                            <div className="flex justify-between">

                              <span>

                                Total Fee

                              </span>

                              <strong className="text-primary">

                               ₹{
(
  Number(fee.admissionFee || 0) +

  (fee.semesterFees || []).reduce(
    (total, semester) =>
      total +
      Number(
        semester.amount || 0
      ),
    0
  )

).toLocaleString()
}
                              </strong>

                            </div>

                            <div className="flex justify-between">

                              <span>

                                Batch

                              </span>

                              <strong>

                                {fee.batch || "-"}

                              </strong>

                            </div>

                          </div>

                          {fee.pdfFile && (

                            <a
                              href={fee.pdfFile}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-outline btn-primary mt-4"
                            >

                              <FileText
                                size={18}
                              />

                              View PDF

                            </a>

                          )}

                          <div className="divider" />

                          <div className="flex gap-3">

                            <button
                              type="button"
                              className="btn btn-warning flex-1"
                              onClick={() =>
                                handleEdit(
                                  fee
                                )
                              }
                            >

                              <Pencil
                                size={18}
                              />

                              Edit

                            </button>

                            <button
                              type="button"
                              className="btn btn-error flex-1"
                              onClick={() =>
                                setDeleteModal({
                                  isOpen: true,
                                  item: fee,
                                })
                              }
                            >

                              <Trash2
                                size={18}
                              />

                              Delete

                            </button>

                          </div>

                        </div>

                      </motion.div>

                    )
                  )}

                </div>

              ) : (

                <div className="text-center py-16">

                  <GraduationCap
                    size={70}
                    className="mx-auto opacity-30"
                  />

                  <h3 className="text-2xl font-bold mt-4">

                    No Fee Structures Found

                  </h3>

                  <p className="text-base-content/60 mt-2">

                    Create your first fee
                    structure to get started.

                  </p>

                </div>

              )}

            </div>

          </div>

          {/* ==========================================================
              Continue in Part 8
          ========================================================== */}
                    {/* ==========================================================
              STICKY ACTION BAR
          ========================================================== */}

          <div className="sticky bottom-4 z-50">

            <div className="card bg-base-100 border border-base-300 shadow-2xl">

              <div className="card-body">

                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">

                  {/* INFO */}

                  <div>

                    <h3 className="font-black text-lg">

                      Fee Structure CMS

                    </h3>

                    <p className="text-base-content/70">

                      Create, update and manage
                      fee structures for all
                      academic programs.

                    </p>

                  </div>

                  {/* STATS */}

                  <div className="flex flex-wrap gap-2">

                    <div className="badge badge-primary badge-lg">

                      Streams:
                      {" "}
                      {stats.total}

                    </div>

                    <div className="badge badge-success badge-lg">

                      Total Fee:
                      {" "}
                      ₹
                      {stats.totalFee.toLocaleString()}

                    </div>

                    {stats.editing && (

                      <div className="badge badge-warning badge-lg">

                        Editing Mode

                      </div>

                    )}

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-3">

                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={resetForm}
                    >

                      Reset

                    </button>

                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={saving}
                      onClick={
                        saveFeeStructure
                      }
                    >

                      <Save
                        size={18}
                      />

                      {editingId
                        ? "Update"
                        : "Save"}

                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </>

  );

}