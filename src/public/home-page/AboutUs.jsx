import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";


export default function AboutUs() {
  const [aboutData, setAboutData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const res = await api.get("/about-us");
      setAboutData(res.data?.data || {});
    } catch (error) {
    setError("Failed to load About Us information");
} finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>

        <div className="min-h-screen flex justify-center items-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>

     
      </>
    );
  }

  if (error) {
    return (
      <>

        <div className="min-h-screen flex justify-center items-center px-6">
          <div className="alert alert-error max-w-md">
            <span>{error}</span>
          </div>
        </div>

        
      </>
    );
  }

  if (!aboutData || Object.keys(aboutData).length === 0) {
    return (
      <>
  
        <div className="min-h-screen flex justify-center items-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              About Us Information Not Available
            </h2>

            <p className="text-base-content/70">
              Please add content from the Admin CMS.
            </p>
          </div>
        </div>

       
      </>
    );
  }

  return (
    <>

      <section className="bg-base-100 overflow-hidden">
        {/* HERO SECTION */}

        <div className="relative overflow-hidden bg-linear-to-br from-primary/10 via-base-100 to-secondary/10">
          <div className="absolute inset-0 opacity-10 overflow-hidden">
            <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full blur-3xl"></div>

            <div className="absolute bottom-20 right-20 w-72 h-72 bg-secondary rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-primary"
            >
              {aboutData.heroTitle || "About Us"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto mt-6 text-lg text-base-content/70 leading-relaxed"
            >
              {aboutData.heroDescription}
            </motion.p>
          </div>
        </div>

        {/* CAMPUS SECTION */}

        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {aboutData.campusImage ? (
                <img
                  src={aboutData.campusImage}
                  alt={aboutData.campusTitle}
                  loading="lazy"
                  className="rounded-3xl shadow-2xl border border-base-300 w-full h-125 object-cover"
                />
              ) : (
                <div className="h-125 rounded-3xl bg-base-200 flex items-center justify-center">
                  <span className="text-base-content/50">
                    No Campus Image Available
                  </span>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="badge badge-primary badge-lg mb-4">
                Our Campus
              </div>

              <h2 className="text-4xl font-bold mb-6">
                {aboutData.campusTitle}
              </h2>

              <p className="text-base-content/80 leading-relaxed mb-5">
                {aboutData.campusDescription1}
              </p>

              <p className="text-base-content/80 leading-relaxed">
                {aboutData.campusDescription2}
              </p>
            </motion.div>
          </div>
        </div>

        {/* VISION SECTION */}

        <div className="bg-base-200 py-24">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="badge badge-secondary badge-lg mb-4">
                Vision & Mission
              </div>

              <h2 className="text-4xl font-bold mb-8">
                {aboutData.visionTitle}
              </h2>

              <p className="text-lg leading-relaxed text-base-content/80 mb-6">
                {aboutData.visionDescription1}
              </p>

              <p className="text-lg leading-relaxed text-base-content/80">
                {aboutData.visionDescription2}
              </p>
            </motion.div>
          </div>
        </div>

        {/* PRINCIPAL MESSAGE */}

        {/* PRINCIPAL MESSAGE */}

<div className="max-w-7xl mx-auto px-6 py-24">
  <div className="grid lg:grid-cols-2 gap-16 items-center">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="card bg-base-200 border border-base-300 shadow-xl">
        <div className="card-body p-8">
          <h2 className="card-title text-3xl mb-6">
            Principal's Message
          </h2>

          <blockquote
            className="
              italic
              text-lg
              border-l-4
              border-primary
              pl-5
              text-base-content/80
            "
          >
            "{aboutData.principalQuote}"
          </blockquote>

          <p className="mt-6 text-base-content/80 leading-relaxed">
            {aboutData.principalMessage}
          </p>
        </div>
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      {aboutData.principalImage ? (
        <img
          src={aboutData.principalImage}
          alt={aboutData.principalName}
          loading="lazy"
          className="
            w-72
            h-72
            object-cover
            rounded-3xl
            shadow-2xl
            mx-auto
            border-4
            border-base-100
          "
        />
      ) : (
        <div
          className="
            w-72
            h-72
            rounded-3xl
            bg-base-200
            border border-base-300
            mx-auto
            flex
            items-center
            justify-center
          "
        >
          <span className="text-base-content/50">
            No Principal Image
          </span>
        </div>
      )}

      <h3 className="mt-6 text-2xl font-bold">
        {aboutData.principalName}
      </h3>

      <p className="text-base-content/70">
        {aboutData.principalDesignation}
      </p>
    </motion.div>
  </div>
</div>

        {/* HIGHLIGHTS */}

        <div className="bg-primary text-primary-content py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <h3 className="text-5xl font-bold">20+</h3>
                <p className="mt-3">Years of Excellence</p>
              </div>

              <div>
                <h3 className="text-5xl font-bold">5000+</h3>
                <p className="mt-3">Students Educated</p>
              </div>

              <div>
                <h3 className="text-5xl font-bold">100+</h3>
                <p className="mt-3">Faculty Members</p>
              </div>

              <div>
                <h3 className="text-5xl font-bold">95%</h3>
                <p className="mt-3">Placement Support</p>
              </div>
            </div>
          </div>
        </div>

        {/* CLOSING MESSAGE */}

        <div className="bg-base-200 py-24">
          <motion.div
            className="max-w-5xl mx-auto px-6 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-8">
              Our Commitment
            </h2>

            <p className="text-xl leading-relaxed text-base-content/80">
              {aboutData.closingMessage}
            </p>
          </motion.div>
        </div>
      </section>

   
    </>
  );
}