import React from "react";
import { withRouter } from "react-router-dom";
import { Row, Padding, H5, Button, Toast, Text } from "cdm-ui-components";
import styled from "styled-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import withUser from "cdm-shared/redux/hoc/withUser";
import CollectionPrice from "collections/CollectionPrice";
import CollectionPriceFilters from "./filters/PricingFilter";
import {
  getCollectionDetailForManufacturer,
  getCollectionsDetail,
  getCollectionsExportAction,
} from "cdm-shared/services/collection";
import { get, map, size } from "lodash";
import CollectionMatixMapping from "./CollectionMatixMapping";
import CollectionImportPrice from "./CollectionImportPrice";
import CollectionDuplication from "./CollectionDuplication";
import { getTradeItemForManufacturer } from "cdm-shared/services/product";
import LoaderFixed from "cdm-shared/component/LoaderFixed";
import { ModalStyled } from "cdm-shared/component/styled/modal/ModalStyled";
import { SinglePageLayout } from "styled-components/layout";
import { searchAndExport } from "cdm-shared/services/export";

const ActionButton = styled(Button)`
  margin-right: 0;
`;

class CollectionDetail extends React.Component {
  state = {
    collection: null,
    filters: {
      title: "",
      gtin: "",
      mpn: "",
      manufacturerCode: "",
      retailerCodes: [],
      incompletePricing: false,
    },
    tradeItem: null,
    uploadMatrixModalVisible: false,
    prices: [],
    tradeItemIds: [],
    loading: false,
    initiated: false,
    showExcelExport: false,
    toastMessage: null,
    showImportModal: false,
    showDuplicationModal: false,
    pageSize: 20,
    page: 0,
    totalCount: 0,
  };

  componentDidMount() {
    this.fetchCollectionPrice();
    this.fetchCollectionDetail();
  }

  fetchCollectionDetail() {
    const { match } = this.props;
    const id = match.params.id;
    getCollectionDetailForManufacturer(id).then((res) => {
      if (res.status === 200) {
        this.setState({ collection: res.data });
      }
    });
  }

  fetchCollectionPriceFn = () => {
    const { match } = this.props;
    const { filters } = this.state;
    const id = match.params.id;

    return getCollectionsDetail({
      collectionId: id,
      pageNumber: this.state.page,
      pageSize: this.state.pageSize,
      gtin: filters.gtin,
      manufacturerCode: filters.manufacturerCode,
      retailerCodes: map(filters.retailerCodes, "code").join(",") || undefined,
      incompletePricing: filters.incompletePricing,
    });
  };

  handleChangePagination = (paginationModel) => {
    this.setState({ ...paginationModel }, () => {
      this.fetchCollectionPrice();
    });
  };

  async fetchCollectionPrice(isReset = false) {
    const shouldShowMatrixModal = !this.state.initiated;
    this.setState({ loading: true, prices: isReset ? [] : this.state.prices });
    return this.fetchCollectionPriceFn()
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            prices: res.data.results || [],
            totalCount: res.data.total,
            tradeItemIds: map(res.data.results, "tradeItemId"),
            isCollectionHasData: !this.state.initiated
              ? res.data.total > 0
              : this.state.isCollectionHasData,
          });
          if (!this.state.initiated) {
            if (res.data.total === 0) {
              this.setState({
                uploadMatrixModalVisible: shouldShowMatrixModal,
                initiated: true,
              });
            } else {
              this.setState({ initiated: true });
            }
          }

          if (res.data.results && res.data.results.length) {
            getTradeItemForManufacturer(
              get(res.data.results, "0.tradeItemId")
            ).then((res) => {
              const tradeItem = res.data;
              this.setState({ tradeItem });
            });
          }

          return res.data.results;
        } else {
          this.setState({
            uploadMatrixModalVisible: shouldShowMatrixModal,
            initiated: true,
          });
        }
      })
      .catch((err) => {
        this.setState({
          uploadMatrixModalVisible: shouldShowMatrixModal,
          initiated: true,
        });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  setFilterField = (field, val) => {
    const isChanged = this.state.filters[field] !== val;
    if (isChanged) {
      this.setState(
        {
          filters: { ...this.state.filters, [field]: val },
        },
        () => {
          this.fetchCollectionPrice();
        }
      );
    }
  };

  setErrorToast = (err) => {
    this.setState({ toastMessage: err }, () => {
      setTimeout(() => this.setState({ toastMessage: null }), 3000);
    });
  };

  exportTradeItemsFromSearch = () => {
    getCollectionsExportAction().then((res) => {
      const actionId = res.data;
      if (res.data) {
        this.setState({ selectedExportActionId: actionId }, this.export);
        const tradeItemIds = this.state.tradeItemIds;
        tradeItemIds.map((tradeItemId) => {
          searchAndExport(
            this.props.currentLocaleCode,
            { tradeItemId },
            actionId
          ).then((exportActionResult) => {
            if (get(exportActionResult, "status") !== "Failed") {
            } else if (get(exportActionResult, "status") === "Failed") {
              alert(this.props.translate("catalog.filters.exportError"));
            }
          });
        });
      }
    });
  };

  render() {
    const { translate } = this.props;
    const {
      collection,
      tradeItem,
      uploadMatrixModalVisible,
      prices,
      filters,
      toastMessage,
      showImportModal,
      showDuplicationModal,
      initiated,
      loading,
      isCollectionHasData,
    } = this.state;

    return (
      <>
        <SinglePageLayout
          title={collection ? collection.name : ""}
          subtitle={collection ? collection.name : ""}
          breadcrumbs={[
            { title: translate("header.nav.home"), route: "/" },
            { title: translate("collections.title"), route: "/collections" },
            { title: collection ? collection.name : "" },
          ]}
          rightSideItems={
            !!size(prices) || isCollectionHasData
              ? [
                  <ActionButton
                    onClick={this.exportTradeItemsFromSearch}
                    primary
                    small
                  >
                    {translate("collections.generateExcel")}
                  </ActionButton>,
                  <ActionButton
                    onClick={(e) => this.setState({ showImportModal: true })}
                    primary
                    small
                  >
                    {translate("collections.importExcel")}
                  </ActionButton>,
                  <ActionButton
                    onClick={(e) =>
                      this.setState({ showDuplicationModal: true })
                    }
                    primary
                    small
                  >
                    {translate("collections.duplicate")}
                  </ActionButton>,
                ]
              : []
          }
        >
          <div className="collection-price-container">
            {loading && <LoaderFixed />}
            <div className="pricing-list-wrapper">
              {size(prices) > 0 || isCollectionHasData ? (
                <>
                  <CollectionPriceFilters
                    translate={translate}
                    filters={filters}
                    setFilterField={this.setFilterField}
                  />
                  <Padding top={4}>
                    <H5>Pricing</H5>
                    <CollectionPrice
                      prices={prices}
                      collection={collection}
                      tradeItem={tradeItem}
                      onRefreshPriceList={(isReset) =>
                        this.fetchCollectionPrice(isReset)
                      }
                      paginationModel={{
                        page: this.state.page,
                        pageSize: this.state.pageSize,
                        rowCount: this.state.totalCount,
                      }}
                      onPaginationModelChange={this.handleChangePagination}
                      onDeletePricingSuccess={() => this.fetchCollectionPrice()}
                    />
                  </Padding>
                </>
              ) : (
                <Row style={{ justifyContent: "center", marginTop: 40 }}>
                  {!!initiated && !loading && (
                    <Text center>{translate("collections.table.noData")}</Text>
                  )}
                </Row>
              )}
            </div>
          </div>
        </SinglePageLayout>

        {!!toastMessage && (
          <Toast
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              zIndex: 3002,
            }}
            danger
          >
            {toastMessage}
          </Toast>
        )}

        {uploadMatrixModalVisible && (
          <CollectionMatixMapping
            onImportSuccess={() => {
              this.setState({ uploadMatrixModalVisible: false });
              return this.fetchCollectionPrice();
            }}
            collection={this.state.collection}
            onClose={() => {
              this.setState({ uploadMatrixModalVisible: false });
              return this.fetchCollectionPrice();
            }}
          />
        )}

        {showImportModal && (
          <ModalStyled sm>
            <CollectionImportPrice
              collection={collection}
              onSuccess={() => {
                this.setState({
                  showImportModal: false,
                });
                this.fetchCollectionPrice(true);
              }}
              onClose={() => this.setState({ showImportModal: false })}
            />
          </ModalStyled>
        )}
        {showDuplicationModal && (
          <ModalStyled sm style={{ overflow: "visible" }}>
            <CollectionDuplication
              collection={collection}
              onClose={() =>
                this.setState({
                  showDuplicationModal: false,
                })
              }
            />
          </ModalStyled>
        )}
      </>
    );
  }
}

export default withRouter(withUser(withLocalization(CollectionDetail)));
