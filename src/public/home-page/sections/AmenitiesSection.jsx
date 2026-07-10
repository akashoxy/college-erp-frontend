
import React, { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import api from "../../../services/api";

import raggingImg from "../../../assets/amenities/wifi2.png";
import wifiImg from "../../../assets/amenities/wifi2.png";
import radioImg from "../../../assets/amenities/radio2.png";
import libraryImg from "../../../assets/amenities/radio2.png";
import labImg from "../../../assets/amenities/radio2.png";

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
    { title: "Central Library", image: libraryImg },
    { title: "Computer Laboratory", image: labImg },
    { title: "Radio TIH", image: radioImg },
    { title: "Campus Wi-Fi", image: wifiImg },
    { title: "Ragging Free Campus", image: raggingImg },
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-24">
          {amenities.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
              className="group bg-base-100 rounded-3xl border border-base-300/60 hover:border-primary/30 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 p-6 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden bg-base-200 ring-1 ring-primary/15 group-hover:ring-primary/40 transition-all duration-500">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain p-3 group-hover:scale-105 transition-all duration-500"
                />
              </div>

              <h3 className="mt-5 font-semibold text-base-content text-[15px] group-hover:text-primary transition-colors duration-300">
                {item.title}
              </h3>

              <div className="mt-3 h-px w-6 bg-primary/40 group-hover:w-12 transition-all duration-500" />
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