import {
  Navigate,
  createBrowserRouter,
} from "react-router";

import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Dashboard from "./pages/Dashboard/Page";
import Users from "./pages/Users/Page";
import UserDetails from "./pages/UserDetails/Page";
import CreateUser from "./pages/CreateUser/Page";
import Login from "./pages/Login/Page";
import Projects from "./pages/Projects/Page";
import Tickets from "./pages/Tickets/Page";
import Analytics from "./pages/Analytics/Page";
import Settings from "./pages/Settings/Page";
import Profile from "./pages/Profile/Page";
import Notifications from "./pages/Notifications/Page";

function PlaceholderPage({ title }) {
  return (
    <section
      style={{
        minHeight: "60vh",
        display: "grid",
        placeItems: "center",
        padding: "40px",
        color: "var(--text-primary)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            marginBottom: "8px",
            color: "var(--primary)",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Coming soon
        </p>

        <h1
          style={{
            margin: 0,
            color: "var(--text-primary)",
            fontSize: "34px",
            letterSpacing: "-0.04em",
          }}
        >
          {title}
        </h1>
      </div>
    </section>
  );
}

const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        Component: Layout,
        children: [
          {
            index: true,
            element: (
              <Navigate
                to="/dashboard"
                replace
              />
            ),
          },
          {
            path: "dashboard",
            Component: Dashboard,
          },
          {
            path: "users",
            Component: Users,
          },
          {
            path: "users/new",
            Component: CreateUser,
          },
          {
            path: "users/:userId",
            Component: UserDetails,
          },
          {
            path: "projects",
            Component: Projects,
          },
          {
            path: "tickets",
            Component: Tickets,
          },
          {
            path: "analytics",
            Component: Analytics,
          },
          {
            path: "settings",
            Component: Settings,
          },
          {
            path: "profile",
            Component: Profile,
          },
          {
            path: "notifications",
            Component: Notifications,
          },
          {
            path: "*",
            element: (
              <PlaceholderPage
                title="Page Not Found"
              />
            ),
          },
        ],
      },
    ],
  },
]);

export default router;