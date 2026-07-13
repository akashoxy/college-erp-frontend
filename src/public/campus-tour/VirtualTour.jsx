
import React from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkedAlt,
  FaUniversity,
  FaBookOpen,
  FaLaptopCode,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";

import tihlogo from "../../assets/images/tih-logo.png";
import ragging from "../../assets/images/ragging.png";
import radio from "../../assets/images/radio.png";
import wifi from "../../assets/images/wifi.png";
import LogoStrip from "../../styles/Logostrip";


/* ================= ANIMATIONS ================= */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const stats = [
  {
    value: "25+",
    label: "Years of Excellence",
  },
  {
    value: "5000+",
    label: "Students",
  },
  {
    value: "100+",
    label: "Faculty Members",
  },
  {
    value: "95%",
    label: "Placement Support",
  },
];

const features = [
  {
    icon: <FaUniversity />,
    title: "Academic Buildings",
    description:
      "Explore modern classrooms, seminar halls and academic infrastructure.",
  },
  {
    icon: <FaLaptopCode />,
    title: "Advanced Laboratories",
    description:
      "Visit state-of-the-art computer and research laboratories virtually.",
  },
  {
    icon: <FaBookOpen />,
    title: "Central Library",
    description:
      "Walk through our knowledge hub with thousands of books and resources.",
  },
  {
    icon: <FaUsers />,
    title: "Student Life",
    description:
      "Discover clubs, activities, common rooms and vibrant campus culture.",
  },
];

const VirtualTour = () => {
  return (
    <>


      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary/10 via-base-100 to-secondary/10">
        {/* Background Blur Effects */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="badge badge-primary badge-lg mb-6 p-4"
            >
              360° Interactive Campus Experience
            </motion.div>

            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex justify-center mb-8"
            >
              <img
                src={tihlogo}
                alt="College Logo"
               className="w-32 h-32 object-cover rounded-full"
              />
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-black text-base-content"
            >
              Virtual Campus Tour
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="max-w-3xl mx-auto mt-6 text-lg md:text-xl text-base-content/70"
            >
              Experience Techno College Hooghly from anywhere in the world.
              Explore classrooms, laboratories, library, student facilities and
              campus life through our immersive virtual experience.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 mt-10"
            >
              <a
                href="#virtual-tour"
                className="btn btn-primary btn-lg"
              >
                Start Tour
                <FaArrowRight />
              </a>

              <a
                href="#features"
                className="btn btn-outline btn-lg"
              >
                Explore Campus
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="bg-base-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{
                  y: -8,
                }}
                className="card bg-base-100 shadow-xl border border-base-300"
              >
                <div className="card-body text-center">
                  <h2 className="text-4xl font-black text-primary">
                    {item.value}
                  </h2>
                  <p className="font-medium text-base-content/70">
                    {item.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= INTRO ================= */}
      <section className="bg-base-200 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold"
          >
            Discover Our Campus
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-base-content/70"
          >
            Walk through classrooms, laboratories, library, common room and
            student facilities. Experience our campus environment digitally
            before your visit.
          </motion.p>
        </div>
      </section>

      {/* ================= VIRTUAL TOUR ================= */}
      <section
        id="virtual-tour"
        className="bg-base-100 py-20"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            className="bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden"
          >
            <div className="p-8 text-center border-b border-base-300">
              <div className="flex justify-center mb-4">
                <FaMapMarkedAlt className="text-4xl text-primary" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold">
                Live Campus Experience
              </h2>

              <p className="mt-4 text-base-content/70 max-w-2xl mx-auto">
                Explore every corner of Techno College Hooghly through our
                immersive Google Street View integration.
              </p>
            </div>

            <div className="aspect-video">
              <iframe
                title="Virtual Campus Tour"
                src="https://www.google.com/maps/embed?pb=!4v1767125287419!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ2t2N1BzSlE.!2m2!1d22.89213823097709!2d88.38187588478195!3f284.25!4f-6.42!5f0.4"
                className="w-full h-full"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-primary text-primary-content">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black"
          >
            Ready To Visit Us?
          </motion.h2>

          <p className="mt-6 text-lg opacity-90">
            Experience innovation, excellence and opportunities at
            Techno College Hooghly.
          </p>

          <div className="flex justify-center gap-4 mt-10 flex-wrap">
            <button className="btn btn-neutral btn-lg">
              Apply Now
            </button>

            <button className="btn btn-outline btn-lg text-white border-white hover:text-black">
              Contact Us
            </button>
          </div>
        </div>
      </section>
      <LogoStrip/>
    </>
  );
};

export default VirtualTour;

