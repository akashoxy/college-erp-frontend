import React, { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import api from "../../services/api";
import {
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

import tihlogo from "../../assets/images/tih-logo.png";
import LogoStrip from "../../styles/Logostrip";

export default function Webmagazine() {
  const [magazines, setMagazines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMagazine, setSelectedMagazine] =
  useState(null);

  const loadData = async () => {
    try {
      const res = await api.get("/web-magazine");

      setMagazines(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ===============================
     SEARCH FILTER
  =============================== */

  const filteredMagazines = magazines.filter(
    (item) =>
      item.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.author
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.category
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  /* ===============================
     STATS
  =============================== */

  const totalPublications =
    magazines.length;

  const totalCategories = new Set(
    magazines.map(
      (item) => item.category
    )
  ).size;

  const currentYear =
    new Date().getFullYear();

  const currentYearPublications =
    magazines.filter(
      (item) =>
        Number(item.year) ===
        currentYear
    ).length;

  /* ===============================
     ANIMATIONS
  =============================== */

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardAnim = {
    hidden: {
      opacity: 0,
      y: 20,
    },

    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <>
      <section className="min-h-screen bg-base-200">
        {/* HERO */}

        <div
          className="
            bg-linear-to-r
            from-primary
            via-secondary
            to-accent
            text-primary-content
          "
        >
          <div className="max-w-7xl mx-auto px-6 py-16">
            <motion.div
              initial={{
                opacity: 0,
                y: -15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                flex
                flex-col
                md:flex-row
                items-center
                justify-center
                gap-8
              "
            >
              <div className="avatar">
                <div
                  className="
                    w-28
                    rounded-full
                    ring
                    ring-base-100
                    ring-offset-base-100
                    ring-offset-4
                  "
                >
                  <img
                    src={tihlogo}
                    alt="Techno India Hooghly"
                  />
                </div>
              </div>

              <div className="text-center">
                <h1 className="text-5xl font-bold">
                  Web Magazine
                </h1>

                <p className="mt-4 text-lg opacity-90">
                  Explore College
                  Magazines, Research
                  Publications, Journals
                  and Newsletters
                </p>
              </div>

              <div className="avatar hidden md:block">
                <div
                  className="
                    w-28
                    rounded-full
                    ring
                    ring-base-100
                    ring-offset-base-100
                    ring-offset-4
                  "
                >
                  <img
                    src={tihlogo}
                    alt="Techno India Hooghly"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="stats shadow bg-base-100 border border-base-300">
              <div className="stat">
                <div className="stat-title">
                  Publications
                </div>

                <div className="stat-value text-primary">
                  {
                    totalPublications
                  }
                </div>
              </div>
            </div>

            <div className="stats shadow bg-base-100 border border-base-300">
              <div className="stat">
                <div className="stat-title">
                  Categories
                </div>

                <div className="stat-value text-secondary">
                  {
                    totalCategories
                  }
                </div>
              </div>
            </div>

            <div className="stats shadow bg-base-100 border border-base-300">
              <div className="stat">
                <div className="stat-title">
                  Current Year
                  Publications
                </div>

                <div className="stat-value text-success">
                  {
                    currentYearPublications
                  }
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH */}

          <div className="card bg-base-100 border border-base-300 shadow-xl mb-10">
            <div className="card-body">
              <input
                type="text"
                placeholder="Search by title, author or category..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />
            </div>
          </div>


          {/* MAGAZINES */}

          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
              gap-8
            "
          >

            {filteredMagazines.map((item) => (

              <motion.div
                key={item._id}
                variants={cardAnim}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                }}
                transition={{
                  type: "spring",
                  stiffness: 240,
                }}
                className="
                  card
                  bg-base-100
                  border
                  border-base-300
                  shadow-xl
                  overflow-hidden
                  group
                  transition-all
                  duration-500
                  hover:shadow-2xl
                  hover:border-primary
                "
              >

                <figure className="pt-6 px-6">

                  {item.image ? (

                    <img
                      src={item.image}
                      alt={item.title}
                      className="
                        w-44
                        h-60
                        object-cover
                        rounded-2xl
                        transition-all
                        duration-500
                        group-hover:scale-105
                      "
                    />

                  ) : (

                    <div
                      className="
                        w-44
                        h-60
                        rounded-2xl
                        border
                        border-base-300
                        flex
                        items-center
                        justify-center
                      "
                    >

                      No Cover

                    </div>

                  )}

                </figure>

                <div className="card-body text-center">

                  <h2 className="font-bold text-lg line-clamp-2">

                    {item.title}

                  </h2>

                  <p className="text-sm opacity-70 line-clamp-2">

                    {item.subtitle}

                  </p>

                  <div className="badge badge-primary mx-auto">

                    {item.category}

                  </div>

                  <button
                    className="btn btn-primary mt-4"
                    onClick={() => {
                      setSelectedMagazine(item);
                      document
                        .getElementById("magazine_modal")
                        .showModal();
                    }}
                  >

                    View Details

                  </button>

                </div>

              </motion.div>

            ))}

          </motion.div>
          {/* ==========================================
    MAGAZINE DETAILS MODAL
========================================== */}

<dialog
  id="magazine_modal"
  className="modal"
>

  <div
    className="
      modal-box
      w-11/12
      max-w-3xl
      p-0
      bg-base-100
      rounded-3xl
      border
      border-base-300
      shadow-2xl
      overflow-hidden
    "
  >

    {selectedMagazine && (

      <>

        {/* HEADER */}

        <div
          className="
            bg-linear-to-r
            from-primary
            via-secondary
            to-accent
            text-primary-content
            px-6
            py-5
            flex
            items-start
            justify-between
          "
        >

          <div>

            <h2 className="text-3xl font-black">

              {selectedMagazine.title}

            </h2>

            {selectedMagazine.subtitle && (

              <p className="mt-1 opacity-90">

                {selectedMagazine.subtitle}

              </p>

            )}

          </div>

          <form method="dialog">

            <button className="btn btn-circle btn-sm btn-ghost text-white">

              ✕

            </button>

          </form>

        </div>

        {/* BODY */}

        <div className="p-6">

          <div className="flex flex-col md:flex-row gap-6">

            {/* COVER */}

            <div className="flex justify-center md:w-52 shrink-0">

              {selectedMagazine.image ? (

                <img
                  src={selectedMagazine.image}
                  alt={selectedMagazine.title}
                  className="
                    w-44
                    h-64
                    object-cover
                    rounded-2xl
                    shadow-xl
                    transition-all
                    duration-500
                    hover:scale-105
                    hover:-rotate-2
                  "
                />

              ) : (

                <div
                  className="
                    w-44
                    h-64
                    rounded-2xl
                    border
                    border-base-300
                    bg-base-200
                    flex
                    items-center
                    justify-center
                    text-base-content/50
                  "
                >

                  No Cover

                </div>

              )}

            </div>

            {/* DETAILS */}

            <div className="flex-1">

              {/* INFO */}

              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-xl bg-base-200 p-4">

                  <p className="text-xs opacity-60">

                    Author

                  </p>

                  <p className="font-bold mt-1">

                    {selectedMagazine.author || "-"}

                  </p>

                </div>

                <div className="rounded-xl bg-base-200 p-4">

                  <p className="text-xs opacity-60">

                    Category

                  </p>

                  <p className="font-bold mt-1">

                    {selectedMagazine.category || "-"}

                  </p>

                </div>

                <div className="rounded-xl bg-base-200 p-4">

                  <p className="text-xs opacity-60">

                    Edition

                  </p>

                  <p className="font-bold mt-1">

                    {selectedMagazine.edition || "-"}

                  </p>

                </div>

                <div className="rounded-xl bg-base-200 p-4">

                  <p className="text-xs opacity-60">

                    Year

                  </p>

                  <p className="font-bold mt-1">

                    {selectedMagazine.year || "-"}

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <div
          className="
            border-t
            border-base-300
            bg-base-100
            px-6
            py-5
            flex
            justify-between
            items-center
            flex-wrap
            gap-3
          "
        >

          <div className="text-sm opacity-60">

            {selectedMagazine.publicationDate
              ? `Published on ${new Date(
                  selectedMagazine.publicationDate
                ).toLocaleDateString()}`
              : ""}

          </div>

          <div className="flex gap-3">

            {selectedMagazine.pdfFile && (

              <>

                <button
                  className="btn btn-primary rounded-xl px-6"
                  onClick={() =>
                    window.open(
                      selectedMagazine.pdfFile,
                      "_blank"
                    )
                  }
                >

                  📖 View PDF

                </button>

                <a
                  href={selectedMagazine.pdfFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-primary rounded-xl px-6"
                >

                  ⬇ Download

                </a>

              </>

            )}

          </div>

        </div>

      </>

    )}

  </div>

  <form
    method="dialog"
    className="modal-backdrop"
  >

    <button>

      close

    </button>

  </form>

</dialog>


          {/* EMPTY STATE */}

          {filteredMagazines.length ===
            0 && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-base-content">
                No Publications Found
              </h2>

              <p className="text-base-content/70 mt-2">
                Try searching with a
                different keyword.
              </p>
            </div>
          )}
        </div>
      </section>
      <LogoStrip/>
    </>
  );
}