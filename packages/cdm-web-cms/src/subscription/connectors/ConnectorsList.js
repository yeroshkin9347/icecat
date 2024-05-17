import React, { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { Margin, Button, Zone, Row, Col, Label, Icon } from "cdm-ui-components";
import Datatable from "common/component/smartdatatable/Datatable";
import { ExternalLink } from "cdm-shared/component/Link";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { useHistory } from "react-router-dom";
import { formatDate } from "cdm-shared/utils/format";
import { GET_CONNECTORS_QUERY } from "cdm-shared/GraphqlQueries";
import { ic_check_circle } from "react-icons-kit/md/ic_check_circle";
import { ic_cancel } from "react-icons-kit/md/ic_cancel";

// Constants
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_OPTIONS = [10,20,50,100];

// Subscription ~> Connectors search view
function ConnectorsList({ translate }) {
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageNumber, setPageNumber] = useState(0);
  const [sortBy, setSortBy] = useState({
    id: "name",
    desc: false,
  });
  
  const history = useHistory();
  const {
    loading,
    data: {
      connectors: {
        items = [],
        totalCount = 0,
        pageInfo: { hasNextPage, hasPreviousPage } = {},
      } = {},
    } = {},
  } = useQuery(GET_CONNECTORS_QUERY, {
    variables: {
      skip: pageNumber * pageSize,
      take: pageSize,
    },
  });
  
  const columns = useMemo(
    () => [
      {
        Header: translate("connectors.table.id"),
        accessor: "id",
      },
      {
        Header: translate("connectors.table.type"),
        accessor: "type",
      },
      {
        Header: translate("connectors.table.retailers"),
        accessor: (d) => (
          <ExternalLink href={`/update-retailer/${d.id}`}>
            {d.retailerName}
          </ExternalLink>
        ),
      },
      {
        Header: translate("connectors.table.target_market"),
        accessor: "targetMarketName",
      },
      {
        Header: translate("connectors.table.status"),
        accessor: "status",
      },
      {
        Header: translate("connectors.table.visibility"),
        accessor: "visibility",
      },
      {
        Header: translate("connectors.table.sent_by_manufacturer"),
        accessor: (d) => (
          <>
            {!!d.sentByManufacturer && (
              <Icon
                style={{ color: "green" }}
                size={20}
                icon={ic_check_circle}
              />
            )}
            {!!!d.sentByManufacturer && (
              <Icon style={{ color: "red" }}  size={20} icon={ic_cancel} />
            )}
          </>
        ),
      },
      {
        Header: translate("connectors.table.release_date"),
        accessor: "releaseDate",
        Cell: ({ row }) => {
          return formatDate(row.values.releaseDate);
        },
      },
      {
        Header: translate("connectors.table.actions"),
        id: "actions",
        accessor: (d) => (
          <ExternalLink href={`/update-connectors/${d.id}`}>
            {translate("connectors.table.edit")}
          </ExternalLink>
        ),
      },
    ],
    [translate]
  );
  
  return (
    <Zone>
      <Row>
        <Col
          col={12}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Label style={{ fontSize: 20 }}>
            {translate("connectors.main.title")}
          </Label>
          {/* Create new product */}
          <Button
            small
            primary
            inline
            onClick={() => history.push(`/create-connectors`)}
          >
            {`+ ${translate("connectors.main.add")}`}
          </Button>
        </Col>
      </Row>
      
      <Margin top={3} />
      <Datatable
        thClassname={"thead-styling"}
        loading={loading}
        columns={columns}
        data={items}
        total={totalCount}
        showPaginationBottom={true}
        defaultSortBy={sortBy}
        setSortBy={(newSortBy) => {
          const updatedSortBy = newSortBy.length > 0 ? newSortBy[0] : null;
          setPageNumber(0);
          setSortBy(updatedSortBy);
        }}
        onPageSizeChange={(newPageSize) => {
          setPageNumber(0);
          setPageSize(newPageSize);
        }}
        onPageChange={setPageNumber}
        pageSizeOptions={DEFAULT_PAGE_OPTIONS}
        pageSize={pageSize}
        page={pageNumber}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        noDataText={"no data"}
      />
    </Zone>
  );
}

export default withLocalization(ConnectorsList);
