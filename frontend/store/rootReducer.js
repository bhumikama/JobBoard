import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

// Combine all reducers into a single reducer
const appReducer = combineReducers({
  auth: authReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
