import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import get from "lodash/get";
import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import dotProp from "dot-prop-immutable";
import * as utils from "./utils";
import ParamFactory from "../common/component/parameters";
import Editor from "../common/component/editor/Editor";
import Modal from "../common/layout/Modal";
import find from "lodash/find";
import * as helper from "cdm-shared/helper";

import {
  editAction,
  changeAction,
  editActionKey,
  resetEditAction,
  changeParamsValue,
  saveActionSet,
} from "cdm-shared/redux/actions/transformation";

import {
  getActionSelector,
  getActionDefinitionsSelecter,
  getTradeItemsPropertiesSelecter,
} from "cdm-shared/redux/selectors/transformation";

const ActionForm = () => {
  //dispatch
  const dispatch = useDispatch();

  //selector
  const action = useSelector(getActionSelector);
  const actionsDefinitions = useSelector(getActionDefinitionsSelecter);
  const actionDefinition = useSelector(getActionSelector);
  const tradeItemProperties = useSelector(getTradeItemsPropertiesSelecter);

  //useState
  const [showFullscreen, setShowFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setShowFullscreen(!showFullscreen);
  };

  return (
    <React.Fragment>
      <div className="row">
        <div className="col mb-3">
          <div className="custom-control custom-radio">
            <input
              onChange={(e) => {
                dispatch(
                  editAction(
                    dotProp.set(action, "actionExecutionCondition", "None")
                  )
                );
              }}
              checked={utils.isActionExecutionConditionNone(action)}
              type="radio"
              id="action-execution-condition-none"
              className="custom-control-input"
            />
            <label
              className="custom-control-label pt-1 font-weight-bold"
              htmlFor="action-execution-condition-none"
            >
              None
            </label>
          </div>
          <div className="custom-control custom-radio">
            <input
              onChange={(e) => {
                dispatch(
                  editAction(
                    dotProp.set(
                      action,
                      "actionExecutionCondition",
                      "IfCurrentValueIsNull"
                    )
                  )
                );
              }}
              checked={utils.isActionExecutionConditionCurrentValueNull(action)}
              type="radio"
              id="action-execution-condition-current-value-null"
              className="custom-control-input"
            />
            <label
              className="custom-control-label pt-1 font-weight-bold"
              htmlFor="action-execution-condition-current-value-null"
            >
              If current value is Null
            </label>
          </div>
          <div className="custom-control custom-radio">
            <input
              onChange={(e) => {
                dispatch(
                  editAction(
                    dotProp.set(
                      action,
                      "actionExecutionCondition",
                      "IfCurrentValueIsNotNull"
                    )
                  )
                );
              }}
              checked={utils.isActionExecutionConditionCurrentValueNotNull(
                action
              )}
              type="radio"
              id="action-execution-condition-current-value-not-null"
              className="custom-control-input"
            />
            <label
              className="custom-control-label pt-1 font-weight-bold"
              htmlFor="action-execution-condition-current-value-not-null"
            >
              If current value is not null
            </label>
          </div>
        </div>
      </div>

      {/* Built-in */}
      <div className="row">
        <div className="col mb-3">
          <div className="custom-control custom-radio">
            <input
              onChange={(e) =>
                dispatch(changeAction(utils.getDefaultBuiltInAction()))
              }
              checked={utils.isBuiltInAction(action)}
              type="radio"
              id="built-in-trans"
              className="custom-control-input"
            />
            <label
              className="custom-control-label pt-1 font-weight-bold"
              htmlFor="built-in-trans"
            >
              Built-in actions
            </label>
          </div>
        </div>
      </div>
      {/* Built-in values */}
      {utils.isBuiltInAction(action) && (
        <div className="row mb-3">
          {/* Select transformation */}
          <div className="col-12">
            {/* Initial property */}
            <div className="form-group">
              <label>Initial property *:</label>
              <Select
                styles={helper.colourStyles}
                // isLoading={areTradeItemPropertiesLoading}
                getOptionLabel={(b) => b.code}
                getOptionValue={(b) => b.id}
                options={tradeItemProperties}
                onChange={(b) => {
                  dispatch(
                    changeAction({ ...action, sourcePropertyCode: b.code })
                  );
                }}
                value={
                  tradeItemProperties
                    ? find(
                        tradeItemProperties,
                        (s) => s.code === action.sourcePropertyCode
                      )
                    : null
                }
              />
            </div>
            <div className="form-group">
              <label>Transformation *:</label>
              <Select
                styles={helper.colourStyles}
                getOptionLabel={(b) => b.name}
                getOptionValue={(b) => b.id}
                options={actionsDefinitions}
                onChange={(d) => {
                  dispatch(
                    changeAction({ ...d, builtInActionDefinitionId: d.id })
                  );
                }}
                value={actionDefinition}
              />
            </div>
            {/* Parameters */}
            {!isEmpty(actionDefinition) &&
              get(actionDefinition, "parametersDefinition", null) && (
                <div className="form-group">
                  {map(
                    actionDefinition.parametersDefinition,
                    (parameter, pIndex) => (
                      <div key={`editing-param-${pIndex}`}>
                        <ParamFactory
                          type={get(parameter, "parameterType")}
                          name={get(parameter, "code")}
                          isMandatory={get(parameter, "isMandatory")}
                          value={get(
                            action,
                            `parameterValues.${pIndex}.value`,
                            null
                          )}
                          onChange={(paramValue) => {
                            dispatch(changeParamsValue(paramValue, pIndex));
                          }}
                        />
                      </div>
                    )
                  )}
                </div>
              )}
          </div>
        </div>
      )}

      {/* Template */}
      <div className="row pt-4">
        <div className="col mb-3">
          <div className="custom-control custom-radio">
            <input
              onChange={(e) =>
                dispatch(changeAction(utils.getDefaultTemplateAction()))
              }
              checked={utils.isTemplateAction(action)}
              type="radio"
              id="template-trans"
              className="custom-control-input"
            />
            <label
              className="custom-control-label pt-1 font-weight-bold"
              htmlFor="template-trans"
            >
              Template
            </label>
          </div>
        </div>
      </div>
      {/* Template values */}
      {utils.isTemplateAction(action) && (
        <div className="row mb-3">
          {/* Template text area */}
          <div className="col-12 d-block" style={{ zIndex: 0 }}>
            <span>Input : tradeItemViewModel, currentValue, context</span>
            <Editor
              height="auto"
              type={"CSHARP"}
              value={action.template}
              onChange={(val) => dispatch(editActionKey("template", val))}
              options={{
                extraKeys: {
                  "Ctrl-F": function (cm) {
                    cm.execCommand("find");
                  },
                },
              }}
            />
            <button
              onClick={(e) => toggleFullscreen()}
              className="btn btn-primary mt-2"
            >
              Show fullscreen
            </button>

            {showFullscreen && (
              <Modal
                title="Edit action template"
                size="lg"
                onClose={() => toggleFullscreen()}
              >
                <Editor
                  height="auto"
                  type={"CSHARP"}
                  value={get(action, "template", "")}
                  options={{
                    extraKeys: {
                      "Ctrl-F": function (cm) {
                        cm.execCommand("find");
                      },
                    },
                  }}
                  onChange={(val) => dispatch(editActionKey("template", val))}
                />
                <div>Press Ctrl-F and hit Enter to search</div>
                <button
                  className="btn btn-primary mt-3 float-right"
                  onClick={() => toggleFullscreen()}
                >
                  Ok
                </button>
              </Modal>
            )}
          </div>
        </div>
      )}
      {/* Add */}
      <div className="row mb-3">
        <div className="col text-right">
          <button
            className="btn btn-light mr-2"
            onClick={(e) => resetEditAction()}
          >
            Cancel
          </button>
          <button
            className="btn btn-secondary"
            onClick={(e) => {
              dispatch(saveActionSet());
            }}
          >
            Ok
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ActionForm;
