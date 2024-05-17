import React, { useEffect, useReducer, useState } from "react";
import get from "lodash/get";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { H5, Input, Label, Row, Col, Button } from "cdm-ui-components";
import { getImportMappingErrors } from "cdm-shared/services/import";
import Table from "cdm-shared/component/Table";
import { updateUrl, paramObject } from "cdm-shared/utils/url";
import MappingError from "./MappingError";
import { getErrorLineColor } from "importReports/utils";
import { getLang } from "cdm-shared/redux/localization";
import styled from "styled-components";

const StyledButton = styled(Button)`
  margin-right: 0;
`;

// local reducer
// this hook is better than use state for complex data management (pagination, sort, etc)
function reducer(state, [type, payload]) {
  switch (type) {
    case "paginationUpdated":
      return {
        ...state,
        pageNumber: payload.pageNumber,
        pageSize: payload.pageSize
      };
    case "mappingErrorsUpdated":
      return {
        ...state,
        mappingErrors: payload.mappingErrors || [],
        total: payload.total || 0
      };
    case "filtersUpdated":
      return {
        ...state,
        gtin: payload.gtin === undefined ? state.gtin : payload.gtin,
        tradeItemManufacturerCode:
          payload.tradeItemManufacturerCode === undefined
            ? state.tradeItemManufacturerCode
            : payload.tradeItemManufacturerCode
      };
    default:
      return state;
  }
}

const initialState = {
  pageNumber: 0,
  pageSize: 20,
  mappingErrors: [],
  total: 0,
  gtin: null,
  tradeItemManufacturerCode: null
};

// Mapping errors component
// retrieves mapping errors for a given import id
// props: importId
const MappingErrors = ({ importId, translate }) => {
  // initialize reducer used for the component logic
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false)

  // fetch mapping errors
  const fetchMappingErrors = (
    importId,
    pageNumber,
    pageSize,
    gtin,
    tradeItemManufacturerCode
  ) => {
    const languageCode = getLang();
    
    dispatch(["paginationUpdated", { pageNumber, pageSize }]);
    if (gtin !== undefined && tradeItemManufacturerCode !== undefined)
      dispatch(["filtersUpdated", { gtin, tradeItemManufacturerCode }]);
    
    setLoading(true)
    getImportMappingErrors(
      importId,
      pageNumber,
      pageSize,
      gtin,
      tradeItemManufacturerCode,
      languageCode
    ).then(res => {
      dispatch([
        "mappingErrorsUpdated",
        {
          mappingErrors: get(res, "data.results"),
          total: get(res, "data.total")
        }
      ]);
      if (gtin !== undefined && tradeItemManufacturerCode !== undefined)
        updateUrl({ gtin, tradeItemManufacturerCode });
    }).finally(() => {
      setLoading(false);
    });
  };

  // componentDidMount do fetch mapping errors
  useEffect(() => {
    const urlFilters = paramObject();
    fetchMappingErrors(
      importId,
      initialState.pageNumber,
      initialState.pageSize,
      get(urlFilters, "gtin") || null,
      get(urlFilters, "tradeItemManufacturerCode") || null
    );
  }, [importId]);

  return (
    <>
      <H5>{translate("importReports.errors.mapping")}</H5>

      {/* Filters */}
      <Row>
        <Col col={3}>
          <Label block>{translate("importReports.errors.gtin")}</Label>
          <Input
            onChange={e =>
              fetchMappingErrors(
                importId,
                state.pageNumber,
                state.pageSize,
                e.currentTarget.value,
                state.tradeItemManufacturerCode
              )
            }
            value={state.gtin || ""}
            block
            sm
          />
        </Col>

        <Col col={3}>
          <Label block>
            {translate("importReports.errors.productManufacturerCode")}
          </Label>
          <Input
            value={state.tradeItemManufacturerCode || ""}
            onChange={e =>
              fetchMappingErrors(
                importId,
                state.pageNumber,
                state.pageSize,
                state.gtin,
                e.currentTarget.value
              )
            }
            block
            sm
          />
        </Col>

        <Col col={6} right>
          <Label block>&nbsp;</Label>
          <StyledButton
            onClick={e => {
              dispatch([
                "filtersUpdated",
                { gtin: null, tradeItemManufacturerCode: null }
              ]);
              fetchMappingErrors(importId, state.pageNumber, state.pageSize);
            }}
            secondary
            small
          >
            {translate("importReports.errors.removeFilters")}
          </StyledButton>
        </Col>
      </Row>

      {/* Results */}
      <br />
      <Row>
        <Col col>
          <Table
            loading={loading}
            columns={[
              {
                expander: true,
                Header: () => <strong>&nbsp;</strong>,
                width: 65,
                Expander: ({ isExpanded, ...rest }) => (
                  <div>
                    {isExpanded ? <span>&#x2299;</span> : <span>&#x2295;</span>}
                  </div>
                ),
                style: {
                  cursor: "pointer",
                  fontSize: 25,
                  padding: "0",
                  textAlign: "center",
                  userSelect: "none"
                }
              },
              {
                Header: translate("importReports.errors.gtin"),
                className: "text-center",
                accessor: "key.gtin"
              },
              {
                Header: translate(
                  "importReports.errors.productManufacturerCode"
                ),
                className: "text-center",
                accessor: "key.tradeItemManufacturerCode"
              }
            ]}
            manual
            sortable={false}
            onPageSizeChange={size =>
              fetchMappingErrors(importId, state.pageNumber, size)
            }
            onPageChange={page =>
              fetchMappingErrors(importId, page, state.pageSize)
            }
            pageSizeOptions={[20, 50, 100, 200, 500]}
            page={state.pageNumber}
            pages={Math.round(state.total / state.pageSize)}
            pageSize={state.pageSize}
            data={state.mappingErrors}
            showPaginationTop={true}
            SubComponent={v => (
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: getErrorLineColor()
                }}
              >
                <MappingError
                  mappingError={state.mappingErrors[v.row._index]}
                  translate={translate}
                />
              </div>
            )}
          />
        </Col>
      </Row>
    </>
  );
};

export default withLocalization(MappingErrors);
