import Push from "push.js";

const DEFAULT_BROWSER_NOTIFICATION_OPTIONS = {
  icon: "/logo.png",
  timeout: 5000,
  onClick: () => {
    window.focus && window.focus();
  }
};

export const notifyBrowser = (title, body) => {
  Push.create(
    title,
    body
      ? { ...DEFAULT_BROWSER_NOTIFICATION_OPTIONS, body }
      : DEFAULT_BROWSER_NOTIFICATION_OPTIONS
  );
};
