import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import Sticky from "react-stickynode";
import { withLocalization } from "common/redux/hoc/withLocalization";
import MappingErrors from "./MappingErrors";
import BusinessRulesErrors from "./BusinessRulesErrors";
import PersistenceErrors from "./PersistenceErrors";
import { Row, Col, Button } from "cdm-ui-components";
import LoaderFixed from "cdm-shared/component/LoaderFixed";
import { IMPORT_ERRORS_STEPS } from "./constants";
import ErrorsMenu from "./ErrorsMenu";
import {
  exportDataIssues,
  exportMappingErrors,
  getImportBusinessRulesErrors,
  getImportMappingErrors,
  getImportPersistenceErrors,
} from "cdm-shared/services/import";
import { paramObject } from "cdm-shared/utils/url";
import { get } from "lodash";
import fileDownload from "js-file-download";
import LoaderOverlay from "cdm-shared/component/LoaderOverlay";
import moment from "moment";
import { getLang } from "cdm-shared/redux/localization";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { SinglePageLayout } from "styled-components/layout";

const StyledButton = styled(Button)`
  margin-right: 0;
`;

const countersState = {
  totalMappingErrors: 0,
  totalBusinessRulesErrors: 0,
  totalPersistenceErrors: 0,
};

const ImportErrors = (props) => {
  // state keeps the counters
  const [counters, setCounters] = useState(countersState);

  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [exportLoading, setExportLoading] = useState(false);
  const { match, translate } = props;

  const step = parseInt(match.params.step || IMPORT_ERRORS_STEPS.MAPPING);
  const importId = match.params.importId;

  const exportMappingErrorsHandler = () => {
    const urlFilters = paramObject();
    setExportLoading(true);
    const languageCode = getLang();
    exportMappingErrors(
      importId,
      get(urlFilters, "gtin"),
      get(urlFilters, "tradeItemManufacturerCode"),
      languageCode
    )
      .then((res) => {
        fileDownload(
          res.data,
          `mapping_errors_${moment().format("YYYYMMDDHHmmss")}_${languageCode}.xlsx`
        );
      })
      .finally(() => setExportLoading(false));
  };

  const exportDataIssuesHandler = () => {
    const languageCode = getLang();
    const urlFilters = paramObject();
    setExportLoading(true);
    exportDataIssues(
      importId,
      get(urlFilters, "gtin"),
      get(urlFilters, "tradeItemManufacturerCode"),
      languageCode
    )
      .then((res) => {
        fileDownload(
          res.data,
          `data_issues_${moment().format("YYYYMMDDHHmmss")}_${languageCode}.csv`
        );
        setExportLoading(false);
      })
      .finally(() => setExportLoading(false));
  };

  // load errors counter
  useEffect(() => {
    const languageCode = getLang();
    const mappingsPromise = getImportMappingErrors(importId, 0, 1, null, null, languageCode);
    const businessRulesPromise = getImportBusinessRulesErrors(
      importId,
      0,
      1,
      languageCode,
    );
    const persistencePromise = getImportPersistenceErrors(importId, 0, 1);
    setLoading(true);
    Promise.all([mappingsPromise, businessRulesPromise, persistencePromise])
      .then((promisesResults) => {
        setCounters(
          Object.assign({}, countersState, {
            totalMappingErrors: get(promisesResults, "[0].data.total") || 0,
            totalBusinessRulesErrors:
              get(promisesResults, "[1].data.total") || 0,
            totalPersistenceErrors: get(promisesResults, "[2].data.total") || 0,
          })
        );
      })
      .finally(() => setLoading(false));
  }, [importId]);

  return (
    <>
      {loading && <LoaderFixed />}
      {exportLoading && <LoaderOverlay />}

      <SinglePageLayout
        title={translate("importReports.meta.title")}
        subtitle={translate("importReports.meta.subtitle")}
        breadcrumbs={[
          { title: translate("header.nav.home"), route: "/" },
          { title: translate("importReports.meta.title"), route: "/import-reports/all" },
          { title: translate("importReports.meta.errors") }
        ]}
        rightSideItems={[
          <StyledButton
            onClick={() => {
              history.push("/import-reports/all");
            }}
            primary
            small
          >
            {translate("importReports.links.all")}
          </StyledButton>
        ]}
      >
        <Row>
          {/* Menu */}
          <Col col={3}>
            <Sticky top={100}>
              <ErrorsMenu
                step={step}
                importId={importId}
                counters={counters}
                setLoading={setLoading}
                exportMappingErrors={exportMappingErrorsHandler}
                exportDataIssues={exportDataIssuesHandler}
              />
            </Sticky>
          </Col>

          {/* Nested content */}
          <Col col={9}>
            {step === IMPORT_ERRORS_STEPS.MAPPING && (
              <MappingErrors importId={importId} />
            )}

            {step === IMPORT_ERRORS_STEPS.BUSINESS_RULES && (
              <BusinessRulesErrors importId={importId} />
            )}

            {step === IMPORT_ERRORS_STEPS.PERSISTENCE && (
              <PersistenceErrors importId={importId} />
            )}
          </Col>
        </Row>
      </SinglePageLayout>
    </>
  );
};

export default withRouter(withLocalization(ImportErrors));
