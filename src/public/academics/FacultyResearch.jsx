import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  Library,
  Award,
  Search,
  BookOpen,
} from "lucide-react";



export default function FacultyResearch() {
  /* ===============================
     STATES
  =============================== */

  const [facultyData, setFacultyData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedFaculty, setSelectedFaculty] =
    useState(null);

  /* ===============================
     FETCH DATA
  =============================== */

  const fetchFacultyData = async () => {
    try {
      setLoading(true);

    const res = await api.get("/faculty-research");

setFacultyData(res.data?.data || []);
    } catch (error) {
      console.error(
        "Faculty Fetch Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyData();
  }, []);

  /* ===============================
     SEPARATE DATA
  =============================== */

  const facultyMembers =
    facultyData.filter(
      (item) =>
        item.category === "faculty"
    );

  const labStaff =
    facultyData.filter(
      (item) =>
        item.category === "lab"
    );

  const libraryStaff =
    facultyData.filter(
      (item) =>
        item.category === "library"
    );

  /* ===============================
     STATS
  =============================== */

  const stats = useMemo(() => {
    const publicationCount =
      facultyMembers.reduce(
        (acc, faculty) =>
          acc +
          (faculty.publications?.length || 0),
        0
      );

    return {
      faculty: facultyMembers.length,

      lab: labStaff.length,

      library: libraryStaff.length,

      publications: publicationCount,
    };
  }, [
    facultyMembers,
    labStaff,
    libraryStaff,
  ]);

  return (
    <>

      {/* ==================================
          HERO SECTION
      ================================== */}

      <section className="relative overflow-hidden bg-linear-to-br from-primary/10 via-base-100 to-secondary/10">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary blur-3xl"></div>

          <div className="absolute bottom-20 right-20 w-72 h-72 rounded-full bg-secondary blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24">
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
            <div className="badge badge-primary badge-lg mb-6">
              Academic Excellence
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-base-content mb-6">
              Faculty &
              <span className="text-primary">
                {" "}
                Research
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-lg md:text-xl text-base-content/70 leading-relaxed">
              Meet our distinguished
              faculty members,
              laboratory professionals,
              and library experts who
              drive innovation,
              research excellence,
              and academic success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ==================================
          STATISTICS SECTION
      ================================== */}

      <section className="py-16 bg-base-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              className="stat bg-base-100 rounded-3xl shadow-lg"
            >
              <div className="stat-figure text-primary">
                <GraduationCap size={36} />
              </div>

              <div className="stat-title">
                Faculty Members
              </div>

              <div className="stat-value text-primary">
                {stats.faculty}
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.1,
              }}
              className="stat bg-base-100 rounded-3xl shadow-lg"
            >
              <div className="stat-figure text-secondary">
                <Award size={36} />
              </div>

              <div className="stat-title">
                Lab Staff
              </div>

              <div className="stat-value text-secondary">
                {stats.lab}
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.2,
              }}
              className="stat bg-base-100 rounded-3xl shadow-lg"
            >
              <div className="stat-figure text-accent">
                <Library size={36} />
              </div>

              <div className="stat-title">
                Library Staff
              </div>

              <div className="stat-value text-accent">
                {stats.library}
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.3,
              }}
              className="stat bg-base-100 rounded-3xl shadow-lg"
            >
              <div className="stat-figure text-info">
                <BookOpen size={36} />
              </div>

              <div className="stat-title">
                Publications
              </div>

              <div className="stat-value text-info">
                {stats.publications}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

            {/* ==================================
          SEARCH SECTION
      ================================== */}

      <section className="py-12 bg-base-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
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
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-base-content/50"
              />

              <input
                type="text"
                placeholder="Search faculty by name, designation or department..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
                className="input input-bordered input-lg w-full pl-14 rounded-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================================
          FACULTY MEMBERS
      ================================== */}

      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
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
            <div className="badge badge-primary badge-lg mb-4">
              Academic Team
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-base-content">
              Faculty Members
            </h2>

            <p className="mt-4 text-base-content/70 max-w-3xl mx-auto">
              Dedicated educators,
              researchers, and mentors
              committed to delivering
              quality education and
              fostering innovation.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {facultyMembers
                .filter((member) => {
                  const query =
                    searchTerm.toLowerCase();

                  return (
                    member.name
                      ?.toLowerCase()
                      .includes(query) ||
                    member.designation
                      ?.toLowerCase()
                      .includes(query) ||
                    member.department
                      ?.toLowerCase()
                      .includes(query)
                  );
                })
                .map(
                  (
                    member,
                    index
                  ) => (
                    <motion.div
                      key={
                        member._id
                      }
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
                          index *
                          0.1,
                      }}
                      whileHover={{
                        y: -10,
                      }}
                      className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden"
                    >
                      {/* IMAGE */}
                      <figure className="relative h-80 overflow-hidden">
                        <img
                         src={
                            member.photo ||
                            "https://via.placeholder.com/600x600"
                          }
                          alt={
                            member.name
                          }
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />

                        {member.featured && (
                          <div className="absolute top-4 right-4">
                            <div className="badge badge-warning gap-1">
                              <Award size={12} />
                              Featured
                            </div>
                          </div>
                        )}
                      </figure>

                      {/* CONTENT */}
                      <div className="card-body">
                        <h3 className="card-title text-2xl">
                          {
                            member.name
                          }
                        </h3>

                        <p className="text-primary font-semibold">
                          {
                            member.designation
                          }
                        </p>

                        {member.department && (
                          <p className="text-base-content/70">
                            {
                              member.department
                            }
                          </p>
                        )}

                        <div className="divider my-1"></div>

                        {member.qualification && (
                          <p className="text-sm">
                            <span className="font-semibold">
                              Qualification:
                            </span>{" "}
                            {
                              member.qualification
                            }
                          </p>
                        )}

                        {member.experience && (
                          <p className="text-sm">
                            <span className="font-semibold">
                              Experience:
                            </span>{" "}
                            {
                              member.experience
                            }
                          </p>
                        )}

                        {/* RESEARCH TAGS */}
                        {member.researchInterests
                          ?.length >
                          0 && (
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2">
                              Research
                              Interests
                            </h4>

                            <div className="flex flex-wrap gap-2">
                              {member.researchInterests
                                .slice(
                                  0,
                                  4
                                )
                                .map(
                                  (
                                    item,
                                    idx
                                  ) => (
                                    <span
                                      key={
                                        idx
                                      }
                                      className="badge badge-outline"
                                    >
                                      {
                                        item
                                      }
                                    </span>
                                  )
                                )}
                            </div>
                          </div>
                        )}

                        {/* PUBLICATIONS */}
                        {member.publications
                          ?.length >
                          0 && (
                          <div className="mt-4">
                            <div className="badge badge-info gap-2">
                              <BookOpen
                                size={
                                  12
                                }
                              />
                              {
                                member
                                  .publications
                                  .length
                              }{" "}
                              Publications
                            </div>
                          </div>
                        )}

                        {/* ACTION */}
                        <div className="card-actions mt-6">
                          <button
                            onClick={() =>
                              setSelectedFaculty(
                                member
                              )
                            }
                            className="btn btn-primary w-full"
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
            </div>
          )}
        </div>
      </section>

  
            {/* ==================================
          LAB STAFF SECTION
      ================================== */}

      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
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
            <div className="badge badge-secondary badge-lg mb-4">
              Laboratory Team
            </div>

            <h2 className="text-4xl md:text-5xl font-bold">
              Laboratory Staff
            </h2>

            <p className="mt-4 text-base-content/70 max-w-3xl mx-auto">
              Experienced laboratory professionals
              supporting practical learning,
              experimentation, and technical
              excellence.
            </p>
          </motion.div>

          {labStaff.length === 0 ? (
            <div className="text-center py-12">
              <Award
                size={60}
                className="mx-auto opacity-30"
              />

              <p className="mt-4 text-base-content/60">
                No laboratory staff available.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {labStaff.map(
                (staff, index) => (
                  <motion.div
                    key={staff._id}
                    initial={{
                      opacity: 0,
                      y: 30,
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
                      y: -8,
                    }}
                    className="card bg-base-200 shadow-xl border border-base-300 overflow-hidden"
                  >
                    <figure className="h-72 overflow-hidden">
                      <img
                       src={
                        staff.photo ||
                        "https://via.placeholder.com/500x500"
                      }
                        alt={staff.name}
                        className="w-full h-full object-cover transition duration-500 hover:scale-110"
                      />
                    </figure>

                    <div className="card-body">
                      <h3 className="card-title text-xl">
                        {staff.name}
                      </h3>

                      <p className="font-semibold text-secondary">
                        {staff.designation}
                      </p>

                      {staff.qualification && (
                        <p className="text-sm">
                          <span className="font-semibold">
                            Qualification:
                          </span>{" "}
                          {staff.qualification}
                        </p>
                      )}

                      {staff.experience && (
                        <p className="text-sm">
                          <span className="font-semibold">
                            Experience:
                          </span>{" "}
                          {staff.experience}
                        </p>
                      )}

                      {staff.email && (
                        <p className="text-sm break-all">
                          <span className="font-semibold">
                            Email:
                          </span>{" "}
                          {staff.email}
                        </p>
                      )}

                      <div className="card-actions mt-4">
                        <button
                          onClick={() =>
                            setSelectedFaculty(
                              staff
                            )
                          }
                          className="btn btn-secondary w-full"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* ==================================
          LIBRARY STAFF SECTION
      ================================== */}

      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
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
            <div className="badge badge-accent badge-lg mb-4">
              Library Team
            </div>

            <h2 className="text-4xl md:text-5xl font-bold">
              Library Professionals
            </h2>

            <p className="mt-4 text-base-content/70 max-w-3xl mx-auto">
              Dedicated information specialists
              providing access to knowledge,
              research resources, and academic
              support services.
            </p>
          </motion.div>

          {libraryStaff.length === 0 ? (
            <div className="text-center py-12">
              <Library
                size={60}
                className="mx-auto opacity-30"
              />

              <p className="mt-4 text-base-content/60">
                No library staff available.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {libraryStaff.map(
                (staff, index) => (
                  <motion.div
                    key={staff._id}
                    initial={{
                      opacity: 0,
                      y: 30,
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
                      y: -8,
                    }}
                    className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden"
                  >
                    <figure className="h-72 overflow-hidden">
                      <img
                        src={
                          staff.photo ||
                          "https://via.placeholder.com/500x500"
                        }
                        alt={staff.name}
                        className="w-full h-full object-cover transition duration-500 hover:scale-110"
                      />
                    </figure>

                    <div className="card-body">
                      <h3 className="card-title text-xl">
                        {staff.name}
                      </h3>

                      <p className="font-semibold text-accent">
                        {staff.designation}
                      </p>

                      {staff.qualification && (
                        <p className="text-sm">
                          <span className="font-semibold">
                            Qualification:
                          </span>{" "}
                          {staff.qualification}
                        </p>
                      )}

                      {staff.experience && (
                        <p className="text-sm">
                          <span className="font-semibold">
                            Experience:
                          </span>{" "}
                          {staff.experience}
                        </p>
                      )}

                      {staff.email && (
                        <p className="text-sm break-all">
                          <span className="font-semibold">
                            Email:
                          </span>{" "}
                          {staff.email}
                        </p>
                      )}

                      <div className="card-actions mt-4">
                        <button
                          onClick={() =>
                            setSelectedFaculty(
                              staff
                            )
                          }
                          className="btn btn-accent w-full"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      
            {/* ==================================
          FACULTY PROFILE MODAL
      ================================== */}

      {selectedFaculty && (
        <dialog
          open
          className="modal modal-open"
        >
          <div className="modal-box max-w-5xl bg-base-100">
            <button
              onClick={() =>
                setSelectedFaculty(null)
              }
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
            >
              ✕
            </button>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* IMAGE */}
              <div>
                <img
                 src={
                    selectedFaculty.photo ||
                    "https://via.placeholder.com/600x600"
                  }
                  alt={
                    selectedFaculty.name
                  }
                  className="w-full h-125 object-cover rounded-3xl shadow-xl"
                />
              </div>

              {/* DETAILS */}
              <div>
                <div className="mb-6">
                  <h2 className="text-4xl font-bold">
                    {
                      selectedFaculty.name
                    }
                  </h2>

                  <p className="text-primary text-xl font-semibold mt-2">
                    {
                      selectedFaculty.designation
                    }
                  </p>

                  {selectedFaculty.department && (
                    <p className="text-base-content/70 mt-2">
                      {
                        selectedFaculty.department
                      }
                    </p>
                  )}
                </div>

                {/* BASIC INFO */}

                <div className="space-y-3 mb-6">
                  {selectedFaculty.qualification && (
                    <div>
                      <span className="font-bold">
                        Qualification:
                      </span>{" "}
                      {
                        selectedFaculty.qualification
                      }
                    </div>
                  )}

                  {selectedFaculty.experience && (
                    <div>
                      <span className="font-bold">
                        Experience:
                      </span>{" "}
                      {
                        selectedFaculty.experience
                      }
                    </div>
                  )}

                  {selectedFaculty.email && (
                    <div>
                      <span className="font-bold">
                        Email:
                      </span>{" "}
                      {
                        selectedFaculty.email
                      }
                    </div>
                  )}

                  {selectedFaculty.phone && (
                    <div>
                      <span className="font-bold">
                        Phone:
                      </span>{" "}
                      {
                        selectedFaculty.phone
                      }
                    </div>
                  )}
                </div>

                {/* RESEARCH INTERESTS */}

                {selectedFaculty
                  .researchInterests
                  ?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-xl mb-3">
                      Research Interests
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {selectedFaculty.researchInterests.map(
                        (
                          interest,
                          index
                        ) => (
                          <span
                            key={index}
                            className="badge badge-primary badge-lg"
                          >
                            {interest}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* PUBLICATIONS */}

                {selectedFaculty
                  .publications?.length >
                  0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-xl mb-3">
                      Publications
                    </h3>

                    <ul className="space-y-2">
                      {selectedFaculty.publications.map(
                        (
                          publication,
                          index
                        ) => (
                          <li
                            key={index}
                            className="flex gap-2"
                          >
                            <BookOpen
                              size={16}
                              className="mt-1 text-primary"
                            />

                            <span>
                              {
                                publication
                              }
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* SOCIAL LINKS */}

                {(selectedFaculty.scholarLink ||
                  selectedFaculty.orcidLink ||
                  selectedFaculty.linkedinLink) && (
                  <div>
                    <h3 className="font-bold text-xl mb-3">
                      Academic Profiles
                    </h3>

                    <div className="flex flex-wrap gap-3">
                      {selectedFaculty.scholarLink && (
                        <a
                          href={
                            selectedFaculty.scholarLink
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary btn-sm"
                        >
                          Google Scholar
                        </a>
                      )}

                      {selectedFaculty.orcidLink && (
                        <a
                          href={
                            selectedFaculty.orcidLink
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary btn-sm"
                        >
                          ORCID
                        </a>
                      )}

                      {selectedFaculty.linkedinLink && (
                        <a
                          href={
                            selectedFaculty.linkedinLink
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-accent btn-sm"
                        >
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() =>
                  setSelectedFaculty(null)
                }
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* ==================================
          RESEARCH HIGHLIGHTS
      ================================== */}

      <section className="py-20 bg-primary text-primary-content">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
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
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Research Excellence
            </h2>

            <p className="max-w-3xl mx-auto text-lg opacity-90">
              Our faculty members actively
              contribute to research,
              innovation, publications,
              conferences, and academic
              collaborations that shape the
              future of education and
              technology.
            </p>

            <div className="grid md:grid-cols-4 gap-6 mt-12">
              <div className="bg-white/10 rounded-3xl p-6">
                <div className="text-4xl font-black">
                  {stats.faculty}
                </div>

                <div className="opacity-80 mt-2">
                  Faculty Members
                </div>
              </div>

              <div className="bg-white/10 rounded-3xl p-6">
                <div className="text-4xl font-black">
                  {stats.publications}
                </div>

                <div className="opacity-80 mt-2">
                  Publications
                </div>
              </div>

              <div className="bg-white/10 rounded-3xl p-6">
                <div className="text-4xl font-black">
                  {stats.lab}
                </div>

                <div className="opacity-80 mt-2">
                  Lab Professionals
                </div>
              </div>

              <div className="bg-white/10 rounded-3xl p-6">
                <div className="text-4xl font-black">
                  {stats.library}
                </div>

                <div className="opacity-80 mt-2">
                  Library Experts
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </>
  );
}