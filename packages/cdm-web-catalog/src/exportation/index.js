import React from "react";
import { Tab, Tabs, Box } from "@mui/material";
import { withRouter } from "react-router-dom";
import { ic_call_split } from "react-icons-kit/md/ic_call_split";
import { ic_chat } from "react-icons-kit/md/ic_chat";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import filter from "lodash/filter";
import split from "lodash/split";
import get from "lodash/get";
import {
  Zone,
  Textarea,
  Row,
  Col,
  Button,
  Margin,
  P,
  H5,
  Icon,
  Divider,
  LightZone,
} from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { launchActionById } from "cdm-shared/services/export";
import {
  allowShoppingCart,
  getExportAuthorizedActions,
  isManufacturer,
} from "cdm-shared/redux/hoc/withAuth";
import withShoppingCart from "common/redux/hoc/withShoppingCart";
import ExportsList from "./ExportsList";
import RequestsList from "./request/RequestsList";
import CreateRequest from "./request/CreateRequest";
import ShoppingCart from "./ShoppingCart";
import ExportActionPicker from "./ExportActionPicker";
import { paramObject, updateUrl } from "cdm-shared/utils/url";
import { triggerAnalyticsEvent } from "common/utils/analytics";
import withUser from "cdm-shared/redux/hoc/withUser";
import { ModalStyled } from "cdm-shared/component/styled/modal/ModalStyled";
import { SinglePageLayout } from "styled-components/layout";
import { CDM_ENV_NAME } from "cdm-shared/environment";

function preProcessCodes(codesStr) {
  const codes = filter(split(codesStr, /[\n\r;,\s]+/g) || null);
  return isEmpty(codes) || codes[0] === "" ? null : codes;
}

class Export extends React.Component {
  constructor(props) {
    super(props);
    const urlParameters = paramObject();
    this.state = {
      gtins: null,
      tradeItemManufacturerCodes: null,
      exportActionsResultsTotal: 0,
      showExportActions: false,
      showCreateRequest: false,
      selectedTabIndex: get(urlParameters, "selectedTabIndex")
        ? parseInt(urlParameters.selectedTabIndex)
        : 0,
    };
    this.exportList = React.createRef();
    this.refreshEnrichmentListButton = React.createRef();
    this.exportByAction = this.exportByAction.bind(this);
    this.selectTab = this.selectTab.bind(this);
    this.actionLaunched = this.actionLaunched.bind(this);
    this.triggerRequest = this.triggerRequest.bind(this);
    this.clear = this.clear.bind(this);
  }

  actionLaunched(force) {
    const { history } = this.props;

    this.setState({ loading: false });

    if (this.exportList.current)
      this.exportList.current.refreshExportResultsActions(force);
    else {
      history.push("/export?selectedTabIndex=0");
      this.setState({ selectedTabIndex: 0 });
    }
  }

  requestCreated() {
    const { history } = this.props;

    if (this.refreshEnrichmentListButton.current)
      this.refreshEnrichmentListButton.current.click();
    else {
      history.push("/export?selectedTabIndex=1");
      this.setState({ selectedTabIndex: 1 });
    }
  }

  exportByAction(actionId, exportActionParams) {
    const { gtins, tradeItemManufacturerCodes } = this.state;
    const { shoppingCart } = this.props;

    this.setState({ loading: true });

    const _gtins = preProcessCodes(gtins);
    const _tradeItemManufacturerCodes = preProcessCodes(
      tradeItemManufacturerCodes
    );
    const params = Object.assign(
      {},
      {
        TradeItemIds: map(shoppingCart, (i) => i.tradeItemId) || null,
        Gtins: _gtins,
        TradeItemManufacturerCodes: _tradeItemManufacturerCodes,
      },
      exportActionParams || {}
    );

    triggerAnalyticsEvent("Export", "Export from export view");

    launchActionById(actionId, params)
      .then((res) => this.actionLaunched(true))
      .catch((err) => this.actionLaunched(false));
  }

  triggerRequest() {
    this.setState({ showCreateRequest: true });
  }

  triggerExport() {
    const { user } = this.props;

    const exportActionIds = getExportAuthorizedActions(user);

    if (isEmpty(exportActionIds)) return;

    //if (size(exportActionIds) > 1) {
    // open modal for export actions choice
    this.setState({ showExportActions: true });
    //} else {
    //  this.exportByAction(exportActionIds[0]);
    //}
  }

  selectTab(tabIndex) {
    this.setState({ selectedTabIndex: tabIndex });
    updateUrl({ selectedTabIndex: tabIndex });
  }

  clear() {
    this.setState({
      gtins: null,
      tradeItemManufacturerCodes: null,
    });
    this.props.clearShoppingCart();
  }

  render() {
    const {
      gtins,
      tradeItemManufacturerCodes,
      showExportActions,
      showCreateRequest,
      selectedTabIndex,
    } = this.state;

    const { user, shoppingCart, currentLocaleCode } = this.props;

    const { translate } = this.props;

    return (
      <>
        <SinglePageLayout
          title={translate("export.meta.title")}
          subtitle={translate("export.meta.subtitle")}
          breadcrumbs={[
            { title: translate("header.nav.home"), route: "/" },
            { title: translate("export.meta.title") }
          ]}
        >
          <Row>
            {/* Codes and shopping cart */}
            <Col col={4} style={{ paddingLeft: 0 }}>
              <LightZone responsive style={{ padding: 15 }}>
                <H5>{translate("export.form.exportByText")}</H5>
                <P>{translate("export.form.gtinsRules")}</P>
                <br />
                <Row>
                  {/* Gtin */}
                  <Col col>
                    <P italic>{translate("export.form.gtin")}</P>
                    <Textarea
                      style={{ resize: "vertical" }}
                      value={gtins || ""}
                      onChange={(e) =>
                        this.setState({ gtins: e.target.value || null })
                      }
                      block
                      rows={6}
                    />
                  </Col>

                  {/* Trade item manufacturer code */}
                  <Col col>
                    <P italic>
                      {translate("export.form.tradeItemManufacturerCode")}
                    </P>
                    <Textarea
                      style={{ resize: "vertical" }}
                      value={tradeItemManufacturerCodes || ""}
                      onChange={(e) =>
                        this.setState({
                          tradeItemManufacturerCodes: e.target.value || null,
                        })
                      }
                      block
                      rows={6}
                    />
                  </Col>
                </Row>
                <Margin bottom={4} />

                {/* Shopping cart */}
                {allowShoppingCart(user) && (
                  <>
                    <H5>{translate("export.form.shoppingCart")}</H5>
                    {isEmpty(shoppingCart) && (
                      <P>{translate("export.form.shoppingCartEmpty")}</P>
                    )}
                    <ShoppingCart
                      styles={{
                        overflowY: "auto",
                        minHeight: 50,
                      }}
                    />
                  </>
                )}

                <Margin top={3} bottom={4}>
                  <Divider />
                </Margin>

                <Zone noPadding noShadow right>
                  {(!isEmpty(shoppingCart) ||
                    gtins ||
                    tradeItemManufacturerCodes) && (
                      <>
                        {/* Request enrichment */}
                        {!isManufacturer(user) && (
                          <Button onClick={(e) => this.triggerRequest()} light>
                            {translate("export.form.enrichButtonText")}
                          </Button>
                        )}

                        {/* Clear */}
                        <Button onClick={(e) => this.clear()} light>
                          {translate("export.form.clearButtonText")}
                        </Button>

                        {/* Export */}
                        <Button
                          onClick={(e) => this.triggerExport()}
                          secondary
                          shadow
                        >
                          {translate("export.form.exportButtonText")}
                        </Button>
                      </>
                    )}
                </Zone>
              </LightZone>
            </Col>
            <Col col={8}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
                <Tabs value={selectedTabIndex} onChange={(_, index) => this.selectTab(index)}>
                  <Tab
                    value={0}
                    label={(
                      <div className="flex items-center">
                        <Icon icon={ic_call_split} size={16} />
                        &nbsp;
                        {translate("export.actionExecutionResult.currentExports")}
                      </div>
                    )}
                    sx={{ textTransform: "none", fontSize: 14 }}
                  />
                  {CDM_ENV_NAME !== "prod" && !isManufacturer(user) && (
                    <Tab
                      value={1}
                      label={(
                        <div className="flex items-center">
                          <Icon icon={ic_chat} size={16} />
                          &nbsp;
                          {translate("export.actionExecutionResult.requests")}
                        </div>
                      )}
                      sx={{ textTransform: "none", fontSize: 14 }}
                    />
                  )}
                </Tabs>
              </Box>

              {/* Exports */}
              {selectedTabIndex === 0 && (
                <ExportsList
                  translate={translate}
                  user={user}
                  ref={this.exportList}
                />
              )}

              {/* Requests */}
              {selectedTabIndex === 1 && (
                <RequestsList
                  translate={translate}
                  currentLocaleCode={currentLocaleCode}
                  user={user}
                  ref={this.refreshEnrichmentListButton}
                />
              )}
            </Col>
          </Row>
        </SinglePageLayout>

        {/* Export action chooser */}
        {showExportActions && (
          <ModalStyled
            style={{ overflow: "initial" }}
            sm
            title={translate("export.form.chooseExportAction")}
          >
            <ExportActionPicker
              onSubmit={(exportActionId, exportActionParams) => {
                this.exportByAction(exportActionId, exportActionParams);
                this.setState({ showExportActions: false });
              }}
              onCancel={() => this.setState({ showExportActions: false })}
            />
          </ModalStyled>
        )}

        {/* Create enrichment request */}
        {showCreateRequest && (
          <ModalStyled sm title={translate("export.form.createRequest")}>
            <CreateRequest
              gtins={preProcessCodes(gtins)}
              tradeItems={shoppingCart}
              translate={translate}
              onCancel={() => this.setState({ showCreateRequest: false })}
              onCreated={() => {
                this.setState({ showCreateRequest: false });
                this.requestCreated();
              }}
            />
          </ModalStyled>
        )}
      </>
    );
  }
}

export default withShoppingCart(
  withRouter(withUser(withLocalization(Export)))
);
