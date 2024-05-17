import React, { useEffect } from "react";
import get from "lodash/get";
import ReactGA from "react-ga";
import Menu from "./menu";
import withAuth from "cdm-shared/redux/hoc/withAuth";
import { allowUseAnalytics } from "common/utils/analytics";

const ProtectedRoutes = ({ children, user }) => {
  useEffect(() => {
    // analytics
    if (allowUseAnalytics() && user) {
      ReactGA.set({ dimension2: get(user, "sub") });
      ReactGA.set({ dimension3: get(user, "organizationName") });
    }
  }, [user]);

  return (
    <>
      <Menu />
      {children}
    </>
  );
};

export default withAuth(ProtectedRoutes);
