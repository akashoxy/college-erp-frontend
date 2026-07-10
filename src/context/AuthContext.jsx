import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext();

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /* ============================
      LOAD USER
  ============================ */

  const loadUser =
    useCallback(() => {
      if (
        typeof window ===
        "undefined"
      ) {
        return;
      }

      try {
        const saved =
          localStorage.getItem(
            "user"
          );

        if (saved) {
          setUser(
            JSON.parse(saved)
          );
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(
          "Invalid user data:",
          error
        );

        localStorage.removeItem(
          "user"
        );

        localStorage.removeItem(
          "token"
        );

        setUser(null);
      }
    }, []);

  /* ============================
      INITIAL LOAD
  ============================ */

  useEffect(() => {
    loadUser();
    setLoading(false);
  }, [loadUser]);

  /* ============================
      SYNC BETWEEN TABS
  ============================ */

  useEffect(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    const handleStorage = (
      event
    ) => {
      if (
        !event.key ||
        event.key === "user" ||
        event.key === "token"
      ) {
        loadUser();
      }
    };

    const handleAuthChange =
      () => {
        loadUser();
      };

    window.addEventListener(
      "storage",
      handleStorage
    );

    window.addEventListener(
      "auth-change",
      handleAuthChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );

      window.removeEventListener(
        "auth-change",
        handleAuthChange
      );
    };
  }, [loadUser]);

  /* ============================
      LOGIN
  ============================ */

  const login =
    useCallback(
      (
        userData,
        token
      ) => {
        setUser(userData);

        localStorage.setItem(
          "user",
          JSON.stringify(
            userData
          )
        );

        if (token) {
          localStorage.setItem(
            "token",
            token
          );
        }

        window.dispatchEvent(
          new Event(
            "auth-change"
          )
        );
      },
      []
    );

  /* ============================
      UPDATE USER
  ============================ */

  const updateUser =
    useCallback(
      (
        updatedUser
      ) => {
        setUser(
          updatedUser
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            updatedUser
          )
        );

        window.dispatchEvent(
          new Event(
            "auth-change"
          )
        );
      },
      []
    );

  /* ============================
      LOGOUT
  ============================ */

  const logout =
    useCallback(() => {
      setUser(null);

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "token"
      );

      window.dispatchEvent(
        new Event(
          "auth-change"
        )
      );
    }, []);

  /* ============================
      CONTEXT VALUE
  ============================ */

  const value = useMemo(
    () => ({
      user,
      loading,

      login,
      logout,
      updateUser,
    }),
    [
      user,
      loading,
      login,
      logout,
      updateUser,
    ]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context =
    useContext(
      AuthContext
    );

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider."
    );
  }

  return context;
};