import React, { useMemo } from "react";
import { isNil } from "lodash";
import Button from '@mui/material/Button';
import { GridFooterContainer } from '@mui/x-data-grid';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, IconButton, MenuItem, Select } from "@mui/material";
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import {withLocalization} from 'common/redux/hoc/withLocalization';

const DataGridFooter = ({
  pageSizeOptions,
  rowCount,
  pageSize,
  pageNumber,
  onPageChange,
  onRefresh,
  translate,
}) => {
  const isPrevBtnEnable = useMemo(() => pageNumber > 0, [pageNumber]);
  const isNextBtnEnable = useMemo(() => pageNumber < Math.ceil(rowCount / pageSize) - 1, [pageNumber, rowCount, pageSize]);
  const startRecord = useMemo(() => {
    if (rowCount === 0)
      return 0;
    else
      return pageNumber * pageSize + 1;
  }, [pageNumber, rowCount, pageSize]);
  const endRecord = useMemo(() => Math.min((pageNumber + 1) * pageSize, rowCount), [pageNumber, rowCount, pageSize]);

  return (
    <GridFooterContainer sx={{ border: "none", paddingX: 2 }}>
      {isNil(onRefresh) ? <span /> : (
        <Button
          color="primary"
          startIcon={<RefreshRoundedIcon />}
          onClick={() => onRefresh(pageNumber, pageSize)}
        >
          {translate('common.refresh')}
        </Button>
      )}
      <Box sx={{ display: 'flex', alignItems: "center", gap: 4 }}>
        <span>{translate('common.rowsPerPage')}:</span>
        <Select
          size="small"
          variant="standard"
          value={pageSize}
          label={pageSize}
          onChange={ev => onPageChange(pageNumber, ev.target.value)}
          disableUnderline
          sx={{
            ":before": {
              borderBottom: 0,
            },
            ".MuiSelect-select": {
              paddingBottom: "1px",
            }
          }}
        >
          {pageSizeOptions.map(el => <MenuItem key={el} value={el}>{el}</MenuItem>)}
        </Select>
        <span>{startRecord}–{endRecord} {translate("common.of")} {rowCount}</span>
        <Box sx={{ display: 'flex', alignItems: "center", gap: 1 }}>
          <IconButton
            size="small"
            disabled={!isPrevBtnEnable}
            onClick={() => onPageChange(pageNumber - 1, pageSize)}
            aria-label="prev page"
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            size="small"
            disabled={!isNextBtnEnable}
            onClick={() => onPageChange(pageNumber + 1, pageSize)}
            aria-label="next page"
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>
    </GridFooterContainer>
  );
};

export default withLocalization(DataGridFooter)
