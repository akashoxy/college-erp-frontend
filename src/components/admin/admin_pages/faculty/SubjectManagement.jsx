import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaLayerGroup,
  FaSearch,
  FaBook,
  FaPlus,
  FaEdit,
  FaTrash,
  FaDatabase,
} from "react-icons/fa";

import toast from "react-hot-toast";

import api from "../../../../services/api";


// ==========================================
// COMPONENT
// ==========================================

export default function SubjectManagement() {

  // ==========================================
  // STATES
  // ==========================================

  const [subjects, setSubjects] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [editId, setEditId] =
    useState(null);

  const [searchTerm,
    setSearchTerm] =
    useState("");

  const [streamFilter,
    setStreamFilter] =
    useState("");

  const [semesterFilter,
    setSemesterFilter] =
    useState("");

  const [sessionFilter,
    setSessionFilter] =
    useState("");

  const [formData,
    setFormData] =
    useState({
      subjectName: "",
      subjectCode: "",
      stream: "",
      semester: "",
      session: "",
    });

  // ==========================================
  // FETCH SUBJECTS
  // ==========================================

  const fetchSubjects =
    async () => {

      try {

        setLoading(true);

        const {
          data,
        } = await api.get(
          "/subjects"
        );

        setSubjects(
  data?.data?.subjects || []
);

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
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    fetchSubjects();

  }, []);

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm =
    () => {

      setEditId(null);

      setFormData({
        subjectName: "",
        subjectCode: "",
        stream: "",
        semester: "",
        session: "",
      });

    };

  // ==========================================
  // INPUT CHANGE
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
  // CREATE / UPDATE SUBJECT
  // ==========================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        if (editId) {

          await api.put(
            `/subjects/${editId}`,
            formData
          );

          toast.success(
            "Subject updated successfully."
          );

        } else {

          await api.post(
            "/subjects",
            formData
          );

          toast.success(
            "Subject created successfully."
          );

        }

        resetForm();

        await fetchSubjects();

      } catch (error) {

        console.error(
          "Save Subject Error:",
          error
        );

        toast.error(
          error?.response?.data
            ?.message ||
          "Failed to save subject."
        );

      } finally {

        setLoading(false);

      }

    };

  // ==========================================
  // EDIT SUBJECT
  // ==========================================

  const handleEdit =
    (subject) => {

      setEditId(
        subject._id
      );

      setFormData({
        subjectName:
          subject.subjectName ||
          "",

        subjectCode:
          subject.subjectCode ||
          "",

        stream:
          subject.stream ||
          "",

        semester:
          subject.semester ||
          "",

        session:
          subject.session ||
          "",
      });

      window.scrollTo({
        top: 0,
        behavior:
          "smooth",
      });

    };

  // ==========================================
  // DEACTIVATE SUBJECT
  // ==========================================

  const handleDeactivate =
    async (id) => {

      const confirmed =
        window.confirm(
          "Deactivate this subject?"
        );

      if (!confirmed)
        return;

      try {

        setLoading(true);

        await api.delete(
          `/subjects/${id}`
        );

        toast.success(
          "Subject deactivated successfully."
        );

        await fetchSubjects();

      } catch (error) {

        console.error(
          "Deactivate Subject Error:",
          error
        );

        toast.error(
          error?.response?.data
            ?.message ||
          "Failed to deactivate subject."
        );

      } finally {

        setLoading(false);

      }

    };
      // ==========================================
  // FILTERED SUBJECTS
  // ==========================================

  const filteredSubjects =
    useMemo(() => {

      return subjects.filter(
        (subject) => {

          const keyword =
            searchTerm.toLowerCase();

          const matchesSearch =
            !searchTerm ||

            subject?.subjectName
              ?.toLowerCase()
              .includes(
                keyword
              ) ||

            subject?.subjectCode
              ?.toLowerCase()
              .includes(
                keyword
              );

          const matchesStream =
            !streamFilter ||
            subject.stream ===
              streamFilter;

          const matchesSemester =
            !semesterFilter ||
            subject.semester ===
              semesterFilter;

          const matchesSession =
            !sessionFilter ||
            subject.session ===
              sessionFilter;

          return (
            matchesSearch &&
            matchesStream &&
            matchesSemester &&
            matchesSession
          );

        }

      );

    }, [
      subjects,
      searchTerm,
      streamFilter,
      semesterFilter,
      sessionFilter,
    ]);

  // ==========================================
  // DASHBOARD STATS
  // ==========================================

  const totalSubjects =
    useMemo(
      () =>
        subjects.length,
      [subjects]
    );

  const activeSubjects =
    useMemo(
      () =>
        subjects.filter(
          (subject) =>
            subject.isActive
        ).length,
      [subjects]
    );

  const inactiveSubjects =
    useMemo(
      () =>
        subjects.filter(
          (subject) =>
            !subject.isActive
        ).length,
      [subjects]
    );

  const uniqueStreams =
    useMemo(
      () =>
        new Set(
          subjects
            .map(
              (subject) =>
                subject.stream
            )
            .filter(Boolean)
        ).size,
      [subjects]
    );

  const uniqueSessions =
    useMemo(
      () =>
        new Set(
          subjects
            .map(
              (subject) =>
                subject.session
            )
            .filter(Boolean)
        ).size,
      [subjects]
    );

  // ==========================================
  // OPTIONS
  // ==========================================

  const streams = [
    "BCA",
    "MCA",
    "BBA",
  ];

  const semesters = [
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
    "Semester 7",
    "Semester 8",
  ];

  const sessions = [
    "2025-2026",
    "2026-2027",
    "2027-2028",
    "2028-2029",
  ];

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

                Subject Management

              </h1>

              <p className="mt-4 max-w-3xl opacity-90">

                Create, manage and organize
                academic subjects used for
                attendance, faculty assignment
                and ERP reporting.

              </p>

            </div>

          </div>

        </div>

        {/* ===================================== */}
        {/* DASHBOARD STATS */}
        {/* ===================================== */}

        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">

          {/* TOTAL */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-base-content/70">

                    Total Subjects

                  </p>

                  <h2 className="text-4xl font-black text-primary">

                    {totalSubjects}

                  </h2>

                </div>

                <FaBook className="text-5xl text-primary" />

              </div>

            </div>

          </div>

          {/* ACTIVE */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-base-content/70">

                    Active

                  </p>

                  <h2 className="text-4xl font-black text-success">

                    {activeSubjects}

                  </h2>

                </div>

                <FaDatabase className="text-5xl text-success" />

              </div>

            </div>

          </div>

          {/* INACTIVE */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-base-content/70">

                    Inactive

                  </p>

                  <h2 className="text-4xl font-black text-error">

                    {inactiveSubjects}

                  </h2>

                </div>

                <FaTrash className="text-5xl text-error" />

              </div>

            </div>

          </div>

          {/* STREAMS */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-base-content/70">

                    Streams

                  </p>

                  <h2 className="text-4xl font-black text-info">

                    {uniqueStreams}

                  </h2>

                </div>

                <FaLayerGroup className="text-5xl text-info" />

              </div>

            </div>

          </div>

          {/* SESSIONS */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-base-content/70">

                    Sessions

                  </p>

                  <h2 className="text-4xl font-black text-warning">

                    {uniqueSessions}

                  </h2>

                </div>

                <FaDatabase className="text-5xl text-warning" />

              </div>

            </div>

          </div>

        </div>
                {/* ===================================== */}
        {/* FORM + FILTERS */}
        {/* ===================================== */}

        <div className="grid lg:grid-cols-2 gap-8 mb-8">

          {/* ===================================== */}
          {/* SUBJECT FORM */}
          {/* ===================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <h2 className="card-title text-2xl">

                {editId
                  ? "Update Subject"
                  : "Create Subject"}

              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* SUBJECT NAME */}

                <div>

                  <label className="label">

                    <span className="label-text font-semibold">

                      Subject Name

                    </span>

                  </label>

                  <input
                    type="text"
                    name="subjectName"
                    value={formData.subjectName}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Data Structures"
                    required
                  />

                </div>

                {/* SUBJECT CODE */}

                <div>

                  <label className="label">

                    <span className="label-text font-semibold">

                      Subject Code

                    </span>

                  </label>

                  <input
                    type="text"
                    name="subjectCode"
                    value={formData.subjectCode}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="BCA301"
                    required
                  />

                </div>

                {/* STREAM */}

                <div>

                  <label className="label">

                    <span className="label-text font-semibold">

                      Stream

                    </span>

                  </label>

                  <select
                    name="stream"
                    value={formData.stream}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                    required
                  >

                    <option value="">
                      Select Stream
                    </option>

                    {streams.map(
                      (stream) => (

                        <option
                          key={stream}
                          value={stream}
                        >

                          {stream}

                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* SEMESTER */}

                <div>

                  <label className="label">

                    <span className="label-text font-semibold">

                      Semester

                    </span>

                  </label>

                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                    required
                  >

                    <option value="">
                      Select Semester
                    </option>

                    {semesters.map(
                      (semester) => (

                        <option
                          key={semester}
                          value={semester}
                        >

                          {semester}

                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* SESSION */}

                <div>

                  <label className="label">

                    <span className="label-text font-semibold">

                      Session

                    </span>

                  </label>

                  <select
                    name="session"
                    value={formData.session}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                    required
                  >

                    <option value="">
                      Select Session
                    </option>

                    {sessions.map(
                      (session) => (

                        <option
                          key={session}
                          value={session}
                        >

                          {session}

                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* ACTION BUTTONS */}

                <div className="flex gap-3 pt-2">

                  {editId ? (

                    <>

                      <button
                        type="submit"
                        className="btn btn-warning flex-1"
                        disabled={loading}
                      >

                        <FaEdit />

                        Update Subject

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

                      Create Subject

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
                      placeholder="Search subject name or code..."
                      value={searchTerm}
                      onChange={(e) =>
                        setSearchTerm(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

                {/* STREAM */}

                <div>

                  <label className="label">

                    <span className="label-text">

                      Stream

                    </span>

                  </label>

                  <select
                    className="select select-bordered w-full"
                    value={streamFilter}
                    onChange={(e) =>
                      setStreamFilter(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      All Streams
                    </option>

                    {streams.map(
                      (stream) => (

                        <option
                          key={stream}
                          value={stream}
                        >

                          {stream}

                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* SEMESTER */}

                <div>

                  <label className="label">

                    <span className="label-text">

                      Semester

                    </span>

                  </label>

                  <select
                    className="select select-bordered w-full"
                    value={semesterFilter}
                    onChange={(e) =>
                      setSemesterFilter(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      All Semesters
                    </option>

                    {semesters.map(
                      (semester) => (

                        <option
                          key={semester}
                          value={semester}
                        >

                          {semester}

                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* SESSION */}

                <div>

                  <label className="label">

                    <span className="label-text">

                      Session

                    </span>

                  </label>

                  <select
                    className="select select-bordered w-full"
                    value={sessionFilter}
                    onChange={(e) =>
                      setSessionFilter(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      All Sessions
                    </option>

                    {sessions.map(
                      (session) => (

                        <option
                          key={session}
                          value={session}
                        >

                          {session}

                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* FILTER ACTIONS */}

                <div className="flex gap-3">

                  <button
                    type="button"
                    className="btn btn-primary flex-1"
                    onClick={fetchSubjects}
                  >

                    <FaSearch />

                    Refresh

                  </button>

                  <button
                    type="button"
                    className="btn btn-outline flex-1"
                    onClick={() => {

                      setSearchTerm("");

                      setStreamFilter("");

                      setSemesterFilter("");

                      setSessionFilter("");

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
        {/* SUBJECT TABLE */}
        {/* ===================================== */}

        {loading ? (

          <div className="flex justify-center py-20">

            <span className="loading loading-spinner loading-lg text-primary"></span>

          </div>

        ) : filteredSubjects.length === 0 ? (

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body text-center py-20">

              <FaBook className="mx-auto text-7xl text-base-content/20 mb-4" />

              <h2 className="text-3xl font-bold">

                No Subjects Found

              </h2>

              <p className="text-base-content/60 mt-2">

                No subjects match the current
                filters. Create a new subject or
                clear the filters to view all
                records.

              </p>

            </div>

          </div>

        ) : (

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center mb-4">

                <h2 className="card-title text-2xl">

                  Subject Database

                </h2>

                <div className="badge badge-primary badge-lg">

                  {filteredSubjects.length}

                </div>

              </div>

              <div className="overflow-x-auto">

                <table className="table table-zebra">

                  <thead>

                    <tr>

                      <th>Subject</th>

                      <th>Code</th>

                      <th>Stream</th>

                      <th>Semester</th>

                      <th>Session</th>

                      <th>Status</th>

                      <th className="text-center">

                        Actions

                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredSubjects.map(
                      (subject) => (

                        <tr
                          key={subject._id}
                        >

                          <td className="font-semibold">

                            {subject.subjectName}

                          </td>

                          <td>

                            {subject.subjectCode}

                          </td>

                          <td>

                            {subject.stream}

                          </td>

                          <td>

                            {subject.semester}

                          </td>

                          <td>

                            {subject.session}

                          </td>

                          <td>

                            <span
                              className={`badge ${
                                subject.isActive
                                  ? "badge-success"
                                  : "badge-error"
                              }`}
                            >

                              {subject.isActive
                                ? "Active"
                                : "Inactive"}

                            </span>

                          </td>

                          <td>

                            <div className="flex justify-center gap-2">

                              <button
                                className="btn btn-warning btn-sm"
                                onClick={() =>
                                  handleEdit(
                                    subject
                                  )
                                }
                              >

                                <FaEdit />

                              </button>

                              <button
                                className="btn btn-error btn-sm"
                                onClick={() =>
                                  handleDeactivate(
                                    subject._id
                                  )
                                }
                                disabled={
                                  !subject.isActive ||
                                  loading
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

                    Subject Management Dashboard

                  </h3>

                  <p className="text-base-content/70">

                    Total Subjects

                    <span className="ml-2 font-semibold text-primary">

                      {totalSubjects}

                    </span>

                  </p>

                </div>

                <div className="flex flex-wrap gap-3">

                  <button
                    className="btn btn-primary"
                    onClick={fetchSubjects}
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