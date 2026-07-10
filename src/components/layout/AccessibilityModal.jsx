import React, {
  useEffect,
  useRef,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  FaUniversalAccess,
  FaSearchPlus,
  FaSearchMinus,
  FaVolumeUp,
  FaPause,
  FaPlay,
  FaStop,
  FaImage,
  FaUndo,
  FaTimes,
  FaMoon,
} from "react-icons/fa";

import { useAccessibility } from "../../context/AccessibilityContext";

/* =====================================================
    REUSABLE SETTING CARD
===================================================== */

function AccessibilityCard({
  icon,
  title,
  description,
  children,
}) {
  return (
    <div className="card bg-base-200 border border-base-300 shadow-sm">

      <div className="card-body">

        <div className="flex items-center gap-3 mb-5">

          <div className="text-primary">
            {icon}
          </div>

          <div>

            <h3 className="font-bold text-lg">
              {title}
            </h3>

            {description && (
              <p className="text-sm opacity-70">
                {description}
              </p>
            )}

          </div>

        </div>

        {children}

      </div>

    </div>
  );
}

/* =====================================================
    ANIMATION
===================================================== */

const backdropVariants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
  },

  exit: {
    opacity: 0,
  },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: 40,
  },

  visible: {
    opacity: 1,
    scale: 1,
    y: 0,

    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },

  exit: {
    opacity: 0,
    scale: 0.94,
    y: 20,

    transition: {
      duration: 0.18,
    },
  },
};

/* =====================================================
    COMPONENT
===================================================== */

function AccessibilityModal({
  open,
  onClose,
}) {

  const {

    settings,

    increaseFont,
    decreaseFont,

    toggleHideImages,
    toggleHighContrast,

    startReading,
    pauseReading,
    resumeReading,
    stopReading,

    resetAccessibility,

  } = useAccessibility();

  const modalRef = useRef(null);

  /* =====================================================
      LOCK BODY SCROLL
  ===================================================== */

  useEffect(() => {

    if (!open) return;

    const previous =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previous;
    };

  }, [open]);

  /* =====================================================
      ESC KEY CLOSE
  ===================================================== */

  useEffect(() => {

    if (!open) return;

    const handleKeyDown = (e) => {

      if (e.key === "Escape") {

        stopReading();

        onClose();

      }

    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, [
    open,
    stopReading,
    onClose,
  ]);

  /* =====================================================
      FOCUS MODAL
  ===================================================== */

  useEffect(() => {

    if (
      open &&
      modalRef.current
    ) {

      modalRef.current.focus();

    }

  }, [open]);

  return (

    <AnimatePresence>

      {open && (

        <motion.div

          variants={
            backdropVariants
          }

          initial="hidden"

          animate="visible"

          exit="exit"

          onClick={onClose}

          className="
            fixed
            inset-0
            z-999
            bg-black/60
            backdrop-blur-sm

            flex
            items-center
            justify-center

            p-4
          "
        >

          <motion.div

            ref={modalRef}

            tabIndex={-1}

            role="dialog"

            aria-modal="true"

            aria-labelledby="accessibility-title"

            variants={
              modalVariants
            }

            initial="hidden"

            animate="visible"

            exit="exit"

            onClick={(e) =>
              e.stopPropagation()
            }

            className="
              w-full
              max-w-3xl

              max-h-[95vh]

              rounded-2xl

              bg-base-100

              border
              border-base-300

              shadow-2xl

              overflow-hidden

              flex
              flex-col

              outline-none
            "
          >

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div
              className="
                bg-primary
                text-primary-content

                px-6
                py-5

                flex
                items-center
                justify-between
              "
            >

              <div className="flex items-center gap-3">

                <FaUniversalAccess
                  size={30}
                />

                <div>

                  <h2
                    id="accessibility-title"
                    className="text-xl font-bold"
                  >
                    Accessibility Center
                  </h2>

                  <p className="text-sm opacity-80">
                    Customize your browsing
                    experience
                  </p>

                </div>

              </div>

              <button

                onClick={onClose}

                className="
                  btn
                  btn-circle
                  btn-ghost
                  text-primary-content
                "
              >
                <FaTimes />
              </button>

            </div>

            {/* =====================================================
                BODY
            ===================================================== */}

            <div
              className="
                flex-1
                overflow-y-auto

                p-6

                space-y-6
              "
            >
                              {/* =====================================================
                  TEXT SIZE
              ===================================================== */}

              <AccessibilityCard
                icon={
                  <FaSearchPlus
                    size={22}
                  />
                }
                title="Text Size"
                description="Increase or decrease website text size."
              >

                <div className="flex items-center justify-between mb-5">

                  <span className="font-semibold">
                    Current Size
                  </span>

                  <div className="badge badge-primary badge-lg">
                    {settings.fontSize}%
                  </div>

                </div>

                <div className="grid grid-cols-2 gap-3">

                  <button
                    onClick={
                      decreaseFont
                    }
                    disabled={
                      settings.fontSize <=
                      80
                    }
                    className="btn btn-outline"
                  >
                    <FaSearchMinus />

                    Smaller
                  </button>

                  <button
                    onClick={
                      increaseFont
                    }
                    disabled={
                      settings.fontSize >=
                      180
                    }
                    className="btn btn-primary"
                  >
                    <FaSearchPlus />

                    Larger
                  </button>

                </div>

              </AccessibilityCard>

              {/* =====================================================
                  READ ALOUD
              ===================================================== */}

              <AccessibilityCard
                icon={
                  <FaVolumeUp
                    size={22}
                  />
                }
                title="Read Aloud"
                description="Listen to the current page."
              >

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                  <button
                    onClick={
                      startReading
                    }
                    disabled={
                      settings.reading
                    }
                    className="btn btn-primary"
                  >
                    <FaPlay />

                    Read
                  </button>

                  <button
                    onClick={
                      pauseReading
                    }
                    disabled={
                      !settings.reading
                    }
                    className="btn btn-warning"
                  >
                    <FaPause />

                    Pause
                  </button>

                  <button
                    onClick={
                      resumeReading
                    }
                    disabled={
                      !settings.reading
                    }
                    className="btn btn-info"
                  >
                    <FaPlay />

                    Resume
                  </button>

                  <button
                    onClick={
                      stopReading
                    }
                    disabled={
                      !settings.reading
                    }
                    className="btn btn-error"
                  >
                    <FaStop />

                    Stop
                  </button>

                </div>

              </AccessibilityCard>

              {/* =====================================================
                  HIDE IMAGES
              ===================================================== */}

              <AccessibilityCard
                icon={
                  <FaImage
                    size={22}
                  />
                }
                title="Hide Images"
                description="Display only textual content across the website."
              >

                <div className="flex items-center justify-between">

                  <span className="font-medium">
                    Hide Images
                  </span>

                  <input
                    type="checkbox"
                    className="toggle toggle-primary toggle-lg"
                    checked={
                      settings.hideImages
                    }
                    onChange={
                      toggleHideImages
                    }
                  />

                </div>

              </AccessibilityCard>

              {/* =====================================================
                  HIGH CONTRAST
              ===================================================== */}

              <AccessibilityCard
                icon={
                  <FaMoon
                    size={22}
                  />
                }
                title="High Contrast"
                description="Improve readability using a high-contrast theme."
              >

                <div className="flex items-center justify-between">

                  <span className="font-medium">
                    Enable High Contrast
                  </span>

                  <input
                    type="checkbox"
                    className="toggle toggle-primary toggle-lg"
                    checked={
                      settings.highContrast
                    }
                    onChange={
                      toggleHighContrast
                    }
                  />

                </div>

              </AccessibilityCard>
                            {/* =====================================================
                  CURRENT SETTINGS
              ===================================================== */}

              <AccessibilityCard
                icon={
                  <FaUniversalAccess
                    size={22}
                  />
                }
                title="Current Settings"
                description="Review your current accessibility preferences."
              >

                <div className="grid md:grid-cols-2 gap-4">

                  <div className="flex justify-between items-center">

                    <span>Text Size</span>

                    <div className="badge badge-primary">
                      {settings.fontSize}%
                    </div>

                  </div>

                  <div className="flex justify-between items-center">

                    <span>Read Aloud</span>

                    <div
                      className={`badge ${
                        settings.reading
                          ? "badge-success"
                          : "badge-neutral"
                      }`}
                    >
                      {settings.reading
                        ? "Reading"
                        : "Stopped"}
                    </div>

                  </div>

                  <div className="flex justify-between items-center">

                    <span>Images</span>

                    <div
                      className={`badge ${
                        settings.hideImages
                          ? "badge-warning"
                          : "badge-success"
                      }`}
                    >
                      {settings.hideImages
                        ? "Hidden"
                        : "Visible"}
                    </div>

                  </div>

                  <div className="flex justify-between items-center">

                    <span>Contrast</span>

                    <div
                      className={`badge ${
                        settings.highContrast
                          ? "badge-success"
                          : "badge-neutral"
                      }`}
                    >
                      {settings.highContrast
                        ? "High"
                        : "Normal"}
                    </div>

                  </div>

                </div>

              </AccessibilityCard>

            </div>

            {/* =====================================================
                FOOTER
            ===================================================== */}

            <div
              className="
                border-t
                border-base-300

                bg-base-100

                px-6
                py-5

                sticky
                bottom-0

                flex
                flex-col
                md:flex-row

                justify-between
                items-center

                gap-4
              "
            >

              <button
                onClick={
                  resetAccessibility
                }
                className="
                  btn
                  btn-outline
                  btn-warning
                  rounded-xl

                  w-full
                  md:w-auto
                "
              >
                <FaUndo />

                Reset Accessibility
              </button>

              <div
                className="
                  flex
                  gap-3

                  w-full
                  md:w-auto
                "
              >

                <button
                  onClick={onClose}
                  className="
                    btn
                    btn-ghost

                    rounded-xl

                    flex-1
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {

                    stopReading();

                    onClose();

                  }}
                  className="
                    btn
                    btn-primary

                    rounded-xl

                    flex-1
                  "
                >
                  Done
                </button>

              </div>

            </div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>

  );

}

export default AccessibilityModal;