
import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  IndianRupee,
  FileText,
  Download,
  BookOpen,
} from "lucide-react";


const FeeStructure = () => {
  const [loading, setLoading] =
    useState(true);

  const [feeStructures, setFeeStructures] =
    useState([]);

  const [selectedStream, setSelectedStream] =
    useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

    const { data } = await api.get("/fee-structure");

const feeList =
  data?.data?.feeStructures || [];

const sorted = [...feeList].sort((a, b) => {
  const order = {
    BCA: 1,
    BBA: 2,
    MCA: 3,
  };

  return (
    (order[a.stream] || 999) -
    (order[b.stream] || 999)
  );
});

setFeeStructures(sorted);

if (sorted.length > 0) {
  setSelectedStream(sorted[0]);
}

      if (sorted.length > 0) {
        setSelectedStream(
          sorted[0]
        );
      }
    } catch (error) {
      console.error(
        "Fee Structure Load Error",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">

        <span className="loading loading-spinner loading-lg"></span>

      </div>
    );
  }

  return (
    <>

    <div className="min-h-screen bg-base-100">

      {/* =====================================
          HERO SECTION
      ===================================== */}

      <section className="relative overflow-hidden bg-linear-to-r from-primary via-secondary to-accent text-primary-content">

        <div className="absolute inset-0 opacity-10">

          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-white blur-3xl"></div>

          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white blur-3xl"></div>

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
              duration: 0.7,
            }}
            className="text-center"
          >

            <div className="inline-flex p-5 rounded-full bg-white/20 backdrop-blur mb-6">

              <GraduationCap size={60} />

            </div>

            <h1 className="text-5xl md:text-7xl font-black">

              Fee Structure

            </h1>

            <p className="max-w-3xl mx-auto mt-6 text-lg md:text-xl opacity-90">

              Transparent semester-wise
              fee details for all academic
              programs. Select a stream to
              explore complete fee
              information.

            </p>

          </motion.div>

        </div>

      </section>

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <section className="py-16">

        <div className="max-w-7xl mx-auto px-4">

          <div className="grid lg:grid-cols-12 gap-8">

            {/* =====================================
                STREAM CARDS
            ===================================== */}

            <div className="lg:col-span-4">

              <div className="sticky top-24">

                <h2 className="text-3xl font-black mb-6">

                  Programs

                </h2>

                <div className="space-y-4">

                  {feeStructures.map(
                    (item) => (

                      <motion.button
                        key={item._id}
                        whileHover={{
                          scale: 1.02,
                        }}
                        whileTap={{
                          scale: 0.98,
                        }}
                        onClick={() =>
                          setSelectedStream(
                            item
                          )
                        }
                        className={`w-full text-left card transition-all duration-300 border-2 ${
                          selectedStream?._id ===
                          item._id
                            ? "border-primary bg-primary text-primary-content shadow-2xl"
                            : "border-base-300 bg-base-100 hover:border-primary"
                        }`}
                      >

                        <div className="card-body">

                          <div className="flex justify-between items-center">

                            <div>

                              <h3 className="text-3xl font-black">

                                {item.stream}

                              </h3>

                              <p className="opacity-80 mt-1">

                                {item.duration}

                              </p>

                            </div>

                            <GraduationCap
                              size={36}
                            />

                          </div>

                          <div className="divider my-2"></div>

                          <div className="flex justify-between items-center">

                            <span>

                              Total Fee

                            </span>

                            <span className="font-black text-xl">

                              ₹
                              {Number(
                                item.totalFee
                              ).toLocaleString()}

                            </span>

                          </div>

                        </div>

                      </motion.button>

                    )
                  )}

                </div>

              </div>

            </div>

            {/* =====================================
                RIGHT PANEL START
            ===================================== */}

            <div className="lg:col-span-8">

              <AnimatePresence mode="wait">

                {selectedStream && (

                  <motion.div
                    key={
                      selectedStream._id
                    }
                    initial={{
                      opacity: 0,
                      x: 120,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: -120,
                    }}
                    transition={{
                      duration: 0.4,
                    }}
                    className="space-y-6"
                  >

                    {/* ============================
                        STREAM HEADER
                    ============================ */}

                    <div className="card bg-base-100 shadow-xl border border-base-300">

                      <div className="card-body">

                        <div className="flex flex-col md:flex-row justify-between gap-6">

                          <div>

                            <div className="badge badge-primary badge-lg mb-3">

                              {
                                selectedStream.stream
                              }

                            </div>

                            <h2 className="text-4xl font-black">

                              {
                                selectedStream.stream
                              } Program

                            </h2>

                            <p className="mt-2 opacity-70">

                              Duration:
                              {" "}
                              {
                                selectedStream.duration
                              }

                            </p>

                            <p className="opacity-70">

                              Batch:
                              {" "}
                              {
                                selectedStream.batch
                              }

                            </p>

                          </div>

                          <div className="stats shadow">

                            <div className="stat">

                              <div className="stat-figure text-primary">

                                <IndianRupee />

                              </div>

                              <div className="stat-title">

                                Total Program Fee

                              </div>

                              <div className="stat-value text-primary">

                                ₹
                                {Number(
                                  selectedStream.totalFee
                                ).toLocaleString()}

                              </div>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* ============================
                        SEMESTER TABLE
                    ============================ */}

                    <div className="card bg-base-100 shadow-xl border border-base-300">

                      <div className="card-body">

                        <h3 className="text-2xl font-black flex items-center gap-2">

                          <BookOpen />

                          Semester Wise Fee Structure

                        </h3>

                        <div className="overflow-x-auto mt-6">

                          <table className="table table-zebra">

                            <thead>

                              <tr>

                                <th>
                                  Semester
                                </th>

                                <th>
                                  Fee Amount
                                </th>

                              </tr>

                            </thead>

                            <tbody>

                              {selectedStream.semesterFees?.map(
                                (
                                  fee,
                                  index
                                ) => (

                                  <tr
                                    key={
                                      index
                                    }
                                  >

                                    <td>

                                      <div className="badge badge-outline badge-lg">

                                        {
                                          fee.semester
                                        }

                                      </div>

                                    </td>

                                    <td className="font-bold text-primary">

                                      ₹
                                      {Number(
                                        fee.amount
                                      ).toLocaleString()}

                                    </td>

                                  </tr>

                                )
                              )}

                            </tbody>

                            <tfoot>

                              <tr>

                                <td className="font-black">

                                  Admission Fee

                                </td>

                                <td className="font-black">

                                  ₹
                                  {Number(
                                    selectedStream.admissionFee
                                  ).toLocaleString()}

                                </td>

                              </tr>

                              <tr>

                                <td className="font-black text-lg">

                                  Total Fee

                                </td>

                                <td className="font-black text-primary text-lg">

                                  ₹
                                  {Number(
                                    selectedStream.totalFee
                                  ).toLocaleString()}

                                </td>

                              </tr>

                            </tfoot>

                          </table>

                        </div>

                      </div>

                    </div>

                    {/* ============================
                        PDF DOWNLOAD
                    ============================ */}

                    {selectedStream.pdfFile && (

                      <div className="card bg-linear-to-r from-primary to-secondary text-primary-content shadow-xl">

                        <div className="card-body">

                          <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                            <div>

                              <h3 className="text-2xl font-black flex items-center gap-2">

                                <FileText />

                                Official Fee Structure PDF

                              </h3>

                              <p className="opacity-90 mt-1">

                                Download the official fee structure document.

                              </p>

                            </div>

                            <a
                              href={selectedStream.pdfFile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-neutral gap-2"
                            >
                              <Download size={18} />
                              Download PDF
                            </a>

                          </div>

                        </div>

                      </div>

                    )}

                    {/* ============================
                        NOTES
                    ============================ */}

                    {selectedStream.notes?.length >
                      0 && (

                      <div className="card bg-base-100 shadow-xl border border-base-300">

                        <div className="card-body">

                          <h3 className="text-2xl font-black">

                            Admission Instructions

                          </h3>

                          <div className="mt-4 space-y-3">

                            {selectedStream.notes.map(
                              (
                                note,
                                index
                              ) => (

                                <div
                                  key={
                                    index
                                  }
                                  className="flex gap-3 p-4 rounded-xl bg-base-200"
                                >

                                  <div className="badge badge-primary badge-sm mt-1">

                                    ✓

                                  </div>

                                  <p>

                                    {note}

                                  </p>

                                </div>

                              )
                            )}

                          </div>

                        </div>

                      </div>

                    )}

                  </motion.div>

                )}

              </AnimatePresence>

            </div>

          </div>

        </div>

      </section>

    </div>


    </>
  );
};

export default FeeStructure;

