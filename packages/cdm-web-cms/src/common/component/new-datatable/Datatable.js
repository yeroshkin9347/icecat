import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import map from "lodash/map";
import { useTable, useSortBy } from "react-table";
import Styles from "./DatatableStyles";
import DatatablePagination from "./DatatablePagination";
import { ic_keyboard_arrow_down } from "react-icons-kit/md/ic_keyboard_arrow_down";
import { ic_keyboard_arrow_up } from "react-icons-kit/md/ic_keyboard_arrow_up";
import { Icon } from "cdm-ui-components";
import Pace from "cdm-shared/component/Pace";

const Wrapper = styled.div`
  position: relative;
`;

const FilterWrapper = styled.div`
  padding-top: 0.5rem;
`;

function Table({
  loading,
  columns,
  data,
  total,
  showPaginationTop,
  showPaginationBottom,
  defaultSortBy,
  setSortBy,
  onPageSizeChange,
  onPageChange,
  pageSizeOptions,
  pageSize,
  page,
  hasNextPage,
  hasPreviousPage
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    state: { sortBy },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: defaultSortBy ? [defaultSortBy] : []
      }
    },
    useSortBy
  );
  const pages = useMemo(() => (total > 0 ? Math.ceil(total / pageSize) : 0), [
    total,
    pageSize,
  ]);
  const sortID = sortBy.length > 0 ? sortBy[0].id : "";
  const sortOrder = sortBy.length > 0 ? sortBy[0].desc : "";

  const Headers = useMemo(() => {
    return map(headerGroups, (headerGroup) => (
      <tr {...headerGroup.getHeaderGroupProps()} className="noStyle">
        {headerGroup.headers.map((column) => (
          <th>
            <span {...column.getHeaderProps(column.getSortByToggleProps())}>
              {column.render("Header")}
              {column.isSorted && (
                <Icon
                  size={16}
                  icon={column.isSortedDesc ? ic_keyboard_arrow_down : ic_keyboard_arrow_up}
                />
              )}
            </span>
            {/* Render the columns filter UI */}
            <FilterWrapper>
              {column.Filter ? column.render("Filter") : null}
            </FilterWrapper>
          </th>
        ))}
      </tr>
    ));
  }, [headerGroups, sortID, sortOrder]);

  useEffect(() => {
    if (sortID === 'name' || sortID === 'id') {
      setSortBy(sortBy);
    }
  }, [sortID, sortOrder]);

  // Render the UI for your table
  return (
    <Wrapper>
      {/* pagination top */}
      {showPaginationTop === true && (
        <DatatablePagination
          pageSize={pageSize}
          pageIndex={page}
          pageSizeOptions={pageSizeOptions}
          pageCount={pages}
          setPageNumber={onPageChange}
          setPageSize={onPageSizeChange}
          total={total}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
        />
      )}

      {loading && <Pace />}

      {/* content */}
      <table {...getTableProps()}>
        <thead>{Headers}</thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* pagination bottom */}
      {showPaginationBottom === true && (
        <DatatablePagination
          pageSize={pageSize}
          pageIndex={page}
          pageSizeOptions={pageSizeOptions}
          pageCount={pages}
          setPageNumber={onPageChange}
          setPageSize={onPageSizeChange}
          total={total}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
        />
      )}
    </Wrapper>
  );
}

function Datatable(props) {
  return (
    <Styles>
      <Table {...props} />
    </Styles>
  );
}

export default Datatable;
