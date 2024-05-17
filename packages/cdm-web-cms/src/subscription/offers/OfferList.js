import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { Margin, Button, Zone, Row, Col, Label } from "cdm-ui-components";
import Datatable from "common/component/smartdatatable/Datatable";
import { ExternalLink } from "cdm-shared/component/Link";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { useHistory } from "react-router-dom";
import {
  getOfferDataList,
} from "cdm-shared/redux/selectors/subscription";
import { GET_OFFERS_QUERY } from "cdm-shared/GraphqlQueries";

// Constants
const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE_OPTIONS = [20, 30];

// subscription ~> offers search view
function OfferList({ translate }) {
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageNumber, setPageNumber] = useState(0);
  const [sortBy, setSortBy] = useState({
    id: "name",
    desc: false,
  });
  const offerlist = useSelector(getOfferDataList);
  const [offerlistdata, setOfferlistdata] = useState([]);
  
  const history = useHistory();
  const {
    loading,
    data: {
      offers: {
        items = [],
        totalCount = 0,
        pageInfo: { hasNextPage, hasPreviousPage } = {},
      } = {},
    } = {},
  } = useQuery(GET_OFFERS_QUERY, {
    variables: {
      skip: pageNumber * pageSize,
      take: pageSize,
    },
  });

  useEffect(() => {
    if (offerlist) {
      const list = offerlist.map((res)=>{
        return {
          ...res,
          name: res.name.values[0].value,
          description: res.description.values[0].value,
        };
      });
      setOfferlistdata(list);
    }
  }, [offerlist]);
  
  const columns = useMemo(
    () => [
      {
        Header: translate("offers.table.id"),
        accessor: "id",
      },
      {
        Header: translate("offers.table.order"),
        accessor: "order",
      },
      {
        Header: translate("offers.table.name"),
        accessor: "name",
      },
      {
        Header: translate("offers.table.description"),
        accessor: "description",
      },
      {
        Header: translate("offers.table.actions"),
        id: "actions",
        accessor: (d) => (
          <ExternalLink href={`/update-offers/${d.id}`}>Edit</ExternalLink>
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
            {translate("offers.main.title")}
          </Label>
          {/* Create new product */}
          <Button
            small
            primary
            inline
            onClick={() => history.push(`/create-offers`)}
          >
            {`+ ${translate("offers.main.add")}`}
          </Button>
        </Col>
      </Row>
      
      <Margin top={3} />
      {offerlistdata && (
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
      )}
    </Zone>
  );
}

export default withLocalization(OfferList);

