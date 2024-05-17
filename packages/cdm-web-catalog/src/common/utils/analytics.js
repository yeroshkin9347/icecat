import ReactGA from "react-ga";
import { CDM_ANALYTICS_TRACKING_ID } from "common/environment";

export function triggerAnalyticsEvent(category, action) {
  ReactGA.event({
    category,
    action
  });
}

export const allowUseAnalytics = () => !!CDM_ANALYTICS_TRACKING_ID;
