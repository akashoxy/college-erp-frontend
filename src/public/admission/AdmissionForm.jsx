import React, { useState } from "react";
import api from "../../services/api";

import tihLogo from "../../assets/images/tih-logo.png";

function AdmissionForm() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    course: "",
    message: "",
  });

  const courses = [
    "B.Tech (CSE)",
    "B.Tech (ECE)",
    "BBA",
    "BCA",
    "MCA",
    "MBA",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.phone) {
      return alert(
  error.response?.data?.message ||
    "Something went wrong"
);
    }

    try {
      setLoading(true);

   const { data } = await api.post(
  "/admissions",
  form
);

      if (data.success) {
        alert("Admission enquiry submitted successfully");

        setForm({
          fullName: "",
          email: "",
          phone: "",
          course: "",
          message: "",
        });
      }
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <div className="min-h-screen bg-base-200 py-16 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">

          {/* LEFT SIDE */}
          <div className="space-y-6">

            <div className="flex items-center gap-4">
              <img
                src={tihLogo}
                alt="logo"
                className="w-20 h-20 object-contain"
              />

              <div>
                <h1 className="text-4xl font-bold text-base-content leading-tight">
                  Admission Enquiry
                </h1>

                <p className="text-base-content/70 mt-2">
                  Start your academic journey with us.
                </p>
              </div>
            </div>

            <div
              className="
                bg-base-100
                border border-base-300
                shadow-xl
                rounded-3xl
                p-8
              "
            >
              <h2 className="text-2xl font-bold text-base-content mb-4">
                Why Choose Us?
              </h2>

              <div className="space-y-4 text-base-content/70">

                <div className="flex items-start gap-3">
                  <span className="text-success text-xl">
                    ✓
                  </span>
                  <p>Industry-ready curriculum</p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-success text-xl">
                    ✓
                  </span>
                  <p>
                    Modern smart classrooms &
                    labs
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-success text-xl">
                    ✓
                  </span>
                  <p>
                    Excellent placement support
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-success text-xl">
                    ✓
                  </span>
                  <p>
                    Top recruiters &
                    internship programs
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT SIDE FORM */}
          <div
            className="
              bg-base-100
              shadow-xl
              rounded-4xl
              p-8
              md:p-10
              border border-base-300
            "
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-base-content">
                Apply Now
              </h2>

              <p className="text-base-content/70 mt-2">
                Fill the form and our
                admission team will contact
                you.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="font-semibold text-base-content block mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="input input-bordered w-full h-14 rounded-2xl"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-base-content block mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="input input-bordered w-full h-14 rounded-2xl"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-base-content block mb-2">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="input input-bordered w-full h-14 rounded-2xl"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-base-content block mb-2">
                  Course
                </label>

                <select
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  className="select select-bordered w-full h-14 rounded-2xl"
                >
                  <option value="">
                    Select Course
                  </option>

                  {courses.map((course) => (
                    <option
                      key={course}
                      value={course}
                    >
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-base-content block mb-2">
                  Message
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  className="textarea textarea-bordered w-full rounded-2xl h-32"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full h-14 rounded-2xl text-lg"
              >
                {loading
                  ? "Submitting..."
                  : "Submit Enquiry"}
              </button>
            </form>
          </div>

        </div>
      </div>

    </>
  );
}

export default AdmissionForm;