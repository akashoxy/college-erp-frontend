import React, {
  useEffect,
  useState,
} from "react";

import api from "../../services/api";

import {
  motion,
} from "framer-motion";

import {
  Monitor,
  Cpu,
  GraduationCap,
  CheckCircle,
} from "lucide-react";

import tihlogo from "../../assets/images/tih-logo.png";
import LogoStrip from "../../styles/Logostrip";

export default function ComputerLaboratory() {
  const [labData, setLabData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const fetchData = async () => {
    try {
      const { data } =
  await api.get("/computer-laboratory");

setLabData(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 50,
    },

    show: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.8,
      },
    },
  };

  const stagger = {
    hidden: {},

    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  if (loading) {
    if (!labData) {

  return (

    <div className="hero min-h-screen bg-base-200">

      <div className="hero-content text-center">

        <div>

          <h2 className="text-4xl font-bold">

            Computer Laboratory Information Not Available

          </h2>

        </div>

      </div>

    </div>

  );

}
    return (
      <div className="min-h-screen bg-base-200 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }
  return (
    <>
  <div className="min-h-screen bg-base-200 overflow-hidden">

    {/* ==========================================
        HERO SECTION
    ========================================== */}

    <section className="relative min-h-[90vh]">

      <div className="absolute inset-0">

        <img
          src={
            labData?.bannerImage ||
            "/placeholder.jpg"
          }
          alt="Computer Laboratory"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/70"></div>

        <div className="absolute inset-0 bg-linear-to-r from-primary/30 via-transparent to-secondary/30"></div>

      </div>

      {/* Floating Elements */}

      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
        className="
          absolute
          top-24
          left-10
          hidden
          lg:flex
          w-20
          h-20
          rounded-3xl
          bg-white/10
          backdrop-blur-md
          items-center
          justify-center
        "
      >
        <Cpu size={36} className="text-white" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
        className="
          absolute
          bottom-32
          right-12
          hidden
          lg:flex
          w-20
          h-20
          rounded-3xl
          bg-white/10
          backdrop-blur-md
          items-center
          justify-center
        "
      >
        <Monitor
          size={36}
          className="text-white"
        />
      </motion.div>

      <div
        className="
          relative
          z-10
          min-h-[90vh]
          flex
          items-center
          justify-center
          px-6
        "
      >
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="max-w-5xl text-center"
        >

          <div
            className="
              flex
              justify-center
              items-center
              gap-6
              mb-8
            "
          >

          </div>

          <h1
            className="
              text-5xl
              md:text-7xl
              font-black
              text-white
              leading-tight
            "
          >
            COMPUTER LABORATORY
          </h1>

          <p
            className="
              mt-8
              text-lg
              md:text-xl
              text-white/80
              max-w-3xl
              mx-auto
              leading-relaxed
            "
          >
            A state-of-the-art computing
            environment designed to foster
            innovation, technical excellence,
            practical learning, and advanced
            research for future technology
            professionals.
          </p>

        </motion.div>
      </div>

    </section>

    {/* ==========================================
        ABOUT SECTION
    ========================================== */}

    <section className="py-24">

      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-16"
        >

          <div
            className="
              inline-flex
              items-center
              gap-2
              px-5
              py-2
              rounded-full
              bg-primary/10
              text-primary
              font-semibold
              mb-5
            "
          >
            <GraduationCap size={18} />
            Excellence In Computing
          </div>

          <h2
            className="
              text-4xl
              md:text-5xl
              font-black
              text-base-content
            "
          >
            Computer Laboratory
          </h2>

        </motion.div>

        <div
          className="
            grid
            lg:grid-cols-2
            gap-12
            items-center
          "
        >

          {/* TEXT CARD */}

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
          >

            <div
              className="
                card
                bg-base-100
                border
                border-base-300
                shadow-2xl
              "
            >

              <div className="card-body p-8">

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    mb-5
                  "
                >
                  <div
                    className="
                      p-3
                      rounded-2xl
                      bg-primary/10
                    "
                  >
                    <Monitor
                      className="text-primary"
                    />
                  </div>

                  <h3
                    className="
                      text-2xl
                      font-bold
                      text-base-content
                    "
                  >
                    About The Laboratory
                  </h3>
                </div>

                <p
                  className="
                    text-base-content/80
                    leading-loose
                    whitespace-pre-wrap
                    text-justify
                  "
                >
                  {labData?.paragraph}
                </p>

              </div>

            </div>

          </motion.div>

          {/* IMAGE */}

          <motion.div
            initial={{
              opacity: 0,
              x: 100,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
          >

            <div className="relative">

              <img
                src={
                  labData?.sideImage ||
                  "/placeholder.jpg"
                }
                alt="Laboratory"
                className="
                  w-full
                  h-125
                  object-cover
                  rounded-4xl
                  shadow-2xl
                "
              />

              <div
                className="
                  absolute
                  bottom-6
                  left-6
                  bg-base-100/90
                  backdrop-blur-md
                  rounded-2xl
                  px-6
                  py-4
                  shadow-xl
                "
              >
                <h4
                  className="
                    font-bold
                    text-base-content
                  "
                >
                  Modern Computing Environment
                </h4>

                <p
                  className="
                    text-sm
                    text-base-content/70
                  "
                >
                  Advanced Practical Learning
                </p>

              </div>

            </div>

          </motion.div>

        </div>

      </div>

    </section>
        {/* ==========================================
        FACILITIES SECTION
    ========================================== */}

  <section className="relative py-24 bg-linear-to-b from-base-100 via-base-200 to-base-100 overflow-hidden">

  {/* Background decoration */}

  <div className="absolute inset-0 pointer-events-none">

    <div className="absolute -top-32 left-0 w-96 h-96 rounded-full bg-success/5 blur-3xl" />

    <div className="absolute bottom-0 right-0 w-md h-112 rounded-full bg-primary/5 blur-3xl" />

  </div>

  <div className="relative max-w-7xl mx-auto">

    {/* =======================================
        HEADER
    ======================================= */}

    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="text-center mb-20 px-6"
    >

      <div className="badge badge-success badge-lg gap-2 px-5 py-4">

        <CheckCircle size={18} />

        Laboratory Facilities

      </div>

      <h2 className="mt-6 text-4xl md:text-5xl xl:text-6xl font-black">

        World Class Infrastructure

      </h2>

      <p className="mt-6 max-w-3xl mx-auto text-lg leading-8 text-base-content/70">

        Modern computing resources, advanced software,
        networking laboratories and practical learning
        environments designed for innovation.

      </p>

    </motion.div>

    {/* =======================================
        MARQUEE
    ======================================= */}

    <div className="relative">

      <div className="overflow-hidden py-10">

        <motion.div
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-10 w-max"
        >

          {[...labData.facilities, ...labData.facilities].map(

            (facility, index) => (

              <motion.div
                key={index}
                whileHover={{
                  y: -12,
                  scale: 1.04,
                }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                }}
                className="group w-90 shrink-0"
              >

                <div
                  className="
                    relative
                    h-80
                    rounded-4xl
                    bg-base-100
                    border
                    border-base-300
                    overflow-hidden
                    shadow-xl
                    transition-all
                    duration-500
                    group-hover:border-success
                    group-hover:shadow-success/20
                    group-hover:shadow-2xl
                  "
                >

                  {/* Background */}

                  <div
                    className="
                      absolute
                      inset-0
                      bg-linear-to-br
                      from-success/5
                      via-transparent
                      to-primary/5
                    "
                  />

                  {/* Glow */}

                  <div
                    className="
                      absolute
                      -top-24
                      -right-20
                      w-64
                      h-64
                      rounded-full
                      bg-success/10
                      blur-3xl
                      transition-all
                      duration-700
                      group-hover:scale-150
                    "
                  />

                  <div className="relative h-full flex flex-col justify-between p-8">

                    <div>

                      <div
                        className="
                          w-20
                          h-20
                          rounded-3xl
                          bg-success/10
                          border
                          border-success/20
                          flex
                          items-center
                          justify-center
                          transition-all
                          duration-500
                          group-hover:bg-success
                          group-hover:rotate-12
                        "
                      >

                        <CheckCircle
                          size={36}
                          className="
                            text-success
                            group-hover:text-white
                            transition-all
                          "
                        />

                      </div>

                      <h3 className="mt-8 text-2xl font-black leading-tight">

                        {facility}

                      </h3>

                    </div>

                  </div>

                </div>

              </motion.div>

            )

          )}

        </motion.div>

      </div>

    </div>

  </div>

</section>

    {/* ==========================================
        LABORATORY UNITS
    ========================================== */}

   <section className="py-24 bg-base-200">

  <div className="max-w-7xl mx-auto px-6">

    {/* ==========================================
        SECTION HEADER
    ========================================== */}

    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="text-center mb-16"
    >

      <div className="badge badge-primary badge-lg gap-2 px-5 py-4">

        <Cpu size={18} />

        Laboratory Units

      </div>

      <h2 className="mt-6 text-4xl md:text-5xl font-black">

        Specialized Laboratory Units

      </h2>

      <p className="mt-5 max-w-3xl mx-auto text-lg leading-8 text-base-content/70">

        Dedicated laboratories equipped with modern infrastructure and supervised
        by experienced faculty members to provide students with hands-on
        technical knowledge and practical exposure.

      </p>

    </motion.div>

    {/* ==========================================
        HORIZONTAL SCROLLER
    ========================================== */}

    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="
        flex
        gap-8
        overflow-x-auto
        overflow-y-visible
        scroll-smooth
        snap-x
        snap-mandatory
        px-2
        pt-8
        pb-8
        scrollbar-thin
        scrollbar-thumb-primary
        scrollbar-track-base-300
      "
    >

      {labData?.laboratoryUnits?.map((lab, index) => (

        <motion.div
          key={index}
          variants={fadeUp}
          whileHover={{
            y: -8,
          }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 20,
          }}
          className="
            min-w-97.5
            max-w-97.5
            shrink-0
            snap-center
          "
        >

          <div
            className="
              card
              bg-base-100
              border
              border-base-300
              rounded-3xl
              shadow-xl
              overflow-hidden
              transition-all
              duration-500
              hover:shadow-primary/20
              hover:shadow-2xl
            "
          >

            {/* IMAGE */}

            <div className="relative overflow-hidden">

              <motion.img
                src={lab.labImage || "/placeholder.jpg"}
                alt={lab.labName}
                whileHover={{
                  scale: 1.08,
                }}
                transition={{
                  duration: 0.45,
                }}
                className="
                  w-full
                  h-72
                  object-cover
                  transition-all
                  duration-500
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-linear-to-t
                  from-black/60
                  via-black/10
                  to-transparent
                "
              />

              <div
                className="
                  absolute
                  bottom-5
                  left-5
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-white/90
                    backdrop-blur-md
                    flex
                    items-center
                    justify-center
                  "
                >

                  <Monitor
                    size={22}
                    className="text-primary"
                  />

                </div>

                <div>

                  <h3 className="text-white text-xl font-black">

                    {lab.labName}

                  </h3>

                  <p className="text-white/80 text-sm">

                    Laboratory Unit

                  </p>

                </div>

              </div>

            </div>

            {/* CONTENT */}

            <div className="card-body">

              <div className="space-y-6">

                <div>

                  <p className="text-xs uppercase tracking-[3px] text-base-content/50">

                    Laboratory In-Charge

                  </p>

                  <h4 className="mt-2 text-xl font-bold text-primary">

                    {lab.labTeacher}

                  </h4>

                </div>

                <div>

                  <p className="text-xs uppercase tracking-[3px] text-base-content/50">

                    Designation

                  </p>

                  <p className="mt-2">

                    {lab.designation}

                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase tracking-[3px] text-base-content/50">

                    Qualification

                  </p>

                  <p className="mt-2">

                    {lab.qualification}

                  </p>

                </div>

              </div>

            </div>

          </div>

        </motion.div>

      ))}

    </motion.div>

  </div>

</section>
        {/* ==========================================
        INNOVATION CTA
    ========================================== */}

    <section className="relative py-28 overflow-hidden">

      {/* BACKGROUND EFFECTS */}

      <div className="absolute inset-0 overflow-hidden">

        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
          }}
          className="
            absolute
            top-0
            left-0
            w-96
            h-96
            rounded-full
            bg-primary/10
            blur-3xl
          "
        />

        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
          }}
          className="
            absolute
            bottom-0
            right-0
            w-96
            h-96
            rounded-full
            bg-secondary/10
            blur-3xl
          "
        />

      </div>

      <div className="relative max-w-6xl mx-auto px-6">

        <motion.div
          initial={{
            opacity: 0,
            y: 60,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
          }}
          className="
            card
            bg-linear-to-r
            from-primary
            via-secondary
            to-accent
            text-primary-content
            shadow-2xl
          "
        >

          <div className="card-body text-center py-16 px-8">

            <div
              className="
                flex
                justify-center
                mb-6
              "
            >

              <div
                className="
                  w-24
                  h-24
                  rounded-full
                  overflow-hidden
                  border-4
                  border-white/30
                  shadow-2xl
                "
              >
                <img
                  src={tihlogo}
                  alt="TIH"
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />
              </div>

            </div>

            <h2
              className="
                text-4xl
                md:text-5xl
                font-black
                mb-6
              "
            >
              Empowering Future Innovators
            </h2>

            <p
              className="
                text-lg
                md:text-xl
                max-w-4xl
                mx-auto
                opacity-90
                leading-relaxed
              "
            >
              Our Computer Laboratory provides
              students with a modern learning
              ecosystem where technology,
              creativity, research, and
              practical knowledge converge to
              prepare them for the challenges
              of the digital era.
            </p>

          </div>

        </motion.div>

      </div>

    </section>

  </div>
  <LogoStrip/>
  </>
);
}