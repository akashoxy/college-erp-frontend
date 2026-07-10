import {
  IMAGE_TYPES,
  PDF_TYPES,
  VIDEO_TYPES,
  AUDIO_TYPES,
  MAX_IMAGE_SIZE,
  MAX_PDF_SIZE,
  MAX_VIDEO_SIZE,
  MAX_AUDIO_SIZE,
} from "./uploadConstants";

export const validateUpload = (
  file,
  options = {}
) => {
  if (!file) {
    return {
      valid: false,
      message: "Please select a file.",
    };
  }

  /* ======================================================
     SUPPORT BOTH OLD & NEW CONFIGURATION
  ====================================================== */

  const allowImages =
    options.allowImages === true ||
    (
      Array.isArray(options.allowedTypes) &&
      options.allowedTypes.some((type) =>
        IMAGE_TYPES.includes(type)
      )
    );

  const allowPdf =
    options.allowPdf === true ||
    (
      Array.isArray(options.allowedTypes) &&
      options.allowedTypes.some((type) =>
        PDF_TYPES.includes(type)
      )
    );

  const allowVideo =
    options.allowVideo === true ||
    (
      Array.isArray(options.allowedTypes) &&
      options.allowedTypes.some((type) =>
        VIDEO_TYPES.includes(type)
      )
    );

  const allowAudio =
    options.allowAudio === true ||
    (
      Array.isArray(options.allowedTypes) &&
      options.allowedTypes.some((type) =>
        AUDIO_TYPES.includes(type)
      )
    );

  const allowedTypes = [];
  let maxSize = 0;

  if (allowImages) {
    allowedTypes.push(...IMAGE_TYPES);
    maxSize = Math.max(maxSize, MAX_IMAGE_SIZE);
  }

  if (allowPdf) {
    allowedTypes.push(...PDF_TYPES);
    maxSize = Math.max(maxSize, MAX_PDF_SIZE);
  }

  if (allowVideo) {
    allowedTypes.push(...VIDEO_TYPES);
    maxSize = Math.max(maxSize, MAX_VIDEO_SIZE);
  }

  if (allowAudio) {
    allowedTypes.push(...AUDIO_TYPES);
    maxSize = Math.max(maxSize, MAX_AUDIO_SIZE);
  }

  /* ======================================================
     FALLBACK FOR CUSTOM CONFIGS
  ====================================================== */

  if (
    allowedTypes.length === 0 &&
    Array.isArray(options.allowedTypes)
  ) {
    allowedTypes.push(...options.allowedTypes);
    maxSize = options.maxSize || 0;
  }

  if (
    !allowedTypes.includes(file.type)
  ) {
    return {
      valid: false,
      message: "Unsupported file format.",
    };
  }

  if (
    maxSize > 0 &&
    file.size > maxSize
  ) {
    return {
      valid: false,
      message: `Maximum file size is ${Math.round(
        maxSize / 1024 / 1024
      )} MB.`,
    };
  }

  return {
    valid: true,
  };
};