import React, { createContext, useReducer, ReactNode } from "react";

// Define the user info type
export type UserInfo = {
  _id?: string;
  name: string;
  email: string;
  token: string;
  isAdmin: boolean;
  role: string;
};

// Define the global state type
type AppState = {
  userInfo?: UserInfo;
};

// Initial state with user info from localStorage
const initialState: AppState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")!)
    : undefined, // Use undefined instead of null
};

// Define the action types
type Action =
  | { type: "USER_SIGNIN"; payload: UserInfo }
  | { type: "USER_SIGNOUT" };

// Reducer function
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload };
    case "USER_SIGNOUT":
      return { userInfo: undefined };
    default:
      return state;
  }
}

const defaultDispatch: React.Dispatch<Action> = () => initialState;

const Store = createContext({
  state: initialState,
  dispatch: defaultDispatch,
});

// StoreProvider component
function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
}

export { Store, StoreProvider };
