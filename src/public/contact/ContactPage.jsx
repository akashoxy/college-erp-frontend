import React, { useState } from "react";
import api from "../../services/api";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  // Single toast source of truth: { type: 'success' | 'error', message }
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    queryType: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const notify = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await api.post("/contact", formData);

      if (data.success) {
        notify("success", "Enquiry submitted successfully.");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          queryType: "",
          message: "",
        });
      } else {
        notify("error", data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      notify("error", "Failed to submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactCards = [
    { icon: FaPhoneAlt, label: "Call Us", value: "+91 94750 52378" },
    { icon: FaEnvelope, label: "Email", value: "info@technoindiahooghly.org" },
    { icon: FaMapMarkerAlt, label: "Address", value: "Hooghly, WB" },
    { icon: FaClock, label: "Office Hours", value: "Mon – Fri" },
  ];

  const sidePanel = [
    {
      title: "Admission Support",
      text: "Get information regarding courses, eligibility, fees structure and admission process.",
    },
    {
      title: "Academic Guidance",
      text: "Connect with departments for academic and curriculum-related queries.",
    },
    {
      title: "Student Assistance",
      text: "Reach our support team for facilities, campus life and student services.",
    },
  ];

  const whyContact = [
    { title: "Fast Response", text: "Quick and efficient response from our support team." },
    { title: "Admission Assistance", text: "Complete guidance regarding admissions and programs." },
    { title: "Student Support", text: "Dedicated support for academic and campus-related concerns." },
  ];

  return (
    <>
      {/* Display/utility fonts — colors below come from the active daisyUI theme */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
        .cp-scope { font-family: 'Inter', sans-serif; }
        .cp-scope .f-display { font-family: 'Fraunces', serif; }
        .cp-scope .f-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      <div className="cp-scope min-h-screen bg-base-100">
        {/* HERO */}
        <section className="relative overflow-hidden bg-neutral text-neutral-content py-24">
          <div
            className="absolute inset-0 opacity-[0.1] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent, transparent 30px, var(--color-accent) 31px)",
            }}
          />
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <p className="f-mono text-xs tracking-[0.3em] uppercase text-accent">
              Techno College Hooghly &nbsp;·&nbsp; Contact &amp; Enquiries
            </p>

            <h1 className="f-display mt-6 text-5xl md:text-6xl font-medium">
              Get In Touch
            </h1>

            <div className="mx-auto mt-6 h-px w-16 bg-accent" />

            <p className="mt-6 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto text-neutral-content/75">
              Our team is here to assist you with admissions, academics,
              student support and campus information.
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          {toast && (
            <div className="toast toast-top toast-end z-50">
              <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"}`}>
                <span>{toast.message}</span>
              </div>
            </div>
          )}

          {/* CONTACT CARDS */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {contactCards.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="border border-base-300 bg-base-100 rounded-sm p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-full border-2 border-accent text-accent flex items-center justify-center text-xl">
                  <Icon />
                </div>
                <p className="f-mono text-[11px] uppercase tracking-widest text-accent mt-5">
                  {label}
                </p>
                <p className="mt-1 font-medium text-base-content">{value}</p>
              </div>
            ))}
          </div>

          {/* CONTACT FORM + INFO */}
          <div className="grid lg:grid-cols-3 gap-10 mb-20">
            {/* FORM */}
            <div className="lg:col-span-2 border border-base-300 bg-base-100 rounded-sm">
              <div className="p-8 md:p-10">
                <p className="f-mono text-[11px] uppercase tracking-widest text-accent">
                  Written Enquiry
                </p>
                <h2 className="f-display text-3xl font-medium text-base-content mt-2 mb-2">
                  Send Us An Enquiry
                </h2>
                <p className="text-base-content/70 mb-8">
                  Fill out the form below and our team will get back to you shortly.
                </p>

                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="input input-bordered rounded-sm w-full"
                    required
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="input input-bordered rounded-sm w-full"
                    required
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="input input-bordered rounded-sm w-full"
                    required
                  />

                  <select
                    name="queryType"
                    value={formData.queryType}
                    onChange={handleChange}
                    className="select select-bordered rounded-sm w-full"
                    required
                  >
                    <option value="">Select Query Type</option>
                    <option>Admission Query</option>
                    <option>Academic Query</option>
                    <option>Business Query</option>
                    <option>Feedback</option>
                    <option>Other</option>
                  </select>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Write your message..."
                    className="textarea textarea-bordered rounded-sm md:col-span-2"
                    required
                  />

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary rounded-sm w-full"
                    >
                      {loading ? "Submitting…" : "Submit Enquiry"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* SIDE PANEL */}
            <div className="space-y-5">
              {sidePanel.map(({ title, text }) => (
                <div
                  key={title}
                  className="border border-base-300 bg-base-100 rounded-sm p-6 border-l-4 border-l-accent"
                >
                  <h3 className="f-display text-lg font-medium text-base-content">{title}</h3>
                  <p className="text-base-content/70 text-sm mt-2 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* WHY CONTACT US */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <p className="f-mono text-[11px] uppercase tracking-widest text-accent">
                What To Expect
              </p>
              <h2 className="f-display mt-2 text-4xl font-medium text-base-content">
                Why Contact Us?
              </h2>
              <p className="text-base-content/70 mt-3">
                Dedicated support for students, parents and visitors.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {whyContact.map(({ title, text }) => (
                <div
                  key={title}
                  className="border border-base-300 bg-base-100 rounded-sm p-8 text-center"
                >
                  <div className="w-14 h-14 mx-auto rounded-full border-2 border-accent text-accent flex items-center justify-center f-display text-lg">
                    {title.charAt(0)}
                  </div>
                  <h3 className="f-display text-xl font-medium text-base-content mt-5">
                    {title}
                  </h3>
                  <p className="text-base-content/70 mt-2 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* GOOGLE MAP */}
          <div className="border border-base-300 bg-base-100 rounded-sm overflow-hidden mb-20">
            <div className="p-8">
              <p className="f-mono text-[11px] uppercase tracking-widest text-accent">
                Find Us
              </p>
              <h2 className="f-display text-3xl font-medium text-base-content mt-2">
                Campus Location
              </h2>
              <p className="text-base-content/70 mt-1">
                Visit Techno India Hooghly Campus
              </p>
            </div>

            <iframe
              title="Techno India Hooghly"
              src="https://www.google.com/maps?q=Techno+India+Hooghly&output=embed"
              className="w-full h-125 border-0 grayscale hover:grayscale-0 transition-all duration-500"
              loading="lazy"
            />
          </div>

          {/* BOTTOM CTA */}
          <div className="relative overflow-hidden rounded-sm bg-neutral text-neutral-content p-10 md:p-14 text-center">
            <div
              className="absolute inset-0 opacity-[0.1] pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent, transparent 30px, var(--color-accent) 31px)",
              }}
            />
            <div className="relative">
              <h2 className="f-display text-3xl md:text-4xl font-medium mb-4">
                We Would Love To Hear From You
              </h2>
              <div className="mx-auto mb-5 h-px w-16 bg-accent" />
              <p className="max-w-3xl mx-auto text-lg text-neutral-content/75">
                Whether you're a prospective student, parent, recruiter or
                academic partner, our team is ready to assist you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}