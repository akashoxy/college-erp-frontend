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



export default function VisionMission() {
  const [data, setData] = useState(null);
  const [loading, setLoading] =
    useState(true);

  const fetchData = async () => {
    try {
     const res = await api.get("/vision-mission");

setData(res.data?.data || null);

      setData(res.data.data);
    } catch (error) {
    setData(null);
} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getMissionIcon = (
    iconName
  ) => {
    switch (iconName) {
      case "AcademicCapIcon":
        return (
          <AcademicCapIcon className="w-12 h-12 text-primary" />
        );

      case "LightBulbIcon":
        return (
          <LightBulbIcon className="w-12 h-12 text-primary" />
        );

      case "Cog6ToothIcon":
        return (
          <Cog6ToothIcon className="w-12 h-12 text-primary" />
        );

      case "GlobeAltIcon":
        return (
          <GlobeAltIcon className="w-12 h-12 text-primary" />
        );

      default:
        return (
          <AcademicCapIcon className="w-12 h-12 text-primary" />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-base-200 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-base-content">
            No Vision & Mission Data
            Found
          </h2>

          <p className="text-base-content/70">
            Please add content from
            the admin panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="bg-base-200 min-h-screen">
      {/* ====================================== */}
      {/* HERO SECTION */}
      {/* ====================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-linear-to-br
          from-primary/10
          via-base-100
          to-secondary/10
        "
      >
        <div className="absolute inset-0 opacity-20">
          <div
            className="
              absolute
              top-20
              left-20
              w-72
              h-72
              rounded-full
              bg-primary
              blur-3xl
            "
          ></div>

          <div
            className="
              absolute
              bottom-10
              right-10
              w-96
              h-96
              rounded-full
              bg-secondary
              blur-3xl
            "
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.6,
            }}
            className="flex justify-center mb-8"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden  shadow-xl bg-base-100 flex items-center justify-center">
  <img
    src={tihlogo}
    alt="TIH"
    className="w-full h-full object-cover rounded-full"
  />
</div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-base-content">
              {data.heroTitle}
            </h1>

            <p
              className="
                max-w-4xl
                mx-auto
                text-lg
                md:text-xl
                text-base-content/70
              "
            >
              {data.heroDescription}
            </p>
          </motion.div>

          {/* STATISTICS */}

          <div className="grid md:grid-cols-4 gap-6 mt-16">
            {[
              {
                number: "25+",
                title:
                  "Years Excellence",
              },
              {
                number: "5000+",
                title: "Students",
              },
              {
                number: "100+",
                title: "Faculty",
              },
              {
                number: "100%",
                title:
                  "Commitment",
              },
            ].map(
              (item, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay:
                      index * 0.1,
                  }}
                  className="
                    bg-base-100/80
                    backdrop-blur-lg
                    rounded-3xl
                    p-6
                    shadow-lg
                    text-center
                    border border-base-300
                  "
                >
                  <h2
                    className="
                      text-4xl
                      font-black
                      text-primary
                    "
                  >
                    {item.number}
                  </h2>

                  <p className="mt-2 font-medium text-base-content">
                    {item.title}
                  </p>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ====================================== */}
      {/* VISION */}
      {/* ====================================== */}

      <section className="py-24 bg-base-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{
                opacity: 0,
                x: -50,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
            >
              <div
                className="
                  bg-linear-to-br
                  from-primary
                  to-secondary
                  rounded-[40px]
                  h-112.5
                  flex
                  items-center
                  justify-center
                  shadow-2xl
                "
              >
                <AcademicCapIcon className="w-40 h-40 text-white" />
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                x: 50,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
            >
              <span className="badge badge-primary badge-lg mb-4">
                OUR VISION
              </span>

              <h2 className="text-5xl font-black mb-6 text-base-content">
                {data.visionTitle}
              </h2>

              <div className="w-24 h-1 bg-primary rounded-full mb-8"></div>

              <p
                className="
                  text-lg
                  leading-relaxed
                  text-base-content/80
                "
              >
                {
                  data.visionDescription
                }
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================== */}
      {/* MISSIONS */}
      {/* ====================================== */}

      <section className="py-24 bg-base-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4 text-base-content">
              Our Mission
            </h2>

            <p className="text-base-content/70">
              Driving excellence
              through focused goals
              and meaningful action.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.missions?.map(
              (
                mission,
                index
              ) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay:
                      index * 0.1,
                  }}
                  whileHover={{
                    y: -10,
                  }}
                  className="
                    bg-base-100
                    rounded-3xl
                    p-8
                    shadow-xl
                    hover:shadow-2xl
                    transition-all
                    border border-base-300
                  "
                >
                  <div className="mb-6">
                    {getMissionIcon(
                      mission.icon
                    )}
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-base-content">
                    {mission.title}
                  </h3>

                  <p className="text-base-content/70 leading-relaxed">
                    {
                      mission.description
                    }
                  </p>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ====================================== */}
      {/* CORE VALUES */}
      {/* ====================================== */}

      <section className="py-24 bg-base-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-base-content">
              Core Values
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: TrophyIcon,
                title:
                  "Excellence",
              },
              {
                icon: SparklesIcon,
                title:
                  "Innovation",
              },
              {
                icon:
                  ShieldCheckIcon,
                title:
                  "Integrity",
              },
              {
                icon:
                  UserGroupIcon,
                title:
                  "Leadership",
              },
            ].map(
              (item, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  className="
                    bg-base-200
                    rounded-3xl
                    p-8
                    text-center
                    shadow-lg
                    border border-base-300
                  "
                >
                  <item.icon
                    className="
                      w-14
                      h-14
                      mx-auto
                      text-primary
                      mb-5
                    "
                  />

                  <h3 className="text-xl font-bold text-base-content">
                    {item.title}
                  </h3>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ====================================== */}
      {/* CTA */}
      {/* ====================================== */}

      <section
        className="
          py-24
          bg-linear-to-r
          from-primary
          to-secondary
          text-primary-content
        "
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-black mb-6">
            Join Our Academic
            Journey
          </h2>

          <p className="text-xl text-primary-content/80 mb-10">
            Empowering students
            with knowledge,
            innovation, and
            leadership for a
            brighter future.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/admission-procedure" className="btn btn-neutral">
              Explore Programs
            </Link>

            <Link 
              to="/contact"
              className="
                btn
                btn-outline
                text-white
                border-white
                hover:text-black
              "
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}