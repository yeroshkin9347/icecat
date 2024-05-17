import pick from "lodash/pick";
import get from "lodash/get";
import { getDateTime } from "cdm-shared/utils/date";

const formatWeight = amount => (amount ? `${amount}g` : "");

const formatDimension = amount => (amount ? `${amount}mm` : "");

const RESTRICTED_PROPERTIES = [
  "net_height",
  "net_width",
  "net_depth",
  "net_weight",
  "gross_height",
  "gross_width",
  "gross_weight",
  "gross_depth"
];

const PROPERTIES_FORMATTER = {
  gross_weight: formatWeight,
  gross_width: formatDimension,
  gross_height: formatDimension,
  gross_depth: formatDimension,
  net_weight: formatWeight,
  net_width: formatDimension,
  net_height: formatDimension,
  net_depth: formatDimension,
  start_availability: getDateTime
};

const PROPERTIES_BY_DESCRIPTOR = {
  EA: [
    "ean",
    "manufacturer_reference",
    "unit_type",
    "country_of_importation",
    "country_of_origin",
    "customs_product_code_taric",
    "packaging_material",
    "packaging_type",
    "gross_weight",
    "gross_width",
    "gross_height",
    "gross_depth",
    "net_weight",
    "net_width",
    "net_height",
    "net_depth",
    "dispatch_unit",
    "invoice_unit",
    "orderable_unit",
    "order_quantity_multiple",
    "part_number",
    "unit_composition",
    "min_order",
    "start_availability",
    "multiple_box_component_description",
    "multiple_box_component_id"
  ],
  PK: [
    "ean",
    "quantity",
    "inner_packaging_type",
    "gross_weight",
    "gross_width",
    "gross_height",
    "gross_depth",
    "net_weight",
    "net_width",
    "net_height",
    "net_depth",
    "consumer_unit",
    "descriptor",
    "dispatch_unit",
    "inner_consumer_unit",
    "inner_dispatch_unit",
    "inner_invoice_unit",
    "inner_is_stackable",
    "inner_max_stack_value",
    "inner_min_order",
    "inner_orderable_unit",
    "inner_stacking_type",
    "invoice_unit",
    "is_stackable",
    "max_stack_value",
    "min_order",
    "orderable_unit",
    "stacking_type",
  ],
  CS: [
    "ean",
    "quantity",
    "outer_packaging_type",
    "gross_weight",
    "gross_width",
    "gross_height",
    "gross_depth",
    "net_weight",
    "net_width",
    "net_height",
    "net_depth",
    "dispatch_unit",
    "invoice_unit",
    "orderable_unit",
    "order_quantity_multiple",
    "min_order"
  ],
  PL: [
    "ean",
    "pallet_type",
    "quantity",
    "number_of_cartons_per_layer",
    "number_of_cartons_per_pallet",
    "number_of_layer",
    "gross_weight",
    "gross_width",
    "gross_height",
    "gross_depth",
    "net_weight",
    "net_width",
    "net_height",
    "net_depth",
    "dispatch_unit",
    "invoice_unit",
    "orderable_unit",
    "order_quantity_multiple",
    "min_order"
  ]
};

const pickPropertiesForDescriptor = (descriptor, values, isRestricted) => {
  const val = isRestricted ? pick(values, RESTRICTED_PROPERTIES) : values;
  return get(PROPERTIES_BY_DESCRIPTOR, descriptor)
    ? pick(val, get(PROPERTIES_BY_DESCRIPTOR, descriptor))
    : val;
};

const getFormattedProperty = (code, value) => {
  return get(PROPERTIES_FORMATTER, code)
    ? PROPERTIES_FORMATTER[code](value)
    : value;
};

export {
  getFormattedProperty,
  formatWeight,
  formatDimension,
  pickPropertiesForDescriptor
};
