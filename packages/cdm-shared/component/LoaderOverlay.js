import React from "react";
import { Loader } from "cdm-ui-components";
import Backdrop from "@mui/material/Backdrop";

const LoaderOverlay = () => {
  return (
    <Backdrop
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        zIndex: (theme) => theme.zIndex.drawer + 9999,
        width: '100%',
        height: '100%',
        position: 'fixed',
      }}
      open={open}
      onClick={() => {}}
    >
      <Loader />
    </Backdrop>
  );
};

export default LoaderOverlay;
