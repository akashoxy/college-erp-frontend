import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import {
  BookOpen,
  Download,
  Eye,
  FileText,
  GraduationCap,
} from "lucide-react";



export default function Syllabus() {
  const [syllabus, setSyllabus] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedPdf, setSelectedPdf] =
    useState(null);

  const programs = [
    {
      program: "MCA",
      fullName:
        "Master of Computer Applications",
      duration: "2 Years",
      semesters: [1, 2, 3, 4],
    },

    {
      program: "BCA",
      fullName:
        "Bachelor of Computer Applications",
      duration: "4 Years",
      semesters: [
        1, 2, 3, 4,
        5, 6, 7, 8,
      ],
    },

    {
      program: "BBA",
      fullName:
        "Bachelor of Business Administration",
      duration: "4 Years",
      semesters: [
        1, 2, 3, 4,
        5, 6, 7, 8,
      ],
    },
  ];

  useEffect(() => {
    fetchSyllabus();
  }, []);

  const fetchSyllabus = async () => {
    try {
      setLoading(true);
const { data } = await api.get(
  "/syllabus"
);

setSyllabus(
  data.data || []
);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const groupedData = useMemo(() => {
    const grouped = {};

    syllabus.forEach((item) => {
      const key =
        `${item.stream}-${item.semester}`;

      if (!grouped[key]) {
        grouped[key] = {};
      }

      grouped[key][
        item.syllabusType
      ] = item;
    });

    return grouped;
  }, [syllabus]);

  return (
        <>

      <section className="min-h-screen bg-base-200 py-20 px-4">
        {/* Hero */}

        <motion.div
          initial={{
            opacity: 0,
            y: -30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="text-center max-w-5xl mx-auto mb-16"
        >
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen
                size={40}
                className="text-primary"
              />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-black">
            SYLLABUS
          </h1>

          <p className="mt-4 text-base-content/70 text-lg">
            Download semester-wise
            old and new syllabus PDFs
            for MCA, BCA and BBA.
          </p>

          <div className="mt-6 w-32 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        {/* Loading */}

        {loading ? (
          <div className="max-w-6xl mx-auto grid gap-8">
            {Array.from({
              length: 3,
            }).map((_, index) => (
              <div
                key={index}
                className="card bg-base-100 shadow-xl"
              >
                <div className="card-body">
                  <div className="skeleton h-10 w-60"></div>

                  <div className="skeleton h-6 w-80"></div>

                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="skeleton h-32 w-full"></div>
                    <div className="skeleton h-32 w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid gap-10">
            {programs.map((program, index) => (
  <motion.div
    key={program.program}
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
      duration: 0.5,
      delay: index * 0.1,
    }}
  >
    <div className="collapse collapse-arrow bg-base-100 border border-base-300 shadow-xl">
      <input
        type="checkbox"
      />

      {/* Header */}

      <div className="collapse-title">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black flex items-center gap-3">
              <GraduationCap size={28} />

              {program.program}
            </h2>

            <p className="text-base-content/70 mt-1">
              {program.fullName}
            </p>
          </div>

          <div className="badge badge-primary badge-lg">
            {program.duration}
          </div>
        </div>
      </div>

      {/* Content */}

      <div className="collapse-content">
        <div className="grid md:grid-cols-2 gap-5 pt-4">
          {program.semesters.map(
            (semester) => {
              const data =
                groupedData[
                  `${program.program}-${semester}`
                ] || {};

              const oldPdf =
                data.old;

              const newPdf =
                data.new;

              return (
                <div
                  key={semester}
                  className="border border-base-300 rounded-2xl p-5 bg-base-200"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-lg">
                      Semester {semester}
                    </h3>

                    <div className="badge badge-outline">
                      <FileText size={14} />
                    </div>
                  </div>

                  {/* New */}

                  <div className="bg-base-100 rounded-xl p-4 border border-base-300 mb-3">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-success">
                        New Syllabus
                      </p>

                      {newPdf ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setSelectedPdf(
                                newPdf
                              )
                            }
                            className="btn btn-sm btn-outline"
                          >
                            <Eye size={15} />
                          </button>

                          <a
                            href={newPdf.pdfFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-success"
                          >
                            <Download size={15} />
                          </a>
                        </div>
                      ) : (
                        <span className="text-xs opacity-60">
                          Not Available
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Old */}

                  <div className="bg-base-100 rounded-xl p-4 border border-base-300">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-warning">
                        Old Syllabus
                      </p>

                      {oldPdf ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setSelectedPdf(
                                oldPdf
                              )
                            }
                            className="btn btn-sm btn-outline"
                          >
                            <Eye size={15} />
                          </button>
                          <a
                            href={oldPdf.pdfFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-warning"
                          >
                            <Download size={15} />
                          </a>
                        </div>
                      ) : (
                        <span className="text-xs opacity-60">
                          Not Available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  </motion.div>
))}
          </div>
        )}

        {/* PDF Preview Modal */}

        {selectedPdf && (
          <dialog className="modal modal-open">
            <div className="modal-box max-w-6xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl">
                  {
                    selectedPdf.stream
                  }
                  {" - "}
                  Semester{" "}
                  {
                    selectedPdf.semester
                  }
                  {" - "}
                  {selectedPdf.syllabusType.toUpperCase()}
                </h3>

                <button
                  className="btn btn-circle btn-sm"
                  onClick={() =>
                    setSelectedPdf(
                      null
                    )
                  }
                >
                  ✕
                </button>
              </div>

              <iframe
               src={selectedPdf.pdfFile}
                title="PDF Preview"
                className="w-full h-[75vh] rounded-xl border border-base-300"
              />

              <div className="modal-action">
                <a
                 href={selectedPdf.pdfFile}
                  download
                  className="btn btn-primary"
                >
                  <Download
                    size={18}
                  />
                  Download PDF
                </a>

                <button
                  className="btn"
                  onClick={() =>
                    setSelectedPdf(
                      null
                    )
                  }
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}
      </section>

  
    </>
  );
}