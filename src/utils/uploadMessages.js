// ==========================================================
// SUCCESS MESSAGES
// ==========================================================

export const SUCCESS_MESSAGES = {
  CREATE: "Created successfully.",
  UPDATE: "Updated successfully.",
  DELETE: "Deleted successfully.",
  UPLOAD: "File uploaded successfully.",
  REMOVE: "File removed successfully.",
  SAVE: "Changes saved successfully.",
};

// ==========================================================
// ERROR MESSAGES
// ==========================================================

export const ERROR_MESSAGES = {
  LOAD: "Failed to load data.",
  SAVE: "Failed to save changes.",
  DELETE: "Failed to delete data.",
  REMOVE: "Failed to remove file.",
  NETWORK:
    "Unable to connect to the server. Please check your internet connection.",
  SERVER:
    "Something went wrong on the server. Please try again.",
  UNKNOWN:
    "Something went wrong. Please try again.",
  INVALID_FILE:
    "Unsupported file format.",
  FILE_TOO_LARGE:
    "Selected file exceeds the maximum allowed size.",
};

// ==========================================================
// COMMON TITLES
// ==========================================================

export const TITLES = {
  SUCCESS: "Success",
  ERROR: "Error",
  WARNING: "Warning",
  INFO: "Information",
  DELETE_CONFIRMATION: "Delete Confirmation",
  REMOVE_CONFIRMATION: "Remove Confirmation",
  UPLOADING: "Uploading File",
  SAVING: "Saving Changes",
  LOADING: "Loading",
};

// ==========================================================
// REQUIREMENTS
// ==========================================================

export const getUploadRequirements = ({
  images = false,
  pdf = false,
  video = false,
  audio = false,
  maxSize = "",
} = {}) => {

  const formats = [];

  if (images) formats.push("JPG", "PNG", "WEBP");
  if (pdf) formats.push("PDF");
  if (video) formats.push("MP4", "MOV", "WEBM");
  if (audio) formats.push("MP3", "WAV");

  return {
    title: "Supported Uploads",
    formats,
    maxSize,
  };

};

// ==========================================================
// INVALID FILE
// ==========================================================

export const getInvalidFileMessage = ({
  images = false,
  pdf = false,
  video = false,
  audio = false,
} = {}) => {

  const types = [];

  if (images) types.push("JPG", "PNG", "WEBP");
  if (pdf) types.push("PDF");
  if (video) types.push("MP4", "MOV", "WEBM");
  if (audio) types.push("MP3", "WAV");

  return `Only ${types.join(", ")} files are allowed.`;

};

// ==========================================================
// FILE SIZE
// ==========================================================

export const getFileSizeMessage = (
  size
) => {

  return `Maximum upload size is ${size}.`;

};

// ==========================================================
// LOADING
// ==========================================================

export const LOADING_MESSAGES = {
  IMAGE: "Uploading image to Cloudinary...",
  PDF: "Uploading PDF to Cloudinary...",
  VIDEO: "Uploading video to Cloudinary...",
  AUDIO: "Uploading audio to Cloudinary...",
  DATA: "Loading data...",
};

// ==========================================================
// DELETE
// ==========================================================

export const getDeleteMessage = (
  itemName = "this item"
) => {

  return `Are you sure you want to delete ${itemName}? This action cannot be undone.`;

};

// ==========================================================
// REMOVE
// ==========================================================

export const getRemoveFileMessage = (
  itemName = "this file"
) => {

  return `Are you sure you want to remove ${itemName}?`;

};

// ==========================================================
// SUCCESS HELPERS
// ==========================================================

export const getSaveMessage = (
  moduleName = "Data"
) => `${moduleName} saved successfully.`;

export const getUpdateMessage = (
  moduleName = "Data"
) => `${moduleName} updated successfully.`;

export const getDeleteSuccessMessage = (
  moduleName = "Item"
) => `${moduleName} deleted successfully.`;

export const getRemoveSuccessMessage = (
  moduleName = "File"
) => `${moduleName} removed successfully.`;

// ==========================================================
// BACKWARD COMPATIBILITY
// ==========================================================

export const getUploadMessage = (
  config = {}
) => {

  const {
    images = false,
    pdf = false,
    video = false,
    audio = false,
    maxSize = "",
  } = config;

  const formats = [];

  if (images) formats.push("JPG", "PNG", "WEBP");
  if (pdf) formats.push("PDF");
  if (video) formats.push("MP4", "MOV", "WEBM");
  if (audio) formats.push("MP3", "WAV");

  return `Supported: ${formats.join(", ")}${maxSize ? ` • Max ${maxSize}` : ""}`;

};

export const getCreateMessage = (
  moduleName = "Item"
) => `${moduleName} created successfully.`;

export const getSuccessMessage = (
  moduleName = "Operation"
) => `${moduleName} completed successfully.`;

export const getErrorMessage = (
  moduleName = "Operation"
) => `${moduleName} failed. Please try again.`;

export const getLoadingMessage = (
  moduleName = "Data"
) => `Loading ${moduleName}...`;

export const getSavingMessage = (
  moduleName = "Data"
) => `Saving ${moduleName}...`;