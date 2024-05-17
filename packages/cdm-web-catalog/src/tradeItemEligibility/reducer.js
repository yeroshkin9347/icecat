const TRADE_ITEM_ELIGIBILITY_STATUSES = [
  "Exportable",
  "ExportableWithWarning",
  "NotExportable",
  "Exclusive"
];

const manufacturerDefaultFilters = {
  exportActionId: null,
  retailerId: null,
  connectorId: null,
  importJobId: null,
  gtin: null,
  tradeItemManufacturerCode: null,
  tradeItemEligibilityStatus: [],
  collectionCode: null,
  startDiscontinuedDate: null,
  endReleaseDate: null
};

export { manufacturerDefaultFilters, TRADE_ITEM_ELIGIBILITY_STATUSES };
