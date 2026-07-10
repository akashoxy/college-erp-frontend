import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaChalkboardTeacher,
  FaBook,
  FaUserTie,
  FaPlus,
  FaExchangeAlt,
  FaTrash,
  FaSearch,
  FaDatabase,
} from "react-icons/fa";

import toast from "react-hot-toast";

import api from "../../../../services/api";


// ==========================================
// COMPONENT
// ==========================================

export default function FacultySubjectControl() {

  // ==========================================
  // STATES
  // ==========================================

  const [subjects, setSubjects] =
    useState([]);

  const [faculty, setFaculty] =
    useState([]);

  const [assignments,
    setAssignments] =
    useState([]);

  const [loading,
    setLoading] =
    useState(false);

  const [editingAssignment,
    setEditingAssignment] =
    useState(null);

  const [searchTerm,
    setSearchTerm] =
    useState("");

  const [facultyFilter,
    setFacultyFilter] =
    useState("");

  const [subjectFilter,
    setSubjectFilter] =
    useState("");

  const [formData,
    setFormData] =
    useState({
      facultyId: "",
      subjectId: "",
    });

  // ==========================================
  // FETCH SUBJECTS
  // ==========================================

  const fetchSubjects =
    async () => {

      try {

        setLoading(true);

       const { data } = await api.get("/subjects");

const activeSubjects =
  (data?.data?.subjects || []).filter(
    (subject) => subject.isActive
  );

setSubjects(activeSubjects);

      } catch (error) {

        console.error(
          "Fetch Subjects Error:",
          error
        );

        toast.error(
          "Failed to load subjects."
        );

        setSubjects([]);

      } finally {

        setLoading(false);

      }

    };

  // ==========================================
  // FETCH FACULTY
  // ==========================================

  const fetchFaculty =
    async () => {

      try {

        setLoading(true);

        const {
          data,
        } = await api.get(
          "/faculty/all"
        );

        setFaculty(
  data?.data?.faculty || []
);

      } catch (error) {

        console.error(
          "Fetch Faculty Error:",
          error
        );

        toast.error(
          "Failed to load faculty."
        );

        setFaculty([]);

      } finally {

        setLoading(false);

      }

    };

  // ==========================================
  // FETCH ASSIGNMENTS
  // ==========================================

  const fetchAssignments =
    async () => {

      try {

        setLoading(true);

        const { data } = await api.get("/assignments");

setAssignments(
  data?.assignments || []
);

      } catch (error) {

        console.error(
          "Fetch Assignments Error:",
          error
        );

        toast.error(
          "Failed to load assignments."
        );

        setAssignments([]);

      } finally {

        setLoading(false);

      }

    };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    Promise.all([
      fetchSubjects(),
      fetchFaculty(),
      fetchAssignments(),
    ]);

  }, []);

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {

    setEditingAssignment(
      null
    );

    setFormData({
      facultyId: "",
      subjectId: "",
    });

  };

  // ==========================================
  // HANDLE CHANGE
  // ==========================================

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
      // ==========================================
  // ASSIGN / REASSIGN FACULTY
  // ==========================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        if (
          editingAssignment
        ) {

          await api.put(
            `/assignments/${formData.subjectId}`,
            {
              facultyId:
                formData.facultyId,
            }
          );

          toast.success(
            "Faculty reassigned successfully."
          );

        } else {

          await api.post(
            "/assignments",
            formData
          );

          toast.success(
            "Faculty assigned successfully."
          );

        }

        resetForm();

        await Promise.all([
          fetchAssignments(),
          fetchSubjects(),
          fetchFaculty(),
        ]);

      } catch (error) {

        console.error(
          "Assignment Error:",
          error
        );

        toast.error(
          error?.response?.data
            ?.message ||
            "Operation failed."
        );

      } finally {

        setLoading(false);

      }

    };

  // ==========================================
  // EDIT ASSIGNMENT
  // ==========================================

  const handleEdit =
    (assignment) => {

      setEditingAssignment(
        assignment._id
      );

      setFormData({
        facultyId:
          assignment
            ?.facultyId?._id ||
          "",

        subjectId:
          assignment
            ?.subjectId?._id ||
          "",
      });

      window.scrollTo({
        top: 0,
        behavior:
          "smooth",
      });

    };

  // ==========================================
  // DEACTIVATE ASSIGNMENT
  // ==========================================

  const handleDeactivate =
    async (id) => {

      const confirmed =
        window.confirm(
          "Deactivate this assignment?"
        );

      if (!confirmed) return;

      try {

        setLoading(true);

        await api.delete(
          `/assignments/${id}`
        );

        toast.success(
          "Assignment deactivated successfully."
        );

        await Promise.all([
          fetchAssignments(),
          fetchSubjects(),
          fetchFaculty(),
        ]);

      } catch (error) {

        console.error(
          "Deactivate Error:",
          error
        );

        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to deactivate assignment."
        );

      } finally {

        setLoading(false);

      }

    };
      // ==========================================
  // FILTERED ASSIGNMENTS
  // ==========================================

  const filteredAssignments =
    useMemo(() => {

      return assignments.filter(
        (assignment) => {

          const subjectName =
            assignment
              ?.subjectId
              ?.subjectName
              ?.toLowerCase() || "";

          const facultyName =
            assignment
              ?.facultyId
              ?.name
              ?.toLowerCase() || "";

          const subjectCode =
            assignment
              ?.subjectId
              ?.subjectCode
              ?.toLowerCase() || "";

          const keyword =
            searchTerm.toLowerCase();

          const matchesSearch =
            !searchTerm ||
            subjectName.includes(
              keyword
            ) ||
            facultyName.includes(
              keyword
            ) ||
            subjectCode.includes(
              keyword
            );

          const matchesFaculty =
            !facultyFilter ||
            assignment
              ?.facultyId
              ?._id ===
              facultyFilter;

          const matchesSubject =
            !subjectFilter ||
            assignment
              ?.subjectId
              ?._id ===
              subjectFilter;

          return (
            matchesSearch &&
            matchesFaculty &&
            matchesSubject
          );

        }
      );

    }, [
      assignments,
      searchTerm,
      facultyFilter,
      subjectFilter,
    ]);

  // ==========================================
  // DASHBOARD STATS
  // ==========================================

  const totalAssignments =
    useMemo(
      () =>
        assignments.length,
      [assignments]
    );

  const totalSubjects =
    useMemo(
      () =>
        subjects.length,
      [subjects]
    );

  const totalFaculty =
    useMemo(
      () =>
        faculty.length,
      [faculty]
    );

  const assignedSubjects =
    useMemo(
      () =>
        new Set(
          assignments
            .map(
              (assignment) =>
                assignment
                  ?.subjectId
                  ?._id
            )
            .filter(Boolean)
        ).size,
      [assignments]
    );

  // ==========================================
  // JSX
  // ==========================================

  return (

    <div className="min-h-screen bg-base-200 p-6">

      <div className="max-w-7xl mx-auto">

        {/* ===================================== */}
        {/* HERO */}
        {/* ===================================== */}

        <div className="hero rounded-3xl bg-linear-to-r from-primary to-secondary text-primary-content shadow-2xl mb-8">

          <div className="hero-content text-center py-12">

            <div>

              <h1 className="text-4xl md:text-5xl font-black">

                Faculty Subject Assignment

              </h1>

              <p className="mt-4 max-w-3xl opacity-90">

                Assign, reassign and manage
                faculty ownership of academic
                subjects used across attendance,
                ERP operations and reporting.

              </p>

            </div>

          </div>

        </div>

        {/* ===================================== */}
        {/* DASHBOARD STATS */}
        {/* ===================================== */}

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

          {/* ASSIGNMENTS */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-base-content/70">

                    Assignments

                  </p>

                  <h2 className="text-4xl font-black text-primary">

                    {totalAssignments}

                  </h2>

                </div>

                <FaDatabase className="text-5xl text-primary" />

              </div>

            </div>

          </div>

          {/* SUBJECTS */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-base-content/70">

                    Subjects

                  </p>

                  <h2 className="text-4xl font-black text-success">

                    {totalSubjects}

                  </h2>

                </div>

                <FaBook className="text-5xl text-success" />

              </div>

            </div>

          </div>

          {/* FACULTY */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-base-content/70">

                    Faculty

                  </p>

                  <h2 className="text-4xl font-black text-info">

                    {totalFaculty}

                  </h2>

                </div>

                <FaUserTie className="text-5xl text-info" />

              </div>

            </div>

          </div>

          {/* ASSIGNED SUBJECTS */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-base-content/70">

                    Assigned Subjects

                  </p>

                  <h2 className="text-4xl font-black text-warning">

                    {assignedSubjects}

                  </h2>

                </div>

                <FaChalkboardTeacher className="text-5xl text-warning" />

              </div>

            </div>

          </div>

        </div>
                {/* ===================================== */}
        {/* FORM + FILTERS */}
        {/* ===================================== */}

        <div className="grid lg:grid-cols-2 gap-8 mb-8">

          {/* ===================================== */}
          {/* ASSIGNMENT FORM */}
          {/* ===================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <h2 className="card-title text-2xl">

                {editingAssignment
                  ? "Reassign Faculty"
                  : "Assign Faculty"}

              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* FACULTY */}

                <div>

                  <label className="label">

                    <span className="label-text font-semibold">

                      Faculty

                    </span>

                  </label>

                  <select
                    name="facultyId"
                    value={formData.facultyId}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                    required
                  >

                    <option value="">
                      Select Faculty
                    </option>

                    {faculty.map(
                      (teacher) => (

                        <option
                          key={teacher._id}
                          value={teacher._id}
                        >

                          {teacher.name}

                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* SUBJECT */}

                <div>

                  <label className="label">

                    <span className="label-text font-semibold">

                      Subject

                    </span>

                  </label>

                  <select
                    name="subjectId"
                    value={formData.subjectId}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                    required
                  >

                    <option value="">
                      Select Subject
                    </option>

                    {subjects.map(
                      (subject) => (

                        <option
                          key={subject._id}
                          value={subject._id}
                        >

                          {subject.subjectName}
                          {" • "}
                          {subject.stream}
                          {" • "}
                          {subject.semester}

                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* ACTIONS */}

                <div className="flex gap-3 pt-2">

                  {editingAssignment ? (

                    <>

                      <button
                        type="submit"
                        className="btn btn-warning flex-1"
                        disabled={loading}
                      >

                        <FaExchangeAlt />

                        Reassign

                      </button>

                      <button
                        type="button"
                        className="btn btn-outline flex-1"
                        onClick={resetForm}
                      >

                        Cancel

                      </button>

                    </>

                  ) : (

                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={loading}
                    >

                      <FaPlus />

                      Assign Faculty

                    </button>

                  )}

                </div>

              </form>

            </div>

          </div>

          {/* ===================================== */}
          {/* SEARCH & FILTERS */}
          {/* ===================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <h2 className="card-title text-2xl">

                Search & Filters

              </h2>

              <div className="space-y-5">

                {/* SEARCH */}

                <div>

                  <label className="label">

                    <span className="label-text">

                      Search

                    </span>

                  </label>

                  <div className="relative">

                    <FaSearch className="absolute left-4 top-4 text-base-content/50" />

                    <input
                      type="text"
                      className="input input-bordered w-full pl-12"
                      placeholder="Search faculty, subject or code..."
                      value={searchTerm}
                      onChange={(e) =>
                        setSearchTerm(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

                {/* FACULTY FILTER */}

                <div>

                  <label className="label">

                    <span className="label-text">

                      Faculty

                    </span>

                  </label>

                  <select
                    className="select select-bordered w-full"
                    value={facultyFilter}
                    onChange={(e) =>
                      setFacultyFilter(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      All Faculty
                    </option>

                    {faculty.map(
                      (teacher) => (

                        <option
                          key={teacher._id}
                          value={teacher._id}
                        >

                          {teacher.name}

                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* SUBJECT FILTER */}

                <div>

                  <label className="label">

                    <span className="label-text">

                      Subject

                    </span>

                  </label>

                  <select
                    className="select select-bordered w-full"
                    value={subjectFilter}
                    onChange={(e) =>
                      setSubjectFilter(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      All Subjects
                    </option>

                    {subjects.map(
                      (subject) => (

                        <option
                          key={subject._id}
                          value={subject._id}
                        >

                          {subject.subjectName}

                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* BUTTONS */}

                <div className="flex gap-3">

                  <button
                    type="button"
                    className="btn btn-primary flex-1"
                    onClick={fetchAssignments}
                  >

                    <FaSearch />

                    Refresh

                  </button>

                  <button
                    type="button"
                    className="btn btn-outline flex-1"
                    onClick={() => {

                      setSearchTerm("");

                      setFacultyFilter("");

                      setSubjectFilter("");

                    }}
                  >

                    Clear

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>
                {/* ===================================== */}
        {/* ASSIGNMENTS TABLE */}
        {/* ===================================== */}

        {loading ? (

          <div className="flex justify-center py-20">

            <span className="loading loading-spinner loading-lg text-primary"></span>

          </div>

        ) : filteredAssignments.length === 0 ? (

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body text-center py-20">

              <FaChalkboardTeacher className="mx-auto text-7xl text-base-content/20 mb-4" />

              <h2 className="text-3xl font-bold">

                No Assignments Found

              </h2>

              <p className="text-base-content/60 mt-2">

                No faculty subject assignments
                match the selected filters.

              </p>

            </div>

          </div>

        ) : (

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center mb-4">

                <h2 className="card-title text-2xl">

                  Active Assignments

                </h2>

                <div className="badge badge-primary badge-lg">

                  {filteredAssignments.length}

                </div>

              </div>

              <div className="overflow-x-auto">

                <table className="table table-zebra">

                  <thead>

                    <tr>

                      <th>Faculty</th>

                      <th>Subject</th>

                      <th>Code</th>

                      <th>Stream</th>

                      <th>Semester</th>

                      <th>Session</th>

                      <th>Actions</th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredAssignments.map(
                      (assignment) => (

                        <tr
                          key={assignment._id}
                        >

                          {/* FACULTY */}

                          <td>

                            <div>

                              <p className="font-semibold">

                                {assignment?.facultyId?.name}

                              </p>

                              <p className="text-xs opacity-60">

                                {assignment?.facultyId?.email}

                              </p>

                            </div>

                          </td>

                          {/* SUBJECT */}

                          <td>

                            {assignment?.subjectId?.subjectName}

                          </td>

                          {/* CODE */}

                          <td>

                            {assignment?.subjectId?.subjectCode}

                          </td>

                          {/* STREAM */}

                          <td>

                            {assignment?.subjectId?.stream}

                          </td>

                          {/* SEMESTER */}

                          <td>

                            {assignment?.subjectId?.semester}

                          </td>

                          {/* SESSION */}

                          <td>

                            {assignment?.subjectId?.session}

                          </td>

                          {/* ACTIONS */}

                          <td>

                            <div className="flex gap-2">

                              <button
                                className="btn btn-warning btn-sm"
                                onClick={() =>
                                  handleEdit(
                                    assignment
                                  )
                                }
                              >

                                <FaExchangeAlt />

                              </button>

                              <button
                                className="btn btn-error btn-sm"
                                onClick={() =>
                                  handleDeactivate(
                                    assignment._id
                                  )
                                }
                              >

                                <FaTrash />

                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        )}

        {/* ===================================== */}
        {/* FOOTER */}
        {/* ===================================== */}

        <div className="sticky bottom-0 mt-10">

          <div className="card bg-base-100 border border-base-300 shadow-2xl">

            <div className="card-body">

              <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                <div>

                  <h3 className="font-bold text-lg">

                    Faculty Assignment Dashboard

                  </h3>

                  <p className="text-base-content/70">

                    Total Active Assignments

                    <span className="ml-2 font-semibold text-primary">

                      {totalAssignments}

                    </span>

                  </p>

                </div>

                <div className="flex flex-wrap gap-3">

                  <button
                    className="btn btn-primary"
                    onClick={fetchAssignments}
                    disabled={loading}
                  >

                    <FaDatabase />

                    {loading
                      ? "Refreshing..."
                      : "Refresh Data"}

                  </button>

                  <button
                    className="btn btn-outline"
                    onClick={() =>
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      })
                    }
                  >

                    Back To Top

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}