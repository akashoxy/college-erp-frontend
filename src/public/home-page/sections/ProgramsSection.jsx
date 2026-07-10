
import api from "../../../services/api";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

function ProgramCard({ item, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: EASE }}
      className="group h-full bg-base-100 rounded-3xl overflow-hidden shadow-sm border border-base-300/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/30"
    >
      {/* IMAGE */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />

        <div className="absolute top-5 left-5">
          <span className="inline-block text-[11px] font-semibold tracking-[0.2em] uppercase text-white/90 border border-white/30 backdrop-blur-sm rounded-full px-3 py-1">
            {item.subtitle}
          </span>
        </div>

        <div className="absolute bottom-5 left-5">
          <span className="text-amber-300 text-[11px] font-semibold tracking-[0.2em] uppercase">
            Industry Ready &middot; Placement Support
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-7 flex flex-col h-56">
        <div className="grow">
          <h3 className="font-serif text-2xl font-semibold mb-3 text-base-content">
            {item.title}
          </h3>

          <p className="text-base-content/60 text-sm leading-relaxed line-clamp-4">
            {item.description}
          </p>
        </div>

        <Link
          to={item.cta}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary mt-5 group-hover:gap-3 transition-all duration-300"
        >
          Learn More
          <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    </motion.article>
  );
}

export default function ProgramsSection() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const [bcaRes, mcaRes, bbaRes] = await Promise.all([
          api.get("/bca"),
          api.get("/mca"),
          api.get("/bba"),
        ]);

        setPrograms([
          {
            id: "bca",
            title: "B.C.A",
            subtitle: "Computer Applications",
            description:
              (bcaRes.data?.data?.bcaDescription || "").slice(0, 120) + "...",
            img: bcaRes.data?.data?.image,
            cta: "/bca-main",
          },
          {
            id: "mca",
            title: "M.C.A",
            subtitle: "Master of Computer Applications",
            description:
              (mcaRes.data?.data?.mcaDescription || "").slice(0, 120) + "...",
            img: mcaRes.data?.data?.image,
            cta: "/mca-main",
          },
          {
            id: "bba",
            title: "B.B.A",
            subtitle: "Business Administration",
            description:
              (bbaRes.data?.data?.bbaDescription || "").slice(0, 120) + "...",
            img: bbaRes.data?.data?.image,
            cta: "/bba-main",
          },
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <section className="py-24 md:py-28 px-4 md:px-8 lg:px-16 bg-base-200">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-3 text-primary font-semibold text-xs tracking-[0.35em] uppercase">
            <span className="h-px w-8 bg-primary/50" />
            Academic Excellence
            <span className="h-px w-8 bg-primary/50" />
          </span>

          <h2 className="font-serif text-4xl md:text-5xl font-semibold mt-5 tracking-tight">
            Explore Our Programs
          </h2>

          <p className="max-w-2xl mx-auto mt-4 text-base-content/60 text-sm md:text-base">
            Industry-relevant programs designed to prepare students for
            successful careers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((p, i) => (
            <ProgramCard key={p.id} item={p} index={i} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <span className="font-serif text-lg md:text-xl italic text-base-content/70">
            Programs to launch your career.
          </span>
        </div>
      </div>
    </section>
  );
}