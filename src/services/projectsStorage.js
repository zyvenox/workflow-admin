const STORAGE_KEY = "workflow_projects";

const defaultProjects = [
  {
    id: "project-1",
    name: "Website Redesign",
    client: "Acme GmbH",
    manager: "Emily Johnson",
    status: "in-progress",
    priority: "high",
    budget: 18500,
    deadline: "2026-10-28",
    progress: 72,
    description:
      "Complete redesign of the corporate website with a focus on performance and conversion.",
  },
  {
    id: "project-2",
    name: "Mobile Application",
    client: "NordTech",
    manager: "James Wilson",
    status: "review",
    priority: "high",
    budget: 32000,
    deadline: "2026-11-14",
    progress: 88,
    description:
      "Cross-platform mobile application for customer account management.",
  },
  {
    id: "project-3",
    name: "CRM Integration",
    client: "Berlin Works",
    manager: "Anna Schmidt",
    status: "completed",
    priority: "medium",
    budget: 14200,
    deadline: "2026-09-30",
    progress: 100,
    description:
      "Integration between internal sales tools and the central CRM platform.",
  },
  {
    id: "project-4",
    name: "Analytics Platform",
    client: "Nova Systems",
    manager: "Michael Brown",
    status: "planning",
    priority: "medium",
    budget: 24800,
    deadline: "2026-12-08",
    progress: 32,
    description:
      "Business intelligence dashboard for operational and financial reporting.",
  },
  {
    id: "project-5",
    name: "Customer Portal",
    client: "Rhein Digital",
    manager: "Sophie Martin",
    status: "in-progress",
    priority: "low",
    budget: 11800,
    deadline: "2026-11-02",
    progress: 61,
    description:
      "Self-service portal for customers to manage requests and documents.",
  },
  {
    id: "project-6",
    name: "Internal HR System",
    client: "Westline AG",
    manager: "Daniel Clark",
    status: "planning",
    priority: "high",
    budget: 27600,
    deadline: "2027-01-15",
    progress: 18,
    description:
      "Internal employee management system with leave and onboarding workflows.",
  },
];

const clone = (value) => {
  return JSON.parse(JSON.stringify(value));
};

const saveProjects = (projects) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(projects)
  );
};

const readProjects = () => {
  try {
    const storedValue =
      localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      const freshProjects =
        clone(defaultProjects);

      saveProjects(freshProjects);

      return freshProjects;
    }

    const parsedValue =
      JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      throw new Error(
        "Invalid projects storage format."
      );
    }

    return parsedValue;
  } catch {
    const freshProjects =
      clone(defaultProjects);

    saveProjects(freshProjects);

    return freshProjects;
  }
};

const simulateDelay = (duration = 250) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

export const getProjects = async () => {
  await simulateDelay();

  return clone(readProjects());
};

export const createProject = async (
  projectData
) => {
  await simulateDelay();

  const projects = readProjects();

  const newProject = {
    ...projectData,
    id: `project-${Date.now()}`,
  };

  const updatedProjects = [
    newProject,
    ...projects,
  ];

  saveProjects(updatedProjects);

  return clone(newProject);
};

export const updateProject = async (
  projectId,
  projectData
) => {
  await simulateDelay();

  const projects = readProjects();

  const projectExists = projects.some(
    (project) =>
      project.id === projectId
  );

  if (!projectExists) {
    throw new Error(
      "Project not found."
    );
  }

  const updatedProjects =
    projects.map((project) => {
      if (project.id !== projectId) {
        return project;
      }

      return {
        ...project,
        ...projectData,
        id: projectId,
      };
    });

  saveProjects(updatedProjects);

  const updatedProject =
    updatedProjects.find(
      (project) =>
        project.id === projectId
    );

  return clone(updatedProject);
};

export const deleteProject = async (
  projectId
) => {
  await simulateDelay();

  const projects = readProjects();

  const updatedProjects =
    projects.filter(
      (project) =>
        project.id !== projectId
    );

  if (
    updatedProjects.length ===
    projects.length
  ) {
    throw new Error(
      "Project not found."
    );
  }

  saveProjects(updatedProjects);

  return projectId;
};