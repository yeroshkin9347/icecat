import React from "react";
import { RoundedButton } from "cdm-ui-components";
import { exportEligibilityNetworkForManufacturer } from "cdm-shared/services/tradeItemEligibilityNetwork";
import fileDownload from "js-file-download";
import { IconButton } from "@mui/material";
import { Delete as DeleteIcon, Download as DownloadIcon } from "@mui/icons-material";
import { formatDate } from 'cdm-shared/utils/date';

function ManufacturerEligibilityNetwordActions({
  filters,
  // functions
  dispatch,
}) {
  return (
    <>
      {/* Clear filter */}
      <IconButton
        color="error"
        size="large"
        aria-label="Clear filters"
        sx={{
          padding: 0.5,
          marginRight: 1,
        }}
        onClick={e => dispatch({ type: "resetFilters" })}

      >
        <DeleteIcon fontSize="inherit" />
      </IconButton>

      {/* Export results */}
      <RoundedButton
        primary
        noMargin
        onClick={() => {
          dispatch({ type: "setLoading", value: true });
          exportEligibilityNetworkForManufacturer(filters)
            .then(res => {
              fileDownload(res.data, `network_${formatDate(new Date(), "YYYYMMDD_HHmm")}.xlsx`);
              dispatch({ type: "setLoading", value: false });
            })
            .catch(() => dispatch({ type: "setLoading", value: false }));
        }}
      >
        <DownloadIcon fontSize="inherit" />
      </RoundedButton>
    </>
  );
}

export default ManufacturerEligibilityNetwordActions;
