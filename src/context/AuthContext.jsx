import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AUTH_TOKEN_KEY =
  "workflow_access_token";

const AUTH_USER_KEY =
  "workflow_user";

const PROFILE_OVERRIDES_KEY =
  "workflow_profile_overrides";

const DEMO_MODE =
  import.meta.env.VITE_DEMO_MODE !== "false";

const PROFILE_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "companyName",
  "jobTitle",
  "bio",
];

const demoUser = {
  id: "demo-user",
  username: "demo",
  firstName: "Demo",
  lastName: "User",
  email: "demo@workflow.local",
  role: "admin",
  image: "",
};

const AuthContext =
  createContext(undefined);

function getProfileOverrides() {
  try {
    const storedValue =
      localStorage.getItem(
        PROFILE_OVERRIDES_KEY
      );

    if (!storedValue) {
      return {};
    }

    const parsedValue =
      JSON.parse(storedValue);

    if (
      !parsedValue ||
      typeof parsedValue !== "object" ||
      Array.isArray(parsedValue)
    ) {
      return {};
    }

    return Object.fromEntries(
      PROFILE_FIELDS
        .filter((field) =>
          Object.prototype.hasOwnProperty.call(
            parsedValue,
            field
          )
        )
        .map((field) => [
          field,
          parsedValue[field],
        ])
    );
  } catch {
    return {};
  }
}

function applyProfileOverrides(user) {
  if (!user) {
    return null;
  }

  return {
    ...user,
    ...getProfileOverrides(),
  };
}

function getStoredUser() {
  try {
    const storedUser =
      localStorage.getItem(
        AUTH_USER_KEY
      );

    if (!storedUser) {
      return null;
    }

    const parsedUser =
      JSON.parse(storedUser);

    if (
      !parsedUser ||
      typeof parsedUser !== "object" ||
      Array.isArray(parsedUser)
    ) {
      return null;
    }

    return applyProfileOverrides(
      parsedUser
    );
  } catch {
    return null;
  }
}

function getInitialUser() {
  const storedUser =
    getStoredUser();

  if (storedUser) {
    return storedUser;
  }

  if (DEMO_MODE) {
    return applyProfileOverrides(
      demoUser
    );
  }

  return null;
}

function AuthProvider({ children }) {
  const [user, setUser] =
    useState(getInitialUser);

  const [token, setToken] =
    useState(() =>
      localStorage.getItem(
        AUTH_TOKEN_KEY
      )
    );

  const [loading, setLoading] =
    useState(() =>
      Boolean(
        localStorage.getItem(
          AUTH_TOKEN_KEY
        )
      )
    );

  useEffect(() => {
    const storedToken =
      localStorage.getItem(
        AUTH_TOKEN_KEY
      );

    if (!storedToken) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadCurrentUser =
      async () => {
        try {
          const response =
            await fetch(
              "https://dummyjson.com/auth/me",
              {
                method: "GET",
                headers: {
                  Authorization:
                    `Bearer ${storedToken}`,
                },
              }
            );

          if (!response.ok) {
            throw new Error(
              "Invalid authentication token."
            );
          }

          const responseUser =
            await response.json();

          const currentUser =
            applyProfileOverrides(
              responseUser
            );

          if (!isMounted) {
            return;
          }

          setUser(currentUser);
          setToken(storedToken);

          localStorage.setItem(
            AUTH_USER_KEY,
            JSON.stringify(
              currentUser
            )
          );
        } catch {
          localStorage.removeItem(
            AUTH_TOKEN_KEY
          );

          localStorage.removeItem(
            AUTH_USER_KEY
          );

          if (!isMounted) {
            return;
          }

          setToken(null);

          setUser(
            DEMO_MODE
              ? applyProfileOverrides(
                  demoUser
                )
              : null
          );
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(
    async (credentials) => {
      const response =
        await fetch(
          "https://dummyjson.com/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              username:
                credentials.username,
              password:
                credentials.password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Login failed."
        );
      }

      const accessToken =
        data.accessToken ||
        data.token;

      if (!accessToken) {
        throw new Error(
          "Authentication token was not returned."
        );
      }

      const userData = {
        ...data,
      };

      delete userData.accessToken;
      delete userData.refreshToken;
      delete userData.token;

      const loggedInUser =
        applyProfileOverrides(
          userData
        );

      setToken(accessToken);
      setUser(loggedInUser);

      localStorage.setItem(
        AUTH_TOKEN_KEY,
        accessToken
      );

      localStorage.setItem(
        AUTH_USER_KEY,
        JSON.stringify(
          loggedInUser
        )
      );

      return loggedInUser;
    },
    []
  );

  const updateProfile =
    useCallback(
      async (profileData) => {
        const safeProfile = {};

        PROFILE_FIELDS.forEach(
          (field) => {
            if (
              Object.prototype.hasOwnProperty.call(
                profileData,
                field
              )
            ) {
              safeProfile[field] =
                typeof profileData[field] ===
                "string"
                  ? profileData[field].trim()
                  : profileData[field];
            }
          }
        );

        const updatedOverrides = {
          ...getProfileOverrides(),
          ...safeProfile,
        };

        localStorage.setItem(
          PROFILE_OVERRIDES_KEY,
          JSON.stringify(
            updatedOverrides
          )
        );

        const baseUser =
          user ||
          applyProfileOverrides(
            demoUser
          );

        const updatedUser = {
          ...baseUser,
          ...safeProfile,
        };

        setUser(updatedUser);

        localStorage.setItem(
          AUTH_USER_KEY,
          JSON.stringify(
            updatedUser
          )
        );

        return updatedUser;
      },
      [user]
    );

  const logout = useCallback(() => {
    localStorage.removeItem(
      AUTH_TOKEN_KEY
    );

    localStorage.removeItem(
      AUTH_USER_KEY
    );

    setToken(null);

    setUser(
      DEMO_MODE
        ? applyProfileOverrides(
            demoUser
          )
        : null
    );
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated:
        Boolean(user),
      isDemoMode: DEMO_MODE,
      isGuest:
        user?.id === "demo-user",
      login,
      logout,
      updateProfile,
    }),
    [
      user,
      token,
      loading,
      login,
      logout,
      updateProfile,
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

function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}

export {
  AuthContext,
  AuthProvider,
  useAuth,
};