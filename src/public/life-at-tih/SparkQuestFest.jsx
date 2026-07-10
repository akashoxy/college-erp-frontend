import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Code2,
  Bot,
  Gamepad2,
  Mic2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

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

export default function SparkQuestFest() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
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

  return (
    <>
      {/* Display + mono typefaces, scoped to this page */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
      />

      <style>{`
        .sqf-display {
          font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
        }

        .sqf-mono {
          font-family: "JetBrains Mono", ui-monospace, monospace;
          letter-spacing: 0.05em;
        }

        .sqf-grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 48px 48px;
        }
      `}</style>

      <div className="bg-base-100 overflow-hidden">
        {/* ==========================================================
            HERO
        ========================================================== */}

        <section className="relative min-h-[90vh] flex items-center justify-center bg-neutral overflow-hidden">
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

          {/* Explicit dark scrim (not a theme token) so title
              and buttons stay legible no matter what the
              active daisyUI theme's colors resolve to. */}
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/60 to-black/85" />

          <div className="absolute inset-0 sqf-grid-bg opacity-40" />

          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-10 left-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl"
          />

          <motion.div
            animate={{ opacity: [0.7, 0.4, 0.7] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-secondary/20 blur-3xl"
          />

          <div className="relative z-10 container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
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

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="sqf-display text-5xl md:text-8xl font-bold text-white"
            >
              {data.heroTitle}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-6 text-lg md:text-2xl text-white/70 max-w-4xl mx-auto"
            >
              {data.heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-10 text-sm md:text-base text-white/80"
            >
              <span className="inline-flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                {formatDateRange(data.startDate, data.endDate)}
              </span>

              <span className="hidden md:inline text-white/30">
                •
              </span>

              <span className="inline-flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                {data.eventVenue || "Venue to be announced"}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap justify-center gap-4 mt-10"
            >
              {data.registerLink && (
                <a
                  href={data.registerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary rounded-full px-8"
                >
                  Register Now
                </a>
              )}

              <a
                href="#events"
                className="btn rounded-full px-8 border-2 border-white/50 text-white bg-white/5 backdrop-blur-sm hover:bg-white hover:text-neutral hover:border-white transition-all"
              >
                Explore Events
              </a>
            </motion.div>
          </div>
        </section>

        {/* ==========================================================
            ABOUT — terminal window framing
        ========================================================== */}

        {aboutText && (
          <section className="py-24 bg-base-100">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <div className="sqf-mono text-xs uppercase tracking-[0.2em] text-primary mb-3">
                  About the fest
                </div>

                <h2 className="sqf-display text-3xl md:text-5xl font-bold">
                  About Spark Quest
                </h2>
              </div>

              <div className="max-w-4xl mx-auto rounded-2xl border border-base-300 bg-base-200/60 overflow-hidden shadow-lg">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-base-300 bg-base-300/40">
                  <span className="w-3 h-3 rounded-full bg-error/70" />
                  <span className="w-3 h-3 rounded-full bg-warning/70" />
                  <span className="w-3 h-3 rounded-full bg-success/70" />
                  <span className="sqf-mono text-xs text-base-content/50 ml-3">
                    about.md
                  </span>
                </div>

                <p className="px-8 py-10 text-center text-base-content/80 text-lg leading-9">
                  {aboutText}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ==========================================================
            WHY PARTICIPATE
        ========================================================== */}

        {data.whyParticipate?.length > 0 && (
          <section className="bg-base-200 py-24">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <div className="sqf-mono text-xs uppercase tracking-[0.2em] text-primary mb-3">
                  The upside
                </div>

                <h2 className="sqf-display text-3xl md:text-5xl font-bold">
                  Why Participate?
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {data.whyParticipate.map((item, index) => (
                  <motion.div
                    key={item._id || index}
                    whileHover={{ y: -8 }}
                    className="group relative bg-base-100 rounded-3xl overflow-hidden border border-base-300 shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="h-56 overflow-hidden relative">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      <span className="sqf-mono absolute top-3 left-3 text-xs bg-neutral/80 text-neutral-content px-2 py-1 rounded-md">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-primary">
                        {item.title}
                      </h3>

                      <p className="text-base-content/70 mt-2 text-sm">
                        Explore exciting opportunities and
                        challenges.
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ==========================================================
            FEATURED EVENTS — terminal cards
        ========================================================== */}

       <section id="events" className="py-24 bg-base-100 overflow-hidden">
  <div className="container mx-auto px-6">
    <div className="text-center mb-16">
      <div className="sqf-mono text-xs uppercase tracking-[0.2em] text-primary mb-3">
        What's on
      </div>

      <h2 className="sqf-display text-3xl md:text-5xl font-bold">
        Featured Events
      </h2>
    </div>

    <div className="overflow-hidden">
      <motion.div
        className="flex gap-8 w-max"
        animate={{
          x: ["0%", "-50%"],
        }}
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
              whileHover={{ y: -8, scale: 1.02 }}
              className="w-95 shrink-0 rounded-2xl overflow-hidden bg-base-100 border border-base-300 shadow-md hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-2 px-5 py-3 border-b border-base-300 bg-base-200/60">
                <span className="w-2.5 h-2.5 rounded-full bg-error/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-warning/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-success/70" />

                <span className="sqf-mono text-xs text-base-content/50 ml-2">
                  {event.tag}
                </span>
              </div>

              <div className="p-8">
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Icon size={26} />
                </div>

                <h3 className="text-2xl font-bold mb-3">
                  {event.title}
                </h3>

                <p className="text-base-content/70 leading-7">
                  {event.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  </div>
</section>

        {/* ==========================================================
            TIMELINE — horizontal process strip
        ========================================================== */}

        <section className="bg-base-200 py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <div className="sqf-mono text-xs uppercase tracking-[0.2em] text-primary mb-3">
                Schedule
              </div>

              <h2 className="sqf-display text-3xl md:text-5xl font-bold">
                Event Timeline
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-0 relative max-w-5xl mx-auto">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative px-6 text-center md:border-r md:last:border-r-0 md:border-base-300"
                >
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold sqf-mono text-sm">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="sqf-mono text-xs uppercase tracking-[0.2em] text-primary mt-4">
                    {item.day}
                  </div>

                  <h3 className="text-xl font-bold mt-2">
                    {item.title}
                  </h3>

                  <p className="text-base-content/70 mt-1">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================
            CTA
        ========================================================== */}

        <section className="py-24 bg-primary">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto rounded-[40px] bg-secondary text-secondary-content p-16 text-center">
              <h2 className="sqf-display text-4xl md:text-5xl font-bold">
                Ready To Join Spark Quest?
              </h2>

              <p className="mt-6 text-xl opacity-90">
                Code. Build. Compete. Innovate.
              </p>

              {data.registerLink && (
                <a
                  href={data.registerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary mt-8 rounded-full px-8 hover:scale-105 transition-all inline-flex items-center gap-2"
                >
                  Register Now
                  <ArrowRight size={16} />
                </a>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}