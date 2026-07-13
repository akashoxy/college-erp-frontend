import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const defaultSettings = {
    fontSize: 100,
    highContrast: false,
    hideImages: false,
    reading: false,
  };

  const [settings, setSettings] = useState(() => {
    if (typeof window === "undefined") return defaultSettings;

    try {
      const saved = localStorage.getItem("tih_accessibility");
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch (error) {
      console.error("Accessibility settings error:", error);
      return defaultSettings;
    }
  });

  const utteranceRef = useRef(null);
  const keepAliveRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("tih_accessibility", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.fontSize = `${settings.fontSize}%`;
  }, [settings.fontSize]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("accessibility-high-contrast", settings.highContrast);
  }, [settings.highContrast]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("accessibility-hide-images", settings.hideImages);
  }, [settings.hideImages]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /* ============================
      READ MAIN CONTENT ONLY
      (skips navbar/header/footer)
  ============================ */
  const getReadableText = () => {
    const main =
      document.getElementById("main-content") ||
      document.querySelector("main");

    if (main) return main.innerText;

    // Fallback if there's no <main> or #main-content:
    // clone the body and strip nav/header/footer
    const clone = document.body.cloneNode(true);
    clone
      .querySelectorAll(
        "nav, header, footer, [role='navigation'], [data-no-read]"
      )
      .forEach((el) => el.remove());

    return clone.innerText;
  };

  const clearKeepAlive = () => {
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      clearKeepAlive();
      setSettings((prev) => ({ ...prev, reading: false }));
    };

    utterance.onerror = () => {
      clearKeepAlive();
      setSettings((prev) => ({ ...prev, reading: false }));
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);

    // Android Chrome bug workaround: speech silently
    // cuts out after ~15s unless "pinged" periodically
    clearKeepAlive();
    keepAliveRef.current = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearKeepAlive();
        return;
      }
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }, 10000);

    setSettings((prev) => ({ ...prev, reading: true }));
  };

  const startReading = () => {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const text = getReadableText();
    if (!text.trim()) return;

    // iOS Safari fix: voices list can be empty on the
    // very first call, which makes speak() fail silently.
    const voices = window.speechSynthesis.getVoices();

    if (voices.length === 0) {
      const handleVoicesChanged = () => {
        window.speechSynthesis.removeEventListener(
          "voiceschanged",
          handleVoicesChanged
        );
        speakText(text);
      };

      window.speechSynthesis.addEventListener(
        "voiceschanged",
        handleVoicesChanged
      );

      // Safety net in case the event never fires
      setTimeout(() => {
        if (!window.speechSynthesis.speaking) {
          speakText(text);
        }
      }, 300);

      return;
    }

    speakText(text);
  };

  const pauseReading = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.pause();
  };

  const resumeReading = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.resume();
  };

  const stopReading = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    clearKeepAlive();
    utteranceRef.current = null;

    setSettings((prev) => ({ ...prev, reading: false }));
  };

  const increaseFont = () => {
    setSettings((prev) => ({ ...prev, fontSize: Math.min(prev.fontSize + 10, 180) }));
  };

  const decreaseFont = () => {
    setSettings((prev) => ({ ...prev, fontSize: Math.max(prev.fontSize - 10, 80) }));
  };

  const toggleHighContrast = () => {
    setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const toggleHideImages = () => {
    setSettings((prev) => ({ ...prev, hideImages: !prev.hideImages }));
  };

  const resetAccessibility = () => {
    stopReading();
    setSettings(defaultSettings);

    if (typeof document !== "undefined") {
      document.documentElement.style.fontSize = "100%";
      document.body.classList.remove("accessibility-high-contrast");
      document.body.classList.remove("accessibility-hide-images");
    }
  };

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
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);

  if (!context) {
    throw new Error("useAccessibility must be used inside AccessibilityProvider.");
  }

  return context;
};