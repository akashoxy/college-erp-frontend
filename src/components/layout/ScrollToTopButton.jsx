import {
  useEffect,
  useRef,
  useState,
} from "react";

import { FaArrowUp } from "react-icons/fa";

export default function ScrollToTopButton({
  threshold = 300,
  behavior = "smooth",
}) {
  const [visible, setVisible] =
    useState(false);

  const ticking = useRef(false);

  /* =====================================
      SCROLL LISTENER
  ===================================== */

  useEffect(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    const updateVisibility = () => {
      setVisible(
        window.scrollY >
          threshold
      );

      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(
          updateVisibility
        );

        ticking.current = true;
      }
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [threshold]);

  /* =====================================
      SCROLL TO TOP
  ===================================== */

  const scrollToTop = () => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior,
    });
  };

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      title="Scroll to top"
      onClick={scrollToTop}
      className={`
        fixed

        bottom-6
        right-6

        z-50

        btn
        btn-circle

        btn-primary

        shadow-xl

        transition-all
        duration-300

        hover:scale-110
        active:scale-95

        focus:outline-none
        focus-visible:ring
        focus-visible:ring-primary

        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8 pointer-events-none"
        }
      `}
    >
      <FaArrowUp />
    </button>
  );
}