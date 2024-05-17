const CONNECTOR_STATUS = ["Inactive", "Production", "Development", "Project"];

const CONNECTION_STATUS = ["Inactive", "Production", "Development", "Project"];

const CONNECTOR_TYPE = ["Marketing", "Sales", "Market Place", "Product Stories", "Full"];

const CONNECTOR_SCOPE = ["Marketing", "Logistic", "Commercial", "Media"];

const CONNECTOR_VISIBILITY = ["Visible", "Hidden"];

export {
  CONNECTOR_STATUS,
  CONNECTION_STATUS,
  CONNECTOR_TYPE,
  CONNECTOR_SCOPE,
  CONNECTOR_VISIBILITY,
};

export const makeOption = (object) => ({
  value: object.id,
  label: object.name,
});
