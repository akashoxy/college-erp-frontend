import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Home,
  GraduationCap,
  Building2,
  Users,
  HeartHandshake,
  BookOpen,
  Camera,
  ArrowUpRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const sitemap = [
  {
    title: "Home",
    icon: Home,
    links: [
      { name: "About Us", path: "/about-us" },
      { name: "Vision & Mission", path: "/vision-mission" },
      { name: "Circular & Notices", path: "/circular-notice" },
      { name: "Awards", path: "/awards" },
    ],
  },
  {
    title: "Academics",
    icon: GraduationCap,
    links: [
      { name: "MCA", path: "/mca-main" },
      { name: "BBA", path: "/bba-main" },
      { name: "BCA", path: "/bca-main" },
      { name: "Research", path: "/faculty-research" },
      { name: "Academic Calendar", path: "/aca-calendar" },
      { name: "List of Holidays", path: "/list-holidays" },
    ],
  },
  {
    title: "Facilities",
    icon: Building2,
    links: [
      { name: "Anti Ragging Cell", path: "/anti-ragging" },
      { name: "Computer Laboratory", path: "/computer-laboratory" },
      { name: "Central Library", path: "/central-library" },
      { name: "Common Room", path: "/common" },
      { name: "College Canteen", path: "/canteen" },
      { name: "Journals", path: "/journals" },
      { name: "JECA", path: "/jeca-main" },
      { name: "CET", path: "/cet-main" },
      { name: "Radio TIH", path: "/radio-main" },
      { name: "Web Magazine", path: "/web-magazine" },
    ],
  },
  {
    title: "Student",
    icon: Users,
    links: [
      { name: "Previous Year Question Papers", path: "/previous-question" },
      { name: "Syllabus", path: "/syllabus" },
      { name: "Fees Payment", path: "/fees-payment" },
    ],
  },
  {
    title: "Life At TIH",
    icon: HeartHandshake,
    links: [
      { name: "Recent Academic Works", path: "/aca-works" },
      { name: "Verbena Festival", path: "/verbena" },
      { name: "Spark Quest", path: "/spark-quest" },
      { name: "Annual Sports Meet", path: "/sports" },
    ],
  },
  {
    title: "Admission",
    icon: BookOpen,
    links: [
      { name: "Admission Procedure", path: "/admission-procedure" },
      { name: "Fees Structure", path: "/fees-structure" },
      { name: "Admission Form", path: "/admission-form" },
    ],
  },
  {
    title: "Campus Tour",
    icon: Camera,
    links: [
      { name: "Campus Placement", path: "/campus-placement" },
      { name: "Photo Gallery", path: "/photo-gallery" },
      { name: "Video Gallery", path: "/video-gallery" },
      { name: "Virtual Tour", path: "/virtual-tour" },
    ],
  },
];

const TOTAL_LINKS = sitemap.reduce((n, s) => n + s.links.length, 0);

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function TypedPath({ text, speed = 45 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(0);
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return (
    <span className="font-mono">
      {text.slice(0, count)}
      <motion.span
        aria-hidden
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="text-secondary"
      >
        ▌
      </motion.span>
    </span>
  );
}

// Ambient floating nodes drifting across the hero
function FloatingNodes({ count = 14 }) {
  const nodes = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 2 + Math.random() * 3,
        dur: 10 + Math.random() * 14,
        delay: Math.random() * 6,
      })),
    [count]
  );
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {nodes.map((n) => (
        <motion.span
          key={n.id}
          className="absolute rounded-full bg-secondary text-secondary"
          style={{
            top: `${n.top}%`,
            left: `${n.left}%`,
            width: n.size,
            height: n.size,
            boxShadow: "0 0 10px 2px currentColor",
          }}
          animate={{ y: [0, -18, 0], opacity: [0.15, 0.9, 0.15] }}
          transition={{
            duration: n.dur,
            delay: n.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Kinetic per-letter heading
function KineticHeading({ text }) {
  return (
    <span className="inline-block" aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          initial={{ y: "0.9em", opacity: 0, rotateZ: 6 }}
          animate={{ y: 0, opacity: 1, rotateZ: 0 }}
          transition={{
            delay: 0.35 + i * 0.045,
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block will-change-transform"
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 46, rotateX: -8 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.65, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] },
  }),
};

const linkVariants = {
  hidden: { opacity: 0, x: -14 },
  show: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: 0.15 + i * 0.055, ease: "easeOut" },
  }),
};

/* ------------------------------------------------------------------ */
/*  Section card — signature "signal" travels the link rail            */
/* ------------------------------------------------------------------ */

function SectionCard({ section, index }) {
  const Icon = section.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ perspective: 800 }}
      className={`card bg-base-200 border transition-colors duration-300 relative overflow-hidden ${
        hovered
          ? "border-primary/50 shadow-xl shadow-primary/10"
          : "border-base-300 shadow"
      }`}
    >
      {/* hover glow */}
      <div
        aria-hidden
        className="absolute -inset-px rounded-2xl pointer-events-none transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background:
            "radial-gradient(220px 120px at 20% 0%, hsl(var(--p)/0.12), transparent 70%)",
        }}
      />

      <div className="card-body relative">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="relative w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"
            animate={hovered ? { rotate: 8, scale: 1.06 } : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Icon className="text-primary relative z-10" size={20} />
            <motion.span
              className="absolute inset-0 rounded-xl border border-primary"
              animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
          <div>
            <h2 className="card-title text-base-content text-base">{section.title}</h2>
            <span className="font-mono text-xs text-base-content/50">
              {String(section.links.length).padStart(2, "0")} pages
            </span>
          </div>
        </div>

        <div className="relative pl-4">
          {/* rail line */}
          <div className="absolute left-[3px] top-1 bottom-1 w-px bg-base-300" aria-hidden />
          {/* traveling pulse */}
          <motion.div
            aria-hidden
            className="absolute left-0 w-[7px] h-[7px] -ml-[3px] rounded-full bg-secondary text-secondary"
            style={{ boxShadow: "0 0 10px 3px currentColor" }}
            animate={{ top: ["0%", "100%"] }}
            transition={{
              duration: 2.6 + index * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
          />

          <ul className="flex flex-col gap-0.5">
            {section.links.map((link, i) => (
              <motion.li
                key={link.path}
                custom={i}
                variants={linkVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.6 }}
              >
                <Link
                  to={link.path}
                  className="group flex items-center gap-2 py-1.5 px-2 rounded-lg text-base-content/70 text-sm hover:text-primary hover:bg-base-300/60 hover:translate-x-1 transition-all"
                >
                  <span className="w-1 h-1 rounded-full bg-base-content/40 group-hover:bg-primary flex-shrink-0" />
                  <span className="flex-1">{link.name}</span>
                  <ArrowUpRight
                    size={14}
                    className="text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                  />
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function Sitemap() {
  const { scrollYProgress } = useScroll();
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-base-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap');
        .tih-display { font-family: 'Space Grotesk', sans-serif; }

        @keyframes tih-grid-drift {
          from { background-position: 0 0, 0 0; }
          to { background-position: 88px 44px, 88px 44px; }
        }
        .tih-grid-bg {
          background-image:
            linear-gradient(currentColor 1px, transparent 1px),
            linear-gradient(90deg, currentColor 1px, transparent 1px);
          background-size: 44px 44px;
          -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 90%);
          mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 90%);
          animation: tih-grid-drift 26s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .tih-grid-bg { animation: none !important; }
        }
      `}</style>

      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] origin-left z-50 bg-gradient-to-r from-primary to-secondary"
        style={{ scaleX: barScale }}
      />

      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden bg-base-200 border-b border-base-300">
        <div
          className="tih-grid-bg absolute -inset-0.5 text-base-300"
          aria-hidden
        />
        <FloatingNodes />

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="badge badge-outline gap-2 py-3 font-mono text-xs tracking-wide text-base-content/60"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_2px] shadow-secondary/70" />
            TECHNO COLLEGE HOOGHLY — FULL DIRECTORY
          </motion.span>

          <h1 className="tih-display font-bold text-base-content leading-[1.02] tracking-tight text-5xl md:text-7xl mt-6 mb-4">
            <KineticHeading text="Site" />
            <span className="text-primary">
              <KineticHeading text="map" />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="max-w-xl mx-auto text-base-content/70"
          >
            Every public page, mapped and connected. Pick a node below to
            jump straight to it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-lg bg-base-100 border border-base-300 text-sm text-base-content/60"
          >
            <span>tih.edu.in</span>
            <b className="text-base-content font-medium">
              <TypedPath text="/sitemap" />
            </b>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 1.5, duration: 0.7 }}
            className="flex justify-center gap-12 flex-wrap mt-12"
          >
            <div>
              <div className="tih-display text-3xl font-bold text-base-content">
                {sitemap.length}
              </div>
              <div className="text-xs uppercase tracking-wider text-base-content/50 mt-1">
                Sections
              </div>
            </div>
            <div>
              <div className="tih-display text-3xl font-bold text-base-content">
                {TOTAL_LINKS}
              </div>
              <div className="text-xs uppercase tracking-wider text-base-content/50 mt-1">
                Pages
              </div>
            </div>
            <div>
              <div className="tih-display text-3xl font-bold text-base-content">01</div>
              <div className="text-xs uppercase tracking-wider text-base-content/50 mt-1">
                Campus
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- Grid ---------------- */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {sitemap.map((section, index) => (
            <SectionCard key={section.title} section={section} index={index} />
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto h-px bg-gradient-to-r from-transparent via-base-300 to-transparent" />
      <div className="text-center py-12 text-base-content/50 text-xs font-mono">
        TECHNO COLLEGE HOOGHLY · SITEMAP LAST SYNCED JUST NOW
      </div>
    </div>
  );
}