import React from "react";
import get from "lodash/get";
import { Zone } from "cdm-ui-components";
import { CDM_BANNER_URI, CDM_RETAILER_BANNER_URI } from "common/environment";
import withUser from "cdm-shared/redux/hoc/withUser";

const Banner = ({ user }) => (
  <Zone noPadding transparent noShadow>
    <video
      autoPlay
      loop
      id="videobanner"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <source
        src={get(user, "retailerId") ? CDM_RETAILER_BANNER_URI : CDM_BANNER_URI}
        type="video/mp4"
      />
    </video>
  </Zone>
);

export default withUser(Banner);
