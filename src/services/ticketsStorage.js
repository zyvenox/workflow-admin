const STORAGE_KEY = "workflow_tickets";

const defaultTickets = [
  {
    id: "ticket-1",
    title: "Login page does not load",
    requester: "Laura Weber",
    category: "technical",
    priority: "urgent",
    status: "open",
    assignee: "Emily Johnson",
    createdAt: "2026-10-02",
    description:
      "The customer reports that the login page keeps loading and never displays the form.",
  },
  {
    id: "ticket-2",
    title: "Invoice amount is incorrect",
    requester: "Mark Taylor",
    category: "billing",
    priority: "high",
    status: "in-progress",
    assignee: "James Wilson",
    createdAt: "2026-10-01",
    description:
      "The invoice total does not match the agreed subscription amount.",
  },
  {
    id: "ticket-3",
    title: "Unable to update profile",
    requester: "Sophie Martin",
    category: "account",
    priority: "medium",
    status: "waiting",
    assignee: "Anna Schmidt",
    createdAt: "2026-09-29",
    description:
      "The customer can open the profile page but cannot save updated information.",
  },
  {
    id: "ticket-4",
    title: "API response is delayed",
    requester: "Daniel Clark",
    category: "technical",
    priority: "high",
    status: "resolved",
    assignee: "Michael Brown",
    createdAt: "2026-09-28",
    description:
      "The reporting endpoint sometimes takes more than ten seconds to return data.",
  },
  {
    id: "ticket-5",
    title: "Request for account upgrade",
    requester: "Emma Davis",
    category: "account",
    priority: "low",
    status: "closed",
    assignee: "Sophie Martin",
    createdAt: "2026-09-25",
    description:
      "The customer requested an upgrade from the standard plan to the professional plan.",
  },
];

const clone = (value) => {
  return JSON.parse(JSON.stringify(value));
};

const saveTickets = (tickets) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(tickets)
  );
};

const readTickets = () => {
  try {
    const storedValue =
      localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      const freshTickets =
        clone(defaultTickets);

      saveTickets(freshTickets);

      return freshTickets;
    }

    const parsedValue =
      JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      throw new Error(
        "Invalid tickets storage format."
      );
    }

    return parsedValue;
  } catch {
    const freshTickets =
      clone(defaultTickets);

    saveTickets(freshTickets);

    return freshTickets;
  }
};

const simulateDelay = (duration = 250) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

export const getTickets = async () => {
  await simulateDelay();

  return clone(readTickets());
};

export const createTicket = async (
  ticketData
) => {
  await simulateDelay();

  const tickets = readTickets();

  const newTicket = {
    ...ticketData,
    id: `ticket-${Date.now()}`,
    createdAt:
      ticketData.createdAt ||
      new Date().toISOString().slice(0, 10),
  };

  const updatedTickets = [
    newTicket,
    ...tickets,
  ];

  saveTickets(updatedTickets);

  return clone(newTicket);
};

export const updateTicket = async (
  ticketId,
  ticketData
) => {
  await simulateDelay();

  const tickets = readTickets();

  const exists = tickets.some(
    (ticket) =>
      ticket.id === ticketId
  );

  if (!exists) {
    throw new Error(
      "Ticket not found."
    );
  }

  const updatedTickets =
    tickets.map((ticket) => {
      if (ticket.id !== ticketId) {
        return ticket;
      }

      return {
        ...ticket,
        ...ticketData,
        id: ticketId,
      };
    });

  saveTickets(updatedTickets);

  const updatedTicket =
    updatedTickets.find(
      (ticket) =>
        ticket.id === ticketId
    );

  return clone(updatedTicket);
};

export const deleteTicket = async (
  ticketId
) => {
  await simulateDelay();

  const tickets = readTickets();

  const updatedTickets =
    tickets.filter(
      (ticket) =>
        ticket.id !== ticketId
    );

  if (
    updatedTickets.length ===
    tickets.length
  ) {
    throw new Error(
      "Ticket not found."
    );
  }

  saveTickets(updatedTickets);

  return ticketId;
};