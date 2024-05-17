import React, { useState, useCallback } from "react";
import CustomButton from "../common/layout/CustomButton";
import get from "lodash/get";
import { Margin, Row, Col, H5 } from "cdm-ui-components";
import {
  DivWrap,
  ContainerWrap,
  LabelWrap,
  DatePickerWrap,
} from "./styles";
import { PRIMARY } from "cdm-shared/component/color";
import { pollByManufacturerEntityId } from "cdm-shared/services/subscription";
import CustomToast from "../common/component/CustomToast";

function TriggerPollingForm({ translate, title, manufacturerEntityId }) {
  const [startPollingTimestamp, setStartPollingTimesta] = useState(null);
  const [endPollingTimestamp, setEndPollingTimesta] = useState(null);
  const [message, setMessage] = useState(null);

  const doPolling = useCallback(() => {
    pollByManufacturerEntityId(
      manufacturerEntityId,
      startPollingTimestamp,
      endPollingTimestamp
    )
      .then((res) => {
        const succMsg = {
          msgType: "success",
          message: "Trigger Polling Created Successfully",
        };
        setMessage(succMsg);
        setStartPollingTimesta(null)
        setEndPollingTimesta(null);
        setTimeout(() => {
          setMessage(null);
        }, 2000);
      })
      .catch((err) => {
        const errMsg = {
          msgType: "error",
          message: get(err, "response.data.ErrorMessage"),
        };
        setMessage(errMsg);
        setTimeout(() => {
          setMessage(null);
        }, 2000);

      });
  }, [manufacturerEntityId, startPollingTimestamp, endPollingTimestamp]);

  return (
    <>
      <CustomToast messageObject={message} />
      <ContainerWrap>
        <Row>
          <Col col={12}>
            <H5>{title}</H5>
            <DivWrap>
              <LabelWrap>
                {translate("manufacturer.add_edit.start_polling_timestamp")}
              </LabelWrap>
              <Margin left={4} />
              <DatePickerWrap
                onChange={(d) =>
                  setStartPollingTimesta(
                    d ? d.format("YYYY-MM-DD hh:mm:ss") : null
                  )
                }
                value={startPollingTimestamp}
              />
            </DivWrap>
            <DivWrap>
              <LabelWrap>
                {translate("manufacturer.add_edit.end_polling_timestamp")}
              </LabelWrap>
              <Margin left={4} />
              <DatePickerWrap
                onChange={(d) =>
                  setEndPollingTimesta(
                    d ? d.format("YYYY-MM-DD hh:mm:ss") : null
                  )
                }
                value={endPollingTimestamp}
              />
            </DivWrap>
            <Margin top={4} />
            <DivWrap style={{ float: "right" }}>
              <Margin left={2} />
              <CustomButton
                loader={false}
                onClick={doPolling}
                backgroundColor={PRIMARY}
                padding={`8px 10px`}
                title={translate("manufacturer.main.launch")}
              />
            </DivWrap>
          </Col>
        </Row>
      </ContainerWrap>
    </>
  );
}

export default TriggerPollingForm;
