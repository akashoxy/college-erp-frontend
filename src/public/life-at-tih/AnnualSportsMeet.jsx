import { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import {
  Trophy,
  Calendar,
  MapPin,
  ChevronDown,
  Flame,
  Activity,
  Users,
  Award,
  ArrowRight,
  Quote,
} from "lucide-react";

const getImageUrl = (image) => image || "";

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const VALUES = [
  {
    icon: Trophy,
    title: "Sportsmanship",
    text: "Playing fair and honouring every competitor on the field.",
  },
  {
    icon: Flame,
    title: "Competition",
    text: "Pushing limits with focus, grit and a will to win.",
  },
  {
    icon: Activity,
    title: "Fitness",
    text: "Building strength, stamina and lifelong healthy habits.",
  },
  {
    icon: Users,
    title: "Teamwork",
    text: "Winning together, one relay and one huddle at a time.",
  },
];

function TimelineCard({ item, align }) {
  return (
    <div
      className={`inline-block max-w-sm rounded-2xl border border-base-300 bg-base-100 px-6 py-5 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      <div className="asm-eyebrow text-xs uppercase tracking-[0.2em] text-primary">
        {item.day}
      </div>

      <h3 className="text-lg font-bold mt-2">
        {item.title}
      </h3>

      <p className="text-base-content/60 mt-1 text-sm leading-6">
        {item.description}
      </p>
    </div>
  );
}

export default function AnnualSportsMeet() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    fetchSportsMeet();

    const mq = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    setReduceMotion(mq.matches);

    const handler = (e) => setReduceMotion(e.matches);

    mq.addEventListener?.("change", handler);

    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const fetchSportsMeet = async () => {
    try {
      setLoading(true);

      const res = await api.get("/annual-sports-meet");

      setData(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const heroImage = data?.heroImage
    ? getImageUrl(data.heroImage)
    : null;

  const highlightsLoop =
    data?.highlights?.length > 0
      ? reduceMotion
        ? data.highlights
        : [...data.highlights, ...data.highlights]
      : [];

  const achievementsLoop =
    data?.achievements?.length > 0
      ? reduceMotion
        ? data.achievements
        : [...data.achievements, ...data.achievements]
      : [];

  return (
    <>
      {/* Display typeface + marquee keyframes, scoped to this page */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,ital@9..144,300..700,0,1&family=Fraunces:opsz,wght,ital@9..144,600,1&display=swap"
      />

      <style>{`
        .asm-display {
          font-family: "Fraunces", ui-serif, Georgia, serif;
          font-optical-sizing: auto;
        }

        .asm-eyebrow {
          font-family: "Fraunces", ui-serif, Georgia, serif;
          letter-spacing: 0.28em;
        }

        .asm-rule {
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            currentColor,
            transparent
          );
        }

        @keyframes asm-marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes asm-marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }

        .asm-track-left {
          animation: asm-marquee-left 38s linear infinite;
        }

        .asm-track-right {
          animation: asm-marquee-right 44s linear infinite;
        }

        .asm-marquee:hover .asm-track-left,
        .asm-marquee:hover .asm-track-right {
          animation-play-state: paused;
        }

        /* True alpha fade at the edges, independent of any
           background colour — this replaces gradient overlay
           divs so scrolling cards never show a hard-cropped
           edge or a mismatched-colour seam. */
        .asm-fade {
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0,
            black 56px,
            black calc(100% - 56px),
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0,
            black 56px,
            black calc(100% - 56px),
            transparent 100%
          );
        }

        @media (min-width: 768px) {
          .asm-fade {
            -webkit-mask-image: linear-gradient(
              to right,
              transparent 0,
              black 120px,
              black calc(100% - 120px),
              transparent 100%
            );
            mask-image: linear-gradient(
              to right,
              transparent 0,
              black 120px,
              black calc(100% - 120px),
              transparent 100%
            );
          }
        }

        .asm-fade.asm-no-fade {
          -webkit-mask-image: none;
          mask-image: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .asm-track-left,
          .asm-track-right {
            animation: none !important;
          }
        }
      `}</style>

      <div className="bg-base-100 overflow-hidden">
        {/* ==========================================================
            HERO
        ========================================================== */}

        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {heroImage && (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${heroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/70" />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/50" />
            </div>
          )}

          {!heroImage && (
            <div className="absolute inset-0 bg-neutral" />
          )}

          <motion.div
            animate={{ y: [0, 24, 0] }}
            transition={{ duration: 9, repeat: Infinity }}
            className="absolute top-16 left-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
          />

          <motion.div
            animate={{ y: [0, -28, 0] }}
            transition={{ duration: 11, repeat: Infinity }}
            className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-accent/10 blur-3xl"
          />

          <div className="relative z-10 container mx-auto px-6 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 mb-8">
                <Trophy size={16} className="text-primary" />
                <span className="asm-eyebrow text-xs md:text-sm uppercase text-white/70">
                  Annual Sports Meet
                </span>
                <Trophy size={16} className="text-primary" />
              </div>

              <h1 className="asm-display text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.05] italic">
                Champions Are
                <br />
                <span className="not-italic font-black">
                  Made Here
                </span>
              </h1>

              <div className="w-24 h-px bg-primary mx-auto mt-8" />

              <p className="max-w-2xl mx-auto mt-8 text-base md:text-xl text-white/70 leading-relaxed">
                {data?.heroSubtitle ||
                  "A season-defining celebration of discipline, speed and team spirit."}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-12 text-sm md:text-base text-white/80"
            >
              {data?.startDate && (
                <span className="inline-flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  {formatDate(data.startDate)}
                  {data?.endDate &&
                    ` – ${formatDate(data.endDate)}`}
                </span>
              )}

              {data?.startDate && data?.venue && (
                <span className="hidden md:inline text-white/30">
                  •
                </span>
              )}

              {data?.venue && (
                <span className="inline-flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  {data.venue}
                </span>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4 mt-12"
            >
              {data?.registerLink && (
                <a
                  href={data.registerLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-lg rounded-full px-8"
                >
                  Register Now
                </a>
              )}

              <a
                href="#sports-events"
                className="btn btn-ghost btn-lg rounded-full px-8 text-white border border-white/30 hover:bg-white/10 hover:border-white/50"
              >
                Explore Events
              </a>
            </motion.div>

            {/* Scroll cue sits in normal flow below the CTAs,
                so it can never overlap them on shorter viewports. */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="mt-16"
            >
              <ChevronDown
                size={28}
                className="mx-auto text-white/50"
              />
            </motion.div>
          </div>
        </section>

        {/* ==========================================================
            STATS — editorial ledger band
        ========================================================== */}

        {data?.stats?.length > 0 && (
          <section className="relative bg-neutral text-neutral-content">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
                {data.stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="py-14 px-6 text-center"
                  >
                    <div className="asm-display text-4xl md:text-5xl font-semibold italic text-primary">
                      {stat.value}
                    </div>

                    <div className="mt-3 text-xs md:text-sm uppercase tracking-[0.2em] text-neutral-content/60">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ==========================================================
            ABOUT
        ========================================================== */}

        <section className="py-28 bg-base-100">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20 items-start">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="asm-eyebrow text-xs uppercase tracking-[0.28em] text-primary mb-5">
                  About The Event
                </div>

                <h2 className="asm-display text-3xl md:text-5xl font-medium italic text-base-content mb-8 leading-tight">
                  Celebrating excellence, discipline
                  &amp; team spirit
                </h2>

                <p className="text-base md:text-lg leading-8 text-base-content/70">
                  {data?.aboutText}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="divide-y divide-base-300 border-y border-base-300"
              >
                {VALUES.map((value, index) => {
                  const Icon = value.icon;

                  return (
                    <div
                      key={value.title}
                      className="flex items-start gap-5 py-6"
                    >
                      <span className="asm-display text-sm text-base-content/30 mt-1 w-6 shrink-0">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="w-11 h-11 rounded-full border border-primary/40 flex items-center justify-center shrink-0 text-primary">
                        <Icon size={18} />
                      </span>

                      <div>
                        <h3 className="font-semibold text-base-content">
                          {value.title}
                        </h3>

                        <p className="text-sm text-base-content/60 mt-1">
                          {value.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ==========================================================
            HIGHLIGHTS — continuous horizontal loop
        ========================================================== */}

        {data?.highlights?.length > 0 && (
          <section className="py-28 bg-base-200">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <div className="asm-eyebrow text-xs uppercase tracking-[0.28em] text-primary mb-4">
                  Highlights
                </div>

                <h2 className="asm-display text-3xl md:text-5xl font-medium italic">
                  Event Highlights
                </h2>

                <p className="text-base-content/60 mt-4 max-w-2xl mx-auto">
                  The values, achievements and spirit that
                  define our Annual Sports Meet.
                </p>
              </div>
            </div>

            <div
              className={`asm-marquee relative overflow-hidden asm-fade ${
                reduceMotion ? "asm-no-fade" : ""
              }`}
            >
              <div
                className={`flex gap-6 w-max px-6 ${
                  reduceMotion
                    ? "overflow-x-auto"
                    : "asm-track-left"
                }`}
              >
                {highlightsLoop.map((item, index) => (
                  <div
                    key={index}
                    className="w-72 shrink-0 rounded-2xl border border-base-300 bg-base-100 p-8"
                  >
                    <div className="text-4xl">{item.icon}</div>

                    <h3 className="text-lg font-bold mt-4">
                      {item.title}
                    </h3>

                    <p className="text-sm text-base-content/60 mt-2 leading-6">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ==========================================================
            SPORTS EVENTS
        ========================================================== */}

        <section id="sports-events" className="py-28 bg-base-100">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <div className="asm-eyebrow text-xs uppercase tracking-[0.28em] text-primary mb-4">
                Competitions
              </div>

              <h2 className="asm-display text-3xl md:text-5xl font-medium italic">
                Sports &amp; Activities
              </h2>

              <p className="text-base-content/60 mt-4 max-w-2xl mx-auto">
                Tournaments and activities designed to
                challenge, inspire and unite students.
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {data?.sportsEvents?.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group rounded-2xl overflow-hidden border border-base-300 bg-base-100"
                >
                  <figure className="h-60 overflow-hidden relative">
                    <img
                      src={
                        event.image
                          ? getImageUrl(event.image)
                          : "https://placehold.co/600x400"
                      }
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  </figure>

                  <div className="p-7">
                    <h3 className="text-xl font-bold">
                      {event.title}
                    </h3>

                    <p className="text-base-content/60 leading-7 mt-2 text-sm">
                      {event.description}
                    </p>

                    <div className="flex items-center gap-2 mt-5 text-sm font-semibold text-primary">
                      Learn more
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================
            TIMELINE
        ========================================================== */}

        {data?.timeline?.length > 0 && (
          <section className="py-28 bg-base-200">
            <div className="container mx-auto px-6">
              <div className="text-center mb-20">
                <div className="asm-eyebrow text-xs uppercase tracking-[0.28em] text-primary mb-4">
                  Schedule
                </div>

                <h2 className="asm-display text-3xl md:text-5xl font-medium italic">
                  Event Timeline
                </h2>

                <p className="text-base-content/60 mt-4 max-w-2xl mx-auto">
                  From opening ceremony to the final prize
                  distribution.
                </p>
              </div>

              {/* Desktop / tablet — alternating centre-line layout */}
              <div className="hidden md:block relative max-w-5xl mx-auto">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-base-300 -translate-x-1/2" />

                <div className="flex flex-col gap-4">
                  {data.timeline.map((item, index) => {
                    const isLeft = index % 2 === 0;

                    return (
                      <div
                        key={index}
                        className="relative grid grid-cols-2 gap-x-12 items-center py-8"
                      >
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-3 h-3 rounded-full bg-primary ring-4 ring-base-200" />

                        {isLeft ? (
                          <>
                            <motion.div
                              initial={{ opacity: 0, x: -24 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5 }}
                              className="text-right pr-10"
                            >
                              <TimelineCard item={item} align="right" />
                            </motion.div>
                            <div />
                          </>
                        ) : (
                          <>
                            <div />
                            <motion.div
                              initial={{ opacity: 0, x: 24 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5 }}
                              className="pl-10"
                            >
                              <TimelineCard item={item} align="left" />
                            </motion.div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile — single column, line on the left */}
              <div className="md:hidden max-w-md mx-auto">
                {data.timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex gap-5"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary shrink-0 mt-2" />

                      {index !== data.timeline.length - 1 && (
                        <div className="w-px flex-1 bg-base-300" />
                      )}
                    </div>

                    <div className="pb-10">
                      <TimelineCard item={item} align="left" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ==========================================================
            ACHIEVEMENTS — continuous horizontal loop (reverse)
        ========================================================== */}

        {data?.achievements?.length > 0 && (
          <section className="py-28 bg-neutral text-neutral-content">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <div className="asm-eyebrow text-xs uppercase tracking-[0.28em] text-primary mb-4">
                  Recognition
                </div>

                <h2 className="asm-display text-3xl md:text-5xl font-medium italic">
                  Achievements &amp; Awards
                </h2>

                <p className="text-neutral-content/60 mt-4 max-w-2xl mx-auto">
                  Celebrating excellence, dedication and
                  sportsmanship.
                </p>
              </div>
            </div>

            <div
              className={`asm-marquee relative overflow-hidden asm-fade ${
                reduceMotion ? "asm-no-fade" : ""
              }`}
            >
              <div
                className={`flex gap-6 w-max px-6 ${
                  reduceMotion
                    ? "overflow-x-auto"
                    : "asm-track-right"
                }`}
              >
                {achievementsLoop.map((item, index) => (
                  <div
                    key={index}
                    className="w-80 shrink-0 rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
                  >
                    {item.image ? (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-40 flex items-center justify-center text-primary">
                        <Award size={40} />
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="text-lg font-bold">
                        {item.title}
                      </h3>

                      <p className="text-sm text-neutral-content/60 mt-2 leading-6">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ==========================================================
            GALLERY
        ========================================================== */}

        {data?.gallery?.length > 0 && (
          <section className="py-28 bg-base-100">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <div className="asm-eyebrow text-xs uppercase tracking-[0.28em] text-primary mb-4">
                  Memories
                </div>

                <h2 className="asm-display text-3xl md:text-5xl font-medium italic">
                  Sports Gallery
                </h2>

                <p className="text-base-content/60 mt-4 max-w-2xl mx-auto">
                  Relive the excitement, victories and
                  unforgettable moments.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {data.gallery.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative overflow-hidden rounded-2xl border border-base-300 bg-base-200 h-64"
                  >
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.caption}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-white text-sm">
                        {item.caption}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ==========================================================
            FINAL CTA
        ========================================================== */}

        <section className="relative py-28 overflow-hidden bg-neutral text-neutral-content">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 9, repeat: Infinity }}
            className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          />

          <motion.div
            animate={{ scale: [1.08, 1, 1.08] }}
            transition={{ duration: 11, repeat: Infinity }}
            className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
          />

          <div className="relative z-10 container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <Trophy size={28} className="mx-auto text-primary mb-6" />

              <h2 className="asm-display text-4xl md:text-6xl font-medium italic leading-tight">
                {data?.ctaTitle || "Ready to compete?"}
              </h2>

              <p className="mt-6 text-base md:text-lg text-neutral-content/70 max-w-xl mx-auto">
                {data?.ctaDescription ||
                  "Push your limits, showcase your talent and become part of an unforgettable sporting experience."}
              </p>

              <div className="flex flex-wrap justify-center gap-4 mt-10">
                {data?.registerLink && (
                  <a
                    href={data.registerLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-lg rounded-full px-8"
                  >
                    Register Now
                  </a>
                )}

                <a
                  href="#sports-events"
                  className="btn btn-ghost btn-lg rounded-full px-8 border border-white/30 hover:bg-white/10 hover:border-white/50"
                >
                  View Events
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ==========================================================
            QUOTE
        ========================================================== */}

        <section className="py-24 bg-base-100">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <Quote
                size={32}
                className="mx-auto text-primary/40 mb-6"
              />

              <blockquote className="asm-display text-2xl md:text-4xl italic font-medium leading-relaxed">
                Champions keep playing until they get it
                right.
              </blockquote>

              <div className="w-16 h-px bg-primary mx-auto mt-8 mb-4" />

              <p className="text-base-content/50 text-sm uppercase tracking-[0.2em]">
                Annual Sports Meet
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}