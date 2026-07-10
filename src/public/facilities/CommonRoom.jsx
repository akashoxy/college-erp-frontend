import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2,
  Users,
  Sparkles,
  ArrowRight,
  Trophy,
  HeartHandshake,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";

/* =========================================================
   FONTS
   Purely typographic — independent of theme/color mode.
   Add to your global stylesheet or index.html:

   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

   All COLOR is handled via daisyUI theme classes (base-100/200/300,
   neutral, primary, secondary, base-content) so the page follows
   whatever theme is active — light, dark, or custom.
========================================================= */

const displayFont = { fontFamily: "'Fraunces', 'Georgia', serif" };
const monoFont = { fontFamily: "'JetBrains Mono', monospace" };

/* =========================================================
   ANIMATIONS — restrained, purposeful, no scattershot motion
========================================================= */

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

const CommonRoom = () => {
  const [loading, setLoading] = useState(true);
  const [commonRoom, setCommonRoom] = useState(null);

  const featuredGames =
    commonRoom?.games?.filter((game) => game.featured === true) || [];

  const [currentFeatured, setCurrentFeatured] = useState(0);

  useEffect(() => {
    if (featuredGames.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentFeatured((prev) => (prev + 1) % featuredGames.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredGames.length]);

  useEffect(() => {
    if (currentFeatured >= featuredGames.length) {
      setCurrentFeatured(0);
    }
  }, [featuredGames.length, currentFeatured]);

  useEffect(() => {
    fetchCommonRoom();
  }, []);

  const fetchCommonRoom = async () => {
    try {
      const { data } = await api.get("/common-room");
      const cms = data.data;

      setCommonRoom({
        heroSubtitle: cms?.heroSubtitle || "",
        heroImage: cms?.heroImage || "",
        aboutText: cms?.aboutText || "",
        games: cms?.games || [],
      });
    } catch (error) {
      setCommonRoom({
        heroSubtitle: "",
        heroImage: "",
        aboutText: "",
        games: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const heroImage = commonRoom?.heroImage || null;

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p
            className="mt-5 tracking-wide text-sm uppercase text-base-content/60"
            style={monoFont}
          >
            Preparing the Common Room
          </p>
        </div>
      </div>
    );
  }

  const pillars = [
    {
      icon: Gamepad2,
      title: "Indoor Games",
      description:
        "A rotating collection of table and board games kept in good order, ready whenever a free hour appears.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "An unassigned room where conversations start easily and acquaintances turn into the friends you keep after graduation.",
    },
    {
      icon: HeartHandshake,
      title: "Wellness",
      description:
        "A deliberate pause from lecture halls and deadlines — the kind of rest that makes the rest of the day work better.",
    },
  ];

  const ledger = [
    { number: "10+", label: "Games in rotation" },
    { number: "100%", label: "Student-led" },
    { number: "365", label: "Days open a year" },
    { number: "—", label: "No sign-up required" },
  ];

  return (
    <div className="bg-base-100 overflow-hidden">
      {/* =========================================================
          HERO — asymmetric split, quiet ambient motion
      ========================================================= */}
      <section className="relative min-h-screen flex items-center bg-neutral text-neutral-content">
        {/* Fine grid — uses currentColor so it follows theme text color */}
        <div
          className="absolute inset-0 opacity-[0.07] text-primary"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Single ambient glow, slow and subtle */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-130 h-130 rounded-full bg-primary/20 blur-[120px]"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full py-32">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
            {/* Left: text */}
            <motion.div variants={container} initial="hidden" animate="show">
              <motion.div
                variants={item}
                className="inline-flex items-center gap-3 pb-3 mb-8 border-b border-primary/30"
              >
                <Sparkles size={15} className="text-primary" />
                <span
                  className="text-xs tracking-[0.25em] uppercase text-primary"
                  style={monoFont}
                >
                  The Common Room · Campus Recreation
                </span>
              </motion.div>

              <motion.h1
                variants={item}
                style={{ ...displayFont, fontWeight: 600 }}
                className="text-6xl md:text-7xl xl:text-8xl leading-[0.95] tracking-tight"
              >
                Where the day
                <br />
                <span className="text-primary italic font-medium">
                  slows down
                </span>
              </motion.h1>

              <motion.p
                variants={item}
                className="mt-8 max-w-lg text-lg leading-8 text-neutral-content/80"
              >
                {commonRoom?.heroSubtitle ||
                  "A quiet corner of campus for games, conversation and everything academics don't cover."}
              </motion.p>

              <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-5">
                <Link to="/sports" className="btn btn-primary rounded-none px-7 group">
                  Explore Activities
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <span className="text-sm text-neutral-content/60" style={monoFont}>
                  No booking · Open to all students
                </span>
              </motion.div>
            </motion.div>

            {/* Right: framed image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-3 border border-primary/40 pointer-events-none" />
              <div className="relative overflow-hidden aspect-4/5 bg-base-300">
                {heroImage ? (
                  <img src={heroImage} alt="Common Room" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Gamepad2 size={80} className="text-primary/30" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-6 -left-6 px-6 py-4 hidden sm:block bg-base-100 text-base-content">
                <p className="text-xs tracking-widest uppercase text-base-content/60" style={monoFont}>
                  Open Daily
                </p>
                <p style={displayFont} className="text-xl font-semibold">
                  8am – 10pm
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary/70"
        >
          <ChevronDown size={28} />
        </motion.div>
      </section>

      {/* =========================================================
          MARQUEE — signature ticker, slow linear scroll
      ========================================================= */}
      <div className="relative py-5 overflow-hidden border-b border-primary/20 bg-neutral text-neutral-content">
        <motion.div
          className="flex whitespace-nowrap gap-10"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        >
          {Array(2)
            .fill([
              "Chess",
              "Carrom",
              "Table Tennis",
              "Foosball",
              "Board Games",
              "Cards",
              "Quiet Conversation",
            ])
            .flat()
            .map((label, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-10 text-sm tracking-[0.2em] uppercase text-neutral-content/60"
                style={monoFont}
              >
                {label}
                <span className="text-primary">·</span>
              </span>
            ))}
        </motion.div>
      </div>

      {/* =========================================================
          THREE PILLARS — roman numerals, no icon-badge cliché
      ========================================================= */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-px bg-base-300"
          >
            {pillars.map((pillar, index) => (
              <motion.div key={index} variants={item} className="p-10 bg-base-100">
                <div className="flex items-start justify-between mb-8">
                  <span style={displayFont} className="text-4xl font-semibold text-primary">
                    {ROMAN[index]}
                  </span>
                  <pillar.icon size={26} className="text-base-content" strokeWidth={1.5} />
                </div>
                <h3 style={displayFont} className="text-2xl font-semibold text-base-content">
                  {pillar.title}
                </h3>
                <p className="mt-4 leading-7 text-[15px] text-base-content/70">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          ABOUT — asymmetric, ledger-style stats
      ========================================================= */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div variants={fadeLeft} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <span className="text-xs tracking-[0.25em] uppercase text-primary" style={monoFont}>
                About the Room
              </span>

              <h2
                style={displayFont}
                className="mt-4 text-4xl md:text-5xl font-semibold leading-tight text-base-content"
              >
                Recreation, held to a
                <span className="italic text-secondary"> quiet standard</span>
              </h2>

              <p className="mt-7 text-lg leading-8 text-base-content/80">
                {commonRoom?.aboutText ||
                  "The Common Room serves as a recreational hub where students relax, take up an indoor game and build friendships outside the classroom — a small, well-kept space with an outsized role in campus life."}
              </p>

              {/* Ledger */}
              <div className="mt-12 border-t border-base-300">
                {ledger.map((row, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-4 border-b border-base-300"
                  >
                    <span className="text-sm text-base-content/60" style={monoFont}>
                      {row.label}
                    </span>
                    <span style={displayFont} className="text-2xl font-semibold text-base-content">
                      {row.number}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-3 border border-primary/30 pointer-events-none" />
              <div className="relative overflow-hidden aspect-4/5 bg-base-300">
                {heroImage ? (
                  <img src={heroImage} alt="Common Room interior" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Gamepad2 size={90} className="text-primary/20" />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURED GAMES — "Now Showing" board
      ========================================================= */}
      {featuredGames.length > 0 && (
        <section className="py-24 bg-neutral text-neutral-content">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-end justify-between mb-12 flex-wrap gap-4"
            >
              <div>
                <span className="text-xs tracking-[0.25em] uppercase text-primary" style={monoFont}>
                  Now Showing
                </span>
                <h2 style={displayFont} className="mt-3 text-4xl md:text-5xl font-semibold">
                  Featured Games
                </h2>
              </div>
              <div className="flex gap-2">
                {featuredGames.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeatured(index)}
                    className={`h-0.5 transition-all duration-500 ${
                      currentFeatured === index ? "w-10 bg-primary" : "w-4 bg-neutral-content/25"
                    }`}
                  />
                ))}
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={featuredGames[currentFeatured]._id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="grid md:grid-cols-2 gap-0 border border-primary/20"
              >
                <div className="relative aspect-4/3 md:aspect-auto overflow-hidden bg-base-300">
                  <img
                    src={featuredGames[currentFeatured]?.image}
                    alt={featuredGames[currentFeatured]?.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute top-5 left-5 w-11 h-11 flex items-center justify-center text-lg font-semibold bg-primary text-primary-content"
                    style={monoFont}
                  >
                    {String(currentFeatured + 1).padStart(2, "0")}
                  </div>
                </div>

                <div className="p-10 md:p-14 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-5">
                    <Trophy size={15} className="text-primary" />
                    <span className="text-xs tracking-[0.2em] uppercase text-primary" style={monoFont}>
                      Student Favourite
                    </span>
                  </div>
                  <h3 style={displayFont} className="text-3xl md:text-4xl font-semibold">
                    {featuredGames[currentFeatured].title}
                  </h3>
                  <p className="mt-5 leading-8 text-neutral-content/70">
                    {featuredGames[currentFeatured].description}
                  </p>

                  <div className="mt-9 flex gap-3">
                    <button
                      onClick={() =>
                        setCurrentFeatured(
                          currentFeatured === 0 ? featuredGames.length - 1 : currentFeatured - 1
                        )
                      }
                      className="btn btn-outline btn-circle border-primary/40 text-neutral-content hover:bg-primary hover:border-primary hover:text-primary-content"
                    >
                      ←
                    </button>
                    <button
                      onClick={() =>
                        setCurrentFeatured(
                          currentFeatured === featuredGames.length - 1 ? 0 : currentFeatured + 1
                        )
                      }
                      className="btn btn-outline btn-circle border-primary/40 text-neutral-content hover:bg-primary hover:border-primary hover:text-primary-content"
                    >
                      →
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* =========================================================
          ACTIVITIES GRID — framed cards, corner accents
      ========================================================= */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 max-w-2xl"
          >
            <span className="text-xs tracking-[0.25em] uppercase text-primary" style={monoFont}>
              Indoor Activities
            </span>
            <h2
              style={displayFont}
              className="mt-3 text-4xl md:text-5xl font-semibold leading-tight text-base-content"
            >
              Recreation, beyond academics
            </h2>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {commonRoom?.games?.map((game) => (
              <motion.div key={game._id} variants={item} whileHover={{ y: -6 }} transition={{ duration: 0.3 }}>
                <div className="relative border border-base-300 bg-base-100">
                  {/* corner accents */}
                  <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary" />
                  <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary" />

                  <div className="relative h-64 overflow-hidden">
                    {game.image ? (
                      <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-base-200">
                        <Gamepad2 size={70} className="text-base-content/20" />
                      </div>
                    )}
                    {game.featured && (
                      <div
                        className="absolute top-4 left-4 px-3 py-1.5 text-xs tracking-widest uppercase bg-neutral text-primary"
                        style={monoFont}
                      >
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="p-7">
                    <h3 style={displayFont} className="text-xl font-semibold text-base-content">
                      {game.title}
                    </h3>
                    <p className="mt-3 leading-7 text-[15px] text-base-content/70">
                      {game.description}
                    </p>
                    <div className="mt-6 flex items-center justify-between pt-5 border-t border-base-300">
                      <span
                        className="text-xs tracking-widest uppercase text-base-content/50"
                        style={monoFont}
                      >
                        Available Now
                      </span>
                      <ArrowRight size={16} className="text-primary" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          STUDENT EXPERIENCE — pull quote
      ========================================================= */}
      <section className="py-28 bg-neutral text-neutral-content">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Users size={30} className="mx-auto mb-8 text-primary" strokeWidth={1.5} />
            <p
              style={{ ...displayFont, fontStyle: "italic" }}
              className="text-3xl md:text-4xl leading-snug font-light"
            >
              "The Common Room is where friendships grow, ideas are shared, and
              students recharge after a busy academic day."
            </p>

            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "10+", label: "Indoor Games" },
                { number: "100%", label: "Student Friendly" },
                { number: "365", label: "Days Open" },
                { number: "∞", label: "Memories" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p style={displayFont} className="text-4xl font-semibold text-primary">
                    {stat.number}
                  </p>
                  <p
                    className="mt-2 text-xs tracking-widest uppercase text-neutral-content/60"
                    style={monoFont}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="py-28">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs tracking-[0.25em] uppercase text-primary" style={monoFont}>
              Visit the Room
            </span>
            <h2
              style={displayFont}
              className="mt-4 text-4xl md:text-6xl font-semibold leading-tight text-base-content"
            >
              Step in, unwind,
              <br />
              <span className="italic text-secondary">stay a while</span>
            </h2>
            <p className="mt-6 max-w-lg mx-auto leading-8 text-base-content/70">
              No appointment, no fee, no fuss — just open the door and see who's around.
            </p>

            <motion.button
              whileHover={{ y: -2 }}
              transition={{ duration: 0.25 }}
              className="btn btn-neutral rounded-none px-8 mt-10"
            >
              <Link to="/sports"> Explore Activities</Link>
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CommonRoom;