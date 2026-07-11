import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/images/tih-logo.png"

import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUniversity,
  FaUserCheck,
  FaDatabase,
  FaShieldAlt,
  FaUser,
  FaEnvelope,
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
  },
];

export default function SignIn() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [role, setRole] = useState(
    params.get("role") || "student"
  );

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    registrationNo: "",
    rollNo: "",
    stream: "",
    semester: "",
  });

  const activeRole =
    ROLES.find((r) => r.key === role) || ROLES[0];

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      if (
        !form.name.trim() ||
        !form.email.trim() ||
        !form.password.trim()
      ) {
        alert("Please fill all required fields");
        return;
      }

      if (form.password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      const emailRegex = /^\S+@\S+\.\S+$/;

      if (!emailRegex.test(form.email)) {
        alert("Invalid Email Address");
        return;
      }

      if (role === "student") {
        if (!form.stream || !form.semester) {
          alert("Please select Stream and Semester");
          return;
        }
      }

    const API_MAP = {
  student: "/student/register",
  faculty: "/faculty/register",
};

      const payload = {
        name: form.name.trim(),
        email: form.email
          .trim()
          .toLowerCase(),
        password: form.password,
      };

      if (role === "student") {
        payload.reg =
          form.registrationNo.trim();

        payload.roll =
          form.rollNo.trim();

        payload.stream =
          form.stream
            .trim()
            .toUpperCase();

        payload.semester = Number(
          form.semester
        );
      }

    const res = await api.post(
  API_MAP[role],
  payload
);

      alert(
        res.data.message ||
          "Registration Successful"
      );

      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Registration Failed"
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

          {/* =====================================================
                        LEFT BRANDING
          ===================================================== */}

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

          {/* ======================================================
                        RIGHT REGISTER CARD
          ====================================================== */}

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .8 }}
          >

            <div className="card bg-base-100/80 backdrop-blur-xl rounded-4xl shadow-[0_30px_80px_rgba(0,0,0,.15)] border border-base-300 overflow-hidden">

              <div className="h-2 bg-linear-to-r from-primary via-secondary to-accent" />

              <div className="card-body p-0">

                {/* Role Tabs */}

                <div className="bg-base-200 p-5">

                  <div className="grid grid-cols-2 gap-3">

                    {ROLES.map((item) => (

                      <motion.button
                        key={item.key}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: .96 }}
                        type="button"
                        onClick={() => setRole(item.key)}
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
                      key={role}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: .35 }}
                    >

                      {/* Header */}

                     <div className="flex flex-col items-center justify-center text-center mb-8">

                      <h2 className="text-4xl font-black">
                        Create Account
                      </h2>

                      <p className="mt-2 text-base-content/60">
                        Register as{" "}
                        <span className="font-bold text-primary">
                          {activeRole.label}
                        </span>
                      </p>

                    </div>

                      <form
                        onSubmit={handleSubmit}
                        className="grid md:grid-cols-2 gap-5"
                      >

                        <label className="input input-bordered rounded-2xl h-14 flex items-center gap-3">

                          <FaUser className="text-primary" />

                          <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            className="grow"
                            value={form.name}
                            onChange={handleChange}
                          />

                        </label>

                        <label className="input input-bordered rounded-2xl h-14 flex items-center gap-3">

                          <FaEnvelope className="text-primary" />

                          <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            className="grow"
                            value={form.email}
                            onChange={handleChange}
                          />

                        </label>

                        {role === "student" && (
                          <>
                            <input
                              type="text"
                              name="registrationNo"
                              placeholder="Registration Number"
                              className="input input-bordered rounded-2xl w-full"
                              value={form.registrationNo}
                              onChange={handleChange}
                            />

                            <input
                              type="text"
                              name="rollNo"
                              placeholder="Roll Number"
                              className="input input-bordered rounded-2xl w-full"
                              value={form.rollNo}
                              onChange={handleChange}
                            />

                            <select
                              name="stream"
                              className="select select-bordered rounded-2xl w-full"
                              value={form.stream}
                              onChange={handleChange}
                            >
                              <option value="">
                                Select Stream
                              </option>

                              <option value="BCA">
                                BCA
                              </option>

                              <option value="BBA">
                                BBA
                              </option>

                              <option value="MCA">
                                MCA
                              </option>
                            </select>

                            <select
                              name="semester"
                              className="select select-bordered rounded-2xl w-full"
                              value={form.semester}
                              onChange={handleChange}
                            >
                              <option value="">
                                Select Semester
                              </option>

                              {[1,2,3,4,5,6,7,8].map((sem)=>(
                                <option
                                  key={sem}
                                  value={sem}
                                >
                                  Semester {sem}
                                </option>
                              ))}
                            </select>
                          </>
                        )}

                        <div className="md:col-span-2">

                          <label className="input input-bordered rounded-2xl h-14 flex items-center gap-3">

                            <FaShieldAlt className="text-primary" />

                            <input
                              type="password"
                              name="password"
                              placeholder="Create Password"
                              className="grow"
                              value={form.password}
                              onChange={handleChange}
                            />

                          </label>

                        </div>
                     <div className="md:col-span-2 space-y-4 mt-2">

                          <motion.button
                            whileHover={{
                              scale: 1.02,
                            }}
                            whileTap={{
                              scale: 0.98,
                            }}
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary btn-lg w-full rounded-2xl"
                          >
                            {loading ? (
                              <>
                                <span className="loading loading-spinner loading-sm" />
                                Creating Account...
                              </>
                            ) : (
                              <>
                                <FaUserCheck />
                                Create Account
                              </>
                            )}
                          </motion.button>

                          <motion.div
                            whileHover={{
                              scale: 1.02,
                            }}
                            whileTap={{
                              scale: 0.98,
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => navigate("/login")}
                              className="btn btn-outline btn-primary btn-lg w-full rounded-2xl"
                            >
                              Already have an account? Login
                            </button>
                          </motion.div>

                        </div>

                      </form>

                    </motion.div>

                  </AnimatePresence>

                </div>

                {/* Footer */}

                <div className="bg-base-200 border-t border-base-300 px-8 py-5">

                  <div className="flex flex-col md:flex-row items-center justify-between gap-3">

                    <div className="flex items-center gap-3">

                      <div className="avatar">

                        <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">

                          <img
                            src={logo}
                            alt="College Logo"
                            className="object-cover rounded-full"
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