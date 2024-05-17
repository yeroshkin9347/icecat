import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import map from "lodash/map";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";
import Styles from "./DatatableStyles";
import DatatablePagination from "./DatatablePagination";
import { ic_keyboard_arrow_down } from "react-icons-kit/md/ic_keyboard_arrow_down";
import { ic_keyboard_arrow_up } from "react-icons-kit/md/ic_keyboard_arrow_up";
import { Icon, Input } from "cdm-ui-components";
import Pace from "cdm-shared/component/Pace";

const Wrapper = styled.div`
  position: relative;
`;

const FilterWrapper = styled.div`
  padding-top: 0.5rem;
`;

const SearchWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  bottom: 6px;
  padding: 0 10px;
`;

const InlineWrapper = styled.div`
  display: inline-flex;
  align-items: center;
`;

export const InputWrap = styled(Input)`
  border: 1px solid #c4c2c2;
  background-color: white;
  border-radius: 5px;
  width: 70%;
  height: 36px;
  :focus {
    background-color: white;
    border: 2px solid #2684ff;
  }
`;

export const SelectWrap = styled.select`
  border: 1px solid #c4c2c2;
  background-color: white;
  border-radius: 5px;
  width: 70%;
  height: 36px;
  :focus {
    background-color: white;
    border: 2px solid #2684ff;
  }
`;

export const LabelWrap = styled.label`
  margin: 0 10px;
`;


// Define a default UI for filtering
function GlobalFilter({
  globalFilter,
  setGlobalFilter,
  pageSize,
  setPageSize,
  pageSizeOptions,
}) {
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <SearchWrapper>
      <InputWrap
        style={{ width: 200 }}
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`Search`}
      />
      <InlineWrapper>
        <LabelWrap>Show</LabelWrap>
        <SelectWrap
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          style={{ width: "60px", height: "38px" }}
        >
          {pageSizeOptions.map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </SelectWrap>
        <LabelWrap>entries</LabelWrap>
      </InlineWrapper>
    </SearchWrapper>
  );
}

function Table({
  hideFilter,
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
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { sortBy, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: defaultSortBy ? [defaultSortBy] : [],
      },
    },
    useGlobalFilter,
    useSortBy
  );
  const pages = useMemo(() => (total > 0 ? Math.ceil(total / pageSize) : 0), [
    total,
    pageSize,
  ]);
  const sortID = sortBy.length > 0 ? sortBy[0].id : "";
  const sortOrder = sortBy.length > 0 ? sortBy[0].desc : "";

  const Headers = useMemo(() => {
    return map(headerGroups, (headerGroup, headerIndex) => (
      <tr
        key={`header-${headerIndex}`}
        {...headerGroup.getHeaderGroupProps()}
        className="noStyle"
      >
        {headerGroup.headers.map((column, columnIndex) => (
          <th key={`headerColumn-${columnIndex}`}>
            <span {...column.getHeaderProps(column.getSortByToggleProps())}>
              {column.render("Header")}
              {column.isSorted && (
                <Icon
                  size={16}
                  icon={
                    column.isSortedDesc
                      ? ic_keyboard_arrow_down
                      : ic_keyboard_arrow_up
                  }
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
      {!hideFilter && (
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          pageSize={pageSize}
          setPageSize={onPageSizeChange}
          pageSizeOptions={pageSizeOptions || [5, 10, 20, 50, 100]}
        />
      )}
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
              <tr key={`row-${i}`} {...row.getRowProps()}>
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
