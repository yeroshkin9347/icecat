import React from 'react'
import {Row, Col, Margin, Text, Button} from 'cdm-ui-components';
import Stack from '@mui/material/Stack';
import {withLocalization} from "common/redux/hoc/withLocalization";

const ExportRequestDeleteConfirmation = ({ onCancel, onConfirm, translate }) => {
  return (
    <div>
      <Row center>
        <Col center col>
          <Text center>
            {translate("exportRequests.table.deleteConfirmation")}
          </Text>
        </Col>
      </Row>
      <Margin top={4} />
      <Row>
        <Col right col>
          <Stack spacing={2} direction="row" style={{ float: "right" }}>
            <Button
              small
              onClick={(e) => {
                onCancel();
              }}
            >
              {translate("exportRequests.table.cancel")}
            </Button>

            <Button
              onClick={(e) => {
                onConfirm();
              }}
              small
              danger
            >
              {translate("exportRequests.table.confirm")}
            </Button>
          </Stack>
        </Col>
      </Row>
    </div>
  )
}

export default withLocalization(ExportRequestDeleteConfirmation);
