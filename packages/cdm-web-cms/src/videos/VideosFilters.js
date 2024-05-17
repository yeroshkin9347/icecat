import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Button, Modal, Input } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import VideoAdvancedFilters from "cdm-shared/component/video/filter/VideoAdvancedFilters";
import styled from "styled-components";

const InputWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-right: 1rem;
  width: 300px;
`;

function VideosFilters({
  translate,
  onSearchChanged,
  onFiltersChanged,
  onFiltersClear,
  filters,
  defaultFilters,
  categoryOptions,
  censorOptions,
  languageOptions,
}) {
  const initRef = useRef(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchText, setSearchText] = useState(filters.title || "");
  const [searchTextDebounced, setSearchTextDebounced] = useState(
    filters.title || ""
  );

  useEffect(() => {
    initRef.current && onSearchChanged(searchTextDebounced);
  }, [onSearchChanged, searchTextDebounced]);

  useEffect(() => {
    let timeout = null;
    initRef.current = true;
    if (searchTextDebounced !== searchText) {
      timeout = setTimeout(() => {
        setSearchTextDebounced(searchText);
      }, 500);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [searchText, searchTextDebounced]);

  return (
    <>
      <Row>
        <Col col right>
          <InputWrapper>
            <Input
              block
              type="text"
              placeholder={translate("video.filter.freeText")}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
          </InputWrapper>
          <Button secondary small onClick={() => setShowAdvanced(true)}>
            {translate("video.filter.advancedBtn")}
          </Button>
          <Button
            light
            small
            noMargin
            onClick={() => {
              onFiltersClear();
            }}
          >
            {translate("video.filter.clearBtn")}
          </Button>
        </Col>
      </Row>

      {showAdvanced && (
        <Modal md>
          <VideoAdvancedFilters
            onCancel={() => setShowAdvanced(false)}
            onUpdate={(newFilters) => {
              onFiltersChanged(newFilters);
              setShowAdvanced(false);
            }}
            reload={showAdvanced}
            filters={filters}
            onFiltersChanged={onFiltersChanged}
            defaultFilters={defaultFilters}
            categoryOptions={categoryOptions}
            censorOptions={censorOptions}
            languageOptions={languageOptions}
          />
        </Modal>
      )}
    </>
  );
}

export default withLocalization(VideosFilters);
