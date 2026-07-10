import { Link } from "react-router-dom";
import {
  FaDatabase,
  FaExclamationTriangle,
  FaLock,
  FaSearch,
  FaServer,
  FaWifi,
} from "react-icons/fa";

const PAGE_STATES = {
  empty: {
    icon: (
      <FaDatabase className="text-6xl text-info" />
    ),
    title: "No Data Available",
    message:
      "This content has not been added yet.",
  },

  error: {
    icon: (
      <FaExclamationTriangle className="text-6xl text-error" />
    ),
    title: "Something Went Wrong",
    message:
      "Unable to load data from the server.",
  },

  server: {
    icon: (
      <FaServer className="text-6xl text-warning" />
    ),
    title: "Server Unavailable",
    message:
      "The backend server is currently offline.",
  },

  offline: {
    icon: (
      <FaWifi className="text-6xl text-warning" />
    ),
    title: "No Internet Connection",
    message:
      "Please check your internet connection.",
  },

  unauthorized: {
    icon: (
      <FaLock className="text-6xl text-error" />
    ),
    title: "Unauthorized",
    message:
      "Please login to continue.",
  },

  forbidden: {
    icon: (
      <FaLock className="text-6xl text-error" />
    ),
    title: "Access Denied",
    message:
      "You don't have permission to access this page.",
  },

  notfound: {
    icon: (
      <FaSearch className="text-6xl text-primary" />
    ),
    title: "404",
    message:
      "The page you're looking for doesn't exist.",
  },
};

export default function PageState({
  type = "loading",
  title,
  message,
  retry,
  icon,
  children,
}) {
  if (type === "loading") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>

        <p className="mt-4 text-base-content/70">
          Loading...
        </p>
      </div>
    );
  }

  const state =
    PAGE_STATES[type] ??
    PAGE_STATES.error;

  const handleRefresh = () => {
    if (
      typeof window !==
      "undefined"
    ) {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-box bg-base-100 shadow-lg border border-base-300 p-8 text-center">

        <div className="flex justify-center mb-6">
          {icon || state.icon}
        </div>

        <h1 className="text-3xl font-bold">
          {title || state.title}
        </h1>

        <p className="mt-4 text-base-content/70">
          {message ||
            state.message}
        </p>

        {children && (
          <div className="mt-6">
            {children}
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">

          {retry && (
            <button
              onClick={retry}
              className="btn btn-primary"
            >
              Retry
            </button>
          )}

          <button
            onClick={
              handleRefresh
            }
            className="btn btn-outline"
          >
            Refresh
          </button>

          <Link
            to="/"
            className="btn btn-secondary"
          >
            Go Home
          </Link>

        </div>

      </div>
    </div>
  );
}