
import React from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaGraduationCap,
  FaPhoneAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function AnnouncementBar({ address, admissionText }) {
  return (
    <>
      <style>
        {`
          @keyframes glitter {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .glitter-text {
            background: linear-gradient(
              90deg,
              #e8c77a 0%,
              #fff3d6 20%,
              #e8c77a 40%,
              #fff3d6 60%,
              #e8c77a 100%
            );
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: glitter 4s linear infinite;
          }
        `}
      </style>

      <motion.div
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-base-100 text-base-content border-b border-primary/10"
      >
        {/* hairline gold accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-rose-400 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-2.5 text-[13px]">
            {/* Left Side */}
            <div className="flex flex-wrap items-center justify-center gap-4 font-medium">
              <div className="flex items-center gap-2">
  <FaGraduationCap className="text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)] text-sm" />

  <Link
    to="/admission-procedure"
    className="font-semibold text-[13px] md:text-sm tracking-wide hover:underline underline-offset-4 text-rose-400 hover:text-rose-300 transition-all duration-300 drop-shadow-[0_0_6px_rgba(244,63,94,0.8)] hover:drop-shadow-[0_0_12px_rgba(244,63,94,1)]"
  >
    {admissionText || "Admissions Open"}
  </Link>
</div>

              <span className="hidden md:inline-block w-px h-4 bg-base-content/15" />

              <div className="hidden md:flex items-center gap-2 text-base-content/70">
                <FaPhoneAlt className="text-[11px] text-rose-600" />
                <span>Admission Helpdesk</span>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center gap-2 text-base-content/60 text-center lg:text-right">
              <FaMapMarkerAlt className="text-rose-600 shrink-0 text-xs" />
              <span className="tracking-wide">
                {address || "Address not available"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default AnnouncementBar;