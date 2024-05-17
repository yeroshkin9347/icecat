import React from "react";
import styled from "styled-components";
import get from "lodash/get";
import {
  List,
  ListItem,
  Text,
  Tag,
  Icon,
  RoundedButton,
} from "cdm-ui-components";
import Link from "cdm-shared/component/Link";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { IMPORT_ERRORS_STEPS } from "./constants";

import { ic_cloud_download } from "react-icons-kit/md/ic_cloud_download";

const ContextualizedListItem = styled(ListItem)`
  padding-top: 0;
  padding-bottom: 0;
  padding-right: 0;
`;
const ContextualizedListItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
const ContextualizedLink = styled(Link)`
  display: inline-block;
  padding-top: 1.4rem;
  padding-bottom: 1.4rem;
  width: 100%;
`;

const ErrorsMenu = ({
  step,
  importId,
  translate,
  counters,
  exportMappingErrors,
  exportDataIssues,
}) => {
  return (
    <>
      <List stacked>
        {/* Mapping */}
        <ContextualizedListItem selected={step === IMPORT_ERRORS_STEPS.MAPPING}>
          <ContextualizedListItemWrapper>
            <ContextualizedLink
              to={`/import-reports/errors/${importId}/${IMPORT_ERRORS_STEPS.MAPPING}`}
            >
              <Text bold={step === IMPORT_ERRORS_STEPS.MAPPING}>
                {translate(`importReports.errors.mapping`)}
                {get(counters, "totalMappingErrors") > 0 && (
                  <Tag
                    inline
                    danger
                    style={{
                      float: "right",
                      fontWeight: "bold",
                      marginBottom: 0,
                    }}
                  >
                    {get(counters, "totalMappingErrors")}
                  </Tag>
                )}
              </Text>
            </ContextualizedLink>
            {get(counters, "totalMappingErrors") > 0 && (
              <RoundedButton
                primary
                small
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  exportMappingErrors();
                }}
              >
                <Icon icon={ic_cloud_download} size={12} />
              </RoundedButton>
            )}
          </ContextualizedListItemWrapper>
        </ContextualizedListItem>

        {/* Business rules */}
        <ContextualizedListItem
          selected={step === IMPORT_ERRORS_STEPS.BUSINESS_RULES}
        >
          <ContextualizedListItemWrapper>
            <ContextualizedLink
              to={`/import-reports/errors/${importId}/${IMPORT_ERRORS_STEPS.BUSINESS_RULES}`}
            >
              <Text bold={step === IMPORT_ERRORS_STEPS.BUSINESS_RULES}>
                {translate(`importReports.errors.businessRules`)}
                {get(counters, "totalBusinessRulesErrors") > 0 && (
                  <Tag
                    inline
                    danger
                    style={{ float: "right", fontWeight: "bold" }}
                  >
                    {get(counters, "totalBusinessRulesErrors")}
                  </Tag>
                )}
              </Text>
            </ContextualizedLink>
            {get(counters, "totalBusinessRulesErrors") > 0 && (
              <RoundedButton
                primary
                small
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  exportDataIssues();
                }}
              >
                <Icon icon={ic_cloud_download} size={12} />
              </RoundedButton>
            )}
          </ContextualizedListItemWrapper>
        </ContextualizedListItem>

        {/* Persistence */}
        <ContextualizedListItem
          selected={step === IMPORT_ERRORS_STEPS.PERSISTENCE}
        >
          <ContextualizedLink
            to={`/import-reports/errors/${importId}/${IMPORT_ERRORS_STEPS.PERSISTENCE}`}
          >
            <Text bold={step === IMPORT_ERRORS_STEPS.PERSISTENCE}>
              {translate(`importReports.errors.persistence`)}
              {get(counters, "totalPersistenceErrors") > 0 && (
                <Tag
                  inline
                  danger
                  style={{ float: "right", fontWeight: "bold" }}
                >
                  {get(counters, "totalPersistenceErrors")}
                </Tag>
              )}
            </Text>
          </ContextualizedLink>
        </ContextualizedListItem>
      </List>
    </>
  );
};

export default withLocalization(ErrorsMenu);
