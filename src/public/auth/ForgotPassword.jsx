import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/images/tih-logo.png";

import { FaUserGraduate, FaChalkboardTeacher, FaShieldAlt, FaLock, FaEnvelope } from "react-icons/fa";

import {
  Fonts,
  AmbientBackground,
  BrandPanel,
  CardShell,
  RoleTabs,
  TextField,
  PasswordField,
  ElegantButton,
  AuthSteps,
  AuthFooter,
} from "./Authchrome";

const ROLES = [
  { key: "student", label: "Student", icon: <FaUserGraduate /> },
  { key: "faculty", label: "Faculty", icon: <FaChalkboardTeacher /> },
];

const FEATURES = ["One-time verification code", "Encrypted password reset", "Back to your portal in minutes"];

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const activeRole = ROLES.find((r) => r.key === role) || ROLES[0];

  const API_MAP = {
    student: {
      forgot: "http://localhost:5000/api/student/forgot-password",
      reset: "http://localhost:5000/api/student/reset-password",
    },
    faculty: {
      forgot: "http://localhost:5000/api/faculty/forgot-password",
      reset: "http://localhost:5000/api/faculty/reset-password",
    },
  };

  function fail(message) {
    setShake(true);
    setTimeout(() => setShake(false), 500);
    alert(message);
  }

  async function handleSendOtp() {
    try {
      setLoading(true);
      await axios.post(API_MAP[role].forgot, { email });
      alert("OTP Sent Successfully");
      setStep(2);
    } catch (error) {
      fail(error.response?.data?.message || "Failed to Send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    try {
      setLoading(true);
      await axios.post(API_MAP[role].reset, { email, otp, newPassword });
      alert("Password Reset Successful");
      window.location.href = "/login";
    } catch (error) {
      fail(error.response?.data?.message || "Password Reset Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center bg-base-200">
      <Fonts />
      <AmbientBackground />

      <div className="relative w-full max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <BrandPanel title="Techno College" subtitle="HOOGHLY" features={FEATURES} />

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <CardShell shake={shake}>
              <div className="px-10 pt-8">
                <RoleTabs
                  roles={ROLES}
                  active={role}
                  onChange={(k) => {
                    setRole(k);
                    setStep(1);
                  }}
                  layoutId="forgotRoleUnderline"
                />
              </div>

              <div className="px-10 py-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${role}-${step}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35 }}
                  >
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="btn btn-link no-underline hover:no-underline font-body text-xs uppercase tracking-[0.2em] mb-8 p-0 h-auto min-h-0 text-base-content/50"
                    >
                      ← Back to sign in
                    </button>

                    <div className="mb-8">
                      <h2 className="font-display text-3xl text-base-content">Reset password</h2>
                      <p className="font-body text-sm mt-2 text-base-content/50">
                        Recovering your{" "}
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={activeRole.key}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25 }}
                            className="inline-block text-primary"
                          >
                            {activeRole.label}
                          </motion.span>
                        </AnimatePresence>{" "}
                        account
                      </p>
                    </div>

                    <AuthSteps current={step} labels={["Email", "Verify"]} />

                    {/* STEP 1 */}
                    {step === 1 && (
                      <div className="space-y-8">
                        <TextField
                          icon={FaEnvelope}
                          type="email"
                          placeholder="Registered email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />

                        <ElegantButton onClick={handleSendOtp} disabled={loading} type="button">
                          {loading ? (
                            <>
                              <span className="loading loading-spinner loading-xs" />
                              Sending code
                            </>
                          ) : (
                            <>
                              <FaEnvelope className="text-[11px]" />
                              Send verification code
                            </>
                          )}
                        </ElegantButton>
                      </div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                      <div className="space-y-8">
                        <TextField
                          icon={FaShieldAlt}
                          placeholder="Enter verification code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />

                        <PasswordField
                          icon={FaLock}
                          placeholder="Create new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <div className="space-y-4">
                          <ElegantButton onClick={handleResetPassword} disabled={loading} type="button">
                            {loading ? (
                              <>
                                <span className="loading loading-spinner loading-xs" />
                                Resetting
                              </>
                            ) : (
                              <>
                                <FaLock className="text-[11px]" />
                                Reset password
                              </>
                            )}
                          </ElegantButton>

                          <ElegantButton type="button" variant="outline" onClick={() => setStep(1)}>
                            ← Back
                          </ElegantButton>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <AuthFooter logo={logo} name="Techno College Hooghly" badge="Password recovery" />
            </CardShell>
          </motion.div>
        </div>
      </div>
    </main>
  );
}