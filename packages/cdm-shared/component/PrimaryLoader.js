import React from "react";
import chariot from "../assets/chariot_loader.gif";

const PrimaryLoader = props => (
  <img src={chariot} alt={`Loading...`} {...props} />
);

export default PrimaryLoader;
