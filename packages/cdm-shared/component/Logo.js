import React from "react";
import { Box } from "@mui/material";

const Logo = ({ size = 50, dark = false }) => {
  const darkLogo = "https://storage.gra.cloud.ovh.net/v1/AUTH_8f75d74f077b4b88b4aa7227d4ee5f6f/images_corpo/raw/icecat_hexagon_dark.svg";
  const lightLogo = "https://storage.gra.cloud.ovh.net/v1/AUTH_8f75d74f077b4b88b4aa7227d4ee5f6f/images_corpo/raw/icecat_hexagon_light.svg";
  const logoUrl = dark ? darkLogo : lightLogo;

  const logoProps = {
    style: {transform: 'scale(3.3)'},
    width: size,
    height: size,
  };

  return (
    <Box component="span"> 
      <object data={logoUrl} {...logoProps}>
        <img src={logoUrl} alt="" {...logoProps} />
      </object>
    </Box>
  );
}

export default Logo;
