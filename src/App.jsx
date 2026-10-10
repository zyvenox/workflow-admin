import { RouterProvider } from "react-router/dom";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ProjectsProvider } from "./context/ProjectsContext";
import { TicketsProvider } from "./context/TicketsContext";
import { NotificationsProvider } from "./context/NotificationsContext";

import "./styles/dark-overrides.css";

import router from "./router";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ProjectsProvider>
          <TicketsProvider>
            <NotificationsProvider>
              <RouterProvider router={router} />
            </NotificationsProvider>
          </TicketsProvider>
        </ProjectsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;