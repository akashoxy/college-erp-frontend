import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";

import {
  Building2,
  Users,
  Trophy,
  Trash2,
  Upload,
  GraduationCap,
  RefreshCw,
} from "lucide-react";

import api from "../../../../services/api";


import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";

const PlacementControl = () => {

  /* ==========================================================
      STATE
  ========================================================== */

  const [
    recruiters,
    setRecruiters,
  ] = useState([]);

  const [
    students,
    setStudents,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

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
      RECRUITER FORM
  ========================================================== */

  const [
    recruiterData,
    setRecruiterData,
  ] = useState({
    companyName: "",
    website: "",
  });

  const [
    logo,
    setLogo,
  ] = useState(null);

  /* ==========================================================
      STUDENT FORM
  ========================================================== */

  const [
    studentData,
    setStudentData,
  ] = useState({
    studentName: "",
    department: "",
    company: "",
    designation: "",
    package: "",
    placementYear: "",
  });

  const [
    studentImage,
    setStudentImage,
  ] = useState(null);

  /* ==========================================================
      DASHBOARD STATS
  ========================================================== */

  const stats = useMemo(
    () => ({

      recruiters:
        recruiters.length,

      students:
        students.length,

      total:
        recruiters.length +
        students.length,

    }),
    [
      recruiters,
      students,
    ]
  );

  /* ==========================================================
      RESET FORMS
  ========================================================== */

  const resetRecruiterForm =
    () => {

      setRecruiterData({
        companyName: "",
        website: "",
      });

      setLogo(null);

    };

  const resetStudentForm =
    () => {

      setStudentData({
        studentName: "",
        department: "",
        company: "",
        designation: "",
        package: "",
        placementYear: "",
      });

      setStudentImage(null);

    };


    /* ==========================================================
      LOAD DATA
  ========================================================== */

  const loadData =
    async () => {

      try {

        setLoading(true);

        const [
          recruitersRes,
          studentsRes,
        ] = await Promise.all([

          api.get(
            "/recruiters"
          ),

          api.get(
            "/placed-students"
          ),

        ]);

        setRecruiters(
  recruitersRes.data?.data?.recruiters || []
);

        setStudents(
          studentsRes.data
            .data || []
        );

      } catch (error) {

        setRecruiters([]);

        setStudents([]);

        setStatusModal({
          isOpen: true,
          type: "error",
          title:
            "Loading Failed",
          message:
            error.response?.data
              ?.message ||
            "Failed to load placement data.",
        });

      } finally {

        setLoading(false);

        setRefreshing(false);

      }

    };

  useEffect(() => {

    loadData();

  }, []);

  /* ==========================================================
      REFRESH
  ========================================================== */

  const refreshData =
    async () => {

      setRefreshing(true);

      await loadData();

    };

  /* ==========================================================
      RECRUITER
  ========================================================== */

  const handleRecruiterSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setUploading(true);

        const formData =
          new FormData();

        formData.append(
          "companyName",
          recruiterData.companyName
        );

        formData.append(
          "website",
          recruiterData.website
        );

        if (logo) {

          formData.append(
            "logo",
            logo
          );

        }

        await api.post(
          "/recruiters",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        resetRecruiterForm();

        await loadData();

        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Success",
          message:
            "Recruiter added successfully.",
        });

      } catch (error) {

        setStatusModal({
          isOpen: true,
          type: "error",
          title:
            "Creation Failed",
          message:
            error.response?.data
              ?.message ||
            "Failed to create recruiter.",
        });

      } finally {

        setUploading(false);

      }

    };

  const deleteRecruiter =
    (id) => {

      setDeleteModal({

        isOpen: true,

        title:
          "Delete Recruiter",

        message:
          "Are you sure you want to delete this recruiter?",

        onConfirm:
          async () => {

            try {

              await api.delete(
                `/recruiters/${id}`
              );

              await loadData();

              setStatusModal({
                isOpen: true,
                type: "success",
                title: "Deleted",
                message:
                  "Recruiter deleted successfully.",
              });

            } catch (error) {

              setStatusModal({
                isOpen: true,
                type: "error",
                title:
                  "Delete Failed",
                message:
                  error.response?.data
                    ?.message ||
                  "Failed to delete recruiter.",
              });

            } finally {

              setDeleteModal({
                isOpen: false,
                title: "",
                message: "",
                onConfirm: null,
              });

            }

          },

      });

    };

    /* ==========================================================
      STUDENT
  ========================================================== */

  const handleStudentSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setUploading(true);

        const formData =
          new FormData();

        Object.entries(
          studentData
        ).forEach(
          ([key, value]) => {

            formData.append(
              key,
              value
            );

          }
        );

        if (studentImage) {

          formData.append(
            "image",
            studentImage
          );

        }

        await api.post(
          "/placed-students",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        resetStudentForm();

        await loadData();

        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Success",
          message:
            "Placed student added successfully.",
        });

      } catch (error) {

        setStatusModal({
          isOpen: true,
          type: "error",
          title:
            "Creation Failed",
          message:
            error.response?.data
              ?.message ||
            "Failed to create placed student.",
        });

      } finally {

        setUploading(false);

      }

    };

  const deleteStudent =
    (id) => {

      setDeleteModal({

        isOpen: true,

        title:
          "Delete Student",

        message:
          "Are you sure you want to delete this placed student?",

        onConfirm:
          async () => {

            try {

              await api.delete(
                `/placed-students/${id}`
              );

              await loadData();

              setStatusModal({
                isOpen: true,
                type: "success",
                title: "Deleted",
                message:
                  "Placed student deleted successfully.",
              });

            } catch (error) {

              setStatusModal({
                isOpen: true,
                type: "error",
                title:
                  "Delete Failed",
                message:
                  error.response?.data
                    ?.message ||
                  "Failed to delete placed student.",
              });

            } finally {

              setDeleteModal({
                isOpen: false,
                title: "",
                message: "",
                onConfirm: null,
              });

            }

          },

      });

    };

  /* ==========================================================
      JSX
  ========================================================== */

  if (loading) {

    return (
      <LoadingModal
        isOpen
        title="Loading Placement Data"
        message="Fetching recruiters and placed students..."
      />
    );

  }

  return (
    <>

      <LoadingModal
        isOpen={uploading}
        title="Please Wait"
        message="Processing your request..."
      />

      <StatusModal
        isOpen={statusModal.isOpen}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() =>
          setStatusModal(
            (prev) => ({
              ...prev,
              isOpen: false,
            })
          )
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
          duration: 0.3,
        }}
        className="min-h-screen bg-base-200 p-4 md:p-6"
      >

        <div className="max-w-7xl mx-auto space-y-6">

         
                    {/* ==========================================================
              HERO HEADER
          ========================================================== */}

          <div className="hero bg-linear-to-r from-primary to-secondary rounded-3xl shadow-2xl">

            <div className="hero-content text-center text-primary-content py-12">

              <div>

                <Trophy
                  size={64}
                  className="mx-auto mb-4"
                />

                <h1 className="text-4xl md:text-5xl font-black">

                  Placement Management

                </h1>

                <p className="mt-4 text-lg opacity-90 max-w-3xl">

                  Manage recruiters, placement
                  partners and placed students
                  from one enterprise dashboard.

                </p>

              </div>

            </div>

          </div>

          {/* ==========================================================
              HEADER
          ========================================================== */}

          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">

            <div>

              <h2 className="text-2xl font-black">

                Placement Dashboard

              </h2>

              <p className="text-base-content/60">

                Cloudinary powered recruiter
                and placement management.

              </p>

            </div>

            <button
              type="button"
              className="btn btn-primary"
              disabled={refreshing}
              onClick={refreshData}
            >

              <RefreshCw
                size={18}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh Data

            </button>

          </div>

          {/* ==========================================================
              DASHBOARD STATS
          ========================================================== */}

          <div className="grid md:grid-cols-3 gap-6">

            <motion.div
              whileHover={{
                y: -5,
              }}
              className="stats bg-base-100 shadow border border-base-300"
            >

              <div className="stat">

                <div className="stat-figure text-primary">

                  <Building2 size={30} />

                </div>

                <div className="stat-title">

                  Recruiters

                </div>

                <div className="stat-value text-primary">

                  {stats.recruiters}

                </div>

              </div>

            </motion.div>

            <motion.div
              whileHover={{
                y: -5,
              }}
              className="stats bg-base-100 shadow border border-base-300"
            >

              <div className="stat">

                <div className="stat-figure text-secondary">

                  <GraduationCap size={30} />

                </div>

                <div className="stat-title">

                  Placed Students

                </div>

                <div className="stat-value text-secondary">

                  {stats.students}

                </div>

              </div>

            </motion.div>

            <motion.div
              whileHover={{
                y: -5,
              }}
              className="stats bg-base-100 shadow border border-base-300"
            >

              <div className="stat">

                <div className="stat-figure text-success">

                  <Users size={30} />

                </div>

                <div className="stat-title">

                  Total Records

                </div>

                <div className="stat-value text-success">

                  {stats.total}

                </div>

              </div>

            </motion.div>

          </div>

         
                    {/* ==========================================================
              RECRUITER MANAGEMENT
          ========================================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex items-center gap-3 mb-2">

                <Building2
                  size={28}
                  className="text-primary"
                />

                <div>

                  <h2 className="text-2xl font-black">

                    Recruiters Management

                  </h2>

                  <p className="text-base-content/60">

                    Add and manage placement partner companies.

                  </p>

                </div>

              </div>

              <div className="divider" />

              {/* ==========================================================
                  RECRUITER FORM
              ========================================================== */}

              <form
                onSubmit={handleRecruiterSubmit}
                className="grid lg:grid-cols-3 gap-5"
              >

                <input
                  type="text"
                  placeholder="Company Name"
                  className="input input-bordered w-full"
                  value={recruiterData.companyName}
                  onChange={(e) =>
                    setRecruiterData({
                      ...recruiterData,
                      companyName:
                        e.target.value,
                    })
                  }
                  required
                />

                <input
                  type="url"
                  placeholder="Website URL"
                  className="input input-bordered w-full"
                  value={recruiterData.website}
                  onChange={(e) =>
                    setRecruiterData({
                      ...recruiterData,
                      website:
                        e.target.value,
                    })
                  }
                />

                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) =>
                    setLogo(
                      e.target.files?.[0] ||
                        null
                    )
                  }
                  required
                />

                <div className="lg:col-span-3 flex justify-end">

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={uploading}
                  >

                    <Upload
                      size={18}
                    />

                    Save Recruiter

                  </button>

                </div>

              </form>

            </div>

          </div>

    
                    {/* ==========================================================
              RECRUITERS TABLE
          ========================================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex items-center justify-between">

                <h2 className="text-2xl font-black">

                  Recruiter List

                </h2>

                <div className="badge badge-primary badge-lg">

                  {stats.recruiters} Recruiters

                </div>

              </div>

              <div className="divider" />

            <div
  className="
    overflow-auto
    max-h-162.5
    rounded-2xl
    border
    border-base-300
  "
>

  <table className="table table-pin-rows">

                  <thead className="bg-base-200">

                    <tr>

                      <th>Logo</th>

                      <th>Company</th>

                      <th>Website</th>

                      <th className="text-center">

                        Action

                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {recruiters.length > 0 ? (

                      recruiters.map(
                        (item) => (

                          <tr
                            key={item._id}
                          >

                            <td>

                              <img
                                src={item.logo}
                                alt={
                                  item.companyName
                                }
                                className="w-16 h-16 object-contain rounded-xl border border-base-300"
                              />

                            </td>

                            <td>

                              <div className="font-bold">

                                {item.companyName}

                              </div>

                            </td>

                            <td>

                              {item.website ? (

                                <a
                                  href={item.website}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="link link-primary"
                                >

                                  Visit Website

                                </a>

                              ) : (

                                <span className="text-base-content/50">

                                  —

                                </span>

                              )}

                            </td>

                            <td>

                              <div className="flex justify-center">

                                <button
                                  type="button"
                                  className="btn btn-error btn-sm"
                                  onClick={() =>
                                    deleteRecruiter(
                                      item._id
                                    )
                                  }
                                >

                                  <Trash2
                                    size={16}
                                  />

                                  Delete

                                </button>

                              </div>

                            </td>

                          </tr>

                        )
                      )

                    ) : (

                      <tr>

                        <td
                          colSpan="4"
                          className="text-center py-16"
                        >

                          <div className="flex flex-col items-center gap-4">

                            <Building2
                              size={60}
                              className="opacity-30"
                            />

                            <h3 className="text-xl font-bold">

                              No Recruiters Found

                            </h3>

                            <p className="text-base-content/60">

                              Add recruiter companies
                              to build your placement
                              network.

                            </p>

                          </div>

                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        
                    {/* ==========================================================
              PLACED STUDENTS MANAGEMENT
          ========================================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex items-center gap-3 mb-2">

                <GraduationCap
                  size={28}
                  className="text-secondary"
                />

                <div>

                  <h2 className="text-2xl font-black">

                    Placed Students Management

                  </h2>

                  <p className="text-base-content/60">

                    Add and manage successfully placed students.

                  </p>

                </div>

              </div>

              <div className="divider" />

              {/* ==========================================================
                  STUDENT FORM
              ========================================================== */}

              <form
                onSubmit={
                  handleStudentSubmit
                }
                className="grid lg:grid-cols-2 gap-5"
              >

                <input
                  type="text"
                  placeholder="Student Name"
                  className="input input-bordered"
                  value={
                    studentData.studentName
                  }
                  onChange={(e) =>
                    setStudentData({
                      ...studentData,
                      studentName:
                        e.target.value,
                    })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Department"
                  className="input input-bordered"
                  value={
                    studentData.department
                  }
                  onChange={(e) =>
                    setStudentData({
                      ...studentData,
                      department:
                        e.target.value,
                    })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Company"
                  className="input input-bordered"
                  value={
                    studentData.company
                  }
                  onChange={(e) =>
                    setStudentData({
                      ...studentData,
                      company:
                        e.target.value,
                    })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Designation"
                  className="input input-bordered"
                  value={
                    studentData.designation
                  }
                  onChange={(e) =>
                    setStudentData({
                      ...studentData,
                      designation:
                        e.target.value,
                    })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Package (e.g. 8.5 LPA)"
                  className="input input-bordered"
                  value={
                    studentData.package
                  }
                  onChange={(e) =>
                    setStudentData({
                      ...studentData,
                      package:
                        e.target.value,
                    })
                  }
                  required
                />

                <input
                  type="number"
                  placeholder="Placement Year"
                  min="2000"
                  max="2100"
                  className="input input-bordered"
                  value={
                    studentData.placementYear
                  }
                  onChange={(e) =>
                    setStudentData({
                      ...studentData,
                      placementYear:
                        e.target.value,
                    })
                  }
                  required
                />

                <div className="lg:col-span-2">

                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                    onChange={(e) =>
                      setStudentImage(
                        e.target.files?.[0] ||
                          null
                      )
                    }
                    required
                  />

                </div>

                <div className="lg:col-span-2 flex justify-end">

                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={uploading}
                  >

                    <Upload
                      size={18}
                    />

                    Save Student

                  </button>

                </div>

              </form>

            </div>

          </div>

     
                    {/* ==========================================================
              PLACED STUDENTS TABLE
          ========================================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex items-center justify-between">

                <h2 className="text-2xl font-black">

                  Placed Students

                </h2>

                <div className="badge badge-secondary badge-lg">

                  {stats.students} Students

                </div>

              </div>

              <div className="divider" />

             <div
  className="
    overflow-auto
    max-h-162.5
    rounded-2xl
    border
    border-base-300
  "
>

  <table className="table table-pin-rows">

                  <thead className="bg-base-200">

                    <tr>

                      <th>Photo</th>

                      <th>Student</th>

                      <th>Company</th>

                      <th>Designation</th>

                      <th>Package</th>

                      <th>Year</th>

                      <th className="text-center">

                        Action

                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {students.length > 0 ? (

                      students.map(
                        (student) => (

                          <tr
                            key={student._id}
                          >

                            <td>

                              <img
                                src={student.image}
                                alt={
                                  student.studentName
                                }
                                className="w-14 h-14 rounded-full object-cover border border-base-300"
                              />

                            </td>

                            <td>

                              <div>

                                <div className="font-bold">

                                  {student.studentName}

                                </div>

                                <div className="text-sm text-base-content/60">

                                  {student.department}

                                </div>

                              </div>

                            </td>

                            <td>

                              {student.company}

                            </td>

                            <td>

                              {student.designation}

                            </td>

                            <td>

                              <span className="badge badge-success">

                                {student.package}

                              </span>

                            </td>

                            <td>

                              {student.placementYear}

                            </td>

                            <td>

                              <div className="flex justify-center">

                                <button
                                  type="button"
                                  className="btn btn-error btn-sm"
                                  onClick={() =>
                                    deleteStudent(
                                      student._id
                                    )
                                  }
                                >

                                  <Trash2
                                    size={16}
                                  />

                                  Delete

                                </button>

                              </div>

                            </td>

                          </tr>

                        )
                      )

                    ) : (

                      <tr>

                        <td
                          colSpan="7"
                          className="text-center py-16"
                        >

                          <div className="flex flex-col items-center gap-4">

                            <GraduationCap
                              size={60}
                              className="opacity-30"
                            />

                            <h3 className="text-xl font-bold">

                              No Placed Students

                            </h3>

                            <p className="text-base-content/60">

                              Add placed students to
                              showcase placement
                              achievements.

                            </p>

                          </div>

                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        </div>

      </motion.div>

    </>

  );

};

export default PlacementControl;