import {
  IMAGE_TYPES,
  PDF_TYPES,
  VIDEO_TYPES,
  AUDIO_TYPES,
} from "./uploadConstants";

export const previewFile = (file) => {
  if (!file) {
    return {
      type: null,
      preview: "",
      url: "",
      src: "",
      value: "",
    };
  }

  /* ==========================================
     IMAGE
  ========================================== */

  if (IMAGE_TYPES.includes(file.type)) {
    const blobUrl = URL.createObjectURL(file);

    return {
      type: "image",

      // New format
      preview: blobUrl,

      // Compatibility aliases
      url: blobUrl,
      src: blobUrl,
      value: blobUrl,

      // Makes String(preview) return the URL
      toString() {
        return blobUrl;
      },

      valueOf() {
        return blobUrl;
      },
    };
  }

  /* ==========================================
     PDF
  ========================================== */

  if (PDF_TYPES.includes(file.type)) {
    return {
      type: "pdf",
      preview: "PDF",
      url: "",
      src: "",
      value: "",

      toString() {
        return "";
      },

      valueOf() {
        return "";
      },
    };
  }

  /* ==========================================
     VIDEO
  ========================================== */

  if (VIDEO_TYPES.includes(file.type)) {
    const blobUrl = URL.createObjectURL(file);

    return {
      type: "video",
      preview: blobUrl,
      url: blobUrl,
      src: blobUrl,
      value: blobUrl,

      toString() {
        return blobUrl;
      },

      valueOf() {
        return blobUrl;
      },
    };
  }

  /* ==========================================
     AUDIO
  ========================================== */

  if (AUDIO_TYPES.includes(file.type)) {
    const blobUrl = URL.createObjectURL(file);

    return {
      type: "audio",
      preview: blobUrl,
      url: blobUrl,
      src: blobUrl,
      value: blobUrl,

      toString() {
        return blobUrl;
      },

      valueOf() {
        return blobUrl;
      },
    };
  }

  return {
    type: null,
    preview: "",
    url: "",
    src: "",
    value: "",
  };
};