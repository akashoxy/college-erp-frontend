import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  FaTimes,
} from "react-icons/fa";

import {
  MdCampaign,
} from "react-icons/md";

import {
  HiSparkles,
} from "react-icons/hi";

const REAPPEAR_DELAY = 30000; // ms — reopen 30s after close
const AUTO_HIDE_DELAY = 30000; // ms — auto-hide 30s after showing (if not closed manually)

/* =====================================
    ANIMATION VARIANTS
===================================== */

const containerVariants = {
  hidden: {
    opacity: 0,
    x: 180,
    y: 40,
    scale: 0.5,
    rotate: 16,
    rotateY: 40,
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    rotateY: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      mass: 1.2,
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
  exit: {
    opacity: 0,
    x: 180,
    scale: 0.4,
    rotate: -18,
    rotateY: -40,
    transition: {
      duration: 0.4,
      ease: "easeIn",
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 26, scale: 0.85 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 18,
    },
  },
};

/* =====================================
    AMBIENT PARTICLES
===================================== */

function AmbientParticles({ count = 10 }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 3 + Math.random() * 5,
        dur: 3 + Math.random() * 4,
        delay: Math.random() * 3,
        drift: Math.random() > 0.5 ? 1 : -1,
      })),
    [count]
  );

  return (
    <div className="absolute -inset-6 pointer-events-none overflow-visible" aria-hidden>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-secondary text-secondary"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            boxShadow: "0 0 12px 3px currentColor",
          }}
          animate={{
            y: [0, -22 * p.drift, 0],
            x: [0, 10 * p.drift, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* =====================================
    SPARKLE BURSTS (corners)
===================================== */

function SparkleBurst({ className, delay = 0 }) {
  return (
    <motion.span
      aria-hidden
      className={`absolute text-secondary ${className}`}
      animate={{
        opacity: [0, 1, 0],
        scale: [0.4, 1.3, 0.4],
        rotate: [0, 90, 180],
      }}
      transition={{
        duration: 2.2,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <HiSparkles size={18} />
    </motion.span>
  );
}

export default function FloatingPopup({
  title = "Admissions Open",
  description = "Applications are now open for MCA, BCA and BBA programs.",
  buttonText = "Apply Now",
  buttonLink = "/admission",
}) {
  const [open, setOpen] =
    useState(false);

  const reappearTimer = useRef(null);
  const autoHideTimer = useRef(null);

  const clearTimers = () => {
    if (reappearTimer.current) {
      clearTimeout(reappearTimer.current);
      reappearTimer.current = null;
    }
    if (autoHideTimer.current) {
      clearTimeout(autoHideTimer.current);
      autoHideTimer.current = null;
    }
  };

  /* =====================================
      INITIAL LOAD
  ===================================== */

  useEffect(() => {
    setOpen(true);

    return () => {
      clearTimers();
    };
  }, []);

  /* =====================================
      AUTO-CYCLE — every time it's open,
      auto-hide after AUTO_HIDE_DELAY, then
      reappear after REAPPEAR_DELAY (30s cycle)
  ===================================== */

  useEffect(() => {
    if (open) {
      autoHideTimer.current = setTimeout(() => {
        handleClose();
      }, AUTO_HIDE_DELAY);
    }

    return () => {
      if (autoHideTimer.current) {
        clearTimeout(autoHideTimer.current);
        autoHideTimer.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* =====================================
      ESC KEY
  ===================================== */

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (
      e
    ) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [open]);

  /* =====================================
      CLOSE — reopens automatically after REAPPEAR_DELAY,
      even though the user dismissed it
  ===================================== */

  const handleClose = () => {
    setOpen(false);

    if (reappearTimer.current) {
      clearTimeout(reappearTimer.current);
    }

    reappearTimer.current = setTimeout(() => {
      setOpen(true);
    }, REAPPEAR_DELAY);
  };

  return (
    <AnimatePresence>

      {open && (

        <motion.div

          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit="exit"

          style={{ perspective: 1000 }}

          whileHover={{
            scale: 1.04,
            rotate: -1.5,
            transition: { type: "spring", stiffness: 280, damping: 14 },
          }}

          className="
            fixed

            right-4
            top-1/2
            -translate-y-1/2

            z-50
          "
        >

          {/* AMBIENT FLOATING PARTICLES AROUND CARD */}
          <AmbientParticles />

          {/* ROTATING CONIC GLOW RING */}
          <motion.div
            aria-hidden
            className="absolute -inset-3 rounded-[2rem] pointer-events-none"
            style={{
              background:
                "conic-gradient(from 0deg, hsl(var(--p)), hsl(var(--s)), hsl(var(--p)))",
              filter: "blur(18px)",
              opacity: 0.55,
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <motion.div
            className="
              relative

              w-80
              max-w-[calc(100vw-2rem)]

              rounded-3xl

              bg-base-100/95
              backdrop-blur-lg

              border
              border-base-300

              shadow-2xl

              p-6

              overflow-hidden
            "
          >

            {/* PULSING BACKGROUND GLOW */}
            <motion.div
              aria-hidden
              className="absolute -inset-10 rounded-full bg-primary/30 blur-3xl pointer-events-none"
              animate={{
                scale: [1, 1.35, 1],
                opacity: [0.25, 0.55, 0.25],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* ANIMATED BORDER SHIMMER */}
            <motion.div
              aria-hidden
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background:
                  "linear-gradient(120deg, transparent, hsl(var(--p)/0.35), transparent)",
                backgroundSize: "200% 200%",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "200% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* SPARKLE BURSTS AT CORNERS */}
            <SparkleBurst className="top-2 left-2" delay={0} />
            <SparkleBurst className="bottom-2 left-8" delay={0.8} />
            <SparkleBurst className="top-10 right-10" delay={1.4} />

            {/* TOP SHIMMER ACCENT BAR */}
            <motion.div
              aria-hidden
              className="absolute top-0 left-0 h-1 rounded-t-3xl bg-gradient-to-r from-primary via-secondary to-primary"
              style={{ backgroundSize: "200% 100%" }}
              animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />

            {/* CLOSE */}

            <motion.button
              variants={childVariants}

              aria-label="Close popup"

              onClick={
                handleClose
              }

              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.85, rotate: 180 }}

              animate={{ rotate: [0, 0, 360, 360] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.85, 0.95, 1],
              }}

              className="
                btn
                btn-circle
                btn-xs

                absolute

                right-3
                top-3

                z-10
              "
            >
              <FaTimes />
            </motion.button>

            {/* ICON */}

            <motion.div
              variants={childVariants}
              className="relative w-14 h-14 mb-5"
            >
              {/* pulsing rings */}
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full border-2 border-primary"
                animate={{ scale: [1, 1.8, 1.8], opacity: [0.8, 0, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full border-2 border-secondary"
                animate={{ scale: [1, 1.8, 1.8], opacity: [0.8, 0, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 1,
                }}
              />
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full border border-primary/60"
                animate={{ scale: [1, 2.3, 2.3], opacity: [0.6, 0, 0] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.5,
                }}
              />

              <motion.div
                className="
                  relative
                  w-14
                  h-14

                  rounded-full

                  bg-primary
                  text-primary-content

                  flex
                  items-center
                  justify-center
                "
                animate={{
                  rotate: [0, -14, 14, -10, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <MdCampaign
                  size={26}
                />
              </motion.div>
            </motion.div>

            {/* TITLE */}

            <motion.h2
              variants={childVariants}
              className="text-xl font-bold relative"
              animate={{
                textShadow: [
                  "0 0 0px hsl(var(--p)/0)",
                  "0 0 10px hsl(var(--p)/0.4)",
                  "0 0 0px hsl(var(--p)/0)",
                ],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {title}
            </motion.h2>

            {/* DESCRIPTION */}

            <motion.p
              variants={childVariants}
              className="mt-3 text-sm text-base-content/70 leading-relaxed relative"
            >
              {description}
            </motion.p>

            {/* BUTTON */}

            <motion.div
              variants={childVariants}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                scale: {
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="relative mt-6"
            >
              <Link
                to={buttonLink}
                className="
                  btn
                  btn-primary

                  w-full

                  relative
                  overflow-hidden
                "
              >
                <motion.span
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(120deg, transparent, rgba(255,255,255,0.35), transparent)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{ backgroundPosition: ["-100% 0%", "200% 0%"] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <span className="relative z-10">{buttonText}</span>
              </Link>
            </motion.div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>
  );
}