import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/images/tih-logo.png";

import { FaUserGraduate, FaChalkboardTeacher, FaUserCheck, FaUser, FaEnvelope, FaShieldAlt } from "react-icons/fa";

import {
  Fonts,
  AmbientBackground,
  MobileBrandBar,
  BrandPanel,
  CardShell,
  RoleTabs,
  TextField,
  PasswordField,
  SelectField,
  ElegantButton,
  AuthFooter,
  Toast,
  SuccessSeal,
} from "./Authchrome";

const ROLES = [
  { key: "student", label: "Student", icon: <FaUserGraduate /> },
  { key: "faculty", label: "Faculty", icon: <FaChalkboardTeacher /> },
];

const FEATURES = ["Instant enrollment", "Verified faculty & student records", "One login, every service"];

export default function SignIn() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [role, setRole] = useState(params.get("role") || "student");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    registrationNo: "",
    rollNo: "",
    stream: "",
    semester: "",
  });

  const activeRole = ROLES.find((r) => r.key === role) || ROLES[0];

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function fail(message) {
    setShake(true);
    setTimeout(() => setShake(false), 500);
    setToast({ type: "error", message });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
        fail("Please fill all required fields");
        return;
      }

      if (form.password.length < 6) {
        fail("Password must be at least 6 characters");
        return;
      }

      const emailRegex = /^\S+@\S+\.\S+$/;

      if (!emailRegex.test(form.email)) {
        fail("Invalid Email Address");
        return;
      }

      if (role === "student") {
        if (!form.stream || !form.semester) {
          fail("Please select Stream and Semester");
          return;
        }
      }

      const API_MAP = {
        student: "/student/register",
        faculty: "/faculty/register",
      };

      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };

      if (role === "student") {
        payload.reg = form.registrationNo.trim();
        payload.roll = form.rollNo.trim();
        payload.stream = form.stream.trim().toUpperCase();
        payload.semester = Number(form.semester);
      }

      const res = await api.post(API_MAP[role], payload);

      setSuccess(true);
      setTimeout(() => navigate("/login"), 1100);
    } catch (error) {
      fail(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center bg-base-200">
      <Fonts />
      <AmbientBackground />
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <BrandPanel title="Techno College" subtitle="HOOGHLY" features={FEATURES} />

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.8 }}
          >
            <MobileBrandBar />

            <CardShell shake={shake}>
              <div className="px-6 sm:px-10 pt-6 sm:pt-8">
                <RoleTabs roles={ROLES} active={role} onChange={setRole} layoutId="signinRoleUnderline" />
              </div>

              <div className="px-6 sm:px-10 py-8 sm:py-10">
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <SuccessSeal label="Account created" sublabel="Redirecting you to sign in…" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={role}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.35 }}
                    >
                      <div className="mb-8 sm:mb-10">
                        <h2 className="font-display text-2xl sm:text-3xl text-base-content">Create your account</h2>
                        <p className="font-body text-sm mt-2 text-base-content/50">
                          Registering as{" "}
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
                          </AnimatePresence>
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-x-8 gap-y-6 sm:gap-y-7">
                        <TextField icon={FaUser} placeholder="Full name" name="name" value={form.name} onChange={handleChange} />

                        <TextField
                          icon={FaEnvelope}
                          type="email"
                          placeholder="Email address"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                        />

                        <AnimatePresence>
                          {role === "student" && (
                            <>
                              <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                              >
                                <TextField
                                  placeholder="Registration number"
                                  name="registrationNo"
                                  value={form.registrationNo}
                                  onChange={handleChange}
                                />
                              </motion.div>

                              <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                              >
                                <TextField placeholder="Roll number" name="rollNo" value={form.rollNo} onChange={handleChange} />
                              </motion.div>

                              <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                              >
                                <SelectField
                                  name="stream"
                                  value={form.stream}
                                  onChange={handleChange}
                                  placeholder="Select stream"
                                  options={[
                                    { value: "BCA", label: "BCA" },
                                    { value: "BBA", label: "BBA" },
                                    { value: "MCA", label: "MCA" },
                                  ]}
                                />
                              </motion.div>

                              <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                              >
                                <SelectField
                                  name="semester"
                                  value={form.semester}
                                  onChange={handleChange}
                                  placeholder="Select semester"
                                  options={[1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({ value: s, label: `Semester ${s}` }))}
                                />
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>

                        <div className="sm:col-span-2">
                          <PasswordField
                            icon={FaShieldAlt}
                            placeholder="Create password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-4 pt-4">
                          <ElegantButton type="submit" disabled={loading}>
                            {loading ? (
                              <>
                                <span className="loading loading-spinner loading-xs" />
                                Creating account
                              </>
                            ) : (
                              <>
                                <FaUserCheck className="text-[11px]" />
                                Create account
                              </>
                            )}
                          </ElegantButton>

                          <ElegantButton type="button" variant="outline" onClick={() => navigate("/login")}>
                            Already have an account? Sign in
                          </ElegantButton>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AuthFooter logo={logo} name="Techno College Hooghly" />
            </CardShell>
          </motion.div>
        </div>
      </div>
    </main>
  );
}