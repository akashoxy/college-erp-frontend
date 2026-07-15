import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const EASE = [0.16, 1, 0.3, 1];
const GOLD = "#C6A15B";
const HOVER_RESUME_MS = 3000; // resume autoplay if the mouse stays put for 3s

/** Splits a heading into words, each masked so it rises into place on entry. */
function RevealText({ text, className, delay = 0 }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-top pb-1 mr-[0.28em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", rotate: 4 }}
            animate={{ y: "0%", rotate: 0 }}
            exit={{ y: "-110%", rotate: -4 }}
            transition={{ duration: 0.45, ease: EASE, delay: delay + i * 0.03 }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Faint drifting gold motes for ambient depth — subtle, not decorative noise. */
function Motes() {
  const dots = React.useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: (i * 137.5) % 100,
        size: 2 + ((i * 7) % 4),
        duration: 4.5 + (i % 5) * 1.2,
        delay: (i % 7) * 0.4,
      })),
    []
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-5" aria-hidden="true">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: `${d.left}%`,
            bottom: "-4%",
            width: d.size,
            height: d.size,
            background: GOLD,
            boxShadow: `0 0 6px 1px ${GOLD}55`,
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 0.55, 0], y: -420 }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/** Ornate corner brackets that draw themselves in — the slider's signature motif. */
function CornerFrame({ slideKey }) {
  const corner = (rotate, style) => (
    <motion.svg
      viewBox="0 0 64 64"
      className="absolute w-10 h-10 md:w-14 md:h-14"
      style={{ ...style, transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      <motion.path
        d="M2 32 V2 H32"
        fill="none"
        stroke={GOLD}
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.85 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
      />
    </motion.svg>
  );
  return (
    <div key={slideKey} className="absolute inset-6 md:inset-10 z-20 pointer-events-none">
      {corner(0, { top: 0, left: 0 })}
      {corner(90, { top: 0, right: 0 })}
      {corner(-90, { bottom: 0, left: 0 })}
      {corner(180, { bottom: 0, right: 0 })}
    </div>
  );
}

function HeroSlider({ slides = [], current, setCurrent }) {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [paused, setPaused] = useState(false);
  const resumeTimerRef = useRef(null);

  useEffect(() => {
    if (!slides?.length || paused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [slides, setCurrent, paused]);

  // Clean up the resume timer if the component unmounts mid-hover.
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  // Arms the resume timer only if one isn't already running — so repeated
  // enter/move events extend hover tracking without resetting the countdown.
  const armResumeTimer = () => {
    if (resumeTimerRef.current) return;
    resumeTimerRef.current = setTimeout(() => {
      setPaused(false);
      resumeTimerRef.current = null;
    }, HOVER_RESUME_MS);
  };

  const handleMouseMove = (e) => {
    // Keep the resume timer alive even if a stray mouseleave/mouseenter
    // blip happens while the cursor is still effectively hovering.
    setPaused(true);
    armResumeTimer();

    if (prefersReducedMotion || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x, y });
  };

  const handleMouseEnter = () => {
    setPaused(true);
    armResumeTimer();
  };

  const handleMouseLeave = () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    setPaused(false);
    setTilt({ x: 0, y: 0 });
  };

  if (!slides?.length) {
    return (
      <section className="hero min-h-[70vh] bg-base-200">
        <div className="hero-content text-center">
          <h2 className="text-2xl font-serif font-semibold text-base-content/70">
            No Slider Images Available
          </h2>
        </div>
      </section>
    );
  }

  const slide = slides[current];
  const imageUrl = slide.image || "";
  const total = slides.length;

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative h-screen min-h-140 overflow-hidden bg-[#0A0F1D]"
    >
      {/* Background image — diagonal wipe transition + slow parallax drift */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ clipPath: "inset(0 0 0 100%)" }}
          animate={{ clipPath: "inset(0 0 0 0%)" }}
          exit={{ clipPath: "inset(0 100% 0 0)" }}
          transition={{ duration: 0.55, ease: EASE }}
          className="absolute inset-0"
        >
          <motion.div
            className="absolute -inset-6"
            animate={{
              scale: 1.08,
              x: tilt.x * -20,
              y: tilt.y * -14,
            }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: "easeOut" }}
          >
            <motion.img
              src={imageUrl}
              alt={slide.title || "Hero Slide"}
              initial={{ scale: 1 }}
              animate={{ scale: 1.14 }}
              transition={{ duration: 4, ease: "linear" }}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Flat dark scrim so text stays legible over bright/busy photos */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "rgba(6,9,18,0.45)" }}
      />

      {/* Directional gradient, strongest where the copy sits (bottom-left) */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(115deg, rgba(6,9,18,0.75) 0%, rgba(6,9,18,0.45) 35%, rgba(6,9,18,0.15) 60%, rgba(6,9,18,0) 80%)",
        }}
      />
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 60% at 8% 100%, rgba(10,15,29,0.55), transparent 70%)",
        }}
      />

      <Motes />
      <CornerFrame slideKey={current} />

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${current}`}
              exit={{ opacity: 0, transition: { duration: 0.35 } }}
              className="max-w-3xl"
            >
              <motion.div
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="inline-flex items-center gap-3 mb-7"
              >
                <motion.span
                  className="h-px origin-left"
                  style={{ background: GOLD }}
                  initial={{ width: 0 }}
                  animate={{ width: 40 }}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}
                />
                <span
                  className="text-[11px] font-semibold tracking-[0.4em] uppercase"
                  style={{ color: GOLD }}
                >
                  Techno India Hooghly
                </span>
              </motion.div>

              {slide.title && (
                <h1
                  className="font-serif text-[#F3EFE6] text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight"
                  style={{ textShadow: "0 2px 20px rgba(0,0,0,0.55)" }}
                >
                  <RevealText text={slide.title} delay={0.05} />
                </h1>
              )}

              {slide.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.25 }}
                  className="inline-block text-[#F3EFE6] text-base md:text-lg mt-6 max-w-xl leading-relaxed font-light px-4 py-2 rounded-lg backdrop-blur-sm"
                  style={{ background: "rgba(10,15,29,0.55)" }}
                >
                  {slide.subtitle}
                </motion.p>
              )}

              {slide.buttonText && slide.buttonLink && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE, delay: 0.35 }}
                  className="mt-11"
                >
                  {slide.buttonLink.startsWith("http") ? (
                    <a
                      href={slide.buttonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 group"
                    >
                      {slide.buttonText}
                      <FaArrowRight className="text-xs ml-1 group-hover:translate-x-1 transition-transform" />
                    </a>
                  ) : (
                    <Link
                      to={slide.buttonLink}
                      className="btn btn-primary rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 group"
                    >
                      {slide.buttonText}
                      <FaArrowRight className="text-xs ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide counter — a real sequence, so numbering earns its place */}
      <div className="absolute bottom-9 right-6 md:right-20 z-30 hidden sm:flex items-baseline gap-1.5 font-serif text-[#F3EFE6]/80">
        <AnimatePresence mode="wait">
          <motion.span
            key={current}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="text-lg"
            style={{ color: GOLD }}
          >
            {String(current + 1).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
        <span className="text-xs text-[#F3EFE6]/40">/ {String(total).padStart(2, "0")}</span>
      </div>

      {/* Arrows — magnetic ring sweep on hover */}
      <button
        aria-label="Previous slide"
        onClick={() => setCurrent((prev) => (prev - 1 + total) % total)}
        className="group absolute left-5 md:left-10 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center text-[#F3EFE6]/80 hover:text-[#0A0F1D] transition-colors duration-300 focus-visible:outline focus-visible:outline-offset-2"
        style={{ outlineColor: GOLD }}
      >
        <span className="absolute inset-0 rounded-full border border-[#F3EFE6]/25 group-hover:border-transparent transition-colors duration-300" />
        <span
          className="absolute inset-0 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"
          style={{ background: GOLD }}
        />
        <FaArrowLeft className="relative text-sm group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        aria-label="Next slide"
        onClick={() => setCurrent((prev) => (prev + 1) % total)}
        className="group absolute right-5 md:right-10 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center text-[#F3EFE6]/80 hover:text-[#0A0F1D] transition-colors duration-300 focus-visible:outline focus-visible:outline-offset-2"
        style={{ outlineColor: GOLD }}
      >
        <span className="absolute inset-0 rounded-full border border-[#F3EFE6]/25 group-hover:border-transparent transition-colors duration-300" />
        <span
          className="absolute inset-0 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"
          style={{ background: GOLD }}
        />
        <FaArrowRight className="relative text-sm group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Indicators — thin bars, active one shimmers */}
      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setCurrent(index)}
            className="relative h-1.5 rounded-full overflow-hidden transition-all duration-500 focus-visible:outline focus-visible:outline-offset-2"
            style={{
              width: current === index ? 38 : 7,
              background: current === index ? "rgba(243,239,230,0.25)" : "rgba(243,239,230,0.35)",
              outlineColor: GOLD,
            }}
          >
            {current === index && (
              <motion.span
                key={`fill-${current}`}
                className="absolute inset-y-0 left-0"
                style={{ background: GOLD }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 8, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

export default HeroSlider;