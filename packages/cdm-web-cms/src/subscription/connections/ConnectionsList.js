import React, { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { Margin, Button, Zone, Row, Col, Label } from "cdm-ui-components";
import Datatable from "common/component/smartdatatable/Datatable";
import { ExternalLink } from "cdm-shared/component/Link";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { useHistory } from "react-router-dom";
import { formatDate } from "cdm-shared/utils/format";
import { GET_CONNECTIONS_QUERY } from "cdm-shared/GraphqlQueries";

// Constants
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_OPTIONS = [10,20,50,100];

//Connections search view
function ConnectionsList({ translate }) {
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
      connections: {
        items = [],
        totalCount = 0,
        pageInfo: { hasNextPage, hasPreviousPage } = {},
      } = {},
    } = {},
  } = useQuery(GET_CONNECTIONS_QUERY, {
    variables: {
      skip: pageNumber * pageSize,
      take: pageSize,
    },
  });

  const columns = useMemo(
    () => [
      {
        Header: translate("connections.table.id"),
        accessor: "id",
      },
      {
        Header: translate("connections.table.manufacturer"),
        accessor: (d) => (
          <ExternalLink href={`/update-manufacturer/${d.manufacturerId}`}>
            {d.manufacturerName}
          </ExternalLink>
        ),
      },
      {
        Header: translate("connections.table.connector"),
        accessor: (d) => (
          <ExternalLink href={`/update-connectors/${d.connectorId}`}>
            {d.connectorName}
          </ExternalLink>
        ),
      },
      {
        Header: translate("connections.table.status"),
        accessor: "status",
      },
      {
        Header: translate("connections.table.release_date"),
        accessor: "releaseDate",
        Cell: ({row}) => {
          return formatDate(row.values.releaseDate);
        },
      },
      {
        Header: translate("connections.table.actions"),
        id: "actions",
        accessor: (d) => (
          <ExternalLink href={`/update-connections/${d.id}`}>
            {translate(`connections.table.edit`)}
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
            {translate("connections.main.title")}
          </Label>
          {/* Create new product */}
          <Button
            small
            primary
            inline
            onClick={() => history.push(`/create-connections`)}
          >
            {`+ ${translate("connections.main.add")}`}
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
      />
    </Zone>
  );
}

export default withLocalization(ConnectionsList);
