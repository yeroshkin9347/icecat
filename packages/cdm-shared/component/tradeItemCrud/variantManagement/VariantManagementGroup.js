import React from "react";
import isEmpty from "lodash/isEmpty";
import find from "lodash/find";
import {
  Container,
  Row,
  Col,
  Label,
  Margin,
} from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { withTradeItemLocalContext } from "../store/TradeItemProvider";
import { withEditionLocalContext } from "../store/EditionProvider";
import { withPlatformLocalContext } from "../store/PlatformProvider";
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from "@mui/material/Stack";
import { ModalTitleStyled } from "../../styled/modal/ModalStyled";

class VariantManagementGroup extends React.Component {
  state = {
    editionForSelect: [],
    platformForSelect: [],
    editionSelected: [],
    platformSelected: [],
  };

  componentDidMount() {
    const { edition, platform, selectedValue, multiple } = this.props;
    if (!isEmpty(edition)) this.setState({ editionForSelect: edition });
    if (!isEmpty(platform)) this.setState({ platformForSelect: platform });

    if (selectedValue) {
      const { options } = selectedValue;
      this.setState({
        editionSelected: find(edition, ed => ed.value === options[8410]),
        platformSelected: multiple ? [] : find(platform, pt => pt.value === options[75]),
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { edition, platform } = this.props;
    if (edition !== prevProps.edition) {
      this.setState({ editionForSelect: edition });
    }
    if (platform !== prevProps.platform) {
      this.setState({ platformForSelect: platform });
    }
  }

  render() {
    const {
      selectedValue,
      multiple
    } = this.props;

    const { translate, onApply, onCancel } = this.props;
    const {
      editionForSelect,
      platformForSelect,
      editionSelected,
      platformSelected,
    } = this.state;

    const sortedEditionForSelect = editionForSelect.sort((a, b) => a.label.localeCompare(b.label));
    const sortedPlatformForSelect = platformForSelect.sort((a, b) => a.label.localeCompare(b.label));

    return (
      <>
        <ModalTitleStyled>{translate("tradeItemCrud.variant.modalTitle")}</ModalTitleStyled>
        <br />

        <Container fluid>
          <Row>
            {/* Edition */}
            <Col col>
              <Label>{translate("tradeItemCrud.variant.edition")}</Label>
              <Autocomplete
                multiple={!selectedValue}
                autoComplete
                includeInputInList
                value={editionSelected}
                onChange={(e, v) => {
                  this.setState({ editionSelected: v });
                }}
                getOptionLabel={o => o.label || ''}
                options={sortedEditionForSelect || []}
                filterOptions={
                  createFilterOptions({
                    matchFrom: 'any',
                    limit: 50,
                    stringify: (o) => o.label,
                  })
                }
                renderInput={(params) =>
                  <TextField
                    {...params}
                    className="form-field"
                    size="small"
                    hiddenLabel
                    fullWidth/>
                }
              />
            </Col>

            {/* Platform */}
            <Col col>
              <Label>{translate("tradeItemCrud.variant.platform")}</Label>
              <Autocomplete
                multiple={multiple}
                autoComplete
                includeInputInList
                value={platformSelected}
                onChange={(e, v) => {
                  this.setState({ platformSelected: v });
                }}
                getOptionLabel={o => o.label || ''}
                options={sortedPlatformForSelect || []}
                filterOptions={
                  createFilterOptions({
                    matchFrom: 'any',
                    limit: 50,
                    stringify: (o) => o.label,
                  })
                }
                renderInput={(params) =>
                  <TextField
                    {...params}
                    className="form-field"
                    size="small"
                    hiddenLabel
                    fullWidth/>
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
                <Button onClick={(e) => onCancel && onCancel()} variant="outlined">
                  {translate("tradeItemCrud.variant.modalCancel")}
                </Button>

                {/* Apply */}
                <Button
                  onClick={(e) => onApply && onApply(editionSelected, platformSelected)}
                  noMargin
                  variant="contained"
                >
                  {translate("tradeItemCrud.variant.modalApply")}
                </Button>
              </Stack>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default withPlatformLocalContext(
  withEditionLocalContext(
    withTradeItemLocalContext(
      withLocalization(VariantManagementGroup)
    )
  )
);
