import filter from "lodash/filter";
import findIndex from "lodash/findIndex";
import slice from "lodash/slice";

const initialState = [];
const CDM_MESSAGE_MAX_SIZE = 10;

const message = (state = initialState, action) => {
  switch (action.type) {
    case "CDM_MESSAGE_RECEIVED":
      return [action.message, ...state];
    case "CDM_MESSAGES_RECEIVED":
      return [...action.messages];
    case "CDM_MESSAGE_REMOVE":
      return filter(state, n => n[action.key] !== action.value);
    case "CDM_MESSAGE_UPDATE":
      const idx = findIndex(state, n => n.id === action.id);
      if (idx === -1) return state;
      return [
        ...slice(state, 0, idx),
        { ...state[idx], [action.key]: action.value },
        ...slice(state, idx + 1)
      ];
    default:
      return state;
  }
};

export { CDM_MESSAGE_MAX_SIZE };
export default message;
