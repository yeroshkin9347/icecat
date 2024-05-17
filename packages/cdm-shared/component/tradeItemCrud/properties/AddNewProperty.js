import React from "react";
import styled from "styled-components";
import filter from "lodash/filter";
import find from "lodash/find";
import get from "lodash/get";
import values from "lodash/values";
import {
  Button,
  Icon,
  Label,
  Col,
  RoundedButton
} from "cdm-ui-components";
import { ic_add_circle } from "react-icons-kit/md/ic_add_circle";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { withTradeItemPropertiesLocalContext } from "../store/TradeItemPropertiesProvider";
import { ic_done } from "react-icons-kit/md/ic_done";
import { ic_close } from "react-icons-kit/md/ic_close";
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const NewPropertyWrapper = styled.div`
  position: relative;
  padding-right: 50px;
`;

class AddNewProperty extends React.Component {
  state = {
    adding: false,
    addedProperties: [],
    properties: []
  };

  componentDidUpdate(prevProps, prevState) {
    // refresh list of properties
    if (!prevState.adding && this.state.adding) {
      this.refreshProperties();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.adding !== nextState.adding) return true;
    if (this.state.addedProperties !== nextState.addedProperties) return true;
    if (this.state.properties !== nextState.properties) return true;
    return false;
  }

  refreshProperties() {
    const { existingProperties, tradeItemProperties } = this.props;

    const { addedProperties } = this.state;

    const newProperties = values(
      filter(
        tradeItemProperties,
        (property, key) =>
          !find(
            existingProperties,
            p => get(p, "id") === get(property, "id")
          ) && !find(addedProperties, p => get(p, "id") === get(property, "id"))
      )
    );

    this.setState({ properties: newProperties });
  }

  getTranslatedLabel = (options) => {
    const { currentLocaleCode } = this.props;
    return options.name;
    // if (options?.name?.values.length > 0){
    //   const correctValue = options.name.values.filter(v=> v.languageCode === currentLocaleCode);
    //   return correctValue.length > 0 ? correctValue[0].value : options.code;
    // } else {
    //   return options.code;
    // }
  }

  render() {
    const { properties, adding, addedProperties } = this.state;

    const { translate, onSubmit } = this.props;

    return (
      <Col col={adding ? 8 : 4}>
        <Label>&nbsp;</Label>

        {!adding && (
          <Button
            onClick={e => this.setState({ adding: true })}
            small
            block
            light
          >
            <Icon size={16} icon={ic_add_circle} />
            &nbsp;
            {translate("tradeItemCrud.properties.addNew")}
          </Button>
        )}

        {/* Select properties */}
        {adding && (
          <>
            <Label>{translate(`tradeItemCrud.properties.addNew`)}</Label>

            <NewPropertyWrapper>
              <Autocomplete
                disablePortal
                multiple
                autoComplete
                includeInputInList
                value={addedProperties}
                onChange={(e, v) => {
                  this.setState({ addedProperties: v })
                }}
                getOptionLabel={o => this.getTranslatedLabel(o) || ''}
                options={properties || []}
                filterOptions={
                  createFilterOptions({
                    matchFrom: 'any',
                    limit: 100,
                    stringify: (o) => this.getTranslatedLabel(o),
                  })
                }
                renderInput={(params) =>
                  <TextField
                    className="form-field"
                    {...params}
                    size="small"
                    hiddenLabel
                    fullWidth
                  />
                }
              />

              {/* Add properties */}
              <RoundedButton
                style={{
                  position: "absolute",
                  right: 0,
                  top: "-5px"
                }}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSubmit && onSubmit(addedProperties);
                  this.setState({
                    adding: false,
                    addedProperties: [],
                    properties: []
                  });
                }}
                success
                small
              >
                <Icon icon={ic_done} size={12} />
              </RoundedButton>

              {/* Cancel */}
              <RoundedButton
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: "-5px"
                }}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  this.setState({
                    adding: false,
                    addedProperties: [],
                    properties: []
                  });
                }}
                light
                small
              >
                <Icon icon={ic_close} size={12} />
              </RoundedButton>
            </NewPropertyWrapper>
          </>
        )}

        <br />
      </Col>
    );
  }
}

export default withLocalization(
  withTradeItemPropertiesLocalContext(AddNewProperty)
);
