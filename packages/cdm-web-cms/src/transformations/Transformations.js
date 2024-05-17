// Dependencies
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";

// Localization
import { withLocalization } from "../common/redux/hoc/withLocalization";

// Components
import { Col, Input, Row, Zone, Button } from "cdm-ui-components";
import StyledLink from "cdm-shared/component/Link";
import Datatable from "../common/component/new-datatable/Datatable";

// Service
import { GET_TRANSFORMATION_SET_CONNECTION } from "cdm-shared/apollo/graphql";

// Constants
const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE_OPTIONS = [20, 30];
const DEFAULT_FILTERS = {
  id: null,
  name: "",
};

// Util
const sortByToOrder = (sortBy) =>
  sortBy ? { [sortBy.id]: sortBy.desc ? "DESC" : "ASC" } : {};

// Export
const Transformations = ({ translate }) => {
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageNumber, setPageNumber] = useState(0);
  const [sortBy, setSortBy] = useState({
    id: "name",
    desc: false,
  });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const history = useHistory();

  const {
    loading,
    data: {
      get: {
        items = [],
        totalCount = 0,
        pageInfo: { hasNextPage, hasPreviousPage } = {},
      } = {},
    } = {},
    refetch,
  } = useQuery(GET_TRANSFORMATION_SET_CONNECTION, {
    variables: {
      skip: pageNumber * pageSize,
      take: pageSize,
      order: sortByToOrder(sortBy),
      ...((filters.id || filters.name) && {
        where: {
          and: [
            ...(!!filters.id
              ? [
                  {
                    id: {
                      eq: filters.id,
                    },
                  },
                ]
              : []),
            ...(!!filters.name
              ? [
                  {
                    name: {
                      contains: filters.name,
                    },
                  },
                ]
              : []),
          ],
        },
      }),
    },
    context: { clientName: "tradeitemtransformationmanagementservice" },
  });

  useEffect(() => {
    refetch();
  }, [pageNumber, pageSize, sortBy, filters]);

  const IdFilter = useMemo(() => {
    return (
      <Input
        block
        value={filters.id || ""}
        onChange={(e) => {
          const v = e.currentTarget.value;
          setFilters((f) => ({ ...f, id: v }));
        }}
      />
    );
  }, [filters.id]);

  const NameFilter = useMemo(() => {
    return (
      <Input
        block
        value={filters.name || ""}
        onChange={(e) => {
          const v = e.currentTarget.value;
          setFilters((f) => ({ ...f, name: v }));
        }}
      />
    );
  }, [filters.name]);

  const columns = useMemo(
    () => [
      {
        Header: translate("tradeItemTransformation.table.information"),
        columns: [
          {
            Header: translate("tradeItemTransformation.table.id"),
            accessor: "id",
            Filter: IdFilter,
          },
          {
            Header: translate("tradeItemTransformation.table.name"),
            accessor: "name",
            Filter: NameFilter,
          },
        ],
      },
      {
        Header: translate("tradeItemTransformation.table.actions"),
        columns: [
          {
            Header: " ",
            id: "actions",
            accessor: (d) => (
              <StyledLink to={`/transformation/${d.id}`}>Edit</StyledLink>
            ),
          },
        ],
      },
    ],
    [translate, IdFilter, NameFilter]
  );

  return (
    <>
      <Zone>
        <Row>
          <Col col>
            <div className="row mb-4">
              <div className="col">
                <Button
                  small
                  primary
                  inline
                  onClick={() => history.push(`/transformation`)}
                >
                  {`+ ${translate("transformation.main.createNew")}`}
                </Button>
              </div>
            </div>
            <Datatable
              loading={loading}
              columns={columns}
              data={items}
              total={totalCount}
              showPaginationTop={true}
              defaultSortBy={sortBy}
              setSortBy={(newSortBy) => {
                const updatedSortBy =
                  newSortBy.length > 0 ? newSortBy[0] : null;
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
          </Col>
        </Row>
      </Zone>
    </>
  );
};

export default withLocalization(Transformations);
