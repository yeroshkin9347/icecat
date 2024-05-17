import { DefaultTheme } from "cdm-ui-components";
import {
  localStorageSetItem,
  localStorageGetItem,
} from "../utils/localStorage";

const getInitialState = () => (isCurrentThemeDark() ? DARK_THEME : LIGHT_THEME);

export const isCurrentThemeDark = () =>
  localStorageGetItem("current-theme") === "DARK";

const theme = (state = getInitialState(), action) => {
  switch (action.type) {
    case "MOD_THEME_SET":
      return action.theme;
    case "MOD_THEME_SWITCH_DARK":
      localStorageSetItem("current-theme", "DARK");
      return { ...DARK_THEME };
    case "MOD_THEME_SWITCH_LIGHT":
      localStorageSetItem("current-theme", "LIGHT");
      return { ...LIGHT_THEME };
    default:
      return state;
  }
};

export const LIGHT_THEME = {
  ...DefaultTheme,
  ...{
    body: {
      ...DefaultTheme.body,
      bg: "#fffff",
      color: "#050505",
    },
    color: {
      ...DefaultTheme.color,
      light: "247,248,249",
      white: "255,255,255",
      green: "48,222,167",
    },
    font: {
      ...DefaultTheme.font,
      family: "'Roboto', sans-serif",
      familyUrl: "https://fonts.googleapis.com/css?family=Roboto:400,500,800",
      size: "14px",
    },
    form: {
      ...DefaultTheme.form,
      color: "5,5,5",
      backgroundColor: "235,237,239",
    },
    border: {
      ...DefaultTheme.border,
      color: "228,230,235",
      radius: "8px",
    },
  },
};

export const DARK_THEME = {
  ...DefaultTheme,
  ...{
    body: {
      bg: "#1c1e2f",
      color: "#eef2f4",
    },
    color: {
      primary: "1,255,223", // 23,162,184 | 255,196,38 | 38,135,255
      secondary: "137,1,255",
      light: "34, 37, 55",
      white: "28, 30, 47",
      dark: "24,25,26",
      blue: "175, 200, 255",
      red: "255, 46, 93",
      yellow: "255, 225, 37",
      green: "175, 255, 177",
    },
    font: {
      family: "'Roboto', sans-serif",
      familyUrl: "https://fonts.googleapis.com/css?family=Roboto:400,500,800",
      size: "14px",
    },
    form: {
      color: "240, 243, 255",
      backgroundColor: "67, 75, 105",
    },
    border: {
      color: "56,62,92",
      radius: "8px",
    },
  },
};

export const CDM_THEME = {
  ...DefaultTheme,
  ...{
    body: {
      ...DefaultTheme.body,
      bg: "#2687ff",
      color: "#fff",
    },
    color: {
      ...DefaultTheme.color,
      light: "228,14,146",
      white: "38,135,255",
      green: "48,222,167",
      gray: "255, 158, 218",
    },
    font: {
      ...DefaultTheme.font,
      family: "'Roboto', sans-serif",
      familyUrl: "https://fonts.googleapis.com/css?family=Roboto:400,500,800",
      size: "14px",
    },
    form: {
      ...DefaultTheme.form,
      color: "5,5,5",
      backgroundColor: "228,14,146",
    },
    border: {
      ...DefaultTheme.border,
      color: "228,14,146",
      radius: "8px",
    },
  },
};

export default theme;
