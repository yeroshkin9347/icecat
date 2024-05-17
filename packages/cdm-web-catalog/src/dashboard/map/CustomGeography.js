import React from "react";
import { Geography } from "react-simple-maps";
import withTheme from "cdm-shared/redux/hoc/withTheme";

const CustomGeography = React.memo(
  withTheme(
    ({
      geography,
      projection,
      selected,
      theme,
      // functions
      setSelectedCountryId
    }) => {
      return (
        <Geography
          geography={geography}
          projection={projection}
          style={{
            default: {
              fill: selected
                ? `rgb(${theme.color.primary})`
                : `rgb(${theme.color.light})`,
              stroke: `rgb(${theme.color.secondary})`,
              strokeWidth: 0.3,
              outline: "none"
            },
            hover: {
              fill: `rgb(${theme.color.secondary})`,
              stroke: `rgb(${theme.color.secondary})`,
              strokeWidth: 0.75,
              outline: "none"
            },
            pressed: {
              fill: "#FF5722",
              stroke: "#607D8B",
              strokeWidth: 0.75,
              outline: "none"
            }
          }}
          onMouseEnter={e => setSelectedCountryId(e.id)}
          onMouseMove={e => setSelectedCountryId(e.id)}
          onClick={e => setSelectedCountryId(e.id)}
          onMouseLeave={e => setSelectedCountryId(null)}
        />
      );
    }
  )
);

export default withTheme(CustomGeography);
