import React from "react";
import withAuth from "cdm-shared/redux/hoc/withAuth";

const ProtectedRoutes = ({ children }) => <>{children}</>;

export default withAuth(ProtectedRoutes);
