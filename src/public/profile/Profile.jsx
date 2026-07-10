import { useMemo } from "react";

import { useAuth } from "../../context/AuthContext";

import StudentProfile from "./StudentProfile";
import FacultyProfile from "./FacultyProfile";
import AdminProfile from "./AdminProfile";

export default function Profile() {
  const { user, loading } = useAuth();

  // Wait until AuthContext finishes loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const role = useMemo(
    () => user?.role?.toLowerCase?.() || "",
    [user]
  );

  switch (role) {
    case "faculty":
      return <FacultyProfile />;

    case "admin":
      return <AdminProfile />;

    case "student":
    default:
      return <StudentProfile />;
  }
}