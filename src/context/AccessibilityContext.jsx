import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({
  children,
}) => {
  /* ============================
      DEFAULT SETTINGS
  ============================ */

  const defaultSettings = {
    fontSize: 100,
    highContrast: false,
    hideImages: false,
    reading: false,
  };

  /* ============================
      LOAD SETTINGS
  ============================ */

  const [settings, setSettings] =
    useState(() => {
      if (
        typeof window === "undefined"
      ) {
        return defaultSettings;
      }

      try {
        const saved =
          localStorage.getItem(
            "tih_accessibility"
          );

        return saved
          ? JSON.parse(saved)
          : defaultSettings;
      } catch (error) {
        console.error(
          "Accessibility settings error:",
          error
        );

        return defaultSettings;
      }
    });

  const utteranceRef = useRef(null);

  /* ============================
      SAVE SETTINGS
  ============================ */

  useEffect(() => {
    if (
      typeof window === "undefined"
    ) {
      return;
    }

    localStorage.setItem(
      "tih_accessibility",
      JSON.stringify(settings)
    );
  }, [settings]);

  /* ============================
      FONT SIZE
  ============================ */

  useEffect(() => {
    if (
      typeof document === "undefined"
    ) {
      return;
    }

    document.documentElement.style.fontSize =
      `${settings.fontSize}%`;
  }, [settings.fontSize]);

  /* ============================
      HIGH CONTRAST
  ============================ */

  useEffect(() => {
    if (
      typeof document === "undefined"
    ) {
      return;
    }

    document.body.classList.toggle(
      "accessibility-high-contrast",
      settings.highContrast
    );
  }, [settings.highContrast]);

  /* ============================
      HIDE IMAGES
  ============================ */

  useEffect(() => {
    if (
      typeof document === "undefined"
    ) {
      return;
    }

    document.body.classList.toggle(
      "accessibility-hide-images",
      settings.hideImages
    );
  }, [settings.hideImages]);

  /* ============================
      CLEANUP
  ============================ */

  useEffect(() => {
    return () => {
      if (
        typeof window !==
          "undefined" &&
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /* ============================
      SPEECH
  ============================ */

  const startReading = () => {
    if (
      typeof window ===
        "undefined" ||
      !(
        "speechSynthesis" in window
      ) ||
      !(
        "SpeechSynthesisUtterance" in
        window
      )
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const text =
      document.body.innerText;

    if (!text.trim()) return;

    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setSettings((prev) => ({
        ...prev,
        reading: false,
      }));
    };

    utterance.onerror = () => {
      setSettings((prev) => ({
        ...prev,
        reading: false,
      }));
    };

    utteranceRef.current =
      utterance;

    window.speechSynthesis.speak(
      utterance
    );

    setSettings((prev) => ({
      ...prev,
      reading: true,
    }));
  };

  const pauseReading = () => {
    if (
      typeof window ===
        "undefined" ||
      !(
        "speechSynthesis" in window
      )
    ) {
      return;
    }

    window.speechSynthesis.pause();
  };

  const resumeReading = () => {
    if (
      typeof window ===
        "undefined" ||
      !(
        "speechSynthesis" in window
      )
    ) {
      return;
    }

    window.speechSynthesis.resume();
  };

  const stopReading = () => {
    if (
      typeof window ===
        "undefined" ||
      !(
        "speechSynthesis" in window
      )
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    utteranceRef.current = null;

    setSettings((prev) => ({
      ...prev,
      reading: false,
    }));
  };

  /* ============================
      FONT CONTROLS
  ============================ */

  const increaseFont = () => {
    setSettings((prev) => ({
      ...prev,
      fontSize: Math.min(
        prev.fontSize + 10,
        180
      ),
    }));
  };

  const decreaseFont = () => {
    setSettings((prev) => ({
      ...prev,
      fontSize: Math.max(
        prev.fontSize - 10,
        80
      ),
    }));
  };

  /* ============================
      TOGGLES
  ============================ */

  const toggleHighContrast =
    () => {
      setSettings((prev) => ({
        ...prev,
        highContrast:
          !prev.highContrast,
      }));
    };

  const toggleHideImages =
    () => {
      setSettings((prev) => ({
        ...prev,
        hideImages:
          !prev.hideImages,
      }));
    };

  /* ============================
      RESET
  ============================ */

  const resetAccessibility =
    () => {
      stopReading();

      setSettings(defaultSettings);

      if (
        typeof document !==
        "undefined"
      ) {
        document.documentElement.style.fontSize =
          "100%";

        document.body.classList.remove(
          "accessibility-high-contrast"
        );

        document.body.classList.remove(
          "accessibility-hide-images"
        );
      }
    };

  /* ============================
      CONTEXT VALUE
  ============================ */

  const value = useMemo(
    () => ({
      settings,

      increaseFont,
      decreaseFont,

      toggleHighContrast,
      toggleHideImages,

      startReading,
      pauseReading,
      resumeReading,
      stopReading,

      resetAccessibility,
    }),
    [settings]
  );

  return (
    <AccessibilityContext.Provider
      value={value}
    >
      {children}

      
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility =
  () => {
    const context =
      useContext(
        AccessibilityContext
      );

    if (!context) {
      throw new Error(
        "useAccessibility must be used inside AccessibilityProvider."
      );
    }

    return context;
  };

