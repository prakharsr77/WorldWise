import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  user: {},
  login: () => {},
  logout: () => {},
});

const initialState = {
  user: null,
  isAuthenticated: false,
};

const ACTION_TYPES = {
  LOGIN: "login",
  LOGOUT: "logout",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.LOGIN:
      return { ...state, user: action.payload, isAuthenticated: true };

    case ACTION_TYPES.LOGOUT:
      return { ...state, user: null, isAuthenticated: false };

    default:
      throw new Error("Unknown action type");
  }
}

const FAKE_USER = {
  name: "Prakhar",
  email: "prakhar.sr77@gmail.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );
  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: ACTION_TYPES.LOGIN, payload: FAKE_USER });
    }
  }

  function logout() {
    dispatch({ type: ACTION_TYPES.LOGOUT });
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined)
    throw new Error("AuthContext was used outside the AuthProvider");

  return context;
}

export { AuthProvider, useAuth };
