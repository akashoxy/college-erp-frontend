import { useEffect, useMemo, useState } from "react";
import api from "../../../../services/api";
import { motion } from "framer-motion";

import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Filter,
  Loader2,
  Mail,
  RefreshCcw,
  Search,
  Send,
  Users,
} from "lucide-react";

export default function PaymentAlerts() {
  // =====================================
  // FILTERS
  // =====================================

  const [mode, setMode] = useState("defaulters"); // "defaulters" | "all"
  const [paymentPurpose, setPaymentPurpose] = useState(
    "Semester Fees"
  );
  const [stream, setStream] = useState("");
  const [batch, setBatch] = useState("");
  const [search, setSearch] = useState("");

  // =====================================
  // STUDENT LIST
  // =====================================

  const [students, setStudents] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [listError, setListError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // =====================================
  // ALERT COMPOSER
  // =====================================

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("fee-reminder");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [sendError, setSendError] = useState("");

  // =====================================
  // FETCH STUDENTS (defaulters or all)
  // =====================================

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      setListError("");
      setSendResult(null);

      const { data } = await api.get(
        "/notifications/admin/recipients",
        {
          params: {
            mode,
            paymentPurpose,
            stream: stream || undefined,
            batch: batch || undefined,
          },
        }
      );

      if (data.success) {
        setStudents(data.data.students || []);
        setSelectedIds(new Set());
      }
    } catch (error) {
      console.log(error);
      setListError(
        "Could not load students. Please try again."
      );
    } finally {
      setLoadingStudents(false);
      setHasSearched(true);
    }
  };

  useEffect(() => {
    // Load the default view (fee defaulters) as soon as the page opens.
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =====================================
  // FILTER VISIBLE LIST BY SEARCH TEXT
  // (client-side, on top of the server filters)
  // =====================================

  const visibleStudents = useMemo(() => {
    if (!search.trim()) return students;

    const q = search.trim().toLowerCase();

    return students.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.roll?.toLowerCase().includes(q) ||
        s.reg?.toLowerCase().includes(q)
    );
  }, [students, search]);

  // =====================================
  // SELECTION HELPERS
  // =====================================

  const toggleOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allVisibleSelected =
    visibleStudents.length > 0 &&
    visibleStudents.every((s) => selectedIds.has(s._id));

  const toggleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (allVisibleSelected) {
        visibleStudents.forEach((s) => next.delete(s._id));
      } else {
        visibleStudents.forEach((s) => next.add(s._id));
      }

      return next;
    });
  };

  // =====================================
  // SEND ALERT
  // =====================================

  const handleSend = async (e) => {
    e.preventDefault();

    if (selectedIds.size === 0) {
      setSendError("Select at least one student first.");
      return;
    }

    if (!title.trim() || !message.trim()) {
      setSendError("Title and message are both required.");
      return;
    }

    try {
      setSending(true);
      setSendError("");
      setSendResult(null);

      const { data } = await api.post(
        "/notifications/admin/send",
        {
          studentIds: [...selectedIds],
          title: title.trim(),
          message: message.trim(),
          type: alertType,
          relatedPaymentPurpose:
            mode === "defaulters" ? paymentPurpose : "",
        }
      );

      if (data.success) {
        setSendResult(data.data);
        setTitle("");
        setMessage("");
      } else {
        setSendError(
          data.message || "Failed to send alert."
        );
      }
    } catch (error) {
      console.log(error);
      setSendError(
        error?.response?.data?.message ||
          "Something went wrong while sending the alert."
      );
    } finally {
      setSending(false);
    }
  };

  // =====================================
  // QUICK PRESET: "everyone currently shown"
  // =====================================

  const applyDefaultsPreset = () => {
    setTitle(
      mode === "defaulters"
        ? `Reminder: ${paymentPurpose} Pending`
        : "Payment Notice"
    );

    setMessage(
      mode === "defaulters"
        ? `This is a reminder that your ${paymentPurpose.toLowerCase()} for the current semester is still pending. Please complete the payment at the earliest to avoid any inconvenience.`
        : "Please check the Fees Payment section for an important update regarding your payments."
    );
  };

  return (
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
                Admin Control
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-base-content">
                Payment Alerts &amp; Notices
              </h1>

              <p className="text-base-content/70 mt-4 max-w-2xl">
                Find students who haven't paid their fees, or pick
                any group of students, and send them an in-app +
                email notice in one go.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT: FILTERS + STUDENT LIST */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* FILTER CARD */}

            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body">
                <h2 className="card-title text-2xl">
                  <Filter size={20} />
                  Find Students
                </h2>

                {/* MODE TABS */}

                <div className="tabs tabs-boxed w-fit mt-2">
                  <button
                    type="button"
                    className={`tab ${
                      mode === "defaulters" ? "tab-active" : ""
                    }`}
                    onClick={() => setMode("defaulters")}
                  >
                    <AlertTriangle size={14} className="mr-1" />
                    Fee Defaulters
                  </button>

                  <button
                    type="button"
                    className={`tab ${
                      mode === "all" ? "tab-active" : ""
                    }`}
                    onClick={() => setMode("all")}
                  >
                    <Users size={14} className="mr-1" />
                    All Students
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {mode === "defaulters" && (
                    <div className="form-control md:col-span-1">
                      <label className="label">
                        <span className="label-text font-semibold">
                          Payment Purpose
                        </span>
                      </label>

                      <input
                        type="text"
                        value={paymentPurpose}
                        onChange={(e) =>
                          setPaymentPurpose(e.target.value)
                        }
                        placeholder="Semester Fees"
                        className="input input-bordered w-full"
                      />
                    </div>
                  )}

                  <div className="form-control md:col-span-1">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Stream
                      </span>
                    </label>

                    <select
                      value={stream}
                      onChange={(e) => setStream(e.target.value)}
                      className="select select-bordered w-full"
                    >
                      <option value="">All Streams</option>
                      <option value="BCA">BCA</option>
                      <option value="BBA">BBA</option>
                      <option value="MCA">MCA</option>
                    </select>
                  </div>

                  <div className="form-control md:col-span-1">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Batch
                      </span>
                    </label>

                    <input
                      type="text"
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      placeholder="e.g. 2026 (matches 2026 - 2030)"
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={fetchStudents}
                  disabled={loadingStudents}
                  className="btn btn-primary mt-4 w-full md:w-auto"
                >
                  {loadingStudents ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Searching...
                    </>
                  ) : (
                    <>
                      <RefreshCcw size={16} />
                      {mode === "defaulters"
                        ? "Find Defaulters"
                        : "Load Students"}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* RESULTS CARD */}

            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="card-title text-2xl">
                    {mode === "defaulters" ? (
                      <>
                        <AlertTriangle
                          size={20}
                          className="text-warning"
                        />
                        Unpaid Students
                      </>
                    ) : (
                      <>
                        <Users size={20} />
                        Students
                      </>
                    )}

                    {hasSearched && (
                      <span className="badge badge-neutral">
                        {students.length}
                      </span>
                    )}
                  </h2>

                  <label className="input input-bordered flex items-center gap-2 max-w-xs">
                    <Search size={16} className="opacity-60" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search name, email, roll..."
                      className="grow"
                    />
                  </label>
                </div>

                {listError && (
                  <div className="alert alert-error mt-4">
                    <span>{listError}</span>
                  </div>
                )}

                {!listError &&
                  hasSearched &&
                  visibleStudents.length === 0 && (
                    <div className="alert alert-success mt-4">
                      <CheckCircle2 size={18} />
                      <span>
                        {mode === "defaulters"
                          ? "No defaulters found — everyone matching these filters has paid."
                          : "No students match these filters."}
                      </span>
                    </div>
                  )}

                {visibleStudents.length > 0 && (
                  <>
                    <label className="label cursor-pointer justify-start gap-3 mt-4">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={allVisibleSelected}
                        onChange={toggleSelectAllVisible}
                      />
                      <span className="label-text font-semibold">
                        Select all shown ({visibleStudents.length})
                      </span>
                    </label>

                    <div className="overflow-x-auto mt-2">
                      <table className="table">
                        <thead>
                          <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Stream</th>
                            <th>Sem</th>
                            <th>Batch</th>
                          </tr>
                        </thead>

                        <tbody>
                          {visibleStudents.map((s) => (
                            <tr
                              key={s._id}
                              className={
                                selectedIds.has(s._id)
                                  ? "bg-primary/5"
                                  : ""
                              }
                            >
                              <td>
                                <input
                                  type="checkbox"
                                  className="checkbox checkbox-sm"
                                  checked={selectedIds.has(s._id)}
                                  onChange={() =>
                                    toggleOne(s._id)
                                  }
                                />
                              </td>
                              <td className="font-medium">
                                {s.name}
                              </td>
                              <td className="text-sm opacity-70">
                                {s.email}
                              </td>
                              <td>
                                <span className="badge badge-outline">
                                  {s.stream || "-"}
                                </span>
                              </td>
                              <td>{s.semester ?? "-"}</td>
                              <td className="text-sm opacity-70">
                                {s.batch || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: COMPOSE ALERT */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="card bg-base-100 shadow-xl border border-base-300 sticky top-24">
              <div className="card-body">
                <h2 className="card-title text-2xl">
                  <Bell size={20} />
                  Compose Alert
                </h2>

                <div className="alert alert-info mt-2">
                  <Users size={18} />
                  <span>
                    <strong>{selectedIds.size}</strong> student
                    {selectedIds.size === 1 ? "" : "s"} selected
                  </span>
                </div>

                <form onSubmit={handleSend} className="space-y-4 mt-2">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Alert Type
                      </span>
                    </label>

                    <select
                      value={alertType}
                      onChange={(e) =>
                        setAlertType(e.target.value)
                      }
                      className="select select-bordered w-full"
                    >
                      <option value="fee-reminder">
                        Fee Reminder
                      </option>
                      <option value="payment-alert">
                        Payment Alert
                      </option>
                      <option value="general">
                        General Notice
                      </option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Title
                      </span>
                    </label>

                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Semester Fees Pending"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Message
                      </span>
                    </label>

                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write the notice here..."
                      className="textarea textarea-bordered w-full min-h-30"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={applyDefaultsPreset}
                    className="btn btn-ghost btn-sm w-full"
                  >
                    Use suggested wording
                  </button>

                  {sendError && (
                    <div className="alert alert-error">
                      <span>{sendError}</span>
                    </div>
                  )}

                  {sendResult && (
                    <div className="alert alert-success flex-col items-stretch gap-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} />
                        <span className="font-semibold">
                          Sent to {sendResult.notified} student
                          {sendResult.notified === 1 ? "" : "s"}
                        </span>
                      </div>
                      <div className="text-sm flex items-center gap-2 opacity-80">
                        <Mail size={14} />
                        {sendResult.emailsSent} email
                        {sendResult.emailsSent === 1 ? "" : "s"} sent
                        {sendResult.emailsFailed > 0 &&
                          ` · ${sendResult.emailsFailed} failed`}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={sending || selectedIds.size === 0}
                    className="btn btn-primary btn-lg w-full"
                  >
                    {sending ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Alert
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}