import filter from "lodash/filter";

const initialState = [];

const notification = (state = initialState, action) => {
  switch (action.type) {
    case "CDM_NOTIFICATION_RECEIVED":
      return [action.notification, ...state];
    case "CDM_NOTIFICATION_REMOVE":
      return filter(state, n => n.id !== action.id);
    default:
      return state;
  }
};

export default notification;
