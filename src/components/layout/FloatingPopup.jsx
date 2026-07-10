import {
  useEffect,
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

export default function FloatingPopup({
  title = "Admissions Open",
  description = "Applications are now open for MCA, BCA and BBA programs.",
  buttonText = "Apply Now",
  buttonLink = "/admission",
  storageKey = "floating_popup_closed",
}) {
  const [open, setOpen] =
    useState(false);

  /* =====================================
      INITIAL LOAD
  ===================================== */

  useEffect(() => {
    try {
      const closed =
        localStorage.getItem(
          storageKey
        );

      if (!closed) {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, [storageKey]);

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
      CLOSE
  ===================================== */

  const handleClose = () => {
    setOpen(false);

    try {
      localStorage.setItem(
        storageKey,
        "true"
      );
    } catch {}
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