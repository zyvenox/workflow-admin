import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../services/projectsStorage";

const ProjectsContext =
  createContext(undefined);

const initialState = {
  projects: [],
  loading: true,
  error: "",
};

function projectsReducer(
  state,
  action
) {
  switch (action.type) {
    case "LOAD_START":
      return {
        ...state,
        loading: true,
        error: "",
      };

    case "LOAD_SUCCESS":
      return {
        projects: action.payload,
        loading: false,
        error: "",
      };

    case "LOAD_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "CREATE":
      return {
        ...state,
        projects: [
          action.payload,
          ...state.projects,
        ],
      };

    case "UPDATE":
      return {
        ...state,
        projects: state.projects.map(
          (project) =>
            project.id ===
            action.payload.id
              ? action.payload
              : project
        ),
      };

    case "DELETE":
      return {
        ...state,
        projects: state.projects.filter(
          (project) =>
            project.id !==
            action.payload
        ),
      };

    default:
      return state;
  }
}

function ProjectsProvider({
  children,
}) {
  const [state, dispatch] =
    useReducer(
      projectsReducer,
      initialState
    );

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      dispatch({
        type: "LOAD_START",
      });

      try {
        const projects =
          await getProjects();

        if (!isMounted) {
          return;
        }

        dispatch({
          type: "LOAD_SUCCESS",
          payload: projects,
        });
      } catch {
        if (!isMounted) {
          return;
        }

        dispatch({
          type: "LOAD_ERROR",
          payload:
            "Unable to load projects.",
        });
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const addProject =
    useCallback(
      async (projectData) => {
        const project =
          await createProject(
            projectData
          );

        dispatch({
          type: "CREATE",
          payload: project,
        });

        return project;
      },
      []
    );

  const editProject =
    useCallback(
      async (
        projectId,
        projectData
      ) => {
        const project =
          await updateProject(
            projectId,
            projectData
          );

        dispatch({
          type: "UPDATE",
          payload: project,
        });

        return project;
      },
      []
    );

  const removeProject =
    useCallback(
      async (projectId) => {
        const deletedId =
          await deleteProject(
            projectId
          );

        dispatch({
          type: "DELETE",
          payload: deletedId,
        });
      },
      []
    );

  const value = useMemo(
    () => ({
      projects: state.projects,
      loading: state.loading,
      error: state.error,
      addProject,
      editProject,
      removeProject,
    }),
    [
      state.projects,
      state.loading,
      state.error,
      addProject,
      editProject,
      removeProject,
    ]
  );

  return (
    <ProjectsContext.Provider
      value={value}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

function useProjects() {
  const context =
    useContext(
      ProjectsContext
    );

  if (!context) {
    throw new Error(
      "useProjects must be used inside ProjectsProvider."
    );
  }

  return context;
}

export {
  ProjectsContext,
  ProjectsProvider,
  useProjects,
};