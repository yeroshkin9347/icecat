import React, { Component } from "react";
import {
  Zone,
  DarkZone,
  Row,
  Col
} from "cdm-ui-components";
import { Box, Typography } from "@mui/material";
import PrimaryLoader from "cdm-shared/component/PrimaryLoader";
import { withLocalization } from "common/redux/hoc/withLocalization";
import Logo from "cdm-shared/component/Logo";
import Presentation from "./Presentation";

class MaintenancePage extends Component {

  render() {
    const { translate } = this.props;

    return (
      <Zone
        style={{ height: "100vh", overflow: "hidden" }}
        noPadding
        noShadow
        noRadius
      >
        <Row style={{ height: "100%" }}>
          <Col col style={{ height: "100%" }}>
            <Presentation>
              <Zone
                transparent
                noPadding
                noRadius
                style={{
                  maxWidth: "500px",
                  margin: "0 auto",
                  boxShadow: "0 0 40px 0 rgba(0, 0, 0, 0.5)",
                  borderRadius: "1em",
                  overflow: "hidden"
                }}
              >
                <DarkZone style={{ padding: "1.6em 1.6em" }} center noPadding>
                  <Logo />
                </DarkZone>
                <Zone left>
                  <Box mb={2} className="flex items-center justify-center">
                    <PrimaryLoader />
                  </Box>
                  <Typography variant="h5" component="h1" align="center">
                    {translate("maintenance.message.title")}
                  </Typography>
                  <Typography variant="body1" align="center" my={2}>
                    {translate("maintenance.message.subtitle")}
                  </Typography>
                </Zone>
              </Zone>
            </Presentation>
          </Col>
        </Row>
      </Zone>
    );
  }
}

export default withLocalization(MaintenancePage);