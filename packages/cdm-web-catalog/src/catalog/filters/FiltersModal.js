import React, { memo } from "react";
import Filters from "cdm-shared/component/product/filter/Filters";
import { useStateValue } from "cdm-shared/hook/useStateValue";
import { defaultFilters } from "catalog/reducer";
import { ModalStyled } from "cdm-shared/component/styled/modal/ModalStyled";

const FiltersModal = ({
  // functions
  search
}) => {
  const [
    {
      manufacturers,
      filters,
      showFilters,
      collections,
      categoryNames,
      npdCategories,
      brands
    },
    dispatch
  ] = useStateValue();

  return (
    <ModalStyled
      show={showFilters}
      md
    >
      <Filters
        onCancel={() => dispatch({ type: "showFilters", value: false })}
        onUpdate={newFilters => {
          dispatch({ type: "resetSearchData" });
          dispatch({ type: "showFilters", value: false });
          search(newFilters);
        }}
        reload={showFilters}
        manufacturers={manufacturers}
        brands={brands}
        collections={collections}
        categoryNames={categoryNames}
        npdCategories={npdCategories}
        filters={filters}
        defaultFilters={defaultFilters}
      />
    </ModalStyled>
  );
};

function areEqual(prevProps, nextProps) {
  return (
    prevProps.showFilters === nextProps.showFilters &&
    prevProps.filters === nextProps.filters
  );
}

export default memo(FiltersModal, areEqual);
