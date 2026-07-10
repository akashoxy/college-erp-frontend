import React from "react";
import { motion } from "framer-motion";

import heroImg from "../../../assets/images/tih-logo.png";
import noRagging from "../../../assets/amenities/raging.png";
import { Link } from "react-router-dom";

const programs = [
  {
    stream: "BBA",
    duration: "4 Years",
    desc: "Business leadership, management principles, and industry exposure.",
    path:"/bba"
  },
  {
    stream: "BCA",
    duration: "4 Years",
    desc: "Core computing, programming, and software development foundations.",
    path:"/bca"
  },
  {
    stream: "MCA",
    duration: "2 Years",
    desc: "Advanced computing, research orientation, and professional readiness.",
    path:"/mca"
  },
];

export default function AcademicUnit() {
  return (
    <>
      {/* HERO */}
        <section className="relative bg-base-200 overflow-hidden">

  {/* HERO IMAGE (BACKGROUND LAYER) */}
  <div className="absolute inset-0 flex justify-center pt-8 z-0">
    <img
      src={heroImg}
      alt="Academic Programs"
      className="w-56 h-56 md:w-72 md:h-72 rounded-full object-contain
                 opacity-15 ring ring-primary/30 p-4 bg-base-100 shadow-xl"
    />
  </div>

  {/* HERO CONTENT (FRONT LAYER) */}
  <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 text-center">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-4xl md:text-6xl font-extrabold text-primary"
    >
      Academic Programs
    </motion.h1>

    <p className="mt-6 max-w-3xl mx-auto text-lg text-base-content/80 font-bold">
      Empowering students with innovation, mentorship, and future-ready
      education.
    </p>
  </div>

</section>



      {/* DESCRIPTION */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="prose max-w-none"
        >
          <h2 className="text-5xl mb-5">Your Path Starts Here !!</h2>
          <p className="font-bold text-lg">
            At Techno India Hooghly, education goes beyond textbooks. Our academic
            programs are designed to meet modern industry needs while fostering
            innovation, research, and leadership.Breaking away from traditional teaching, we embrace cutting-edge tools, interactive learning, and a future-ready curriculum tailored to meet real industry demands. Whether you're passionate about Engineering, Science, Computer Applications, or Management — Techno India opens the door to a world of opportunities.
          </p>
        </motion.div>
      </section>

      {/* PROGRAM CARDS */}
      <section className="bg-base-100 py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-5 gap-12 items-center">

          {/* LEFT IMAGE */}
          <motion.img
            src={noRagging}
            alt="Ragging Free Campus"
            className="mx-auto w-32 h-32 rounded-full ring ring-primary/30 p-2 lg:col-span-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          />

          {/* CARDS */}
          <div className="lg:col-span-3 grid md:grid-cols-2 gap-8">
            {programs.map((program) => (
              <motion.div
                key={program.stream}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="card bg-base-200 shadow-lg border   border-base-300"
              >
                <Link to={program.path}> 
                <div className="card-body">
                  <h3 className="text-2xl font-bold text-primary">
                    {program.stream}
                  </h3>

                  <p className="text-sm opacity-80">
                    {program.desc}
                  </p>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="badge badge-outline badge-primary">
                      {program.duration}
                    </span>

                    <Link to="/admission"><button className="btn btn-sm btn-primary">
                      Enquire Now
                    </button></Link>
                  </div>
                </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* RIGHT IMAGE */}
          <motion.img
            src={noRagging}
            alt="Ragging Free Campus"
            className="mx-auto w-32 h-32 rounded-full ring ring-primary/30 p-2 lg:col-span-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </section>
    </>
  );
}
