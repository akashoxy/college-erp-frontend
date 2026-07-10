import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/images/tih-logo.png"

import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserShield,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaUniversity,
  FaShieldAlt,
  FaDatabase,
  FaUserCheck,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

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
  },
  {
    key: "admin",
    label: "Administrator",
    icon: <FaUserShield />,
    color: "error",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

const API_MAP = {
  student: "/student/login",
  faculty: "/faculty/login",
  admin: "/admin/login",
};

  const activeRole =
    ROLES.find((r) => r.key === role) || ROLES[0];

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post(
  API_MAP[role],
  {
    email,
    password,
  }
);

      const responseData =
  res.data.data || res.data;

const userData =
  responseData.student ||
  responseData.faculty ||
  responseData.admin ||
  responseData.user;

const token =
  responseData.token ||
  res.data.token;

if (!userData) {
  throw new Error("User data not returned from server.");
}

login(
  {
    ...userData,
    _id: userData._id || userData.id,
    role,
  },
  token
);

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen hero bg-base-200 relative overflow-hidden">

      {/* Animated Background */}

      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -left-48 -top-48 w-125 h-125 rounded-full bg-primary/10 blur-3xl"
      />

      <motion.div
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -right-48 bottom-0 w-112.5 h-112.5 rounded-full bg-secondary/10 blur-3xl"
      />

      <motion.div
        animate={{
          y: [-20, 20, -20],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full bg-accent/10 blur-3xl -translate-x-1/2 -translate-y-1/2"
      />

      <div className="hero-content w-full max-w-7xl px-4">

        <div className="grid lg:grid-cols-2 gap-10 w-full items-center">

          {/* =======================================================
                    LEFT PANEL
          ======================================================= */}

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
                        RIGHT LOGIN CARD
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

            <div className="card bg-base-100/80 backdrop-blur-xl border border-base-300 shadow-[0_30px_80px_rgba(0,0,0,.15)] overflow-hidden rounded-4xl">

              {/* TOP BAR */}

              <div className="h-2 bg-linear-to-r from-primary via-secondary to-accent" />

              <div className="card-body p-0">

                {/* ROLE TABS */}

                <div className="bg-base-200 p-5">

                  <div className="grid grid-cols-3 gap-3">

                    {ROLES.map((item) => (

                      <motion.button
                        whileTap={{
                          scale: .95,
                        }}
                        whileHover={{
                          y: -2,
                        }}
                        key={item.key}
                        type="button"
                        onClick={() =>
                          setRole(item.key)
                        }
                        className={`btn rounded-2xl font-bold transition-all ${
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

                {/* LOGIN BODY */}

                <div className="p-10">

                  <AnimatePresence mode="wait">

                    <motion.div
                      key={role}
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

  <h2 className="text-4xl font-black">
    Welcome
  </h2>

  <p className="mt-2 text-base-content/60">
    Login as{" "}
    <span className="font-bold text-primary">
      {activeRole.label}
    </span>
  </p>

</div>

                      {/* FORM */}

                      <form
                        onSubmit={handleLogin}
                        className="space-y-6"
                      >

                        <label className="input input-bordered rounded-2xl h-16 flex items-center gap-4 w-full">

                          <FaEnvelope className="text-primary text-xl" />

                          <input
                            type="email"
                            className="grow border-none outline-none focus:outline-none focus:ring-0 bg-transparent"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) =>
                              setEmail(e.target.value)
                            }
                          />

                        </label>

                        <label className="input input-bordered rounded-2xl h-16 flex items-center gap-4 w-full">

                          <FaLock className="text-primary text-xl" />

                          <input
                            type="password"
                            className="grow"
                            placeholder="Password"
                            value={password}
                            onChange={(e) =>
                              setPassword(
                                e.target.value
                              )
                            }
                          />

                        </label>

                        <motion.button
                          whileHover={{
                            scale: 1.02,
                          }}
                          whileTap={{
                            scale: .98,
                          }}
                          type="submit"
                          disabled={loading}
                          className="btn btn-primary btn-lg rounded-2xl w-full"
                        >
                          {loading ? (
                            <>
                              <span className="loading loading-spinner loading-sm" />
                              Logging In...
                            </>
                          ) : (
                            <>
                              Login
                              <FaArrowRight />
                            </>
                          )}
                        </motion.button>
                                                {role !== "admin" && (
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link
                              to={`/signin?role=${role}`}
                              className="btn btn-outline btn-primary btn-lg rounded-2xl w-full"
                            >
                              Create New Account
                            </Link>
                          </motion.div>
                        )}

                        <div className="text-center">

                          <Link
                            to={`/forgot-password?role=${role}`}
                            className="link link-primary font-semibold"
                          >
                            Forgot Password?
                          </Link>

                        </div>

                      </form>

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
                          Techno College Hooghly
                        </h4>

                        <p className="text-xs opacity-60">
                          Enterprise ERP Platform
                        </p>

                      </div>

                    </div>

                    <div className="badge badge-outline badge-primary px-4 py-3">

                      Version 2.0

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