import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion, useReducedMotion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Code2,
  Bot,
  Gamepad2,
  Mic2,
  ArrowRight,
  Sparkles,
  Terminal,
  CircleDot,
  GitCommit,
} from "lucide-react";
import LogoStrip from "../../styles/Logostrip";

const getImageUrl = (image) => image || "";

const formatDateRange = (start, end) => {
  if (!start) return "Dates Coming Soon";

  const opts = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const startText = new Date(start).toLocaleDateString(
    "en-IN",
    opts
  );

  if (!end) return startText;

  const endText = new Date(end).toLocaleDateString(
    "en-IN",
    opts
  );

  return `${startText} – ${endText}`;
};

/* ==========================================================
   SHARED PIECES
   Every section is framed as a labeled "window" — about.md,
   why.json, events.yml, timeline.log, register.exe — so the
   page reads like tabs open in an editor, not decoration.
========================================================== */

function WindowChrome({ filename, children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-base-300 bg-base-100 overflow-hidden shadow-lg ${className}`}
    >
      <div className="flex items-center gap-2 px-5 py-3 border-b border-base-300 bg-base-300/30">
        <span className="w-3 h-3 rounded-full bg-error/70" />
        <span className="w-3 h-3 rounded-full bg-warning/70" />
        <span className="w-3 h-3 rounded-full bg-success/70" />
        <span className="sqf-mono text-xs text-base-content/50 ml-3">
          {filename}
        </span>
      </div>
      {children}
    </div>
  );
}

function SectionHeading({ eyebrow, title }) {
  return (
    <div className="text-center mb-16">
      <div className="sqf-mono text-xs uppercase tracking-[0.2em] text-primary mb-3">
        {eyebrow}
      </div>
      <h2 className="sqf-display text-3xl md:text-5xl font-bold">
        {title}
      </h2>
    </div>
  );
}

function Cursor({ className = "" }) {
  return (
    <span aria-hidden="true" className={`sqf-cursor ${className}`}>
      ▍
    </span>
  );
}

const lineVariant = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function SparkQuestFest() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await api.get("/spark");

      setData(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <span className="sqf-mono text-xs text-base-content/50 uppercase tracking-[0.2em]">
          booting system…
        </span>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Field name on the record has historically been inconsistent
  // ("About" vs "about") — read either so older records still work.
  const aboutText = data.about ?? data.About ?? "";

  const heroImage = getImageUrl(data.heroImage);

  const events = [
    {
      icon: Code2,
      tag: "hackathons.run",
      title: "Hackathons",
      description:
        data.hackathons || "Details coming soon.",
    },
    {
      icon: Bot,
      tag: "robotics.init",
      title: "Robotics & Drones",
      description:
        data.roboticsDrones || "Details coming soon.",
    },
    {
      icon: Gamepad2,
      tag: "gaming.launch",
      title: "Gaming Arena",
      description:
        data.gamingArena || "Details coming soon.",
    },
    {
      icon: Mic2,
      tag: "talks.stream",
      title: "Tech Talks",
      description:
        data.techTalks || "Details coming soon.",
    },
  ];

  const timeline = [
    {
      day: "Day 01",
      title: "Opening Ceremony",
      description: "Hackathon Launch",
    },
    {
      day: "Day 02",
      title: "Coding Battles",
      description: "Gaming Arena",
    },
    {
      day: "Day 03",
      title: "Tech Talks",
      description: "Prize Distribution",
    },
  ];

  const bootLines = [
    "$ initializing spark_quest.sys",
    "$ mounting //hackathons //robotics //gaming //talks",
    "$ compiling ambition.exe ... done",
    "$ system ready",
  ];

  return (
    <>
      {/* Blocky mono display face + a quieter mono for chrome/labels */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Martian+Mono:wght@700;800&display=swap"
      />

      <style>{`
        .sqf-display {
          font-family: "Martian Mono", ui-monospace, monospace;
          text-transform: uppercase;
          letter-spacing: -0.01em;
        }

        .sqf-mono {
          font-family: "JetBrains Mono", ui-monospace, monospace;
          letter-spacing: 0.04em;
        }

        .sqf-grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .sqf-scanlines {
          background-image: repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.035) 0px,
            rgba(255,255,255,0.035) 1px,
            transparent 1px,
            transparent 3px
          );
        }

        .sqf-cursor {
          display: inline-block;
          margin-left: 3px;
          animation: sqf-blink 1s step-end infinite;
        }

        @keyframes sqf-blink {
          50% { opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .sqf-cursor { animation: none; }
        }
      `}</style>

      <div className="bg-base-100 overflow-hidden">
        {/* ==========================================================
            HERO — a boot sequence that resolves into the title
        ========================================================== */}

        <section className="relative min-h-[90vh] flex flex-col bg-neutral overflow-hidden">
          {heroImage && (
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `url(${heroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}

          {/* Explicit dark scrim (not a theme token) so the terminal
              text stays legible no matter what the active daisyUI
              theme's colors resolve to. */}
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/60 to-black/85" />

          <div className="absolute inset-0 sqf-grid-bg opacity-40" />
          <div className="absolute inset-0 sqf-scanlines pointer-events-none" />

          <motion.div
            animate={
              prefersReducedMotion
                ? {}
                : { opacity: [0.4, 0.7, 0.4] }
            }
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-10 left-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl"
          />

          <motion.div
            animate={
              prefersReducedMotion
                ? {}
                : { opacity: [0.7, 0.4, 0.7] }
            }
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-secondary/20 blur-3xl"
          />

          {/* status bar */}
          <div className="relative z-10 border-b border-white/10">
            <div className="container mx-auto px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 sqf-mono text-[11px] text-white/60">
              <span className="inline-flex items-center gap-2">
                <Terminal size={13} />
                spark_quest_os v2.1
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  {!prefersReducedMotion && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
                  )}
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                status: online
              </span>
            </div>
          </div>

          <div className="relative z-10 flex-1 flex items-center container mx-auto px-6 py-16">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.14 } },
              }}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.div
                variants={lineVariant}
                className="flex justify-center mb-8"
              >
                <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-primary/30 shadow-lg">
                  <div className="w-12 h-0.5 bg-primary" />

                  <div className="flex items-center gap-3 text-white uppercase tracking-[0.45em] font-bold text-lg md:text-xl">
                    <Sparkles size={22} />
                    <span>Spark Quest</span>
                  </div>

                  <div className="w-12 h-0.5 bg-primary" />
                </div>
              </motion.div>

              <div className="sqf-mono text-xs sm:text-sm text-success/80 space-y-1.5 max-w-md mx-auto">
                {bootLines.map((line, i) => (
                  <motion.div key={i} variants={lineVariant}>
                    {line}
                  </motion.div>
                ))}
              </div>

              <motion.h1
                variants={lineVariant}
                className="sqf-display text-5xl md:text-8xl font-extrabold text-white mt-8 leading-[0.95]"
              >
                {data.heroTitle}
                <Cursor className="text-primary" />
              </motion.h1>

              <motion.p
                variants={lineVariant}
                className="sqf-mono mt-6 text-base md:text-xl text-white/60"
              >
                // {data.heroSubtitle}
              </motion.p>

              <motion.div
                variants={lineVariant}
                className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-10 sqf-mono text-xs md:text-sm text-white/80"
              >
                <span className="inline-flex items-center gap-2">
                  <Calendar size={14} className="text-primary" />
                  date: {formatDateRange(data.startDate, data.endDate)}
                </span>

                <span className="hidden md:inline text-white/20">
                  |
                </span>

                <span className="inline-flex items-center gap-2">
                  <MapPin size={14} className="text-primary" />
                  venue: {data.eventVenue || "tbd"}
                </span>
              </motion.div>

              <motion.div
                variants={lineVariant}
                className="flex flex-wrap justify-center gap-4 mt-10"
              >
                {data.registerLink && (
                  <a
                    href={data.registerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary rounded-lg sqf-mono normal-case px-8"
                  >
                    $ ./register --now
                  </a>
                )}

                <a
                  href="#events"
                  className="btn rounded-lg sqf-mono normal-case px-8 border-2 border-white/40 text-white bg-white/5 backdrop-blur-sm hover:bg-white hover:text-neutral hover:border-white transition-all"
                >
                  cd ./events
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ==========================================================
            ABOUT — about.md
        ========================================================== */}

        {aboutText && (
          <section className="py-24 bg-base-100">
            <div className="container mx-auto px-6">
              <SectionHeading eyebrow="// about the fest" title="About Spark Quest" />

              <WindowChrome filename="about.md" className="max-w-4xl mx-auto">
                <p className="px-8 py-10 text-center text-base-content/80 text-lg leading-9">
                  {aboutText}
                </p>
              </WindowChrome>
            </div>
          </section>
        )}

        {/* ==========================================================
            WHY PARTICIPATE — why.json
        ========================================================== */}

        {data.whyParticipate?.length > 0 && (
          <section className="bg-base-200 py-24">
            <div className="container mx-auto px-6">
              <SectionHeading eyebrow="// the upside" title="Why Participate?" />

              <WindowChrome filename="why.json" className="max-w-6xl mx-auto">
                <div className="p-6 md:p-10">
                  <div className="sqf-mono text-xs text-base-content/40 mb-6">[</div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.whyParticipate.map((item, index) => (
                      <motion.div
                        key={item._id || index}
                        whileHover={{ y: -6 }}
                        className="group rounded-xl overflow-hidden border border-base-300 bg-base-100 shadow-sm hover:shadow-lg transition-all duration-300"
                      >
                        <div className="h-48 overflow-hidden relative">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.title}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>

                        <div className="p-5 sqf-mono text-xs leading-6">
                          <div className="text-base-content/40">{"{"}</div>
                          <div className="pl-3">
                            <span className="text-base-content/40">"id":</span>{" "}
                            <span className="text-primary">
                              "{String(index + 1).padStart(2, "0")}"
                            </span>
                            ,
                          </div>
                          <div className="pl-3">
                            <span className="text-base-content/40">"title":</span>{" "}
                            <span className="text-base-content font-semibold">
                              "{item.title}"
                            </span>
                          </div>
                          <div className="text-base-content/40">
                            {"}"}
                            {index !== data.whyParticipate.length - 1 ? "," : ""}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="sqf-mono text-xs text-base-content/40 mt-6">]</div>
                </div>
              </WindowChrome>
            </div>
          </section>
        )}

        {/* ==========================================================
            FEATURED EVENTS — events.yml
        ========================================================== */}

        <section id="events" className="py-24 bg-base-100 overflow-hidden">
          <div className="container mx-auto px-6">
            <SectionHeading eyebrow="// what's on" title="Featured Events" />

            <WindowChrome filename="events.yml">
              <div className="overflow-hidden py-10">
                <motion.div
                  className="flex gap-6 w-max"
                  animate={
                    prefersReducedMotion ? {} : { x: ["0%", "-50%"] }
                  }
                  transition={{
                    ease: "linear",
                    duration: 25,
                    repeat: Infinity,
                  }}
                >
                  {[...events, ...events].map((event, index) => {
                    const Icon = event.icon;

                    return (
                      <motion.div
                        key={index}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className="w-80 shrink-0 rounded-xl bg-base-100 border border-base-300 shadow-sm hover:shadow-lg transition-all p-7"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <span className="sqf-mono text-xs text-base-content/50">
                            {event.tag}
                          </span>

                          <span className="inline-flex items-center gap-1.5 sqf-mono text-[10px] text-success">
                            <CircleDot
                              size={10}
                              className={prefersReducedMotion ? "" : "animate-pulse"}
                            />
                            live
                          </span>
                        </div>

                        <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-5">
                          <Icon size={22} />
                        </div>

                        <h3 className="text-xl font-bold mb-2">
                          {event.title}
                        </h3>

                        <p className="text-base-content/70 text-sm leading-6">
                          {event.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </WindowChrome>
          </div>
        </section>

        {/* ==========================================================
            TIMELINE — timeline.log (read like a commit log)
        ========================================================== */}

        <section className="bg-base-200 py-24">
          <div className="container mx-auto px-6">
            <SectionHeading eyebrow="// schedule" title="Event Timeline" />

            <WindowChrome filename="timeline.log" className="max-w-3xl mx-auto">
              <div className="p-8 md:p-12">
                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-14 pb-10 last:pb-0"
                  >
                    {index !== timeline.length - 1 && (
                      <span className="absolute left-4.75 top-10 bottom-0 w-px bg-base-300" />
                    )}

                    <span className="absolute left-0 top-0.5 w-10 h-10 rounded-full bg-base-100 border-2 border-primary flex items-center justify-center">
                      <GitCommit size={16} className="text-primary" />
                    </span>

                    <div className="sqf-mono text-xs text-primary/80 mb-1">
                      {item.day} &middot; commit #{String(index + 1).padStart(2, "0")}
                    </div>

                    <h3 className="text-xl font-bold">
                      {item.title}
                    </h3>

                    <p className="text-base-content/70 mt-1">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </WindowChrome>
          </div>
        </section>

        {/* ==========================================================
            CTA — register.exe
        ========================================================== */}

        <section className="py-24 bg-primary">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <WindowChrome filename="register.exe">
                <div className="bg-neutral text-neutral-content p-12 md:p-16 text-center">
                  <h2 className="sqf-display text-4xl md:text-5xl font-bold">
                    Ready To Join Spark Quest?
                  </h2>

                  <p className="sqf-mono mt-6 text-lg opacity-80">
                    // code. build. compete. innovate.
                  </p>

                  {data.registerLink && (
                    <a
                      href={data.registerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary mt-8 rounded-lg sqf-mono normal-case px-8 hover:scale-105 transition-all inline-flex items-center gap-2"
                    >
                      $ ./register --confirm
                      <ArrowRight size={16} />
                    </a>
                  )}
                </div>
              </WindowChrome>
            </div>
          </div>
        </section>
      </div>
      <LogoStrip/>
    </>
  );
}