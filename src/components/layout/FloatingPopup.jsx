import {
  useEffect,
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

const REAPPEAR_DELAY = 20000; // ms

export default function FloatingPopup({
  title = "Admissions Open",
  description = "Applications are now open for MCA, BCA and BBA programs.",
  buttonText = "Apply Now",
  buttonLink = "/admission",
}) {
  const [open, setOpen] =
    useState(false);

  const reappearTimer = useRef(null);

  /* =====================================
      INITIAL LOAD
  ===================================== */

  useEffect(() => {
    setOpen(true);

    return () => {
      if (reappearTimer.current) {
        clearTimeout(reappearTimer.current);
      }
    };
  }, []);

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
            x: 120,
          }}

          transition={{
            type: "spring",
            stiffness: 260,
            damping: 24,
          }}

          className="
            fixed

            right-4
            top-1/2
            -translate-y-1/2

            z-50
          "
        >

          <div
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
            "
          >

            {/* CLOSE */}

            <button

              aria-label="Close popup"

              onClick={
                handleClose
              }

              className="
                btn
                btn-circle
                btn-xs

                absolute

                right-3
                top-3
              "
            >
              <FaTimes />
            </button>

            {/* ICON */}

            <div
              className="
                w-14
                h-14

                rounded-full

                bg-primary
                text-primary-content

                flex
                items-center
                justify-center

                mb-5
              "
            >
              <MdCampaign
                size={26}
              />
            </div>

            {/* TITLE */}

            <h2 className="text-xl font-bold">

              {title}

            </h2>

            {/* DESCRIPTION */}

            <p className="mt-3 text-sm text-base-content/70 leading-relaxed">

              {description}

            </p>

            {/* BUTTON */}

            <Link
              to={buttonLink}
              className="
                btn
                btn-primary

                w-full

                mt-6
              "
            >
              {buttonText}
            </Link>

          </div>

        </motion.div>

      )}

    </AnimatePresence>
  );
}