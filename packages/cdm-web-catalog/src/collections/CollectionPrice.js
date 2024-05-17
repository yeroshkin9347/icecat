import React, { useState, useMemo, useCallback, useEffect } from "react";
import "./index.css";
import {
  get,
  set,
  size,
  isArray,
  isEqual,
  isString,
  compact,
  camelCase,
  find,
  uniq,
} from "lodash";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  Button,
  H5,
  Label,
  Loader,
  Padding,
  Row,
  Text,
  Toast,
} from "cdm-ui-components";
import EditIcon from "@mui/icons-material/Edit";
import {
  deleteCollectionPricings,
  updateBulkPropertyForGroupValues,
  updateGroupValues,
} from "cdm-shared/services/collection";
import { withLocalization } from "common/redux/hoc/withLocalization";
import {
  DataGridPremium,
  GridColumnMenu,
  useGridApiRef,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridCellCheckboxRenderer,
  useKeepGroupedColumnsHidden,
  GRID_ROOT_GROUP_ID,
  useGridApiContext,
  GridRowModes,
} from "@mui/x-data-grid-premium";
import { Checkbox } from "@mui/material";
import PropertyForm from "cdm-shared/component/tradeItemCrud/properties/PropertyForm";
import {
  getValuesByPropertyCode,
  getValuesByPropertyCodes,
} from "cdm-shared/services/tradeItemProperties";
import { PRIMARY } from "cdm-shared/component/color";
import moment from "moment";
import LoaderFixed from "cdm-shared/component/LoaderFixed";
import { getLinkedRetailers } from "cdm-shared/services/subscription";
import RetailerEditComponent from "./RetailerEditComponent";
import PriceDateEditComponent, {
  getPriceDateFormatByLang,
} from "./PriceDateEditComponent";
import PriceNumberEditComponent from "./PriceNumberEditComponent";
import { priceProperties } from "./detail/constants/priceProperties";
import { enrichPriceDataWithTariffOverlap } from "./helpers";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import IconButton from "@mui/material/IconButton";
import withLocalProviders from "cdm-shared/component/tradeItemCrud/store/withLocalProviders";
import { ModalStyled } from "cdm-shared/component/styled/modal/ModalStyled";

const formatDate = (date) => {
  return date ? moment(date).format(getPriceDateFormatByLang()) : "";
};

const getYesNoValue = (val, key) => {
  return val === "Y" ||
    val === "Yes" ||
    get(val, "0") === "Y" ||
    get(val, "0") === "Yes"
    ? "Yes"
    : "No";
};

const CustomEditComponent = ({ taxonomyId, onChange, property, ...props }) => {
  const { id, field, value } = props;
  const apiRef = useGridApiContext();

  const handleValueChange = useCallback(
    (newValue) => {
      onChange(id, field, newValue);
      apiRef.current.setEditCellValue({ id, field, value: newValue });
    },
    [onChange, id, field]
  );

  const formattedValue = useMemo(() => {
    if (property) {
      const discriminator = get(property, "discriminator");
      const cardinality = get(property, "cardinality");
      if (discriminator === "ListProductPropertyViewModel") {
        if (cardinality === "Multiple") {
          return isString(value) ? compact(value.split(", ")) : value;
        } else {
          return isArray(value) ? get(value, "0", null) : value;
        }
      }
    }

    return value;
  }, [property, value]);

  const isEmpty =
    (formattedValue ?? false) === false ||
    (Array.isArray(formattedValue) && !formattedValue?.length);
  const wrapperStyle = isEmpty
    ? property?.nullable
      ? "nullable-empty"
      : "empty"
    : "filled";

  const propertyInput = useMemo(() => {
    switch (get(property, "discriminator")) {
      case "NumericProductPropertyViewModel":
        return (
          <PriceNumberEditComponent
            className={wrapperStyle}
            {...props}
            value={formattedValue}
            onChange={handleValueChange}
          />
        );
      default:
        return (
          <PropertyForm
            className={wrapperStyle}
            property={property}
            value={formattedValue}
            onChange={handleValueChange}
            disablePortal={false}
            debounceTime={2000}
          />
        );
    }
  }, [property, formattedValue, handleValueChange]);

  return (
    <div style={{ minWidth: "100%" }}>
      {property ? propertyInput : <Loader />}
    </div>
  );
};

const CollectionPrice = ({
  collection,
  prices = [],
  tradeItem,
  paginationModel: { rowCount, ...paginationModel },
  onDeletePricingSuccess,
  onPaginationModelChange,
  onRefreshPriceList,
  translate,
  currentLocaleCode,
}) => {
  const loaderRef = React.useRef(null);
  const loadingCountRef = React.useRef(0);
  const [, setUpdatedPrices] = React.useState(prices); // Used to trigger grid update
  const [massModifyValue, setMassModifyValue] = useState("");
  const [columnToMassModify, setColumnToMassModify] = React.useState(false);
  const [properties, setProperties] = React.useState({});
  const [property, setProperty] = React.useState(null);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState([]);
  const [showDeletePricingConfirmation, setShowDeletePricingConfirmation] =
    useState(false);
  const [showDeletePricingLoading, setShowDeletePricingLoading] =
    useState(false);

  const [processRowUpdateError, setProcessRowUpdateError] = useState(false);

  const [updateBulkLoading, setUpdateBulkLoading] = useState(false);

  const [retailers, setRetailers] = useState([]);

  const taxonomyId = useMemo(() => {
    return get(tradeItem, "taxonomyId");
  }, [tradeItem]);

  const isCheckedAll = useMemo(() => {
    return (
      size(selectedCollectionIds) > 0 &&
      size(selectedCollectionIds) === size(prices)
    );
  }, [selectedCollectionIds, prices]);

  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ["ean_manufacturer_reference"],
      },
      columns: {
        columnVisibilityModel: {
          // Hide the column used for leaves
          retailer_codes: false,
        },
        pagination: { paginationModel: { pageSize: 20, page: 0 } },
      },
    },
  });

  useEffect(() => {
    getLinkedRetailers().then((res) => {
      setRetailers(res.data);
    });
  }, []);

  useEffect(() => {
    if (taxonomyId) {
      getValuesByPropertyCodes(
        taxonomyId,
        currentLocaleCode,
        priceProperties
      ).then((res) => {
        setProperties(
          res.data.reduce(
            (prev, field) => ({
              ...prev,
              [field.code]: field,
            }),
            {}
          )
        );
      });
    }
  }, [taxonomyId, currentLocaleCode]);

  const deletePricings = useCallback(() => {
    setShowDeletePricingLoading(true);
    deleteCollectionPricings(collection.id, selectedCollectionIds).then(
      (res) => {
        if (res.status === 200) {
          setShowDeletePricingConfirmation(false);
          setShowDeletePricingLoading(false);
          onDeletePricingSuccess && onDeletePricingSuccess();
        }
      }
    );
  }, [collection?.id, selectedCollectionIds, onDeletePricingSuccess]);

  const getPriceRowFromOriginalPrice = useCallback(
    (price) => {
      return {
        id: price.id,
        ean: get(price, "metadata.values.ean.value"),
        isTariffWarned: get(price, "isTariffWarned"),
        manufacturer_reference: get(
          price,
          "metadata.values.manufacturer_reference.value"
        ),
        ean_manufacturer_reference: `${get(
          price,
          "metadata.values.ean.value"
        )}, ${get(price, "metadata.values.manufacturer_reference.value")}`,
        retailerIds: compact(get(price, "channels.0.retailerIds", [])),
        retailer_codes: compact(
          get(price, "channels.0.retailerIds", []).map((retailerId) =>
            find(retailers, { retailerId: retailerId })
          )
        ),
        original_start_date: get(price, "channels.0.startDate"),
        start_date: get(price, "channels.0.startDate")
          ? formatDate(get(price, "channels.0.startDate"))
          : "",
        original_end_date: get(price, "channels.0.endDate"),
        end_date: get(price, "channels.0.endDate")
          ? formatDate(get(price, "channels.0.endDate"))
          : "",
        currency_code: get(price, "metadata.values.currency_code.value"),
        catalog_price_without_tax: get(
          price,
          "metadata.values.catalog_price_without_tax.value"
        ),
        suggested_price: get(price, "metadata.values.suggested_price.value"),
        negociated_price: get(price, "metadata.values.negociated_price.value"),
        tax_type_code: get(price, "metadata.values.tax_type_code.value"),
        sorecop_tax_amount: get(
          price,
          "metadata.values.sorecop_tax_amount.value"
        ),
        green_tax_amount: get(price, "metadata.values.green_tax_amount.value"),
        weee_tax_amount: get(price, "metadata.values.weee_tax_amount.value"),
        rep_code: get(price, "metadata.values.rep_code.value"),
        rep_tax_organism_collector: get(
          price,
          "metadata.values.rep_tax_organism_collector.value"
        ),
        rep_paid_by_retailer: getYesNoValue(
          get(price, "metadata.values.rep_paid_by_retailer.value")
        ),
        drop_shipped: getYesNoValue(
          get(price, "metadata.values.drop_shipped.value")
        ),
        invoiced_from_france: getYesNoValue(
          get(price, "metadata.values.invoiced_from_france.value")
        ),
        discountable_rate: getYesNoValue(
          get(price, "metadata.values.discountable_rate.value")
        ),
      };
    },
    [retailers]
  );

  const pricesData = useMemo(() => {
    return enrichPriceDataWithTariffOverlap(
      prices.map((price) => getPriceRowFromOriginalPrice(price))
    );
  }, [getPriceRowFromOriginalPrice, prices]);

  const toggleAllGroups = useCallback(() => {
    const groups = apiRef.current.getRowNode(GRID_ROOT_GROUP_ID).children;

    groups.forEach((groupId) => {
      apiRef.current.setRowChildrenExpansion(groupId, true);
    });
  }, []);


  const getUpdatedPropertyValueByDiscriminator = useCallback(
    (property, val) => {
      const discriminator = get(property, "discriminator");
      switch (discriminator) {
        case "ListProductPropertyViewModel":
          const cardinality = get(property, "cardinality");
          if (cardinality === "Single") {
            return {
              value: isArray(val) ? get(val, "0") : val,
              discriminator: "StringPropertyValueViewModel",
            };
          }

          return {
            value: isArray(val) ? val : [val],
            discriminator: "StringListPropertyValueViewModel",
          };
        case "DateProductPropertyViewModel":
          return {
            value: val,
            discriminator: "DateTimePropertyValueViewModel",
          };
        case "NumericProductPropertyViewModel":
          return {
            value: val,
            discriminator: "NumericPropertyValueViewModel",
          };
        case "StringProductPropertyViewModel":
          return {
            value: val,
            discriminator: "StringPropertyValueViewModel",
          };
        default:
          return {
            value: val,
            discriminator,
          };
      }
    },
    []
  );

  const handleUpdatePrice = useCallback((price) => {
    setUpdatedPrices((prevUpdatedPrices) => {
      const priceIndex = prevUpdatedPrices.findIndex((p) => p.id === price.id);
      const newPrices = [...prevUpdatedPrices];
      newPrices[priceIndex] = price;

      const updatedPricesData = enrichPriceDataWithTariffOverlap(
        newPrices.map((price) => getPriceRowFromOriginalPrice(price))
      );

      const currentData = Array.from(apiRef.current.getRowModels())
        .map((([, value]) => ({ id: value.id, isTariffWarned: value.isTariffWarned })))
      const newData = updatedPricesData.map((priceData) => ({
        id: priceData.id,
        isTariffWarned: priceData.isTariffWarned,
      }));

      if (!isEqual(currentData, newData)) {
        apiRef.current.updateRows(newData);
      }

      return newPrices;
    });
  }, [apiRef, getPriceRowFromOriginalPrice]);

  const processPriceValueUpdateHandler = useCallback(
    (priceId, key, value) => {
      const price = prices.find((p) => p.id === priceId);
      const updatedChannel = get(price, "channels.0", {});
      const property = properties[key];
      let discriminator = get(price, `metadata.values.${key}.discriminator`);
      if (key === "retailer_codes") {
        if (isArray(value)) {
          set(
            updatedChannel,
            "retailerIds",
            value.map((r) => r.retailerId)
          );
        }
      } else if (key === "start_date" || key === "end_date") {
        let updatedValue = value;
        if (value) {
          if (moment(value).isValid()) {
            updatedValue = moment(value).format();
            set(updatedChannel, camelCase(key), updatedValue);
          }
        } else {
          updatedValue = null;
          discriminator = "NullPropertyValueViewModel";
          set(updatedChannel, camelCase(key), updatedValue);
        }
      } else {
        if (value === null) {
          set(price, `metadata.values.${key}`, {
            discriminator: "NullPropertyValueViewModel",
            value: null,
          });
        } else if (property) {
          const cardinality = get(property, "cardinality");
          if (discriminator) {
            if (value === "Yes") value = "Y";
            if (value === "No") value = "N";
            let updatedValue = value;

            if ((discriminator || "").includes("List")) {
              updatedValue = isArray(value) ? value : [value];
              if (cardinality === "Single") {
                updatedValue = isArray(value) ? get(value, "0") : value;
                discriminator = "StringPropertyValueViewModel";
              } else {
                updatedValue = isArray(value) ? value : [value];
                discriminator = "StringListPropertyValueViewModel";
              }
            }

            set(price, `metadata.values.${key}`, {
              discriminator,
              value: updatedValue,
            });
          } else {
            set(
              price,
              `metadata.values.${key}`,
              getUpdatedPropertyValueByDiscriminator(property, value)
            );
          }
        }
      }
      set(price, "channels.0", updatedChannel);
      if (loaderRef.current) {
        loadingCountRef.current++;
        loaderRef.current.style.display = "block";
      }
      updateGroupValues(price)
        .then(() => {
          handleUpdatePrice(price);
        })
        .catch(() => {
          setProcessRowUpdateError(true);
          setTimeout(() => setProcessRowUpdateError(false), 5000);
          onRefreshPriceList && onRefreshPriceList();
        })
        .finally(() => {
          if (loaderRef.current) {
            loadingCountRef.current--;
            if (loadingCountRef.current <= 0) {
              loadingCountRef.current = 0;
              loaderRef.current.style.display = "none";
            }
          }
        });

      return getPriceRowFromOriginalPrice(price);
    },
    [prices, getPriceRowFromOriginalPrice, onRefreshPriceList]
  );

  const checkboxColumn = useMemo(() => {
    return {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      renderCell: (params) => {
        if (params.id.includes("auto-generated")) {
          const ean_manufacturer_reference = params.id.split("/")[1];
          const ean = ean_manufacturer_reference.split(",")[0];
          const manufacturer_reference =
            ean_manufacturer_reference.split(", ")[1];

          const prices = pricesData.filter(
            (p) =>
              get(p, "ean") === ean &&
              get(p, "manufacturer_reference") === manufacturer_reference
          );

          const isChecked = prices.every((p) => {
            return selectedCollectionIds.includes(p.id);
          });

          return (
            <Checkbox
              checked={isChecked}
              onChange={(e) => {
                if (isChecked) {
                  setSelectedCollectionIds(
                    selectedCollectionIds.filter(
                      (id) => !prices.find((p) => p.id === id)
                    )
                  );
                } else {
                  setSelectedCollectionIds(
                    uniq([...selectedCollectionIds, ...prices.map((p) => p.id)])
                  );
                }
              }}
            />
          );
        }

        return <GridCellCheckboxRenderer {...params} />;
      },
      renderHeader: (params) => {
        return (
          <Checkbox
            checked={isCheckedAll}
            onChange={(e) => {
              if (!isCheckedAll) {
                setSelectedCollectionIds(pricesData.map((p) => p.id));
                toggleAllGroups();
              } else {
                setSelectedCollectionIds([]);
              }
            }}
          />
        );
      },
    };
  }, [isCheckedAll, pricesData, selectedCollectionIds, toggleAllGroups]);

  const columns = useMemo(
    () => [
      checkboxColumn,
      {
        headerName: "EAN, Manufacturer Reference",
        field: "ean_manufacturer_reference",
        width: 250,
      },
      {
        headerName: "Retailers",
        width: 340,
        minWidth: 340,
        maxWidth: 430,
        field: "retailer_codes",
        id: "retailer_codes",
        editable: true,
        valueGetter: (params) => {
          return isArray(params.row.retailer_codes)
            ? params.row.retailer_codes.map((r) => r.retailerName).join(", ")
            : params.row.retailer_codes;
        },
        renderCell: (params) => {
          const isTariffWarned = get(params, "row.isTariffWarned");
          const selectedRetailers = get(
            prices.find((p) => p.id === params.id),
            "channels.0.retailerIds",
            []
          ).map((retailerId) => find(retailers, { retailerId: retailerId }));
          return (
            <div className="retailer-cell-wrapper">
              {isTariffWarned ? (
                <div>
                  <Tooltip
                    title={translate("collections.tariffWarning")}
                    placement="top"
                  >
                    <IconButton>
                      <InfoIcon className="wanrning-color" />
                    </IconButton>
                  </Tooltip>
                </div>
              ) : null}
              <div style={{ flex: 1 }}>
                <RetailerEditComponent
                  className={
                    selectedRetailers.length > 0
                      ? "filled"
                      : properties[params.field]?.nullable
                      ? "nullable-empty"
                      : "empty"
                  }
                  property={properties[params.field]}
                  taxonomyId={taxonomyId}
                  retailers={retailers}
                  selectedRetailers={selectedRetailers}
                  onChange={processPriceValueUpdateHandler}
                  {...params}
                />
              </div>
            </div>
          );
        },
      },
      {
        headerName: "Start date",
        field: "start_date",
        minWidth: 150,
        maxWidth: 180,
        editable: true,
        renderEditCell: (params) => (
          <PriceDateEditComponent
            property={properties[params.field]}
            onChange={processPriceValueUpdateHandler}
            {...params}
          />
        ),
      },
      {
        headerName: "End date",
        field: "end_date",
        minWidth: 150,
        maxWidth: 180,
        editable: true,
        renderEditCell: (params) => (
          <PriceDateEditComponent
            property={properties[params.field]}
            onChange={processPriceValueUpdateHandler}
            {...params}
          />
        ),
      },
      {
        headerName: "Currency",
        field: "currency_code",
        minWidth: 150,
        maxWidth: 200,
        editable: true,
        renderEditCell: (params) => (
          <CustomEditComponent
            property={properties[params.field]}
            onChange={processPriceValueUpdateHandler}
            taxonomyId={taxonomyId}
            {...params}
          />
        ),
      },
      {
        headerName: "Catalog price",
        minWidth: 150,
        maxWidth: 180,
        field: "catalog_price_without_tax",
        editable: true,
        renderEditCell: (params) => (
          <CustomEditComponent
            property={properties[params.field]}
            onChange={processPriceValueUpdateHandler}
            taxonomyId={taxonomyId}
            {...params}
          />
        ),
      },
      {
        headerName: "Suggested price",
        minWidth: 150,
        maxWidth: 180,
        field: "suggested_price",
        editable: true,
        renderEditCell: (params) => (
          <CustomEditComponent
            property={properties[params.field]}
            onChange={processPriceValueUpdateHandler}
            taxonomyId={taxonomyId}
            {...params}
          />
        ),
      },
      {
        headerName: "Negociated price",
        minWidth: 150,
        maxWidth: 180,
        field: "negociated_price",
        editable: true,
        renderEditCell: (params) => (
          <CustomEditComponent
            property={properties[params.field]}
            onChange={processPriceValueUpdateHandler}
            taxonomyId={taxonomyId}
            {...params}
          />
        ),
      },
      {
        headerName: "VAT",
        minWidth: 150,
        maxWidth: 180,
        field: "tax_type_code",
        editable: true,
        renderEditCell: (params) => (
          <CustomEditComponent
            property={properties[params.field]}
            onChange={processPriceValueUpdateHandler}
            taxonomyId={taxonomyId}
            {...params}
          />
        ),
      },
      {
        headerName: "Sorecop",
        field: "sorecop_tax_amount",
        editable: true,
        renderEditCell: (params) => (
          <CustomEditComponent
            property={properties[params.field]}
            onChange={processPriceValueUpdateHandler}
            taxonomyId={taxonomyId}
            {...params}
          />
        ),
      },
      {
        headerName: "Green",
        field: "green_tax_amount",
        editable: true,
        renderEditCell: (params) => (
          <CustomEditComponent
            property={properties[params.field]}
            onChange={processPriceValueUpdateHandler}
            taxonomyId={taxonomyId}
            {...params}
          />
        ),
      },
      {
        headerName: "WEEE",
        field: "weee_tax_amount",
        editable: true,
        renderEditCell: (params) => (
          <CustomEditComponent
            property={properties[params.field]}
            onChange={processPriceValueUpdateHandler}
            taxonomyId={taxonomyId}
            {...params}
          />
        ),
      },
      {
        headerName: "REP Value",
        minWidth: 100,
        maxWidth: 120,
        field: "rep_code",
        editable: true,
        renderEditCell: (params) => (
          <CustomEditComponent
            property={properties[params.field]}
            onChange={processPriceValueUpdateHandler}
            taxonomyId={taxonomyId}
            {...params}
          />
        ),
      },
      {
        headerName: "Organism",
        minWidth: 150,
        maxWidth: 180,
        field: "rep_tax_organism_collector",
        editable: true,
        renderEditCell: (params) => (
          <CustomEditComponent
            property={properties[params.field]}
            onChange={processPriceValueUpdateHandler}
            taxonomyId={taxonomyId}
            {...params}
          />
        ),
      },
      {
        headerName: "Paid by retailer",
        minWidth: 150,
        maxWidth: 180,
        field: "rep_paid_by_retailer",
        editable: true,
        renderEditCell: (params) => (
          <CustomEditComponent
            property={properties[params.field]}
            onChange={processPriceValueUpdateHandler}
            taxonomyId={taxonomyId}
            {...params}
          />
        ),
      },
      {
        headerName: "Drop shipped",
        minWidth: 150,
        maxWidth: 180,
        field: "drop_shipped",
        editable: true,
        renderEditCell: (params) => (
          <CustomEditComponent
            property={properties[params.field]}
            onChange={processPriceValueUpdateHandler}
            taxonomyId={taxonomyId}
            {...params}
          />
        ),
      },
      {
        headerName: "Invoiced from",
        minWidth: 150,
        maxWidth: 180,
        field: "invoiced_from_france",
        editable: true,
        renderEditCell: (params) => (
          <CustomEditComponent
            property={properties[params.field]}
            onChange={processPriceValueUpdateHandler}
            taxonomyId={taxonomyId}
            {...params}
          />
        ),
      },
      {
        headerName: "Discountable Rate",
        minWidth: 150,
        maxWidth: 180,
        field: "discountable_rate",
        editable: true,
        renderEditCell: (params) => (
          <CustomEditComponent
            property={properties[params.field]}
            onChange={processPriceValueUpdateHandler}
            taxonomyId={taxonomyId}
            {...params}
          />
        ),
      },
    ],
    [
      checkboxColumn,
      prices,
      properties,
      retailers,
      taxonomyId,
      processPriceValueUpdateHandler,
    ]
  );

  const massModify = useCallback(
    (columnId) => {
      setColumnToMassModify(columnId);

      const taxonomyId = get(tradeItem, "taxonomyId");
      getValuesByPropertyCode(taxonomyId, columnId).then((res) => {
        setProperty(res.data);
      });
    },
    [tradeItem]
  );

  const submitMassUpdate = useCallback(() => {
    setUpdateBulkLoading(true);
    updateBulkPropertyForGroupValues({
      groupValuesIds: prices.map((p) => p.id),
      propertyName: columnToMassModify,
      updatedPropertyValue: getUpdatedPropertyValueByDiscriminator(
        property,
        massModifyValue
      ),
    })
      .then((res) => {
        if (res.status === 200) {
          setColumnToMassModify(null);
          setMassModifyValue(null);
          setProperty(null);
          onRefreshPriceList && onRefreshPriceList(true);
        }
      })
      .finally(() => {
        setUpdateBulkLoading(false);
      });
  }, [
    columnToMassModify,
    prices,
    property,
    massModifyValue,
    onRefreshPriceList,
    getUpdatedPropertyValueByDiscriminator,
  ]);

  const CustomColumnMenu = useCallback(
    (props) => {
      return (
        <GridColumnMenu
          {...props}
          slots={{
            // Add new item
            columnMenuUserItem: CustomUserItem,
            columnMenuSortItem: null,
            columnMenuFilterItem: null,
            columnMenuAggregationItem: null,
            columnMenuPinningItem: null,
            columnMenuGroupingItem: null,
            columnMenuColumnsItem: null,
          }}
          slotProps={{
            columnMenuUserItem: {
              displayOrder: 15,
              myCustomValue: "Mass modify",
              myCustomHandler: () => massModify(props.colDef.field),
            },
          }}
        />
      );
    },
    [massModify]
  );

  const columnToMassModifyConfig = useMemo(() => {
    return columns.find((c) => c.field === columnToMassModify);
  }, [columnToMassModify, columns]);


  const rowModesModel = useMemo(() => {
    return pricesData.reduce((acc, sheet) => {
      acc[sheet.id] = {
        mode: GridRowModes.Edit,
      };
      return acc;
    }, {});
  }, [pricesData]);

  return (
    <div className="collection-prices-container">
      <div ref={loaderRef} style={{ display: "none" }}>
        <LoaderFixed />
      </div>
      {size(selectedCollectionIds) > 0 && (
        <Row>
          <Padding
            horizontal={3}
            bottom={3}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ marginRight: "14px" }}>
              {size(selectedCollectionIds)}{" "}
              {size(selectedCollectionIds) > 1 ? "rows" : "row"} seleted
            </Text>
            <Button
              onClick={(e) => {
                setShowDeletePricingConfirmation(true);
              }}
              danger
              small
            >
              {translate("collections.deletePricings")}
            </Button>
          </Padding>
        </Row>
      )}
      <DataGridPremium
        className="collection-prices-grid"
        sx={{
          "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
          "& .MuiDataGrid-footerContainer": {
            bottom: "15px",
            position: "sticky",
            backgroundColor: "#FFF",
          },
          "& .MuiDataGrid-columnHeadersInner": {
            backgroundColor: "#FFF",
          },
        }}
        paginationMode="server"
        paginationModel={paginationModel}
        pagination
        apiRef={apiRef}
        rows={pricesData}
        rowBuffer={40}
        columns={columns}
        columnBuffer={30}
        editMode="row"
        rowModesModel={rowModesModel}
        checkboxSelection={true}
        rowCount={rowCount}
        rowSelection
        rowSelectionModel={selectedCollectionIds}
        onPaginationModelChange={onPaginationModelChange}
        onRowSelectionModelChange={(params) => {
          setSelectedCollectionIds(
            params.filter((id) => !id.includes("auto-generated"))
          );
        }}
        rowGroupingColumnMode="single"
        defaultGroupingExpansionDepth={-1}
        initialState={initialState}
        disableRowSelectionOnClick
        groupingColDef={{ leafField: "retailer_codes" }}
        columnGroupingModel={[
          {
            groupId: "Price",
            headerClassName: "text-center",
            children: [
              { field: "retailer_codes" },
              { field: "start_date" },
              { field: "end_date" },
              { field: "currency_code" },
              { field: "catalog_price_without_tax" },
              { field: "suggested_price" },
              { field: "negociated_price" },
            ],
          },
          {
            groupId: "Taxes",
            children: [
              { field: "tax_type_code" },
              { field: "sorecop_tax_amount" },
              { field: "green_tax_amount" },
              { field: "weee_tax_amount" },
            ],
          },
          {
            groupId: "REP",
            children: [
              { field: "rep_code" },
              { field: "rep_tax_organism_collector" },
              { field: "rep_paid_by_retailer" },
            ],
          },
          {
            groupId: "Others",
            children: [
              { field: "drop_shipped" },
              { field: "invoiced_from_france" },
              { field: "discountable_rate" },
            ],
          },
        ]}
        experimentalFeatures={{ columnGrouping: true }}
        slots={{
          columnMenu: CustomColumnMenu,
          noRowsOverlay: () => null,
        }}
      />

      {processRowUpdateError && (
        <Toast
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 9999,
          }}
          danger
        >
          Failed to update the price!
        </Toast>
      )}

      {columnToMassModify && (
        <ModalStyled sm style={{ overflow: "visible" }}>
          <div>
            <Label block>
              Mass update for{" "}
              {columnToMassModifyConfig
                ? columnToMassModifyConfig.headerName
                : columnToMassModify}
            </Label>
            {property ? (
              <PropertyForm
                property={property}
                value={massModifyValue}
                onChange={(val) => {
                  setMassModifyValue(val);
                }}
                debounceTime={0}
              />
            ) : (
              <Row
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Loader />
              </Row>
            )}
            <Padding top={4} />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                small
                onClick={() => {
                  setColumnToMassModify(null);
                  setMassModifyValue(null);
                  setProperty(null);
                }}
              >
                Close
              </Button>
              {updateBulkLoading ? (
                <Loader />
              ) : (
                <Button
                  primary
                  small
                  disabled={!massModifyValue}
                  onClick={submitMassUpdate}
                  style={{
                    backgroundColor: !massModifyValue ? "#ccc" : PRIMARY,
                  }}
                >
                  Update
                </Button>
              )}
            </div>
          </div>
        </ModalStyled>
      )}

      {showDeletePricingConfirmation && (
        <ModalStyled sm>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <H5>{translate("collections.deleteMutiPricingConfirmation")}</H5>
            <Padding vertical={3} />
            <div style={{ display: "flex" }}>
              {showDeletePricingLoading ? (
                <Loader />
              ) : (
                <>
                  <Button
                    small
                    danger
                    onClick={() => {
                      deletePricings();
                    }}
                  >
                    {translate("collections.yes")}
                  </Button>
                  <Padding horizontal={2} />
                  <Button
                    small
                    onClick={() => setShowDeletePricingConfirmation(false)}
                  >
                    {translate("collections.no")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </ModalStyled>
      )}
    </div>
  );
};

function CustomUserItem(props) {
  const { myCustomHandler, myCustomValue } = props;
  return (
    <MenuItem onClick={myCustomHandler}>
      <ListItemIcon>
        <EditIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{myCustomValue}</ListItemText>
    </MenuItem>
  );
}

export default withLocalization(withLocalProviders(CollectionPrice));
