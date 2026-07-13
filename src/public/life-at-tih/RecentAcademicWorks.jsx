import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";

import api from "../../services/api";

import {
  FaSearch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaGraduationCap,
  FaStar,
  FaBookOpen,
} from "react-icons/fa";
import LogoStrip from "../../styles/Logostrip";


const getImageUrl = (image) => image || "";

const categories = [
  "All",
  "Industrial Visit",
  "Workshop",
  "Faculty Development Program",
  "Seminar",
  "Internship",
  "Research Activity",
  "Guest Lecture",
  "Hackathon",
  "Training Program",
];

const RecentAcademicWorks = () => {
  // =====================================================
  // DATA
  // =====================================================

  const [activities, setActivities] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

 

const [currentSlide, setCurrentSlide] = useState(0);

  // =====================================================
  // FILTERS
  // =====================================================

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedCategory,
    setSelectedCategory] =
    useState("All");

  // =====================================================
  // MODAL
  // =====================================================

  const [selectedActivity,
    setSelectedActivity] =
    useState(null);

  // =====================================================
  // FETCH
  // =====================================================

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities =
    async () => {
      try {
        setLoading(true);

        const res = await api.get("/academic-works");

const published = (res.data.data || []).filter(
  (item) => item.status === "Published"
);

setActivities(published);
      
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    
    
  // =====================================================
  // FILTERED DATA
  // =====================================================

  const filteredActivities =
    useMemo(() => {
      return activities.filter(
        (activity) => {
          const matchesSearch =
            activity.title
              ?.toLowerCase()
              .includes(
                searchTerm.toLowerCase()
              ) ||
            activity.description
              ?.toLowerCase()
              .includes(
                searchTerm.toLowerCase()
              );

          const matchesCategory =
            selectedCategory ===
            "All"
              ? true
              : activity.category ===
                selectedCategory;

          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );
    }, [
      activities,
      searchTerm,
      selectedCategory,
    ]);

  // =====================================================
  // FEATURED ACTIVITY
  // =====================================================

  const featuredActivities =
  activities.filter(
    (item) => item.featured
  );

  useEffect(() => {
  if (!featuredActivities.length) return;

  const timer = setInterval(() => {
    setCurrentSlide((prev) =>
      (prev + 1) % featuredActivities.length
    );
  }, 5000);

  return () => clearInterval(timer);
}, [featuredActivities]);

const featuredActivity =
  featuredActivities[currentSlide];

  // =====================================================
  // STATS
  // =====================================================

  const totalActivities =
    activities.length;

  const totalParticipants =
    activities.reduce(
      (sum, item) =>
        sum +
        (item.participants || 0),
      0
    );

  const totalCategories =
    new Set(
      activities.map(
        (item) => item.category
      )
    ).size;

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <>
    <div className="min-h-screen bg-base-100">

      {/* ===================================== */}
      {/* HERO SECTION */}
      {/* ===================================== */}

      <section className="relative overflow-hidden bg-linear-to-br from-primary via-primary-focus to-secondary text-white">

        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white blur-3xl" />

          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6">

              <FaGraduationCap />

              <span>
                Academic Excellence
              </span>

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              Recent Academic
              <span className="block text-yellow-300">
                Activities
              </span>
            </h1>

            <p className="text-lg md:text-xl mt-6 text-white/90 max-w-3xl">
              Explore workshops,
              seminars, internships,
              industrial visits,
              research activities and
              professional development
              programs shaping academic
              excellence.
            </p>

          </div>

        </div>

      </section>

  
            {/* ===================================== */}
      {/* FEATURED ACTIVITY */}
      {/* ===================================== */}

    {featuredActivities.length > 0 && (
  <section className="py-16 bg-base-100 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4">

      <div className="flex items-center justify-between mb-8">

        <div className="badge badge-warning badge-lg gap-2">
          <FaStar />
          Featured Activity
        </div>

      </div>

      <AnimatePresence mode="wait">

        <motion.div
          key={featuredActivity._id}
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
            duration: 0.6,
          }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >

          {/* LEFT */}

          <div>

            <span className="badge badge-primary mb-4">
              {featuredActivity.category}
            </span>

            <h2 className="text-4xl font-black mb-4">
              {featuredActivity.title}
            </h2>

            <p className="text-base-content/70 leading-8 mb-8">
              {featuredActivity.description}
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">

              <div className="card bg-base-200 shadow">

                <div className="card-body p-5">

                  <div className="flex items-center gap-2 text-primary mb-2">
                    <FaCalendarAlt />
                    Date
                  </div>

                  <p className="font-semibold">
                    {featuredActivity.activityDate
                      ? new Date(
                          featuredActivity.activityDate
                        ).toLocaleDateString()
                      : "-"}
                  </p>

                </div>

              </div>

              <div className="card bg-base-200 shadow">

                <div className="card-body p-5">

                  <div className="flex items-center gap-2 text-primary mb-2">
                    <FaUsers />
                    Participants
                  </div>

                  <p className="font-semibold">
                    {featuredActivity.participants || 0}
                  </p>

                </div>

              </div>

              <div className="card bg-base-200 shadow">

                <div className="card-body p-5">

                  <div className="flex items-center gap-2 text-primary mb-2">
                    <FaMapMarkerAlt />
                    Venue
                  </div>

                  <p className="font-semibold">
                    {featuredActivity.location ||
                      "Campus"}
                  </p>

                </div>

              </div>

            </div>

            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={() =>
                setSelectedActivity(
                  featuredActivity
                )
              }
              className="btn btn-primary btn-lg"
            >
              View Details
            </motion.button>

          </div>

          {/* RIGHT */}

          <motion.div
            whileHover={{
              scale: 1.04,
            }}
            className="overflow-hidden rounded-3xl shadow-2xl border border-base-300"
          >

            <img
              src={
                featuredActivity.image
                  ? getImageUrl(
                      featuredActivity.image
                    )
                  : "https://placehold.co/1000x700"
              }
              alt={featuredActivity.title}
              className="w-full h-125 object-cover"
            />

          </motion.div>

        </motion.div>

      </AnimatePresence>

      {/* DOTS */}

      <div className="flex justify-center gap-3 mt-8">

        {featuredActivities.map(
          (_, index) => (
            <button
              key={index}
              onClick={() =>
                setCurrentSlide(index)
              }
              className={`transition-all duration-300 rounded-full ${
                currentSlide === index
                  ? "w-8 h-3 bg-primary"
                  : "w-3 h-3 bg-base-300"
              }`}
            />
          )
        )}

      </div>
      <div className="flex gap-2">
          <button
            className="btn btn-circle btn-outline"
            onClick={() =>
              setCurrentSlide(
                (prev) =>
                  (prev -
                    1 +
                    featuredActivities.length) %
                  featuredActivities.length
              )
            }
          >
            ❮
          </button>

          <button
            className="btn btn-circle btn-outline"
            onClick={() =>
              setCurrentSlide(
                (prev) =>
                  (prev + 1) %
                  featuredActivities.length
              )
            }
          >
            ❯
          </button>
        </div>

    </div>
  </section>
)}
    {/* ===================================== */}
      {/* STATS STRIP */}
      {/* ===================================== */}

      <section className="bg-base-200 border-y border-base-300">

        <div className="max-w-7xl mx-auto px-4 py-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-base-100 rounded-2xl p-6 shadow-lg">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-xl bg-primary text-white flex items-center justify-center text-xl">

                  <FaBookOpen />

                </div>

                <div>

                  <h3 className="text-3xl font-black">
                    {totalActivities}
                  </h3>

                  <p className="text-base-content/70">
                    Activities
                  </p>

                </div>

              </div>

            </div>

            <div className="bg-base-100 rounded-2xl p-6 shadow-lg">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-xl bg-secondary text-white flex items-center justify-center text-xl">

                  <FaUsers />

                </div>

                <div>

                  <h3 className="text-3xl font-black">
                    {totalParticipants}
                  </h3>

                  <p className="text-base-content/70">
                    Participants
                  </p>

                </div>

              </div>

            </div>

            <div className="bg-base-100 rounded-2xl p-6 shadow-lg">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-xl bg-accent text-white flex items-center justify-center text-xl">

                  <FaStar />

                </div>

                <div>

                  <h3 className="text-3xl font-black">
                    {totalCategories}
                  </h3>

                  <p className="text-base-content/70">
                    Categories
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>
      {/* ===================================== */}
      {/* FILTERS */}
      {/* ===================================== */}

      <section className="py-12 bg-base-200">

        <div className="max-w-7xl mx-auto px-4">

          <div className="bg-base-100 rounded-3xl shadow-xl p-6 border border-base-300">

            {/* SEARCH */}

            <div className="mb-6">

              <label className="input input-bordered flex items-center gap-3">

                <FaSearch className="text-primary" />

                <input
                  type="text"
                  className="grow"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(
                      e.target.value
                    )
                  }
                />

              </label>

            </div>

            {/* CATEGORY FILTERS */}

            <div className="flex flex-wrap gap-3">

              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    setSelectedCategory(
                      category
                    )
                  }
                  className={`btn ${
                    selectedCategory === category
                      ? "btn-primary"
                      : "btn-outline"
                  }`}
                >
                  {category}
                </button>
              ))}

            </div>

          </div>

        </div>

      </section>

      {/* ===================================== */}
      {/* ACTIVITIES GRID */}
      {/* ===================================== */}

      <section className="py-16">

        <div className="max-w-7xl mx-auto px-4">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

            <div>

              <h2 className="text-4xl font-black">
                Academic Activities
              </h2>

              <p className="text-base-content/70 mt-2">
                Explore academic initiatives,
                workshops, seminars and
                professional development
                programs.
              </p>

            </div>

            <div className="badge badge-primary badge-lg">
              {filteredActivities.length}
              {" "}
              Activities Found
            </div>

          </div>

          {loading ? (

            <div className="flex justify-center py-20">
              <span className="loading loading-spinner loading-lg"></span>
            </div>

          ) : filteredActivities.length === 0 ? (

            <div className="text-center py-20">

              <FaGraduationCap className="mx-auto text-6xl opacity-30 mb-4" />

              <h3 className="text-2xl font-bold">
                No Activities Found
              </h3>

              <p className="text-base-content/60 mt-2">
                Try changing filters or search terms.
              </p>

            </div>

          ) : (

            <div
              className="
                max-h-237.5
                overflow-y-auto
                pr-3
                custom-scrollbar
              "
            >
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
    {filteredActivities.map((activity) => (
      <div
        key={activity._id}
        className="card bg-base-100 border border-base-300 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
      >

                    {/* IMAGE */}

                    <figure className="relative h-64 overflow-hidden">

                      <img
                       src={
  activity.image
    ? getImageUrl(
        activity.image
      )
    : "https://placehold.co/800x600"
}
                        alt={activity.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />

                      <div className="absolute top-4 left-4 flex gap-2">

                        <span className="badge badge-primary">
                          {activity.category}
                        </span>

                        {activity.featured && (
                          <span className="badge badge-warning gap-1">
                            <FaStar />
                            Featured
                          </span>
                        )}

                      </div>

                    </figure>

                    {/* CONTENT */}

                    <div className="card-body">

                      <h3 className="card-title text-xl line-clamp-2">
                        {activity.title}
                      </h3>

                      <p className="text-base-content/70 line-clamp-3">
                        {activity.description}
                      </p>

                      {/* META */}

                      <div className="space-y-3 my-4">

                        <div className="flex items-center gap-3 text-sm">

                          <FaCalendarAlt className="text-primary" />

                          <span>
                            {activity.activityDate
                              ? new Date(
                                  activity.activityDate
                                ).toLocaleDateString()
                              : "-"}
                          </span>

                        </div>

                        <div className="flex items-center gap-3 text-sm">

                          <FaMapMarkerAlt className="text-primary" />

                          <span className="line-clamp-1">
                            {activity.location ||
                              "Campus"}
                          </span>

                        </div>

                        <div className="flex items-center gap-3 text-sm">

                          <FaUsers className="text-primary" />

                          <span>
                            {activity.participants || 0}
                            {" "}
                            Participants
                          </span>

                        </div>

                      </div>

                      {/* ACTION */}

                      <div className="card-actions justify-end">

                        <button
                          onClick={() =>
                            setSelectedActivity(
                              activity
                            )
                          }
                          className="btn btn-primary"
                        >
                          View Details
                        </button>

                      </div>

                    </div>

                  </div>
                )
              )}
            </div>
            </div>

          )}

        </div>

      </section>
            {/* ===================================== */}
      {/* DETAILS MODAL */}
      {/* ===================================== */}

          {selectedActivity && (
  <div className="modal modal-open">
    <div className="modal-box w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto p-0 bg-base-100">

      {/* CLOSE BUTTON */}

      <button
        onClick={() => setSelectedActivity(null)}
        className="btn btn-circle btn-primary fixed right-8 top-8 z-50"
      >
        ✕
      </button>

      {/* HERO IMAGE */}

      <div className="relative h-64 md:h-96">

        <img
          src={
            selectedActivity.image
              ? getImageUrl(selectedActivity.image)
              : "https://placehold.co/1200x700"
          }
          alt={selectedActivity.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">

          <div className="flex flex-wrap gap-2 mb-3">

            <span className="badge badge-primary">
              {selectedActivity.category}
            </span>

            {selectedActivity.featured && (
              <span className="badge badge-warning gap-1">
                <FaStar />
                Featured
              </span>
            )}

          </div>

          <h2 className="text-3xl md:text-5xl font-black">
            {selectedActivity.title}
          </h2>

        </div>

      </div>

      {/* CONTENT */}

      <div className="p-8">

        {/* META */}

        <div className="grid md:grid-cols-4 gap-4 mb-10">

          <div className="bg-base-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-primary mb-2">
              <FaCalendarAlt />
              Date
            </div>

            <p className="font-semibold">
              {selectedActivity.activityDate
                ? new Date(
                    selectedActivity.activityDate
                  ).toLocaleDateString()
                : "-"}
            </p>
          </div>

          <div className="bg-base-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-primary mb-2">
              <FaUsers />
              Participants
            </div>

            <p className="font-semibold">
              {selectedActivity.participants || 0}
            </p>
          </div>

          <div className="bg-base-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-primary mb-2">
              <FaMapMarkerAlt />
              Location
            </div>

            <p className="font-semibold">
              {selectedActivity.location || "Campus"}
            </p>
          </div>

          <div className="bg-base-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-primary mb-2">
              <FaGraduationCap />
              Organizer
            </div>

            <p className="font-semibold">
              {selectedActivity.organizer || "Institution"}
            </p>
          </div>

        </div>

        {/* DESCRIPTION */}

        <div className="mb-10">

          <h3 className="text-2xl font-bold mb-4">
            About This Activity
          </h3>

          <div className="bg-base-200 rounded-2xl p-6">

            <p className="leading-8 whitespace-pre-wrap">
              {selectedActivity.description}
            </p>

          </div>

        </div>

        {/* GALLERY */}

        {selectedActivity.gallery &&
          selectedActivity.gallery.length > 0 && (

          <div className="mt-10">

            <h3 className="text-2xl font-bold mb-6">
              Activity Gallery
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {selectedActivity.gallery.map(
                (item, index) => (

                  <div
                    key={item.publicId || index}
                    className="group overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-xl"
                  >

                    <img
                      src={
                        item.image
                          ? getImageUrl(item.image)
                          : "https://placehold.co/800x600"
                      }
                      alt={
                        item.caption ||
                        `Gallery ${index + 1}`
                      }
                      className="w-full h-72 object-contain transition-transform duration-500 group-hover:scale-110"
                    />

                    {item.caption && (
                      <div className="p-4">
                        <p className="text-sm text-base-content/70">
                          {item.caption}
                        </p>
                      </div>
                    )}

                  </div>

                )
              )}

            </div>

          </div>

        )}

        {/* CLOSE */}

        <div className="flex justify-end mt-10">

          <button
            onClick={() =>
              setSelectedActivity(null)
            }
            className="btn btn-primary"
          >
            Close
          </button>

        </div>

      </div>

    </div>

    <label
      className="modal-backdrop"
      onClick={() =>
        setSelectedActivity(null)
      }
    >
      Close
    </label>

  </div>
)}

          </div>
          <LogoStrip/>
          </>
  );
};

export default RecentAcademicWorks;