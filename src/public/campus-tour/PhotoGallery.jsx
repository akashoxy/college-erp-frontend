import React, {
  useEffect,
  useState,
} from "react";

import api from "../../services/api";

import { motion, AnimatePresence } from "framer-motion";

import {
  Folder,
  Calendar,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";


export default function PhotoGallery() {
  const [gallery, setGallery] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [activeYear, setActiveYear] =
    useState(null);

  const [selectedAlbum, setSelectedAlbum] =
    useState(null);

  const [currentPhoto, setCurrentPhoto] =
    useState(0);

  const [heroSlide, setHeroSlide] =
    useState(0);

  /* ==========================================
     LOAD GALLERY
  ========================================== */

  const loadGallery =
    async () => {
      try {
       const res =
  await api.get(
    "/photo-gallery"
  );

        setGallery(
          res.data.data
        );

        if (
          res.data.data
            ?.yearFolders
            ?.length
        ) {
          setActiveYear(
            res.data.data
              .yearFolders[0]._id
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadGallery();
  }, []);

  /* ==========================================
     HERO AUTO SLIDER
  ========================================== */

  useEffect(() => {
    if (
      !gallery?.heroImages
        ?.length
    )
      return;

    const timer =
      setInterval(() => {
        setHeroSlide(
          (prev) =>
            (prev + 1) %
            gallery.heroImages
              .length
        );
      }, 5000);

    return () =>
      clearInterval(timer);
  }, [gallery]);

  /* ==========================================
     MODAL
  ========================================== */

  const openAlbum =
    (album) => {
      setSelectedAlbum(
        album
      );
      setCurrentPhoto(0);

      document.body.style
        .overflow = "hidden";
    };

  const closeAlbum =
    () => {
      setSelectedAlbum(
        null
      );

      document.body.style
        .overflow = "auto";
    };

  const nextPhoto = () => {
  if (
    !selectedAlbum ||
    !selectedAlbum.photos ||
    selectedAlbum.photos.length === 0
  )
    return;

  setCurrentPhoto(
    (prev) =>
      prev ===
      selectedAlbum.photos.length - 1
        ? 0
        : prev + 1
  );
};

 const prevPhoto = () => {
  if (
    !selectedAlbum ||
    !selectedAlbum.photos ||
    selectedAlbum.photos.length === 0
  )
    return;

  setCurrentPhoto(
    (prev) =>
      prev === 0
        ? selectedAlbum.photos.length - 1
        : prev - 1
  );
};

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const activeYearData =
    gallery?.yearFolders?.find(
      (year) =>
        year._id ===
        activeYear
    );
      return (
    <>
      {/* HERO SECTION */}

      <section className="relative h-[70vh] overflow-hidden">

        {gallery?.heroImages?.length >
          0 && (
          <>
            <AnimatePresence mode="wait">

              <motion.img
                key={heroSlide}
               src={
  gallery.heroImages[heroSlide]?.image ||
  gallery.heroImages[heroSlide]
}
                alt="Gallery Hero"
                initial={{
                  opacity: 0,
                  scale: 1.05,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 1,
                }}
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                "
              />

            </AnimatePresence>

            <div
              className="
                absolute
                inset-0
                bg-linear-to-r
                from-black/80
                via-black/50
                to-black/30
              "
            />

            <div
              className="
                relative
                z-10
                h-full
                max-w-7xl
                mx-auto
                px-6
                flex
                items-center
              "
            >
              <div className="max-w-3xl">

                <motion.h1
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
                  className="
                    text-5xl
                    md:text-7xl
                    font-black
                    text-white
                    leading-tight
                  "
                >
                  Campus
                  Memories
                </motion.h1>

                <motion.p
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.2,
                    duration: 0.8,
                  }}
                  className="
                    text-white/90
                    text-lg
                    md:text-xl
                    mt-6
                    leading-relaxed
                  "
                >
                  A journey through
                  celebrations,
                  achievements,
                  festivals,
                  events and moments
                  that define our
                  college life.
                </motion.p>

              </div>
            </div>

            {/* SLIDER DOTS */}

            <div
              className="
                absolute
                bottom-8
                left-1/2
                -translate-x-1/2
                flex
                gap-3
                z-20
              "
            >
              {gallery?.heroImages?.map(
                (
                  _,
                  index
                ) => (
                  <button
                    key={index}
                    onClick={() =>
                      setHeroSlide(
                        index
                      )
                    }
                    className={`
                      h-3
                      rounded-full
                      transition-all
                      duration-300
                      ${
                        heroSlide ===
                        index
                          ? "w-10 bg-white"
                          : "w-3 bg-white/40"
                      }
                    `}
                  />
                )
              )}
            </div>

          </>
        )}

      </section>

      <section className="container mx-auto px-6 py-14 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Life at Techno India Hooghly</h2>
            <p className="text-base-content/80 leading-relaxed">
              The college regularly organizes cultural, technical, and social events
              throughout the academic year. From festivals and workshops to community
              initiatives and alumni meets, these moments reflect our vibrant campus
              spirit and collective growth.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card bg-base-200 shadow-xl"
          >
            <div className="card-body">
              <h3 className="card-title">What you will find</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Cultural & technical festivals</li>
                <li>Sports and fitness activities</li>
                <li>Social initiatives and outreach</li>
                <li>Academic seminars & workshops</li>
              </ul>
            </div>
          </motion.div>
        </section>

      {/* FEATURED MEMORIES */}

      <section className="py-20 bg-base-100">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-14">

            <motion.h2
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
              className="
                text-4xl
                md:text-5xl
                font-black
              "
            >
              Featured
              Memories
            </motion.h2>

            <p
              className="
                text-base-content/70
                mt-4
                max-w-2xl
                mx-auto
              "
            >
              Highlighting some
              of the most memorable
              moments from our
              campus journey.
            </p>

          </div>

          <div
            className="
              grid
              md:grid-cols-2
              xl:grid-cols-3
              gap-8
            "
          >

            {gallery?.featuredPhotos?.map(
              (photo) => (
                <motion.div
                  key={photo._id}
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
                  whileHover={{
                    y: -8,
                  }}
                  className="
                    card
                    bg-base-200
                    shadow-xl
                    overflow-hidden
                  "
                >
                  <figure>

                    <img
                    src={photo.image}
                      alt={
                        photo.title
                      }
                      className="
                        h-72
                        w-full
                        object-cover
                      "
                    />

                  </figure>

                  <div className="card-body">

                    <h3
                      className="
                        text-2xl
                        font-bold
                      "
                    >
                      {photo.title}
                    </h3>

                    <p
                      className="
                        text-base-content/70
                      "
                    >
                      {
                        photo.description
                      }
                    </p>

                  </div>

                </motion.div>
              )
            )}

          </div>

        </div>

      </section>
            {/* YEAR WISE GALLERY */}

      <section className="py-20 bg-base-200">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-14">

            <motion.h2
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
              className="
                text-4xl
                md:text-5xl
                font-black
              "
            >
              Year Wise Gallery
            </motion.h2>

            <p
              className="
                text-base-content/70
                mt-4
              "
            >
              Browse memories organized
              year by year.
            </p>

          </div>

          <div className="grid lg:grid-cols-12 gap-8">

            {/* YEAR SIDEBAR */}

            <div className="lg:col-span-3">

              <div
                className="
                  bg-base-100
                  rounded-3xl
                  shadow-xl
                  p-4
                  sticky
                  top-24
                "
              >

                <h3 className="font-bold text-lg mb-4">
                  Years
                </h3>

                <div className="space-y-3">

                  {gallery?.yearFolders?.map(
                    (year) => (
                      <button
                        key={year._id}
                        onClick={() =>
                          setActiveYear(
                            year._id
                          )
                        }
                        className={`
                          w-full
                          text-left
                          p-4
                          rounded-2xl
                          transition-all
                          duration-300
                          ${
                            activeYear ===
                            year._id
                              ? "bg-primary text-primary-content"
                              : "bg-base-200 hover:bg-base-300"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">

                          <Folder
                            size={20}
                          />

                          <div>

                            <div className="font-semibold">
                              {year.year}
                            </div>

                            <div className="text-sm opacity-70">
                              {
                                year
                                  .albums
                                  ?.length
                              }{" "}
                              Albums
                            </div>

                          </div>

                        </div>

                      </button>
                    )
                  )}

                </div>

              </div>

            </div>

            {/* ALBUM GRID */}

            <div className="lg:col-span-9">

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

                {activeYearData?.albums?.map(
                  (album) => (
                    <motion.div
                      key={album._id}
                      initial={{
                        opacity: 0,
                        y: 30,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      whileHover={{
                        y: -8,
                      }}
                      viewport={{
                        once: true,
                      }}
                      onClick={() => {
                        if (
                          !album.photos ||
                          album.photos.length === 0
                        ) {
                          alert(
                            "No photos available in this album."
                          );
                          return;
                        }

                        openAlbum(album);
                      }}
                      className="
                        card
                        bg-base-100
                        shadow-xl
                        cursor-pointer
                        overflow-hidden
                      "
                    >

                      <figure>

                        {album.coverImage ? (
                          <img
                           src={album.coverImage}
                            alt={
                              album.title
                            }
                            className="
                              h-64
                              w-full
                              object-cover
                            "
                          />
                        ) : (
                          <div
                            className="
                              h-64
                              w-full
                              flex
                              items-center
                              justify-center
                              bg-base-300
                            "
                          >
                            <ImageIcon
                              size={
                                60
                              }
                            />
                          </div>
                        )}

                      </figure>

                      <div className="card-body">

                        <h3
                          className="
                            text-xl
                            font-bold
                          "
                        >
                          {album.title}
                        </h3>

                        <div className="flex items-center gap-2 text-base-content/70">

                          <Calendar
                            size={16}
                          />

                          {album.eventDate
                            ? new Date(
                                album.eventDate
                              ).toLocaleDateString()
                            : "No Date"}

                        </div>

                        <div className="badge badge-outline mt-2">

                          <Camera
                            size={14}
                          />

                          {
                            album
                              .photos
                              ?.length
                          }{" "}
                          Photos

                        </div>

                      </div>

                    </motion.div>
                  )
                )}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ALBUM MODAL */}

      <AnimatePresence>

        {selectedAlbum && (
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
            className="
              fixed
              inset-0
              bg-black/90
              z-9999
              flex
              items-center
              justify-center
              p-4
            "
          >

            <button
              onClick={
                closeAlbum
              }
              className="
                btn
                btn-circle
                btn-error
                absolute
                top-6
                right-6
              "
            >
              <X size={20} />
            </button>

            <button
              onClick={
                prevPhoto
              }
              className="
                btn
                btn-circle
                absolute
                left-4
                md:left-8
              "
            >
              <ChevronLeft
                size={22}
              />
            </button>

            <button
              onClick={
                nextPhoto
              }
              className="
                btn
                btn-circle
                absolute
                right-4
                md:right-8
              "
            >
              <ChevronRight
                size={22}
              />
            </button>

            <div className="max-w-6xl w-full">

              <motion.img
                key={
                  currentPhoto
                }
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
               src={
  selectedAlbum.photos[currentPhoto]?.image
}
                alt=""
                className="
                  w-full
                  max-h-[75vh]
                  object-contain
                  rounded-3xl
                "
              />

              <div className="text-center mt-6 text-white">

                <h3 className="text-2xl font-bold">
                  {
                    selectedAlbum.title
                  }
                </h3>

                <p className="mt-2 opacity-80">
                  Photo{" "}
                  {currentPhoto + 1}
                  {" / "}
                  {
                    selectedAlbum
                      .photos
                      .length
                  }
                </p>

              </div>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </>
  );
}