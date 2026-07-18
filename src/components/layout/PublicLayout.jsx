import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
} from "react";
import { Outlet, useLocation } from "react-router-dom";
import api from "../../services/api";
import { AccessibilityProvider } from "../../context/AccessibilityContext";
import ScrollToTop from "./ScrollToTop";
import ScrollToTopButton from "./ScrollToTopButton";

const Navbar = lazy(() =>
  import("./Navbar")
);
const Footer = lazy(() =>
  import("./Footer")
);
const FloatingPopup = lazy(() =>
  import("./FloatingPopup")
);

const PublicLayout = () => {
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  /* ==========================================
      VISITOR COUNT
  ========================================== */
  const incrementVisitor =
    useCallback(async () => {
      if (
        typeof window ===
        "undefined"
      ) {
        return;
      }
      try {
        const visited =
          localStorage.getItem(
            "tih_visited"
          );
        if (visited) {
          return;
        }
        await api.post(
          "/visitors/increment"
        );
        localStorage.setItem(
          "tih_visited",
          "true"
        );
      } catch (error) {
        console.error(
          "Visitor count failed:",
          error
        );
      }
    }, []);

  useEffect(() => {
    incrementVisitor();
  }, [incrementVisitor]);

  return (
    <AccessibilityProvider>
      <div
        className="
          min-h-screen
          bg-base-100
          text-base-content
          flex
          flex-col
        "
      >
        <Suspense
          fallback={
            <div className="h-20 bg-base-100" />
          }
        >
          <Navbar />
        </Suspense>
        <main className="flex-1">
          <Outlet />
        </main>
        <ScrollToTopButton />
        {isHomepage && (
          <Suspense fallback={null}>
            <FloatingPopup />
          </Suspense>
        )}
        <Suspense
          fallback={
            <div className="h-32 bg-base-100" />
          }
        >
          <Footer />
        </Suspense>
      </div>
    </AccessibilityProvider>
  );
};

export default PublicLayout;