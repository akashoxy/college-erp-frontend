import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

import smart from "../assets/amenities/smart.png"
import ragging from "../assets/amenities/radio2.png"
import radio from "../assets/amenities/raging.png"
import wifi from "../assets/amenities/wifi2.png"


/* ==========================================================
   LOGO STRIP
   A round-logo row for "in partnership with / accredited by /
   powered by" style sections. Pass your own `logos` array;
   falls back to placeholders if none is given.

   Each logo can optionally carry a `link`:
   - starts with "/"  -> internal navigation via react-router Link
   - anything else    -> opens as an external link in a new tab
   - omitted          -> logo just sits there, no link

   Usage:
     <LogoStrip
       label="In Partnership With"
       logos={[
         { src: partnerA, alt: "Partner A", link: "/about" },
         { src: partnerB, alt: "Partner B" },
         { src: partnerC, alt: "Partner C", link: "https://partner-c.example.com" },
         { src: partnerD, alt: "Partner D" },
       ]}
     />

   All animation respects prefers-reduced-motion automatically.
========================================================== */

const PLACEHOLDER_LOGOS = [
  { src: radio, alt: "Logo 1", link: "/radiotih" },
  { src: smart, alt: "Logo 2" },
  { src: ragging, alt: "Logo 3", link: "/antiragging-control" },
  { src: wifi, alt: "Logo 4" },
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 50, scale: 0.4, rotate: -25 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 220, damping: 14, mass: 0.9 },
  },
};

function LogoMedallion({ logo, index, prefersReducedMotion }) {
  const isInternal = logo.link?.startsWith("/");
  const isExternal = logo.link && !isInternal;

  const content = (
    <motion.div
      variants={item}
      whileHover={
        prefersReducedMotion
          ? {}
          : { scale: 1.18, rotate: [0, -6, 6, 0], transition: { duration: 0.5 } }
      }
      whileTap={{ scale: 0.95 }}
      animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }}
      transition={
        prefersReducedMotion
          ? {}
          : {
              y: {
                duration: 3 + (index % 3) * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3,
              },
            }
      }
      className="relative w-20 h-20 md:w-28 md:h-28"
    >
      {/* spinning gradient halo */}
      {!prefersReducedMotion && (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 6 + index, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-1.5 rounded-full opacity-70 blur-[2px] bg-linear-to-tr from-primary via-secondary to-accent"
        />
      )}

      {/* pulsing glow ring on hover */}
      <span className="absolute -inset-1 rounded-full bg-primary/0 group-hover:bg-primary/20 blur-md transition-all duration-500" />

      <div className="relative w-full h-full rounded-full overflow-hidden bg-base-100 border-2 border-base-100 shadow-xl flex items-center justify-center">
        <img
          src={logo.src}
          alt={logo.alt || `Logo ${index + 1}`}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
    </motion.div>
  );

  if (isInternal) {
    return (
      <Link
        to={logo.link}
        aria-label={logo.alt || `Logo ${index + 1}`}
        className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
      >
        {content}
      </Link>
    );
  }

  if (isExternal) {
    return (
      <a
        href={logo.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={logo.alt || `Logo ${index + 1}`}
        className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
      >
        {content}
      </a>
    );
  }

  return <div className="group">{content}</div>;
}

export default function LogoStrip({
  label = "Campus Amenities",
  logos = PLACEHOLDER_LOGOS,
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-20 bg-base-100">
      {/* ambient floating glow, matches hero sections elsewhere in the app */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.15, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/20 blur-3xl pointer-events-none"
          />
          <motion.div
            animate={{ opacity: [0.5, 0.25, 0.5], scale: [1.15, 1, 1.15] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-secondary/20 blur-3xl pointer-events-none"
          />
        </>
      )}

      <div className="relative container mx-auto px-6">
        {label && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-xs uppercase tracking-[0.25em] text-base-content/50 mb-12"
          >
            {label}
          </motion.p>
        )}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-10 md:gap-16"
        >
          {logos.slice(0, 4).map((logo, index) => (
            <LogoMedallion
              key={logo.alt || index}
              logo={logo}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}