import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";

import * as XLSX from "xlsx";

import { saveAs } from "file-saver";

import {
  Search,
  Trash2,
  Download,
  Users,
  Mail,
} from "lucide-react";

import api from "../../../../services/api";


import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";

export default function EnquiryManagement() {

  /* ==========================================================
      STATES
  ========================================================== */

  const [
    enquiries,
    setEnquiries,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    courseFilter,
    setCourseFilter,
  ] = useState("All");

  const [
    deleteModal,
    setDeleteModal,
  ] = useState({
    isOpen: false,
    enquiry: null,
  });

  const [
    statusModal,
    setStatusModal,
  ] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  /* ==========================================================
      DASHBOARD STATS
  ========================================================== */

  const stats = useMemo(
    () => ({
      total:
        enquiries.length,

      pending:
        enquiries.filter(
          (item) =>
            item.status ===
            "Pending"
        ).length,

      contacted:
        enquiries.filter(
          (item) =>
            item.status ===
            "Contacted"
        ).length,

      converted:
        enquiries.filter(
          (item) =>
            item.status ===
            "Converted"
        ).length,
    }),
    [enquiries]
  );

  /* ==========================================================
      COURSES
  ========================================================== */

  const courses = useMemo(
    () => [
      "All",
      ...new Set(
        enquiries.map(
          (item) =>
            item.course
        )
      ),
    ],
    [enquiries]
  );

  /* ==========================================================
      STATUS BADGES
  ========================================================== */

  const getStatusBadge =
    (status) => {
      switch (status) {

        case "Converted":
          return "badge-success";

        case "Contacted":
          return "badge-warning";

        default:
          return "badge-error";

      }
    };

  /* ==========================================================
      Continue in Part 2
  ========================================================== */
    /* ==========================================================
      FETCH ENQUIRIES
  ========================================================== */

  const fetchEnquiries =
    async () => {

      try {

        setLoading(true);

        const { data } =
          await api.get(
            "/admissions"
          );

        setEnquiries(
          data.data || []
        );

      } catch (error) {

        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Load Failed",
          message:
            error.response?.data
              ?.message ||
            "Failed to fetch admission enquiries.",
        });

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    fetchEnquiries();

  }, []);

  /* ==========================================================
      DELETE ENQUIRY
  ========================================================== */

  const handleDelete =
    async () => {

      if (
        !deleteModal.enquiry
      ) {
        return;
      }

      try {

        await api.delete(
          `/admissions/${deleteModal.enquiry._id}`
        );

        await fetchEnquiries();

        setDeleteModal({
          isOpen: false,
          enquiry: null,
        });

        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Deleted",
          message:
            "Enquiry deleted successfully.",
        });

      } catch (error) {

        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Delete Failed",
          message:
            error.response?.data
              ?.message ||
            "Failed to delete enquiry.",
        });

      }

    };

  /* ==========================================================
      UPDATE STATUS
  ========================================================== */

  const handleStatusChange =
    async (
      id,
      status
    ) => {

      try {

        await api.put(
          `/admissions/${id}/status`,
          { status }
        );

        setEnquiries(
          (prev) =>
            prev.map(
              (item) =>
                item._id === id
                  ? {
                      ...item,
                      status,
                    }
                  : item
            )
        );

      } catch (error) {

        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Update Failed",
          message:
            error.response?.data
              ?.message ||
            "Failed to update enquiry status.",
        });

      }

    };

  /* ==========================================================
      EMAIL REPLY
  ========================================================== */

  const handleReply = (
    email,
    name
  ) => {

    const subject =
      "Admission Enquiry Response";

    const body =
`Dear ${name},

Thank you for your interest in our institution.

Our admission team will contact you shortly regarding your enquiry.

Best Regards,
Admission Department`;

    window.open(

      `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(
        body
      )}`,

      "_blank"

    );

  };

  /* ==========================================================
      Continue in Part 3
  ========================================================== */
    /* ==========================================================
      FILTERED ENQUIRIES
  ========================================================== */

  const filteredEnquiries =
    useMemo(() => {

      return enquiries.filter(
        (item) => {

          const matchesSearch =

            item.fullName
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            item.email
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            item.phone?.includes(
              search
            );

          const matchesCourse =

            courseFilter ===
              "All" ||

            item.course ===
              courseFilter;

          return (
            matchesSearch &&
            matchesCourse
          );

        }
      );

    }, [
      enquiries,
      search,
      courseFilter,
    ]);

  /* ==========================================================
      EXPORT EXCEL
  ========================================================== */

  const exportExcel = () => {

    const worksheet =
      XLSX.utils.json_to_sheet(
        filteredEnquiries
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Admission Enquiries"
    );

    const excelBuffer =
      XLSX.write(
        workbook,
        {
          bookType:
            "xlsx",
          type:
            "array",
        }
      );

    saveAs(

      new Blob(
        [excelBuffer],
        {
          type:
            "application/octet-stream",
        }
      ),

      "admission-enquiries.xlsx"

    );

  };

  /* ==========================================================
      JSX
  ========================================================== */

  return (
    <>

      {/* ==========================================================
          MODALS
      ========================================================== */}

      <LoadingModal
        isOpen={loading}
        title="Loading Enquiries"
        message="Fetching admission enquiries..."
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
        isOpen={
          deleteModal.isOpen
        }
        itemName={
          deleteModal
            .enquiry
            ?.fullName
        }
        onConfirm={
          handleDelete
        }
        onCancel={() =>
          setDeleteModal({
            isOpen: false,
            enquiry: null,
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
              Continue in Part 4
          ========================================================== */}
                    {/* ==========================================================
              HERO
          ========================================================== */}

          <div className="hero bg-linear-to-r from-primary to-secondary rounded-3xl shadow-2xl">

            <div className="hero-content text-center text-primary-content py-10">

              <div>

                <Users
                  size={60}
                  className="mx-auto mb-4"
                />

                <h1 className="text-4xl md:text-5xl font-black">

                  Admission Enquiries

                </h1>

                <p className="mt-3 text-lg opacity-90">

                  Manage student admission
                  leads, enquiries and
                  follow-ups from a single
                  dashboard.

                </p>

              </div>

            </div>

          </div>

          {/* ==========================================================
              EXPORT BUTTON
          ========================================================== */}

          <div className="flex justify-end">

            <button
              type="button"
              className="btn btn-primary"
              onClick={exportExcel}
            >

              <Download size={18} />

              Export Excel

            </button>

          </div>

          {/* ==========================================================
              DASHBOARD STATS
          ========================================================== */}

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

            {/* TOTAL */}

            <div className="stats shadow bg-primary text-primary-content">

              <div className="stat">

                <div className="stat-figure">

                  <Users size={28} />

                </div>

                <div className="stat-title text-primary-content/80">

                  Total

                </div>

                <div className="stat-value">

                  {stats.total}

                </div>

              </div>

            </div>

            {/* PENDING */}

            <div className="stats shadow bg-warning text-warning-content">

              <div className="stat">

                <div className="stat-figure">

                  <Users size={28} />

                </div>

                <div className="stat-title text-warning-content/80">

                  Pending

                </div>

                <div className="stat-value">

                  {stats.pending}

                </div>

              </div>

            </div>

            {/* CONTACTED */}

            <div className="stats shadow bg-info text-info-content">

              <div className="stat">

                <div className="stat-figure">

                  <Mail size={28} />

                </div>

                <div className="stat-title text-info-content/80">

                  Contacted

                </div>

                <div className="stat-value">

                  {stats.contacted}

                </div>

              </div>

            </div>

            {/* CONVERTED */}

            <div className="stats shadow bg-success text-success-content">

              <div className="stat">

                <div className="stat-figure">

                  <Users size={28} />

                </div>

                <div className="stat-title text-success-content/80">

                  Converted

                </div>

                <div className="stat-value">

                  {stats.converted}

                </div>

              </div>

            </div>

          </div>

          {/* ==========================================================
              Continue in Part 5
          ========================================================== */}
                    {/* ==========================================================
              FILTERS
          ========================================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="grid lg:grid-cols-3 gap-4">

                {/* SEARCH */}

                <div className="relative">

                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50"
                  />

                  <input
                    type="text"
                    placeholder="Search by name, email or phone..."
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    className="input input-bordered w-full pl-12"
                  />

                </div>

                {/* COURSE FILTER */}

                <select
                  value={courseFilter}
                  onChange={(e) =>
                    setCourseFilter(
                      e.target.value
                    )
                  }
                  className="select select-bordered w-full"
                >

                  {courses.map(
                    (course) => (

                      <option
                        key={course}
                        value={course}
                      >

                        {course ||
                          "No Course"}

                      </option>

                    )
                  )}

                </select>

              </div>

            </div>

          </div>

          {/* ==========================================================
              TABLE
          ========================================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl overflow-hidden">

            {loading ? (

              <div className="flex justify-center items-center py-20">

                <span className="loading loading-spinner loading-lg text-primary" />

              </div>

            ) : filteredEnquiries.length === 0 ? (

              <div className="text-center py-20">

                <Users
                  size={64}
                  className="mx-auto opacity-40 mb-4"
                />

                <h2 className="text-3xl font-bold">

                  No Enquiries Found

                </h2>

                <p className="text-base-content/60 mt-2">

                  No admission enquiries
                  match the current filters.

                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="table">

                  <thead className="bg-base-200">

                    <tr>

                      <th>Name</th>

                      <th>Email</th>

                      <th>Phone</th>

                      <th>Course</th>

                      <th>Status</th>

                      <th>Message</th>

                      <th>Date</th>

                      <th>Reply</th>

                      <th>Delete</th>

                    </tr>

                  </thead>

                  <tbody>

                    {/* ==========================================================
                        Continue in Part 6
                    ========================================================== */}
                                        {filteredEnquiries.map(
                      (item) => (

                        <tr key={item._id}>

                          {/* NAME */}

                          <td className="font-semibold">

                            {item.fullName}

                          </td>

                          {/* EMAIL */}

                          <td>

                            {item.email}

                          </td>

                          {/* PHONE */}

                          <td>

                            {item.phone}

                          </td>

                          {/* COURSE */}

                          <td>

                            <div className="badge badge-primary badge-outline">

                              {item.course || "N/A"}

                            </div>

                          </td>

                          {/* STATUS */}

                          <td>

                            <div className="flex flex-col gap-2">

                              <div
                                className={`badge ${getStatusBadge(
                                  item.status
                                )}`}
                              >

                                {item.status}

                              </div>

                              <select
                                value={item.status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    item._id,
                                    e.target.value
                                  )
                                }
                                className="select select-bordered select-sm"
                              >

                                <option value="Pending">

                                  Pending

                                </option>

                                <option value="Contacted">

                                  Contacted

                                </option>

                                <option value="Converted">

                                  Converted

                                </option>

                              </select>

                            </div>

                          </td>

                          {/* MESSAGE */}

                          <td
                            className="
                              max-w-xs
                              truncate
                            "
                          >

                            {item.message ||
                              "No Message"}

                          </td>

                          {/* DATE */}

                          <td>

                            {new Date(
                              item.createdAt
                            ).toLocaleDateString()}

                          </td>

                          {/* REPLY */}

                          <td>

                            <button
                              type="button"
                              className="btn btn-sm btn-info"
                              onClick={() =>
                                handleReply(
                                  item.email,
                                  item.fullName
                                )
                              }
                            >

                              <Mail size={15} />

                            </button>

                          </td>

                          {/* DELETE */}

                          <td>

                            <button
                              type="button"
                              className="btn btn-sm btn-error"
                              onClick={() =>
                                setDeleteModal({
                                  isOpen: true,
                                  enquiry: item,
                                })
                              }
                            >

                              <Trash2 size={15} />

                            </button>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

          {/* ==========================================================
              Continue in Part 7
          ========================================================== */}
                    {/* ==========================================================
              STICKY FOOTER
          ========================================================== */}

          <div className="sticky bottom-4 z-50">

            <div className="card bg-base-100 border border-base-300 shadow-2xl">

              <div className="card-body py-4">

                <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                  {/* INFO */}

                  <div>

                    <h3 className="font-bold text-lg">

                      Admission Enquiry Dashboard

                    </h3>

                    <p className="text-sm text-base-content/60">

                      Monitor admission enquiries,
                      update enquiry status,
                      reply to students and
                      export reports.

                    </p>

                  </div>

                  {/* SUMMARY */}

                  <div className="flex flex-wrap gap-2">

                    <div className="badge badge-primary badge-lg">

                      Total:
                      {" "}
                      {stats.total}

                    </div>

                    <div className="badge badge-warning badge-lg">

                      Pending:
                      {" "}
                      {stats.pending}

                    </div>

                    <div className="badge badge-info badge-lg">

                      Contacted:
                      {" "}
                      {stats.contacted}

                    </div>

                    <div className="badge badge-success badge-lg">

                      Converted:
                      {" "}
                      {stats.converted}

                    </div>

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