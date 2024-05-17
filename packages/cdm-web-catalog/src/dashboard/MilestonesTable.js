import React, { useCallback, useEffect } from "react";
import { H4, Row, Col, Loader } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import withTheme from "cdm-shared/redux/hoc/withTheme";
import { formatDate } from "cdm-shared/utils/format";
import { useState } from "react";
import { getMilestones } from "cdm-shared/services/subscription";
import { getMilestonesDetails } from "cdm-shared/services/tradeItemEligibilityNetwork";
import { PrimaryLink } from "cdm-shared/component/Link";
import { GaugeCounter } from "cdm-ui-components";
import { Text } from 'cdm-ui-components'
import styled from "styled-components";
import { CdmDataGrid } from "cdm-shared/component/styled/datagrid";
import CustomFooterComponent from "./MilestonesTableFooter";

const SearchLink = styled(PrimaryLink)`
margin-top: 0.5rem;
display: block;
text-align: center;
`;

const MilestonesTable = ({translate, theme}) => {

  const [milestones, setMilestones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(0);
  
  const productsGaugeColor = (percentage) => {
    return percentage > 50
      ? theme.color.green
      : percentage > 25
      ? theme.color.primary
      : theme.color.secondary;
  }

  const getPercentage = (milestone) => {
    return (100 * (milestone.numberOfExportableWithWarningTradeItems + milestone.numberOfExportbaleTradeItems) / milestone.numberOfTotalTradeItems) || 0;
  }
  const loadMilestones = useCallback((pageNumber, pageSize) => {
    getPagedMilestones(pageNumber, pageSize);
  }, []);
  const getPagedMilestones = (pageNumber, pageSize) => {
    setIsLoading(true);

    const promise = getMilestones(pageNumber, pageSize);
    if (promise) {
      promise.then((response) => {
        const milestones = response.data?.results;
        const total = response.data?.total;
        const milestonesDetailsRequest = response.data?.results.map(({connectorId, collectionId}) => ({connectorId, collectionId}));
        getMilestonesDetails(milestonesDetailsRequest).then((response) => {
          const milestonesStatisticsData = response.data?.getStatisticsEntriesResponse.map(({connectorId, collectionId, numberOfExportableWithWarningTradeItems, numberOfExportbaleTradeItems, numberOfNotExportbaleTradeItems, numberOfTotalTradeItems}) => ({connectorId, collectionId, numberOfExportableWithWarningTradeItems, numberOfExportbaleTradeItems, numberOfNotExportbaleTradeItems, numberOfTotalTradeItems}));
          const combined = milestones.reduce(
            (acc, mainItem) => [
              ...acc,
              milestonesStatisticsData.reduce(
                (sAcc, sItem) =>
                (mainItem.connectorId === sItem.connectorId && mainItem.collectionId === sItem.collectionId)
                    ? { ...mainItem, ...sItem }
                    : sAcc,
                {}
              ),
            ],
            []
          );
          setMilestones({ total: total, results: combined });
          setIsLoading(false);
        });
      });
  }}

  useEffect(() => {
    setIsLoading(true);
    getPagedMilestones(pageNumber, pageSize);
      }, []);
  
  const columns = [
    {
      id:"progress",
      flex: 1/2,
      headerAlign: "right",
      align: "right",
      sortable: false,
      minWidth: 67,
      renderCell: (params) => {
        return (
          <Col col style={{ textAlign: "right", paddingLeft: 5, paddingRight: 0 }}>
            <GaugeCounter
              rounded
              percentage={getPercentage(params.row)}
              size={"26"}
              stroke={2}
              color={`rgb(${productsGaugeColor(getPercentage(params.row))})`}
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Text noMargin
                    small
                    bold
                    center>
                {getPercentage(params.row).toFixed(0)} %
              </Text>
            </GaugeCounter>
          </Col>
        );
      }
    },
    {
      headerName: translate("milestones.columns.collectionName"),
      field: "colectionName",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => params.row.collectionCode,
    },
    {
      headerName: translate("milestones.columns.connectorName"),
      field: "connectorName",
      flex: 1,
      headerAlign: "left",
      align: "left",
      valueGetter: (params) => params.row.connectorName,
    },
    {
      headerName: translate("milestones.columns.deadline"),
      field: "deadline",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => formatDate(params.row.deadline),
    },
    {
      headerName: translate("milestones.columns.total"),
      field: "total",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => params.row.numberOfTotalTradeItems,
      renderCell: (params) => {
        return (
          <SearchLink to={`/network-status?connectorId=${params.row.connectorId}&collectionId=${params.row.collectionId}`}>
            { params.row.numberOfTotalTradeItems }
          </SearchLink>
        );
      }
    },
    {
      headerName: translate("milestones.columns.exportable"),
      field: "completed",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => params.row.numberOfExportbaleTradeItems,
      renderCell: (params) => {
        return (
          <SearchLink to={`/network-status?connectorId=${params.row.connectorId}&collectionId=${params.row.collectionId}&tradeItemEligibilityStatus[0]=Exportable`}>
            { params.row.numberOfExportbaleTradeItems }
          </SearchLink>
        );
      }
    },
    {
      headerName: translate("milestones.columns.warning"),
      field: "warning",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => params.row.numberOfExportableWithWarningTradeItems,
      renderCell: (params) => {
        return (
            <SearchLink to={`/network-status?connectorId=${params.row.connectorId}&collectionId=${params.row.collectionId}&tradeItemEligibilityStatus[0]=ExportableWithWarning`}>
              { params.row.numberOfExportableWithWarningTradeItems }
            </SearchLink>
        );
      }
    },
    {
      headerName: translate("milestones.columns.rejected"),
      field: "rejected",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => params.row.numberOfNotExportbaleTradeItems,
      renderCell: (params) => {
          return (
              <SearchLink to={`/network-status?connectorId=${params.row.connectorId}&collectionId=${params.row.collectionId}&tradeItemEligibilityStatus[0]=NotExportable`}>
              { params.row.numberOfNotExportbaleTradeItems }
              </SearchLink>
          );
        }
    },
  ];

  return (
    <>
      <H4>{translate("milestones.title")}</H4>
      <Row>
        <Col col>
          {isLoading ? (
            <Loader />
          ) : (
            <CdmDataGrid
              rows={milestones.results ? milestones.results : []}
              getRowId={(row) => row.id}
              disableColumnMenu
              columns={columns}
              checkboxSelection={false}
              pageSizeOptions={[5, 10, 20, 30]}
              onPaginationModelChange={(params) => {
                setPageNumber(params.page);
                setPageSize(params.pageSize);
                getPagedMilestones(params.page, params.pageSize);
              }}
              onRefresh={({ page, pageSize }) => loadMilestones(page, pageSize)}
              rowSelection={false}
              paginationModel={{ page: pageNumber, pageSize: pageSize }}
              rowCount={milestones.total}
              paginationMode="server"
              slots={{
                footer: CustomFooterComponent,
              }}
              slotProps={{ 
                footer: { translate: translate, props: { pageNumber, pageSize, rowCount: milestones.total, onPageChange: loadMilestones, refresh: loadMilestones } } 
              }}
              sx={{
                ".MuiDataGrid-virtualScrollerContent": {
                  minHeight: "40px !important",
                },
                ".MuiDataGrid-cell": {
                  "&:focus": {
                    outline: "none",
                  },
                  "&:focus-within": {
                    outline: "none",
                  },
                }
              }}
            />
          )}
        </Col>
      </Row>
    </>
  );
}
export default withTheme(withLocalization(MilestonesTable));