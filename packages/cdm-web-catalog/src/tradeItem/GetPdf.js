import React from "react";
import fileDownload from "js-file-download";
import get from "lodash/get";
import {
  Row,
  Col,
  Label,
  Input,
  H3,
  Button,
  Loader,
  Padding
} from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { getTradeItemPdf } from "cdm-shared/services/product";
import { formatDate } from 'cdm-shared/utils/date';

class GetPdf extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pdfWithPrice: false,
      downloading: false
    };
  }

  exportPdf() {
    const { pdfWithPrice } = this.state;

    const { gtin, manufacturerExternalId, langCode } = this.props;

    this.setState({ downloading: true });
    getTradeItemPdf(
      gtin,
      manufacturerExternalId,
      langCode,
      pdfWithPrice ? "true" : "false"
    )
      .then(res => {
        fileDownload(get(res, "data"), `product-sheet-${gtin}_${formatDate(new Date(), "YYYYMMDD_HHmm")}.pdf`);
        this.setState({ downloading: false });
      })
      .catch(err => {
        this.setState({ downloading: false });
        alert("Error");
        console.error(err);
      });
  }

  render() {
    const { pdfWithPrice, downloading } = this.state;

    const { translate } = this.props;

    return (
      <>
        <H3>{translate("tradeitem.pdf.title")}</H3>

        {/* Choice */}
        <Row>
          <Col col center>
            {/* without price */}
            <Label htmlFor="without-price">
              {translate("tradeitem.pdf.withoutPrice")}
            </Label>
            &nbsp;&nbsp;
            <Input
              id="without-price"
              type="checkbox"
              onChange={e => this.setState({ pdfWithPrice: !e.target.checked })}
              checked={!pdfWithPrice}
            />
            {/* with price */}
            &nbsp;&nbsp;
            <Label htmlFor="with-price">
              {translate("tradeitem.pdf.withPrice")}
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
          </Col>
        </Row>

        {/* Actions */}
        <Row>
          <Col col center>
            <Padding top={4} />

            {!downloading && (
              <Button onClick={e => this.exportPdf()} primary noMargin>
                {translate("tradeitem.pdf.download")}
              </Button>
            )}

            {downloading && <Loader />}
          </Col>
        </Row>
      </>
    );
  }
}

export default withLocalization(GetPdf);
