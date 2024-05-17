import React from "react";
import size from "lodash/size";
import { Zone, Button } from "cdm-ui-components";
import PrimaryLoader from "cdm-shared/component/PrimaryLoader";

const LoadMore = ({
  loading,
  currentSize,
  results,
  total,
  filters,
  className,
  // functions
  search,
  // common functions
  translate
}) => {
  return (
    <Zone
      responsive
      noShadow
      center
      //Add this minHeight beacause loader stretch parent container
      style={{ minHeight: "180px" }}
      className={className}
    >
      {loading && currentSize > 0 && <PrimaryLoader />}

      {!loading && size(results) < total && (
        <Button onClick={e => search(filters, true)} shadow lg secondary>
          {translate("catalog.products.loadmore")}
        </Button>
      )}
    </Zone>
  );
};

export default LoadMore;
