// ==========================================================
// FILE SIZE LIMITS
// ==========================================================

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const MAX_PDF_SIZE = 10 * 1024 * 1024;
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
export const MAX_AUDIO_SIZE = 20 * 1024 * 1024;

// ==========================================================
// MIME TYPES
// ==========================================================

export const IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
];

export const PDF_TYPES = [
  "application/pdf",
];

export const VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export const AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
];

// ==========================================================
// FILE EXTENSIONS
// ==========================================================

export const IMAGE_EXTENSIONS =
".jpg,.jpeg,.png,.webp,.gif,.svg,.avif";

export const PDF_EXTENSIONS =
  ".pdf";

export const VIDEO_EXTENSIONS =
  ".mp4,.webm,.mov";

export const AUDIO_EXTENSIONS =
  ".mp3,.wav";

// ==========================================================
// BACKWARD COMPATIBILITY
// ==========================================================

export const IMAGE_UPLOAD = {
  maxSize: MAX_IMAGE_SIZE,
  allowedTypes: IMAGE_TYPES,
  accept: IMAGE_EXTENSIONS,
};

export const PDF_UPLOAD = {
  maxSize: MAX_PDF_SIZE,
  allowedTypes: PDF_TYPES,
  accept: PDF_EXTENSIONS,
};

export const VIDEO_UPLOAD = {
  maxSize: MAX_VIDEO_SIZE,
  allowedTypes: VIDEO_TYPES,
  accept: VIDEO_EXTENSIONS,
};

export const AUDIO_UPLOAD = {
  maxSize: MAX_AUDIO_SIZE,
  allowedTypes: AUDIO_TYPES,
  accept: AUDIO_EXTENSIONS,
};