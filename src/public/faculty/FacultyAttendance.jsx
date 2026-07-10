import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaUserCheck,
  FaBook,
  FaCalendarAlt,
  FaSave,
  FaUsers,
  FaClipboardCheck,
} from "react-icons/fa";

import api from "../../services/api";

// ==========================================
// COMPONENT
// ==========================================

export default function FacultyAttendance() {

  // ==========================================
  // STATES
  // ==========================================

  const [subjects, setSubjects] =
    useState([]);

  const [students, setStudents] =
    useState([]);

  const [attendanceData,
    setAttendanceData] =
    useState([]);

  const [loading,
    setLoading] =
    useState(false);

  const [selectedSubject,
    setSelectedSubject] =
    useState("");

  const [selectedDate,
    setSelectedDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [subjectInfo,
    setSubjectInfo] =
    useState(null);

  // ==========================================
  // LOAD FACULTY SUBJECTS
  // ==========================================

  const fetchSubjects =
    async () => {

      try {

        const res = await api.get("/attendance/faculty-subjects");

console.log("Faculty Subjects Response:", res.data);

setSubjects(res.data.data.subjects || []);

      } catch (error) {

        console.error(
          error
        );

      }
    };

  // ==========================================
  // LOAD STUDENTS
  // ==========================================

  const loadStudents =
    async (
      stream,
      semester
    ) => {

      try {

        setLoading(true);

        const res = await api.get(
  `/attendance/students?stream=${stream}&semester=${semester}`
);

const studentList =
  res.data.data.students || [];

        setStudents(
          studentList
        );

        // default present

        const attendance =
          studentList.map(
            (
              student
            ) => ({
              studentId:
                student._id,
              status:
                "Present",
            })
          );

        setAttendanceData(
          attendance
        );

      } catch (error) {

        console.error(
          error
        );

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
  // SUBJECT CHANGE
  // ==========================================

  const handleSubjectChange =
    async (subjectId) => {

      setSelectedSubject(
        subjectId
      );

      const selected =
        subjects.find(
          (item) =>
            item.subjectId
              ?._id ===
            subjectId
        );

      if (!selected)
        return;

      setSubjectInfo(
        selected.subjectId
      );

      await loadStudents(
        selected.subjectId
          .stream,
        selected.subjectId
          .semester
      );
    };

  // ==========================================
  // ATTENDANCE TOGGLE
  // ==========================================

  const toggleAttendance =
    (
      studentId,
      checked
    ) => {

      setAttendanceData(
        (prev) =>
          prev.map(
            (item) =>
              item.studentId ===
              studentId
                ? {
                    ...item,
                    status:
                      checked
                        ? "Present"
                        : "Absent",
                  }
                : item
          )
      );
    };

  // ==========================================
  // MARK ALL PRESENT
  // ==========================================

  const markAllPresent =
    () => {

      setAttendanceData(
        students.map(
          (
            student
          ) => ({
            studentId:
              student._id,
            status:
              "Present",
          })
        )
      );
    };

  // ==========================================
  // STATS
  // ==========================================

  const totalStudents =
    students.length;

  const presentCount =
    attendanceData.filter(
      (item) =>
        item.status ===
        "Present"
    ).length;

  const absentCount =
    attendanceData.filter(
      (item) =>
        item.status ===
        "Absent"
    ).length;

  // ==========================================
  // SAVE ATTENDANCE
  // ==========================================

  const saveAttendance =
    async () => {

      if (
        !selectedSubject
      ) {

        return alert(
          "Please select a subject"
        );
      }

      try {

       const res = await api.post(
          "/attendance/save",
          {
            date:
              selectedDate,

            subjectId:
              selectedSubject,

            stream:
              subjectInfo
                ?.stream,

            semester:
              subjectInfo
                ?.semester,

            session:
              subjectInfo
                ?.session,

            attendance:
              attendanceData,
          }
        );

        alert(
           res.data.message ||
          "Attendance saved successfully ✅"
        );

      } catch (error) {

        console.error(
          error
        );

        alert(
          error?.response
            ?.data?.message ||
          "Failed to save attendance"
        );
      }
    };
    return (
  <div className="min-h-screen bg-base-200 p-6">

    <div className="max-w-7xl mx-auto">

      {/* ===================================== */}
      {/* HERO */}
      {/* ===================================== */}

      <div className="hero rounded-3xl bg-linear-to-r from-primary to-secondary text-primary-content shadow-2xl mb-8">

        <div className="hero-content text-center py-12">

          <div>

            <h1 className="text-4xl md:text-5xl font-bold">

              Faculty Attendance

            </h1>

            <p className="mt-4 max-w-2xl opacity-90">

              Select a subject, load students,
              mark attendance and save records
              directly into the ERP system.

            </p>

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* STATS */}
      {/* ===================================== */}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        {/* STUDENTS */}

        <div className="card bg-base-100 border border-base-300 shadow-xl">

          <div className="card-body">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-base-content/70">

                  Students

                </p>

                <h2 className="text-4xl font-bold text-primary">

                  {totalStudents}

                </h2>

              </div>

              <FaUsers className="text-5xl text-primary" />

            </div>

          </div>

        </div>

        {/* PRESENT */}

        <div className="card bg-base-100 border border-base-300 shadow-xl">

          <div className="card-body">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-base-content/70">

                  Present

                </p>

                <h2 className="text-4xl font-bold text-success">

                  {presentCount}

                </h2>

              </div>

              <FaUserCheck className="text-5xl text-success" />

            </div>

          </div>

        </div>

        {/* ABSENT */}

        <div className="card bg-base-100 border border-base-300 shadow-xl">

          <div className="card-body">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-base-content/70">

                  Absent

                </p>

                <h2 className="text-4xl font-bold text-error">

                  {absentCount}

                </h2>

              </div>

              <FaClipboardCheck className="text-5xl text-error" />

            </div>

          </div>

        </div>

        {/* SUBJECTS */}

        <div className="card bg-base-100 border border-base-300 shadow-xl">

          <div className="card-body">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-base-content/70">

                  My Subjects

                </p>

                <h2 className="text-4xl font-bold text-info">

                  {subjects.length}

                </h2>

              </div>

              <FaBook className="text-5xl text-info" />

            </div>

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* CONTROLS */}
      {/* ===================================== */}

      <div className="grid lg:grid-cols-2 gap-8 mb-8">

        {/* SUBJECT + DATE */}

        <div className="card bg-base-100 border border-base-300 shadow-xl">

          <div className="card-body">

            <h2 className="card-title text-2xl">

              Attendance Setup

            </h2>

            {/* SUBJECT */}

            <div>

              <label className="label">

                <span className="label-text font-semibold">

                  Subject

                </span>

              </label>

              <select
                className="select select-bordered w-full"
                value={selectedSubject}
                onChange={(e) =>
                  handleSubjectChange(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Select Subject
                </option>

                {subjects.map(
                  (subject) => (

                    <option
                      key={
                        subject
                          .subjectId
                          ?._id
                      }
                      value={
                        subject
                          .subjectId
                          ?._id
                      }
                    >

                      {
                        subject
                          .subjectId
                          ?.subjectName
                      }
                      {" • "}
                      {
                        subject
                          .subjectId
                          ?.stream
                      }
                      {" • "}
                      {
                        subject
                          .subjectId
                          ?.semester
                      }

                    </option>
                  )
                )}

              </select>

            </div>

            {/* DATE */}

            <div>

              <label className="label">

                <span className="label-text font-semibold">

                  Attendance Date

                </span>

              </label>

              <input
                type="date"
                className="input input-bordered w-full"
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        </div>

        {/* SUBJECT DETAILS */}

        <div className="card bg-base-100 border border-base-300 shadow-xl">

          <div className="card-body">

            <h2 className="card-title text-2xl">

              Subject Details

            </h2>

            {subjectInfo ? (

              <div className="space-y-3">

                <div className="badge badge-primary badge-lg">

                  {
                    subjectInfo.subjectName
                  }

                </div>

                <p>

                  <strong>
                    Subject Code:
                  </strong>{" "}

                  {
                    subjectInfo.subjectCode
                  }

                </p>

                <p>

                  <strong>
                    Stream:
                  </strong>{" "}

                  {
                    subjectInfo.stream
                  }

                </p>

                <p>

                  <strong>
                    Semester:
                  </strong>{" "}

                  {
                    subjectInfo.semester
                  }

                </p>

                <p>

                  <strong>
                    Session:
                  </strong>{" "}

                  {
                    subjectInfo.session
                  }

                </p>

              </div>

            ) : (

              <div className="flex items-center justify-center h-full">

                <p className="text-base-content/50">

                  Select a subject to view details

                </p>

              </div>

            )}

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* ACTION BAR */}
      {/* ===================================== */}

      <div className="flex flex-wrap gap-4 mb-8">

        <button
          className="btn btn-success"
          onClick={markAllPresent}
          disabled={
            students.length === 0
          }
        >

          <FaUserCheck />

          Mark All Present

        </button>

        <button
          className="btn btn-primary"
          onClick={saveAttendance}
          disabled={
            students.length === 0
          }
        >

          <FaSave />

          Save Attendance

        </button>

      </div>
            {/* ===================================== */}
      {/* ATTENDANCE TABLE */}
      {/* ===================================== */}

      {loading ? (

        <div className="flex justify-center py-20">

          <span className="loading loading-spinner loading-lg text-primary"></span>

        </div>

      ) : students.length === 0 ? (

        <div className="card bg-base-100 border border-base-300 shadow-xl">

          <div className="card-body text-center py-20">

            <FaUsers className="mx-auto text-7xl text-base-content/20 mb-4" />

            <h2 className="text-3xl font-bold">

              No Students Loaded

            </h2>

            <p className="text-base-content/60 mt-2">

              Select a subject to load students.

            </p>

          </div>

        </div>

      ) : (

        <div className="card bg-base-100 border border-base-300 shadow-xl">

          <div className="card-body">

            <h2 className="card-title text-2xl">

              Student Attendance

            </h2>

            <div className="overflow-x-auto">

              <table className="table table-zebra">

                <thead>

                  <tr>

                    <th>#</th>

                    <th>Roll</th>

                    <th>Name</th>

                    <th>Registration</th>

                    <th>Attendance</th>

                  </tr>

                </thead>

                <tbody>

                  {students.map(
                    (
                      student,
                      index
                    ) => {

                      const currentAttendance =
                        attendanceData.find(
                          (
                            item
                          ) =>
                            item.studentId ===
                            student._id
                        );

                      return (

                        <tr
                          key={
                            student._id
                          }
                        >

                          {/* SERIAL */}

                          <td>

                            {index + 1}

                          </td>

                          {/* ROLL */}

                          <td>

                            {
                              student.roll
                            }

                          </td>

                          {/* NAME */}

                          <td className="font-semibold">

                            {
                              student.name
                            }

                          </td>

                          {/* REG */}

                          <td>

                            {
                              student.reg
                            }

                          </td>

                          {/* ATTENDANCE */}

                          <td>

                            <label className="label cursor-pointer justify-start gap-4">

                              <input
                                type="checkbox"
                                className="toggle toggle-success"
                                checked={
                                  currentAttendance?.status ===
                                  "Present"
                                }
                                onChange={(
                                  e
                                ) =>
                                  toggleAttendance(
                                    student._id,
                                    e
                                      .target
                                      .checked
                                  )
                                }
                              />

                              <span
                                className={`font-semibold ${
                                  currentAttendance?.status ===
                                  "Present"
                                    ? "text-success"
                                    : "text-error"
                                }`}
                              >

                                {currentAttendance?.status}

                              </span>

                            </label>

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
      {/* STICKY FOOTER */}
      {/* ===================================== */}

      <div className="sticky bottom-0 mt-10">

        <div className="card bg-base-100 border border-base-300 shadow-2xl">

          <div className="card-body">

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

              <div>

                <h3 className="font-bold text-lg">

                  Attendance Dashboard

                </h3>

                <p className="text-base-content/70">

                  Present :

                  <span className="font-semibold text-success ml-2">

                    {presentCount}

                  </span>

                  <span className="mx-2">
                    /
                  </span>

                  Total :

                  <span className="font-semibold text-primary ml-2">

                    {totalStudents}

                  </span>

                </p>

              </div>

              <div className="flex gap-3">

                <button
                  className="btn btn-primary"
                  onClick={
                    saveAttendance
                  }
                  disabled={
                    students.length === 0
                  }
                >
                  <FaSave />
                  Save Attendance
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