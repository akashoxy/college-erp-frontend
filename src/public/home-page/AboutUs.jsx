import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";

/**
 * Loads the display/body typefaces once, scoped so they don't leak
 * font-family onto anything outside this page.
 */
function AboutUsFonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap');

      .au-root { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      .au-display {
        font-family: 'Fraunces', ui-serif, Georgia, serif;
        font-optical-sizing: auto;
        letter-spacing: -0.01em;
      }
      .au-eyebrow {
        font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        font-size: 0.72rem;
        font-weight: 600;
      }
      .au-rule {
        height: 1px;
        background: color-mix(in srgb, currentColor 18%, transparent);
      }
      .au-quotemark {
        font-family: 'Fraunces', ui-serif, Georgia, serif;
        line-height: 0.6;
      }
    `}</style>
  );
}

/* A small, reusable section label: eyebrow text + a thin rule that
   grows in on scroll. This is the page's structural signature —
   used consistently instead of colored pill badges. */
function SectionLabel({ children, align = "left" }) {
  return (
    <div
      className={`flex items-center gap-4 mb-5 ${
        align === "center" ? "justify-center" : "justify-start"
      }`}
    >
      {align === "center" && (
        <motion.span
          initial={{ width: 0 }}
          whileInView={{ width: 40 }}
          transition={{ duration: 0.5 }}
          className="au-rule bg-primary/40 shrink-0"
          style={{ height: 1 }}
        />
      )}
      <span className="au-eyebrow text-primary">{children}</span>
      <motion.span
        initial={{ width: 0 }}
        whileInView={{ width: align === "center" ? 40 : 64 }}
        transition={{ duration: 0.5 }}
        className="au-rule bg-primary/40 shrink-0"
        style={{ height: 1 }}
      />
    </div>
  );
}

export default function AboutUs() {
  const [aboutData, setAboutData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const res = await api.get("/about-us");
      setAboutData(res.data?.data || {});
    } catch (error) {
      setError("Failed to load About Us information");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="au-root min-h-screen flex justify-center items-center">
        <AboutUsFonts />
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="au-root min-h-screen flex justify-center items-center px-6">
        <AboutUsFonts />
        <div className="alert alert-error max-w-md">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!aboutData || Object.keys(aboutData).length === 0) {
    return (
      <div className="au-root min-h-screen flex justify-center items-center px-6">
        <AboutUsFonts />
        <div className="text-center">
          <h2 className="au-display text-4xl font-medium mb-4">
            About Us Information Not Available
          </h2>
          <p className="text-base-content/60">
            Please add content from the Admin CMS.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="au-root">
      <AboutUsFonts />

      <section className="bg-base-100 overflow-hidden">
        {/* PAGE HEADING */}
        <div className="border-b border-base-300">
          <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="au-eyebrow text-base-content/50 mb-3"
            >
              Who We Are
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="au-display text-5xl md:text-6xl font-medium text-base-content"
            >
              About Us
            </motion.h1>
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="relative overflow-hidden bg-linear-to-br from-primary/5 via-base-100 to-secondary/5">
          <div className="absolute inset-0 opacity-[0.07] overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -left-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="au-display text-3xl md:text-5xl font-medium text-primary"
            >
              {aboutData.heroTitle || "About Us"}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="max-w-3xl mx-auto mt-6 text-lg text-base-content/65 leading-relaxed"
            >
              {aboutData.heroDescription}
            </motion.p>
          </div>
        </div>

        {/* CAMPUS SECTION */}
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {/* offset frame — quiet editorial detail */}
              <div className="hidden md:block absolute -top-4 -left-4 w-full h-full rounded-3xl border border-primary/25"></div>
              {aboutData.campusImage ? (
                <img
                  src={aboutData.campusImage}
                  alt={aboutData.campusTitle}
                  loading="lazy"
                  className="relative rounded-3xl shadow-xl border border-base-300 w-full h-125 object-cover"
                />
              ) : (
                <div className="relative h-125 rounded-3xl bg-base-200 flex items-center justify-center">
                  <span className="text-base-content/50">
                    No Campus Image Available
                  </span>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionLabel>Our Campus</SectionLabel>

              <h3 className="au-display text-3xl md:text-4xl font-medium mb-6">
                {aboutData.campusTitle}
              </h3>

              <p className="text-base-content/75 leading-relaxed mb-5">
                {aboutData.campusDescription1}
              </p>

              <p className="text-base-content/75 leading-relaxed">
                {aboutData.campusDescription2}
              </p>
            </motion.div>
          </div>
        </div>

        {/* VISION SECTION */}
        <div className="bg-base-200/60 py-24 border-y border-base-300">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionLabel align="center">Vision &amp; Mission</SectionLabel>

              <h3 className="au-display text-3xl md:text-4xl font-medium mb-8">
                {aboutData.visionTitle}
              </h3>

              <p className="text-lg leading-relaxed text-base-content/75 mb-6">
                {aboutData.visionDescription1}
              </p>

              <p className="text-lg leading-relaxed text-base-content/75">
                {aboutData.visionDescription2}
              </p>
            </motion.div>
          </div>
        </div>

        {/* PRINCIPAL MESSAGE */}
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <SectionLabel>Principal's Message</SectionLabel>

              <div className="relative pl-2">
                <span className="au-quotemark absolute -top-4 -left-1 text-7xl text-primary/20 select-none">
                  &ldquo;
                </span>
                <blockquote className="au-display relative italic text-xl md:text-2xl font-light leading-snug text-base-content/85 pl-8">
                  {aboutData.principalQuote}
                </blockquote>
              </div>

              <div className="au-rule bg-base-300 my-6"></div>

              <p className="text-base-content/75 leading-relaxed">
                {aboutData.principalMessage}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center order-1 lg:order-2"
            >
              {aboutData.principalImage ? (
                <img
                  src={aboutData.principalImage}
                  alt={aboutData.principalName}
                  loading="lazy"
                  className="w-64 h-64 object-cover rounded-full shadow-xl mx-auto border-4 border-base-100 ring-1 ring-base-300"
                />
              ) : (
                <div className="w-64 h-64 rounded-full bg-base-200 border border-base-300 mx-auto flex items-center justify-center">
                  <span className="text-base-content/50">No Photo</span>
                </div>
              )}

              <h4 className="au-display mt-6 text-2xl font-medium">
                {aboutData.principalName}
              </h4>

              <p className="au-eyebrow text-base-content/50 mt-1">
                {aboutData.principalDesignation}
              </p>
            </motion.div>
          </div>
        </div>

        {/* HIGHLIGHTS */}
        <div className="border-y border-base-300 bg-base-100 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-base-300">
              {[
                { value: "20+", label: "Years of Excellence" },
                { value: "5000+", label: "Students Educated" },
                { value: "100+", label: "Faculty Members" },
                { value: "95%", label: "Placement Support" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="text-center px-4"
                >
                  <h3 className="au-display text-4xl md:text-5xl font-medium text-primary">
                    {stat.value}
                  </h3>
                  <p className="au-eyebrow mt-3 text-base-content/55">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CLOSING MESSAGE */}
        <div className="bg-base-200/60 py-24">
          <motion.div
            className="max-w-3xl mx-auto px-6 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel align="center">Our Commitment</SectionLabel>

            <p className="au-display text-2xl md:text-3xl font-light leading-relaxed text-base-content/85">
              {aboutData.closingMessage}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}