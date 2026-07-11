import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import * as XLSX from "xlsx";

import { motion } from "framer-motion";

import {
  Search,
  RefreshCw,
  Users,
  GraduationCap,
  Trash2,
  Download,
  ArrowUpCircle,
} from "lucide-react";

import api from "../../../../services/api";

import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";

function StudentDatabaseControl() {

  /* ==========================================================
      STATES
  ========================================================== */

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [selected, setSelected] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [
    streamFilter,
    setStreamFilter,
  ] = useState("all");

  const [
    semesterFilter,
    setSemesterFilter,
  ] = useState("all");

  const [
    statusTab,
    setStatusTab,
  ] = useState("active");

  const [stats, setStats] =
    useState({

      total: 0,

      active: 0,

      passout: 0,

      bca: 0,

      bba: 0,

      mca: 0,

    });

  /* ==========================================================
      MODALS
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

  const [
    deleteModal,
    setDeleteModal,
  ] = useState({

    isOpen: false,

    title: "",

    message: "",

    onConfirm: null,

  });

  /* ==========================================================
      FETCH STUDENTS
  ========================================================== */

  const fetchStudents =
    useCallback(async () => {

      try {

        setLoading(true);

        const { data } = await api.get("/admin/students");

setStudents(
  data.students ||
  data.data?.students ||
  []
);

      } catch (error) {

        setStatusModal({

          isOpen: true,

          type: "error",

          title: "Loading Failed",

          message:

            error.response?.data
              ?.message ||

            "Unable to load students.",

        });

      } finally {

        setLoading(false);

      }

    }, []);

  /* ==========================================================
      FETCH DASHBOARD STATS
  ========================================================== */

  const fetchStats = useCallback(async () => {
  try {
    const { data } = await api.get(
      "/admin/students/stats/dashboard"
    );

    setStats({
      total: data.total ?? 0,
      active: data.active ?? 0,
      passout: data.passout ?? 0,
      suspended: data.suspended ?? 0,
      bca: data.bca ?? 0,
      bba: data.bba ?? 0,
      mca: data.mca ?? 0,
    });
  } catch (error) {
    setStats({
      total: 0,
      active: 0,
      passout: 0,
      suspended: 0,
      bca: 0,
      bba: 0,
      mca: 0,
    });
  }
}, []);

  /* ==========================================================
      INITIAL LOAD
  ========================================================== */

  useEffect(() => {

    fetchStudents();

    fetchStats();

  }, [
    fetchStudents,
    fetchStats,
  ]);

  /* ==========================================================
      FILTERED STUDENTS
  ========================================================== */

  const filteredStudents =
    useMemo(() => {

      return students.filter(

        (student) => {

          const statusMatch =

            student.status ===
            statusTab;

          const streamMatch =

            streamFilter ===
              "all" ||

            student.stream ===
              streamFilter;

          const semesterMatch =

            semesterFilter ===
              "all" ||

            Number(
              student.semester
            ) ===
              Number(
                semesterFilter
              );

          const searchMatch =

            !search ||

            student.name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            student.email
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            student.roll
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            student.reg
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

          return (

            statusMatch &&

            streamMatch &&

            semesterMatch &&

            searchMatch

          );

        }

      );

    }, [

      students,

      search,

      streamFilter,

      semesterFilter,

      statusTab,

    ]);

  /* ==========================================================
      SELECT SINGLE
  ========================================================== */

  const toggleSelect =
    (id) => {

      setSelected(
        (prev) =>

          prev.includes(id)

            ? prev.filter(
                (item) =>
                  item !== id
              )

            : [
                ...prev,
                id,
              ]

      );

    };

  /* ==========================================================
      SELECT ALL
  ========================================================== */

  const toggleSelectAll =
    () => {

      if (

        selected.length ===

        filteredStudents.length

      ) {

        setSelected([]);

      } else {

        setSelected(

          filteredStudents.map(

            (student) =>
              student._id

          )

        );

      }

    };

  /* ==========================================================
      DELETE STUDENT
  ========================================================== */

  const deleteStudent =
    (id) => {

      setDeleteModal({

        isOpen: true,

        title:
          "Delete Student",

        message:
          "Are you sure you want to permanently delete this student?",

        onConfirm:
          async () => {

            try {

              await api.delete(

                `/admin/students/${id}`

              );

              await fetchStudents();

              await fetchStats();

              setDeleteModal({

                isOpen: false,

                title: "",

                message: "",

                onConfirm: null,

              });

              setStatusModal({

                isOpen: true,

                type: "success",

                title: "Deleted",

                message:
                  "Student deleted successfully.",

              });

            } catch (error) {

              setStatusModal({

                isOpen: true,

                type: "error",

                title: "Delete Failed",

                message:

                  error.response?.data
                    ?.message ||

                  "Unable to delete student.",

              });

            }

          },

      });

    };
      /* ==========================================================
      BULK DELETE
  ========================================================== */

  const bulkDelete =
    async () => {

      if (
        selected.length === 0
      ) {

        return setStatusModal({

          isOpen: true,

          type: "warning",

          title: "Selection Required",

          message:
            "Please select at least one student.",

        });

      }

      setDeleteModal({

        isOpen: true,

        title:
          "Delete Selected Students",

        message: `Delete ${selected.length} selected student(s)? This action cannot be undone.`,

        onConfirm:
          async () => {

            try {

              await api.delete(

                "/admin/students/bulk/delete",

                {

                  data: {

                    ids:
                      selected,

                  },

                }

              );

              setSelected([]);

              await fetchStudents();

              await fetchStats();

              setDeleteModal({

                isOpen: false,

                title: "",

                message: "",

                onConfirm: null,

              });

              setStatusModal({

                isOpen: true,

                type: "success",

                title: "Deleted",

                message:
                  "Selected students deleted successfully.",

              });

            } catch (error) {

              setStatusModal({

                isOpen: true,

                type: "error",

                title: "Delete Failed",

                message:

                  error.response?.data
                    ?.message ||

                  "Unable to delete selected students.",

              });

            }

          },

      });

    };

  /* ==========================================================
      RESTORE STUDENT
  ========================================================== */

  const restoreStudent =
    async (id) => {

      try {

        const { data } =
          await api.put(

            `/admin/students/restore/${id}`

          );

        await fetchStudents();

        await fetchStats();

        setStatusModal({

          isOpen: true,

          type: "success",

          title: "Restored",

          message:

            data.message ||

            "Student restored successfully.",

        });

      } catch (error) {

        setStatusModal({

          isOpen: true,

          type: "error",

          title: "Restore Failed",

          message:

            error.response?.data
              ?.message ||

            "Unable to restore student.",

        });

      }

    };

  /* ==========================================================
      RESTORE SELECTED STUDENTS
  ========================================================== */

  const restoreSelectedStudents =
    async () => {

      if (
        selected.length === 0
      ) {

        return setStatusModal({

          isOpen: true,

          type: "warning",

          title: "Selection Required",

          message:
            "Please select at least one student.",

        });

      }

      try {

        await Promise.all(

          selected.map(

            (id) =>

              api.put(

                `/admin/students/restore/${id}`

              )

          )

        );

        setSelected([]);

        await fetchStudents();

        await fetchStats();

        setStatusModal({

          isOpen: true,

          type: "success",

          title:
            "Students Restored",

          message:
            "Selected students restored successfully.",

        });

      } catch (error) {

        setStatusModal({

          isOpen: true,

          type: "error",

          title:
            "Restore Failed",

          message:

            error.response?.data
              ?.message ||

            "Unable to restore selected students.",

        });

      }

    };

  /* ==========================================================
      PROMOTE SELECTED STUDENTS
  ========================================================== */

  const promoteSelectedStudents =
    async () => {

      if (
        selected.length === 0
      ) {

        return setStatusModal({

          isOpen: true,

          type: "warning",

          title:
            "Selection Required",

          message:
            "Please select at least one student.",

        });

      }

      try {

        const { data } =
          await api.put(

            "/admin/students/promote-selected",

            {

              ids:
                selected,

            }

          );

        setSelected([]);

        await fetchStudents();

        await fetchStats();

        setStatusModal({

          isOpen: true,

          type: "success",

          title:
            "Promotion Successful",

          message:

            data.message ||

            "Students promoted successfully.",

        });

      } catch (error) {

        setStatusModal({

          isOpen: true,

          type: "error",

          title:
            "Promotion Failed",

          message:

            error.response?.data
              ?.message ||

            "Unable to promote students.",

        });

      }

    };

  /* ==========================================================
      MOVE TO ALUMNI
  ========================================================== */

  const moveToAlumni =
    async () => {

      if (
        selected.length === 0
      ) {

        return setStatusModal({

          isOpen: true,

          type: "warning",

          title:
            "Selection Required",

          message:
            "Please select at least one student.",

        });

      }

      try {

        const { data } =
          await api.put(

            "/admin/students/bulk/alumni",

            {

              ids:
                selected,

            }

          );

        setSelected([]);

        await fetchStudents();

        await fetchStats();

        setStatusModal({

          isOpen: true,

          type: "success",

          title:
            "Moved Successfully",

          message:

            data.message ||

            "Selected students moved to Alumni.",

        });

      } catch (error) {

        setStatusModal({

          isOpen: true,

          type: "error",

          title:
            "Move Failed",

          message:

            error.response?.data
              ?.message ||

            "Unable to move students to Alumni.",

        });

      }

    };

  /* ==========================================================
      EXPORT CURRENT STUDENTS
  ========================================================== */

  const exportExcel =
    () => {

      const rows =
        filteredStudents.map(
          (student) => ({

            Name:
              student.name,

            Email:
              student.email,

            Registration:
              student.reg,

            Roll:
              student.roll,

            Stream:
              student.stream,

            Semester:
              student.semester,

            Batch:
              student.batch,

            Status:
              student.status,

          })
        );

      const worksheet =
        XLSX.utils.json_to_sheet(
          rows
        );

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Students"

      );

      XLSX.writeFile(

        workbook,

        "Students.xlsx"

      );

    };

  /* ==========================================================
      EXPORT PASSOUT STUDENTS
  ========================================================== */

  const exportPassoutExcel =
    () => {

      const rows =
        students

          .filter(

            (student) =>

              student.status ===
              "passout"

          )

          .map(
            (student) => ({

              Name:
                student.name,

              Email:
                student.email,

              Registration:
                student.reg,

              Roll:
                student.roll,

              Stream:
                student.stream,

              Semester:
                student.semester,

              Batch:
                student.batch,

            })
          );

      const worksheet =
        XLSX.utils.json_to_sheet(
          rows
        );

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Passout Students"

      );

      XLSX.writeFile(

        workbook,

        "PassoutStudents.xlsx"

      );

    };
      return (

    <>

      {/* ==========================================================
          MODALS
      ========================================================== */}

      <LoadingModal
        isOpen={loading}
        title="Loading Students"
        message="Fetching student database..."
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
        title={deleteModal.title}
        message={deleteModal.message}
        onConfirm={deleteModal.onConfirm}
        onCancel={() =>
          setDeleteModal({
            isOpen: false,
            title: "",
            message: "",
            onConfirm: null,
          })
        }
      />

      <motion.div

        initial={{
          opacity: 0,
          y: 20,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          duration: 0.35,
        }}

        className="
          min-h-screen
          bg-base-200
          p-6
        "

      >

        <div className="max-w-7xl mx-auto space-y-8">

          {/* ==========================================================
              HERO
          ========================================================== */}

          <motion.div

            initial={{
              opacity: 0,
              y: -20,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              duration: 0.4,
            }}

            className="
              hero
              rounded-3xl
              bg-linear-to-r
              from-primary
              via-secondary
              to-accent
              text-primary-content
              shadow-xl
            "

          >

            <div className="hero-content w-full flex-col lg:flex-row justify-between py-10">

              <div>

                <h1 className="text-4xl lg:text-5xl font-black">

                  Student Database

                </h1>

                <p className="mt-4 max-w-3xl text-lg opacity-90">

                  Manage active students, passout students,
                  semester promotions, alumni transfer,
                  restore operations and Excel exports
                  from one centralized ERP dashboard.

                </p>

              </div>

              <button

                className="btn btn-outline bg-base-100 text-base-content border-0"

                disabled={loading}

                onClick={() => {

                  fetchStudents();

                  fetchStats();

                }}

              >

                <RefreshCw size={18} />

                Refresh

              </button>

            </div>

          </motion.div>

          {/* ==========================================================
              DASHBOARD STATS
          ========================================================== */}

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">

            <div className="stat bg-base-100 rounded-box shadow border border-base-300">

              <div className="stat-figure text-primary">

                <Users size={28} />

              </div>

              <div className="stat-title">

                Total Students

              </div>

              <div className="stat-value text-primary">

                {stats.total}

              </div>

            </div>

            <div className="stat bg-base-100 rounded-box shadow border border-base-300">

              <div className="stat-title">

                Active

              </div>

              <div className="stat-value text-success">

                {stats.active}

              </div>

            </div>

            <div className="stat bg-base-100 rounded-box shadow border border-base-300">

              <div className="stat-title">

                Passout

              </div>

              <div className="stat-value text-warning">

                {stats.passout}

              </div>

            </div>

            <div className="stat bg-base-100 rounded-box shadow border border-base-300">

              <div className="stat-title">

                BCA

              </div>

              <div className="stat-value">

                {stats.bca}

              </div>

            </div>

            <div className="stat bg-base-100 rounded-box shadow border border-base-300">

              <div className="stat-title">

                BBA

              </div>

              <div className="stat-value">

                {stats.bba}

              </div>

            </div>

            <div className="stat bg-base-100 rounded-box shadow border border-base-300">

              <div className="stat-title">

                MCA

              </div>

              <div className="stat-value">

                {stats.mca}

              </div>

            </div>

          </div>

          {/* ==========================================================
              SEARCH & FILTERS
          ========================================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="grid md:grid-cols-4 gap-4">

                <label className="input input-bordered flex items-center gap-2">

                  <Search size={18} />

                  <input

                    type="text"

                    className="grow"

                    placeholder={
                      statusTab === "passout"

                        ? "Search Passout Students"

                        : "Search Students"
                    }

                    value={search}

                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }

                  />

                </label>

                <select

                  className="select select-bordered"

                  value={streamFilter}

                  onChange={(e) =>
                    setStreamFilter(
                      e.target.value
                    )
                  }

                >

                  <option value="all">

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

                <select

                  className="select select-bordered"

                  value={semesterFilter}

                  onChange={(e) =>
                    setSemesterFilter(
                      e.target.value
                    )
                  }

                >

                  <option value="all">

                    All Semesters

                  </option>

                  {[1,2,3,4,5,6,7,8].map(
                    (sem) => (

                      <option
                        key={sem}
                        value={sem}
                      >

                        Semester {sem}

                      </option>

                    )
                  )}

                </select>

                <button

                  className="btn btn-primary"

                  disabled={loading}

                  onClick={() => {

                    fetchStudents();

                    fetchStats();

                  }}

                >

                  <RefreshCw size={18} />

                  Refresh

                </button>

              </div>

            </div>

          </div>

          {/* ==========================================================
              STATUS TABS
          ========================================================== */}

          <div className="tabs tabs-boxed bg-base-100 shadow border border-base-300 w-fit">

            <button

              className={`tab ${
                statusTab === "active"
                  ? "tab-active"
                  : ""
              }`}

              onClick={() =>
                setStatusTab(
                  "active"
                )
              }

            >

              Active Students

              <div className="badge badge-success ml-2">

                {stats.active}

              </div>

            </button>

            <button

              className={`tab ${
                statusTab === "passout"
                  ? "tab-active"
                  : ""
              }`}

              onClick={() =>
                setStatusTab(
                  "passout"
                )
              }

            >

              Passout Students

              <div className="badge badge-warning ml-2">

                {stats.passout}

              </div>

            </button>

          </div>

          
                    <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="overflow-x-auto">

              <table className="table table-zebra">

                <thead>

                  <tr>

                    <th>

                      <input

                        type="checkbox"

                        className="checkbox"

                        checked={

                          filteredStudents.length > 0 &&

                          selected.length ===

                            filteredStudents.length

                        }

                        onChange={toggleSelectAll}

                      />

                    </th>

                    <th>Name</th>

                    <th>Email</th>

                    <th>Registration</th>

                    <th>Roll</th>

                    <th>Stream</th>

                    <th>Semester</th>

                    <th>Status</th>

                    <th>Batch</th>

                    <th className="text-center">

                      Actions

                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    <tr>

                      <td

                        colSpan={10}

                        className="text-center py-16"

                      >

                        <span className="loading loading-spinner loading-lg text-primary"></span>

                      </td>

                    </tr>

                  ) : filteredStudents.length === 0 ? (

                    <tr>

                      <td

                        colSpan={10}

                        className="py-16"

                      >

                        <div className="flex flex-col items-center gap-4">

                          <Users

                            size={56}

                            className="opacity-30"

                          />

                          <h3 className="text-2xl font-bold">

                            {statusTab === "passout"

                              ? "No Passout Students"

                              : "No Active Students"}

                          </h3>

                          <p className="text-base-content/60">

                            No students match the current filters.

                          </p>

                        </div>

                      </td>

                    </tr>

                  ) : (

                    filteredStudents.map(

                      (student) => (

                        <motion.tr

                          key={student._id}

                          initial={{

                            opacity: 0,

                            y: 10,

                          }}

                          animate={{

                            opacity: 1,

                            y: 0,

                          }}

                          transition={{

                            duration: 0.25,

                          }}

                        >

                          <td>

                            <input

                              type="checkbox"

                              className="checkbox checkbox-primary"

                              checked={

                                selected.includes(

                                  student._id

                                )

                              }

                              onChange={() =>

                                toggleSelect(

                                  student._id

                                )

                              }

                            />

                          </td>

                          <td>

                            <div>

                              <div className="font-semibold">

                                {student.name}

                              </div>

                            </div>

                          </td>

                          <td>

                            {student.email}

                          </td>

                          <td>

                            {student.reg || "-"}

                          </td>

                          <td>

                            {student.roll || "-"}

                          </td>

                          <td>

                            <span className="badge badge-primary">

                              {student.stream}

                            </span>

                          </td>

                          <td>

                            Semester {student.semester}

                          </td>

                          <td>

                            <span

                              className={`badge ${
                                student.status ===
                                "active"

                                  ? "badge-success"

                                  : student.status ===
                                    "passout"

                                  ? "badge-warning"

                                  : "badge-error"

                              }`}

                            >

                              {student.status}

                            </span>

                          </td>

                          <td>

                            {student.batch || "-"}

                          </td>

                          <td>

                            <div className="flex justify-center gap-2">

                              {statusTab ===

                                "passout" && (

                                <button

                                  className="btn btn-success btn-xs"

                                  onClick={() =>

                                    restoreStudent(

                                      student._id

                                    )

                                  }

                                >

                                  Restore

                                </button>

                              )}

                              <button

                                className="btn btn-error btn-xs"

                                onClick={() =>

                                  deleteStudent(

                                    student._id

                                  )

                                }

                              >

                                <Trash2

                                  size={14}

                                />

                              </button>

                            </div>

                          </td>

                        </motion.tr>

                      )

                    )

                  )}

                </tbody>

              </table>

            </div>

          </div>

          
                    <div className="sticky bottom-4 z-30">

            <div className="card bg-base-100 border border-base-300 shadow-2xl">

              <div className="card-body">

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

                  <div>

                    <h3 className="text-xl font-black">

                      Selected Students

                    </h3>

                    <p className="text-base-content/60">

                      {selected.length} student(s) selected

                    </p>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {statusTab === "active" && (

                      <>

                        <button

                          className="btn btn-primary"

                          disabled={

                            selected.length === 0 ||

                            loading

                          }

                          onClick={

                            promoteSelectedStudents

                          }

                        >

                          <ArrowUpCircle size={18} />

                          Promote

                        </button>

                        <button

                          className="btn btn-warning"

                          disabled={

                            selected.length === 0 ||

                            loading

                          }

                          onClick={

                            moveToAlumni

                          }

                        >

                          <GraduationCap size={18} />

                          Alumni

                        </button>

                      </>

                    )}

                    {statusTab === "passout" && (

                      <button

                        className="btn btn-success"

                        disabled={

                          selected.length === 0 ||

                          loading

                        }

                        onClick={

                          restoreSelectedStudents

                        }

                      >

                        Restore

                      </button>

                    )}

                    <button

                      className="btn btn-error"

                      disabled={

                        selected.length === 0 ||

                        loading

                      }

                      onClick={bulkDelete}

                    >

                      <Trash2 size={18} />

                      Delete

                    </button>

                    <button

                      className="btn btn-success"

                      disabled={

                        filteredStudents.length === 0

                      }

                      onClick={exportExcel}

                    >

                      <Download size={18} />

                      Export Current

                    </button>

                    <button

                      className="btn btn-info"

                      disabled={

                        students.filter(

                          (student) =>

                            student.status ===

                            "passout"

                        ).length === 0

                      }

                      onClick={

                        exportPassoutExcel

                      }

                    >

                      <Download size={18} />

                      Export Passout

                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </motion.div>

    </>

  );

}

export default StudentDatabaseControl;