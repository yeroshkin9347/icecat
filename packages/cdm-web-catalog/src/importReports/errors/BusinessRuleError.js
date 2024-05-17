import React, { useState } from "react";
import styled from "styled-components";
import { ic_keyboard_arrow_down } from "react-icons-kit/md/ic_keyboard_arrow_down";
import { ic_keyboard_arrow_right } from "react-icons-kit/md/ic_keyboard_arrow_right";
import get from "lodash/get";
import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import { Row, Col, Icon, Text, P, Tooltip, Padding } from "cdm-ui-components";

const BusinessRuleDescription = styled(P)`
  white-space: pre-wrap;
  text-align: left;
`;

const BusinessRuleSetNode = ({ businessRuleSet }) => {
  const rootKey = `${get(this, "props.rootKey", "")}.brn`;
  const [opened, setOpened] = useState(false);

  if (!businessRuleSet || isEmpty(businessRuleSet) || get(businessRuleSet, "success") == true) return <div />;

  const businessRulesSetsChildrenExist = !isEmpty(
    get(businessRuleSet, "businessRuleEvaluationResults", [])
  );

  return (
    <Padding left={3}>
      <div
        onClick={() => setOpened(x => !x)}
        style={{
          cursor: businessRulesSetsChildrenExist ? "pointer" : "default"
        }}
      >
        <Col col>
          {businessRulesSetsChildrenExist && (
            <Icon
              size={16}
              icon={opened ? ic_keyboard_arrow_down : ic_keyboard_arrow_right}
            />
          )}

          {/* Name */}
          <Text small inline>
            {get(businessRuleSet, "shortDescription") ||
              get(businessRuleSet, "name")}
          </Text>

          {/* Description */}
          {get(businessRuleSet, "description") && (
            <Tooltip
              interactive
              html={
                <BusinessRuleDescription>
                  {get(businessRuleSet, "description")}
                </BusinessRuleDescription>
              }
            >
            </Tooltip>
          )}
        </Col>
      </div>

      {map(
          get(businessRuleSet, "businessRuleSetEvaluationResults", []),
          (businessRuleSet, businessRuleSetKey) => (
            <BusinessRuleSetNode
              key={`${rootKey}.brs.${businessRuleSetKey}`}
              rootKey={`${rootKey}.brs.${businessRuleSetKey}`}
              businessRuleSet={businessRuleSet}
            />
          )
        )}

      {opened &&
        map(
          get(businessRuleSet, "businessRuleEvaluationResults", []),
          (businessRuleSet, businessRuleSetKey) => (
            <BusinessRuleSetNode
              key={`${rootKey}.brs.${businessRuleSetKey}`}
              rootKey={`${rootKey}.brs.${businessRuleSetKey}`}
              businessRuleSet={businessRuleSet}
            />
          )
        )}
    </Padding>
  );
};

// entry point component
// calls a recursive BusinessRuleSetNode component
const BusinessRuleError = ({ businessRuleError, translate }) => {
  return (
    <>
      <Row>
        {map(get(businessRuleError, "values"), (evaluationResult, i) => (
          <Col key={`evaluation-result-${i}`} col={6}>
            <BusinessRuleSetNode
              rootKey={`evaluation-result-${i}-`}
              businessRuleSet={evaluationResult}
            />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default BusinessRuleError;
