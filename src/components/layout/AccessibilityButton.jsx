import React, { memo } from "react";
import { FaUniversalAccess } from "react-icons/fa";

function AccessibilityButton({
  onClick,
  className = "",
  size = 20,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Open Accessibility Center"
      title="Accessibility"
      className={`
        btn
        btn-circle
        btn-primary

        shadow-lg

        transition-all
        duration-200

        hover:scale-105
        hover:shadow-xl

        active:scale-95

        focus:outline-none
        focus-visible:ring
        focus-visible:ring-primary
        focus-visible:ring-offset-2

        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:scale-100

        ${className}
      `}
    >
      <FaUniversalAccess
        size={size}
      />
    </button>
  );
}

export default memo(
  AccessibilityButton
);