import React from "react";
import {
  Row,
  Col,
  Label,
  Margin,
} from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { withTradeItemLocalContext } from "../store/TradeItemProvider";
import { withEditionLocalContext } from "../store/EditionProvider";
import { withPlatformLocalContext } from "../store/PlatformProvider";
import { withTargetMarketsLocalContext } from "../store/TargetMarketProvider";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import { ModalTitleStyled } from "../../styled/modal/ModalStyled";

class IdentityManagementGroup extends React.Component {
  state = {
    gtin: null,
    targetMarketsForSelect: [],
    manufacturerCode: null,
    marketCode:null
  };

  componentDidMount() {
    const { selectedValue } = this.props;

    if (selectedValue) {
      const { gtin, marketCode, tradeItemManufacturerCode } = selectedValue;
      this.setState({ gtin: gtin.value, marketCode, manufacturerCode: tradeItemManufacturerCode });
    }

    const { targetMarkets } = this.props;
    if (!isEmpty(targetMarkets)) {
      this.setState({
        targetMarketsForSelect: map(targetMarkets, (o, i) => {
          return { label: o, value: i };
        }).sort((a, b) => a.label.localeCompare(b.label)),
      });
    }
  }

  render() {
    const { translate, onApply, onCancel } = this.props;
    const { gtin, marketCode, manufacturerCode, targetMarketsForSelect } = this.state;

    return (
      <>
        <ModalTitleStyled>{translate("tradeItemCrud.identity.modalTitle")}</ModalTitleStyled>
        <br />
        <Row>
          {/* gtin */}
          <Col col>
            <Label>{translate("tradeItemCrud.identity.gtin")}</Label>
            <TextField
              size="small"
              className="form-field"
              hiddenLabel
              fullWidth
              onChange={e => {this.setState({gtin:e.target.value})}}
              value={gtin}
              block
            />

          </Col>

          {/* manufacturerCode */}
          <Col col>
            <Label>{translate("tradeItemCrud.identity.manufacturerCode")}</Label>
            <TextField
              size="small"
              className="form-field"
              hiddenLabel
              fullWidth
              onChange={e => {this.setState({manufacturerCode: e.target.value})}}
              value={manufacturerCode}
              block
            />
          </Col>

          {/* marketCode */}
          <Col col>
            <Label>{translate("tradeItemCrud.identity.marketCode")}</Label>
            <Autocomplete
              autoComplete
              includeInputInList
              value={targetMarketsForSelect.find(i => i.label === marketCode) || null}
              onChange={(e, v) => {
                this.setState({ marketCode: v ? v.label : null })
              }}
              getOptionLabel={o => o.label || ''}
              options={targetMarketsForSelect || []}
              filterOptions={
                createFilterOptions({
                  matchFrom: 'any',
                  limit: 100,
                  stringify: (o) => o.label,
                })
              }
              renderInput={(params) =>
                <TextField
                  {...params}
                  size="small"
                  className="form-field"
                  hiddenLabel
                  fullWidth
                />
              }
            />
          </Col>
        </Row>

        {/* Actions buttons */}
        <Margin top={5} />
        <Row>
          <Col right col>
            <Stack spacing={2} direction="row" style={{float: 'right'}}>
              {/* Cancel */}
              <Button onClick={(e) => onCancel && onCancel()}>
                {translate("tradeItemCrud.identity.modalCancel")}
              </Button>

              {/* Apply */}
              <Button
                onClick={(e) => onApply && onApply({ gtin: { value: gtin }, tradeItemManufacturerCode: manufacturerCode, marketCode })}
                noMargin
                variant="contained"
              >
                {translate("tradeItemCrud.identity.modalApply")}
              </Button>
            </Stack>
          </Col>
        </Row>
      </>
    );
  }
}

export default withPlatformLocalContext(
  withTargetMarketsLocalContext(
    withEditionLocalContext(
      withTradeItemLocalContext(
        withLocalization(IdentityManagementGroup)
      )
    )
  )
);
