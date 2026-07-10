// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";

// export default function ScrollToTop({
//   selector = "main",
//   behavior = "smooth",
// }) {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     if (
//       typeof window ===
//       "undefined"
//     ) {
//       return;
//     }

//     const container =
//       document.querySelector(
//         selector
//       );

//     if (
//       container &&
//       typeof container.scrollTo ===
//         "function"
//     ) {
//       container.scrollTo({
//         top: 0,
//         left: 0,
//         behavior,
//       });
//     } else {
//       window.scrollTo({
//         top: 0,
//         left: 0,
//         behavior,
//       });
//     }
//   }, [
//     pathname,
//     selector,
//     behavior,
//   ]);

//   return null;
// }

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Place this once, inside your <BrowserRouter>, above your <Routes>.
 * It has no visual output — it just watches the URL and scrolls
 * the window to the top every time the route (path) changes.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // "instant" avoids a visible scroll animation when switching pages
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}