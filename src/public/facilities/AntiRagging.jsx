import React, {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  ShieldAlert,
  BadgeCheck,
  Scale,
  FileWarning,
  Shield,
  Users,
  Phone
} from "lucide-react";

import api from "../../services/api";
import LogoStrip from "../../styles/Logostrip";

/* ==========================================================
   ANIMATION
========================================================== */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

/* ==========================================================
   COMPONENT
========================================================== */

export default function AntiRagging() {
  const [loading, setLoading] =
    useState(true);

    const [paused, setPaused] = useState(false);
    const [pausePoster, setPausePoster] = useState(false);

  const [
    antiRagging,
    setAntiRagging,
  ] = useState(null);

  const iconMap = {
  Shield,
  Scale,
  Users,
  FileWarning,
};

  /* ========================================================
     LOAD DATA
  ======================================================== */

  useEffect(() => {
    loadData();
  }, []);

  const loadData =
    async () => {
      try {
        const { data } =
          await api.get(
            "/anti-ragging"
          );

        setAntiRagging(
          data?.data || null
        );
      } catch (error) {
        setAntiRagging(null);
      } finally {
        setLoading(false);
      }
    };

  /* ========================================================
     LOADING
  ======================================================== */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  /* ========================================================
     EMPTY STATE
  ======================================================== */

  if (!antiRagging) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 px-6">

        <div className="text-center">

          <ShieldAlert
            size={80}
            className="mx-auto text-error mb-6"
          />

          <h2 className="text-4xl font-black">

            Anti Ragging Information

          </h2>

          <p className="mt-4 text-lg text-base-content/70">

            No Anti Ragging information has
            been published yet.

          </p>

        </div>

      </div>
    );
  }

  /* ========================================================
     RETURN
  ======================================================== */

  return (
    <>
    <div className="bg-base-100">

      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <section className="relative min-h-[90vh] flex items-center overflow-hidden">

        {/* Background Image */}

        {antiRagging.heroBackgroundImage ? (

          <img
            src={
              antiRagging.heroBackgroundImage
            }
            alt="Anti Ragging"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />

        ) : (

          <div className="absolute inset-0 bg-base-300" />

        )}

        {/* Dark Overlay */}

        <div className="absolute inset-0 bg-black/65" />

        {/* Gradient */}

        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/45 to-black/20" />

        {/* Floating Glow */}

        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-error/20 blur-3xl" />

        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />

        {/* Hero Content */}

        <div className="relative z-20 w-full">

          <div className="max-w-7xl mx-auto px-6 ">

            <motion.div
  variants={fadeUp}
  initial="hidden"
  animate="visible"
  className="w-full"
>

  <div className="flex justify-start mb-8">

    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">

      <ShieldAlert
        size={22}
        className="text-error"
      />

      <span className="font-semibold text-white">
        Anti Ragging Cell
      </span>

    </div>

  </div>

          <div className="flex flex-col items-center text-center">

  <h1 className="text-4xl md:text-6xl xl:text-7xl font-black text-white leading-tight">

    Zero Tolerance
    <br />

    <span className="text-error">

      Against Ragging

    </span>

  </h1>

  <p className="mt-8 text-lg md:text-xl leading-9 text-white/90 max-w-3xl">

    {antiRagging.heroSubtitle}

  </p>

  <div className="flex flex-wrap justify-center gap-5 mt-12">

    <a
      href="https://www.antiragging.in"
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-error btn-lg rounded-full px-8"
    >
      {antiRagging.reportButtonText ||
        "Report Incident"}
    </a>

    <a
      href="https://www.antiragging.in/complaint_register_form.html"
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-outline btn-lg rounded-full border-white text-white hover:bg-white hover:text-black px-8"
    >
      {antiRagging.complaintButtonText ||
        "Lodge Complaint"}
    </a>

  </div>
</div>


            </motion.div>

          </div>

        </div>

      </section>

      {/* =====================================================
          INTRODUCTION
      ====================================================== */}

      <section className="py-24 bg-base-100">

        <div className="max-w-7xl mx-auto px-6">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-5xl mx-auto"
          >

            <div className="badge badge-error badge-lg mb-6">

              About Anti Ragging

            </div>

            <h2 className="text-4xl md:text-5xl font-black">

              {antiRagging.introductionTitle}

            </h2>

            <p className="mt-8 text-lg leading-9 text-base-content/75">

              {antiRagging.introductionDescription}

            </p>

          </motion.div>

        </div>

      </section>

      {/* =====================================================
          FEATURES
      ====================================================== */}

      {antiRagging.features?.length > 0 && (

        <section className="py-24 bg-base-200">

          <div className="max-w-7xl mx-auto px-6">

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >

              <div className="badge badge-primary badge-lg mb-5">

                Safe Campus

              </div>

              <h2 className="text-4xl md:text-5xl font-black">

                Our Anti Ragging Initiatives

              </h2>

            </motion.div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">

              {antiRagging.features.map(
                (
                  feature,
                  index
                ) => (

                  <motion.div
                    key={index}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay:
                        index * 0.1,
                    }}
                    className="card bg-base-100 border border-base-300 shadow-xl hover:-translate-y-3 hover:shadow-2xl transition-all duration-300"
                  >

                    <div className="card-body items-center text-center">

                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">

                        {(() => {
  const Icon =
    iconMap[feature.icon] || Shield;

  return (
    <Icon
      size={42}
      className="text-primary"
    />
  );
})()}

                      </div>

                      <h3 className="text-2xl font-bold mt-5">

                        {feature.title}

                      </h3>

                      <p className="leading-8 text-base-content/70 mt-2">

                        {
                          feature.description
                        }

                      </p>

                    </div>

                  </motion.div>

                )
              )}

            </div>

          </div>

        </section>

      )}
            {/* =====================================================
          AWARENESS POSTERS
      ====================================================== */}

      {antiRagging.posters?.length > 0 && (

  <section className="py-24 bg-base-100 overflow-hidden">

    <div className="max-w-7xl mx-auto">

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center mb-16 px-6"
      >

        <div className="badge badge-secondary badge-lg mb-5">

          Awareness Campaign

        </div>

        <h2 className="text-4xl md:text-5xl font-black">

          Anti Ragging Awareness Posters

        </h2>

        <p className="mt-5 text-lg text-base-content/70 max-w-3xl mx-auto">

          Creating awareness among students is the
          first step towards maintaining a healthy,
          respectful and ragging-free campus.

        </p>

      </motion.div>

      <div className="relative">

        <motion.div
          className="flex gap-10 w-max py-8"
          animate={
            pausePoster
              ? {}
              : {
                  x: ["0%", "-50%"],
                }
          }
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
        >

          {[...antiRagging.posters, ...antiRagging.posters].map(

            (poster, index) => (

              <motion.div
                key={index}
                onMouseEnter={() => setPausePoster(true)}
                onMouseLeave={() => setPausePoster(false)}
                whileHover={{
                  y: -20,
                  scale: 1.04,
                  rotateY: 10,
                  rotateX: -5,
                  zIndex: 999,
                }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 18,
                }}
                className="
                  group
                  relative
                  w-95
                  shrink-0
                  perspective-distant
                "
              >

                <div
                  className="
                    rounded-3xl
                    bg-base-100
                    border
                    border-base-300
                    shadow-xl
                    overflow-visible
                    transition-all
                    duration-500
                    group-hover:shadow-2xl
                  "
                >

                  {poster.image ? (

                    <div className="relative h-72 bg-base-200 flex items-center justify-center overflow-visible">

  <img
    src={poster.image}
    alt={poster.title}
    loading="lazy"
    className="
      max-w-full
      max-h-full
      object-contain
      rounded-t-3xl
      transition-all
      duration-700
      group-hover:scale-110
      group-hover:-translate-y-6
      group-hover:z-30
    "
  />

</div>

                  ) : (

                    <div className="h-72 rounded-t-3xl bg-base-200 flex items-center justify-center">

                      <FileWarning
                        size={60}
                        className="text-base-content/40"
                      />

                    </div>

                  )}

                 <div className="card-body bg-base-100 relative z-10">

                    <h3 className="text-2xl font-black">

                      {poster.title}

                    </h3>

                    <p className="leading-8 text-base-content/70">

                      {poster.description}

                    </p>

                  </div>

                </div>

              </motion.div>

            )

          )}

        </motion.div>

      </div>

    </div>

  </section>

)}

      {/* =====================================================
          RULES & REGULATIONS
      ====================================================== */}

      {antiRagging.rules?.length > 0 && (

        <section className="py-14 bg-base-200">

          <div >

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >

              <div className="badge badge-warning badge-lg mb-5">

                Rules & Regulations

              </div>

              <h2 className="text-4xl md:text-5xl font-black">

                Anti Ragging Guidelines

              </h2>

            </motion.div>

            <div className="relative overflow-hidden">
            <motion.div
            className="flex gap-8 w-max pl-8 pr-8"
              initial={{ x: 50 }}
          animate={{
            x: [50, "-50%"],
          }}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...antiRagging.rules, ...antiRagging.rules].map((rule, index) => (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{
                    delay: (index % antiRagging.rules.length) * 0.06,
                  }}
                  className="card bg-base-100 border border-base-300 shadow-xl hover:-translate-y-2 transition-all duration-300 w-137.5 shrink-0"
                >
                  <div className="card-body">
                    <div className="flex gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center shrink-0">
                        <Scale
                          size={30}
                          className="text-warning"
                        />
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold">
                          Rule {(index % antiRagging.rules.length) + 1}
                        </h3>

                        <p className="mt-4 leading-8 text-base-content/75">
                          {rule}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          </div>

        </section>

      )}

      {/* =====================================================
          COMMITTEE MEMBERS
      ====================================================== */}

      {antiRagging.committeeMembers?.length > 0 && (

        <section className="py-24 bg-base-100">

          <div className="max-w-7xl mx-auto px-6">

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >

              <div className="badge badge-primary badge-lg mb-5">

                {antiRagging.committeeTitle ||
                  "Committee"}

              </div>

              <h2 className="text-4xl md:text-5xl font-black">

                Anti Ragging Committee

              </h2>

              {antiRagging.committeeDescription && (

                <p className="mt-6 text-lg text-base-content/70 max-w-3xl mx-auto leading-8">

                  {antiRagging.committeeDescription}

                </p>

              )}

            </motion.div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

              {antiRagging.committeeMembers.map(
                (member, index) => (

                  <motion.div
                    key={index}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.08,
                    }}
                    className="card bg-base-100 border border-base-300 shadow-xl overflow-hidden hover:-translate-y-3 hover:shadow-2xl transition-all duration-300"
                  >

                    <figure className="bg-base-200 h-80">

                      {member.image ? (

                        <img
                          src={member.image}
                          alt={member.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />

                      ) : (

                        <div className="flex items-center justify-center w-full h-full">

                          <ShieldAlert
                            size={70}
                            className="text-base-content/30"
                          />

                        </div>

                      )}

                    </figure>

                    <div className="card-body text-center">

                      <h3 className="text-2xl font-black">

                        {member.name}

                      </h3>

                      <div className="badge badge-primary badge-outline mx-auto">

                        {member.designation}

                      </div>

                      {member.phone && (

  <a
    href={`tel:${member.phone}`}
    className="
      btn
      btn-primary
      btn-outline
      mt-5
      rounded-full
      px-5
      gap-2
      hover:scale-105
      transition-all
      duration-300
    "
  >

    <Phone size={18} strokeWidth={2.2} />

    <span>{member.phone}</span>

  </a>

)}

                    </div>

                  </motion.div>

                )
              )}

            </div>

          </div>

        </section>

      )}

      
            {/* =====================================================
          CONTACT & HELPLINE
      ====================================================== */}

      <section className="py-24 bg-base-200">

        <div className="max-w-7xl mx-auto px-6">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >

            <div className="badge badge-error badge-lg mb-5">

              Contact Us

            </div>

            <h2 className="text-4xl md:text-5xl font-black">

              Need Immediate Assistance?

            </h2>

            <p className="mt-6 text-lg text-base-content/70 max-w-3xl mx-auto leading-8">

              If you experience or witness any incident of
              ragging, contact the Anti Ragging Cell
              immediately. Every complaint is handled with
              complete confidentiality and strict action.

            </p>

          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">

            {/* HELPLINE */}

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="card bg-base-100 border border-base-300 shadow-xl hover:-translate-y-2 transition-all duration-300"
            >

              <div className="card-body text-center">

                <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto">

                  <ShieldAlert
                    size={42}
                    className="text-error"
                  />

                </div>

                <h3 className="text-3xl font-black mt-5">

                  Helpline Number

                </h3>

                <p className="text-base-content/70">

                  Available During Working Hours

                </p>

                <div className="divider"></div>

                {antiRagging.helplineNumber ? (

                  <a
                    href={`tel:${antiRagging.helplineNumber}`}
                    className="btn btn-error btn-lg rounded-full"
                  >

                    {antiRagging.helplineNumber}

                  </a>

                ) : (

                  <span className="text-base-content/50">

                    Not Available

                  </span>

                )}

              </div>

            </motion.div>

            {/* EMAIL */}

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{
                delay: 0.1,
              }}
              className="card bg-base-100 border border-base-300 shadow-xl hover:-translate-y-2 transition-all duration-300"
            >

              <div className="card-body text-center">

                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">

                  <BadgeCheck
                    size={42}
                    className="text-primary"
                  />

                </div>

                <h3 className="text-3xl font-black mt-5">

                  Official Email

                </h3>

                <p className="text-base-content/70">

                  Report incidents or seek guidance

                </p>

                <div className="divider"></div>

                {antiRagging.officialEmail ? (

                  <a
                    href={`mailto:${antiRagging.officialEmail}`}
                    className="btn btn-primary btn-lg rounded-full break-all"
                  >

                    {antiRagging.officialEmail}

                  </a>

                ) : (

                  <span className="text-base-content/50">

                    Not Available

                  </span>

                )}

              </div>

            </motion.div>

          </div>

        </div>

      </section>

      {/* =====================================================
          NATIONAL ANTI RAGGING PORTAL
      ====================================================== */}

      <section className="py-24 bg-base-100">

        <div className="max-w-6xl mx-auto px-6">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="card bg-primary text-primary-content shadow-2xl overflow-hidden"
          >

            <div className="card-body text-center py-16">

              <FileWarning
                size={70}
                className="mx-auto mb-6"
              />

              <h2 className="text-4xl md:text-5xl font-black">

                Say NO to Ragging

              </h2>

              <p className="mt-8 max-w-3xl mx-auto text-lg leading-9 opacity-90">

                Ragging is a criminal offence and is
                strictly prohibited. Our institution is
                committed to providing a safe, respectful
                and inclusive environment for every student.

              </p>

              <div className="flex flex-wrap justify-center gap-5 mt-10">

                <a
                  href="https://www.antiragging.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-error btn-lg rounded-full px-8"
                >

                  {antiRagging.reportButtonText ||
                    "Report Incident"}

                </a>

                <a
                  href="https://www.antiragging.in/complaint_register_form.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-lg rounded-full px-8"
                >

                  {antiRagging.complaintButtonText ||
                    "Lodge Complaint"}

                </a>

              </div>

            </div>

          </motion.div>

        </div>

      </section>

    </div>
    <LogoStrip/>
    </>
  );

}