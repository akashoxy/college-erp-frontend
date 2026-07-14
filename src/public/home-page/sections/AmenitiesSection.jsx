
import React, { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import api from "../../../services/api";

import raggingImg from "../../../assets/images/ragging.png";
import wifiImg from "../../../assets/amenities/wifi2.png";
import radioImg from "../../../assets/amenities/radio2.png";
import smartImg from "../../../assets/images/smart.png";
import { Link } from "react-router-dom";

const EASE = [0.22, 1, 0.36, 1];

function AmenitiesSection() {
  const [approvals, setApprovals] = useState([]);

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      const res = await api.get("/approvals");
      setApprovals(res.data.data?.approvals || []);
    } catch (error) {
      console.error("Approvals Error:", error.response?.data || error);
    }
  };

  const amenities = [
    { title: "Smart Class", image: smartImg },
    { title: "Radio TIH", image: radioImg, link: "/radiotih" },
    { title: "Campus Wi-Fi", image: wifiImg },
    { title: "Ragging Free Campus", image: raggingImg, link: "/antiragging-control"  },
  ];

  return (
    <section className="py-14 md:py-18 bg-base-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ==================== CAMPUS AMENITIES ==================== */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.5 }}
  transition={{ duration: 0.6, ease: EASE }}
  className="text-center mb-16"
>
  <span className="inline-flex items-center gap-3 text-primary font-semibold text-xs tracking-[0.35em] uppercase">
    <span className="h-px w-8 bg-primary/50" />
    Student Facilities
    <span className="h-px w-8 bg-primary/50" />
  </span>

  <h2 className="font-serif text-4xl md:text-5xl font-semibold mt-5 text-primary tracking-tight">
    Campus Amenities
  </h2>

  <p className="mt-4 text-base-content/60 max-w-3xl mx-auto text-sm md:text-base">
    Modern facilities designed to support learning, innovation,
    creativity and student well-being.
  </p>
</motion.div>

<div className="flex flex-wrap justify-center gap-6 mb-24">
  {amenities.map((item, index) => (
    <motion.div
      key={item.title}
      initial={{ opacity: 0, y: 40, scale: 0.8 }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.55,
          delay: index * 0.09,
          ease: [0.34, 1.56, 0.64, 1],
        },
      }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{
        y: -10,
        scale: 1.04,
        transition: { duration: 0.3, ease: EASE },
      }}
      className="group relative w-[calc(50%-0.75rem)] sm:w-[calc(33.333%-1rem)] lg:w-[calc(20%-1.2rem)] max-w-[180px] bg-base-100 rounded-3xl border border-base-300/60 hover:border-primary/40 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 p-6 flex flex-col items-center text-center overflow-hidden"
    >
      {/* pulsing glow that breathes even before hover */}
      <motion.div
        animate={{ opacity: [0.15, 0.35, 0.15] }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.2,
        }}
        className="pointer-events-none absolute -inset-6 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-0"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative w-24 h-24 shrink-0 mx-auto">
        {/* dashed ring: idle slow spin, speeds up on hover */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full text-primary/25 animate-[spin_18s_linear_infinite] group-hover:text-primary/50 group-hover:[animation-duration:3s] transition-colors duration-500"
        >
          <circle
            cx="50"
            cy="50"
            r="47"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="3 7"
          />
        </svg>

        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 3 + (index % 3) * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.15,
          }}
          className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden bg-base-200 ring-1 ring-primary/15 group-hover:ring-primary/50 group-hover:ring-2 transition-all duration-500"
        >
          <Link to={item.link}>
  <img
    src={item.image}
    alt={item.title}
    className="block mx-auto w-full h-full object-contain object-center p-3 group-hover:scale-[1.15] group-hover:-rotate-6 transition-transform duration-500 ease-out"
  />
</Link>
        </motion.div>

        {/* small accent dot that pops in on hover, top-right of the circle */}
        <motion.span
          initial={{ scale: 0 }}
          whileHover={{}}
          className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform duration-300 ease-out ring-2 ring-base-100"
        />
      </div>

      <h3 className="relative mt-5 font-semibold text-base-content text-[15px] group-hover:text-primary transition-colors duration-300">
        {item.title}
      </h3>

      <div className="relative mt-3 h-px w-6 bg-primary/40 group-hover:w-12 transition-all duration-500" />
    </motion.div>
  ))}
</div>
  

        {/* ==================== APPROVALS ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative bg-linear-to-br from-slate-950 via-primary to-slate-900 rounded-[36px] p-10 md:p-14 overflow-hidden"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl" />

          <div className="text-center mb-12 relative">
            <span className="inline-flex items-center gap-3 text-amber-400 font-semibold text-xs tracking-[0.35em] uppercase">
              <span className="h-px w-8 bg-amber-400/50" />
              Recognition &amp; Accreditation
              <span className="h-px w-8 bg-amber-400/50" />
            </span>

            <h2 className="font-serif mt-5 text-4xl md:text-5xl font-semibold text-white tracking-tight">
              Approvals &amp; Affiliations
            </h2>

            <p className="mt-4 text-white/60 max-w-3xl mx-auto text-sm md:text-base">
              Our institution is recognized and approved by leading
              regulatory bodies, ensuring academic excellence, quality
              education and industry relevance.
            </p>
          </div>

          {approvals.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6 relative">
  {approvals.map((item) => (
    <a
      key={item._id}
      href={item.websiteLink}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group
        w-[calc(50%-0.75rem)]
        md:w-[calc(33.333%-1rem)]
        lg:w-[calc(25%-1.125rem)]
        max-w-xs
        bg-base-100
        rounded-3xl
        border
        border-base-300/60
        p-6
        text-center
        shadow-lg
        hover:shadow-2xl
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-amber-400/40
      "
    >
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-base-200 ring-1 ring-primary/20 group-hover:ring-amber-400/50 shadow-md overflow-hidden transition-all duration-500 group-hover:scale-105">
          <img
            src={item.logo || "/placeholder.png"}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <h3 className="font-serif text-lg font-semibold text-primary">
        {item.title}
      </h3>

      <div className="mt-4 flex items-center justify-center gap-2 text-primary/80 font-medium text-xs uppercase tracking-wide">
        Visit Website
        <FaExternalLinkAlt
          size={10}
          className="transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
    </a>
  ))}
</div>
          ) : (
            <div className="text-center text-white/60 py-10 relative">
              No approvals available.
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default AmenitiesSection;