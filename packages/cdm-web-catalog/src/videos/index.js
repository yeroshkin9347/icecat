import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import get from "lodash/get";
import size from "lodash/size";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import pickBy from "lodash/pickBy";
import {Zone, Button, Text, Tooltip, Icon, RoundedButton, Tag} from "cdm-ui-components";
import { ic_file_download } from "react-icons-kit/md/ic_file_download";
import { defaultFilters } from "./models";
import Filters from "./Filters";
import Results from "./Results";
import { updateUrl, paramObject } from "cdm-shared/utils/url";
import { withLocalization } from "common/redux/hoc/withLocalization";
import PrimaryLoader from "cdm-shared/component/PrimaryLoader";
import {searchManufacturerDigitalAssets, searchRetailerDigitalAssets} from "cdm-shared/services/videos";
import withTheme from "cdm-shared/redux/hoc/withTheme";
import withUser from "cdm-shared/redux/hoc/withUser";
import styled from "styled-components";
import { SinglePageLayout } from "styled-components/layout";
import FilterValueBar from "styled-components/filter/FilterValueBar";
import UpdateDateButton from "catalog/buttons/UpdateDateButton";
import AssetUpload from "./AssetUpload";
import { isFilterValueNull } from "catalog/utils";
import {isManufacturer, isRetailer} from "cdm-shared/redux/hoc/withAuth";
import ClearBasketConfirmDialog from "./ClearBasketConfirmDialog";
import {localStorageGetItem, localStorageSetItem} from "cdm-shared/utils/localStorage";
import { DeleteSweep, RemoveShoppingCart, ShoppingCart } from "@mui/icons-material";
import { DARK } from "cdm-shared/component/color";
import ExportAssetsDialog from "./ExportAssetsDialog";

const TypeWrapper = styled.div`
  display: flex;
`;

const ModeButton = styled(Button)`
  ${(props) => props.gray ? "background: #e6e6e6" : ""}
`;

const TypeButton = styled(UpdateDateButton)`
  ${(props) => props.gray ? "background: #ededed" : ""}
`;

const StyledRoundedButton = styled(RoundedButton)`
  margin: 0 0 16px 0;
  height: auto;
  aspect-ratio: 1 / 1;
`;

const FilterActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NumberOfShoppingCartItems = styled(Tag)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 2px 4px;
  border-radius: 0;
  margin: 0;
  font-size: 0.75rem;
  text-align: center;
`;

const types = [
  { name: "video.type.video", value: "video" },
  { name: "video.type.image", value: "image" },
  { name: "video.type.document", value: "document" },
];
const viewModes = [
  { name: "video.view.grid", value: "grid" },
  { name: "video.view.list", value: "list" },
];

const formatRange = (min, max) => {
  if (isNil(min) && isNil(max)) {
    return null;
  }
  if (!isNil(min) && !isNil(max)) {
    return `${min} - ${max}`;
  }
  if (!isNil(min)) {
    return `>${min}`;
  }
  return `<${max}`;
}

class DigitalAssetsManagement extends Component {
  constructor(props) {
    super(props);

    const urlFilters = paramObject();

    let savedCart;
    try {
      savedCart = JSON.parse(localStorageGetItem('dam-cart'));
    } catch {}

    this.state = {
      viewMode: "grid",
      loading: false,
      results: [],
      filters: {
        ...defaultFilters,
        type: urlFilters.type ?? defaultFilters.type,
      },
      searchAfter: null,
      limit: 50,
      total: 0,
      isActionsRowVisible: true,
      searchResult: {},
      basketAssets: savedCart?.assets || [],
      basketAssetsType: savedCart?.assetType,
      differentBasketAsset: null,
      showExportSearchResultDialog: false,
      showExportBasketAssetsDialog: false,
    };

    this.isRetailer = isRetailer(props.user);
    this.isManufacturer = isManufacturer(props.user);

    this.search = this.search.bind(this);
    this.emptyResults = this.emptyResults.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.addAsset = this.addAsset.bind(this);
    this.updateAsset = this.updateAsset.bind(this);
    this.deleteAsset = this.deleteAsset.bind(this);
    this.addAssetToBasket = this.addAssetToBasket.bind(this);
    this.removeAssetFromBasket = this.removeAssetFromBasket.bind(this);
    this.onCloseClearBasketConfirmDialog = this.onCloseClearBasketConfirmDialog.bind(this);
    this.onClearBasketAssets = this.onClearBasketAssets.bind(this);
  }

  componentDidMount() {
    const urlFilters = paramObject();
    this.search(
      isEmpty(urlFilters)
        ? this.state.filters
        : Object.assign({}, defaultFilters, urlFilters)
    );
    if (urlFilters.mode) {
      this.setState({
        viewMode: urlFilters.mode,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.basketAssets !== prevState.basketAssets) {
      localStorageSetItem('dam-cart', JSON.stringify({
        assets: this.state.basketAssets,
        assetType: this.state.basketAssetsType,
      }));
    }
  }

  emptyResults() {
    this.setState({
      results: [],
      total: 0,
    });
  }

  search(filters, loadMore) {
    const { searchAfter, limit, results } = this.state;

    let searchFn;
    if (this.isRetailer) {
      searchFn = searchRetailerDigitalAssets;
    } else if (this.isManufacturer) {
      searchFn = searchManufacturerDigitalAssets;
    } else {
      return;
    }

    this.setState({ loading: true });

    const query = pickBy({
      freeText: filters.keyword,
      tradeItemGtins: filters.gtin ? [filters.gtin] : [],
      tradeItemMpns: filters.mpn ? [filters.mpn] : [],
      updatedDateStart: filters.updatedDateStart,
      updatedDateEnd: filters.updatedDateEnd,
      categories: filters.categories,
      languages: filters.languages,
      exclusiveRetailers: filters.exclusiveRetailers,
      mimeTypes: filters.mimeTypes,
      size: filters.size,
      ratings: filters.ratings,
      widthMin: filters.minWidth,
      widthMax: filters.maxWidth,
      heightMin: filters.minHeight,
      heightMax: filters.maxHeight,
      plungeAngles: filters.plungeAngles,
      facingTypes: filters.facingTypes,
      hasAlpha: filters.hasAlpha,
      indexMin: filters.minIndex,
      indexMax: filters.maxIndex,
      resolutionXMin: filters.minDensityX,
      resolutionXMax: filters.maxDensityX,
      resolutionYMin: filters.minDensityY,
      resolutionYMax: filters.maxDensityY,
    }, (v) => v !== undefined && v !== null && (typeof v !== 'object' || Object.values(v).length));

    searchFn(filters.type, limit, loadMore ? searchAfter / limit : 0, query).then((res) => {
      const newResults = (get(res, "data.results") || [])
        .sort((a, b) => (b.updateTimestamp || b.creationTimestamp).localeCompare((a.updateTimestamp || a.creationTimestamp)));
      this.setState({
        results: loadMore ? [...results, ...newResults] : newResults,
        searchAfter: get(res, "data.searchAfter"),
        total: get(res, "data.total"),
        loading: false,
        filters,
      });
      if (!Object.keys(query).length) {
        this.setState((prev) => ({
          searchResult: {
            ...prev.searchResult,
            ...res.data,
          },
        }));
      }
      updateUrl({
        ...filters,
        mode: this.state.viewMode,
      });
    });
  }

  onUpdateType(type) {
    const newFilters = { ...defaultFilters, type };
    this.setState({ filters: newFilters });
    this.emptyResults();
    this.search(newFilters);
  }

  changeViewMode(mode) {
    this.setState({
      viewMode: mode,
    });
    updateUrl({
      ...this.state.filters,
      mode,
    });
  }

  applyFilters(newFilters) {
    this.emptyResults();
    this.setState({
      filters: newFilters,
    });
    this.search(newFilters);
  }

  removeFilter(key) {
    const newFilters = { ...this.state.filters };
    if (Array.isArray(key)) {
      key.forEach((field) => {
        newFilters[field] = null;
      });
    } else {
      newFilters[key] = null;
    }
    this.applyFilters(newFilters);
  }

  resetFilters() {
    const newFilters = { ...defaultFilters, type: this.state.filters.type };
    this.applyFilters(newFilters);
  }

  addAsset(asset) {
    this.setState((prev) => ({
      results: [asset, ...prev.results],
      total: prev.total + 1,
    }));
  }

  updateAsset(asset) {
    this.setState((prev) => ({
      results: prev.results.map((item) => item.id === asset.id ? asset : item),
    }));
  }

  deleteAsset(asset) {
    const results = this.state.results.filter((item) => item.id !== asset.id);
    this.setState((prev) => ({
      results,
      total: Math.max(prev.total - 1, 0),
    }));
    if (!results.length) {
      this.search(this.state.filters);
    }
  }

  addAssetToBasket(asset) {
    const { basketAssets, basketAssetsType, filters } = this.state;
    if (basketAssets.length && basketAssetsType !== filters.type) {
      this.setState({
        differentBasketAsset: asset,
      });
      return;
    }

    this.setState((prev) => ({
      basketAssets: [...prev.basketAssets, asset],
      basketAssetsType: prev.filters.type,
    }));
  }

  removeAssetFromBasket(asset) {
    this.setState((prev) => ({
      basketAssets: prev.basketAssets.filter((item) => item.id !== asset.id),
    }));
  }

  onCloseClearBasketConfirmDialog(clear) {
    if (clear) {
      this.setState((prev) => ({
        basketAssets: [prev.differentBasketAsset],
        basketAssetsType: prev.filters.type,
        differentBasketAsset: null,
      }));
    } else {
      this.setState({
        differentBasketAsset: null,
      });
    }
  }

  onClearBasketAssets() {
    this.setState({
      basketAssets: [],
      basketAssetsType: null,
    });
  }

  render() {
    const {
      viewMode,
      total,
      results,
      loading,
      filters,
      searchResult,
      basketAssets,
      basketAssetsType,
      differentBasketAsset,
      showExportSearchResultDialog,
      showExportBasketAssetsDialog,
    } = this.state;

    const { user } = this.props;

    const { translate } = this.props;

    const currentSize = size(results);

    const filterValues = [
      {
        key: "keyword",
        value: get(filters, "keyword"),
        label: translate("video.videosView.filters.quick")
      },
      {
        key: "gtin",
        value: get(filters, "gtin"),
        label: translate("video.videosView.filters.gtin")
      },
      {
        key: "mpn",
        value: get(filters, "mpn"),
        label: translate("video.videosView.filters.mpn")
      },
      {
        key: "manufacturers",
        value: get(filters, "manufacturers"),
        label: translate("video.videosView.filters.manufacturers")
      },
      {
        key: "updatedDateStart",
        value: get(filters, "updatedDateStart"),
        label: translate("video.videosView.filters.updatedFrom")
      },
      {
        key: "updatedDateEnd",
        value: get(filters, "updatedDateEnd"),
        label: translate("video.videosView.filters.updatedTo")
      },
      {
        key: "categories",
        value: get(filters, "categories"),
        label: translate("video.videosView.filters.category")
      },
      {
        key: "languages",
        value: get(filters, "languages"),
        label: translate("video.videosView.filters.language")
      },
      {
        key: "exclusiveRetailers",
        value: get(filters, "exclusiveRetailers"),
        label: translate("video.videosView.filters.exclusiveRetailer")
      },
      {
        key: "mimeTypes",
        value: get(filters, "mimeTypes"),
        label: translate("video.videosView.filters.mimeType")
      },
      {
        key: ["minSize", "maxSize"],
        value: formatRange(filters.minSize, filters.maxSize),
        label: translate("video.videosView.filters.size")
      },
      {
        key: "ratings",
        value: get(filters, "ratings"),
        label: translate("video.videosView.filters.rating")
      },
      {
        key: ["minWidth", "maxWidth"],
        value: formatRange(filters.minWidth, filters.maxWidth),
        label: translate("video.videosView.filters.width")
      },
      {
        key: ["minHeight", "maxHeight"],
        value: formatRange(filters.minHeight, filters.maxHeight),
        label: translate("video.videosView.filters.height")
      },
      {
        key: "plungeAngle",
        value: get(filters, "plungeAngle"),
        label: translate("video.videosView.filters.plungeAngle")
      },
      {
        key: "facingType",
        value: get(filters, "facingType"),
        label: translate("video.videosView.filters.facingType")
      },
      {
        key: "hasAlpha",
        value: typeof get(filters, "hasAlpha") === 'boolean' ? filters.hasAlpha : null,
        label: translate("video.videosView.filters.hasAlpha")
      },
      {
        key: ["minIndex", "maxIndex"],
        value: formatRange(filters.minIndex, filters.maxIndex),
        label: translate("video.videosView.filters.index")
      },
      {
        key: ["minDensityX", "maxDensityX"],
        value: formatRange(filters.minDensityX, filters.maxDensityX),
        label: translate("video.videosView.filters.densityX")
      },
      {
        key: ["minDensityY", "maxDensityY"],
        value: formatRange(filters.minDensityY, filters.maxDensityY),
        label: translate("video.videosView.filters.densityY")
      },
    ];
    const isEmptyFilter = filterValues.every(({ value }) => isFilterValueNull(value));

    const resultsFoundKey = `video.videosView.meta.${filters.type}Found_${total === 0 ? 'zero' : total === 1 ? 'one' : 'other'}`;
    const loadMoreKey = `loadMore${filters.type[0].toUpperCase()}${filters.type.slice(1)}`;

    return (
      <>
        {/* Header row */}

        <SinglePageLayout
          title={translate(`video.type.${filters.type}`)}
          subtitle={translate(`video.type.${filters.type}`)}
          breadcrumbs={[
            { title: translate("header.nav.home"), route: "/" },
            { title: translate("video.pageTitle") },
            { title: translate(`video.type.${filters.type}`) },
          ]}
          sidebar={
            <>
              <TypeWrapper>
                {types.map((option, i) => (
                  <TypeButton
                    {...{ left: i === 0, middle: i > 0 && i < types.length - 1, right: i === types.length - 1 }}
                    key={option.value}
                    primary={option.value === filters.type}
                    gray={option.value !== filters.type}
                    small
                    block
                    onClick={() => this.onUpdateType(option.value)}
                  >
                    {translate(option.name)}
                  </TypeButton>
                ))}
              </TypeWrapper>

              <br />

              {/* Total results */}
              <Text>
                {loading ? "-" : translate(resultsFoundKey, { count: total })}
              </Text>

              <FilterValueBar
                filters={filterValues}
                onRemoveFilter={this.removeFilter}
              />
              <br />

              <FilterActions>
                {/* Clear filters */}
                {!isEmptyFilter && (
                  <Tooltip interactive html={translate("catalog.filters.clearFilters")}>
                    <StyledRoundedButton large onClick={this.resetFilters} light>
                      <DeleteSweep fontSize="medium" color={DARK} />
                    </StyledRoundedButton>
                  </Tooltip>
                )}

                {/* Export shopping cart */}
                {!!basketAssets.length && (
                  <Tooltip interactive html={translate("catalog.filters.exportBasket")}>
                    <StyledRoundedButton
                      large
                      secondary
                      onClick={() => this.setState({ showExportBasketAssetsDialog: true })}
                    >
                      <ShoppingCart fontSize="medium" color={'#fff'} />
                      <NumberOfShoppingCartItems rounded primary small>
                        {basketAssets.length}
                      </NumberOfShoppingCartItems>
                    </StyledRoundedButton>
                  </Tooltip>
                )}

                {/* Clear shopping cart */}
                {!!basketAssets.length && (
                  <Tooltip interactive html={translate("catalog.filters.emptyBasket")}>
                    <StyledRoundedButton large danger onClick={this.onClearBasketAssets}>
                      <RemoveShoppingCart fontSize="medium" color={'#fff'} />
                    </StyledRoundedButton>
                  </Tooltip>
                )}

                {/* Export search results */}
                {!!results.length && (
                  <Tooltip interactive html={translate("catalog.filters.exportResults")}>
                    <StyledRoundedButton large primary onClick={() => this.setState({ showExportSearchResultDialog: true })}>
                      <Icon icon={ic_file_download} size={22} />
                    </StyledRoundedButton>
                  </Tooltip>
                )}
              </FilterActions>

              <Filters
                filters={filters}
                filterOptions={searchResult}
                onChange={this.applyFilters}
                onSelectVideo={(video) => this.setState({
                  results: video ? [video] : [],
                  total: 1,
                })}
              />
            </>
          }
          rightSideItems={[
            <div>
              {viewModes.map((option, i) => (
                <ModeButton
                  key={option.value}
                  primary={option.value === viewMode}
                  gray={option.value !== viewMode}
                  small
                  left={i === 0}
                  right={i === 1}
                  onClick={() => this.changeViewMode(option.value)}
                >
                  {translate(option.name)}
                </ModeButton>
              ))}
            </div>,
          ]}
        >
          {this.isManufacturer && (
            <AssetUpload assetType={filters.type} onUpload={this.addAsset} />
          )}

          {/* Grid */}
          <Results
            loading={loading}
            mode={viewMode}
            results={results}
            assetType={filters.type}
            user={user}
            basketAssets={basketAssets}
            onRefresh={() => this.search(filters)}
            onUpdateAsset={this.updateAsset}
            onDeleteAsset={this.deleteAsset}
            onAddAssetToBasket={this.addAssetToBasket}
            onRemoveAssetFromBasket={this.removeAssetFromBasket}
          />

          {/* Load more + loading */}
          <Zone
            responsive
            noShadow
            center
            transparent
            // Add this minHeight because loader stretch parent container
            style={{ minHeight: "180px" }}
          >
            {loading && currentSize > 0 && <PrimaryLoader />}

            {!loading && size(results) < total && (
              <Button
                onClick={() => this.search(filters, true)}
                shadow
                lg
                secondary
              >
                {translate(`video.videosView.meta.${loadMoreKey}`)}
              </Button>
            )}
          </Zone>
        </SinglePageLayout>

        {differentBasketAsset && (
          <ClearBasketConfirmDialog onClose={this.onCloseClearBasketConfirmDialog} />
        )}

        {showExportSearchResultDialog && (
          <ExportAssetsDialog
            user={user}
            assetType={filters.type}
            assets={results}
            onClose={() => this.setState({ showExportSearchResultDialog: false })}
          />
        )}

        {showExportBasketAssetsDialog && (
          <ExportAssetsDialog
            user={user}
            assetType={basketAssetsType}
            assets={basketAssets}
            onClose={() => this.setState({ showExportBasketAssetsDialog: false })}
          />
        )}
      </>
    );
  }
}

export default withRouter(
  withUser(withLocalization(withTheme(DigitalAssetsManagement)))
);
