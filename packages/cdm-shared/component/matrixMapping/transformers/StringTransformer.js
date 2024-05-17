import React from "react";
import get from "lodash/get";
import { getDefaultTransformer } from "../transformers";
import "./index.css";
import { Input, VirtualizedSelect } from "cdm-ui-components";

const stringTransformers = [
  {
    value: null,
    label: "No transformation",
  },
  {
    value: "regex",
    label: "Regex",
  },
  {
    value: "upper",
    label: "Upper",
  },
  {
    value: "lower",
    label: "Lower",
  },
  {
    value: "camelcase",
    label: "Camel Case",
  },
  {
    value: "trim",
    label: "Trim",
  },
];

const getTransformation = (value, apply) =>
  Object.assign({}, value || getDefaultTransformer(), {
    type: "string",
    value: apply,
  });

const StringTransformer = ({ value, onChange }) => {
  const selectedOption = stringTransformers.find(
    (o) => o.value === get(value, "value")
  );

  return (
    <React.Fragment>
      <VirtualizedSelect
        simpleValue
        placeholder=""
        value={selectedOption}
        onChange={(val) =>
          onChange(getTransformation(value, get(val, "value")))
        }
        options={stringTransformers}
        getOptionValue={(o) => o.value}
        getOptionLabel={(o) => o.label}
        classNamePrefix="cde-select"
        className="cde-select react-select-full-height"
        menuPlacement="auto"
      />

      <br />
      {/* Regex */}
      {get(value, "value") === "regex" && (
        <div className="string-transformer-regrex">
          <Input
            onChange={(e) =>
              onChange({
                type: "string",
                value: "regex",
                extraValue: e.target.value,
              })
            }
            value={get(value, "extraValue") || ""}
            placeholder="Enter your regular expression"
            className="form-control mb-1"
            type="text"
          />
          <div>
            <code>Ex: {"(?<MatchedValue>\\d+)\\s*test"}</code>
            <a
              href={`https://regex101.com?regex=${encodeURIComponent(
                get(value, "extraValue", "")
              )}&flags=g,m`}
              target="blank"
              className="float-right"
            >
              Test your regular expression
            </a>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default StringTransformer;
