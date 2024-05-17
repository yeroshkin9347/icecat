import React from "react";
import withUser from "cdm-shared/redux/hoc/withUser";
import { getActionsResult, launchActionById } from "cdm-shared/services/export";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { get, isEmpty, map } from "lodash";
import { Button, Col, Loader, Padding, Row } from "cdm-ui-components";
import { getCollectionsExportAction } from "cdm-shared/services/collection";
import { browserDownload } from "cdm-shared/utils/url";
import moment from "moment";

class CollectionExcelExport extends React.Component {
  state = {
    selectedExportActionId: null,
    pdfWithPrice: false,
    downloading: false,
    exportActionParams: {},
    toast: false,
    error: "",
  };

  componentDidMount() {
    this.setState({ exporting: true });
    getCollectionsExportAction().then((res) => {
      const actionId = res.data;
      if (res.data) {
        this.setState({ selectedExportActionId: actionId }, this.export);
      }
    });
  }

  showToast() {
    this.setState({ toast: true }, () => {
      setTimeout(() => this.setState({ toast: false }), 5000);
    });
  }

  getFileName(extension) {
    const { user, collection } = this.props;
    const manufacturer = get(user, "organization_name", "");
    const collectionName = get(collection, "name", "");

    return `${manufacturer}_${collectionName}_${moment().format(
      "YYYYMMDD_HHmmss"
    )}.${extension}`;
  }

  async exportWatch(exportActionResultId, fileName) {
    const { onSuccess, onFailure } = this.props;
    this.setState({ downloading: true });
    return getActionsResult(exportActionResultId)
      .then(async (actionResult) => {
        if (
          get(actionResult, "data.detailedStatus.statusCode") ===
          "TRADE_ITEM_NOT_AVAILABLE"
        ) {
          this.props.onError(
            this.props.translate("export.pdf.tradeItemNotAvailable")
          );
          this.setState({ downloading: false });
        } else if (get(actionResult, "data.status") === "InProgress") {
          setTimeout(
            () => this.exportWatch(exportActionResultId, fileName),
            2500
          );
        } else if (
          !isEmpty(get(actionResult, "data.output.GeneratedFilesPaths"))
        ) {
          const path = get(actionResult, "data.output.GeneratedFilesPaths[0]");
          const extension = path.split(".").pop();
          await browserDownload(
            path,
            `${fileName ? `${fileName}` : this.getFileName(extension)}`
          );
          this.setState({ downloading: false });
          onSuccess && onSuccess();
        } else {
          this.setState({ downloading: false });
          onFailure && onFailure();
        }
      })
      .catch((err) => onFailure && onFailure(err));
  }

  async export() {
    const { selectedExportActionId } = this.state;

    const pricesResponse = await this.props.fetchCollectionPriceFn();
    const collectionPrices = get(pricesResponse, "data.results", []);

    const TradeItemIds = map(collectionPrices, "tradeItemId");

    await launchActionById(selectedExportActionId, { TradeItemIds })
      .then((res) => {
        const resultId = res.data.id;
        if (resultId) {
          return this.exportWatch(resultId);
        }
      })
      .finally(() => this.setState({ exporting: false }));
  }

  render() {
    const { exporting, downloading } = this.state;
    const { translate, onCancel } = this.props;
    return (
      <Row>
        <Col center col>
          <h3>{translate("collections.generateFile")}</h3>
          <br />
          {(exporting || downloading) && <Loader />}
          <Padding top={5} />
          <Button
            light
            small
            onClick={(e) => {
              e.preventDefault();
              onCancel();
            }}
            className="btn btn-outline-dark text-uppercase"
          >
            {translate("export.pdf.cancel")}
          </Button>
        </Col>
      </Row>
    );
  }
}

export default withUser(
  withLocalization(CollectionExcelExport)
);
