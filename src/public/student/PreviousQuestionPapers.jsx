import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../../services/api";
import { motion } from "framer-motion";

import {
  FaFilePdf,
  FaDownload,
  FaSearch,
  FaGraduationCap,
  FaBook,
  FaUniversity,
} from "react-icons/fa";
import LogoStrip from "../../styles/Logostrip";

export default function PreviousQuestionPapers() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [programFilter, setProgramFilter] =
    useState("ALL");

  const [semesterFilter, setSemesterFilter] =
    useState("ALL");

  const [yearFilter, setYearFilter] =
    useState("ALL");

  // ==========================
  // FETCH PAPERS
  // ==========================

  const fetchPapers = async () => {
    try {
      setLoading(true);

    const { data } = await api.get(
  "/previous-papers"
);

setPapers(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  // ==========================
  // YEARS
  // ==========================

  const years = useMemo(() => {
    return [
      ...new Set(
        papers.map(
          (paper) => paper.year
        )
      ),
    ].sort((a, b) => b - a);
  }, [papers]);

  // ==========================
  // FILTER PAPERS
  // ==========================

  const filteredPapers = useMemo(() => {
    return papers.filter((paper) => {
      const searchMatch =
        paper.title
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        paper.subject
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const programMatch =
        programFilter === "ALL" ||
        paper.program === programFilter;

      const semesterMatch =
        semesterFilter === "ALL" ||
        paper.semester ===
          semesterFilter;

      const yearMatch =
        yearFilter === "ALL" ||
        Number(paper.year) ===
          Number(yearFilter);

      return (
        searchMatch &&
        programMatch &&
        semesterMatch &&
        yearMatch
      );
    });
  }, [
    papers,
    searchTerm,
    programFilter,
    semesterFilter,
    yearFilter,
  ]);

  // ==========================
  // STATS
  // ==========================

  const stats = {
    total: papers.length,

    bca: papers.filter(
      (paper) =>
        paper.program === "BCA"
    ).length,

    bba: papers.filter(
      (paper) =>
        paper.program === "BBA"
    ).length,

    mca: papers.filter(
      (paper) =>
        paper.program === "MCA"
    ).length,
  };

  const resetFilters = () => {
    setSearchTerm("");
    setProgramFilter("ALL");
    setSemesterFilter("ALL");
    setYearFilter("ALL");
  };

  return (
    <>
 

      <section className="min-h-screen bg-base-200">

        {/* HERO */}

        <div className="hero bg-primary text-primary-content">
          <div className="hero-content text-center py-20">
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
                duration: 0.5,
              }}
            >
              <h1 className="text-5xl font-black">
                Previous Year
                Question Papers
              </h1>

              <p className="mt-5 max-w-3xl mx-auto text-lg opacity-90">
                Access semester-wise and
                year-wise university
                question papers for better
                exam preparation and
                academic success.
              </p>
            </motion.div>
          </div>
        </div>

        {/* STATS */}

        <div className="max-w-7xl mx-auto px-6 -mt-8">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

            <div className="stat bg-base-100 rounded-box shadow-xl">
              <div className="stat-figure text-error">
                <FaFilePdf className="text-4xl" />
              </div>

              <div className="stat-title">
                Total Papers
              </div>

              <div className="stat-value">
                {stats.total}
              </div>
            </div>

            <div className="stat bg-base-100 rounded-box shadow-xl">
              <div className="stat-figure text-primary">
                <FaGraduationCap className="text-4xl" />
              </div>

              <div className="stat-title">
                BCA Papers
              </div>

              <div className="stat-value text-primary">
                {stats.bca}
              </div>
            </div>

            <div className="stat bg-base-100 rounded-box shadow-xl">
              <div className="stat-figure text-success">
                <FaBook className="text-4xl" />
              </div>

              <div className="stat-title">
                BBA Papers
              </div>

              <div className="stat-value text-success">
                {stats.bba}
              </div>
            </div>

            <div className="stat bg-base-100 rounded-box shadow-xl">
              <div className="stat-figure text-warning">
                <FaUniversity className="text-4xl" />
              </div>

              <div className="stat-title">
                MCA Papers
              </div>

              <div className="stat-value text-warning">
                {stats.mca}
              </div>
            </div>

          </div>
        </div>

        {/* FILTERS */}

        <div className="max-w-7xl mx-auto px-6 mt-10">
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">

                <h2 className="text-2xl font-bold">
                  Search Question Papers
                </h2>

                <button
                  onClick={resetFilters}
                  className="btn btn-outline btn-primary"
                >
                  Reset Filters
                </button>

              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">

                <label className="input input-bordered flex items-center gap-2">

                  <FaSearch />

                  <input
                    type="text"
                    className="grow"
                    placeholder="Search subject..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                  />

                </label>

                <select
                  className="select select-bordered"
                  value={programFilter}
                  onChange={(e) => {
                    setProgramFilter(
                      e.target.value
                    );

                    setSemesterFilter(
                      "ALL"
                    );
                  }}
                >
                  <option value="ALL">
                    All Programs
                  </option>

                  <option value="BCA">
                    BCA
                  </option>

                  <option value="BBA">
                    BBA
                  </option>

                  <option value="MCA">
                    MCA
                  </option>
                </select>
                                <select
                  className="select select-bordered"
                  value={semesterFilter}
                  onChange={(e) =>
                    setSemesterFilter(
                      e.target.value
                    )
                  }
                >
                  <option value="ALL">
                    All Semesters
                  </option>

                  <option value="Semester 1">
                    Semester 1
                  </option>

                  <option value="Semester 2">
                    Semester 2
                  </option>

                  <option value="Semester 3">
                    Semester 3
                  </option>

                  <option value="Semester 4">
                    Semester 4
                  </option>

                  <option value="Semester 5">
                    Semester 5
                  </option>

                  <option value="Semester 6">
                    Semester 6
                  </option>

                  <option value="Semester 7">
                    Semester 7
                  </option>

                  <option value="Semester 8">
                    Semester 8
                  </option>
                </select>

                <select
                  className="select select-bordered"
                  value={yearFilter}
                  onChange={(e) =>
                    setYearFilter(
                      e.target.value
                    )
                  }
                >
                  <option value="ALL">
                    All Years
                  </option>

                  {years.map((year) => (
                    <option
                      key={year}
                      value={year}
                    >
                      {year}
                    </option>
                  ))}
                </select>

              </div>
            </div>
          </div>
        </div>

        {/* QUESTION PAPER ARCHIVE */}

        <div className="max-w-7xl mx-auto px-6 py-16">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

            <div>
              <h2 className="text-3xl font-black">
                Question Paper Archive
              </h2>

              <p className="text-base-content/70 mt-2">
                Browse previous year
                question papers by
                program, semester,
                year and paper type.
              </p>
            </div>

            <div className="badge badge-primary badge-lg">
              {filteredPapers.length}
              {" "}
              Papers
            </div>

          </div>

          {/* LOADING */}

          {loading && (

            <div className="flex justify-center py-20">

              <span className="loading loading-spinner loading-lg text-primary"></span>

            </div>

          )}

          {/* EMPTY STATE */}

          {!loading &&
            filteredPapers.length === 0 && (

              <div className="card bg-base-100 shadow-xl border border-base-300">

                <div className="card-body text-center py-16">

                  <FaFilePdf
                    size={70}
                    className="mx-auto opacity-20"
                  />

                  <h3 className="text-2xl font-bold mt-4">
                    No Papers Found
                  </h3>

                  <p className="text-base-content/70">
                    Try adjusting your
                    search criteria or
                    filters.
                  </p>

                </div>

              </div>

            )}

          {/* PAPER CARDS */}

          {!loading &&
            filteredPapers.length > 0 && (

              <div className="max-h-[80vh] overflow-y-auto pr-2">
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                {filteredPapers.map(
                  (paper) => (

                    <motion.div
                      key={paper._id}
                      whileHover={{
                        y: -6,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                    >

                      <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300 h-full">

                        <div className="card-body">

                          {/* TOP BADGES */}

                          <div className="flex justify-between items-center">

                            <span className="badge badge-primary">
                              {paper.program}
                            </span>

                            <span className="badge badge-outline">
                              {paper.year}
                            </span>

                          </div>

                          {/* TITLE */}

                          <h2 className="card-title mt-3">

                            {paper.title}

                          </h2>

                          <p className="text-base-content/70">

                            {paper.subject}

                          </p>

                          <div className="divider my-2"></div>

                          {/* DETAILS */}

                          <div className="space-y-3 text-sm">

                            <div className="flex justify-between">

                              <span>
                                Semester
                              </span>

                              <strong className="text-primary">
                                {paper.semester}
                              </strong>

                            </div>

                            <div className="flex justify-between items-center">

                              <span>
                                Paper Type
                              </span>

                              <span
                                className={`badge ${
                                  paper.paperType ===
                                  "New"
                                    ? "badge-success"
                                    : "badge-warning"
                                }`}
                              >
                                {paper.paperType}
                              </span>

                            </div>

                            <div className="flex justify-between">

                              <span>
                                Year
                              </span>

                              <strong>
                                {paper.year}
                              </strong>

                            </div>

                          </div>

                          {/* ACTIONS */}

                          <div className="card-actions mt-6">

                            <a
  href={paper.pdfFile}
  target="_blank"
  rel="noreferrer"
  className="btn btn-primary flex-1"
>
                              <FaFilePdf />

                              View PDF
                            </a>

                            <a
                              href={paper.pdfFile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-success"
                            >
                              <FaDownload />
                            </a>

                          </div>

                        </div>

                      </div>

                    </motion.div>

                  )
                )}

              </div>
                </div>

            )}

        </div>
                {/* ========================= */}
        {/* STUDENT BENEFITS */}
        {/* ========================= */}

        <div className="bg-base-100 border-t border-base-300">

          <div className="max-w-7xl mx-auto px-6 py-16">

            <div className="text-center mb-12">

              <h2 className="text-4xl font-black">
                Why Practice Previous Papers?
              </h2>

              <p className="text-base-content/70 mt-4 max-w-3xl mx-auto">
                Solving previous year question papers
                helps students understand exam trends,
                improve time management and build
                confidence before university examinations.
              </p>

            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

              <div className="card bg-base-200 shadow-lg border border-base-300">

                <div className="card-body text-center">

                  <div className="text-5xl">
                    📚
                  </div>

                  <h3 className="text-xl font-bold">
                    Exam Pattern
                  </h3>

                  <p className="text-base-content/70">
                    Understand question structure,
                    marks distribution and paper
                    formats before examinations.
                  </p>

                </div>

              </div>

              <div className="card bg-base-200 shadow-lg border border-base-300">

                <div className="card-body text-center">

                  <div className="text-5xl">
                    🎯
                  </div>

                  <h3 className="text-xl font-bold">
                    Important Topics
                  </h3>

                  <p className="text-base-content/70">
                    Identify frequently asked
                    units and important topics
                    that appear repeatedly.
                  </p>

                </div>

              </div>

              <div className="card bg-base-200 shadow-lg border border-base-300">

                <div className="card-body text-center">

                  <div className="text-5xl">
                    ⚡
                  </div>

                  <h3 className="text-xl font-bold">
                    Faster Revision
                  </h3>

                  <p className="text-base-content/70">
                    Focus your preparation on
                    high-priority concepts and
                    maximize revision efficiency.
                  </p>

                </div>

              </div>

              <div className="card bg-base-200 shadow-lg border border-base-300">

                <div className="card-body text-center">

                  <div className="text-5xl">
                    🏆
                  </div>

                  <h3 className="text-xl font-bold">
                    Better Results
                  </h3>

                  <p className="text-base-content/70">
                    Improve confidence,
                    accuracy and overall
                    examination performance.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ========================= */}
        {/* CTA SECTION */}
        {/* ========================= */}

        <div className="px-6 py-20">

          <div className="max-w-7xl mx-auto">

            <div className="hero rounded-box bg-primary text-primary-content shadow-2xl">

              <div className="hero-content text-center py-20">

                <div>

                  <h2 className="text-5xl font-black">
                    Academic Resource Center
                  </h2>

                  <p className="max-w-3xl mx-auto py-6 text-lg opacity-90">

                    Access previous year question
                    papers, strengthen your exam
                    preparation and improve your
                    academic performance with a
                    well-organized digital archive.

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>
            <LogoStrip/>

    </>
  );
}
