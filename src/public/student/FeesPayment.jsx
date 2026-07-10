import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

import {
  User,
  Mail,
  Phone,
  GraduationCap,
  IndianRupee,
  CreditCard,
  BookOpen,
  ShieldCheck,
  Download,
  CheckCircle2,
} from "lucide-react";

export default function FeesPayment() {
  const [loading, setLoading] = useState(false);
  const [paidReceipt, setPaidReceipt] = useState(null); // holds the payment record once verified

  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    phone: "",
    studentId: "",
    stream: "",
    semester: "",
    paymentPurpose: "",
    amount: "",
  });

  // =====================================
  // AUTO FETCH STUDENT
  // =====================================

  useEffect(() => {
    const fetchStudentData = async () => {
      if (formData.studentId.length < 3) return;

      try {
        const { data } = await api.get(
          `/payments/student/${formData.studentId}`
        );

        if (data.success) {
          const student = data.data.student;

          setFormData((prev) => ({
            ...prev,
            studentName: student.studentName || "",
            email: student.email || "",
            phone: student.phone || "",
            stream: student.stream || "",
            semester: student.semester || "",
          }));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchStudentData();
  }, [formData.studentId]);

  // =====================================
  // HANDLE CHANGE
  // =====================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Once the user edits the form again, hide the old receipt so it
    // doesn't get confused with the new (unpaid) draft.
    if (paidReceipt) setPaidReceipt(null);
  };

  // =====================================
  // RECEIPT PDF GENERATION
  // =====================================

  const generateReceiptPDF = (payment) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 48;
    let y = 60;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59);
    doc.text("TIH ERP", marginX, y);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("Fee Payment Receipt", marginX, y + 18);

    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, y + 32, pageWidth - marginX, y + 32);

    y += 60;

    // Status badge
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 163, 74);
    doc.text("PAYMENT SUCCESSFUL", marginX, y);
    y += 28;

    const rows = [
      ["Receipt No.", payment.receiptNumber || "-"],
      ["Transaction ID", payment.transactionId || payment.razorpayPaymentId || "-"],
      ["Order ID", payment.razorpayOrderId || "-"],
      [
        "Date",
        new Date(payment.updatedAt || payment.createdAt || Date.now()).toLocaleString(
          "en-IN",
          { dateStyle: "medium", timeStyle: "short" }
        ),
      ],
      ["Student Name", payment.studentName || "-"],
      ["Student ID", payment.studentId || "-"],
      ["Email", payment.email || "-"],
      ["Phone", payment.phone || "-"],
      ["Stream", payment.stream || "-"],
      ["Semester", String(payment.semester ?? "-")],
      ["Payment Purpose", payment.paymentPurpose || "-"],
      ["Payment Method", payment.paymentMethod || "Razorpay"],
      ["Status", payment.paymentStatus || "Success"],
    ];

    doc.setFontSize(11);

    rows.forEach(([label, value], i) => {
      const rowY = y + i * 24;

      if (i % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(marginX, rowY - 14, pageWidth - marginX * 2, 22, "F");
      }

      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text(label, marginX + 8, rowY);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(String(value), pageWidth - marginX - 8, rowY, { align: "right" });
    });

    const amountY = y + rows.length * 24 + 24;

    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, amountY - 20, pageWidth - marginX, amountY - 20);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Total Amount Paid", marginX, amountY);

    doc.setTextColor(37, 99, 235);
    doc.text(
      `Rs. ${Number(payment.amount || 0).toLocaleString("en-IN")}`,
      pageWidth - marginX,
      amountY,
      { align: "right" }
    );

    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(148, 163, 184);
    doc.text(
      "This is a computer-generated receipt and does not require a signature.",
      marginX,
      amountY + 40
    );

    doc.save(`Receipt_${payment.receiptNumber || payment.razorpayOrderId || "TIH"}.pdf`);
  };

  // =====================================
  // RAZORPAY PAYMENT
  // =====================================

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setPaidReceipt(null);

      const { data: orderData } = await api.post(
        "/payments/create-order",
        formData
      );

      const { order, key, payment } = orderData.data;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "TIH ERP",
        description: formData.paymentPurpose,
        order_id: order.id,

        handler: async function (response) {
          try {
            const { data: verifyData } = await api.post(
              "/payments/verify-payment",
              response
            );

            if (verifyData.success) {
              alert("Payment Successful");
              const paidRecord = verifyData.data;
              setPaidReceipt(paidRecord);
              generateReceiptPDF(paidRecord);
            } else {
              alert("Payment Verification Failed");
            }
          } catch (error) {
            console.log(error);
            alert("Payment verification failed. Please contact support.");
          }
        },

        prefill: {
          name: formData.studentName,
          email: formData.email,
          contact: formData.phone,
        },

        theme: {
          color: "#3b82f6",
        },
      };

      const razor = new window.Razorpay(options);

      razor.open();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="min-h-screen bg-base-200 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* HERO */}

          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero bg-base-100 rounded-box shadow-xl border border-base-300 mb-8"
          >
            <div className="hero-content text-center py-12">
              <div>
                <div className="badge badge-primary badge-lg mb-4">
                  Student Finance Portal
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-base-content">
                  Fees Payment Portal
                </h1>

                <p className="text-base-content/70 mt-4 max-w-2xl">
                  Securely pay tuition fees, semester fees,
                  examination fees, hostel fees and other
                  academic charges through Razorpay.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* FORM */}

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="card bg-base-100 shadow-xl border border-base-300">
                <div className="card-body">
                  <h2 className="card-title text-3xl font-black">
                    Student Payment Details
                  </h2>

                  <form
                    onSubmit={handlePayment}
                    className="mt-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* STUDENT ID */}

                      <InputField
                        icon={<GraduationCap size={18} />}
                        label="Student ID"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        placeholder="Enter Student ID"
                        required
                      />

                      {/* NAME */}

                      <InputField
                        icon={<User size={18} />}
                        label="Full Name"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        placeholder="Student Name"
                        required
                      />

                      {/* EMAIL */}

                      <InputField
                        icon={<Mail size={18} />}
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter Email"
                        required
                      />

                      {/* PHONE */}

                      <InputField
                        icon={<Phone size={18} />}
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter Phone Number"
                        required
                      />

                      {/* STREAM */}

                      <div className="form-control">
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

                          <option>BCA</option>
                          <option>BBA</option>
                          <option>MCA</option>
                        </select>
                      </div>

                      {/* SEMESTER */}

                      <div className="form-control">
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

                          {[1, 2, 3, 4, 5, 6].map(
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
                      </div>

                      {/* PURPOSE */}

                      <InputField
                        icon={<BookOpen size={18} />}
                        label="Payment Purpose"
                        name="paymentPurpose"
                        value={formData.paymentPurpose}
                        onChange={handleChange}
                        placeholder="Tuition Fees / Hostel Fees"
                        required
                        className="md:col-span-2"
                      />

                      {/* AMOUNT */}

                      <InputField
                        icon={<IndianRupee size={18} />}
                        label="Amount"
                        name="amount"
                        type="number"
                        min="1"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="Enter Amount"
                        required
                        className="md:col-span-2"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary btn-lg w-full mt-8"
                    >
                      {loading ? (
                        <>
                          <span className="loading loading-spinner"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard size={20} />
                          Pay Now
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>

            {/* SUMMARY */}

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="card bg-base-100 shadow-xl border border-base-300 sticky top-24">
                <div className="card-body">
                  <h2 className="card-title text-2xl">
                    Payment Summary
                  </h2>

                  <div className="divider"></div>

                  <div className="space-y-4">
                    <SummaryRow
                      label="Student"
                      value={
                        formData.studentName ||
                        "Not Available"
                      }
                    />

                    <SummaryRow
                      label="Stream"
                      value={
                        formData.stream ||
                        "Not Selected"
                      }
                    />

                    <SummaryRow
                      label="Semester"
                      value={
                        formData.semester ||
                        "Not Selected"
                      }
                    />

                    <SummaryRow
                      label="Purpose"
                      value={
                        formData.paymentPurpose ||
                        "Not Specified"
                      }
                    />
                  </div>

                  <div className="divider"></div>

                  <div className="stat bg-base-200 rounded-box">
                    <div className="stat-title">
                      Total Amount
                    </div>

                    <div className="stat-value text-primary">
                      ₹ {formData.amount || 0}
                    </div>
                  </div>

                  {paidReceipt ? (
                    <div className="alert alert-success mt-4 flex-col items-stretch gap-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} />
                        <span className="font-semibold">
                          Payment confirmed — receipt no. {paidReceipt.receiptNumber}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => generateReceiptPDF(paidReceipt)}
                        className="btn btn-sm btn-outline w-full"
                      >
                        <Download size={16} />
                        Download Receipt Again
                      </button>
                    </div>
                  ) : (
                    <div className="alert alert-success mt-4">
                      <ShieldCheck size={18} />
                      <span>
                        100% Secure Razorpay Payment
                      </span>
                    </div>
                  )}

                  <div className="alert alert-info">
                    <span>
                      Auto student lookup enabled using
                      Student ID.
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

/* =======================================
   INPUT FIELD
======================================= */

function InputField({
  icon,
  label,
  className = "",
  ...props
}) {
  return (
    <div className={`form-control ${className}`}>
      <label className="label">
        <span className="label-text font-semibold">
          {label}
        </span>
      </label>

      <label className="input input-bordered flex items-center gap-3 w-full">
        <span className="opacity-60">
          {icon}
        </span>

        <input
          {...props}
          className="grow"
        />
      </label>
    </div>
  );
}

/* =======================================
   SUMMARY ROW
======================================= */

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-base-content/70">
        {label}
      </span>

      <span className="font-semibold text-right">
        {value}
      </span>
    </div>
  );
}