import React, { useEffect, useState } from "react";
import {
  Container,
  Margin,
  Text,
  RoundedButton,
  Icon,
} from "cdm-ui-components";
import { ic_mode_edit } from "react-icons-kit/md/ic_mode_edit";
import Table, {
  TableCellWithTooltip,
  TableCellWithTooltipComponent,
} from "cdm-shared/component/Table";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { TableActionsWrapper } from "./table/styles";
import { getRequestedTradeItem } from "../../services/product";
import ContextualZone from "./ContextualZone";
import { get, uniq } from "lodash";
import { withGroupLocalContext } from "./store/PropertyGroupProvider";
import { withTradeItemLocalContext } from "./store/TradeItemProvider";
import { getRetailersByIds } from "../../services/retailer";
import { parseDate } from "../../utils/date";
import EnrichmentManagementGroup from "./enrichmentManagement/enrichmentManagementGroup";
import { IconButton } from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import {
  updateEnrichment,
  removeEnrichment,
  createMatchedEnrichmentRequest,
} from "../../services/enrichment";
import { unmatchByTradeItemId } from "../../services/enrichment";
import { useEnrichmentUpdate } from "./enrichmentManagement/useEnrichmentUpdate";

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

const EnrichmentMatched = ({ tradeItem, selectedVariantIndex }) => {
  const columns = [
    {
      id: "retailer-name",
      Header: "Retailer Name",
      accessor: ({ retailerName, retailerManufacturerName }) =>
        retailerName || retailerManufacturerName,
      Cell: TableCellWithTooltip,
    },
    {
      Header: "TradeItem Retailer Code (SKU)",
      accessor: "tradeItemRetailerCode",
      Cell: TableCellWithTooltip,
    },
    {
      Header: "Language Code",
      accessor: "languageCode",
      Cell: TableCellWithTooltip,
    },
    {
      Header: "Release Date",
      accessor: "releaseDate",
      Cell: ({ value }) => {
        return (
          <TableCellWithTooltipComponent
            value={value ? parseDate(value) : ""}
          />
        );
      },
    },
    {
      Header: "Actions",
      id: "actions",
      Cell: ({ index }) => {
        return (
          <TableActionsWrapper>
            <RoundedButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const selectedEnrichment = enrichment[index];
                setSelectedEnrichment(selectedEnrichment);
                handleShowEditChange();
              }}
              secondary
              small
            >
              <Icon icon={ic_mode_edit} size={12} />
            </RoundedButton>

            <IconButton
              color="error"
              size="large"
              aria-label="Remove"
              sx={{
                padding: 0.5,
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const item = enrichment[index];
                addToUpdateQueue(item.id, removeEnrichment);
                setEnrichment((prev) => {
                  const index = item.id
                    ? prev.findIndex((i) => i.id === item.id)
                    : prev.findIndex(
                        (i) =>
                          i.retailerId === item.retailerId &&
                          i.languageCode === item.languageCode
                      );
                  if (index !== -1) {
                    const updatedEnrichment = [
                      ...prev.slice(0, index),
                      ...prev.slice(index + 1),
                    ];
                    return updatedEnrichment;
                  }
                  return prev;
                });
              }}
            >
              <DeleteIcon fontSize="medium" />
            </IconButton>
          </TableActionsWrapper>
        );
      },
    },
  ];

  const tradeItemId =
    selectedVariantIndex !== null
      ? get(tradeItem, `variantDefinitions.${selectedVariantIndex}.tradeItemId`)
      : get(tradeItem, "tradeItemId");

  const [selectedEnrichment, setSelectedEnrichment] = useState({});
  const [enrichment, setEnrichment] = useState([]);
  const [gtin, setGtin] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const { addToUpdateQueue, needsUpdate, setNeedsUpdate } =
    useEnrichmentUpdate();

  const handleShowEditChange = () => {
    setShowEdit((prev) => !prev);
  };

  const handleInputChange = (key, value) => {
    setSelectedEnrichment((prev) => ({ ...prev, [key]: value }));
  };

  const handleTradeItemsUnmatched = (tradeItemId) => {
    handleShowEditChange();
    setEnrichment((prev) => {
      const index = selectedEnrichment.id
        ? prev.findIndex((i) => i.id === selectedEnrichment.id)
        : prev.findIndex(
            (i) =>
              i.retailerId === selectedEnrichment.retailerId &&
              i.languageCode === selectedEnrichment.languageCode
          );
      if (index !== -1) {
        // Copy the array to avoid mutating the state directly
        const updatedEnrichment = [...prev];
        // Update the specific item in the array
        updatedEnrichment[index] = {
          ...updatedEnrichment[index],
          matchedTradeItems: updatedEnrichment[index].matchedTradeItems.filter(
            (item) => item.tradeItemId !== tradeItemId
          ),
        };
        // Return the updated array
        return updatedEnrichment;
      }
      // If the item is not found, return the unchanged state
      return prev;
    });
    const payload = {
      matchedTradeItemId: tradeItemId,
      tradeItemId: selectedEnrichment.id,
    };
    addToUpdateQueue(payload, unmatchByTradeItemId);
  };

  const handleApply = () => {
    if (!isCreating) {
      setEnrichment((prev) => {
        const index = selectedEnrichment.id
          ? prev.findIndex((i) => i.id === selectedEnrichment.id)
          : prev.findIndex(
              (i) =>
                i.retailerId === selectedEnrichment.retailerId &&
                i.languageCode === selectedEnrichment.languageCode
            );
        const updatedEnrichment = [...prev];
        updatedEnrichment[index] = selectedEnrichment;

        return updatedEnrichment;
      });
      addToUpdateQueue(selectedEnrichment, updateEnrichment);
    } else {
      setEnrichment((prev) => [...prev, selectedEnrichment]);
      addToUpdateQueue(selectedEnrichment, createMatchedEnrichmentRequest);
      setIsCreating(false);
    }
    handleShowEditChange();
  };

  const fetchData = async () => {
    const tradeItem = await getRequestedTradeItem(tradeItemId);
    setGtin(tradeItem.data[0]?.gtin?.value || null);
    const enrichment = tradeItem.data || [];
    const retailerIds = uniq(enrichment.map(({ retailerId }) => retailerId));
    if (retailerIds.length) {
      getRetailersByIds(retailerIds)
        .then((res) => {
          const retailers = res.data || [];
          if (retailers.length) {
            setEnrichment(
              enrichment.map((item) => {
                const retailer = retailers.find(
                  (r) => r.id === item.retailerId
                );
                return {
                  ...item,
                  retailerName: get(retailer, "name", ""),
                };
              })
            );
          } else {
            setEnrichment(enrichment);
          }
        })
        .catch(() => {
          setEnrichment(enrichment);
        });
    } else {
      setEnrichment(enrichment);
    }
  };

  useEffect(async () => {
    if (tradeItemId) {
      fetchData();
    }
  }, [tradeItemId]);

  useEffect(() => {
    const fetchDataAndUpdate = async () => {
      if (tradeItemId && needsUpdate) {
        await fetchData();
        setNeedsUpdate(false);
      }
    };

    fetchDataAndUpdate();
  }, [needsUpdate]);

  return (
    <>
      <ContextualZone>
        <Text bold>
          {"Matching"}
          <RoundedButton
            onClick={(e) => {
              setSelectedEnrichment({
                matchedTradeItems: [
                  {
                    tradeItemId: tradeItemId,
                  },
                ],
                tradeItemId: tradeItemId,
                gtin: gtin,
              });
              setIsCreating(true);
              handleShowEditChange();
            }}
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

        <Container style={{ padding: "0" }}>
          <Margin top={4} />
          <Table
            columns={columns}
            data={enrichment}
            manual
            sortable={false}
            showFilters={false}
            showPagination={false}
            showPageSizeOptions={false}
            defaultPageSize={0}
          />
        </Container>
      </ContextualZone>

      {/* Edit modal */}
      {showEdit && (
        <Modal
          md
          open={true}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleModal}>
            <EnrichmentManagementGroup
              selectedEnrichment={selectedEnrichment}
              setSelectedEnrichment={setSelectedEnrichment}
              addToUpdateQueue={addToUpdateQueue}
              isCreating={isCreating}
              onTradeItemUnmatched={handleTradeItemsUnmatched}
              onChange={handleInputChange}
              onApply={handleApply}
              onCancel={handleShowEditChange}
            />
          </Box>
        </Modal>
      )}
    </>
  );
};

export default withGroupLocalContext(
  withTradeItemLocalContext(EnrichmentMatched)
);
