import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPhone,
  FaBuilding,
  FaGraduationCap,
  FaSave,
  FaEdit,
  FaTimes,
  FaSignOutAlt,
  FaBookOpen,
  FaFlask,
  FaClipboardCheck,
  FaArrowRight,
} from "react-icons/fa";

import api from "../../services/api";

import { useAuth } from "../../context/AuthContext";

// Accent color for this role — echoed as a hairline strip on every card
const ACCENT = "#0F766E";

export default function FacultyProfile() {
  const { user, logout, updateUser } = useAuth();

  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    department: "",
    designation: "",
    photo: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.get("/faculty/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = res.data?.data || res.data;
      const facultyData = responseData.faculty || responseData;

      setFaculty(facultyData);

      setFormData({
        phone: facultyData.phone || "",
        department: facultyData.department || "",
        designation: facultyData.designation || "",
        photo: facultyData.photo || "",
      });
    } catch (error) {
      console.log(error);
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
      stores it on formData.photo so the preview + save both work.
  ============================ */

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const form = new FormData();

      form.append("phone", formData.phone);
      form.append("department", formData.department);
      form.append("designation", formData.designation);

      if (selectedFile) {
        form.append("photo", selectedFile);
      }

      const res = await api.put("/faculty/update-profile", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const responseData = res.data?.data || res.data;
      const updatedFaculty = responseData.faculty || responseData;

      setFaculty({
        ...updatedFaculty,
        role: "faculty",
      });

      updateUser({
        ...updatedFaculty,
        role: "faculty",
      });

      setFormData({
        phone: updatedFaculty.phone || "",
        department: updatedFaculty.department || "",
        designation: updatedFaculty.designation || "",
        photo: updatedFaculty.photo || "",
      });

      setSelectedFile(null);
      setEditMode(false);

      alert("Profile Updated Successfully");
    } catch (error) {
      console.error(error);

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
              Faculty Portal
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-error"
          >
            <FaSignOutAlt />
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-6">
        {/* PROFILE / ID CARD */}
        <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
          <div className="h-1.5 w-full" style={{ backgroundColor: ACCENT }} />

          <div className="p-6 md:p-8">
            <div className="mb-6 flex justify-end">
              <span
                className="rounded-full px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-widest text-white"
                style={{ backgroundColor: ACCENT }}
              >
                Faculty
              </span>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
              <div className="avatar mx-auto lg:mx-0">
                <div
                  className="w-28 rounded-xl ring-2 ring-offset-2 ring-offset-base-100"
                  style={{ "--tw-ring-color": ACCENT }}
                >
                  <img
                    src={
                      faculty?.photo ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    alt="faculty"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="text-center lg:text-left">
                    <h1 className="text-2xl font-bold tracking-tight text-base-content md:text-3xl">
                      {faculty?.name}
                    </h1>

                    <p className="mt-1.5 break-all text-sm text-base-content/60">
                      {faculty?.email}
                    </p>

                    <p
                      className="mt-2 text-sm font-semibold"
                      style={{ color: ACCENT }}
                    >
                      {faculty?.designation || "Faculty Member"}
                    </p>
                  </div>

                  <button
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
                <div className="mt-6 grid grid-cols-1 divide-y divide-base-300 border-t border-base-300 pt-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  <InfoItem
                    icon={<FaPhone />}
                    title="Phone"
                    value={faculty?.phone || "Not added"}
                  />
                  <InfoItem
                    icon={<FaBuilding />}
                    title="Department"
                    value={faculty?.department || "Not added"}
                    className="sm:pl-6"
                  />
                  <InfoItem
                    icon={<FaGraduationCap />}
                    title="Designation"
                    value={faculty?.designation || "Not added"}
                    className="sm:pl-6"
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
                Update faculty profile
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <InputField label="Name" value={faculty?.name || ""} disabled />
                <InputField
                  label="Email"
                  value={faculty?.email || ""}
                  disabled
                />

                <InputField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />

                <InputField
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />

                <InputField
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                />

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/50">
                      Upload photo
                    </span>
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input file-input-bordered w-full"
                  />
                </div>
              </div>

              {formData.photo && (
                <div className="mt-6">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-base-content/50">
                    Image preview
                  </h3>

                  <img
                    src={formData.photo}
                    alt="preview"
                    className="h-32 w-32 rounded-xl border border-base-300 object-cover"
                  />
                </div>
              )}

              <div className="mt-8 flex justify-end border-t border-base-300 pt-6">
                <button
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
            <Link to="/faculty/notes">
              <ActionCard
                title="Upload notes"
                description="Manage study materials and notes."
                icon={<FaBookOpen className="text-2xl" />}
              />
            </Link>

            <Link to="/faculty/attendance">
              <ActionCard
                title="Attendance"
                description="Mark and manage student attendance."
                icon={<FaClipboardCheck className="text-2xl" />}
              />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoItem({ icon, title, value, className = "" }) {
  return (
    <div className={`flex items-center gap-3 py-3 sm:py-0 ${className}`}>
      <span className="text-lg text-base-content/40">{icon}</span>
      <div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-base-content/40">
          {title}
        </div>
        <div className="wrap-break-word text-sm font-semibold text-base-content">
          {value}
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, disabled = false }) {
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
        disabled={disabled}
        className="input input-bordered w-full disabled:bg-base-200 disabled:text-base-content/50"
      />
    </div>
  );
}

function ActionCard({ icon, title, description }) {
  return (
    <div className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="h-1 w-full" style={{ backgroundColor: ACCENT }} />

      <div className="flex flex-1 flex-col p-5">
        <div className="text-base-content/70">{icon}</div>

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