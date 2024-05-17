import get from "lodash/get";
import DateProperty from "./DateProperty";
import ListProperty from "./ListProperty";
import NumericProperty from "./NumericProperty";
import StringProperty from "./StringProperty";
import TextProperty from "./TextProperty";

const isFullTextProperty = property =>
  get(property, "code") === "full_description";

export const getPropertyForm = property => {
  switch (get(property, "type", null)) {
    case "Date":
      return DateProperty;
    case "List":
      return ListProperty;
    case "Numeric":
      return NumericProperty;
    case "String":
      return isFullTextProperty(property) ? TextProperty : StringProperty;
    default:
      // console.error(
      //   `Property form not found for: ${get(property, "type", null)}`
      // );
      return null;
  }
};
