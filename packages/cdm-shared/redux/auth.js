import dotProps from "dot-prop-immutable";
import { localStorageSetItem } from "../utils/localStorage";

const initialState = {
  user: null,
  auth: {
    token: null
  }
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case "AUTH_RECEIVE_TOKEN":
      localStorageSetItem("token", action.token);
      return dotProps.set(state, "auth.token", action.token);
    case "AUTH_RECEIVE_USER":
      localStorageSetItem("user", JSON.stringify(action.user));
      return dotProps.set(state, "user", action.user);
    case "AUTH_RESET":
      localStorageSetItem("token", null);
      localStorageSetItem("user", null);
      return Object.assign({}, initialState);
    default:
      return state;
  }
};

export default auth;
