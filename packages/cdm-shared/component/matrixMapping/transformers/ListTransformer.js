import React from "react";
import Select from "react-select";
import update from "immutability-helper";
import get from "lodash/get";
import find from "lodash/find";
import map from "lodash/map";
import { getDefaultTransformer } from "../transformers";
import { Button, Input, Row } from "cdm-ui-components";

const getDefaultItem = () => {
  return {
    fixedValueCode: null,
    mapping: "",
  };
};

const getTransformation = (value, apply) =>
  Object.assign({}, value || getDefaultTransformer(), {
    type: "list",
    values: apply,
  });

const ListTransformer = ({ value, onChange, options }) => (
  <React.Fragment>
    {map(get(value, "values", []), (v, k) => (
      <div
        style={{ display: "flex", marginBottom: "8px" }}
        key={`list-transform-${k}`}
      >
        <div style={{ flex: 1, marginRight: "16px" }}>
          <Select
            value={find(
              options,
              (o) => o.value === get(v, "fixedValueCode", null)
            )}
            onChange={(o) =>
              onChange(
                getTransformation(
                  value,
                  update(get(value, "values", []), {
                    [k]: { fixedValueCode: { $set: o.value } },
                  })
                )
              )
            }
            isClearable={true}
            options={options}
            classNamePrefix="cde-select"
            className="cde-select"
            menuPlacement="auto"
          />
        </div>
        <div className="col">
          <div className="input-group">
            <Input
              type="text"
              className="form-control"
              placeholder="mapping"
              onChange={(e) =>
                onChange(
                  getTransformation(
                    value,
                    update(get(value, "values", []), {
                      [k]: { mapping: { $set: e.target.value } },
                    })
                  )
                )
              }
              value={get(v, "mapping", "")}
            />
            <div
              className="input-group-append"
              onClick={(e) =>
                onChange(
                  getTransformation(
                    value,
                    update(get(value, "values", []), { $splice: [[k, 1]] })
                  )
                )
              }
            >
              <div className="input-group-text">
                <i className="icon-close" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
    <Button
      small
      primary
      onClick={(e) => {
        e.preventDefault();
        onChange(
          getTransformation(
            value,
            update(get(value, "values", []), { $push: [getDefaultItem()] })
          )
        );
      }}
    >
      + Add
    </Button>
  </React.Fragment>
);

export default ListTransformer;
