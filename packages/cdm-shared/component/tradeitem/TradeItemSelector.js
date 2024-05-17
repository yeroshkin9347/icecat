import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Input,
  Tooltip,
  Col,
  RoundedButton,
  Icon,
  Row,
  Text,
  Divider,
  Modal,
  Padding,
  Loader,
} from "cdm-ui-components";
import styled from "styled-components";
import { ic_filter_list } from "react-icons-kit/md/ic_filter_list";
import { ic_search } from "react-icons-kit/md/ic_search";
import {Delete as DeleteIcon} from '@mui/icons-material';
import {IconButton} from '@mui/material';
import get from "lodash/get";
import Filters from "../product/filter/Filters";
import ProductsTable from "../product/ProductsTable";
import useLocalization from "../../hook/useLocalization";
import { fullSearch } from "../../services/product";

const InputTooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
  min-width: 800px;
  max-width: 90vw;
  max-height: 40vh;
  overflow: auto;
  padding: 1rem 0;
`;

const OneLineText = styled(Text)`
  white-space: nowrap;
  display: inline-block;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
`;

const SelectableTradeItem = styled(Col)`
  cursor: pointer;
  border-radius: ${(props) => props.theme.border.radius};
  border: 1px solid transparent;
  padding: 0.4rem;

  &:hover {
    background-color: rgb(${(props) => props.theme.color.light});
  }
`;

const DEFAULT_FILTERS = { keyword: "" };
const DEFAULT_SIZE = 21;
const DEFAULT_SEARCH_AFTER = null;
const productsTableColumns = ['manufacturerName', 'gtin', 'tradeItemManufacturerCode', 'title', 'category', 'languageAvailable'];

function TradeItemSelector({
  mode = 'search',
  searchable = true,
  placeholder,
  selectedIds,
  allTradeItems,
  panelStyle,
  onTradeItemSelected,
  onTradeItemDeselected,
  onEnter,
  onSearch,
}) {
  const [currentLocaleCode] = useLocalization();
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [total, setTotal] = useState(0);
  const [results, setResults] = useState([]);
  const [manufacturersCount, setManufacturersCount] = useState(null);
  const inputEl = useRef(null);

  const search = useCallback(
    async (f) => {
      if (allTradeItems) {
        const keyword = f?.keyword?.toLowerCase();
        let results = allTradeItems;
        if (keyword) {
          results = allTradeItems.filter((item) => (
            item.title?.toLowerCase()?.includes(keyword) ||
            item.manufacturerName?.toLowerCase()?.includes(keyword) ||
            item.tradeItemCategory?.name?.toLowerCase()?.includes(keyword) ||
            get(item, 'identities[0].gtin.value')?.toLowerCase()?.includes(keyword)
          ));
        }
        setResults(results);
        setTotal(results.length);
        setManufacturersCount(results.length);
        return;
      }

      setLoading(true);
      fullSearch(currentLocaleCode, DEFAULT_SIZE, DEFAULT_SEARCH_AFTER, f).then(
        (res) => {
          setResults(res.data.results);
          setTotal(res.data.total);
          setManufacturersCount(res.data.manufacturersCount);
        }
      ).finally(() => {
        setLoading(false);
      });
    },
    [currentLocaleCode, allTradeItems]
  );

  const onFiltersChanged = useCallback(
    (newFilters) => {
      setShowAdvanced(false);
      search(newFilters);
      setFilters(newFilters);
    },
    [search]
  );


  const onKeywordChange = useCallback((e) => {
    const v = e.target.value;
    setIsVisible(true);
    setFilters((f) => ({ ...f, keyword: v }));
  }, []);

  const onTradeItemSelectedLocal = useCallback(
    (ti) => {
      onTradeItemSelected && onTradeItemSelected(ti);
      if (mode !== 'multi-select') {
        setIsVisible(false);
      }
    },
    [mode, onTradeItemSelected]
  );

  const onTradeItemDeselectedLocal = useCallback(
    (ti) => {
      onTradeItemDeselected && onTradeItemDeselected(ti);
      if (mode !== 'multi-select') {
        setIsVisible(false);
      }
    },
    [mode, onTradeItemDeselected]
  );

  const onSearchLocal = useCallback(() => {
    onSearch && onSearch(filters);
    setIsVisible(false);
    inputEl.current.blur();
  }, [filters, onSearch]);

  const onKeydownLocal = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        search({ ...filters })
      }
    },
    [search, filters]
  );

  const onDeleteLocal = useCallback(() => {
    search(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
  }, [search]);

  useEffect(() => search(DEFAULT_FILTERS), [search]);

  return (
    <>
      <Tooltip
        appendTo={() => document.body}
        interactive={true}
        interactiveBorder={20}
        visible={isVisible && !showAdvanced}
        onClickOutside={() => setIsVisible(false)}
        html={
          <TradeItemSelectorContent
            mode={mode}
            searchable={searchable}
            loading={loading}
            filters={filters}
            results={results}
            total={total}
            selectedIds={selectedIds}
            panelStyle={panelStyle}
            onShowFilters={() => setShowAdvanced(true)}
            onSearch={onSearchLocal}
            onDelete={onDeleteLocal}
            onTradeItemSelected={onTradeItemSelectedLocal}
            onTradeItemDeselected={onTradeItemDeselectedLocal}
          />
        }
      >
        <Input
          ref={inputEl}
          small
          block
          placeholder={placeholder}
          onFocus={(e) => setIsVisible(true)}
          onChange={onKeywordChange}
          onKeyDown={onKeydownLocal}
          value={filters.keyword}
        />
      </Tooltip>

      {showAdvanced && (
        <Modal md>
          <Filters
            onCancel={() => setShowAdvanced(false)}
            onUpdate={onFiltersChanged}
            reload={showAdvanced}
            manufacturers={manufacturersCount}
            filters={filters}
            defaultFilters={DEFAULT_FILTERS}
          />
        </Modal>
      )}
    </>
  );
}

function TradeItemSelectorContent({
  mode,
  searchable,
  loading,
  total,
  results,
  selectedIds,
  translate,
  panelStyle,
  onShowFilters,
  onSearch,
  onDelete,
  onTradeItemSelected,
  onTradeItemDeselected,
}) {
  return (
    <InputTooltipWrapper mode={mode} style={panelStyle}>
      {searchable && (
        <>
          {/* filters & total */}
          <div>
            {/* search */}
            <RoundedButton secondary inline onClick={onSearch}>
              <Icon size={14} icon={ic_search} />
            </RoundedButton>
            {/* filter */}
            <RoundedButton light inline onClick={onShowFilters}>
              <Icon size={14} icon={ic_filter_list} />
            </RoundedButton>
            {/* total */}
            <Text small inline>
              {loading ? '' : `Total: ${total} result(s)`}
            </Text>
            &nbsp;&nbsp;
            {/* delete */}

            <IconButton
              color="error"
              size="large"
              aria-label="Remove"
              sx={{
                padding: 0.5,
              }}
              onClick={onDelete}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </div>

          <Divider />
        </>
      )}

      <Padding horizontal={4}>
        <Row style={{ justifyContent: 'center' }}>
          {loading ? (
            <Loader />
          ): (
            <TradeItemsView
              mode={mode}
              tradeItems={results}
              selectedIds={selectedIds}
              onSelect={onTradeItemSelected}
              onDeselect={onTradeItemDeselected}
            />
          )}
        </Row>
      </Padding>
    </InputTooltipWrapper>
  );
}

function TradeItemsView({ mode, tradeItems, selectedIds, onSelect, onDeselect }) {
  // if (mode === 'search') {
  //   return (
  //     <>
  //       {map(tradeItems, (r) => (
  //         <TradeItemCard
  //           key={`global-search-${r.id}`}
  //           tradeItem={r}
  //           onClick={() => onSelect(r)}
  //         />
  //       ))}
  //     </>
  //   );
  // }
  return (
    <ProductsTable
      products={tradeItems}
      visibleColumns={productsTableColumns}
      rowSelection={mode === 'multi-select' ? 'multiple' : 'single'}
      showCheckbox={mode !== 'search'}
      selectedIds={selectedIds}
      onSelectRow={onSelect}
      onDeselectRow={onDeselect}
    />
  );
}

function TradeItemCard({ tradeItem, onClick }) {
  return (
    <SelectableTradeItem col={4} onClick={onClick}>
      <Row alignItems="center">
        <Col col={12}>
          {/* Title */}
          <OneLineText bold small uppercase>
            {tradeItem.title}
          </OneLineText>
          {/* Manufacturer */}
          <OneLineText light bold small uppercase>
            {tradeItem.manufacturerName}
          </OneLineText>
        </Col>
      </Row>
    </SelectableTradeItem>
  );
}

export default TradeItemSelector;
