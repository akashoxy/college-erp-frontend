import { useEffect, useState } from "react";
import PageState from "../../components/common/PageState";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Target,
  Briefcase,
  BookOpen,
  Clock3,
  BadgeCheck,
} from "lucide-react";


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


const Bca = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

const loadData = async () => {
  try {
    setLoading(true);
    setError(false);

   const res = await api.get("/bca");

setData(res.data?.data || null);

  } catch (err) {
    setError(true);
}
 finally {
    setLoading(false);
  }
};

 if (loading) {
  return <PageState type="loading" />;
}

if (error) {
  return (
    <PageState
      type="error"
      retry={loadData}
    />
  );
}

if (!data) {
  return <PageState type="empty" />;
}

  return (
    
    <div className="bg-base-200">

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden">

  <div className="absolute inset-0">

    <img
      src={data.image}
      alt="BCA Banner"
      className="w-full h-full object-cover"
    />

    <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-black/40"></div>

  </div>

  <div className="relative z-10">

    <div className="max-w-7xl mx-auto px-6 py-32">

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="max-w-3xl"
      >

        <div className="badge badge-primary badge-lg mb-6">

          About Programme

        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">

          Bachelor of
          <br />
          Computer Applications

        </h1>

       <div className="flex flex-wrap gap-5 mt-10">

  {/* Duration */}

  <div className="card bg-white/10 backdrop-blur-xl border border-white/20 w-70 shadow-xl hover:scale-[1.03] transition-all duration-300">

    <div className="card-body py-5 px-6">

      <div className="flex items-center gap-5">

        <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">

          <Clock3
            size={28}
            className="text-primary"
          />

        </div>

        <div>

          <p className="text-white/60 text-sm uppercase tracking-wider">

            Duration

          </p>

          <h3 className="text-white text-2xl font-black mt-1">

            {data.duration}

          </h3>

        </div>

      </div>

    </div>

  </div>

  {/* Eligibility */}

  <div className="card bg-white/10 backdrop-blur-xl border border-white/20 w-70 shadow-xl hover:scale-[1.03] transition-all duration-300">

    <div className="card-body py-5 px-6">

      <div className="flex items-center gap-5">

        <div className="w-14 h-14 rounded-2xl bg-success/20 flex items-center justify-center shrink-0">

          <BadgeCheck
            size={28}
            className="text-success"
          />

        </div>

        <div>

          <p className="text-white/60 text-sm uppercase tracking-wider">

            Eligibility

          </p>

          <h3 className="text-white text-2xl font-black mt-1">

            {data.eligibility}

          </h3>

        </div>

      </div>

    </div>

  </div>

</div>

        <div className="flex flex-wrap gap-4 mt-10">

          <Link
            to="/admission-form"
            className="btn btn-primary btn-lg"
          >
            Apply Now
          </Link>

          <Link
            to="/syllabus"
            className="btn btn-outline btn-lg text-white border-white hover:text-base-content"
          >
            Syllabus
          </Link>

        </div>

      </motion.div>

    </div>

  </div>

      </section>

      {/* ====================================================== */}
      {/* ABOUT */}
      {/* ====================================================== */}

      <section className="py-20 bg-base-100">

        <div className="max-w-7xl mx-auto px-6">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-14 items-center"
          >

            <motion.img
              initial={{
                opacity: 0,
                scale: .92,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: .6,
              }}
              viewport={{ once: true }}
              src={data.image}
              alt="BCA"
              className="rounded-3xl shadow-2xl w-full object-cover"
            />

            <div>

              <div className="badge badge-secondary badge-lg mb-5">
                About Programme
              </div>

              <h2 className="text-4xl font-black mb-6">

                Bachelor of Computer Applications

              </h2>

              <p className="leading-9 text-lg text-base-content/80 whitespace-pre-line">

                {data.bcaDescription}

              </p>

            </div>

          </motion.div>

        </div>

      </section>
            {/* ====================================================== */}
      {/* OBJECTIVES */}
      {/* ====================================================== */}

      <section className="py-20 bg-base-200">

        <div className="max-w-7xl mx-auto px-6">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >

            <div className="badge badge-primary badge-lg mb-5">
              Objectives
            </div>

            <h2 className="text-4xl font-black">
              Programme Objectives
            </h2>

          </motion.div>

        <div className="marquee py-5">

  <div className="marquee-track-normal">

    {[...data.objectives, ...data.objectives].map(
      (item,index)=>(
        <div
          key={index}
          className="card bg-base-100 border border-base-300 shadow-xl  w-95 shrink-0 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
        >

          <div className="card-body">

            <div className="w-14 h-14 rounded-2xl bg-primary text-primary-content flex items-center justify-center">

              <Target size={28}/>

            </div>

            <h3 className="font-bold text-xl mt-5">

              Objective {(index % data.objectives.length)+1}

            </h3>

            <p className="leading-8 text-base-content/75 mt-3">

              {item}

            </p>

          </div>

        </div>
      )
    )}

  </div>

</div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* VALUE ADDED PROGRAMS */}
      {/* ====================================================== */}

      <section className="py-20 bg-base-100">

        <div className="max-w-7xl mx-auto px-6">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >

            <div className="badge badge-secondary badge-lg mb-5">
              Value Added Programs
            </div>

            <h2 className="text-4xl font-black">
              Professional Development
            </h2>

          </motion.div>

          <div className="marquee py-5">

          <div className="marquee-track-normal">

            {[
              ...data.valueAddedPrograms,
              ...data.valueAddedPrograms,
            ].map((item, index) => (

              <div
                key={index}
                className="card bg-base-200 border border-base-300 shadow-xl w-85 rounded-3xl shrink-0 hover:-translate-y-3 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(0,0,0,.18)] transition-all duration-300"
              >

                <div className="card-body">

                  <div className="flex items-center gap-5">

                    <div className="w-16 h-16 rounded-2xl bg-secondary text-secondary-content flex items-center justify-center">

                      <BookOpen size={28} />

                    </div>

                    <div>

                      <h3 className="text-2xl font-black">

                        Program{" "}
                        {(index %
                          data.valueAddedPrograms.length) +
                          1}

                      </h3>

                      <p className="text-base-content/60">

                        Professional Development

                      </p>

                    </div>

                  </div>

                  <div className="divider"></div>

                  <p className="leading-8 text-base-content/75">

                    {item}

                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* JOB PROSPECTS */}
      {/* ====================================================== */}

      <section className="py-20 bg-base-200">

        <div className="max-w-7xl mx-auto px-6">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >

            <div className="badge badge-accent badge-lg mb-5">
              Career Opportunities
            </div>

            <h2 className="text-4xl font-black">
              Job Prospects
            </h2>

          </motion.div>

         <div className="marquee py-5">

  <div className="marquee-track-normal">

    {[...data.jobProspects, ...data.jobProspects].map(
      (item, index) => (

        <div
          key={index}
          className="card bg-base-100 border border-base-300 shadow-xl w-95 md:w-100 rounded-3xl shrink-0 hover:-translate-y-3 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(0,0,0,.18)] transition-all duration-300"
        >

          <div className="card-body">

            <div className="flex items-center gap-5">

              <div className="w-16 h-16 rounded-2xl bg-accent text-accent-content flex items-center justify-center">

                <Briefcase size={30} />

              </div>

              <div>

                <h3 className="text-2xl font-black">

                  Career Option{" "}
                  {(index % data.jobProspects.length) + 1}

                </h3>

                <p className="text-base-content/60">

                  Career Opportunities

                </p>

              </div>

            </div>

            <div className="divider"></div>

            <p className="leading-8 text-base-content/75">

              {item}

            </p>

          </div>

        </div>

      )
    )}

  </div>

</div>

        </div>

      </section>
            {/* ====================================================== */}
      {/* PLACEMENT ASSISTANCE */}
      {/* ====================================================== */}

      <section className="py-20 bg-base-100">

        <div className="max-w-7xl mx-auto px-6">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="card bg-base-200 border border-base-300 shadow-2xl overflow-hidden"
          >

            <div className="grid lg:grid-cols-2 items-center">

              <div className="p-8 lg:p-12">

                <div className="badge badge-success badge-lg mb-5">
                  Placement Assistance
                </div>

                <h2 className="text-4xl font-black mb-6">
                  Career Support
                </h2>

                <p className="leading-9 text-lg text-base-content/80 whitespace-pre-line">

                  {data.placementAssistance}

                </p>

              </div>

              <motion.div
                initial={{
                  opacity: 0,
                  scale: .95,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: .6,
                }}
                viewport={{ once: true }}
              >

                <img
                  src={data.image}
                  alt="Placement"
                  className="w-full h-full min-h-95 object-cover"
                />

              </motion.div>

            </div>

          </motion.div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* COURSE DETAILS */}
      {/* ====================================================== */}

      <section className="py-20 bg-base-200">

        <div className="max-w-7xl mx-auto px-6">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="card bg-base-100 shadow-2xl border border-base-300"
          >

            <div className="card-body lg:p-10">

              <div className="flex items-center gap-4 mb-8">

                <BookOpen
                  size={42}
                  className="text-primary"
                />

                <div>

                  <h2 className="text-4xl font-black">
                    Course Details
                  </h2>

                  <p className="text-base-content/60 mt-1">
                    Complete Programme Information
                  </p>

                </div>

              </div>

              <div className="divider"></div>

              <p className="leading-10 text-lg whitespace-pre-line text-base-content/80">

                {data.courseDetails}

              </p>

            <div className="mt-10 flex flex-wrap gap-4">

  <Link
    to="/syllabus"
    className="btn btn-primary btn-lg"
  >
    <BookOpen size={20} />
    Syllabus
  </Link>

  <Link
    to="/fees-structure"
    className="btn btn-secondary btn-lg"
  >
    💰 Fee Structure
  </Link>

  <Link
    to="/admission-form"
    className="btn btn-accent btn-lg"
  >
    🎓 Apply Now
  </Link>

</div>

            </div>

          </motion.div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* COURSE INFORMATION */}
      {/* ====================================================== */}

      <section className="py-20 bg-base-100">

        <div className="max-w-5xl mx-auto px-6">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >

            <div className="text-center mb-12">

              <div className="badge badge-primary badge-lg mb-5">
                Course Information
              </div>

              <h2 className="text-4xl font-black">
                Programme Information
              </h2>

            </div>

            <div className="grid md:grid-cols-2 gap-8">

              <div className="card bg-base-200 border border-base-300 shadow-xl hover:shadow-2xl transition-all">

                <div className="card-body items-center text-center">

                  <Clock3
                    size={45}
                    className="text-primary"
                  />

                  <h3 className="text-2xl font-bold mt-3">
                    Duration
                  </h3>

                  <p className="text-lg text-base-content/75">

                    {data.duration}

                  </p>

                </div>

              </div>

              <div className="card bg-base-200 border border-base-300 shadow-xl hover:shadow-2xl transition-all">

                <div className="card-body items-center text-center">

                  <BadgeCheck
                    size={45}
                    className="text-success"
                  />

                  <h3 className="text-2xl font-bold mt-3">
                    Eligibility
                  </h3>

                  <p className="text-lg text-base-content/75">

                    {data.eligibility}

                  </p>

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </section>

    </div>
  );
};

export default Bca;