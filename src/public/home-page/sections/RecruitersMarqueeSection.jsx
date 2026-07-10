import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../../services/api";

const EASE = [0.22, 1, 0.36, 1];

export default function RecruitersMarqueeSection() {
  const [recruiters, setRecruiters] = useState([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      const res = await api.get("/recruiters");
      const list =
        res.data?.data?.recruiters ||
        res.data?.recruiters ||
        (Array.isArray(res.data) ? res.data : []);

      setRecruiters(list.filter((item) => item.logo));
    } catch (error) {
      setRecruiters([]);
    }
  };

  if (!recruiters.length) return null;

  const duplicatedRecruiters = [...recruiters, ...recruiters];

  return (
    <section className="py-14 md:py-18 bg-base-100 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-400/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="text-center mb-16 relative z-10"
      >
        <span className="inline-flex items-center gap-3 text-primary font-semibold text-xs tracking-[0.35em] uppercase">
          <span className="h-px w-8 bg-primary/50" />
          Industry Partners
          <span className="h-px w-8 bg-primary/50" />
        </span>

        <h2 className="font-serif text-4xl md:text-5xl font-semibold mt-5 text-base-content tracking-tight">
          Top Recruiters
        </h2>

        <p className="mt-4 text-base-content/60 max-w-2xl mx-auto text-sm md:text-base">
          Trusted by leading companies that consistently recruit our
          talented graduates.
        </p>
      </motion.div>

      <div className="absolute left-0 top-0 h-full w-24 md:w-32 bg-linear-to-r from-base-100 to-transparent z-20" />
      <div className="absolute right-0 top-0 h-full w-24 md:w-32 bg-linear-to-l from-base-100 to-transparent z-20" />

      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* <motion.div
          className="flex gap-6 w-max"
          animate={paused ? {} : { x: ["0%", "-50%"] }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        >
          {duplicatedRecruiters.map((item, index) => (
            <div
              key={`${item._id}-${index}`}
              className="group min-w-48 h-48 bg-base-100 border border-base-300/60 rounded-full shadow-md flex flex-col items-center justify-center transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30"
            >
              <div className="w-20 h-20 rounded-full bg-base-200 ring-1 ring-primary/15 group-hover:ring-primary/40 shadow-sm overflow-hidden transition-all duration-500 group-hover:scale-105">
                <img
                  src={item.logo}
                  alt={item.companyName}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="mt-4 px-4 text-center font-semibold text-sm text-base-content group-hover:text-primary transition-all duration-300">
                {item.companyName}
              </h3>

              <div className="mt-2.5 h-px w-6 bg-primary/40 group-hover:w-12 transition-all duration-500" />
            </div>
          ))}
        </motion.div> */}

        <motion.div
        className="flex gap-8 w-max"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {duplicatedRecruiters.map(
          (item, index) => (
           <div
  key={`${item._id}-${index}`}
  className="
    group
    min-w-55
    h-55

    bg-base-100
    border
    border-base-300

    rounded-full

    shadow-xl

    flex
    flex-col
    items-center
    justify-center

    transition-all
    duration-500

    hover:shadow-2xl
    hover:shadow-primary/20
    hover:-translate-y-3
    hover:scale-105
  "
>
  {/* ROUND LOGO */}

  <div
    className="
      avatar
      transition-all
      duration-700

      group-hover:rotate-6
      group-hover:scale-110
    "
  >
    <div
      className="
        w-28
        rounded-full

        bg-base-200

        ring
        ring-primary
        ring-offset-base-100
        ring-offset-4

        shadow-lg
      "
    >
      <img
  src={item.logo}
  alt={item.companyName}
  className="
  w-full h-full object-cover transition-all duration-500 group-hover:scale-125 group-hover:rotate-6
  "
/>
    </div>
  </div>

  {/* COMPANY NAME */}

  <h3
    className="
      mt-5
      px-4
      text-center

      font-bold
      text-base-content

      transition-all
      duration-500

      group-hover:text-primary
    "
  >
    {item.companyName}
  </h3>

  <div
    className="
      mt-3
      h-1
      w-10
      bg-primary
      rounded-full

      transition-all
      duration-500

      group-hover:w-20
    "
  />
</div>
          )
        )}
      </motion.div>
      </div>
    </section>
  );
}