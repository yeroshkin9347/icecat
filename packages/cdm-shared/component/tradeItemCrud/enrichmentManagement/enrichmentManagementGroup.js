import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Label,
  Margin,
} from "cdm-ui-components";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { ModalTitleStyled } from "../../styled/modal/ModalStyled";
import Table, { TableCellWithTooltip } from "cdm-shared/component/Table";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { TableActionsWrapper } from "../table/styles";
import { getRetailersAllLight } from "../../../services/retailer";
import { getTradeItemsByIds } from "../../../services/product";
import useLanguages from "cdm-shared/hook/useLanguages";
import { IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const EnrichmentManagementGroup = ({
  selectedEnrichment,
  onTradeItemUnmatched,
  setSelectedEnrichment,
  isCreating,
  onApply,
  onChange,
  onCancel,
}) => {
  const columnsCreating = [
    {
      id: "trade-item-title",
      Header: "Title",
      accessor: "title",
      Cell: TableCellWithTooltip,
    },
    {
      id: "trade-item-manufacturer-reference",
      Header: "Manufacturer Reference",
      accessor: "identities[0].tradeItemManufacturerCode",
      Cell: TableCellWithTooltip,
    },
    {
      id: "brand",
      Header: "Brand",
      accessor: "brandName",
      Cell: TableCellWithTooltip,
    },
    {
      id: "gtin",
      Header: "Gtin",
      accessor: "identities[0].gtin.value",
      Cell: TableCellWithTooltip,
    },
  ];
  const columnsEditing = [
    {
      id: "trade-item-title",
      Header: "Title",
      accessor: "title",
      Cell: TableCellWithTooltip,
    },
    {
      id: "trade-item-manufacturer-reference",
      Header: "Manufacturer Reference",
      accessor: "identities[0].tradeItemManufacturerCode",
      Cell: TableCellWithTooltip,
    },
    {
      id: "brand",
      Header: "Brand",
      accessor: "brandName",
      Cell: TableCellWithTooltip,
    },
    {
      id: "gtin",
      Header: "Gtin",
      accessor: "identities[0].gtin.value",
      Cell: TableCellWithTooltip,
    },
    {
      Header: "Actions",
      id: "actions",
      width: 100,
      Cell: ({ index }) => {
        return (
          <TableActionsWrapper>
            <IconButton
              color="error"
              size="large"
              aria-label="Remove"
              sx={{
                padding: 0.5,
              }}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                onTradeItemUnmatched(matchedItems[index].tradeItemId);
              }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </TableActionsWrapper>
        );
      },
    },
  ];

  const languageCodes = useLanguages();
  const [retailers, setRetailers] = useState([]);
  const [matchedItems, setmatchedItems] = useState([]);

  const fetchMatchedItems = () => {
    getTradeItemsByIds(
      selectedEnrichment.matchedTradeItems.map((i) => i.tradeItemId)
    ).then((res) => {
      setmatchedItems(res.data);
      if (isCreating) {
        setSelectedEnrichment((prev) => ({
          ...prev,
          matchedTradeItems: [
            {
              ...prev.matchedTradeItems[0],
              supplierId: res.data[0].manufacturerId,
            },
          ],
        }));
      }
    });
  };

  useEffect(() => {
    if (selectedEnrichment != null) {
      getRetailersAllLight().then((res) => {
        setRetailers(res.data);
      });
    }
    fetchMatchedItems();
  }, []);

  return (
    <>
      <ModalTitleStyled>{"Enrichment Management"}</ModalTitleStyled>
      <br />

      <Container fluid>
        <Row>
          {/* gtin */}
          <Col col>
            <Label>{"Retailer Name"}</Label>
            <Autocomplete
              autoComplete
              includeInputInList
              value={
                retailers.find(
                  (i) => i.name === selectedEnrichment.retailerName
                ) || null
              }
              onChange={(e, v) => {
                onChange("tradeItemRetailerId", v ? v.id : null);
                onChange("retailerId", v ? v.id : null);
                onChange("retailerName", v ? v.name : null);
              }}
              getOptionLabel={(o) => o.name || ""}
              options={retailers || []}
              filterOptions={createFilterOptions({
                matchFrom: "any",
                limit: 100,
                stringify: (o) => o.name,
              })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  className="form-field"
                  hiddenLabel
                  fullWidth
                />
              )}
            />
          </Col>

          {/* manufacturerCode */}
          <Col col>
            <Label>{"TradeItem Retailer Code (SKU)"}</Label>
            <TextField
              size="small"
              className="form-field"
              hiddenLabel
              fullWidth
              onChange={(e) => {
                onChange("tradeItemRetailerCode", e.target.value);
              }}
              value={selectedEnrichment.tradeItemRetailerCode}
              block
            />
          </Col>

          {/* language code */}
          <Col col>
            <Label>{"Language Code"}</Label>
            <Autocomplete
              autoComplete
              includeInputInList
              value={
                languageCodes.find(
                  (i) => i.code === selectedEnrichment.languageCode
                ) || null
              }
              onChange={(e, v) => {
                onChange("languageCode", v ? v.code : null);
              }}
              getOptionLabel={(o) => o.code || ""}
              options={languageCodes || []}
              filterOptions={createFilterOptions({
                matchFrom: "any",
                limit: 100,
                stringify: (o) => o.code,
              })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  className="form-field"
                  hiddenLabel
                  fullWidth
                />
              )}
            />
          </Col>
        </Row>

        {/*Matched trade items */}
        <Margin top={5} />
        <Row>
          <Col col>
            <Table
              columns={isCreating ? columnsCreating : columnsEditing}
              data={matchedItems || []}
              manual
              sortable={false}
              showFilters={false}
              showPagination={false}
              showPageSizeOptions={false}
              defaultPageSize={0}
            />
          </Col>
        </Row>

        {/* Actions buttons */}
        <Margin top={5} />
        <Row>
          <Col right col>
            <Stack spacing={2} direction="row" style={{ float: "right" }}>
              {/* Cancel */}
              <Button onClick={(e) => onCancel()}>{"Cancel"}</Button>

              {/* Apply */}
              <Button onClick={(e) => onApply()} noMargin variant="contained">
                {"Apply"}
              </Button>
            </Stack>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EnrichmentManagementGroup;
