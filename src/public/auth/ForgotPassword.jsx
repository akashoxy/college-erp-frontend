import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/images/tih-logo.png"

import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserShield,
  FaUniversity,
  FaShieldAlt,
  FaLock,
  FaEnvelope,
  FaDatabase,
  FaUserCheck,
} from "react-icons/fa";

const ROLES = [
  {
    key: "student",
    label: "Student",
    icon: <FaUserGraduate />,
    color: "primary",
  },
  {
    key: "faculty",
    label: "Faculty",
    icon: <FaChalkboardTeacher />,
    color: "success",
  }
];

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const activeRole =
    ROLES.find((r) => r.key === role) ||
    ROLES[0];

  const API_MAP = {
    student: {
      forgot:
        "http://localhost:5000/api/student/forgot-password",
      reset:
        "http://localhost:5000/api/student/reset-password",
    },

    faculty: {
      forgot:
        "http://localhost:5000/api/faculty/forgot-password",
      reset:
        "http://localhost:5000/api/faculty/reset-password",
    }
  };

  async function handleSendOtp() {
    try {
      setLoading(true);

      await axios.post(
        API_MAP[role].forgot,
        {
          email,
        }
      );

      alert("OTP Sent Successfully");

      setStep(2);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to Send OTP"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    try {
      setLoading(true);

      await axios.post(
        API_MAP[role].reset,
        {
          email,
          otp,
          newPassword,
        }
      );

      alert("Password Reset Successful");

      window.location.href = "/login";
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Password Reset Failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="hero min-h-screen bg-base-200 relative overflow-hidden">

      {/* Animated Background */}

      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 50,
          ease: "linear",
        }}
        className="absolute -top-56 -left-56 w-130 h-130 rounded-full bg-primary/10 blur-3xl"
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          repeat: Infinity,
          duration: 60,
          ease: "linear",
        }}
        className="absolute -bottom-56 -right-56 w-120 h-120 rounded-full bg-secondary/10 blur-3xl"
      />

      <motion.div
        animate={{
          y: [-20, 20, -20],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
        }}
        className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-accent/10 blur-3xl -translate-x-1/2 -translate-y-1/2"
      />

      <div className="hero-content max-w-7xl w-full px-4">

        <div className="grid lg:grid-cols-2 gap-10 items-center w-full">

          {/* ============================================
                      LEFT PANEL
          ============================================ */}
<motion.div
            initial={{
              opacity: 0,
              x: -60,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: .8,
            }}
           className="hidden lg:flex items-center justify-center h-190"
          >

            {/* Logo + Features */}

            <div className="space-y-8">

              <motion.div
  initial={{
    opacity: 0,
    x: -60,
  }}
  animate={{
    opacity: 1,
    x: 0,
  }}
  transition={{
    duration: 0.8,
  }}
  className="hidden lg:flex items-center justify-center h-190"
>
  <div className="w-full max-w-md">

    <motion.div
      whileHover={{
        scale: 1.05,
      }}
      className="card bg-base-100 shadow-2xl border border-base-300"
    >
      <div className="card-body">

        <div className="flex items-center gap-6">

          {/* LOGO */}

          <motion.div
            animate={{
              rotate: [0, 4, -4, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
            className="avatar"
          >
            <div className="w-28 rounded-full bg-base-100 ring ring-primary ring-offset-base-100 ring-offset-4">

              <img
                src={logo}
                alt="College Logo"
               className="w-32 h-32 object-cover rounded-full"
              />

            </div>
          </motion.div>

          <div>

            <h2 className="text-3xl font-black">
              Techno College
            </h2>

            <p className="text-xl text-primary font-bold">
              Hooghly
            </p>

          </div>

        </div>

      </div>
    </motion.div>

  </div>
</motion.div>

            </div>

          </motion.div>

          {/* =====================================================
                        RIGHT RECOVERY CARD
          ===================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 60,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: .8,
            }}
          >

            <div className="card bg-base-100/80 backdrop-blur-xl rounded-4xl shadow-[0_30px_80px_rgba(0,0,0,.15)] border border-base-300 overflow-hidden">

              <div className="h-2 bg-linear-to-r from-primary via-secondary to-accent" />

              <div className="card-body p-0">

                {/* ROLE SELECTOR */}

                <div className="bg-base-200 p-5">

                  <div className="grid grid-cols-2 gap-3">

  {ROLES.map((item) => (

    <motion.button
      key={item.key}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      type="button"
      onClick={() => {
        setRole(item.key);
        setStep(1);
      }}
      className={`btn rounded-2xl font-bold ${
        role === item.key
          ? `btn-${item.color}`
          : "btn-ghost"
      }`}
    >
      {item.icon}
      {item.label}
    </motion.button>

  ))}

</div>

                </div>

                <div className="p-10">

                  <AnimatePresence mode="wait">

                    <motion.div
                      key={`${role}-${step}`}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -20,
                      }}
                      transition={{
                        duration: .35,
                      }}
                    >

                      {/* HEADER */}

                      

                        <div className="flex flex-col items-center justify-center text-center mb-8">

                          <div className="p-6 ">

  <button
    type="button"
    onClick={() => navigate("/login")}
    className="btn btn-outline btn-primary w-full rounded-2xl"
  >
    ← Back to Login
  </button>

</div>

                          <h2 className="text-4xl font-black">
                            Forgot Password
                          </h2>

                          <p className="mt-2 text-base-content/60">
                            Recover your{" "}
                            <span className="font-bold text-primary">
                              {activeRole.label}
                            </span>{" "}
                            account
                          </p>

                        </div>

                     

                      {/* STEP INDICATOR */}

                      <ul className="steps steps-horizontal w-full mb-8">

                        <li
                          className={`step ${
                            step >= 1
                              ? "step-primary"
                              : ""
                          }`}
                        >
                          Email
                        </li>

                        <li
                          className={`step ${
                            step >= 2
                              ? "step-primary"
                              : ""
                          }`}
                        >
                          Verify
                        </li>

                      </ul>

                      {/* STEP 1 */}

                      {step === 1 && (

                        <div className="flex justify-center">

  <div className="w-full max-w-md space-y-6">

    <label className="input input-bordered rounded-2xl h-16 flex items-center gap-3 w-full">

      <FaEnvelope className="text-primary" />

      <input
        type="email"
        className="grow"
        placeholder="Registered Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

    </label>

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleSendOtp}
      disabled={loading}
      className="btn btn-primary btn-lg w-full rounded-2xl"
    >
      {loading ? (
        <>
          <span className="loading loading-spinner loading-sm" />
          Sending OTP...
        </>
      ) : (
        <>
          <FaEnvelope />
          Send OTP
        </>
      )}
    </motion.button>

  </div>

</div>

                      )}
                                            {/* ==========================
                              STEP 2
                      ========================== */}

                      {step === 2 && (

                        <div className="flex justify-center">

  <div className="w-full max-w-md space-y-6">

    <label className="input input-bordered rounded-2xl h-16 flex items-center gap-3 w-full">

      <FaShieldAlt className="text-primary" />

      <input
        type="text"
        className="grow"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

    </label>

    <label className="input input-bordered rounded-2xl h-16 flex items-center gap-3 w-full">

      <FaLock className="text-primary" />

      <input
        type="password"
        className="grow"
        placeholder="Create New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

    </label>

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleResetPassword}
      disabled={loading}
      className="btn btn-success btn-lg w-full rounded-2xl"
    >
      {loading ? (
        <>
          <span className="loading loading-spinner loading-sm" />
          Resetting...
        </>
      ) : (
        <>
          <FaLock />
          Reset Password
        </>
      )}
    </motion.button>

    <button
      type="button"
      onClick={() => setStep(1)}
      className="btn btn-outline btn-primary btn-lg w-full rounded-2xl"
    >
      ← Back
    </button>

  </div>

</div>

                      )}

                    </motion.div>

                  </AnimatePresence>

                </div>

                {/* FOOTER */}

                <div className="bg-base-200 border-t border-base-300 px-8 py-5">

                  <div className="flex flex-col md:flex-row items-center justify-between gap-3">

                    <div className="flex items-center gap-3">

                      <div className="avatar">

                        <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">

                          <img
                            src={logo}
                            alt="College Logo"
                            className=" object-cover rounded-full"
                          />

                        </div>

                      </div>

                      <div>

                        <h4 className="font-bold text-sm">

                          Techno India Hooghly

                        </h4>

                        <p className="text-xs opacity-60">

                          Enterprise ERP Platform

                        </p>

                      </div>

                    </div>

                    <div className="badge badge-outline badge-primary px-4 py-3">

                      Password Recovery

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </div>

    </main>
  );
}