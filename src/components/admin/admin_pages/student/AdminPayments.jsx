import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  Search,
  IndianRupee,
  CheckCircle,
  Clock3,
  XCircle,
  Download,
  RefreshCw,
  Trash2,
  Eye,
} from "lucide-react";

import api from "../../../../services/api";


import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";

/* ==========================================================
   COMPONENT
========================================================== */

export default function AdminPayments() {

  /* ==========================================================
     DATA
  ========================================================== */

  const [
    payments,
    setPayments,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  /* ==========================================================
     SEARCH & FILTER
  ========================================================== */

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [
    purposeFilter,
    setPurposeFilter,
  ] = useState("All");

  /* ==========================================================
     PAGINATION
  ========================================================== */

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    limit,
    setLimit,
  ] = useState(20);

  const [
    pagination,
    setPagination,
  ] = useState({});

  /* ==========================================================
     MODALS
  ========================================================== */

  const [
    selectedPayment,
    setSelectedPayment,
  ] = useState(null);

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
     FETCH PAYMENTS
  ========================================================== */

  const fetchPayments =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.get(
            "/payments/all",
            {
              params: {

                page,

                limit,

                search:
                  search || undefined,

                paymentStatus:
                  statusFilter !==
                  "All"
                    ? statusFilter
                    : undefined,

                paymentPurpose:
                  purposeFilter !==
                  "All"
                    ? purposeFilter
                    : undefined,

              },
            }
          );

        setPayments(

          res.data.data
            ?.payments || []

        );

        setPagination(

          res.data.data
            ?.pagination || {}

        );

      } catch (error) {

        setStatusModal({

          isOpen: true,

          type: "error",

          title:
            "Loading Failed",

          message:
            error.response?.data
              ?.message ||
            "Unable to load payment records.",

        });

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    fetchPayments();

  }, [

    page,

    limit,

    statusFilter,

    purposeFilter,

  ]);

  /* ==========================================================
     LOCAL SEARCH
  ========================================================== */

  const filteredPayments =
    useMemo(() => {

      if (!search)
        return payments;

      const keyword =
        search.toLowerCase();

      return payments.filter(
        (item) =>

          item.studentName
            ?.toLowerCase()
            .includes(keyword) ||

          item.studentId
            ?.toLowerCase()
            .includes(keyword) ||

          item.email
            ?.toLowerCase()
            .includes(keyword)

      );

    }, [

      payments,

      search,

    ]);

  /* ==========================================================
     DASHBOARD STATS
  ========================================================== */

  const stats =
    useMemo(() => {

      const success =
        payments.filter(
          (p) =>
            p.paymentStatus ===
            "Success"
        );

      return {

        revenue:
          success.reduce(
            (
              total,
              item
            ) =>
              total +
              item.amount,
            0
          ),

        success:
          success.length,

        pending:
          payments.filter(
            (p) =>
              p.paymentStatus ===
              "Pending"
          ).length,

        failed:
          payments.filter(
            (p) =>
              p.paymentStatus ===
              "Failed"
          ).length,

      };

    }, [payments]);


    /* ==========================================================
     DELETE PAYMENT
  ========================================================== */

  const handleDelete =
    (payment) => {

      setDeleteModal({

        isOpen: true,

        title:
          "Delete Payment",

        message: `Delete payment record of ${payment.studentName}?`,

        onConfirm:
          async () => {

            try {

              setDeleting(true);

              const res =
                await api.delete(

                  `/payments/${payment._id}`

                );

              setStatusModal({

                isOpen: true,

                type: "success",

                title:
                  "Deleted",

                message:
                  res.data.message,

              });

              fetchPayments();

            } catch (error) {

              setStatusModal({

                isOpen: true,

                type: "error",

                title:
                  "Delete Failed",

                message:
                  error.response?.data
                    ?.message ||
                  "Unable to delete payment.",

              });

            } finally {

              setDeleting(false);

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
     EXPORT CSV
  ========================================================== */

  const exportCSV =
    () => {

      const headers = [

        "Student Name",

        "Student ID",

        "Email",

        "Phone",

        "Stream",

        "Semester",

        "Purpose",

        "Amount",

        "Status",

        "Transaction ID",

        "Date",

      ];

      const rows =
        filteredPayments.map(

          (item) => [

            item.studentName,

            item.studentId,

            item.email,

            item.phone,

            item.stream,

            item.semester,

            item.paymentPurpose,

            item.amount,

            item.paymentStatus,

            item.transactionId || "",

            new Date(
              item.createdAt
            ).toLocaleDateString(
              "en-IN"
            ),

          ]

        );

      const csv = [

        headers,

        ...rows,

      ]
        .map((row) =>
          row.join(",")
        )
        .join("\n");

      const blob =
        new Blob(

          [csv],

          {

            type:
              "text/csv;charset=utf-8;",

          }

        );

      const url =
        URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      link.download =
        `payments_${Date.now()}.csv`;

      link.click();

      URL.revokeObjectURL(
        url
      );

    };

  /* ==========================================================
     RETURN
  ========================================================== */

  return (

    <>

      <LoadingModal
        isOpen={
          loading ||
          deleting
        }
        title={
          deleting
            ? "Deleting Payment"
            : "Loading Payments"
        }
        message={
          deleting
            ? "Please wait..."
            : "Fetching payment records..."
        }
      />

      <StatusModal
        isOpen={
          statusModal.isOpen
        }
        type={
          statusModal.type
        }
        title={
          statusModal.title
        }
        message={
          statusModal.message
        }
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
        title={
          deleteModal.title
        }
        message={
          deleteModal.message
        }
        onConfirm={
          deleteModal.onConfirm
        }
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
              HERO HEADER
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

                  Payment Management

                </h1>

                <p className="mt-4 max-w-3xl text-lg opacity-90">

                  Monitor transactions,
                  revenue,
                  payment history,
                  and student fee status
                  from one centralized ERP dashboard.

                </p>

              </div>

              <div className="flex gap-3">

                <button
                  onClick={fetchPayments}
                  className="btn btn-outline bg-base-100 text-base-content border-0"
                >

                  <RefreshCw size={18} />

                  Refresh

                </button>

                <button
                  onClick={exportCSV}
                  className="btn btn-primary"
                >

                  <Download size={18} />

                  Export CSV

                </button>

              </div>

            </div>

          </motion.div>

          
                    {/* ==========================================================
              DASHBOARD STATISTICS
          ========================================================== */}

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

            {/* REVENUE */}

            <motion.div
              whileHover={{
                scale: 1.03,
              }}
              className="card bg-base-100 shadow-xl border border-base-300"
            >
              <div className="card-body">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-base-content/70">

                      Total Revenue

                    </p>

                    <h2 className="text-4xl font-black text-primary mt-2">

                      ₹{stats.revenue.toLocaleString("en-IN")}

                    </h2>

                  </div>

                  <IndianRupee
                    size={46}
                    className="text-primary"
                  />

                </div>

              </div>
            </motion.div>

            {/* SUCCESS */}

            <motion.div
              whileHover={{
                scale: 1.03,
              }}
              className="card bg-base-100 shadow-xl border border-base-300"
            >
              <div className="card-body">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-base-content/70">

                      Successful

                    </p>

                    <h2 className="text-4xl font-black text-success mt-2">

                      {stats.success}

                    </h2>

                  </div>

                  <CheckCircle
                    size={46}
                    className="text-success"
                  />

                </div>

              </div>
            </motion.div>

            {/* PENDING */}

            <motion.div
              whileHover={{
                scale: 1.03,
              }}
              className="card bg-base-100 shadow-xl border border-base-300"
            >
              <div className="card-body">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-base-content/70">

                      Pending

                    </p>

                    <h2 className="text-4xl font-black text-warning mt-2">

                      {stats.pending}

                    </h2>

                  </div>

                  <Clock3
                    size={46}
                    className="text-warning"
                  />

                </div>

              </div>
            </motion.div>

            {/* FAILED */}

            <motion.div
              whileHover={{
                scale: 1.03,
              }}
              className="card bg-base-100 shadow-xl border border-base-300"
            >
              <div className="card-body">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-base-content/70">

                      Failed

                    </p>

                    <h2 className="text-4xl font-black text-error mt-2">

                      {stats.failed}

                    </h2>

                  </div>

                  <XCircle
                    size={46}
                    className="text-error"
                  />

                </div>

              </div>
            </motion.div>

          </div>

          {/* ==========================================================
              SEARCH & FILTER TOOLBAR
          ========================================================== */}

          <div className="card bg-base-100 shadow-xl border border-base-300">

            <div className="card-body">

              <div className="grid xl:grid-cols-[1fr_220px_240px_auto] gap-4">

                {/* SEARCH */}

                <label className="input input-bordered flex items-center gap-2">

                  <Search
                    size={18}
                    className="opacity-60"
                  />

                  <input
                    type="text"
                    className="grow"
                    placeholder="Search by Name / ID / Email..."
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                  />

                </label>

                {/* STATUS */}

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                  className="select select-bordered"
                >

                  <option>

                    All

                  </option>

                  <option>

                    Success

                  </option>

                  <option>

                    Pending

                  </option>

                  <option>

                    Failed

                  </option>

                </select>

                {/* PURPOSE */}

                <select
                  value={purposeFilter}
                  onChange={(e) =>
                    setPurposeFilter(
                      e.target.value
                    )
                  }
                  className="select select-bordered"
                >

                  <option>

                    All

                  </option>

                  {[

                    ...new Set(

                      payments.map(
                        (p) =>
                          p.paymentPurpose
                      )

                    ),

                  ].map(
                    (
                      purpose
                    ) => (

                      <option
                        key={
                          purpose
                        }
                      >

                        {purpose}

                      </option>

                    )
                  )}

                </select>

                {/* RECORD COUNT */}

                <div className="badge badge-primary badge-lg h-full px-5">

                  {filteredPayments.length}

                  &nbsp;Records

                </div>

              </div>

            </div>

          </div>

          
                    {/* ==========================================================
              PAYMENTS TABLE
          ========================================================== */}

          <div className="card bg-base-100 border border-base-300 shadow-xl">

            <div className="card-body">

              <div className="flex items-center justify-between mb-6">

                <h2 className="text-2xl font-black">

                  Payment Records

                </h2>

                <div className="badge badge-outline">

                  {filteredPayments.length} Records

                </div>

              </div>

              {/* ==========================================================
                  EMPTY STATE
              ========================================================== */}

              {filteredPayments.length === 0 ? (

                <div className="py-20 text-center">

                  <IndianRupee
                    size={70}
                    className="mx-auto opacity-20 mb-5"
                  />

                  <h3 className="text-2xl font-bold">

                    No Payments Found

                  </h3>

                  <p className="text-base-content/60 mt-2">

                    No payment records match the current filters.

                  </p>

                </div>

              ) : (

                <div className="overflow-x-auto">

                  <table className="table table-zebra">

                    <thead>

                      <tr>

                        <th>Student</th>

                        <th>Purpose</th>

                        <th>Amount</th>

                        <th>Status</th>

                        <th>Transaction</th>

                        <th>Date</th>

                        <th className="text-right">

                          Actions

                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {filteredPayments.map(

                        (payment) => (

                          <motion.tr
                            key={payment._id}
                            initial={{
                              opacity: 0,
                            }}
                            animate={{
                              opacity: 1,
                            }}
                          >

                            {/* STUDENT */}

                            <td>

                              <div>

                                <div className="font-bold">

                                  {payment.studentName}

                                </div>

                                <div className="text-xs opacity-60">

                                  {payment.studentId}

                                </div>

                                <div className="text-xs opacity-60">

                                  {payment.email}

                                </div>

                              </div>

                            </td>

                            {/* PURPOSE */}

                            <td>

                              <div>

                                <div>

                                  {payment.paymentPurpose}

                                </div>

                                <div className="text-xs opacity-60">

                                  {payment.stream}

                                  {" • "}

                                  Semester {payment.semester}

                                </div>

                              </div>

                            </td>

                            {/* AMOUNT */}

                            <td>

                              <span className="font-black text-primary">

                                ₹

                                {payment.amount.toLocaleString(
                                  "en-IN"
                                )}

                              </span>

                            </td>

                            {/* STATUS */}

                            <td>

                              <span
                                className={`badge ${
                                  payment.paymentStatus ===
                                  "Success"

                                    ? "badge-success"

                                    : payment.paymentStatus ===
                                      "Pending"

                                    ? "badge-warning"

                                    : "badge-error"
                                }`}
                              >

                                {

                                  payment.paymentStatus

                                }

                              </span>

                            </td>

                            {/* TRANSACTION */}

                            <td>

                              {payment.transactionId ? (

                                <code className="text-xs bg-base-200 rounded px-2 py-1">

                                  {

                                    payment.transactionId

                                  }

                                </code>

                              ) : (

                                <span className="badge badge-error">

                                  Not Paid

                                </span>

                              )}

                            </td>

                            {/* DATE */}

                            <td>

                              {new Date(

                                payment.createdAt

                              ).toLocaleDateString(

                                "en-IN"

                              )}

                            </td>

                            {/* ACTIONS */}

                            <td>

                              <div className="flex justify-end gap-2">

                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedPayment(
                                      payment
                                    )
                                  }
                                  className="btn btn-info btn-sm"
                                >

                                  <Eye size={16} />

                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDelete(
                                      payment
                                    )
                                  }
                                  className="btn btn-error btn-sm"
                                >

                                  <Trash2 size={16} />

                                </button>

                              </div>

                            </td>

                          </motion.tr>

                        )

                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          </div>

          {/* ==========================================================
              PAGINATION
          ========================================================== */}

          {pagination.totalPages > 1 && (

            <div className="flex justify-center mt-8">

              <div className="join">

                <button
                  className="join-item btn"
                  disabled={page === 1}
                  onClick={() =>
                    setPage(
                      (prev) =>
                        prev - 1
                    )
                  }
                >

                  Previous

                </button>

                <button className="join-item btn btn-active">

                  {pagination.page}

                  {" / "}

                  {pagination.totalPages}

                </button>

                <button
                  className="join-item btn"
                  disabled={
                    page ===
                    pagination.totalPages
                  }
                  onClick={() =>
                    setPage(
                      (prev) =>
                        prev + 1
                    )
                  }
                >

                  Next

                </button>

              </div>

            </div>

          )}

          
                    {/* ==========================================================
              PAYMENT DETAILS MODAL
          ========================================================== */}

          <dialog
            className={`modal ${
              selectedPayment
                ? "modal-open"
                : ""
            }`}
          >

            <div className="modal-box max-w-4xl">

              <div className="flex items-center justify-between mb-6">

                <h3 className="text-2xl font-black">

                  Payment Details

                </h3>

                <button
                  className="btn btn-circle btn-sm"
                  onClick={() =>
                    setSelectedPayment(
                      null
                    )
                  }
                >

                  ✕

                </button>

              </div>

              {selectedPayment && (

                <div className="space-y-6">

                  {/* ==========================================
                      STATUS SUMMARY
                  ========================================== */}

                  <div className="stats stats-vertical lg:stats-horizontal shadow w-full">

                    <div className="stat">

                      <div className="stat-title">

                        Amount

                      </div>

                      <div className="stat-value text-primary text-3xl">

                        ₹

                        {selectedPayment.amount.toLocaleString(
                          "en-IN"
                        )}

                      </div>

                    </div>

                    <div className="stat">

                      <div className="stat-title">

                        Status

                      </div>

                      <div className="stat-value text-lg">

                        <span
                          className={`badge badge-lg ${
                            selectedPayment.paymentStatus ===
                            "Success"

                              ? "badge-success"

                              : selectedPayment.paymentStatus ===
                                "Pending"

                              ? "badge-warning"

                              : "badge-error"
                          }`}
                        >

                          {

                            selectedPayment.paymentStatus

                          }

                        </span>

                      </div>

                    </div>

                    <div className="stat">

                      <div className="stat-title">

                        Purpose

                      </div>

                      <div className="stat-value text-lg">

                        {

                          selectedPayment.paymentPurpose

                        }

                      </div>

                    </div>

                  </div>

                  {/* ==========================================
                      STUDENT INFORMATION
                  ========================================== */}

                  <div className="card bg-base-200">

                    <div className="card-body">

                      <h4 className="font-black text-lg mb-4">

                        Student Information

                      </h4>

                      <div className="grid md:grid-cols-2 gap-5">

                        <div>

                          <p className="text-sm opacity-60">

                            Student Name

                          </p>

                          <p className="font-semibold">

                            {

                              selectedPayment.studentName

                            }

                          </p>

                        </div>

                        <div>

                          <p className="text-sm opacity-60">

                            Student ID

                          </p>

                          <p className="font-semibold">

                            {

                              selectedPayment.studentId

                            }

                          </p>

                        </div>

                        <div>

                          <p className="text-sm opacity-60">

                            Email

                          </p>

                          <p className="font-semibold">

                            {

                              selectedPayment.email

                            }

                          </p>

                        </div>

                        <div>

                          <p className="text-sm opacity-60">

                            Phone

                          </p>

                          <p className="font-semibold">

                            {

                              selectedPayment.phone

                            }

                          </p>

                        </div>

                        <div>

                          <p className="text-sm opacity-60">

                            Stream

                          </p>

                          <p className="font-semibold">

                            {

                              selectedPayment.stream

                            }

                          </p>

                        </div>

                        <div>

                          <p className="text-sm opacity-60">

                            Semester

                          </p>

                          <p className="font-semibold">

                            {

                              selectedPayment.semester

                            }

                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* ==========================================
                      TRANSACTION INFORMATION
                  ========================================== */}

                  <div className="card bg-base-200">

                    <div className="card-body">

                      <h4 className="font-black text-lg mb-4">

                        Transaction Information

                      </h4>

                      <div className="grid md:grid-cols-2 gap-5">

                        <div>

                          <p className="text-sm opacity-60">

                            Razorpay Order ID

                          </p>

                          <code className="text-xs">

                            {

                              selectedPayment.razorpayOrderId ||
                              "-"

                            }

                          </code>

                        </div>

                        <div>

                          <p className="text-sm opacity-60">

                            Transaction ID

                          </p>

                          <code className="text-xs">

                            {

                              selectedPayment.transactionId ||
                              "-"

                            }

                          </code>

                        </div>

                        <div>

                          <p className="text-sm opacity-60">

                            Receipt Number

                          </p>

                          <code className="text-xs">

                            {

                              selectedPayment.receiptNumber ||
                              "-"

                            }

                          </code>

                        </div>

                        <div>

                          <p className="text-sm opacity-60">

                            Payment Method

                          </p>

                          <p>

                            {

                              selectedPayment.paymentMethod ||
                              "-"

                            }

                          </p>

                        </div>

                        <div>

                          <p className="text-sm opacity-60">

                            Created On

                          </p>

                          <p>

                            {new Date(
                              selectedPayment.createdAt
                            ).toLocaleString(
                              "en-IN"
                            )}

                          </p>

                        </div>

                        <div>

                          <p className="text-sm opacity-60">

                            Updated On

                          </p>

                          <p>

                            {new Date(
                              selectedPayment.updatedAt
                            ).toLocaleString(
                              "en-IN"
                            )}

                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                  <div className="modal-action">

                    <button
                      className="btn"
                      onClick={() =>
                        setSelectedPayment(
                          null
                        )
                      }
                    >

                      Close

                    </button>

                  </div>

                </div>

              )}

            </div>

          </dialog>

      
                    {/* ==========================================================
              STICKY FOOTER
          ========================================================== */}

          <div className="sticky bottom-4 z-30">

            <div className="card bg-base-100 border border-base-300 shadow-2xl">

              <div className="card-body py-4">

                {/* ==========================================
                    ACTION BUTTONS
                ========================================== */}

                <div className="flex flex-wrap justify-end gap-3">

                  <button
                    type="button"
                    onClick={fetchPayments}
                    disabled={loading}
                    className="btn btn-outline"
                  >

                    <RefreshCw size={18} />

                    Refresh

                  </button>

                  <button
                    type="button"
                    onClick={exportCSV}
                    className="btn btn-secondary"
                  >

                    <Download size={18} />

                    Export CSV

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </motion.div>

    </>

  );

}