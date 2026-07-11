import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";

import tihlogo from "../../assets/images/tih-logo.png";

import {
  AcademicCapIcon,
  LightBulbIcon,
  Cog6ToothIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  SparklesIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

/**
 * Loads the display/body typefaces once, scoped to this page so the
 * font-family doesn't leak elsewhere. Matches the About Us page so the
 * two read as one consistent editorial system.
 */
function VmFonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap');

      .vm-root { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      .vm-display {
        font-family: 'Fraunces', ui-serif, Georgia, serif;
        font-optical-sizing: auto;
        letter-spacing: -0.01em;
      }
      .vm-eyebrow {
        font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        font-size: 0.72rem;
        font-weight: 600;
      }
      .vm-rule {
        height: 1px;
        background: color-mix(in srgb, currentColor 18%, transparent);
      }
    `}</style>
  );
}

/* Reusable eyebrow + thin-rule label, matching the About Us page. */
function SectionLabel({ children, align = "left", light = false }) {
  const ruleColor = light ? "bg-primary-content/40" : "bg-primary/40";
  const textColor = light ? "text-primary-content/80" : "text-primary";
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
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`vm-rule ${ruleColor} shrink-0`}
        />
      )}
      <span className={`vm-eyebrow ${textColor}`}>{children}</span>
      <motion.span
        initial={{ width: 0 }}
        whileInView={{ width: align === "center" ? 40 : 64 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`vm-rule ${ruleColor} shrink-0`}
      />
    </div>
  );
}

const MISSION_ICON_MAP = {
  AcademicCapIcon,
  LightBulbIcon,
  Cog6ToothIcon,
  GlobeAltIcon,
};

const CORE_VALUES = [
  { icon: TrophyIcon, title: "Excellence" },
  { icon: SparklesIcon, title: "Innovation" },
  { icon: ShieldCheckIcon, title: "Integrity" },
  { icon: UserGroupIcon, title: "Leadership" },
];

const STATS = [
  { number: "25+", title: "Years Excellence" },
  { number: "5000+", title: "Students" },
  { number: "100+", title: "Faculty" },
  { number: "100%", title: "Commitment" },
];

export default function VisionMission() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await api.get("/vision-mission");
      setData(res.data?.data || null);
    } catch (error) {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getMissionIcon = (iconName) => {
    const Icon = MISSION_ICON_MAP[iconName] || AcademicCapIcon;
    return <Icon className="w-10 h-10 text-primary" strokeWidth={1.5} />;
  };

  if (loading) {
    return (
      <div className="vm-root min-h-screen bg-base-100 flex justify-center items-center">
        <VmFonts />
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="vm-root min-h-screen bg-base-100 flex justify-center items-center px-6">
        <VmFonts />
        <div className="text-center">
          <h2 className="vm-display text-4xl font-medium mb-4 text-base-content">
            No Vision &amp; Mission Data Found
          </h2>
          <p className="text-base-content/60">
            Please add content from the admin panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="vm-root bg-base-100">
      <VmFonts />

      {/* PAGE HEADING */}
      <div className="border-b border-base-300">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="vm-eyebrow text-base-content/50 mb-3"
          >
            Our Purpose
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="vm-display text-5xl md:text-6xl font-medium text-base-content"
          >
            Vision &amp; Mission
          </motion.h1>
        </div>
      </div>

      {/* ====================================== */}
      {/* HERO SECTION */}
      {/* ====================================== */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary/5 via-base-100 to-secondary/5">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
          <div className="absolute -top-10 -left-10 w-96 h-96 rounded-full bg-primary blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-secondary blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg bg-base-100 border border-base-300 flex items-center justify-center">
              <img
                src={tihlogo}
                alt="TIH"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-center"
          >
            <h2 className="vm-display text-3xl md:text-5xl font-medium text-base-content mb-6">
              {data.heroTitle}
            </h2>

            <p className="max-w-3xl mx-auto text-lg text-base-content/65 leading-relaxed">
              {data.heroDescription}
            </p>
          </motion.div>

          {/* STATISTICS */}
          <div className="grid grid-cols-2 md:grid-cols-4 mt-16 divide-x divide-base-300 border-t border-b border-base-300">
            {STATS.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="text-center py-8 px-4"
              >
                <h3 className="vm-display text-4xl font-medium text-primary">
                  {item.number}
                </h3>
                <p className="vm-eyebrow mt-3 text-base-content/55">
                  {item.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================== */}
      {/* VISION */}
      {/* ====================================== */}
      <section className="py-24 bg-base-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="hidden md:block absolute -top-4 -left-4 w-full h-full rounded-3xl border border-primary/25"></div>
              <div className="relative bg-linear-to-br from-primary to-secondary rounded-3xl h-96 flex items-center justify-center shadow-xl">
                <AcademicCapIcon
                  className="w-32 h-32 text-primary-content/90"
                  strokeWidth={1}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionLabel>Our Vision</SectionLabel>

              <h3 className="vm-display text-3xl md:text-4xl font-medium mb-8 text-base-content">
                {data.visionTitle}
              </h3>

              <p className="text-lg leading-relaxed text-base-content/75">
                {data.visionDescription}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================== */}
      {/* MISSIONS */}
      {/* ====================================== */}
      <section className="py-24 bg-base-200/60 border-y border-base-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <SectionLabel align="center">Our Mission</SectionLabel>
            <h2 className="vm-display text-3xl md:text-4xl font-medium mb-4 text-base-content">
              Driving Excellence with Purpose
            </h2>
            <p className="text-base-content/65 max-w-xl mx-auto">
              Focused goals and meaningful action, guided by what matters
              most to our students.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.missions?.map((mission, index) => (
              <motion.div
                key={mission.title || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="bg-base-100 rounded-2xl p-8 border border-base-300 hover:border-primary/40 transition-colors"
              >
                <div className="mb-6">{getMissionIcon(mission.icon)}</div>

                <h3 className="vm-display text-xl font-medium mb-3 text-base-content">
                  {mission.title}
                </h3>

                <p className="text-base-content/65 leading-relaxed text-[0.95rem]">
                  {mission.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================== */}
      {/* CORE VALUES */}
      {/* ====================================== */}
      <section className="py-24 bg-base-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <SectionLabel align="center">What Guides Us</SectionLabel>
            <h2 className="vm-display text-3xl md:text-4xl font-medium text-base-content">
              Core Values
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-base-300 border-t border-b border-base-300">
            {CORE_VALUES.map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center py-10 px-4"
              >
                <item.icon
                  className="w-10 h-10 mx-auto text-primary mb-4"
                  strokeWidth={1.5}
                />
                <h3 className="vm-eyebrow text-base-content/75">
                  {item.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================== */}
      {/* CTA */}
      {/* ====================================== */}
      <section className="py-24 bg-linear-to-r from-primary to-secondary text-primary-content">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <SectionLabel align="center" light>
            Get Started
          </SectionLabel>

          <h2 className="vm-display text-3xl md:text-5xl font-medium mb-6">
            Join Our Academic Journey
          </h2>

          <p className="text-lg text-primary-content/80 mb-10 leading-relaxed">
            Empowering students with knowledge, innovation, and leadership
            for a brighter future.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/admission-procedure" className="btn btn-neutral">
              Explore Programs
            </Link>

            <Link
              to="/contact"
              className="btn btn-outline text-primary-content border-primary-content/60 hover:bg-primary-content hover:text-primary hover:border-primary-content"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}