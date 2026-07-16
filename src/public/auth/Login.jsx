import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/images/tih-logo.png";

import { FaUserGraduate, FaChalkboardTeacher, FaUserShield, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import {
  Fonts,
  AmbientBackground,
  BrandPanel,
  CardShell,
  RoleTabs,
  TextField,
  PasswordField,
  ElegantButton,
  AuthFooter,
} from "./Authchrome";

const ROLES = [
  { key: "student", label: "Student", icon: <FaUserGraduate /> },
  { key: "faculty", label: "Faculty", icon: <FaChalkboardTeacher /> },
  { key: "admin", label: "Administrator", icon: <FaUserShield /> },
];

const FEATURES = ["Secure, verified access", "Unified academic records", "One portal, every role"];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const API_MAP = {
    student: "/student/login",
    faculty: "/faculty/login",
    admin: "/admin/login",
  };

  const activeRole = ROLES.find((r) => r.key === role) || ROLES[0];

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post(API_MAP[role], { email, password });

      const responseData = res.data.data || res.data;

      const userData =
        responseData.student || responseData.faculty || responseData.admin || responseData.user;

      const token = responseData.token || res.data.token;

      if (!userData) {
        throw new Error("User data not returned from server.");
      }

      login({ ...userData, _id: userData._id || userData.id, role }, token);

      navigate(role === "admin" ? "/admin/dashboard" : "/profile");
    } catch (error) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      alert(error.response?.data?.message || "Login Failed");
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
              {/* ROLE TABS */}
              <div className="px-10 pt-8">
                <RoleTabs roles={ROLES} active={role} onChange={setRole} layoutId="loginRoleUnderline" />
              </div>

              {/* BODY */}
              <div className="px-10 py-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={role}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="mb-10">
                      <h2 className="font-display text-3xl text-base-content">Welcome back</h2>
                      <p className="font-body text-sm mt-2 text-base-content/50">
                        Signing in as{" "}
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

                    <form onSubmit={handleLogin} className="space-y-8">
                      <TextField
                        icon={FaEnvelope}
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />

                      <PasswordField
                        icon={FaLock}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />

                      <div className="pt-2 space-y-4">
                        <ElegantButton type="submit" disabled={loading}>
                          {loading ? (
                            <>
                              <span className="loading loading-spinner loading-xs" />
                              Signing in
                            </>
                          ) : (
                            <>
                              Sign in
                              <FaArrowRight className="text-[10px]" />
                            </>
                          )}
                        </ElegantButton>

                        {role !== "admin" && (
                          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.25 }}>
                            <Link
                              to={`/signin?role=${role}`}
                              className="btn btn-outline border-base-content/20 text-base-content hover:bg-transparent hover:border-base-content/40 rounded-none w-full py-4 h-auto font-body text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-2 shadow-none"
                            >
                              Create new account
                            </Link>
                          </motion.div>
                        )}
                      </div>

                      <div className="text-center pt-2">
                        <Link
                          to={`/forgot-password?role=${role}`}
                          className="font-body text-xs tracking-wide text-base-content/50 link link-hover"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </form>
                  </motion.div>
                </AnimatePresence>
              </div>

              <AuthFooter logo={logo} />
            </CardShell>
          </motion.div>
        </div>
      </div>
    </main>
  );
}