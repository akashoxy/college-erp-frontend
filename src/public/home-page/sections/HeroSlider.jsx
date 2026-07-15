
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const EASE = [0.22, 1, 0.36, 1];

function HeroSlider({ slides = [], current, setCurrent }) {
  useEffect(() => {
    if (!slides?.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides, setCurrent]);

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

  return (
    <section className="relative h-screen min-h-140 overflow-hidden bg-slate-950">
      {/* Background Image with slow ken-burns */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.4, ease: EASE }}
          className="absolute inset-0"
        >
          <img
            src={imageUrl}
            alt={slide.title || "Hero Slide"}
            className="absolute w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/35 to-slate-950/40" />
      <div className="absolute inset-0 bg-linear-to-r from-slate-950/70 via-slate-950/10 to-transparent" />

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${current}`}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -24, transition: { duration: 0.4 } }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
              }}
              className="max-w-3xl"
            >
              <motion.div
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.6, ease: EASE }}
                className="inline-flex items-center gap-3 mb-6"
              >
                <span className="h-px w-10 bg-amber-400/80" />
                <span className="text-amber-400 text-xs font-semibold tracking-[0.35em] uppercase">
                  Techno India Hooghly
                </span>
                <span className="h-px w-10 bg-amber-400/80" />
              </motion.div>

              {slide.title && (
                <motion.h1
                  variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="font-serif text-white text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight"
                >
                  {slide.title}
                </motion.h1>
              )}

              {slide.subtitle && (
                <motion.p
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="text-white/75 text-base md:text-lg mt-6 max-w-xl leading-relaxed font-light"
                >
                  {slide.subtitle}
                </motion.p>
              )}

              {slide.buttonText && slide.buttonLink && (
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="mt-10"
                >
                  {slide.buttonLink.startsWith("http") ? (
                    <a
                      href={slide.buttonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      {slide.buttonText}
                    </a>
                  ) : (
                    <Link
                      to={slide.buttonLink}
                      className="btn btn-primary rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      {slide.buttonText}
                    </Link>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Arrows */}
      <button
        aria-label="Previous slide"
        onClick={() =>
          setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
        }
        className="group absolute left-5 md:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-white/25 bg-white/5 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:border-amber-400/70 hover:bg-white/10 transition-all duration-300"
      >
        <FaArrowLeft className="text-sm group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        aria-label="Next slide"
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="group absolute right-5 md:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-white/25 bg-white/5 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:border-amber-400/70 hover:bg-white/10 transition-all duration-300"
      >
        <FaArrowRight className="text-sm group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-500 rounded-full ${
              current === index
                ? "w-9 h-1.5 bg-amber-400"
                : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <motion.div
        key={`progress-${current}`}
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 6, ease: "linear" }}
        className="absolute bottom-0 left-0 h-0.5 bg-amber-400 z-40"
      />
    </section>
  );
}

export default HeroSlider;