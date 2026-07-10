import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaClock,
  FaCheckCircle,
  FaTrash,
  FaEye,
  FaSearch,
  FaInbox,
} from "react-icons/fa";

import api from "../../../../services/api";


import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";

import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  TITLES,
} from "../../../../utils/uploadMessages";

export default function ContactEnquiryControl() {
  /* ==========================================================
      STATES
  ========================================================== */

  const [enquiries, setEnquiries] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedEnquiry, setSelectedEnquiry] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  /* ==========================================================
      STATUS MODAL
  ========================================================== */

  const [statusModal, setStatusModal] =
    useState({
      isOpen: false,
      type: "info",
      title: "",
      message: "",
    });

  /* ==========================================================
      DELETE MODAL
  ========================================================== */

  const [deleteModal, setDeleteModal] =
    useState({
      isOpen: false,
      id: null,
      itemName: "",
    });

  /* ==========================================================
      FETCH ENQUIRIES
  ========================================================== */

  const fetchEnquiries = async () => {
    try {
      setLoading(true);

      const { data } =
        await api.get("/contact");

      setEnquiries(
        data.data?.enquiries || []
      );
    } catch (error) {
      setStatusModal({
        isOpen: true,
        type: "error",
        title: TITLES.ERROR,
        message:
          error.response?.data?.message ||
          ERROR_MESSAGES.LOAD,
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

  const confirmDelete = async () => {
    try {
      await api.delete(
        `/contact/${deleteModal.id}`
      );

      setDeleteModal({
        isOpen: false,
        id: null,
        itemName: "",
      });

      setStatusModal({
        isOpen: true,
        type: "success",
        title: TITLES.SUCCESS,
        message:
          SUCCESS_MESSAGES.DELETE,
      });

      fetchEnquiries();
    } catch (error) {
      setDeleteModal({
        isOpen: false,
        id: null,
        itemName: "",
      });

      setStatusModal({
        isOpen: true,
        type: "error",
        title: TITLES.ERROR,
        message:
          error.response?.data?.message ||
          ERROR_MESSAGES.DELETE,
      });
    }
  };

  /* ==========================================================
      RESOLVE ENQUIRY
  ========================================================== */

  const handleResolve = async (id) => {
    try {
      await api.patch(
        `/contact/${id}/status`,
        {
          status: "Resolved",
        }
      );

      setStatusModal({
        isOpen: true,
        type: "success",
        title: TITLES.SUCCESS,
        message:
          "Enquiry marked as resolved.",
      });

      fetchEnquiries();
    } catch (error) {
      setStatusModal({
        isOpen: true,
        type: "error",
        title: TITLES.ERROR,
        message:
          error.response?.data?.message ||
          ERROR_MESSAGES.SAVE,
      });
    }
  };

  /* ==========================================================
      SEARCH FILTER
  ========================================================== */

  const filteredEnquiries =
    useMemo(() => {
      return enquiries.filter((item) => {
        const keyword =
          searchTerm.toLowerCase();

        return (
          item.fullName
            ?.toLowerCase()
            .includes(keyword) ||
          item.email
            ?.toLowerCase()
            .includes(keyword) ||
          item.queryType
            ?.toLowerCase()
            .includes(keyword)
        );
      });
    }, [searchTerm, enquiries]);

  /* ==========================================================
      DASHBOARD STATS
  ========================================================== */

  const totalEnquiries =
    enquiries.length;

  const pendingCount =
    enquiries.filter(
      (item) =>
        item.status === "Pending"
    ).length;

  const resolvedCount =
    enquiries.filter(
      (item) =>
        item.status === "Resolved"
    ).length;

  const resolutionRate =
    totalEnquiries > 0
      ? Math.round(
          (resolvedCount /
            totalEnquiries) *
            100
        )
      : 0;

  /* ==========================================================
      JSX
  ========================================================== */

  return (
    <>
      {/* ===========================
          LOADING MODAL
      ============================ */}

      <LoadingModal
        isOpen={loading}
        title="Loading Dashboard"
        message="Fetching enquiries..."
      />

      {/* ===========================
          STATUS MODAL
      ============================ */}

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

      {/* ===========================
          DELETE MODAL
      ============================ */}

      <DeleteModal
        isOpen={deleteModal.isOpen}
        itemName={deleteModal.itemName}
        onCancel={() =>
          setDeleteModal({
            isOpen: false,
            id: null,
            itemName: "",
          })
        }
        onConfirm={confirmDelete}
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
          duration: 0.4,
        }}
        className="min-h-screen bg-base-200 p-6"
      >
        <div className="max-w-7xl mx-auto">

          {/* ==========================================================
              HERO HEADER
          ========================================================== */}

          <div className="hero bg-linear-to-r from-primary to-secondary rounded-3xl shadow-2xl mb-8">

            <div className="hero-content text-center text-primary-content py-12">

              <div>

                <h1 className="text-5xl font-bold">
                  Contact Enquiry Dashboard
                </h1>

                <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
                  Monitor, manage and respond to
                  enquiries submitted through the
                  website.
                </p>

              </div>

            </div>

          </div>

          {/* ==========================================================
              STATS SECTION
              (Continue in Part 2)
          ========================================================== */}
                    {/* ==========================================================
              STATS SECTION
          ========================================================== */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

            {/* TOTAL */}

            <motion.div
              whileHover={{ y: -5 }}
              className="card bg-base-100 border border-base-300 shadow-xl"
            >
              <div className="card-body">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-base-content/70">
                      Total Enquiries
                    </p>

                    <h2 className="text-4xl font-bold text-primary">

                      {totalEnquiries}

                    </h2>

                  </div>

                  <FaEnvelope className="text-5xl text-primary opacity-80" />

                </div>

              </div>
            </motion.div>

            {/* PENDING */}

            <motion.div
              whileHover={{ y: -5 }}
              className="card bg-base-100 border border-base-300 shadow-xl"
            >
              <div className="card-body">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-base-content/70">

                      Pending

                    </p>

                    <h2 className="text-4xl font-bold text-warning">

                      {pendingCount}

                    </h2>

                  </div>

                  <FaClock className="text-5xl text-warning opacity-80" />

                </div>

              </div>
            </motion.div>

            {/* RESOLVED */}

            <motion.div
              whileHover={{ y: -5 }}
              className="card bg-base-100 border border-base-300 shadow-xl"
            >
              <div className="card-body">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-base-content/70">

                      Resolved

                    </p>

                    <h2 className="text-4xl font-bold text-success">

                      {resolvedCount}

                    </h2>

                  </div>

                  <FaCheckCircle className="text-5xl text-success opacity-80" />

                </div>

              </div>
            </motion.div>

            {/* RESOLUTION RATE */}

            <motion.div
              whileHover={{ y: -5 }}
              className="card bg-base-100 border border-base-300 shadow-xl"
            >
              <div className="card-body">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-base-content/70">

                      Resolution Rate

                    </p>

                    <h2 className="text-4xl font-bold text-secondary">

                      {resolutionRate}%

                    </h2>

                  </div>

                  <FaInbox className="text-5xl text-secondary opacity-80" />

                </div>

              </div>
            </motion.div>

          </div>

          {/* ==========================================================
              SEARCH PANEL
          ========================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="card bg-base-100 border border-base-300 shadow-xl mb-8"
          >

            <div className="card-body">

              <div className="flex flex-col lg:flex-row gap-4 lg:justify-between lg:items-center">

                <div>

                  <h2 className="text-2xl font-bold">

                    Manage Enquiries

                  </h2>

                  <p className="text-base-content/70">

                    Search, review and manage all contact enquiries.

                  </p>

                </div>

                <label className="input input-bordered flex items-center gap-3 w-full lg:w-105">

                  <FaSearch className="text-primary" />

                  <input
                    type="text"
                    className="grow"
                    placeholder="Search by name, email or query type..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                  />

                </label>

              </div>

            </div>

          </motion.div>

          {/* ==========================================================
              DESKTOP TABLE
          ========================================================== */}

          <div className="hidden lg:block">

            <div className="card bg-base-100 border border-base-300 shadow-xl">

              <div className="card-body p-0 overflow-x-auto">

                {filteredEnquiries.length === 0 ? (

                  <div className="flex flex-col items-center justify-center py-20 gap-4">

                    <FaInbox className="text-6xl text-base-content/30" />

                    <h3 className="text-2xl font-bold">

                      No Enquiries Found

                    </h3>

                    <p className="text-base-content/60">

                      Try changing your search keyword.

                    </p>

                  </div>

                ) : (

                  <table className="table table-zebra">

                    <thead>

                      <tr className="bg-base-200">

                        <th>Name</th>

                        <th>Email</th>

                        <th>Query Type</th>

                        <th>Status</th>

                        <th>Date</th>

                        <th className="text-center">

                          Actions

                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {filteredEnquiries.map(
                        (item) => (

                          <tr key={item._id}>

                            <td>

                              <div className="font-semibold">

                                {item.fullName}

                              </div>

                            </td>

                            <td>

                              {item.email}

                            </td>

                            <td>

                              <span className="badge badge-outline">

                                {item.queryType}

                              </span>

                            </td>

                            <td>

                              {item.status ===
                              "Resolved" ? (

                                <span className="badge badge-success gap-2">

                                  <FaCheckCircle />

                                  Resolved

                                </span>

                              ) : (

                                <span className="badge badge-warning gap-2">

                                  <FaClock />

                                  Pending

                                </span>

                              )}

                            </td>

                            <td>

                              {new Date(
                                item.createdAt
                              ).toLocaleDateString()}

                            </td>

                            <td>

                              <div className="flex justify-center gap-2">

                                {/* VIEW */}

                                <button
                                  className="btn btn-info btn-sm"
                                  onClick={() =>
                                    setSelectedEnquiry(
                                      item
                                    )
                                  }
                                >
                                  <FaEye />
                                </button>

                                {/* RESOLVE */}

                                {item.status ===
                                  "Pending" && (

                                  <button
                                    className="btn btn-success btn-sm"
                                    onClick={() =>
                                      handleResolve(
                                        item._id
                                      )
                                    }
                                  >
                                    Resolve
                                  </button>

                                )}

                                {/* DELETE */}

                                <button
                                  className="btn btn-error btn-sm"
                                  onClick={() =>
                                    setDeleteModal({
                                      isOpen: true,
                                      id: item._id,
                                      itemName:
                                        item.fullName,
                                    })
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

                )}

              </div>

            </div>

          </div>

          {/* ==========================================================
              MOBILE CARDS
              (Continue in Part 3)
          ========================================================== */}
                    {/* ==========================================================
              MOBILE CARDS
          ========================================================== */}

          <div className="grid lg:hidden gap-4">

            {filteredEnquiries.length === 0 ? (

              <div className="card bg-base-100 border border-base-300 shadow-xl">

                <div className="card-body text-center py-10">

                  <FaInbox className="mx-auto text-5xl text-base-content/30 mb-4" />

                  <h3 className="text-xl font-bold">

                    No Enquiries Found

                  </h3>

                  <p className="text-base-content/60">

                    Try changing your search keyword.

                  </p>

                </div>

              </div>

            ) : (

              filteredEnquiries.map((item) => (

                <motion.div
                  key={item._id}
                  whileHover={{ y: -3 }}
                  className="card bg-base-100 border border-base-300 shadow-xl"
                >

                  <div className="card-body">

                    <div className="flex justify-between items-start">

                      <div>

                        <h3 className="font-bold text-lg">

                          {item.fullName}

                        </h3>

                        <p className="text-sm text-base-content/70">

                          {item.email}

                        </p>

                      </div>

                      <span
                        className={`badge ${
                          item.status === "Resolved"
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        {item.status}
                      </span>

                    </div>

                    <div className="divider my-2"></div>

                    <p>

                      <strong>Type:</strong>{" "}

                      {item.queryType}

                    </p>

                    <p>

                      <strong>Date:</strong>{" "}

                      {new Date(
                        item.createdAt
                      ).toLocaleDateString()}

                    </p>

                    <div className="flex flex-wrap gap-2 mt-5">

                      <button
                        className="btn btn-info btn-sm"
                        onClick={() =>
                          setSelectedEnquiry(item)
                        }
                      >
                        <FaEye />
                      </button>

                      {item.status === "Pending" && (

                        <button
                          className="btn btn-success btn-sm"
                          onClick={() =>
                            handleResolve(item._id)
                          }
                        >
                          Resolve
                        </button>

                      )}

                      <button
                        className="btn btn-error btn-sm"
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            id: item._id,
                            itemName: item.fullName,
                          })
                        }
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </div>

                </motion.div>

              ))

            )}

          </div>

          {/* ==========================================================
              ENQUIRY DETAILS MODAL
          ========================================================== */}

          {selectedEnquiry && (

            <dialog className="modal modal-open">

              <div className="modal-box max-w-3xl">

                <div className="flex justify-between items-center mb-6">

                  <h3 className="text-3xl font-bold">

                    Enquiry Details

                  </h3>

                  <span
                    className={`badge badge-lg ${
                      selectedEnquiry.status ===
                      "Resolved"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {selectedEnquiry.status}
                  </span>

                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">

                  <div className="card bg-base-200">

                    <div className="card-body">

                      <h4 className="font-bold text-lg">

                        Contact Information

                      </h4>

                      <div className="space-y-3">

                        <p>

                          <strong>Name:</strong>{" "}

                          {selectedEnquiry.fullName}

                        </p>

                        <p>

                          <strong>Email:</strong>{" "}

                          {selectedEnquiry.email}

                        </p>

                        <p>

                          <strong>Phone:</strong>{" "}

                          {selectedEnquiry.phone}

                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="card bg-base-200">

                    <div className="card-body">

                      <h4 className="font-bold text-lg">

                        Enquiry Information

                      </h4>

                      <div className="space-y-3">

                        <p>

                          <strong>Query:</strong>{" "}

                          {selectedEnquiry.queryType}

                        </p>

                        <p>

                          <strong>Status:</strong>{" "}

                          {selectedEnquiry.status}

                        </p>

                        <p>

                          <strong>Submitted:</strong>{" "}

                          {new Date(
                            selectedEnquiry.createdAt
                          ).toLocaleString()}

                        </p>

                      </div>

                    </div>

                  </div>

                </div>

                <div className="card bg-base-200">

                  <div className="card-body">

                    <h4 className="font-bold text-lg mb-3">

                      Message

                    </h4>

                    <div className="bg-base-100 border border-base-300 rounded-xl p-5 whitespace-pre-wrap leading-relaxed">

                      {selectedEnquiry.message}

                    </div>

                  </div>

                </div>

                <div className="modal-action">

                  {selectedEnquiry.status ===
                    "Pending" && (

                    <button
                      className="btn btn-success"
                      onClick={async () => {

                        await handleResolve(
                          selectedEnquiry._id
                        );

                        setSelectedEnquiry(null);

                      }}
                    >
                      Mark Resolved
                    </button>

                  )}

                  <button
                    className="btn btn-outline"
                    onClick={() =>
                      setSelectedEnquiry(null)
                    }
                  >
                    Close
                  </button>

                </div>

              </div>

            </dialog>

          )}

          {/* ==========================================================
              DASHBOARD FOOTER
          ========================================================== */}

          <div className="sticky bottom-0 mt-8">

            <div className="card bg-base-100 border border-base-300 shadow-xl">

              <div className="card-body">

                <div className="flex flex-col md:flex-row justify-between items-center gap-5">

                  <div>

                    <h3 className="font-bold text-lg">

                      Dashboard Summary

                    </h3>

                    <p className="text-base-content/70">

                      Showing{" "}

                      <span className="font-semibold text-primary">

                        {filteredEnquiries.length}

                      </span>{" "}

                      enquiries

                    </p>

                  </div>

                  <div className="flex gap-3">

                    <button
                      className="btn btn-primary"
                      onClick={fetchEnquiries}
                    >
                      Refresh
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

      </motion.div>

    </>

  );

}