import React, {
  useEffect,
  useState,
} from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  FaAward,
  FaCalendarAlt,
  FaStar,
  FaTrophy,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";
import api from "../../services/api";



export default function AwardsPage() {
  const [awards, setAwards] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [currentSlide, setCurrentSlide] =
    useState(0);

  const [selectedAward, setSelectedAward] =
    useState(null);

  /* =========================
     FETCH AWARDS
  ========================= */

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      setLoading(true);

      const response = await api.get("/awards");

setAwards(
    response.data?.data?.awards || []
);
    } catch (error) {
      console.error(
        "Awards fetch error:",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FEATURED SLIDER
  ========================= */

  const featuredAwards =
    awards.filter(
      (award) => award.featured
    );

  const sliderData =
    featuredAwards.length > 0
      ? featuredAwards
      : awards;

  /* =========================
     AUTO SLIDER
  ========================= */

  useEffect(() => {
    if (!sliderData.length) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === sliderData.length - 1
          ? 0
          : prev + 1
      );
    }, 5000);

    return () =>
      clearInterval(timer);
  }, [sliderData.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === sliderData.length - 1
        ? 0
        : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0
        ? sliderData.length - 1
        : prev - 1
    );
  };

  return (
    <>

      <div className="bg-base-100 min-h-screen">
        {/* =========================
            HERO SECTION
        ========================= */}

        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-secondary/5 to-warning/10"></div>

          <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
            <motion.div
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
              }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <FaTrophy className="text-5xl text-primary" />
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-base-content mb-6">
                Awards &
                <span className="text-primary">
                  {" "}
                  Recognition
                </span>
              </h1>

              <p className="text-lg md:text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
                Celebrating excellence,
                achievements, innovation,
                and outstanding contributions
                made by our institution,
                faculty, and students.
              </p>
            </motion.div>
          </div>
        </section>

        {/* =========================
            FEATURED SLIDER
        ========================= */}

        {!loading &&
          sliderData.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 mb-20">
              <motion.div
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
                className="relative h-137.5 rounded-3xl overflow-hidden shadow-2xl"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{
                      opacity: 0,
                      scale: 1.08,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.7,
                    }}
                    className="absolute inset-0"
                  >
                    <img
                     src={sliderData[currentSlide]?.image}
                      alt={sliderData[currentSlide]?.title}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
                      <div className="badge badge-warning mb-4 gap-2 p-4">
                        <FaStar />
                        Featured Award
                      </div>

                      <h2 className="text-4xl font-bold mb-3">
                        {
                          sliderData[
                            currentSlide
                          ]?.title
                        }
                      </h2>

                      <p className="text-lg opacity-90">
                        Recipient:{" "}
                        {
                          sliderData[
                            currentSlide
                          ]?.recipient
                        }
                      </p>

                      <p className="text-lg opacity-90">
                        Awardee:{" "}
                        {
                          sliderData[
                            currentSlide
                          ]?.awardee
                        }
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <button
                  onClick={prevSlide}
                  className="btn btn-circle absolute left-6 top-1/2 -translate-y-1/2"
                >
                  <FaChevronLeft />
                </button>

                <button
                  onClick={nextSlide}
                  className="btn btn-circle absolute right-6 top-1/2 -translate-y-1/2"
                >
                  <FaChevronRight />
                </button>
              </motion.div>
            </section>
          )}
                  {/* =========================
            AWARDS GALLERY
        ========================= */}

        <section className="max-w-7xl mx-auto px-4 pb-24">
          <motion.div
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
            className="text-center mb-14"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Award Gallery
            </h2>

            <p className="text-base-content/70 max-w-2xl mx-auto">
              Explore the prestigious awards,
              recognitions and achievements
              earned through dedication,
              excellence and innovation.
            </p>
          </motion.div>

          {/* =========================
              LOADING STATE
          ========================= */}

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map(
                (_, index) => (
                  <div
                    key={index}
                    className="card bg-base-100 shadow-xl"
                  >
                    <div className="skeleton h-64 w-full"></div>

                    <div className="card-body">
                      <div className="skeleton h-6 w-3/4"></div>

                      <div className="skeleton h-4 w-full"></div>

                      <div className="skeleton h-4 w-2/3"></div>

                      <div className="skeleton h-4 w-1/2"></div>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : awards.length === 0 ? (
            /* =========================
                EMPTY STATE
            ========================= */

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="text-center py-24"
            >
              <div className="w-32 h-32 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-6">
                <FaAward
                  size={50}
                  className="text-base-content/30"
                />
              </div>

              <h3 className="text-3xl font-bold mb-3">
                No Awards Available
              </h3>

              <p className="text-base-content/60">
                Awards will appear here once
                they are added by the
                administrator.
              </p>
            </motion.div>
          ) : (
            /* =========================
                AWARDS GRID
            ========================= */

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence>
                {awards.map(
                  (award, index) => (
                    <motion.div
                      key={award._id}
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
                          index * 0.05,
                      }}
                      whileHover={{
                        y: -12,
                      }}
                      className="group cursor-pointer"
                      onClick={() =>
                        setSelectedAward(
                          award
                        )
                      }
                    >
                      <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden h-full">
                        {/* =========================
                            IMAGE
                        ========================= */}

                        <figure className="relative h-72 overflow-hidden">
                          <img
                            src={award.image}
                            alt={award.title}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                          />


                          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                          {award.featured && (
                            <motion.div
                              initial={{
                                scale: 0,
                              }}
                              animate={{
                                scale: 1,
                              }}
                              className="absolute top-4 right-4 badge badge-warning gap-2 p-4 shadow-xl"
                            >
                              <FaStar />
                              Featured
                            </motion.div>
                          )}

                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="btn btn-primary btn-circle">
                              <FaAward />
                            </div>
                          </div>
                        </figure>

                        {/* =========================
                            CONTENT
                        ========================= */}

                        <div className="card-body">
                          <h3 className="card-title text-xl group-hover:text-primary transition-colors">
                            {award.title}
                          </h3>

                          <div className="space-y-3 mt-2">
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-primary">
                                Recipient:
                              </span>

                              <span className="text-base-content/80">
                                {
                                  award.recipient
                                }
                              </span>
                            </div>

                            <div className="flex items-start gap-2">
                              <span className="font-bold text-secondary">
                                Awardee:
                              </span>

                              <span className="text-base-content/80">
                                {
                                  award.awardee
                                }
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-base-content/60">
                              <FaCalendarAlt />

                              <span>
                                {new Date(
                                  award.awardDate
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month:
                                      "long",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </div>

                          {award.description && (
                            <p className="mt-4 text-base-content/70 line-clamp-3">
                              {
                                award.description
                              }
                            </p>
                          )}

                          <div className="card-actions justify-end mt-5">
                            <button className="btn btn-outline btn-primary btn-sm">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </div>
          )}
        </section>
                {/* =========================
            AWARD DETAILS MODAL
        ========================= */}

        <AnimatePresence>
          {selectedAward && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() =>
                setSelectedAward(null)
              }
            >
              <motion.div
                initial={{
                  scale: 0.85,
                  opacity: 0,
                  y: 50,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  scale: 0.85,
                  opacity: 0,
                  y: 50,
                }}
                transition={{
                  duration: 0.3,
                }}
                onClick={(e) =>
                  e.stopPropagation()
                }
                className="bg-base-100 rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-base-300"
              >
                {/* =========================
                    MODAL HEADER
                ========================= */}

                <div className="sticky top-0 z-10 bg-base-100 border-b border-base-300 p-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">
                      Award Details
                    </h2>

                    <p className="text-base-content/60">
                      Recognition &
                      Achievement Information
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setSelectedAward(null)
                    }
                    className="btn btn-circle btn-error btn-sm"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* =========================
                    MODAL BODY
                ========================= */}

                <div className="grid lg:grid-cols-2 gap-0">
                  {/* IMAGE SECTION */}

                  <div className="relative h-87.5 lg:h-full min-h-125">
                    <img
                      src={selectedAward.image}
                      alt={selectedAward.title}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent"></div>

                    {selectedAward.featured && (
                      <div className="absolute top-6 right-6">
                        <div className="badge badge-warning gap-2 p-4 shadow-xl">
                          <FaStar />
                          Featured Award
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h2 className="text-3xl font-bold mb-2">
                        {selectedAward.title}
                      </h2>

                      <div className="flex items-center gap-2 text-lg">
                        <FaCalendarAlt />

                        <span>
                          {new Date(
                            selectedAward.awardDate
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month:
                                "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CONTENT SECTION */}

                  <div className="p-8 lg:p-10">
                    <div className="space-y-8">
                      {/* RECIPIENT */}

                      <div className="bg-primary/10 rounded-2xl p-5 border border-primary/20">
                        <h3 className="font-bold text-primary text-lg mb-2">
                          Recipient
                        </h3>

                        <p className="text-xl font-semibold">
                          {
                            selectedAward.recipient
                          }
                        </p>
                      </div>

                      {/* AWARDEE */}

                      <div className="bg-secondary/10 rounded-2xl p-5 border border-secondary/20">
                        <h3 className="font-bold text-secondary text-lg mb-2">
                          Awardee
                        </h3>

                        <p className="text-xl font-semibold">
                          {
                            selectedAward.awardee
                          }
                        </p>
                      </div>

                      {/* AWARD NAME */}

                      <div>
                        <h3 className="text-xl font-bold mb-3 flex items-center gap-3">
                          <FaTrophy className="text-warning" />
                          Award Name
                        </h3>

                        <p className="text-lg">
                          {
                            selectedAward.title
                          }
                        </p>
                      </div>

                      {/* DESCRIPTION */}

                      {selectedAward.description && (
                        <div>
                          <h3 className="text-xl font-bold mb-3">
                            Description
                          </h3>

                          <div className="bg-base-200 rounded-2xl p-5 leading-relaxed">
                            {
                              selectedAward.description
                            }
                          </div>
                        </div>
                      )}

                      {/* DATE */}

                      <div>
                        <h3 className="text-xl font-bold mb-3">
                          Award Date
                        </h3>

                        <div className="flex items-center gap-3 text-lg">
                          <FaCalendarAlt className="text-primary" />

                          <span>
                            {new Date(
                              selectedAward.awardDate
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                weekday:
                                  "long",
                                day: "2-digit",
                                month:
                                  "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      {/* ACTION */}

                      <div className="pt-4">
                        <button
                          onClick={() =>
                            setSelectedAward(
                              null
                            )
                          }
                          className="btn btn-primary btn-wide"
                        >
                          Close Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      
    </>
  );
}