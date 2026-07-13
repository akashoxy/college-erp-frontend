import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  Trophy,
  Calendar,
  MapPin,
  Save,
  Plus,
  Medal,
  Pencil,
  Trash2,
  Award,
  ImagePlus,
  X,
  Check,
  Loader2,
} from "lucide-react";

import api from "../../../../services/api";

import LoadingModal from "../../../modals/LoadingModal";
import StatusModal from "../../../modals/StatusModal";
import DeleteModal from "../../../modals/DeleteModal";

/* ==========================================================
   HELPERS
========================================================== */

// Mongo returns Date fields as full ISO strings (e.g. 2026-07-05T00:00:00.000Z).
// <input type="date"> only accepts "YYYY-MM-DD", so it must be normalized
// every time data comes back from the API, otherwise the date pickers
// silently render empty/invalid after a fetch or refresh.
const toDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const formatDisplayDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// How long to wait after the last edit before auto-saving basic info,
// highlights, and timeline to the backend.
const AUTOSAVE_DELAY_MS = 900;

/* ==========================================================
   INITIAL STATES
========================================================== */

const initialSportsData = {
  heroSubtitle: "",
  heroImage: "",

  aboutText: "",

  startDate: "",
  endDate: "",

  venue: "",
  registerLink: "",

  ctaTitle: "",
  ctaDescription: "",

  highlights: [],
  sportsEvents: [],
  timeline: [],
  achievements: [],
};

const initialEvent = {
  title: "",
  description: "",
  image: null,
};

const initialHighlight = {
  title: "",
  description: "",
  icon: "🏆",
};

const initialTimeline = {
  day: "",
  title: "",
  description: "",
};

const initialAchievement = {
  title: "",
  description: "",
  image: null,
};

export default function SportsControl() {

  /* ==========================================================
     LOADING
  ========================================================== */

  const [loading, setLoading] = useState(true);

  // Manual "Save Now" state (only used if the user clicks the manual
  // save buttons, e.g. right after choosing a hero image).
  const [saving, setSaving] = useState(false);

  // Background autosave status, shown as a small inline indicator
  // instead of a blocking modal: "idle" | "saving" | "saved" | "error"
  const [autoSaveStatus, setAutoSaveStatus] = useState("idle");

  /* ==========================================================
     MODALS
  ========================================================== */

  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const notify = (type, title, message) =>
    setStatusModal({ isOpen: true, type, title, message });

  const confirmDelete = (title, message, onConfirm) =>
    setDeleteModal({ isOpen: true, title, message, onConfirm });

  const closeDeleteModal = () =>
    setDeleteModal({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
    });

  /* ==========================================================
     DATA
  ========================================================== */

  const [sportsData, setSportsData] = useState(initialSportsData);

  const [heroPreview, setHeroPreview] = useState("");
  const [savingHeroImage, setSavingHeroImage] = useState(false);

  const [eventSearch, setEventSearch] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState(initialEvent);

  const [newHighlight, setNewHighlight] = useState(initialHighlight);

  const [newTimeline, setNewTimeline] = useState(initialTimeline);

  const [achievementSearch, setAchievementSearch] = useState("");
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [newAchievement, setNewAchievement] = useState(initialAchievement);
  const [newAchievementPreview, setNewAchievementPreview] = useState("");
  const [editAchievementPreview, setEditAchievementPreview] = useState("");
  const [addingAchievement, setAddingAchievement] = useState(false);
  const [savingAchievement, setSavingAchievement] = useState(false);

  /* ==========================================================
     AUTOSAVE GUARDS / TIMERS
  ========================================================== */

  // Whenever we programmatically overwrite `sportsData` (initial load,
  // manual refresh, delete-all reset, or a refetch after saving), we
  // don't want that state change to itself trigger another autosave.
  // This ref is checked (and reset) inside the autosave effect.
  const skipAutoSaveRef = useRef(true);

  const autoSaveTimeoutRef = useRef(null);

  /* ==========================================================
     FETCH DATA
  ========================================================== */

  const fetchSportsData = async () => {
    try {
      setLoading(true);

      const res = await api.get("/annual-sports-meet");

      const data = res.data.data || initialSportsData;

      // This update is programmatic (came from the server), not a user
      // edit, so the next autosave effect run must be skipped.
      skipAutoSaveRef.current = true;

      setSportsData({
        ...initialSportsData,
        ...data,
        startDate: toDateInputValue(data.startDate),
        endDate: toDateInputValue(data.endDate),
      });

      setHeroPreview(data.heroImage || "");
    } catch (error) {
      notify(
        "error",
        "Loading Failed",
        error.response?.data?.message ||
          "Failed to load Annual Sports Meet."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSportsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ==========================================================
     HERO IMAGE
  ========================================================== */

  const handleHeroImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const previousPreview = heroPreview;

    if (heroPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(heroPreview);
    }

    const localPreviewUrl = URL.createObjectURL(file);
    setHeroPreview(localPreviewUrl);

    // Hero image is uploaded immediately, to its own dedicated
    // endpoint (PUT /hero-image), which only ever touches
    // heroImage/heroImagePublicId server-side. It deliberately does
    // NOT go through the shared basic-info autosave/payload, so it
    // can never race with or overwrite sportsEvents/achievements/
    // highlights/timeline, no matter what else is happening in the
    // form at the same time.
    try {
      setSavingHeroImage(true);

      const formData = new FormData();
      formData.append("heroImage", file);

      const res = await api.put(
        "/annual-sports-meet/hero-image",
        formData,
        { timeout: 30000 } // fail loudly instead of hanging forever
      );

      const updated = res.data.data;

      setSportsData((prev) => ({
        ...prev,
        heroImage: updated?.heroImage || prev.heroImage,
      }));

      setHeroPreview(updated?.heroImage || localPreviewUrl);

      notify("success", "Success", res.data.message);
    } catch (error) {
      // Roll back the preview on failure so the UI doesn't show an
      // image that was never actually saved.
      setHeroPreview(previousPreview);

      notify(
        "error",
        "Upload Failed",
        error.response?.data?.message ||
          "Failed to update hero image."
      );
    } finally {
      URL.revokeObjectURL(localPreviewUrl);
      setSavingHeroImage(false);
    }
  };

  /* ==========================================================
     SAVE BASIC INFORMATION (shared by autosave + manual buttons)
  ========================================================== */

  const persistBasicInformation = async (
    dataToSave,
    { silent = false } = {}
  ) => {
    const formData = new FormData();

    formData.append("heroSubtitle", dataToSave.heroSubtitle || "");
    formData.append("aboutText", dataToSave.aboutText || "");
    formData.append("startDate", dataToSave.startDate || "");
    formData.append("endDate", dataToSave.endDate || "");
    formData.append("venue", dataToSave.venue || "");
    formData.append("registerLink", dataToSave.registerLink || "");
    formData.append("ctaTitle", dataToSave.ctaTitle || "");
    formData.append("ctaDescription", dataToSave.ctaDescription || "");

    formData.append(
      "highlights",
      JSON.stringify(dataToSave.highlights || [])
    );

    formData.append(
      "timeline",
      JSON.stringify(dataToSave.timeline || [])
    );

    // Note: heroImage is intentionally NEVER sent from here. It has
    // its own dedicated endpoint (handleHeroImageChange →
    // PUT /hero-image) so this save can never touch it, and vice versa.
    const res = await api.put("/annual-sports-meet", formData);

    if (!silent) {
      notify("success", "Success", res.data.message);
    }

    return res;
  };

  // Manual "Save Now" button handler (kept as a fallback / immediate save).
  const saveBasicInformation = async () => {
    try {
      setSaving(true);

      // A manual save should not be re-triggered by the autosave effect
      // once state updates as a result of it.
      skipAutoSaveRef.current = true;

      await persistBasicInformation(sportsData);
    } catch (error) {
      notify(
        "error",
        "Save Failed",
        error.response?.data?.message ||
          "Failed to save Annual Sports Meet."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================================
     AUTOSAVE EFFECT — basic info + highlights + timeline
  ========================================================== */

  useEffect(() => {
    // Skip the very first run (initial mount) and any run that was
    // caused by a programmatic update (fetch/refresh/delete-all).
    if (skipAutoSaveRef.current) {
      skipAutoSaveRef.current = false;
      return;
    }

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        setAutoSaveStatus("saving");

        await persistBasicInformation(sportsData, {
          silent: true,
        });

        setAutoSaveStatus("saved");
      } catch (error) {
        setAutoSaveStatus("error");

        notify(
          "error",
          "Autosave Failed",
          error.response?.data?.message ||
            "Failed to save your changes automatically. Please try again."
        );
      }
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sportsData.heroSubtitle,
    sportsData.aboutText,
    sportsData.startDate,
    sportsData.endDate,
    sportsData.venue,
    sportsData.registerLink,
    sportsData.ctaTitle,
    sportsData.ctaDescription,
    sportsData.highlights,
    sportsData.timeline,
  ]);

  /* ==========================================================
     SPORTS EVENTS
  ========================================================== */

  const addSportsEvent = async () => {
    if (!newEvent.title.trim()) {
      return notify(
        "warning",
        "Incomplete",
        "Please enter an event title."
      );
    }

    try {
      const formData = new FormData();

      formData.append("title", newEvent.title);
      formData.append("description", newEvent.description);

      if (newEvent.image) {
        formData.append("image", newEvent.image);
      }

      const res = await api.post(
        "/annual-sports-meet/events",
        formData
      );

      setNewEvent(initialEvent);

      await fetchSportsData();

      notify("success", "Success", res.data.message);
    } catch (error) {
      notify(
        "error",
        "Add Failed",
        error.response?.data?.message ||
          "Failed to add sports event."
      );
    }
  };

  const updateSportsEvent = async () => {
    try {
      const formData = new FormData();

      formData.append("title", editingEvent.title);
      formData.append("description", editingEvent.description);

      if (editingEvent.newImage) {
        formData.append("image", editingEvent.newImage);
      }

      const res = await api.put(
        `/annual-sports-meet/events/${editingEvent._id}`,
        formData
      );

      document.getElementById("edit_event_modal")?.close();

      setEditingEvent(null);

      await fetchSportsData();

      notify("success", "Updated", res.data.message);
    } catch (error) {
      notify(
        "error",
        "Update Failed",
        error.response?.data?.message ||
          "Failed to update sports event."
      );
    }
  };

  const deleteSportsEvent = (id) => {
    confirmDelete(
      "Delete Sports Event",
      "Are you sure you want to permanently delete this sports event?",
      async () => {
        try {
          const res = await api.delete(
            `/annual-sports-meet/events/${id}`
          );

          await fetchSportsData();

          notify("success", "Deleted", res.data.message);
        } catch (error) {
          notify(
            "error",
            "Delete Failed",
            error.response?.data?.message ||
              "Failed to delete sports event."
          );
        } finally {
          closeDeleteModal();
        }
      }
    );
  };

  /* ==========================================================
     TIMELINE
     (local state only — persisted automatically by the autosave
     effect above, since `timeline` is one of its watched fields)
  ========================================================== */

  const addTimeline = () => {
    if (!newTimeline.title.trim()) {
      return notify(
        "warning",
        "Incomplete",
        "Please enter a timeline title."
      );
    }

    setSportsData((prev) => ({
      ...prev,
      timeline: [...(prev.timeline || []), { ...newTimeline }],
    }));

    setNewTimeline(initialTimeline);
  };

  const removeTimeline = (index) => {
    setSportsData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index),
    }));
  };

  /* ==========================================================
     HIGHLIGHTS
     (local state only — persisted automatically by the autosave
     effect above, since `highlights` is one of its watched fields)
  ========================================================== */

  const addHighlight = () => {
    if (!newHighlight.title.trim()) {
      return notify(
        "warning",
        "Incomplete",
        "Highlight title is required."
      );
    }

    setSportsData((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), { ...newHighlight }],
    }));

    setNewHighlight(initialHighlight);
  };

  const removeHighlight = (index) => {
    setSportsData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  /* ==========================================================
     ACHIEVEMENTS (backend-synced, image supported)
  ========================================================== */

  const handleNewAchievementImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (newAchievementPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(newAchievementPreview);
    }

    setNewAchievement((prev) => ({ ...prev, image: file }));
    setNewAchievementPreview(URL.createObjectURL(file));
  };

  const handleEditAchievementImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (editAchievementPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(editAchievementPreview);
    }

    setEditingAchievement((prev) => ({ ...prev, newImage: file }));
    setEditAchievementPreview(URL.createObjectURL(file));
  };

  const addAchievement = async () => {
    if (!newAchievement.title.trim()) {
      return notify(
        "warning",
        "Incomplete",
        "Achievement title is required."
      );
    }

    try {
      setAddingAchievement(true);

      const formData = new FormData();

      formData.append("title", newAchievement.title);
      formData.append("description", newAchievement.description);

      if (newAchievement.image) {
        formData.append("image", newAchievement.image);
      }

      const res = await api.post(
        "/annual-sports-meet/achievements",
        formData
      );

      setNewAchievement(initialAchievement);

      if (newAchievementPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(newAchievementPreview);
      }

      setNewAchievementPreview("");

      await fetchSportsData();

      notify("success", "Success", res.data.message);
    } catch (error) {
      notify(
        "error",
        "Add Failed",
        error.response?.data?.message ||
          "Failed to add achievement."
      );
    } finally {
      setAddingAchievement(false);
    }
  };

  const updateAchievement = async () => {
    try {
      setSavingAchievement(true);

      const formData = new FormData();

      formData.append("title", editingAchievement.title);
      formData.append("description", editingAchievement.description);

      if (editingAchievement.newImage) {
        formData.append("image", editingAchievement.newImage);
      }

      const res = await api.put(
        `/annual-sports-meet/achievements/${editingAchievement._id}`,
        formData
      );

      document.getElementById("edit_achievement_modal")?.close();

      setEditingAchievement(null);

      if (editAchievementPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(editAchievementPreview);
      }

      setEditAchievementPreview("");

      await fetchSportsData();

      notify("success", "Updated", res.data.message);
    } catch (error) {
      notify(
        "error",
        "Update Failed",
        error.response?.data?.message ||
          "Failed to update achievement."
      );
    } finally {
      setSavingAchievement(false);
    }
  };

  const deleteAchievement = (id) => {
    confirmDelete(
      "Delete Achievement",
      "Are you sure you want to permanently delete this achievement?",
      async () => {
        try {
          const res = await api.delete(
            `/annual-sports-meet/achievements/${id}`
          );

          await fetchSportsData();

          notify("success", "Deleted", res.data.message);
        } catch (error) {
          notify(
            "error",
            "Delete Failed",
            error.response?.data?.message ||
              "Failed to delete achievement."
          );
        } finally {
          closeDeleteModal();
        }
      }
    );
  };

  /* ==========================================================
     DELETE ALL
  ========================================================== */

  const handleDeleteAll = () => {
    confirmDelete(
      "Reset Annual Sports Meet",
      "This will permanently remove all Annual Sports Meet data. Continue?",
      async () => {
        try {
          // Cancel any pending autosave so it can't fire right after the
          // record is deleted and silently recreate it.
          if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
          }

          await api.delete("/annual-sports-meet");

          // This reset is programmatic, not a user edit — skip the next
          // autosave effect run it would otherwise trigger.
          skipAutoSaveRef.current = true;

          setSportsData(initialSportsData);

          if (heroPreview?.startsWith("blob:")) {
            URL.revokeObjectURL(heroPreview);
          }
          setHeroPreview("");

          setAutoSaveStatus("idle");

          notify(
            "success",
            "Deleted",
            "Annual Sports Meet data deleted successfully."
          );
        } catch (error) {
          notify(
            "error",
            "Delete Failed",
            error.response?.data?.message ||
              "Failed to delete Annual Sports Meet."
          );
        } finally {
          closeDeleteModal();
        }
      }
    );
  };

  /* ==========================================================
     FILTERED LISTS
  ========================================================== */

  const filteredEvents = useMemo(() => {
    return (sportsData.sportsEvents || []).filter(
      (event) =>
        event.title?.toLowerCase().includes(eventSearch.toLowerCase()) ||
        event.description
          ?.toLowerCase()
          .includes(eventSearch.toLowerCase())
    );
  }, [sportsData.sportsEvents, eventSearch]);

  const filteredAchievements = useMemo(() => {
    return (sportsData.achievements || []).filter(
      (item) =>
        item.title
          ?.toLowerCase()
          .includes(achievementSearch.toLowerCase()) ||
        item.description
          ?.toLowerCase()
          .includes(achievementSearch.toLowerCase())
    );
  }, [sportsData.achievements, achievementSearch]);

  /* ==========================================================
     AUTOSAVE INDICATOR
  ========================================================== */

  const AutoSaveIndicator = () => {
    if (autoSaveStatus === "saving") {
      return (
        <span className="inline-flex items-center gap-2 text-sm text-base-content/60">
          <Loader2 size={14} className="animate-spin" />
          Saving...
        </span>
      );
    }

    if (autoSaveStatus === "saved") {
      return (
        <span className="inline-flex items-center gap-2 text-sm text-success">
          <Check size={14} />
          All changes saved
        </span>
      );
    }

    if (autoSaveStatus === "error") {
      return (
        <span className="inline-flex items-center gap-2 text-sm text-error">
          Autosave failed — click Save Now
        </span>
      );
    }

    return null;
  };

  /* ==========================================================
     RETURN
  ========================================================== */

  return (
    <>
      {/* ==========================================================
          SCROLLABLE PANEL STYLES
      ========================================================== */}

      <style>{`
        .scroll-panel {
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(120, 120, 120, 0.45) transparent;
        }
        .scroll-panel::-webkit-scrollbar {
          width: 8px;
        }
        .scroll-panel::-webkit-scrollbar-track {
          background: transparent;
        }
        .scroll-panel::-webkit-scrollbar-thumb {
          background-color: rgba(120, 120, 120, 0.45);
          border-radius: 999px;
        }
        .scroll-panel::-webkit-scrollbar-thumb:hover {
          background-color: rgba(120, 120, 120, 0.7);
        }
      `}</style>

      {/* ==========================================================
          MODALS
      ========================================================== */}

      <LoadingModal
        isOpen={loading || saving}
        title={saving ? "Saving Annual Sports Meet" : "Loading Annual Sports Meet"}
        message={
          saving
            ? "Please wait while your changes are being saved..."
            : "Fetching Annual Sports Meet data..."
        }
      />

      <StatusModal
        isOpen={statusModal.isOpen}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() =>
          setStatusModal((prev) => ({ ...prev, isOpen: false }))
        }
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.title}
        message={deleteModal.message}
        onConfirm={deleteModal.onConfirm}
        onCancel={closeDeleteModal}
      />

      {/* ==========================================================
          PAGE
      ========================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="min-h-screen bg-base-200 p-4 md:p-6 lg:p-8"
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* ==========================================================
              HERO
          ========================================================== */}

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero rounded-3xl bg-linear-to-r from-primary via-secondary to-accent text-primary-content shadow-xl"
          >
            <div className="hero-content text-center py-10">
              <div>
                <Trophy className="mx-auto h-20 w-20 mb-5" />

                <h1 className="text-4xl md:text-5xl font-black">
                  Annual Sports Meet CMS
                </h1>

                <p className="mt-3 text-lg opacity-90 max-w-3xl">
                  Manage the complete Annual Sports Meet, including
                  hero section, sports events, highlights, timeline,
                  achievements and registration from one
                  enterprise dashboard. Changes save automatically as
                  you type.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ==========================================================
              MAIN LAYOUT
          ========================================================== */}

          <div className="grid xl:grid-cols-[1.6fr_1fr] gap-6">
            {/* ==========================================================
                HERO INFORMATION
            ========================================================== */}

            <div className="card bg-base-100 border border-base-300 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-black">
                      Annual Sports Meet Information
                    </h2>
                    <p className="text-base-content/70">
                      Configure the hero section and general event
                      information.
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="badge badge-primary badge-lg">
                      Single Record CMS
                    </div>
                    <AutoSaveIndicator />
                  </div>
                </div>

                {/* HERO SUBTITLE */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Hero Subtitle
                    </span>
                  </label>
                  <input
                    type="text"
                    value={sportsData.heroSubtitle}
                    onChange={(e) =>
                      setSportsData((prev) => ({
                        ...prev,
                        heroSubtitle: e.target.value,
                      }))
                    }
                    className="input input-bordered w-full"
                    placeholder="Annual Sports Meet 2026"
                  />
                </div>

                {/* ABOUT */}
                <div className="form-control mt-6">
                  <label className="label">
                    <span className="label-text font-semibold">
                      About Sports Meet
                    </span>
                  </label>
                  <textarea
                    rows={6}
                    value={sportsData.aboutText}
                    onChange={(e) =>
                      setSportsData((prev) => ({
                        ...prev,
                        aboutText: e.target.value,
                      }))
                    }
                    className="textarea textarea-bordered w-full"
                    placeholder="Write about the Annual Sports Meet..."
                  />
                </div>

                {/* EVENT DATES */}
                <div className="divider">Event Schedule</div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Start Date</span>
                    </label>
                    <input
                      type="date"
                      value={sportsData.startDate || ""}
                      onChange={(e) =>
                        setSportsData((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      className="input input-bordered"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">End Date</span>
                    </label>
                    <input
                      type="date"
                      value={sportsData.endDate || ""}
                      onChange={(e) =>
                        setSportsData((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      className="input input-bordered"
                    />
                  </div>
                </div>

                {/* VENUE */}
                <div className="divider">Venue</div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Event Venue</span>
                  </label>
                  <input
                    type="text"
                    value={sportsData.venue}
                    onChange={(e) =>
                      setSportsData((prev) => ({
                        ...prev,
                        venue: e.target.value,
                      }))
                    }
                    className="input input-bordered"
                    placeholder="College Sports Ground"
                  />
                </div>

                {/* REGISTRATION LINK */}
                <div className="form-control mt-6">
                  <label className="label">
                    <span className="label-text">
                      Registration Link
                    </span>
                  </label>
                  <input
                    type="url"
                    value={sportsData.registerLink}
                    onChange={(e) =>
                      setSportsData((prev) => ({
                        ...prev,
                        registerLink: e.target.value,
                      }))
                    }
                    className="input input-bordered"
                    placeholder="https://..."
                  />
                </div>

                {/* HERO IMAGE */}
                <div className="divider">Hero Banner</div>

                <div className="form-control flex-row items-center gap-3">
                  <label
                    className={`btn btn-outline ${
                      savingHeroImage ? "btn-disabled" : ""
                    }`}
                  >
                    {savingHeroImage ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Choose Hero Image"
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={savingHeroImage}
                      onChange={handleHeroImageChange}
                    />
                  </label>

                  {savingHeroImage && (
                    <span className="text-sm text-base-content/60">
                      Uploading and saving hero image...
                    </span>
                  )}
                </div>

                {heroPreview && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 rounded-2xl overflow-hidden border border-base-300"
                  >
                    <img
                      src={heroPreview}
                      alt="Hero Preview"
                      className="w-full h-72 object-cover"
                    />
                  </motion.div>
                )}

                <div className="flex items-center justify-between gap-3 mt-4">
                  <p className="text-xs text-base-content/60">
                    Fields above save automatically a moment after you
                    stop typing. Use "Save Now" only if you want to
                    force an immediate save (e.g. right after choosing
                    a hero image).
                  </p>

                  <button
                    type="button"
                    onClick={saveBasicInformation}
                    disabled={saving}
                    className="btn btn-primary btn-sm shrink-0"
                  >
                    <Save size={16} />
                    {saving ? "Saving..." : "Save Now"}
                  </button>
                </div>

                {/* ==========================================================
                    HIGHLIGHTS MANAGEMENT
                ========================================================== */}

                <div className="divider">Highlights</div>

                <div className="card bg-base-200 border border-base-300">
                  <div className="card-body">
                    <h3 className="text-xl font-black mb-5">
                      Sports Highlights
                    </h3>

                    <div className="grid lg:grid-cols-[120px_1fr_1fr_auto] gap-4">
                      <input
                        type="text"
                        value={newHighlight.icon}
                        onChange={(e) =>
                          setNewHighlight((prev) => ({
                            ...prev,
                            icon: e.target.value,
                          }))
                        }
                        className="input input-bordered"
                        placeholder="🏆"
                      />

                      <input
                        type="text"
                        value={newHighlight.title}
                        onChange={(e) =>
                          setNewHighlight((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className="input input-bordered"
                        placeholder="Highlight Title"
                      />

                      <input
                        type="text"
                        value={newHighlight.description}
                        onChange={(e) =>
                          setNewHighlight((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="input input-bordered"
                        placeholder="Short description"
                      />

                      <button
                        type="button"
                        onClick={addHighlight}
                        className="btn btn-primary"
                      >
                        <Plus size={18} />
                        Add
                      </button>
                    </div>

                    <div className="scroll-panel max-h-96 mt-6 pr-2">
                      <div className="grid md:grid-cols-2 gap-4">
                        {sportsData.highlights?.map((item, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ y: -3 }}
                            className="card bg-base-100 border border-base-300 shadow"
                          >
                            <div className="card-body">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl">
                                  {item.icon}
                                </span>
                                <div>
                                  <h4 className="font-bold">
                                    {item.title}
                                  </h4>
                                  <p className="text-base-content/70">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeHighlight(index)}
                                className="btn btn-error btn-xs mt-4 self-end"
                              >
                                Remove
                              </button>
                            </div>
                          </motion.div>
                        ))}

                        {!sportsData.highlights?.length && (
                          <div className="col-span-full text-center text-base-content/60 py-6">
                            No highlights added yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ==========================================================
                    SPORTS EVENTS MANAGEMENT
                ========================================================== */}

                <div className="divider">Sports Events</div>

                <div className="card bg-base-200 border border-base-300">
                  <div className="card-body">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-xl font-black">
                          Sports Events
                        </h3>
                        <p className="text-base-content/70">
                          Add, edit and manage all sports events.
                        </p>
                      </div>

                      <input
                        type="text"
                        value={eventSearch}
                        onChange={(e) => setEventSearch(e.target.value)}
                        placeholder="Search events..."
                        className="input input-bordered lg:w-72"
                      />
                    </div>

                    {/* ADD EVENT */}
                    <div className="grid lg:grid-cols-3 gap-5">
                      <input
                        type="text"
                        value={newEvent.title}
                        onChange={(e) =>
                          setNewEvent((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Event Title"
                        className="input input-bordered"
                      />

                      <textarea
                        rows={2}
                        value={newEvent.description}
                        onChange={(e) =>
                          setNewEvent((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Description"
                        className="textarea textarea-bordered"
                      />

                      <div className="space-y-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setNewEvent((prev) => ({
                              ...prev,
                              image: e.target.files?.[0] || null,
                            }))
                          }
                          className="file-input file-input-bordered w-full"
                        />

                        <button
                          type="button"
                          onClick={addSportsEvent}
                          className="btn btn-primary w-full"
                        >
                          <Plus size={18} />
                          Add Event
                        </button>
                      </div>
                    </div>

                    {/* EVENTS GRID */}
                    <div className="scroll-panel max-h-160 mt-8 pr-2">
                      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filteredEvents.map((event) => (
                          <motion.div
                            key={event._id}
                            whileHover={{ y: -4 }}
                            className="card bg-base-100 border border-base-300 shadow"
                          >
                            {event.image && (
                              <figure className="h-52">
                                <img
                                  src={event.image}
                                  alt={event.title}
                                  className="w-full h-full object-cover"
                                />
                              </figure>
                            )}

                            <div className="card-body">
                              <h3 className="card-title">{event.title}</h3>
                              <p className="text-base-content/70 line-clamp-3">
                                {event.description}
                              </p>

                              <div className="card-actions justify-end mt-4">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingEvent({
                                      ...event,
                                      newImage: null,
                                    });

                                    document
                                      .getElementById("edit_event_modal")
                                      ?.showModal();
                                  }}
                                  className="btn btn-info btn-sm"
                                >
                                  <Pencil size={14} />
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteSportsEvent(event._id)
                                  }
                                  className="btn btn-error btn-sm"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        {!filteredEvents.length && (
                          <div className="col-span-full text-center text-base-content/60 py-6">
                            No sports events found.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* EDIT EVENT MODAL */}
                <dialog id="edit_event_modal" className="modal">
                  <div className="modal-box max-w-2xl">
                    <h3 className="font-black text-2xl mb-6">
                      Edit Sports Event
                    </h3>

                    {editingEvent && (
                      <div className="space-y-5">
                        <input
                          type="text"
                          value={editingEvent.title}
                          onChange={(e) =>
                            setEditingEvent((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          className="input input-bordered w-full"
                        />

                        <textarea
                          rows={5}
                          value={editingEvent.description}
                          onChange={(e) =>
                            setEditingEvent((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          className="textarea textarea-bordered w-full"
                        />

                        {editingEvent.image && !editingEvent.newImage && (
                          <img
                            src={editingEvent.image}
                            alt="Current"
                            className="w-full h-40 object-cover rounded-xl border border-base-300"
                          />
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setEditingEvent((prev) => ({
                              ...prev,
                              newImage: e.target.files?.[0] || null,
                            }))
                          }
                          className="file-input file-input-bordered w-full"
                        />

                        <div className="modal-action">
                          <form method="dialog">
                            <button className="btn">Cancel</button>
                          </form>

                          <button
                            type="button"
                            onClick={updateSportsEvent}
                            className="btn btn-primary"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </dialog>

                {/* ==========================================================
                    TIMELINE MANAGEMENT
                ========================================================== */}

                <div className="divider">Event Timeline</div>

                <div className="card bg-base-200 border border-base-300">
                  <div className="card-body">
                    <h3 className="text-xl font-black mb-5">
                      Timeline Management
                    </h3>

                    <div className="grid lg:grid-cols-[180px_1fr_1fr_auto] gap-4">
                      <input
                        type="text"
                        value={newTimeline.day}
                        onChange={(e) =>
                          setNewTimeline((prev) => ({
                            ...prev,
                            day: e.target.value,
                          }))
                        }
                        className="input input-bordered"
                        placeholder="Day 1"
                      />

                      <input
                        type="text"
                        value={newTimeline.title}
                        onChange={(e) =>
                          setNewTimeline((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className="input input-bordered"
                        placeholder="Opening Ceremony"
                      />

                      <input
                        type="text"
                        value={newTimeline.description}
                        onChange={(e) =>
                          setNewTimeline((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="input input-bordered"
                        placeholder="Description"
                      />

                      <button
                        type="button"
                        onClick={addTimeline}
                        className="btn btn-primary"
                      >
                        <Plus size={18} />
                        Add
                      </button>
                    </div>

                    <div className="scroll-panel max-h-96 mt-6 pr-2">
                      <div className="space-y-4">
                        {sportsData.timeline?.map((item, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ y: -2 }}
                            className="card bg-base-100 border border-base-300 shadow"
                          >
                            <div className="card-body">
                              <div className="flex justify-between gap-5">
                                <div>
                                  <div className="badge badge-primary mb-3">
                                    {item.day}
                                  </div>
                                  <h4 className="font-bold text-lg">
                                    {item.title}
                                  </h4>
                                  <p className="text-base-content/70">
                                    {item.description}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeTimeline(index)}
                                  className="btn btn-error btn-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        {!sportsData.timeline?.length && (
                          <div className="text-center text-base-content/60 py-6">
                            No timeline entries added yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ==========================================================
                    ACHIEVEMENTS MANAGEMENT (with image upload)
                ========================================================== */}

                <div className="divider">Achievements</div>

                <div className="card bg-linear-to-br from-amber-50/60 via-base-200 to-base-200 border border-base-300">
                  <div className="card-body">
                    {/* SECTION HEADER */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
                          <Award size={22} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black">
                            Sports Achievements
                          </h3>
                          <p className="text-base-content/70">
                            Every achievement carries its own image,
                            uploaded and stored on the server.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={achievementSearch}
                          onChange={(e) =>
                            setAchievementSearch(e.target.value)
                          }
                          placeholder="Search achievements..."
                          className="input input-bordered w-full sm:w-64"
                        />
                      </div>
                    </div>

                    {/* ADD ACHIEVEMENT FORM */}
                    <div className="rounded-2xl border border-dashed border-amber-400/50 bg-base-100 p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Plus size={16} className="text-amber-600" />
                        <h4 className="font-bold text-sm uppercase tracking-wide text-base-content/70">
                          Add New Achievement
                        </h4>
                      </div>

                      <div className="grid lg:grid-cols-[1fr_1fr_auto] gap-4 items-start">
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={newAchievement.title}
                            onChange={(e) =>
                              setNewAchievement((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            placeholder="Achievement Title"
                            className="input input-bordered w-full"
                          />

                          <textarea
                            rows={2}
                            value={newAchievement.description}
                            onChange={(e) =>
                              setNewAchievement((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            placeholder="Achievement Description"
                            className="textarea textarea-bordered w-full"
                          />
                        </div>

                        <div className="flex items-start gap-3">
                          {newAchievementPreview ? (
                            <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden border border-base-300">
                              <img
                                src={newAchievementPreview}
                                alt="Preview"
                                className="h-full w-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (
                                    newAchievementPreview?.startsWith(
                                      "blob:"
                                    )
                                  ) {
                                    URL.revokeObjectURL(
                                      newAchievementPreview
                                    );
                                  }
                                  setNewAchievement((prev) => ({
                                    ...prev,
                                    image: null,
                                  }));
                                  setNewAchievementPreview("");
                                }}
                                className="absolute -top-1.5 -right-1.5 btn btn-circle btn-error btn-xs"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <label className="flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-base-300 text-base-content/50 hover:border-amber-400 hover:text-amber-600 transition-colors">
                              <ImagePlus size={20} />
                              <span className="text-[10px] font-medium">
                                Image
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleNewAchievementImage}
                              />
                            </label>
                          )}

                          <button
                            type="button"
                            onClick={addAchievement}
                            disabled={addingAchievement}
                            className="btn btn-primary h-20 flex-1"
                          >
                            {addingAchievement ? (
                              <span className="loading loading-spinner loading-sm" />
                            ) : (
                              <>
                                <Plus size={18} />
                                Add
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ACHIEVEMENTS GRID */}
                    <div className="scroll-panel max-h-170 mt-6 pr-2">
                      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filteredAchievements.map((item, index) => (
                          <motion.div
                            key={item._id}
                            whileHover={{ y: -6 }}
                            className="card image-full h-64 shadow-lg border border-base-300 overflow-hidden group"
                          >
                            <figure>
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-linear-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center">
                                  <Medal
                                    size={52}
                                    className="text-white/60"
                                  />
                                </div>
                              )}
                            </figure>

                            <div className="card-body justify-end p-5">
                              <span className="badge badge-warning gap-1 self-start mb-1">
                                <Medal size={12} />
                                #{index + 1}
                              </span>

                              <h4 className="card-title text-white drop-shadow-sm leading-tight">
                                {item.title}
                              </h4>

                              <p className="text-white/85 text-sm line-clamp-2">
                                {item.description}
                              </p>

                              <div className="card-actions justify-end mt-3 opacity-90 group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingAchievement({
                                      ...item,
                                      newImage: null,
                                    });

                                    setEditAchievementPreview("");

                                    document
                                      .getElementById(
                                        "edit_achievement_modal"
                                      )
                                      ?.showModal();
                                  }}
                                  className="btn btn-info btn-sm"
                                >
                                  <Pencil size={14} />
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteAchievement(item._id)
                                  }
                                  className="btn btn-error btn-sm"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        {!filteredAchievements.length && (
                          <div className="col-span-full flex flex-col items-center justify-center gap-2 text-center text-base-content/60 py-12">
                            <Award
                              size={32}
                              className="text-base-content/30"
                            />
                            <p>
                              {achievementSearch
                                ? "No achievements match your search."
                                : "No achievements added yet."}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* EDIT ACHIEVEMENT MODAL */}
                <dialog id="edit_achievement_modal" className="modal">
                  <div className="modal-box max-w-2xl">
                    <h3 className="font-black text-2xl mb-6">
                      Edit Achievement
                    </h3>

                    {editingAchievement && (
                      <div className="space-y-5">
                        <input
                          type="text"
                          value={editingAchievement.title}
                          onChange={(e) =>
                            setEditingAchievement((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          className="input input-bordered w-full"
                          placeholder="Achievement Title"
                        />

                        <textarea
                          rows={5}
                          value={editingAchievement.description}
                          onChange={(e) =>
                            setEditingAchievement((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          className="textarea textarea-bordered w-full"
                          placeholder="Achievement Description"
                        />

                        <div>
                          <label className="label">
                            <span className="label-text font-semibold">
                              Achievement Image
                            </span>
                          </label>

                          <img
                            src={
                              editAchievementPreview ||
                              editingAchievement.image ||
                              ""
                            }
                            alt="Achievement"
                            className={`w-full h-40 object-cover rounded-xl border border-base-300 mb-3 ${
                              editAchievementPreview ||
                              editingAchievement.image
                                ? ""
                                : "hidden"
                            }`}
                          />

                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleEditAchievementImage}
                            className="file-input file-input-bordered w-full"
                          />
                          <span className="label">
                            <span className="label-text-alt text-base-content/60">
                              Leave empty to keep the current image.
                            </span>
                          </span>
                        </div>

                        <div className="modal-action">
                          <form method="dialog">
                            <button
                              className="btn"
                              onClick={() => {
                                if (
                                  editAchievementPreview?.startsWith(
                                    "blob:"
                                  )
                                ) {
                                  URL.revokeObjectURL(
                                    editAchievementPreview
                                  );
                                }
                                setEditAchievementPreview("");
                              }}
                            >
                              Cancel
                            </button>
                          </form>

                          <button
                            type="button"
                            onClick={updateAchievement}
                            disabled={savingAchievement}
                            className="btn btn-primary"
                          >
                            {savingAchievement ? (
                              <>
                                <span className="loading loading-spinner loading-sm" />
                                Saving...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </dialog>

                {/* ==========================================================
                    CALL TO ACTION
                ========================================================== */}

                <div className="divider">Call To Action</div>

                <div className="card bg-base-200 border border-base-300">
                  <div className="card-body">
                    <h3 className="text-xl font-black mb-5">
                      Registration Section
                    </h3>

                    <div className="space-y-5">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">CTA Title</span>
                        </label>
                        <input
                          type="text"
                          value={sportsData.ctaTitle}
                          onChange={(e) =>
                            setSportsData((prev) => ({
                              ...prev,
                              ctaTitle: e.target.value,
                            }))
                          }
                          className="input input-bordered"
                          placeholder="Join Annual Sports Meet"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">
                            CTA Description
                          </span>
                        </label>
                        <textarea
                          rows={4}
                          value={sportsData.ctaDescription}
                          onChange={(e) =>
                            setSportsData((prev) => ({
                              ...prev,
                              ctaDescription: e.target.value,
                            }))
                          }
                          className="textarea textarea-bordered"
                          placeholder="Encourage students to participate..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ==========================================================
                LIVE PREVIEW
            ========================================================== */}

            <div className="space-y-6 sticky top-6 h-fit">
              <div className="card bg-base-100 border border-base-300 shadow-xl">
                <div className="card-body">
                  <h2 className="text-2xl font-black mb-6">
                    Live Preview
                  </h2>

                  <div className="rounded-3xl overflow-hidden bg-linear-to-br from-primary via-secondary to-accent text-primary-content">
                    {heroPreview && (
                      <img
                        src={heroPreview}
                        alt="Hero"
                        className="w-full h-56 object-cover"
                      />
                    )}

                    <div className="p-6">
                      <h2 className="text-3xl font-black">
                        Annual Sports Meet
                      </h2>

                      <p className="mt-3 opacity-90">
                        {sportsData.heroSubtitle ||
                          "Annual Sports Meet"}
                      </p>

                      <div className="divider divider-neutral before:bg-white/20 after:bg-white/20" />

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar size={18} />
                          <span>
                            {sportsData.startDate
                              ? `${formatDisplayDate(
                                  sportsData.startDate
                                )} - ${formatDisplayDate(
                                  sportsData.endDate
                                )}`
                              : "Dates not configured"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <MapPin size={18} />
                          <span>
                            {sportsData.venue ||
                              "Venue not configured"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* HIGHLIGHTS PREVIEW */}
              <div className="card bg-base-100 border border-base-300 shadow-xl">
                <div className="card-body">
                  <h2 className="text-xl font-black mb-5">
                    Highlights Preview
                  </h2>

                  <div className="space-y-3">
                    {sportsData.highlights?.length ? (
                      sportsData.highlights.map((item, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ x: 4 }}
                          className="flex items-start gap-4 rounded-xl bg-base-200 p-4"
                        >
                          <div className="text-3xl">{item.icon}</div>
                          <div>
                            <h4 className="font-bold">{item.title}</h4>
                            <p className="text-sm text-base-content/70">
                              {item.description}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center text-base-content/60 py-8">
                        No highlights added yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ACHIEVEMENTS PREVIEW */}
              <div className="card bg-base-100 border border-base-300 shadow-xl">
                <div className="card-body">
                  <h2 className="text-xl font-black mb-5">
                    Achievements Preview
                  </h2>

                  <div className="space-y-3">
                    {sportsData.achievements?.length ? (
                      sportsData.achievements.map((item) => (
                        <motion.div
                          key={item._id}
                          whileHover={{ x: 4 }}
                          className="flex items-center gap-4 rounded-xl bg-base-200 p-3"
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-14 w-14 rounded-lg object-cover shrink-0"
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-lg bg-base-300 flex items-center justify-center shrink-0">
                              <Medal
                                size={20}
                                className="text-base-content/40"
                              />
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-sm">
                              {item.title}
                            </h4>
                            <p className="text-xs text-base-content/70 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center text-base-content/60 py-8">
                        No achievements added yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CTA PREVIEW */}
              <div className="card bg-base-100 border border-base-300 shadow-xl">
                <div className="card-body">
                  <h2 className="text-xl font-black mb-4">
                    Registration Preview
                  </h2>

                  <div className="rounded-2xl bg-primary text-primary-content p-6">
                    <h3 className="text-2xl font-black">
                      {sportsData.ctaTitle || "Join Annual Sports Meet"}
                    </h3>

                    <p className="mt-3 opacity-90">
                      {sportsData.ctaDescription ||
                        "Encourage students to participate in the Annual Sports Meet."}
                    </p>

                    <a
                      href={sportsData.registerLink || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-warning mt-6 w-full"
                    >
                      Register Now
                    </a>
                  </div>
                </div>
              </div>

              {/* QUICK ACTIONS */}
              <div className="card bg-base-100 border border-base-300 shadow-xl">
                <div className="card-body">
                  <h2 className="text-xl font-black mb-5">
                    Quick Actions
                  </h2>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={fetchSportsData}
                      disabled={loading}
                      className="btn btn-outline w-full"
                    >
                      Refresh Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==========================================================
              STICKY FOOTER
          ========================================================== */}

          <div className="sticky bottom-4 z-30">
            <div className="card bg-base-100 border border-base-300 shadow-2xl">
              <div className="card-body py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <AutoSaveIndicator />

                  <div className="flex flex-wrap justify-end gap-3">
                    <button
                      type="button"
                      onClick={fetchSportsData}
                      disabled={loading}
                      className="btn btn-outline"
                    >
                      Refresh
                    </button>

                    <button
                      type="button"
                      onClick={saveBasicInformation}
                      disabled={saving}
                      className="btn btn-primary"
                    >
                      {saving ? (
                        <>
                          <span className="loading loading-spinner loading-sm" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Save Now
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleDeleteAll}
                      className="btn btn-error"
                    >
                      Delete All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}