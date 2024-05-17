import React, { useMemo } from "react";
import styled from "styled-components";
import map from "lodash/map";
import { useTable } from "react-table";
import Styles from "./DatatableStyles";
import DatatablePagination from "./DatatablePagination";
import Pace from "cdm-shared/component/Pace";

// loading={loading}
// columns={columns}
// data={messages.data}
// showPaginationTop={true}
// onPageSizeChange={size => search(0, size, filters)}
// onPageChange={page => search(page, messages.pageSize, filters)}
// pageSizeOptions={[50, 100, 200, 500, 1000]}
// pageSize={messages.pageSize}
// page={messages.pageNumber}
// pages={
//   messages.total > 0 ? Math.ceil(messages.total / messages.pageSize) : 0
// }

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
                 onClickRow,
                 showPaginationTop,
                 showPaginationBottom,
                 onPageSizeChange,
                 onPageChange,
                 pageSizeOptions,
                 pageSize,
                 page,
                 total,
               }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
  } = useTable({
    columns,
    data,
  });
  const pages = useMemo(() => (total > 0 ? Math.ceil(total / pageSize) : 0), [
    total,
    pageSize,
  ]);

  const Headers = useMemo(() => {
    return map(headerGroups, (headerGroup) => (
      <tr {...headerGroup.getHeaderGroupProps()} className="noStyle">
        {headerGroup.headers.map((column) => (
          <th {...column.getHeaderProps()}>
            {column.render("Header")}
            {/* Render the columns filter UI */}
            <FilterWrapper>
              {column.Filter ? column.render("Filter") : null}
            </FilterWrapper>
          </th>
        ))}
      </tr>
    ));
  }, [headerGroups]);

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
          gotoPage={onPageChange}
          setPageSize={onPageSizeChange}
          total={total}
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
            <tr
              {...row.getRowProps()}
              className={onClickRow ? 'cursor-pointer' : ''}
              onClick={() => onClickRow && onClickRow(row.original)}
            >
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
          gotoPage={onPageChange}
          setPageSize={onPageSizeChange}
          total={total}
        />
      )}
    </Wrapper>
  );
}

function Datatable({ columns, data, ...otherProps }) {
  return (
    <Styles>
      <Table columns={columns} data={data} {...otherProps} />
    </Styles>
  );
}

export default Datatable;
