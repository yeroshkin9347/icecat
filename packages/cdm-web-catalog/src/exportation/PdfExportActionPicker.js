import React from "react";
import fileDownload from "js-file-download";
import isEmpty from "lodash/isEmpty";
import find from "lodash/find";
import get from "lodash/get";
import size from "lodash/size";
import { withLocalization } from "common/redux/hoc/withLocalization";
import withUser from "cdm-shared/redux/hoc/withUser";
import { getPdfExportAuthorizedActions } from "cdm-shared/redux/hoc/withAuth";
import {
  Loader,
  Button,
  Row,
  Col,
  P,
  Select,
  Margin,
  Label,
  Input
} from "cdm-ui-components";
import withActionPicking from "./withActionPicking";
import { getTradeItemPdf } from "cdm-shared/services/product";
import {
  launchActionById,
  getActionsResult,
  getByActionIdsForPdf
} from "cdm-shared/services/export";
import { browserDownload } from "cdm-shared/utils/url";
import ToysParameters from "./forms/ToysParameters";
import { triggerAnalyticsEvent } from "common/utils/analytics";
import { formatDate } from 'cdm-shared/utils/date';

// this component is self contained for reusability and its SOLID purpose
// i.e. only fetching export action that is going to be used for something (e.g. export of trade items)
// LEGACY PROPS: gtin, manufacturerExternalId
class PdfExportActionPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedExportActionId: null,
      pdfWithPrice: false,
      downloading: false,
      exportActionParams: {}
    };
    this.export = this.export.bind(this);
    this.exportWatch = this.exportWatch.bind(this);
  }

  // fetch export actions
  componentDidMount() {
    // from hoc withActionPicking
    const actionIds = getPdfExportAuthorizedActions(
      this.props.getCurrentUser()
    );
    if (!isEmpty(actionIds))
      this.props.fetchActions(actionIds).then(exportActions => {
        // if one action, automatic preselect it
        if (size(exportActions) === 1)
          this.setState({
            selectedExportActionId: get(exportActions, "[0].id", null)
          });
      });
  }

  exportLegacyPdf(gtin, manufacturerExternalId, langCode) {
    const { pdfWithPrice } = this.state;
    this.setState({ downloading: true });
    return getTradeItemPdf(
      gtin,
      manufacturerExternalId,
      langCode,
      pdfWithPrice ? "true" : "false"
    )
      .then(res => {
        const fileName = `product-sheet_${gtin}_${formatDate(new Date(), "YYYYMMDD_HHmm")}.pdf`;
        fileDownload(get(res, "data"), fileName);
        this.setState({ downloading: false });
      })
      .catch(err => {
        this.setState({ downloading: false });
        alert("Error");
        console.error(err);
      });
  }

  exportWatch(exportActionResultId, fileName, onSuccess, onFailure) {
    const { setToast } = this.props
    this.setState({ downloading: true });
    return getActionsResult(exportActionResultId)
      .then(actionResult => {
        if (
          get(actionResult, "data.detailedStatus.statusCode") === "TRADE_ITEM_NOT_AVAILABLE"
        ) {
          setToast();
          this.setState({ downloading: false });
        } else if (get(actionResult, "data.status") === "InProgress") {
          setTimeout(
            () =>
              this.exportWatch(
                exportActionResultId,
                fileName,
                onSuccess,
                onFailure
              ),
            2500
          );
        } else if (
          !isEmpty(get(actionResult, "data.output.GeneratedFilesPaths"))
        ) {
          browserDownload(
            get(actionResult, "data.output.GeneratedFilesPaths[0]"),
            `${fileName ? `${fileName}` : get(actionResult, "data.id")}`
          );
          this.setState({ downloading: false });
          onSuccess && onSuccess();
        } else {
          this.setState({ downloading: false });
          onFailure && onFailure();
        }
      })
      .catch(err => onFailure && onFailure(err));
  }

  export() {
    const { selectedExportActionId, exportActionParams } = this.state;

    const {
      gtin,
      manufacturerExternalId,
      langCode,
      tradeItemId,
      onSuccess,
      onFailure
    } = this.props;

    let prom = null;

    // pfv2 export
    if (selectedExportActionId) {
      const fileName = gtin
        ? `product_sheet_${gtin}_${formatDate(new Date(), "YYYYMMDD_HHmm")}.pdf`
        : `product_sheet_${formatDate(new Date(), "YYYYMMDD_HHmm")}.pdf`;
      const params = Object.assign(
        {},
        { TradeItemId: tradeItemId, ForceFullExport: true },
        exportActionParams
      );

      triggerAnalyticsEvent("Export", "Export PDF pf2");
      prom = launchActionById(selectedExportActionId, params);
      prom.then(res =>
        this.exportWatch(get(res, "data.id"), fileName, onSuccess, onFailure)
      );
    }
    // legacy export
    else {
      triggerAnalyticsEvent("Export", "Export PDF legacy");
      prom = this.exportLegacyPdf(gtin, manufacturerExternalId, langCode);
      prom
        .then(() => onSuccess && onSuccess())
        .catch(err => onFailure && onFailure(err));
    }
  }

  render() {
    const {
      selectedExportActionId,
      pdfWithPrice,
      downloading,
      exportActionParams
    } = this.state;

    const { exportActions, failedFetchActions, getCurrentUser } = this.props;

    const { onCancel, translate } = this.props;

    if (failedFetchActions) return <P>{translate("export.meta.error")}</P>;

    const hasPdfExportActions = !isEmpty(
      getPdfExportAuthorizedActions(getCurrentUser())
    );

    return (
      <>
        <Row>
          <Col center col>
            <P>{translate("export.pdf.title")}</P>
            <br />

            {!isEmpty(exportActions) && (
              <Select
                getOptionLabel={o => o.name}
                getOptionValue={o => o.id}
                hideSelectedOptions={true}
                placeholder=""
                closeMenuOnSelect={true}
                value={find(
                  exportActions,
                  action => action.id === selectedExportActionId
                )}
                onChange={action =>
                  this.setState({
                    selectedExportActionId: action ? action.id : null
                  })
                }
                options={exportActions}
              />
            )}
            <br />

            {selectedExportActionId && (
              <ToysParameters
                values={exportActionParams}
                onChange={newValues =>
                  this.setState({ exportActionParams: newValues })
                }
              />
            )}
          </Col>
        </Row>

        <Margin bottom={4} />

        {/* Choice price/no price (legacy only) */}
        {!hasPdfExportActions && (
          <Row>
            <Col col center>
              {/* without price */}
              <Label htmlFor="without-price">
                {translate("export.pdf.withoutPrice")}
              </Label>
              &nbsp;&nbsp;
              <Input
                id="without-price"
                type="checkbox"
                onChange={e =>
                  this.setState({ pdfWithPrice: !e.target.checked })
                }
                checked={!pdfWithPrice}
              />
              {/* with price */}
              &nbsp;&nbsp;
              <Label htmlFor="with-price">
                {translate("export.pdf.withPrice")}
              </Label>
              &nbsp;&nbsp;
              <Input
                id="with-price"
                type="checkbox"
                onChange={e =>
                  this.setState({ pdfWithPrice: !!e.target.checked })
                }
                checked={pdfWithPrice}
              />
              <Margin bottom={4} />
            </Col>
          </Row>
        )}

        {/* Actions */}
        <Row>
          <Col right col>
            {/* Cancel */}
            <Button
              light
              onClick={e => {
                e.preventDefault();
                onCancel();
              }}
              className="btn btn-outline-dark text-uppercase"
              small
            >
              {translate("export.pdf.cancel")}
            </Button>

            {/* Submit */}
            {!downloading && (
              <Button
                primary
                shadow
                style={{ marginRight: 0 }}
                onClick={e => {
                  e.preventDefault();
                  this.export();
                }}
                small
              >
                {translate("export.pdf.go")}
              </Button>
            )}

            {downloading && <Loader />}
          </Col>
        </Row>
      </>
    );
  }
}

export default withLocalization(
  withUser(withActionPicking(PdfExportActionPicker, getByActionIdsForPdf))
);
