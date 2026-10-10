import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import {
  createTicket,
  deleteTicket,
  getTickets,
  updateTicket,
} from "../services/ticketsStorage";

const TicketsContext =
  createContext(undefined);

const initialState = {
  tickets: [],
  loading: true,
  error: "",
};

function ticketsReducer(
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
        tickets: action.payload,
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
        tickets: [
          action.payload,
          ...state.tickets,
        ],
      };

    case "UPDATE":
      return {
        ...state,
        tickets: state.tickets.map(
          (ticket) =>
            ticket.id ===
            action.payload.id
              ? action.payload
              : ticket
        ),
      };

    case "DELETE":
      return {
        ...state,
        tickets:
          state.tickets.filter(
            (ticket) =>
              ticket.id !==
              action.payload
          ),
      };

    default:
      return state;
  }
}

function TicketsProvider({
  children,
}) {
  const [state, dispatch] =
    useReducer(
      ticketsReducer,
      initialState
    );

  useEffect(() => {
    let isMounted = true;

    const loadTickets = async () => {
      dispatch({
        type: "LOAD_START",
      });

      try {
        const tickets =
          await getTickets();

        if (!isMounted) {
          return;
        }

        dispatch({
          type: "LOAD_SUCCESS",
          payload: tickets,
        });
      } catch {
        if (!isMounted) {
          return;
        }

        dispatch({
          type: "LOAD_ERROR",
          payload:
            "Unable to load tickets.",
        });
      }
    };

    loadTickets();

    return () => {
      isMounted = false;
    };
  }, []);

  const addTicket =
    useCallback(
      async (ticketData) => {
        const ticket =
          await createTicket(
            ticketData
          );

        dispatch({
          type: "CREATE",
          payload: ticket,
        });

        return ticket;
      },
      []
    );

  const editTicket =
    useCallback(
      async (
        ticketId,
        ticketData
      ) => {
        const ticket =
          await updateTicket(
            ticketId,
            ticketData
          );

        dispatch({
          type: "UPDATE",
          payload: ticket,
        });

        return ticket;
      },
      []
    );

  const removeTicket =
    useCallback(
      async (ticketId) => {
        const deletedId =
          await deleteTicket(
            ticketId
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
      tickets: state.tickets,
      loading: state.loading,
      error: state.error,
      addTicket,
      editTicket,
      removeTicket,
    }),
    [
      state.tickets,
      state.loading,
      state.error,
      addTicket,
      editTicket,
      removeTicket,
    ]
  );

  return (
    <TicketsContext.Provider
      value={value}
    >
      {children}
    </TicketsContext.Provider>
  );
}

function useTickets() {
  const context =
    useContext(
      TicketsContext
    );

  if (!context) {
    throw new Error(
      "useTickets must be used inside TicketsProvider."
    );
  }

  return context;
}

export {
  TicketsContext,
  TicketsProvider,
  useTickets,
};