import React from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { withRouter } from "react-router-dom";
import { Toast, Tag, Row, Col, H5, Margin, Button, Loader } from "cdm-ui-components";
import ActionsRow from "./actionsRow";
import withLocalProviders from "./store/withLocalProviders";
import Edit from "./Edit";
import { getTradeItem } from "./api";
import { withTradeItemLocalContext } from "./store/TradeItemProvider";
import Persistence from "./Persistence";
import { withLastActionsLocalContext } from "./store/LastActionProvider";
import { getDefaultTargetMarketId } from "./manager";
import { paramObject } from "cdm-shared/utils/url";
import { withGroupLocalContext } from "./store/PropertyGroupProvider";
import { TRADE_ITEM_DEFAULT } from "./constants";
import LoaderOverlay from "../LoaderOverlay";
import { deleteProduct, preCompute } from "../../services/product";
import PrecomputingStatus from "../precomputing/PrecomputingStatus";
import { getTradeItemPrecomputingStatus } from "../../services/precomputing";
import { ModalStyled } from "../styled/modal/ModalStyled";

class UpdateTradeItem extends React.Component {
  state = {
    persisting: false,
    cancelling: false,
    deleting: false,
    preComputing: false,
    precomputeStatus: null,
    tradeItemPrecomputedStatus: null,
    isLoadingDelete: false,
    persistenceStatus: null,
    initiatedVariantId: null,
  };

  componentDidMount() {
    const { match, user, location } = this.props;

    const {
      setTradeItem,
      setSelectedGroupItemIndex,
      setDefaultTargetMarketId,
      setGroupSelected,
      setEditable,
      setFetchingTradeItem,
    } = this.props;

    const id = match.params.id;

    // if (!id) return;
    if (!id) {
      setTradeItem(TRADE_ITEM_DEFAULT);
      setEditable(false);
      // setDefaultTargetMarketId(getDefaultTargetMarketId(CONNECTOR_SUBSCRIBED));
    }

    const initiatedVariantId = new URLSearchParams(location.search).get("variantId")
    if (initiatedVariantId) {
      this.setState({ initiatedVariantId })
    }

    const urlFilters = paramObject();
    const selectedGroupItemIndex =
      get(urlFilters, "selectedGroupItemIndex") || 0;
    const groupSelected = get(urlFilters, "groupSelected") || null;

    setSelectedGroupItemIndex(selectedGroupItemIndex);
    if (groupSelected != null) setGroupSelected(groupSelected);

    if (!id) return;
    setFetchingTradeItem(true)
    getTradeItem(user)(id).then((res) => {
      const ti = get(res, "data", null);
      setTradeItem(ti);
      setDefaultTargetMarketId(getDefaultTargetMarketId(ti));
      this.getTradeItemPrecomputingStatus();
    }).finally(() => {
      setFetchingTradeItem(false)
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.props.setSelectedGroupItemIndex(0);
      this.props.setGroupSelected("MARKETING");
      if (!this.props.match.params.id) {
        return;
      }
      this.props.setFetchingTradeItem(true)
      this.props.setTradeItem({});
      getTradeItem(this.props.user)(this.props.match.params.id).then((res) => {
        const ti = get(res, "data", null);
        this.props.setTradeItem(ti);
        this.props.setDefaultTargetMarketId(getDefaultTargetMarketId(ti));
        this.getTradeItemPrecomputingStatus();
      }).finally(() => {
        this.props.setFetchingTradeItem(false)
      });
    }
  }

  getTradeItemPrecomputingStatus() {
    if (this.props.match.params.id) {
      getTradeItemPrecomputingStatus(this.props.match.params.id).then(res =>
        this.setState({ tradeItemPrecomputedStatus: get(res, "data.tradeItemPreComputingStatus[0].status") })
      );
    }
  }

  setPersistenceStatus(persistenceStatus) {
    this.setState({ persistenceStatus });
    setTimeout(() => this.setState({ persistenceStatus: null }), 5000);
  }

  onBack() {
    const { tradeItem, history } = this.props;
    history.push(`/product/${get(tradeItem, "defaultLanguageCode")}/${get(
      tradeItem,
      "tradeItemId"
    )}`);
  }

  preCompute() {
    this.setState({ preComputing: true });
    if (this.props.match.params.id) {
      preCompute(this.props.match.params.id)
        .then(() => {
          this.setState({ precomputeStatus: true, preComputing: false });
          this.getTradeItemPrecomputingStatus();
        })
        .catch(() => {
          this.setState({ precomputeStatus: false, preComputing: false });
        })
        .finally(() => {
          setTimeout(() => this.setState({ precomputeStatus: null }), 5000);
        })
    }
  }

  onCancel() {
    const { tradingItemChanged } = this.props;
    if (tradingItemChanged) {
      this.setState({ cancelling: true });
    } else {
      this.onBack();
    }
  }

  deleteProduct() {
    const { history } = this.props;
    this.setState({ isLoadingDelete: true });
    if (this.props.match.params.id) {
      deleteProduct(this.props.match.params.id)
        .then((response) => {
          this.setState({ isLoadingDelete: false });
          history.push('/products')
        })
        .catch(() => {
          this.setState({ isLoadingDelete: false });
        })
    }
  }

  render() {
    const {
      persisting,
      persistenceStatus,
      cancelling,
      initiatedVariantId,
      deleting,
      isLoadingDelete,
      preComputing,
      precomputeStatus,
      tradeItemPrecomputedStatus
    } = this.state;

    const {
      tradeItem,
      changedMediaIds,
      match,
      user,
      triggerAnalyticsEvent,
      currentLocaleCode,
      isFetchingTradeItem,
    } = this.props;

    const { translate, refreshLastActions, isAdmin, history } = this.props;

    const { setTradeItemChangedValue } = this.props;
    const { isEditable, setEditable } = this.props;

    const id = match.params.id;
    const params = new URLSearchParams(window.location.search);
    const hideMenu = params.get('hideMenu') === 'true';

    return (
      <>
        {(isFetchingTradeItem || preComputing) && <LoaderOverlay />}
        {/* Main edit/create zone */}
        <>
          <div>
            {get(tradeItem, "identities", []).length > 0 && (
              <Tag secondary medium>
                {get(tradeItem, "identities.0.gtin.value")} /{" "}
                {get(tradeItem, "identities.0.tradeItemManufacturerCode")} /{" "}
                {get(tradeItem, "marketing.0.values.title", null)}
              </Tag>
            )}
            {isEditable && isAdmin && !!tradeItemPrecomputedStatus && <PrecomputingStatus status={tradeItemPrecomputedStatus} />}
          </div>

          <ActionsRow
            createMode={!isEditable}
            showProduct={!isAdmin}
            isAdmin={isAdmin}
            onSave={() => this.setState({ persisting: true })}
            preCompute={() => this.preCompute()}
            onCancel={() => this.onCancel()}
            onDelete={() => this.setState({ deleting: true })}
          />

          {!isEmpty(tradeItem) && (
            <Edit currentLocaleCode={currentLocaleCode} isAdmin={isAdmin} initiatedVariantId={initiatedVariantId} />
          )}
        </>

        {cancelling && (
          <ModalStyled onClose={() => this.setState({ cancelling: false })} sm>
            <Row>
              <Col col center>
                <H5>{translate("tradeItemCrud.update.areYouSure")}</H5>
                <Margin bottom={5} />
              </Col>
            </Row>

            {/* Actions */}
            <Row>
              <Col col right>
                {/* Cancel */}
                <Button
                  onClick={e => this.setState({ cancelling: false })}
                  light
                  small
                >
                  {translate("tradeItemCrud.update.actionButtonCancel")}
                </Button>

                {/* Remove */}
                <Button onClick={e => this.onBack()} danger noMargin small>
                  {translate("tradeItemCrud.update.goToProduct")}
                </Button>
              </Col>
            </Row>
          </ModalStyled>
        )}

        {/* Persistence module */}
        {persisting && (
          <ModalStyled onClose={() => { }} sm>
            <Persistence
              triggerAnalyticsEvent={triggerAnalyticsEvent}
              user={user}
              onPersisted={(tradeItemId) => {
                if (isEditable) {
                  this.setPersistenceStatus(true);
                  refreshLastActions(id);
                  setTradeItemChangedValue(false);
                  this.setState({ persisting: false });
                } else {
                  setEditable(true);
                  history.push(`/update-product/${tradeItemId}${hideMenu ? '?hideMenu=true' : ''}`);
                }
              }}
              onFailed={(err) => {
                this.setPersistenceStatus(false);
                this.setState({ persisting: false });
              }}
              tradeItem={this.props.tradeItem}
              changedMediaIds={changedMediaIds}
            />
          </ModalStyled>
        )}

        {deleting && (
          <ModalStyled onClose={() => !isLoadingDelete ? this.setState({ deleting: false }) : null} sm>
            <Row>
              <Col col center>
                <H5>{translate("tradeItemCrud.delete.areYouSure")}</H5>
                <Margin bottom={5} />
              </Col>
            </Row>

            <Row>
              <Col col center>
                {isLoadingDelete && <Loader />}
              </Col>
            </Row>

            {/* Actions */}
            {!isLoadingDelete && <Row>
              <Col col right>
                {/* Cancel */}
                <Button
                  onClick={e => this.setState({ deleting: false })}
                  light
                  small
                >
                  {translate("tradeItemCrud.delete.actionButtonCancel")}
                </Button>

                {/* Remove */}
                <Button onClick={() => this.deleteProduct()} danger noMargin small>
                  {translate("tradeItemCrud.delete.title")}
                </Button>
              </Col>
            </Row>}
          </ModalStyled>
        )}

        {persistenceStatus === true && (
          <Toast
            style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 999, }}
            success
          >
            {translate("tradeItemCrud.persistence.productUpdateSuccess")}
          </Toast>
        )}

        {persistenceStatus === false && (
          <Toast
            style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 999, }}
            danger
          >
            {translate("tradeItemCrud.persistence.productUpdateFailure")}
          </Toast>
        )}

        {precomputeStatus !== null && (
          <Toast
            style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 999, }}
            success={precomputeStatus}
            danger={!precomputeStatus}
          >
            {translate(precomputeStatus ? "tradeItemCrud.preCompute.created" : "tradeItemCrud.preCompute.failed")}
          </Toast>
        )}
      </>
    );
  }
}

// withLocalProviders used to work on a single context tree instance
export default withRouter(
  withLocalProviders(
    withTradeItemLocalContext(
      withLastActionsLocalContext(withGroupLocalContext(UpdateTradeItem))
    )
  )
);
