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
  RotateCcw,
  BookOpen,
} from "lucide-react";

import api from "../../../../services/api";

import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";

/* ==========================================================
   TOKENS — same ledger palette as the public page
   ink #142238  paper #F3F0E6  sheet #FDFCF7
   brass #B8912F  teal #2F6259  brick #9C4B3A
========================================================== */

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap";

const useLedgerFonts = () => {
  useEffect(() => {
    if (document.getElementById("ledger-fonts")) return;
    const link = document.createElement("link");
    link.id = "ledger-fonts";
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);
};

const display = { fontFamily: "'Fraunces', serif" };
const mono = { fontFamily: "'IBM Plex Mono', monospace" };

/* ==========================================================
   SHARED PIECES
========================================================== */

const Stamp = ({ children = "Included in Admission Fee" }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
    animate={{ opacity: 1, scale: 1, rotate: -7 }}
    transition={{ type: "spring", stiffness: 280, damping: 15 }}
    className="inline-flex items-center border border-[#9C4B3A] text-[#9C4B3A] rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider whitespace-nowrap ml-2"
    style={mono}
  >
    {children}
  </motion.span>
);

const SectionCard = ({ eyebrow, title, icon: Icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.45 }}
    className="bg-[#FDFCF7] border border-[#DCD5C1] rounded-xl p-7 relative"
  >
    <div className="absolute top-0 left-7 -translate-y-1/2 bg-[#FDFCF7] px-2">
      <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8912F]" style={mono}>
        {eyebrow}
      </span>
    </div>
    <h2 className="text-xl font-semibold text-[#142238] flex items-center gap-2 mb-5" style={display}>
      {Icon && <Icon size={19} className="text-[#B8912F]" />}
      {title}
    </h2>
    {children}
  </motion.div>
);

const fieldClass =
  "w-full bg-[#F3F0E6] border border-[#DCD5C1] rounded-lg px-3.5 py-2.5 text-[#142238] placeholder:text-[#142238]/35 focus:outline-none focus:border-[#B8912F] focus:ring-1 focus:ring-[#B8912F] transition-colors";

/* ==========================================================
   SEMESTER HELPER
========================================================== */

const generateSemesters = (stream) => {
  const total = stream === "MCA" ? 4 : 8;
  return Array.from({ length: total }, (_, index) => ({
    semester: `Semester ${index + 1}`,
    amount: "",
  }));
};

const initialForm = {
  stream: "BCA",
  duration: "",
  admissionFee: "",
  batch: "",
  semesterFees: generateSemesters("BCA"),
  notes: [""],
  pdfFile: "",
};

export default function FeeStructureControl() {
  useLedgerFonts();

  /* ==========================================================
      STATES
  ========================================================== */

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfKey, setPdfKey] = useState(Date.now());
  const [feeStructures, setFeeStructures] = useState([]);
  const [formData, setFormData] = useState(initialForm);

  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    item: null,
  });

  /* ==========================================================
      DASHBOARD STATS — Semester 1 fee lives inside Admission Fee
  ========================================================== */

  const stats = useMemo(() => {
  const totalFee =
    Number(formData.admissionFee || 0) +
    formData.semesterFees.reduce((sum, semester, index) => {
      if (index === 0) return sum;
      return sum + Number(semester.amount || 0);
    }, 0);

  return {
    total: feeStructures.length,
    editing: !!editingId,
    totalFee,
  };
}, [feeStructures, editingId, formData]);

  /* ==========================================================
      LOAD DATA
  ========================================================== */

  const loadData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/fee-structure");
      setFeeStructures(data.data.feeStructures || []);
    } catch (error) {
      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Load Failed",
        message: error.response?.data?.message || "Failed to load fee structures.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ==========================================================
      TOTAL FEE — Semester 1 already inside Admission Fee
  ========================================================== */

 const calculateTotalFee = () => {
  const admission = Number(formData.admissionFee || 0);

  return (
    admission +
    formData.semesterFees.reduce((sum, semester, index) => {
      if (index === 0) return sum;
      return sum + Number(semester.amount || 0);
    }, 0)
  );
};

  /* ==========================================================
      SEMESTER FEE
  ========================================================== */

  const handleSemesterAmount = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.semesterFees];
      updated[index] = { ...updated[index], amount: value.replace(/\D/g, "") };
      return { ...prev, semesterFees: updated };
    });
  };

  /* ==========================================================
      NOTES
  ========================================================== */

  const handleNoteChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.notes];
      updated[index] = value;
      return { ...prev, notes: updated };
    });
  };

  const addNote = () => {
    setFormData((prev) => ({ ...prev, notes: [...prev.notes, ""] }));
  };

  const removeNote = (index) => {
    setFormData((prev) => ({
      ...prev,
      notes: prev.notes.filter((_, i) => i !== index),
    }));
  };

  /* ==========================================================
      RESET FORM
  ========================================================== */

  const resetForm = () => {
    setEditingId(null);
    setPdfFile(null);
    setPdfKey(Date.now());
    setFormData({ ...initialForm, semesterFees: generateSemesters("BCA") });
  };

  /* ==========================================================
      EDIT
  ========================================================== */

  const handleEdit = (fee) => {
    setEditingId(fee._id);
    setPdfFile(null);
    setPdfKey(Date.now());

    setFormData({
      stream: fee.stream,
      duration: fee.duration,
      admissionFee: fee.admissionFee,
      batch: fee.batch,
      semesterFees: fee.semesterFees?.length
        ? fee.semesterFees
        : generateSemesters(fee.stream),
      notes: fee.notes?.length ? fee.notes : [""],
      pdfFile: fee.pdfFile,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ==========================================================
      DELETE
  ========================================================== */

  const handleDelete = async () => {
    if (!deleteModal.item) return;

    try {
      setSaving(true);
      await api.delete(`/fee-structure/${deleteModal.item._id}`);
      await loadData();
      setDeleteModal({ isOpen: false, item: null });

      if (editingId === deleteModal.item._id) resetForm();

      setStatusModal({
        isOpen: true,
        type: "success",
        title: "Deleted",
        message: "Fee Structure deleted successfully.",
      });
    } catch (error) {
      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Delete Failed",
        message: error.response?.data?.message || "Failed to delete Fee Structure.",
      });
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================================
      CREATE / UPDATE
  ========================================================== */

  const saveFeeStructure = async () => {
    const invalidSemester = formData.semesterFees.find(
      (semester) => !semester.amount || Number(semester.amount) <= 0
    );

    if (invalidSemester) {
      return setStatusModal({
        isOpen: true,
        type: "warning",
        title: "Validation",
        message: "Please enter all semester fees.",
      });
    }

    if (!formData.duration.trim()) {
      return setStatusModal({
        isOpen: true,
        type: "warning",
        title: "Validation",
        message: "Duration is required.",
      });
    }

    try {
      setSaving(true);

      const payload = new FormData();
      payload.append("stream", formData.stream);
      payload.append("duration", formData.duration);
      payload.append("admissionFee", formData.admissionFee);
      payload.append("batch", formData.batch);
      payload.append("semesterFees", JSON.stringify(formData.semesterFees));
      payload.append("notes", JSON.stringify(formData.notes));

      if (pdfFile) payload.append("pdfFile", pdfFile);

      if (editingId) {
        await api.put(`/fee-structure/${editingId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/fee-structure", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await loadData();
      resetForm();

      setStatusModal({
        isOpen: true,
        type: "success",
        title: "Success",
        message: editingId
          ? "Fee Structure updated successfully."
          : "Fee Structure created successfully.",
      });
    } catch (error) {
      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: error.response?.data?.message || "Failed to save Fee Structure.",
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
      <LoadingModal
        isOpen={loading || saving}
        title={saving ? "Saving Fee Structure" : "Loading Fee Structures"}
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
        onClose={() => setStatusModal((prev) => ({ ...prev, isOpen: false }))}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        itemName={deleteModal.item?.stream || "Fee Structure"}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ isOpen: false, item: null })}
      />

      <div
        className="min-h-screen bg-[#F3F0E6] pb-32"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(20,34,56,0.05) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      >
        {/* ================= HERO ================= */}

        <div className="bg-primary text-[#F3F0E6]">
          <div className="max-w-5xl mx-auto px-6 py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#B8912F]/50 text-[#D9BE6E] text-xs uppercase tracking-[0.2em] mb-5"
                style={mono}
              >
                <GraduationCap size={13} />
                Ledger — Admin
              </div>

              <h1 className="text-4xl md:text-5xl font-semibold" style={display}>
                Fee Structure Control
              </h1>

              <div className="w-14 h-[2px] bg-[#B8912F] mx-auto my-5" />

              <p className="text-[#F3F0E6]/70 max-w-lg mx-auto text-sm md:text-base">
                Record and update fee entries for BCA, BBA and MCA in one place.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 mt-10 space-y-8">
          {/* ================= 01 STREAM DETAILS ================= */}

          <SectionCard eyebrow="01 — Program" title="Stream Details" icon={FileText}>
            <div className="grid md:grid-cols-2 gap-4">
              <select
                className={fieldClass}
                value={formData.stream}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    stream: e.target.value,
                    semesterFees: editingId
                      ? prev.semesterFees
                      : generateSemesters(e.target.value),
                  }))
                }
              >
                <option>BCA</option>
                <option>BBA</option>
                <option>MCA</option>
              </select>

              <input
                type="text"
                className={fieldClass}
                placeholder="Duration (e.g. 3 Years)"
                value={formData.duration}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, duration: e.target.value }))
                }
              />

              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  className={fieldClass}
                  placeholder="Admission Fee"
                  value={formData.admissionFee}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      admissionFee: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                />
                <p className="text-[11px] text-[#142238]/45 mt-1.5 ml-1">
                  Includes Semester 1 fee
                </p>
              </div>

              <input
                type="text"
                className={fieldClass}
                placeholder="Batch (e.g. 2026 – 2029)"
                value={formData.batch}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, batch: e.target.value }))
                }
              />
            </div>
          </SectionCard>

          {/* ================= TOTAL FEE ================= */}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary rounded-xl p-6 flex items-center justify-between"
          >
            <h3 className="text-[#F3F0E6] font-semibold flex items-center gap-2" style={display}>
              <IndianRupee size={18} className="text-[#D9BE6E]" />
              Total Program Fee
            </h3>
            <div className="text-3xl font-semibold text-[#D9BE6E] tabular-nums" style={mono}>
              ₹{calculateTotalFee().toLocaleString()}
            </div>
          </motion.div>

          {/* ================= 02 SEMESTER FEES ================= */}

          <SectionCard eyebrow="02 — Ledger Entries" title="Semester Fee Structure" icon={BookOpen}>
            <div className="divide-y divide-[#EAE4D3]">
              {formData.semesterFees.map((semester, index) => (
                <div key={index} className="flex items-center gap-4 py-3">
                  
                  <input
                    type="text"
                    inputMode="numeric"
                    className={`${fieldClass} max-w-[220px]`}
                    placeholder="Enter fee"
                    value={semester.amount}
                    onChange={(e) => handleSemesterAmount(index, e.target.value)}
                  />
                  <div className="w-36 shrink-0 flex items-center flex-wrap gap-y-1">
                    <span className="text-sm font-medium text-[#142238]">
                      {semester.semester}
                    </span>
                    {index === 0 && <Stamp />}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* ================= 03 NOTES ================= */}

          <SectionCard eyebrow="03 — Notes" title="Admission Instructions" icon={FileText}>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {formData.notes.map((note, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col md:flex-row gap-3"
                >
                  <textarea
                    rows={2}
                    className={`${fieldClass} flex-1 resize-none`}
                    placeholder={`Note ${index + 1}`}
                    value={note}
                    onChange={(e) => handleNoteChange(index, e.target.value)}
                  />
                  <button
                    type="button"
                    disabled={formData.notes.length === 1}
                    onClick={() => removeNote(index)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#9C4B3A]/40 text-[#9C4B3A] hover:bg-[#9C4B3A]/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors md:self-start"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </motion.div>
              ))}
            </div>

            <button
              type="button"
              onClick={addNote}
              className="mt-4 inline-flex items-center gap-2 text-sm text-[#2F6259] hover:text-[#1F4A41] font-medium"
            >
              + Add note
            </button>
          </SectionCard>

          {/* ================= 04 PDF ================= */}

          <SectionCard eyebrow="04 — Document" title="Fee Structure PDF" icon={Upload}>
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#DCD5C1] rounded-lg py-8 cursor-pointer hover:border-[#B8912F] transition-colors">
              <Upload size={22} className="text-[#B8912F]" />
              <span className="text-sm text-[#142238]/60">
                {pdfFile ? pdfFile.name : "Click to upload PDF"}
              </span>
              <input
                key={pdfKey}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              />
            </label>

            {formData.pdfFile && (
              <a
                href={formData.pdfFile}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-sm text-[#2F6259] hover:text-[#1F4A41] font-medium"
              >
                <FileText size={15} />
                View existing PDF
              </a>
            )}
          </SectionCard>

          {/* ================= EXISTING ENTRIES ================= */}

          <div>
            <h2 className="text-xl font-semibold text-[#142238] mb-5" style={display}>
              Existing Fee Structures
            </h2>

            {feeStructures.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {feeStructures.map((fee, i) => {
                  const total =
                    Number(fee.admissionFee || 0) +
                    (fee.semesterFees || [])
                      .slice(1)
                      .reduce((t, s) => t + Number(s.amount || 0), 0);

                  return (
                    <motion.div
                      key={fee._id}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -4 }}
                      className="bg-[#FDFCF7] border border-[#DCD5C1] rounded-xl p-6"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-xl font-semibold text-[#142238]" style={display}>
                          {fee.stream}
                        </h3>
                        <div
                          className="w-9 h-9 rounded-full border-2 border-[#142238] flex items-center justify-center text-xs font-semibold text-[#142238]"
                          style={display}
                        >
                          {fee.stream.slice(0, 1)}
                        </div>
                      </div>
                      <p className="text-sm text-[#142238]/55">{fee.duration}</p>

                      <div className="border-t border-[#EAE4D3] my-4" />

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#142238]/60">Admission Fee</span>
                          <strong className="text-[#142238] tabular-nums" style={mono}>
                            ₹{Number(fee.admissionFee || 0).toLocaleString()}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#142238]/60">Total Fee</span>
                          <strong className="text-[#B8912F] tabular-nums" style={mono}>
                            ₹{total.toLocaleString()}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#142238]/60">Batch</span>
                          <strong className="text-[#142238]">{fee.batch || "—"}</strong>
                        </div>
                      </div>

                      {fee.pdfFile && (
                        <a
                          href={fee.pdfFile}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 mt-4 text-sm text-[#2F6259] hover:text-[#1F4A41] font-medium"
                        >
                          <FileText size={15} />
                          View PDF
                        </a>
                      )}

                      <div className="border-t border-[#EAE4D3] my-4" />

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(fee)}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#142238] text-[#F3F0E6] hover:bg-[#1C2E4C] transition-colors text-sm font-medium"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteModal({ isOpen: true, item: fee })}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#9C4B3A]/40 text-[#9C4B3A] hover:bg-[#9C4B3A]/5 transition-colors text-sm font-medium"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-[#FDFCF7] border border-[#DCD5C1] rounded-xl p-16 text-center">
                <GraduationCap size={60} className="mx-auto text-[#142238]/20" />
                <h3 className="text-xl font-semibold text-[#142238] mt-4" style={display}>
                  No fee structures found
                </h3>
                <p className="text-[#142238]/50 mt-1 text-sm">
                  Create your first fee structure to get started.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ================= STICKY ACTION BAR ================= */}

        <div className="fixed bottom-5 left-0 right-0 z-50 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-5xl mx-auto bg-primary rounded-xl shadow-2xl px-6 py-4 flex flex-col lg:flex-row items-center justify-between gap-4"
          >
            <div className="text-center lg:text-left">
              <h3 className="font-semibold text-[#F3F0E6]" style={display}>
                Fee Structure Ledger
              </h3>
              <p className="text-xs text-[#F3F0E6]/50">
                {stats.total} programs recorded
                {stats.editing && (
                  <span className="text-[#D9BE6E]"> · editing entry</span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-sm text-[#F3F0E6]/60" style={mono}>
                ₹{stats.totalFee.toLocaleString()}
              </span>

              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#F3F0E6]/25 text-[#F3F0E6]/80 hover:bg-white/5 transition-colors text-sm"
              >
                <RotateCcw size={15} />
                Reset
              </button>

              <motion.button
                whileTap={{ scale: 0.94 }}
                type="button"
                disabled={saving}
                onClick={saveFeeStructure}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#B8912F] hover:bg-[#C9A227] text-[#142238] font-semibold text-sm disabled:opacity-50 transition-colors"
              >
                <Save size={16} />
                {editingId ? "Update Entry" : "Save Entry"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}