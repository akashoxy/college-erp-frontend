import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaIdCard,
  FaUniversity,
  FaUserGraduate,
  FaLayerGroup,
  FaPhone,
  FaMapMarkerAlt,
  FaBookOpen,
  FaFileAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaSignOutAlt,
  FaClipboardCheck,
  FaArrowRight,
  FaExclamationTriangle,
} from "react-icons/fa";

import api from "../../services/api";

import { useAuth } from "../../context/AuthContext";

// Accent color for this role — echoed as a hairline strip on every card
const ACCENT = "#B45309";

export default function StudentProfile() {
  const { user, logout, updateUser } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    roll: "",
    reg: "",
    stream: "",
    semester: "",
    phone: "",
    address: "",
    avatar: "",
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await api.get("/student/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success && res.data?.data?.student) {
        const studentData = res.data.data.student;

        setStudent(studentData);

        setFormData({
          roll: studentData.roll || "",
          reg: studentData.reg || "",
          stream: studentData.stream || "",
          semester: studentData.semester || "",
          phone: studentData.phone || "",
          address: studentData.address || "",
          avatar: studentData.avatar || "",
        });
      }
    } catch (error) {
      console.log("PROFILE ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ============================
      IMAGE UPLOAD
      Converts the selected file to a base64 data URL and
      stores it on formData.avatar so the preview + save both work.
  ============================ */

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        avatar: reader.result,
      }));
    };

    reader.onerror = () => {
      console.log("Failed to read image file");
      alert("Failed to load image, please try again");
    };

    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const res = await api.put("/student/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success && res.data?.data?.student) {
        const updatedStudent = res.data.data.student;
        setStudent({
          ...updatedStudent,
          role: "student",
        });

        updateUser({
          ...updatedStudent,
          role: "student",
        });

        setFormData({
          roll: updatedStudent.roll || "",
          reg: updatedStudent.reg || "",
          stream: updatedStudent.stream || "",
          semester: updatedStudent.semester || "",
          phone: updatedStudent.phone || "",
          address: updatedStudent.address || "",
          avatar: updatedStudent.avatar || "",
        });

        setEditMode(false);

        alert("Profile Updated Successfully");
      }
    } catch (error) {
      console.log("UPDATE ERROR:", error);

      alert(error.response?.data?.message || "Update Failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const phoneMissing = !student?.phone;

  return (
    <main className="min-h-screen bg-base-200">
      {/* TOP BAR — logout lives here, not in a card */}
      <header className="sticky top-0 z-10 border-b border-base-300 bg-base-100/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-base-content/50">
              Student Portal
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-error"
          >
            <FaSignOutAlt />
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-6">
        {/* PHONE NUMBER WARNING — fee payment requires a phone number on file */}
        {phoneMissing && (
          <div
            role="alert"
            className="alert alert-warning shadow-sm items-start sm:items-center"
          >
            <FaExclamationTriangle className="text-lg shrink-0" />
            <span>
              <strong>No phone number on file.</strong> Fees payment won't work
              until you add one — Razorpay needs it to process your payment.
            </span>
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="btn btn-sm btn-warning btn-outline ml-auto"
            >
              <FaEdit />
              Add phone number
            </button>
          </div>
        )}

        {/* PROFILE / ID CARD */}
        <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
          <div className="h-1.5 w-full" style={{ backgroundColor: ACCENT }} />

          <div className="p-6 md:p-8">
            <div className="mb-6 flex justify-end">
              <span
                className="rounded-full px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-widest text-white"
                style={{ backgroundColor: ACCENT }}
              >
                Student
              </span>
            </div>

            <div className="flex flex-col gap-8 xl:flex-row xl:items-center">
              <div className="avatar mx-auto xl:mx-0">
                <div
                  className="w-28 rounded-xl ring-2 ring-offset-2 ring-offset-base-100"
                  style={{ "--tw-ring-color": ACCENT }}
                >
                  <img
                    src={
                      student?.avatar ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    alt="student"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="text-center xl:text-left">
                    <h1 className="text-2xl font-bold tracking-tight text-base-content md:text-3xl">
                      {student?.name}
                    </h1>

                    <p className="mt-1.5 break-all text-sm text-base-content/60">
                      {student?.email}
                    </p>

                    <p
                      className="mt-2 text-sm font-semibold"
                      style={{ color: ACCENT }}
                    >
                      Student dashboard
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditMode(!editMode)}
                    className={`btn btn-sm gap-2 self-center lg:self-start ${
                      editMode ? "btn-error" : "btn-outline"
                    }`}
                  >
                    {editMode ? (
                      <>
                        <FaTimes />
                        Cancel
                      </>
                    ) : (
                      <>
                        <FaEdit />
                        Edit profile
                      </>
                    )}
                  </button>
                </div>

                {/* Inline quick facts */}
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-base-300 pt-5 sm:grid-cols-2 xl:grid-cols-3">
                  <InfoItem
                    icon={<FaIdCard />}
                    title="Roll number"
                    value={student?.roll || "Not added"}
                  />
                  <InfoItem
                    icon={<FaUniversity />}
                    title="Registration"
                    value={student?.reg || "Not added"}
                  />
                  <InfoItem
                    icon={<FaUserGraduate />}
                    title="Stream"
                    value={student?.stream || "Not added"}
                  />
                  <InfoItem
                    icon={<FaLayerGroup />}
                    title="Semester"
                    value={student?.semester || "Not added"}
                  />
                  <InfoItem
                    icon={<FaPhone />}
                    title="Phone"
                    value={student?.phone || "Not added"}
                    warning={phoneMissing}
                  />
                  <InfoItem
                    icon={<FaMapMarkerAlt />}
                    title="Address"
                    value={student?.address || "Not added"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EDIT PROFILE */}
        {editMode && (
          <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-bold tracking-tight text-base-content">
                Update student profile
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <InputField
                  label="Roll number"
                  name="roll"
                  value={formData.roll}
                  onChange={handleChange}
                />

                <InputField
                  label="Registration number"
                  name="reg"
                  value={formData.reg}
                  onChange={handleChange}
                />

                <InputField
                  label="Stream"
                  name="stream"
                  value={formData.stream}
                  onChange={handleChange}
                />

                <InputField
                  label="Semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                />

                <InputField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  hint={
                    phoneMissing
                      ? "Required for fees payment to work"
                      : undefined
                  }
                />

                <InputField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/50">
                      Upload profile photo
                    </span>
                  </label>

                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input file-input-bordered w-full"
                  />
                </div>
              </div>

              {formData.avatar && (
                <div className="mt-6">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-base-content/50">
                    Image preview
                  </h3>

                  <img
                    src={formData.avatar}
                    alt="preview"
                    className="h-32 w-32 rounded-xl border border-base-300 object-cover"
                  />
                </div>
              )}

              <div className="mt-8 flex justify-end border-t border-base-300 pt-6">
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={saving}
                  className="btn gap-2 text-white"
                  style={{ backgroundColor: ACCENT, borderColor: ACCENT }}
                >
                  <FaSave />
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QUICK ACTIONS */}
        <section>
          <h2 className="mb-5 text-xl font-bold tracking-tight text-base-content">
            Quick actions
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            <Link to="/student/notes">
              <ActionCard
                icon={<FaBookOpen className="text-2xl" />}
                title="Study notes"
                description="Browse faculty uploaded notes and resources."
              />
            </Link>

            <Link to="/student/attendance">
              <ActionCard
                icon={<FaClipboardCheck className="text-2xl" />}
                title="My attendance"
                description="View subject-wise attendance and overall percentage."
              />
            </Link>

            <Link to="/previous-question">
              <ActionCard
                icon={<FaFileAlt className="text-2xl" />}
                title="Question papers"
                description="Access previous year university examination papers."
              />
            </Link>

            <Link to="/student/fees-payment">
              <ActionCard
                icon={<FaFileAlt className="text-2xl" />}
                title="Fees Payment"
                description="Pay your Upcoming Fees , Exam Fees etc."
                warning={
                  phoneMissing
                    ? "Add a phone number first — payment needs it"
                    : undefined
                }
              />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoItem({ icon, title, value, warning = false }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`text-lg ${warning ? "text-warning" : "text-base-content/40"}`}>
        {icon}
      </span>
      <div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-base-content/40">
          {title}
        </div>
        <div
          className={`wrap-break-word text-sm font-semibold ${
            warning ? "text-warning" : "text-base-content"
          }`}
        >
          {value}
          {warning && (
            <span className="ml-1 font-mono text-[10px] font-normal uppercase tracking-wide">
              (required for payment)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, hint }) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/50">
          {label}
        </span>
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className={`input input-bordered w-full ${
          hint ? "input-warning" : ""
        }`}
      />

      {hint && (
        <label className="label">
          <span className="label-text-alt flex items-center gap-1 text-warning">
            <FaExclamationTriangle className="text-[10px]" />
            {hint}
          </span>
        </label>
      )}
    </div>
  );
}

function ActionCard({ icon, title, description, warning }) {
  return (
    <div className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`h-1 w-full ${warning ? "bg-warning" : ""}`}
        style={warning ? undefined : { backgroundColor: ACCENT }}
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between">
          <div className="text-base-content/70">{icon}</div>
          {warning && (
            <span className="tooltip tooltip-left" data-tip={warning}>
              <FaExclamationTriangle className="text-warning" />
            </span>
          )}
        </div>

        <h3 className="mt-4 text-lg font-bold tracking-tight text-base-content">
          {title}
        </h3>

        <p className="mt-1.5 flex-1 text-sm text-base-content/60">
          {description}
        </p>

        <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-base-content/70 transition-colors group-hover:text-base-content">
          Open
          <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
}