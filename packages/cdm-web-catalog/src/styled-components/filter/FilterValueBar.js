import React from "react";
import { isNil } from "lodash";
import { Box, Chip } from "@mui/material";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { Button } from "cdm-ui-components";
import styled from "styled-components";
import { isFilterValueNull } from "catalog/utils";

const TextButton = styled(Button)`
  padding: 0;
  height: auto;
  &:hover {
    text-decoration: underline;
  }
`;

class FilterValueBar extends React.Component {

  render() {
    const { filters, onRemoveFilter, onClearFilters, translate } = this.props;
    const isEmptyFilter = filters.every(({ value }) => isFilterValueNull(value));
    
    return (
      <Box mt={2} display="flex" alignItems="center" gap={1} flexWrap="wrap">
        {filters.map(({ label, value, key }) => isFilterValueNull(value) ? null : (
          <Chip
            key={`${key}_${value}`}
            size="small"
            label={`${label}: ${value}`}
            variant="outlined"
            onDelete={() => {
              onRemoveFilter(key);
            }}
          />
        ))}
        {!isNil(onClearFilters) && !isEmptyFilter && <TextButton light small onClick={onClearFilters}>{translate("catalog.products.clearFilters")}</TextButton>}
      </Box>
    );
  }
}

export default withLocalization(FilterValueBar);