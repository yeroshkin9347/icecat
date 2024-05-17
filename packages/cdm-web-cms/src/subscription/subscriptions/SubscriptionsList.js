import React, { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { Margin, Button, Zone, Row, Col, Label } from "cdm-ui-components";
import Datatable from "common/component/smartdatatable/Datatable";
import { ExternalLink } from "cdm-shared/component/Link";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { useHistory } from "react-router-dom";
import { GET_SUBSCRIPTIONS_QUERY } from "cdm-shared/GraphqlQueries";

// Constants
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_OPTIONS = [10,20,50,100];

// subscription ~> offers search view
function SubscriptionsList({ translate }) {
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
      subscriptions: {
        items = [],
        totalCount = 0,
        pageInfo: { hasNextPage, hasPreviousPage } = {},
      } = {},
    } = {},
  } = useQuery(GET_SUBSCRIPTIONS_QUERY, {
    variables: {
      skip: pageNumber * pageSize,
      take: pageSize,
    },
  });

  const columns = useMemo(
    () => [
      {
        Header: translate("subscriptions.table.id"),
        accessor: "id",
      },
      {
        Header: translate("subscriptions.table.manufacturer"),
        accessor: (d) => (
          <ExternalLink href={`/update-manufacturer/${d.manufacturerId}`}>
            {d.manufacturerName}
          </ExternalLink>
        ),
      },
      {
        Header: translate("subscriptions.table.offer"),
        accessor: (d) => (
          <ExternalLink href={`/update-offers/${d.offerId}`}>
            {`OFFER-${d.offerId.substring(0, 2)}`}
          </ExternalLink>
        ),
      },
      {
        Header: translate("subscriptions.table.min_nb_of_trade_items"),
        accessor: "numberOfTradeItem.min",
      },
      {
        Header: translate("subscriptions.table.max_nb_of_trade_items"),
        accessor: "numberOfTradeItem.max",
      },
      {
        Header: translate("subscriptions.table.nb_of_connectors"),
        accessor: "numberOfConnector",
      },
      {
        Header: translate("subscriptions.table.actions"),
        id: "actions",
        accessor: (d) => (
          <ExternalLink href={`/update-subscriptions/${d.id}`}>
            Edit
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
            {translate("subscriptions.main.title")}
          </Label>
          {/* Create new product */}
          <Button
            small
            primary
            inline
            onClick={() => history.push(`/create-subscriptions`)}
          >
            {`+ ${translate("subscriptions.main.add")}`}
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

export default withLocalization(SubscriptionsList);
