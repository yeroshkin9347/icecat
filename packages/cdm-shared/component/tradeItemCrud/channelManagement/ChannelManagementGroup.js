import React from "react";
import dotProps from "dot-prop-immutable";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import map from "lodash/map";
import slice from "lodash/slice";
import indexOf from "lodash/indexOf";
import {
  Row,
  Col,
  Label,
  UploadZone,
  Margin,
} from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { withTradeItemLocalContext } from "../store/TradeItemProvider";
import ChannelRowItem from "./ChannelRowItem";
import VerticalDraggableList from "cdm-shared/component/VerticalDraggableList";
import { withTargetMarketsLocalContext } from "../store/TargetMarketProvider";
import { withRetailersLocalContext } from "../store/RetailerProvider";
import { DEFAULT_CHANNEL } from "../manager";

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { ModalTitleStyled } from "../../styled/modal/ModalStyled";
import { getDatePickerFormatByLocale } from "../../../redux/localization";

class ChannelManagementGroup extends React.Component {
  state = {
    editChannel: DEFAULT_CHANNEL,
    modifyChannelIndex: null,
    group: isEmpty(this.props.group) ? [] : [...this.props.group],
    targetMarketsForSelect: [],
    retailersForSelect: []
  };

  componentDidMount() {
    const { targetMarkets, retailers } = this.props;
    if (!isEmpty(targetMarkets))
      this.setState({
        targetMarketsForSelect: map(targetMarkets, (o, i) => {
          return { label: o, value: i };
        }).sort((a, b) => a.label.localeCompare(b.label))
      });
    if (!isEmpty(retailers))
      this.setState({
        retailersForSelect: map(retailers, (o, i) => {
          return { label: o, value: i };
        }).sort((a, b) => a.label.localeCompare(b.label))
      });
  }

  componentDidUpdate(prevProps) {
    if (this.props.targetMarkets !== prevProps.targetMarkets) {
      this.setState({
        targetMarketsForSelect: map(this.props.targetMarkets, (o, i) => {
          return { label: o, value: i };
        }).sort((a, b) => a.label.localeCompare(b.label))
      });
    }
    if (this.props.retailers !== prevProps.retailers) {
      this.setState({
        retailersForSelect: map(this.props.retailers, (o, i) => {
          return { label: o, value: i };
        }).sort((a, b) => a.label.localeCompare(b.label))
      });
    }
  }

  onChange(key, value) {
    this.setState({
      editChannel: dotProps.set(this.state.editChannel, key, value)
    });
  }

  addToGroup(channel) {
    const { translate } = this.props;
    if (
      channel.startDate === null &&
      channel.endDate === null &&
      isEmpty(channel.targetMarketIds) &&
      isEmpty(channel.retailerIds)
    ) {
      alert(translate("tradeItemCrud.channel.modalCannotAdd"));
      return;
    }
    this.setState({
      group: [...this.state.group, channel],
      editChannel: Object.assign({}, DEFAULT_CHANNEL)
    });
  }

  modifyChannel(channel, index) {
    this.setState({
      group: [
        ...slice(this.state.group, 0, index),
        channel,
        ...slice(this.state.group, index + 1)
      ],
      modifyChannelIndex: null,
      editChannel: Object.assign({}, DEFAULT_CHANNEL)
    });
  }

  render() {
    const {
      currentParsedLocaleCode
    } = this.props;

    const { translate, onApply, onCancel } = this.props;

    const {
      editChannel,
      group,
      targetMarketsForSelect,
      retailersForSelect,
      modifyChannelIndex
    } = this.state;

    const dateFormat= getDatePickerFormatByLocale();

    return (
      <>
        <ModalTitleStyled>{translate("tradeItemCrud.channel.modalTitle")}</ModalTitleStyled>
        <br />
        <Row>
          {/* Target markets */}
          <Col col>
            <Label>
              {translate("tradeItemCrud.channel.modalTargetMarket")}
            </Label>
            <Autocomplete
              multiple
              autoComplete
              includeInputInList
              value={filter(
                targetMarketsForSelect,
                r => indexOf(editChannel.targetMarketIds, r.value) !== -1
              )}
              onChange={(e, v) => {
                this.setState({
                  editChannel: dotProps.set(
                    editChannel,
                    `targetMarketIds`,
                    map(v, _v => _v['value'])
                  )
                })
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
                  className="form-field"
                  size="small"
                  hiddenLabel
                  fullWidth
                />
              }
            />
          </Col>

          {/* Retailers */}
          <Col col>
            <Label>{translate("tradeItemCrud.channel.modalRetailer")}</Label>
            <Autocomplete
              multiple
              autoComplete
              includeInputInList
              value={filter(
                retailersForSelect,
                r => indexOf(editChannel.retailerIds, r.value) !== -1
              )}
              onChange={(e, v) => {
                this.setState({
                  editChannel: dotProps.set(
                    editChannel,
                    `retailerIds`,
                    map(v, _v => _v['value'])
                  )
                })
              }}
              getOptionLabel={o => o.label || ''}
              options={retailersForSelect || []}
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
                  className="form-field"
                  size="small"
                  hiddenLabel
                  fullWidth
                />
              }
            />
          </Col>

          {/* Start date */}
          <Col col>
            <Label>{translate("tradeItemCrud.channel.modalStartDate")}</Label>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                onChange={d =>
                  this.onChange("startDate", d ? d : null)
                }
                value={editChannel.startDate}
                locale={currentParsedLocaleCode}
                inputFormat={dateFormat}
                block
                renderInput={(params) =>
                  <TextField
                    {...params}
                    className="form-field"
                    size="small"
                    hiddenLabel
                    fullWidth
                  />
                }
              />
            </LocalizationProvider>
          </Col>

          {/* End date */}
          <Col col>
            <Label>{translate("tradeItemCrud.channel.modalEndDate")}</Label>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                onChange={d =>
                  this.onChange("endDate", d ? d : null)
                }
                value={editChannel.endDate}
                locale={currentParsedLocaleCode}
                inputFormat={dateFormat}
                block
                renderInput={(params) =>
                  <TextField
                    {...params}
                    className="form-field"
                    size="small"
                    hiddenLabel
                    fullWidth
                  />
                }
              />
            </LocalizationProvider>
          </Col>
        </Row>

        <Row>
          {/* Add / Modify */}
          <Col col={3} offset={9} right>
            <Label>&nbsp;</Label>
            <Button
              onClick={e =>
                modifyChannelIndex === null
                  ? this.addToGroup(editChannel)
                  : this.modifyChannel(editChannel, modifyChannelIndex)
              }
              small
              secondary
              noMargin
              block
            >
              {modifyChannelIndex === null &&
                translate("tradeItemCrud.channel.modalAdd")}
              {modifyChannelIndex !== null &&
                translate("tradeItemCrud.channel.modalModify")}
            </Button>
          </Col>
        </Row>

        {/* List zone */}
        <Margin top={4} />
        <UploadZone
          borderRadius
          style={{ cursor: "inherit", color: "inherit" }}
        >
          {isEmpty(group) &&
            translate("tradeItemCrud.channel.modalNoChannel")}

          {!isEmpty(group) && (
            <VerticalDraggableList
              items={group}
              name="draggable-channels"
              usePortal={true}
              getItem={(item, index) => (
                <>
                  <ChannelRowItem
                    channel={item}
                    translate={translate}
                    onEdit={() =>
                      this.setState({
                        editChannel: Object.assign({}, item),
                        modifyChannelIndex: index
                      })
                    }
                    onDuplicate={() =>
                      this.setState({
                        group: [...group, Object.assign({}, item)]
                      })
                    }
                    onDelete={() => {
                      this.setState({
                        group: filter(group, (i, k) => k !== index)
                      });
                    }}
                  />

                  <br />
                </>
              )}
              onDragEnd={items =>
                modifyChannelIndex === null && this.setState({ group: items })
              }
            />
          )}
        </UploadZone>

        {/* Actions buttons */}
        <Margin top={5} />
        <Row>
          <Col right col>
            <Stack spacing={2} direction="row" style={{float: 'right'}}>
              {/* Cancel */}
              <Button onClick={e => onCancel && onCancel()}>
                {translate("tradeItemCrud.channel.modalCancel")}
              </Button>

              {/* Apply */}
              <Button onClick={e => onApply && onApply(group)} noMargin variant="contained">
                {translate("tradeItemCrud.channel.modalApply")}
              </Button>
            </Stack>
          </Col>
        </Row>
      </>
    );
  }
}

export default withRetailersLocalContext(
  withTargetMarketsLocalContext(
    withTradeItemLocalContext(
      withLocalization(ChannelManagementGroup)
    )
  )
);
