import React, { useState, useEffect } from "react";
import get from "lodash/get";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { H5, P } from "cdm-ui-components";
import { getImportPersistenceErrors } from "cdm-shared/services/import";
import LoaderOverlay from "cdm-shared/component/LoaderOverlay";

const PersistenceErrors = ({ importId, translate }) => {
  // initialize reducer used for the component logic
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false)

  // componentDidMount do fetch mapping errors
  useEffect(() => {
    setLoading(true);
    getImportPersistenceErrors(importId, 0, 1, null, null).then(res =>
      setTotal(get(res, "data.total") || 0)
    ).finally(() => {
      setLoading(false);
    });
  }, [importId]);

  return (
    <>
      {loading && <LoaderOverlay />}

      <H5>{translate("importReports.errors.persistence")}</H5>

      {total > 0 && (
        <P lead>{translate("importReports.errors.persistenceErrors")}</P>
      )}

      {total === 0 && (
        <P lead>{translate("importReports.errors.noPersistenceErrors")}</P>
      )}
    </>
  );
};

export default withLocalization(PersistenceErrors);
