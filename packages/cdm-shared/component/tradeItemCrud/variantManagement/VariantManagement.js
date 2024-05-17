import React from "react";
import get from "lodash/get";
import findIndex from "lodash/findIndex";
import ContextualZone from "../ContextualZone";
import {
  Button,
  Text,
  Container,
  Margin,
  Icon,
  RoundedButton,
} from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { withTradeItemLocalContext } from "../store/TradeItemProvider";
import VariantManagementGroup from "./VariantManagementGroup";
import { withGroupLocalContext } from "../store/PropertyGroupProvider";
import Variants from "./Variants";
import { newUuid } from "../../../utils/random";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { sortVariants, map75To41473Value } from "./variantManagement.helpers";
import { Add as AddIcon } from "@mui/icons-material";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "20%",
  transform: "translate(-10%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

class VariantManagement extends React.Component {
  state = {
    showAdd: false,
    editGroupIndex: null,
  };

  render() {
    const { tradeItem, selectedVariantIndex } = this.props;
    const {
      translate,
      removeTradeItemValue,
      setTradeItemValue,
      setSelectedVariantIndex,
    } = this.props;

    const { showAdd, editGroupIndex } = this.state;

    return (
      <>
        {/* Main zone showing all of the current channels */}
        <ContextualZone>
          <Text bold>
            {translate("tradeItemCrud.variant.title")}

            <Button
              style={{ marginLeft: "2em" }}
              onClick={(e) => {
                setSelectedVariantIndex(null);
              }}
              small
              primary
              noMargin
            >
              Master
            </Button>

            <RoundedButton
              onClick={(e) => this.setState({ showAdd: true })}
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

            <Variants
              tradeItem={tradeItem}
              selectedVariantIndex={selectedVariantIndex}
              onEdit={(index) => this.setState({ editGroupIndex: index })}
              onAdd={(index) => {
                this.setState({ showAdd: true, editGroupIndex: index });
              }}
              removeTradeItemValue={removeTradeItemValue}
              setSelectedVariantIndex={setSelectedVariantIndex}
              translate={translate}
            />
          </Container>
        </ContextualZone>

        {/* Add modal */}
        {showAdd && !editGroupIndex && (
          <Modal style={{ overflow: "initial" }} md open={showAdd}>
            <Box sx={styleModal}>
              <VariantManagementGroup
                multiple={true}
                onApply={(editionSelected, platformSelected) => {
                  const variants = get(tradeItem, "variantDefinitions", []);
                  const newPlatformVariants = [];
                  editionSelected.map((es) => {
                    const editionTradeItemId = newUuid();
                    const variant = {
                      options: {
                        8410: es.value,
                        75: null,
                      },
                      tradeItemId: editionTradeItemId,
                      parentsTradeItemIds: [tradeItem.tradeItemId],
                    };
                    variants.push(variant);
                    platformSelected.map((ps) => {
                      const variant = {
                        options: {
                          8410: es.value,
                          75: ps.value,
                        },
                        tradeItemId: newUuid(),
                        parentsTradeItemIds: [editionTradeItemId],
                      };
                      variants.push(variant);
                      newPlatformVariants.push(variant);
                    });
                  });

                  // Set feature 41473 for to new variants
                  const variantValues = get(
                    tradeItem,
                    "marketing.0.variantValues",
                    []
                  );
                  const edition41473Values = _.uniq(
                    _.compact(
                      _.flatten([
                        variants.map((v) => v.options["75"]),
                        newPlatformVariants.map((v) => v.options["75"]),
                      ])
                    )
                  );
                  if (edition41473Values) {
                    newPlatformVariants.forEach((newVariant) => {
                      variantValues.push({
                        tradeItemId: newVariant.tradeItemId,
                        values: {
                          41473: edition41473Values
                            .filter((v) => v !== newVariant.options["75"])
                            .map((v) => map75To41473Value(v)),
                          75: get(newVariant, "options.75"),
                        },
                      });
                    });
                    setTradeItemValue(
                      "marketing.0.variantValues",
                      variantValues
                    );
                  }

                  setTradeItemValue("variantDefinitions", variants);
                  this.setState({ showAdd: false });
                }}
                onCancel={() => this.setState({ showAdd: false })}
              />
            </Box>
          </Modal>
        )}

        {/* Edit modal */}
        {editGroupIndex !== null && (
          <Modal
            open={editGroupIndex !== null}
            style={{ overflow: "initial" }}
            md
          >
            <Box sx={styleModal}>
              <VariantManagementGroup
                multiple={showAdd}
                selectedValue={get(
                  tradeItem,
                  `variantDefinitions.${editGroupIndex}`,
                  {}
                )}
                onApply={(editionSelected, platformSelected) => {
                  const value = get(
                    tradeItem,
                    `variantDefinitions.${editGroupIndex}`,
                    {}
                  );
                  const variants = get(tradeItem, "variantDefinitions", []);

                  const selectedVariantId = get(
                    tradeItem,
                    `variantDefinitions.${selectedVariantIndex}.tradeItemId`,
                    {}
                  );
                  if (showAdd) {
                    const newVariants = platformSelected.map((platform) => ({
                      options: {
                        8410: editionSelected.value,
                        75: platform.value,
                      },
                      tradeItemId: newUuid(),
                      parentsTradeItemIds: [value.tradeItemId],
                    }));

                    // Add feature 41473 for new variants from edition
                    const variantValues = get(
                      tradeItem,
                      "marketing.0.variantValues",
                      []
                    );
                    const edition41473Value = _.uniq(
                      [...variants, ...newVariants]
                        .map((v) => get(v, "options.75"))
                        .filter((v) => v)
                    );
                    if (edition41473Value) {
                      newVariants.forEach((newVariant) => {
                        variantValues.push({
                          tradeItemId: newVariant.tradeItemId,
                          values: {
                            41473: edition41473Value
                              .filter((v) => v !== newVariant.options["75"])
                              .map((v) => map75To41473Value(v)),
                            75: get(newVariant, "options.75"),
                          },
                        });
                      });

                      setTradeItemValue(
                        "marketing.0.variantValues",
                        variantValues
                      );
                    }

                    variants.splice(editGroupIndex + 1, 0, ...newVariants);
                  } else {
                    if (value && !value.options["75"]) {
                      variants.forEach((variant) => {
                        if (
                          value.tradeItemId !== variant.tradeItemId &&
                          variant.options["8410"] === value.options["8410"]
                        ) {
                          variant.options["8410"] = editionSelected.value;
                        }
                      });
                    }

                    const existingEdition = variants.find((variant) => {
                      return variant.options["8410"] === editionSelected.value;
                    });

                    const editVariant = {
                      options: {
                        8410: editionSelected.value,
                        75: platformSelected ? platformSelected.value : null,
                      },
                      tradeItemId: value.tradeItemId,
                      parentsTradeItemIds: value.parentsTradeItemIds,
                    };

                    if (existingEdition) {
                      variants[editGroupIndex] = editVariant;
                    } else {
                      const newEditionTradeItemId = newUuid();
                      variants.splice(editGroupIndex, 1);
                      variants.push({
                        options: {
                          8410: editionSelected.value,
                          75: null,
                        },
                        tradeItemId: newEditionTradeItemId,
                        parentsTradeItemIds: [tradeItem.tradeItemId],
                      });
                      editVariant.parentsTradeItemIds = [newEditionTradeItemId];
                      variants.push(editVariant);
                    }
                  }
                  sortVariants(variants);

                  setTradeItemValue("variantDefinitions", variants);

                  const updatedSelectedVariantIndex = findIndex(
                    variants,
                    (variant) => variant.tradeItemId === selectedVariantId
                  );
                  setSelectedVariantIndex(
                    updatedSelectedVariantIndex > -1
                      ? updatedSelectedVariantIndex
                      : null
                  );

                  this.setState({ editGroupIndex: null, showAdd: false });
                }}
                onCancel={() =>
                  this.setState({ editGroupIndex: null, showAdd: false })
                }
              />
            </Box>
          </Modal>
        )}
      </>
    );
  }
}

export default withLocalization(
  withGroupLocalContext(withTradeItemLocalContext(VariantManagement))
);
