import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaUserGraduate,
  FaClipboardCheck,
  FaChartPie,
  FaBook,
} from "react-icons/fa";

import api from "../../services/api";

// ==========================================
// COMPONENT
// ==========================================

export default function StudentAttendance() {

  // ==========================================
  // STATES
  // ==========================================

  const [attendanceRecords,
    setAttendanceRecords] =
    useState([]);

  const [summary,
    setSummary] =
    useState({
      totalClasses: 0,
      presentClasses: 0,
      percentage: 0,
    });

  const [loading,
    setLoading] =
    useState(false);

  // ==========================================
  // GET STUDENT
  // ==========================================

 const student =
  JSON.parse(
    localStorage.getItem(
      "user"
    )
  );

  const studentId =
    student?._id;

  // ==========================================
  // FETCH ATTENDANCE
  // ==========================================

    const fetchAttendance = async () => {
  try {

    setLoading(true);

    const attendanceRes = await api.get(
      `/attendance/student/${studentId}`
    );

    setAttendanceRecords(
    attendanceRes.data.data.attendance || []
);

    const summaryRes = await api.get(
      `/attendance/percentage/${studentId}`
    );

   setSummary(
    summaryRes.data.data.summary || {
        totalClasses: 0,
        presentClasses: 0,
        percentage: 0,
    }
);

  } catch (error) {

    console.error(
      "Attendance Error:",
      error
    );

  } finally {

    setLoading(false);

  }
};

  useEffect(() => {

    if (
      studentId
    ) {

      fetchAttendance();

    }

  }, [studentId]);

  // ==========================================
  // SUBJECT WISE SUMMARY
  // ==========================================

  const subjectWiseAttendance =
    useMemo(() => {

      const subjectMap = {};

      attendanceRecords.forEach(
        (record) => {

          const subjectName =
            record.subjectId
              ?.subjectName ||
            "Unknown";

          const studentRecord =
            record.attendance?.find(
              (
                item
              ) =>
                item.studentId ===
                  studentId ||
                item.studentId
                  ?._id ===
                  studentId
            );

          if (
            !studentRecord
          )
            return;

          if (
            !subjectMap[
              subjectName
            ]
          ) {

            subjectMap[
              subjectName
            ] = {
              subject:
                subjectName,
              total: 0,
              present: 0,
            };
          }

          subjectMap[
            subjectName
          ].total++;

          if (
            studentRecord.status ===
            "Present"
          ) {

            subjectMap[
              subjectName
            ].present++;

          }
        }
      );

      return Object.values(
        subjectMap
      );

    }, [
      attendanceRecords,
      studentId,
    ]);

  // ==========================================
  // STATS
  // ==========================================

  const totalSubjects =
    subjectWiseAttendance.length;
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

              My Attendance

            </h1>

            <p className="mt-4 max-w-2xl opacity-90">

              Track your attendance,
              monitor subject-wise performance
              and stay above the minimum
              attendance requirement.

            </p>

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* LOADING */}
      {/* ===================================== */}

      {loading ? (

        <div className="flex justify-center py-20">

          <span className="loading loading-spinner loading-lg text-primary"></span>

        </div>

      ) : (

        <>

          {/* ===================================== */}
          {/* STATS */}
          {/* ===================================== */}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

            {/* TOTAL CLASSES */}

            <div className="card bg-base-100 border border-base-300 shadow-xl">

              <div className="card-body">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-base-content/70">

                      Total Classes

                    </p>

                    <h2 className="text-4xl font-bold text-primary">

                      {summary.totalClasses}

                    </h2>

                  </div>

                  <FaClipboardCheck className="text-5xl text-primary" />

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

                      {summary.presentClasses}

                    </h2>

                  </div>

                  <FaUserGraduate className="text-5xl text-success" />

                </div>

              </div>

            </div>

            {/* PERCENTAGE */}

            <div className="card bg-base-100 border border-base-300 shadow-xl">

              <div className="card-body">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-base-content/70">

                      Attendance %

                    </p>

                    <h2 className="text-4xl font-bold text-info">

                      {summary.percentage}%

                    </h2>

                  </div>

                  <FaChartPie className="text-5xl text-info" />

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

                    <h2 className="text-4xl font-bold text-warning">

                      {totalSubjects}

                    </h2>

                  </div>

                  <FaBook className="text-5xl text-warning" />

                </div>

              </div>

            </div>

          </div>

          {/* ===================================== */}
          {/* STUDENT SUMMARY */}
          {/* ===================================== */}

          <div className="grid lg:grid-cols-3 gap-8 mb-8">

            {/* PROFILE CARD */}

            <div className="card bg-base-100 border border-base-300 shadow-xl">

              <div className="card-body">

                <h2 className="card-title">

                  Student Information

                </h2>

                <div className="space-y-3">

                  <p>

                    <strong>Name:</strong>{" "}
                    {student?.name}

                  </p>

                  <p>

                    <strong>Roll:</strong>{" "}
                    {student?.roll}

                  </p>

                  <p>

                    <strong>Registration:</strong>{" "}
                    {student?.reg}

                  </p>

                  <p>

                    <strong>Stream:</strong>{" "}
                    {student?.stream}

                  </p>

                  <p>

                    <strong>Semester:</strong>{" "}
                    {student?.semester}

                  </p>

                </div>

              </div>

            </div>

            {/* PERCENTAGE CARD */}

            <div className="lg:col-span-2">

              <div className="card bg-base-100 border border-base-300 shadow-xl">

                <div className="card-body items-center text-center">

                  <h2 className="card-title">

                    Overall Attendance

                  </h2>

                  <div
                    className="radial-progress text-primary my-6"
                    style={{
                      "--value":
                        Number(
                          summary.percentage || 0
                        ),
                      "--size":
                        "10rem",
                      "--thickness":
                        "0.8rem",
                    }}
                    role="progressbar"
                  >

                    {summary.percentage}%

                  </div>

                  <div className="flex gap-6 text-center">

                    <div>

                      <p className="font-bold text-success text-2xl">

                        {
                          summary.presentClasses
                        }

                      </p>

                      <p className="text-sm opacity-70">

                        Present

                      </p>

                    </div>

                    <div>

                      <p className="font-bold text-primary text-2xl">

                        {
                          summary.totalClasses
                        }

                      </p>

                      <p className="text-sm opacity-70">

                        Total

                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
                    {/* ===================================== */}
          {/* SUBJECT WISE ATTENDANCE */}
          {/* ===================================== */}

          {subjectWiseAttendance.length === 0 ? (

            <div className="card bg-base-100 border border-base-300 shadow-xl">

              <div className="card-body text-center py-20">

                <FaClipboardCheck className="mx-auto text-7xl text-base-content/20 mb-4" />

                <h2 className="text-3xl font-bold">

                  No Attendance Records

                </h2>

                <p className="text-base-content/60 mt-2">

                  Attendance records will appear
                  here once faculty start marking
                  attendance.

                </p>

              </div>

            </div>

          ) : (

            <div className="card bg-base-100 border border-base-300 shadow-xl">

              <div className="card-body">

                <h2 className="card-title text-2xl">

                  Subject Wise Attendance

                </h2>

                <div className="overflow-x-auto">

                  <table className="table table-zebra">

                    <thead>

                      <tr>

                        <th>Subject</th>

                        <th>Present</th>

                        <th>Total</th>

                        <th>Percentage</th>

                        <th>Status</th>

                      </tr>

                    </thead>

                    <tbody>

                      {subjectWiseAttendance.map(
                        (subject) => {

                          const percentage =
                            subject.total === 0
                              ? 0
                              : (
                                  (subject.present /
                                    subject.total) *
                                  100
                                ).toFixed(2);

                          let status =
                            "Critical";

                          let badge =
                            "badge-error";

                          if (
                            percentage >= 75
                          ) {

                            status = "Good";
                            badge =
                              "badge-success";

                          } else if (
                            percentage >= 60
                          ) {

                            status =
                              "Warning";

                            badge =
                              "badge-warning";
                          }

                          return (

                            <tr
                              key={
                                subject.subject
                              }
                            >

                              <td className="font-semibold">

                                {
                                  subject.subject
                                }

                              </td>

                              <td className="text-success font-bold">

                                {
                                  subject.present
                                }

                              </td>

                              <td>

                                {
                                  subject.total
                                }

                              </td>

                              <td>

                                {percentage}%

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
          {/* FOOTER */}
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

                      Overall Attendance :

                      <span className="font-semibold text-primary ml-2">

                        {summary.percentage}%

                      </span>

                    </p>

                  </div>

                  <div>

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

        </>

      )}

    </div>

  </div>
);
}