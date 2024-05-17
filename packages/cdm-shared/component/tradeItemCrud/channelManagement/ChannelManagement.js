import React from "react";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import size from "lodash/size";
import ContextualZone from "../ContextualZone";
import {
  Text,
  //Modal,
  Container,
  Margin,
  RoundedButton
} from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { withTradeItemLocalContext } from "../store/TradeItemProvider";
import ChannelManagementGroup from "./ChannelManagementGroup";
import { withGroupLocalContext } from "../store/PropertyGroupProvider";
import {getNewObjectForGroup, KEYED_PROPERTIES_GROUPS} from '../manager';
import Channels from "./Channels";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Add as AddIcon} from '@mui/icons-material';

class ChannelManagement extends React.Component {
  state = {
    showAdd: false,
    editGroupIndex: null
  };

  render() {
    const {
      tradeItem,
      currentGroupKey,
      groupSelected,
      selectedGroupItemIndex
    } = this.props;

    const {
      translate,
      addTradeItemValue,
      removeTradeItemValue,
      setTradeItemValue,
      setSelectedGroupItemIndex,
      setIsDuplicatingChannel,
      addChangedMediaIds,
    } = this.props;

    const styleModal = {
      position: 'absolute',
      top: '50%',
      left: '20%',
      transform: 'translate(-10%, -50%)',
      width: '80%',
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
    };

    const { showAdd, editGroupIndex } = this.state;

    return (
      <>
        {/* Main zone showing all current channels */}
        <ContextualZone>
          <Text bold>
            {translate("tradeItemCrud.channel.title")}
            <RoundedButton
              onClick={e => this.setState({ showAdd: true })}
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              primary
              noMargin
            >
              <AddIcon fontSize="small" sx={{ color: "#fff" }} />
            </RoundedButton>
          </Text>

          {/* Display groups */}
          <Container fluid style={{ padding: "0 0 0 0" }}>
            <Margin top={4} />
            <Channels
              tradeItem={tradeItem}
              currentGroupKey={currentGroupKey}
              selectedGroupItemIndex={selectedGroupItemIndex}
              onEdit={index => this.setState({ editGroupIndex: index })}
              removeTradeItemValue={removeTradeItemValue}
              addTradeItemValue={addTradeItemValue}
              setSelectedGroupItemIndex={setSelectedGroupItemIndex}
              setIsDuplicatingChannel={setIsDuplicatingChannel}
            />
          </Container>
        </ContextualZone>

        {/* Add modal */}
        {showAdd && (
          <Modal md open={showAdd}
           aria-labelledby="modal-modal-title"
           aria-describedby="modal-modal-description"
          >
            <Box sx={styleModal}>
              <ChannelManagementGroup
                onApply={channelManagementGroup => {
                  // check emptiness
                  if (isEmpty(channelManagementGroup)) {
                    alert(translate("tradeItemCrud.channel.modalEmptyGroup"));
                    return;
                  }

                  // close
                  this.setState({ showAdd: false });

                  // add a new set of values
                  const newSelectedIndex = size(
                    get(tradeItem, currentGroupKey),
                    0
                  );
                  const newEntry = Object.assign(
                    {},
                    getNewObjectForGroup(groupSelected),
                    { channels: channelManagementGroup }
                  );
                  addTradeItemValue(currentGroupKey, newEntry);
                  setSelectedGroupItemIndex(newSelectedIndex);
                }}
                onCancel={() => this.setState({ showAdd: false })}
              />
            </Box>
          </Modal>
        )}

        {/* Edit modal */}
        {editGroupIndex !== null && (
          <Modal md open={true} style={{borderRadius: 4}}>
            <Box sx={styleModal}>
              <ChannelManagementGroup
                group={get(
                  tradeItem,
                  `${currentGroupKey}.${editGroupIndex}.channels`,
                  []
                )}
                onApply={channelManagementGroup => {
                  // check emptiness
                  if (isEmpty(channelManagementGroup)) {
                    alert(translate("tradeItemCrud.channel.modalEmptyGroup"));
                    return;
                  }

                  // update the current group
                  setTradeItemValue(
                    `${currentGroupKey}.${editGroupIndex}.channels`,
                    [...channelManagementGroup]
                  );

                  // add changed media ids
                  if (currentGroupKey === KEYED_PROPERTIES_GROUPS.IMAGES || currentGroupKey === KEYED_PROPERTIES_GROUPS.DOCUMENTS) {
                    const images = get(tradeItem, `${currentGroupKey}.${editGroupIndex}.values`, []);
                    images.forEach(image => {
                      addChangedMediaIds(image.id);
                    });
                  }

                  // close
                  this.setState({ editGroupIndex: null });
                }}
                onCancel={() => this.setState({ editGroupIndex: null })}
              />
            </Box>
          </Modal>
        )}
      </>
    );
  }
}

export default withLocalization(
  withGroupLocalContext(withTradeItemLocalContext(ChannelManagement))
);
