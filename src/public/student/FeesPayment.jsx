import { useEffect, useRef, useState, Fragment } from "react";
import api from "../../services/api";
import { motion, AnimatePresence, useReducedMotion, animate } from "framer-motion";
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
  Check,
  Sparkles,
} from "lucide-react";

/* =======================================
   MOTION VARIANTS
   Orchestrated once, reused everywhere so
   the whole page reads as one sequence
   rather than scattered effects.
======================================= */

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const STEPS = ["Verify", "Details", "Payment", "Receipt"];

export default function FeesPayment() {
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
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

  const reduceMotion = useReducedMotion();

  // =====================================
  // AUTO FETCH LOGGED-IN STUDENT'S OWN DETAILS
  // =====================================

  useEffect(() => {
    const fetchMyDetails = async () => {
      try {
        setProfileLoading(true);
        setProfileError("");

        const { data } = await api.get("/payments/me");

        if (data.success) {
          const student = data.data.student;

          setFormData((prev) => ({
            ...prev,
            studentId: student._id || "",
            studentName: student.name || "",
            email: student.email || "",
            phone: student.phone || "",
            stream: student.stream || "",
            semester: student.semester ?? "",
          }));
        }
      } catch (error) {
        console.log(error);
        setProfileError(
          "Could not load your student details. Please log in again."
        );
      } finally {
        setProfileLoading(false);
      }
    };

    fetchMyDetails();
  }, []);

  // =====================================
  // HANDLE CHANGE
  // =====================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (paidReceipt) setPaidReceipt(null);
  };

  // =====================================
  // RECEIPT PDF GENERATION (unchanged logic)
  // =====================================

  const generateReceiptPDF = (payment) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 48;
    let y = 60;

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
  // RAZORPAY PAYMENT (unchanged logic)
  // =====================================

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setPaidReceipt(null);

      const { data: orderData } = await api.post("/payments/create-order", {
        paymentPurpose: formData.paymentPurpose,
        amount: formData.amount,
      });

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

        theme: { color: "#3b82f6" },
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

  // Which step of the flow are we on — a genuine sequence, so a
  // numbered stepper actually encodes something true here.
  const stepIndex = paidReceipt ? 3 : loading ? 2 : profileLoading ? 0 : 1;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Fraunces', ui-serif, serif; letter-spacing: -0.01em; }
        .font-body { font-family: 'Plus Jakarta Sans', ui-sans-serif, sans-serif; }
        .btn-shimmer { position: relative; overflow: hidden; }
        .btn-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.35) 50%, transparent 80%);
          transform: translateX(-120%);
          animation: shimmer-sweep 3.2s ease-in-out infinite;
        }
        @keyframes shimmer-sweep { to { transform: translateX(120%); } }
        @media (prefers-reduced-motion: reduce) {
          .btn-shimmer::after { animation: none; }
        }
      `}</style>

      <section className="relative min-h-screen bg-base-200 py-10 px-4 overflow-hidden font-body">
        {/* AMBIENT BACKGROUND — quiet, theme-driven, not a fixed hex */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
          <motion.div
            className="absolute w-[420px] h-[420px] rounded-full bg-primary/10 blur-3xl"
            style={{ top: "-8%", left: "-6%" }}
            animate={reduceMotion ? {} : { x: [0, 40, 0], y: [0, 30, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[380px] h-[380px] rounded-full bg-secondary/10 blur-3xl"
            style={{ bottom: "-10%", right: "-6%" }}
            animate={reduceMotion ? {} : { x: [0, -30, 0], y: [0, -35, 0] }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* HERO */}
          <motion.div
            initial={{ opacity: 0, y: -28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="hero bg-base-100 rounded-box shadow-xl border border-base-300 mb-8 relative overflow-hidden"
          >
            {/* drifting academic-finance iconography, purely ambient */}
            {!reduceMotion && (
              <div aria-hidden className="hidden md:block pointer-events-none absolute inset-0">
                <motion.span
                  className="absolute text-primary/15"
                  style={{ top: "18%", left: "8%" }}
                  animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                >
                  <IndianRupee size={40} />
                </motion.span>
                <motion.span
                  className="absolute text-secondary/15"
                  style={{ top: "62%", left: "16%" }}
                  animate={{ y: [0, 10, 0], rotate: [0, -8, 0] }}
                  transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <GraduationCap size={34} />
                </motion.span>
                <motion.span
                  className="absolute text-accent/15"
                  style={{ top: "24%", right: "10%" }}
                  animate={{ y: [0, 14, 0], rotate: [0, 8, 0] }}
                  transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <BookOpen size={36} />
                </motion.span>
              </div>
            )}

            <div className="hero-content text-center py-12 relative">
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
                  className="badge badge-primary badge-lg gap-1 mb-4"
                >
                  <Sparkles size={14} /> Student Finance Portal
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-4xl md:text-5xl font-semibold text-base-content"
                >
                  Fees Payment Portal
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                  className="text-base-content/70 mt-4 max-w-2xl mx-auto"
                >
                  Securely pay tuition fees, semester fees, examination fees, hostel fees
                  and other academic charges through Razorpay.
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* STEPPER — a real sequence, so numbering carries information */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center justify-between max-w-2xl mx-auto mb-8 px-2"
          >
            {STEPS.map((label, i) => (
              <Fragment key={label}>
                <div className="flex flex-col items-center gap-2">
                  <motion.div
                    animate={{ scale: i === stepIndex ? 1.12 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 font-body text-sm font-bold transition-colors duration-300 ${
                      i < stepIndex
                        ? "bg-primary border-primary text-primary-content"
                        : i === stepIndex
                        ? "border-primary text-primary bg-primary/10"
                        : "border-base-300 text-base-content/40 bg-base-100"
                    }`}
                  >
                    {i < stepIndex ? <Check size={16} /> : i + 1}
                  </motion.div>
                  <span className="text-xs text-base-content/60 hidden sm:block">{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 bg-base-300 mx-2 relative overflow-hidden rounded-full">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: i < stepIndex ? "100%" : "0%" }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  </div>
                )}
              </Fragment>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* FORM */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="lg:col-span-2"
            >
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                className="card bg-base-100 shadow-xl border border-base-300"
              >
                <div className="card-body">
                  <motion.h2 variants={itemVariants} className="card-title text-3xl font-display font-semibold">
                    Student Payment Details
                  </motion.h2>

                  <AnimatePresence>
                    {profileError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="alert alert-error mt-4"
                      >
                        <span>{profileError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handlePayment} className="mt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <AutoField
                        icon={<GraduationCap size={18} />}
                        label="Student ID"
                        value={formData.studentId}
                        loading={profileLoading}
                      />

                      <AutoField
                        icon={<User size={18} />}
                        label="Full Name"
                        value={formData.studentName}
                        loading={profileLoading}
                      />

                      <AutoField
                        icon={<Mail size={18} />}
                        label="Email Address"
                        value={formData.email}
                        loading={profileLoading}
                      />

                      <AutoField
                        icon={<Phone size={18} />}
                        label="Phone Number"
                        value={formData.phone}
                        loading={profileLoading}
                      />

                      {/* STREAM */}
                      <motion.div variants={itemVariants} className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Stream</span>
                        </label>
                        <select
                          name="stream"
                          value={formData.stream}
                          className="select select-bordered w-full bg-base-200/60"
                          disabled
                        >
                          <option value="">{profileLoading ? "Loading..." : "Not Set"}</option>
                          <option>BCA</option>
                          <option>BBA</option>
                          <option>MCA</option>
                        </select>
                      </motion.div>

                      {/* SEMESTER */}
                      <motion.div variants={itemVariants} className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Semester</span>
                        </label>
                        <select
                          name="semester"
                          value={formData.semester}
                          className="select select-bordered w-full bg-base-200/60"
                          disabled
                        >
                          <option value="">{profileLoading ? "Loading..." : "Not Set"}</option>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                            <option key={sem} value={sem}>
                              Semester {sem}
                            </option>
                          ))}
                        </select>
                      </motion.div>

                      {/* PURPOSE — editable */}
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

                      {/* AMOUNT — editable */}
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

                    <motion.button
                      variants={itemVariants}
                      whileHover={!loading && !profileLoading && !profileError ? { scale: 1.015 } : {}}
                      whileTap={!loading && !profileLoading && !profileError ? { scale: 0.98 } : {}}
                      type="submit"
                      disabled={loading || profileLoading || !!profileError}
                      className={`btn btn-primary btn-lg w-full mt-8 ${
                        !loading && !profileLoading && !profileError ? "btn-shimmer" : ""
                      }`}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {loading ? (
                          <motion.span
                            key="processing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <span className="loading loading-spinner"></span>
                            Processing...
                          </motion.span>
                        ) : (
                          <motion.span
                            key="pay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <CreditCard size={20} />
                            Pay Now
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </motion.div>

            {/* SUMMARY */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                className="card bg-base-100 shadow-xl border border-base-300 sticky top-24"
              >
                <div className="card-body">
                  <h2 className="card-title text-2xl font-display">Payment Summary</h2>

                  <div className="divider"></div>

                  <div className="space-y-4">
                    <SummaryRow label="Student" value={formData.studentName || "Not Available"} />
                    <SummaryRow label="Stream" value={formData.stream || "Not Selected"} />
                    <SummaryRow label="Semester" value={formData.semester || "Not Selected"} />
                    <SummaryRow label="Purpose" value={formData.paymentPurpose || "Not Specified"} />
                  </div>

                  <div className="divider"></div>

                  <div className="stat bg-base-200 rounded-box">
                    <div className="stat-title">Total Amount</div>
                    <div className="stat-value text-primary font-display">
                      <span className="text-2xl align-top mr-1">₹</span>
                      <AnimatedNumber value={Number(formData.amount) || 0} />
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {paidReceipt ? (
                      <motion.div
                        key="stamp"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="relative mt-4 rounded-2xl border-2 border-success/40 bg-success/10 p-5 overflow-hidden"
                      >
                        {/* burst particles */}
                        {!reduceMotion &&
                          Array.from({ length: 10 }).map((_, i) => {
                            const angle = (i / 10) * Math.PI * 2;
                            return (
                              <motion.span
                                key={i}
                                className="absolute left-10 top-8 w-1.5 h-1.5 rounded-full bg-success"
                                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                animate={{
                                  x: Math.cos(angle) * 60,
                                  y: Math.sin(angle) * 60,
                                  opacity: 0,
                                  scale: 0,
                                }}
                                transition={{ duration: 0.9, ease: "easeOut" }}
                              />
                            );
                          })}

                        {/* wax-seal stamp */}
                        <motion.div
                          initial={{ rotate: -30, scale: 0 }}
                          animate={{ rotate: -12, scale: 1 }}
                          transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.15 }}
                          className="absolute -right-3 -top-3 w-16 h-16 rounded-full border-4 border-success/50 flex items-center justify-center bg-base-100/80 backdrop-blur"
                        >
                          <span className="font-display font-bold text-success text-[10px] tracking-widest text-center leading-tight">
                            PAID
                          </span>
                        </motion.div>

                        <div className="flex items-center gap-2 relative z-10">
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", delay: 0.05 }}
                          >
                            <CheckCircle2 className="text-success" size={22} />
                          </motion.div>
                          <div>
                            <p className="font-semibold">Payment confirmed</p>
                            <p className="text-xs text-base-content/60">
                              Receipt No. {paidReceipt.receiptNumber}
                            </p>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => generateReceiptPDF(paidReceipt)}
                          className="btn btn-sm btn-outline btn-success w-full mt-4 relative z-10"
                        >
                          <Download size={16} />
                          Download Receipt Again
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="secure"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="alert alert-success mt-4"
                      >
                        <ShieldCheck size={18} />
                        <span>100% Secure Razorpay Payment</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="alert alert-info mt-4">
                    <span>
                      Your details are pulled in automatically from your login — just enter
                      the purpose and amount.
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

/* =======================================
   ANIMATED NUMBER
   Tweens between amounts imperatively so
   the total feels alive as the student types.
======================================= */

function AnimatedNumber({ value }) {
  const ref = useRef(null);
  const prevValue = useRef(0);

  useEffect(() => {
    const node = ref.current;
    const controls = animate(prevValue.current, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate(latest) {
        if (node) node.textContent = Math.round(latest).toLocaleString("en-IN");
      },
    });
    prevValue.current = value;
    return () => controls.stop();
  }, [value]);

  return <span ref={ref}>0</span>;
}

/* =======================================
   AUTO-FILLED FIELD
   Skeleton shimmer while the profile loads,
   then a soft reveal once real data lands.
======================================= */

function AutoField({ icon, label, value, loading, className = "" }) {
  return (
    <motion.div variants={itemVariants} className={`form-control ${className}`}>
      <label className="label">
        <span className="label-text font-semibold">{label}</span>
      </label>
      <div className="input input-bordered flex items-center gap-3 w-full bg-base-200/60">
        <span className="opacity-60 shrink-0">{icon}</span>
        <AnimatePresence mode="wait" initial={false}>
          {loading ? (
            <motion.span
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-3 w-28 rounded-full bg-base-300 animate-pulse"
            />
          ) : (
            <motion.span
              key="value"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="grow truncate"
            >
              {value || "—"}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* =======================================
   EDITABLE INPUT FIELD
======================================= */

function InputField({ icon, label, className = "", ...props }) {
  return (
    <motion.div variants={itemVariants} className={`form-control ${className}`}>
      <label className="label">
        <span className="label-text font-semibold">{label}</span>
      </label>

      <label className="input input-bordered flex items-center gap-3 w-full transition-shadow duration-300 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary">
        <span className="opacity-60">{icon}</span>
        <input {...props} className="grow" />
      </label>
    </motion.div>
  );
}

/* =======================================
   SUMMARY ROW
======================================= */

function SummaryRow({ label, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex justify-between gap-4"
    >
      <span className="text-base-content/70">{label}</span>
      <span className="font-semibold text-right">{value}</span>
    </motion.div>
  );
}