import React, { useState, useCallback, useRef, useEffect } from "react";
import { Input, Row, Col, Button, Modal } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import debounce from "cdm-shared/utils/debounce";
import Filters from "cdm-shared/component/product/filter/Filters";
import styled from "styled-components";

const InputWrapper = styled.div`
  poistion: relative;
  display: inline-block;
  margin-right: 1rem;
  width: 300px;
`;

function ProductsFilters({
  translate,
  onFilterChanged,
  onFiltersChanged,
  onFiltersClear,
  filters,
  defaultFilters,
  manufacturersCount,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const onKeywordChangeUpdateFilterRef = useRef(
    debounce(
      (value) => onFilterChanged({ key: "keyword", value: value + "" }),
      250
    )
  );
  const [keyword, setKeyword] = useState(filters.keyword);

  const onKeywordChange = useCallback((e) => {
    setKeyword(e.target.value);
    onKeywordChangeUpdateFilterRef.current(e.target.value);
  }, []);

  useEffect(() => {
    setKeyword(filters.keyword);
  }, [filters.keyword]);

  return (
    <>
      <Row>
        <Col col right>
          <InputWrapper>
            <Input
              block
              type="text"
              placeholder={translate("product.filter.keyword")}
              value={keyword}
              onChange={onKeywordChange}
            />
          </InputWrapper>
          <Button secondary small onClick={() => setShowAdvanced(true)}>
            {translate("product.filter.advancedBtn")}
          </Button>
          <Button
            light
            small
            noMargin
            onClick={() => {
              onFiltersClear();
              setKeyword("");
            }}
          >
            {translate("product.filter.clearBtn")}
          </Button>
        </Col>
      </Row>

      {showAdvanced && (
        <Modal md>
          <Filters
            onCancel={() => setShowAdvanced(false)}
            onUpdate={(newFilters) => {
              onFiltersChanged(newFilters);
              setShowAdvanced(false);
            }}
            reload={showAdvanced}
            manufacturers={manufacturersCount}
            filters={filters}
            defaultFilters={defaultFilters}
          />
        </Modal>
      )}
    </>
  );
}

export default withLocalization(ProductsFilters);
