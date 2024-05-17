import React from "react";
import get from "lodash/get";
import ContextualZone from "../ContextualZone";
import {
  Text,
  Container,
  Margin,
  Icon,
  RoundedButton
} from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { withTradeItemLocalContext } from "../store/TradeItemProvider";
import IdentityManagementGroup from "./IdentityManagementGroup";
import { withGroupLocalContext } from "../store/PropertyGroupProvider";
import Identity from "./Identity";
import {Add as AddIcon} from '@mui/icons-material';

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

class IdentityManagement extends React.Component {
  state = {
    showAdd: false,
    editGroupIndex: null,
  };

  render() {
    const {
      tradeItem,
      selectedVariantIndex,
    } = this.props;
    const {
      translate,
      addTradeItemValue,
      removeTradeItemValue,
      setTradeItemValue,
    } = this.props;

    const { showAdd, editGroupIndex } = this.state;
    const selectedValue =
      selectedVariantIndex !== null
        ? get(tradeItem, `variantDefinitions.${selectedVariantIndex}.identities.${editGroupIndex}`, {})
        : get(tradeItem, `identities.${editGroupIndex}`, {});

    return (
      <>
        {/* Main zone showing all of the current channels */}
        <ContextualZone>
          <Text bold>
            {translate("tradeItemCrud.identity.title")}

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
          <Container fluid style={{ padding: "0" }}>
            <Margin top={4} />

            <Identity
              tradeItem={tradeItem}
              selectedVariantIndex={selectedVariantIndex}
              onEdit={index => this.setState({ editGroupIndex: index })}
              removeTradeItemValue={removeTradeItemValue}
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
              <IdentityManagementGroup
                onApply={identityData=> {
                  const identityPath =
                    selectedVariantIndex !== null
                      ? `variantDefinitions.${selectedVariantIndex}.identities`
                      : `identities`;
                  addTradeItemValue(identityPath, identityData);
                  this.setState({ showAdd: false });
                }}
                onCancel={() => this.setState({ showAdd: false })}
              />
            </Box>
          </Modal>
        )}

        {/* Edit modal */}
        {editGroupIndex !== null && (
          <Modal md open={true}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={styleModal}>
              <IdentityManagementGroup
                selectedValue={selectedValue}
                onApply={(identityData) => {
                  const identityPath =
                    selectedVariantIndex !== null
                      ? `variantDefinitions.${selectedVariantIndex}.identities.${editGroupIndex}`
                      : `identities.${editGroupIndex}`;
                  // Edit Identity
                  setTradeItemValue(identityPath, identityData);
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
  withGroupLocalContext(withTradeItemLocalContext(IdentityManagement))
);
