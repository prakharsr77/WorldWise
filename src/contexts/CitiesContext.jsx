import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const BASE_URL = "http://localhost:9000";

const CitiesContext = createContext({
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
  getCity: () => {},
  createCity: () => {},
  deleteCity: () => {},
});

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

const ACTION_TYPES = {
  LOADING: "loading",
  CITIES_LOADED: "citiesLoaded",
  CITY_LOADED: "cityLoaded",
  CITY_CREATED: "cityCreated",
  CITY_DELETED: "cityDeleted",
  REJECTED: "rejected",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.LOADING:
      return { ...state, isLoading: true };

    case ACTION_TYPES.CITIES_LOADED:
      return { ...state, cities: action.payload, isLoading: false };

    case ACTION_TYPES.CITY_LOADED:
      return { ...state, currentCity: action.payload, isLoading: false };

    case ACTION_TYPES.CITY_CREATED:
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        currentCity: action.payload,
      };

    case ACTION_TYPES.CITY_DELETED:
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
        currentCity: {},
      };

    case ACTION_TYPES.REJECTED:
      return { ...state, error: action.payload, isLoading: false };

    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: ACTION_TYPES.LOADING });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: ACTION_TYPES.CITIES_LOADED, payload: data });
      } catch {
        dispatch({
          type: ACTION_TYPES.REJECTED,
          payload: "There was an error loading cities...",
        });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;

      dispatch({ type: ACTION_TYPES.LOADING });
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: ACTION_TYPES.CITY_LOADED, payload: data });
      } catch {
        dispatch({
          type: ACTION_TYPES.REJECTED,
          payload: "There was an error loading the city...",
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: ACTION_TYPES.LOADING });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: ACTION_TYPES.CITY_CREATED, payload: data });
    } catch {
      dispatch({
        type: ACTION_TYPES.REJECTED,
        payload: "There was an error creating the city...",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: ACTION_TYPES.LOADING });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: ACTION_TYPES.CITY_DELETED, payload: id });
    } catch {
      dispatch({
        type: ACTION_TYPES.REJECTED,
        payload: "There was an error deleting the city...",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");

  return context;
}

export { CitiesProvider, useCities };
