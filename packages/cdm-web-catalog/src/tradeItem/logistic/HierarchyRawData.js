import React from "react";
import get from "lodash/get";
import map from "lodash/map";
import reduce from "lodash/reduce";
import isEmpty from "lodash/isEmpty";
import size from "lodash/size";
import slice from "lodash/slice";
import { Table, Thead, Tbody, Th, Td, Tr } from "cdm-shared/component/RawTable";
import { pickPropertiesForDescriptor, getFormattedProperty } from "./utils";
import { getDescriptorName } from "./Descriptor";
import { Text, Padding } from "cdm-ui-components";
import LogisticProperty from "./LogisticProperty";

const DEFAULT_CHUNK_SIZE = 5;

const headingHilighted = {
  backgroundColor: "rgb(49, 49, 49)",
  textAlign: "left",
  paddingLeft: "2rem"
};

function parseProperties(descriptor, values, isRestricted) {
  let _properties = pickPropertiesForDescriptor(
    descriptor,
    values,
    isRestricted
  );
  const propertiesPerChunk = Math.ceil(size(_properties) / DEFAULT_CHUNK_SIZE);

  return reduce(
    _properties,
    (result, current, k) => {
      let lastElement = isEmpty(result) ? {} : result[result.length - 1];
      const formattedCurrent = getFormattedProperty(k, current);
      return size(lastElement) === propertiesPerChunk
        ? [...result, ...[{ [k]: formattedCurrent }]]
        : [
            ...slice(result, 0, result.length - 1),
            Object.assign({}, lastElement, { [k]: formattedCurrent })
          ];
    },
    []
  );
}

// EACH
const TableForLogisticData = props => {
  const { translate, values, isRestricted, tradeItemproperties } = props;

  const descriptor = get(values, "descriptor");

  const properties = parseProperties(descriptor, values, isRestricted);

  if(properties.length == 0)
    return null;

 const isCal = (code) => {
		const property = tradeItemproperties.find(
			(element) => element.code === code
		);
		if (
			property &&
			property.discriminator === "CalculatedProductPropertyViewModel"
		) {
			return true;
		} else {
			return false;
		}
 };
  return (
    
    <Table>
      <Thead>
        <Tr>
          <Th colSpan={DEFAULT_CHUNK_SIZE} style={headingHilighted}>
            <Text spaced light lightgray uppercase>
              {getDescriptorName(descriptor, translate)}
            </Text>
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          {map(properties, (propertiesChunk, idx) => {
            return (
              <Td key={`chunk-${descriptor}-${idx}`}>
                {map(propertiesChunk, (p, pKey) => (
                  <LogisticProperty
                    key={`${descriptor}-${pKey}`}
                    code={pKey}
                    value={p}
                    translate={translate}
                    showTooltip={isCal(pKey)}
                  />
                ))}
              </Td>
            );
          })}
        </Tr>
      </Tbody>
    </Table>
  );
};

const Parent = ({ parentRoot, translate, isRestricted, properties }) => {
  return (
    <Padding left={5} top={4}>
      <HierarchyRawData
        values={get(parentRoot, "values")}
        parent={get(parentRoot, "parent")}
        translate={translate}
        isRestricted={isRestricted}
        properties={properties}
      />
    </Padding>
  );
};

// logistic hierarchy raw data display as simple HTML table
const HierarchyRawData = ({
  values,
  parent,
  isRestricted,
  properties,
  // functions
  translate
}) => {
  return (
    <div
      style={{
        margin: "0 auto"
      }}
    >
      <TableForLogisticData
        values={values}
        translate={translate}
        isRestricted={isRestricted}
        tradeItemproperties={properties}

      />

      {!isEmpty(parent) && (
        <Parent
          parentRoot={parent}
          translate={translate}
          isRestricted={isRestricted}
          properties={properties}
        />
      )}
    </div>
  );
};

export default React.memo(HierarchyRawData);
