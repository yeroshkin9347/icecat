import { localizeReducer } from "react-localize-redux";

const getInitialState = () => {
  return ({
    isLoading: false,
    loadedLocales: [],
  });
};

const localize = (state = getInitialState(), action) => {
  const localizeState = {
    ...state,
    ...localizeReducer(state, action),
  };
  
  switch (action.type) {
    case "LOADING_TRANSLATION_FILE_INIT":
      return {
        ...localizeState,
        isLoading: true,
      }
    case "LOADING_TRANSLATION_FILE_DONE":
      return {
        ...localizeState,
        isLoading: false,
        loadedLocales: [...state.loadedLocales, action.payload.locale],
      }
    default:
      return localizeState;
  } 
};

export default localize;

