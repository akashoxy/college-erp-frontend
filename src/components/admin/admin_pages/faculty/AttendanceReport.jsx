import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaChartBar,
  FaUsers,
  FaBook,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

import api from "../../../../services/api";


// ==========================================
// COMPONENT
// ==========================================

export default function AttendanceReport() {

  // ==========================================
  // STATES
  // ==========================================

  const [reports, setReports] =
    useState([]);

  const [subjects, setSubjects] =
    useState([]);

  const [assignments,
    setAssignments] =
    useState([]);

  const [loading,
    setLoading] =
    useState(false);

  const [searchTerm,
    setSearchTerm] =
    useState("");

  const [filters,
    setFilters] =
    useState({
      stream: "",
      semester: "",
      subjectId: "",
    });

  // ==========================================
  // LOAD REPORTS
  // ==========================================

  const fetchReports =
    async () => {
      try {
        setLoading(true);

        const params =
          new URLSearchParams();

        if (filters.stream) {
          params.append(
            "stream",
            filters.stream
          );
        }

        if (
          filters.semester
        ) {
          params.append(
            "semester",
            filters.semester
          );
        }

        if (
          filters.subjectId
        ) {
          params.append(
            "subjectId",
            filters.subjectId
          );
        }

        const {
          data,
        } = await api.get(
          `/attendance/report?${params.toString()}`
        );

        setReports(
  data?.data?.records || []
);

      } catch (error) {

        console.error(
          "Fetch Reports Error:",
          error
        );

        setReports([]);

      } finally {

        setLoading(false);

      }
    };

  // ==========================================
  // LOAD SUBJECTS
  // ==========================================

  const fetchSubjects =
    async () => {
      try {

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

        setSubjects([]);

      }
    };

  // ==========================================
  // LOAD ASSIGNMENTS
  // ==========================================

  const fetchAssignments =
    async () => {
      try {

        const {
          data,
        } = await api.get(
          "/assignments"
        );

        setAssignments(
  data?.data?.assignments || []
);

      } catch (error) {

        console.error(
          "Fetch Assignments Error:",
          error
        );

        setAssignments([]);

      }
    };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    fetchReports();

    fetchSubjects();

    fetchAssignments();

  }, []);

  // ==========================================
  // FILTER CHANGE
  // ==========================================

  useEffect(() => {

    fetchReports();

  }, [filters]);

  // ==========================================
  // HANDLE FILTER CHANGE
  // ==========================================

  const handleFilterChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;

      setFilters(
        (prev) => ({
          ...prev,
          [name]:
            value,
        })
      );
    };
      // ==========================================
  // REPORT SUMMARY
  // ==========================================

  const totalRecords =
    useMemo(
      () => reports.length,
      [reports]
    );

  const totalStudents =
    useMemo(
      () =>
        reports.reduce(
          (
            total,
            report
          ) =>
            total +
            (report
              ?.attendance
              ?.length || 0),
          0
        ),
      [reports]
    );

  const totalSubjects =
    useMemo(
      () =>
        new Set(
          reports
            .map(
              (report) =>
                report
                  ?.subjectId
                  ?._id
            )
            .filter(Boolean)
        ).size,
      [reports]
    );

  const lowAttendanceThreshold =
    75;

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

                Attendance Reports

              </h1>

              <p className="mt-4 max-w-3xl opacity-90">

                Analyze attendance records,
                monitor subject performance,
                identify low-attendance students,
                and generate detailed academic
                insights from the ERP dashboard.

              </p>

            </div>

          </div>

        </div>

        {/* ===================================== */}
        {/* DASHBOARD STATS */}
        {/* ===================================== */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

          {/* RECORDS */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-base-content/70">

                    Attendance Records

                  </p>

                  <h2 className="text-4xl font-black text-primary">

                    {totalRecords}

                  </h2>

                </div>

                <FaChartBar className="text-5xl text-primary" />

              </div>

            </div>

          </div>

          {/* STUDENTS */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-base-content/70">

                    Student Entries

                  </p>

                  <h2 className="text-4xl font-black text-success">

                    {totalStudents}

                  </h2>

                </div>

                <FaUsers className="text-5xl text-success" />

              </div>

            </div>

          </div>

          {/* SUBJECTS */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-base-content/70">

                    Subjects Covered

                  </p>

                  <h2 className="text-4xl font-black text-warning">

                    {totalSubjects}

                  </h2>

                </div>

                <FaBook className="text-5xl text-warning" />

              </div>

            </div>

          </div>

        </div>
                {/* ===================================== */}
        {/* FILTERS */}
        {/* ===================================== */}

        <div className="card bg-base-100 border border-base-300 shadow-xl mb-8">

          <div className="card-body">

            <div className="flex items-center gap-3 mb-6">

              <FaFilter className="text-primary text-xl" />

              <h2 className="card-title text-2xl">

                Report Filters

              </h2>

            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

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
                    placeholder="Search subject or faculty..."
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
                  name="stream"
                  value={filters.stream}
                  onChange={handleFilterChange}
                  className="select select-bordered w-full"
                >

                  <option value="">
                    All Streams
                  </option>

                  <option value="BCA">
                    BCA
                  </option>

                  <option value="BBA">
                    BBA
                  </option>

                  <option value="MCA">
                    MCA
                  </option>

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
                  name="semester"
                  value={filters.semester}
                  onChange={handleFilterChange}
                  className="select select-bordered w-full"
                >

                  <option value="">
                    All Semesters
                  </option>

                  {[
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                  ].map((semester) => (

                    <option
                      key={semester}
                      value={semester}
                    >

                      Semester {semester}

                    </option>

                  ))}

                </select>

              </div>

              {/* SUBJECT */}

              <div>

                <label className="label">

                  <span className="label-text">

                    Subject

                  </span>

                </label>

                <select
                  name="subjectId"
                  value={
                    filters.subjectId
                  }
                  onChange={handleFilterChange}
                  className="select select-bordered w-full"
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

            </div>

            {/* ACTIONS */}

            <div className="flex flex-wrap gap-3 mt-6">

              <button
                className="btn btn-primary"
                onClick={fetchReports}
              >

                <FaSearch />

                Apply Filters

              </button>

              <button
                className="btn btn-outline"
                onClick={() => {

                  setSearchTerm("");

                  setFilters({
                    stream: "",
                    semester: "",
                    subjectId: "",
                  });

                }}
              >

                Clear Filters

              </button>

            </div>

          </div>

        </div>
                {/* ===================================== */}
        {/* REPORT TABLE */}
        {/* ===================================== */}

        {loading ? (

          <div className="flex justify-center py-20">

            <span className="loading loading-spinner loading-lg text-primary"></span>

          </div>

        ) : reports.length === 0 ? (

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body text-center py-20">

              <FaChartBar className="mx-auto text-7xl text-base-content/20 mb-4" />

              <h2 className="text-3xl font-bold">

                No Attendance Records

              </h2>

              <p className="text-base-content/60 mt-2">

                No attendance records found for
                the selected filters.

              </p>

            </div>

          </div>

        ) : (

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <h2 className="card-title text-2xl">

                Attendance Analytics

              </h2>

              <div className="overflow-x-auto">

                <table className="table table-zebra">

                  <thead>

                    <tr>

                      <th>Date</th>

                      <th>Subject</th>

                      <th>Faculty</th>

                      <th>Stream</th>

                      <th>Semester</th>

                      <th>Total</th>

                      <th>Present</th>

                      <th>Absent</th>

                      <th>Attendance</th>

                      <th>Status</th>

                    </tr>

                  </thead>

                  <tbody>

                    {reports
                      .filter(
                        (record) => {

                          if (
                            !searchTerm
                          )
                            return true;

                          return (
                            record?.subjectId?.subjectName
                              ?.toLowerCase()
                              .includes(
                                searchTerm.toLowerCase()
                              ) ||

                            record?.facultyId?.name
                              ?.toLowerCase()
                              .includes(
                                searchTerm.toLowerCase()
                              )
                          );
                        }
                      )
                      .map(
                        (
                          record
                        ) => {

                          const total =
                            record
                              ?.attendance
                              ?.length ||
                            0;

                          const present =
                            record?.attendance?.filter(
                              (
                                student
                              ) =>
                                student.status ===
                                "Present"
                            )
                              .length ||
                            0;

                          const absent =
                            total -
                            present;

                          const percentage =
                            total === 0
                              ? 0
                              : Number(
                                  (
                                    (present /
                                      total) *
                                    100
                                  ).toFixed(
                                    2
                                  )
                                );

                          let badge =
                            "badge-error";

                          let status =
                            "Critical";

                          if (
                            percentage >=
                            75
                          ) {

                            badge =
                              "badge-success";

                            status =
                              "Good";

                          } else if (
                            percentage >=
                            60
                          ) {

                            badge =
                              "badge-warning";

                            status =
                              "Warning";

                          }

                          return (

                            <tr
                              key={
                                record._id
                              }
                            >

                              <td>

                                {new Date(
                                  record.date
                                ).toLocaleDateString()}

                              </td>

                              <td className="font-semibold">

                                {record
                                  ?.subjectId
                                  ?.subjectName ||
                                  "-"}

                              </td>

                              <td>

                                {record
                                  ?.facultyId
                                  ?.name ||
                                  "-"}

                              </td>

                              <td>

                                {record.stream}

                              </td>

                              <td>

                                {record.semester}

                              </td>

                              <td>

                                {total}

                              </td>

                              <td className="font-bold text-success">

                                {present}

                              </td>

                              <td className="font-bold text-error">

                                {absent}

                              </td>

                              <td>

                                <span className="font-semibold">

                                  {percentage}%

                                </span>

                              </td>

                              <td>

                                <span
                                  className={`badge ${badge}`}
                                >

                                  {status}

                                </span>

                              </td>

                            </tr>

                          );

                        }
                      )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        )}
                {/* ===================================== */}
        {/* LOW ATTENDANCE SUMMARY */}
        {/* ===================================== */}

        <div className="card bg-base-100 border border-base-300 shadow-xl mt-8">

          <div className="card-body">

            <h2 className="card-title text-2xl text-error">

              Low Attendance Alert

            </h2>

            <div className="alert alert-warning">

              <span>

                Students with attendance below{" "}

                <span className="font-bold">

                  {lowAttendanceThreshold}%

                </span>

                {" "}should be reviewed and
                appropriate academic action
                should be taken.

              </span>

            </div>

          </div>

        </div>

        {/* ===================================== */}
        {/* FOOTER */}
        {/* ===================================== */}

        <div className="sticky bottom-0 mt-10">

          <div className="card bg-base-100 border border-base-300 shadow-2xl">

            <div className="card-body">

              <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                <div>

                  <h3 className="font-bold text-lg">

                    Attendance Report Dashboard

                  </h3>

                  <p className="text-base-content/70">

                    Total Attendance Records

                    <span className="ml-2 font-semibold text-primary">

                      {totalRecords}

                    </span>

                  </p>

                </div>

                <div className="flex flex-wrap gap-3">

                  <button
                    className="btn btn-primary"
                    onClick={fetchReports}
                    disabled={loading}
                  >

                    <FaChartBar />

                    {loading
                      ? "Refreshing..."
                      : "Refresh Reports"}

                  </button>

                  <button
                    className="btn btn-outline"
                    onClick={() =>
                      window.scrollTo({
                        top: 0,
                        behavior:
                          "smooth",
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