import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import find from "lodash/find";
import get from "lodash/get";
import * as utils from "cdm-shared/utils/transformation";
import * as helper from "cdm-shared/helper";

//import selector
import {
  getPropertyGroupsSelector,
  getActionSelector,
  businessRulesSetsSelecter,
  actionSetSelector,
  getTradeItemTransformationSelector,
} from "cdm-shared/redux/selectors/transformation";
import {
  editAction,
  updateActionSetGroup,
  selectedActionIndexAction,
  updateActionSet,
  getBusinessRulesByTaxonomyIdAndTradeItemAction,
  getTradeItemPropertiesUpAndDown,
} from "cdm-shared/redux/actions/transformation";

import ActionForm from "./ActionForm";
import ActionsPlayground from "./ActionsPlayground";

const ActionSetForm = () => {
  const dispatch = useDispatch();

  const transformationSet = useSelector(getTradeItemTransformationSelector);
  const get_property_groups = useSelector(getPropertyGroupsSelector);
  const action = useSelector(getActionSelector);
  const actionSet = useSelector(actionSetSelector);
  const businessRulesSets = useSelector(businessRulesSetsSelecter);

  const businessRuleSelected = get(actionSet, "businessRuleSetId", null)
    ? find(businessRulesSets, (br) => br.id === actionSet.businessRuleSetId)
    : null;

  const tradeItemCategory = transformationSet.tradeItemCategory;
  const taxonomyId = transformationSet.taxonomyId;
  useEffect(() => {
    init();
  }, [actionSet, tradeItemCategory, taxonomyId]);

  function init() {
    if (
      get(actionSet, "actionSet.propertyGroupId", null) &&
      tradeItemCategory &&
      taxonomyId
    ) {
      dispatch(getBusinessRulesByTaxonomyIdAndTradeItemAction({
        taxonomyId,
        propertyGroupId: actionSet.actionSet.propertyGroupId,
        tradeItemCategoryCode: tradeItemCategory.code,
      }));
      getTradeItemPropertiesUpAndDown(
        taxonomyId,
        actionSet.actionSet.propertyGroupId,
        tradeItemCategory.code
      );
    }
  }

  return (
    <React.Fragment>
      {/* Actions row */}
      <div className="row">
        {/* Left side */}
        <div className="col-6">
          <h5>Action set edition ({get(actionSet, "actionSet.name")})</h5>

          {/* Name */}
          <div className="form-group">
            <label>Name *:</label>
            <input
              value={get(actionSet, "actionSet.name") || ""}
              onChange={(e) =>
                dispatch(updateActionSet("actionSet.name", e.target.value))
              }
              type="text"
              className="form-control"
              style={{height:'38px'}}
            />
          </div>

          {/* Group */}
          <div className="form-group">
            <label>Group *:</label>
            <Select
              styles={helper.colourStyles}
              value={
                find(
                  get_property_groups,
                  (s) => s.id === get(actionSet, "actionSet.propertyGroupId")
                ) || null
              }
              onChange={(g) => dispatch(updateActionSetGroup(g))}
              getOptionLabel={(b) => b.name}
              getOptionValue={(b) => b.id}
              // isLoading={areGroupsLoading}
              name="existing-groups"
              options={get_property_groups}
            />
          </div>

          {get(actionSet, "actionSet.propertyGroupId") && (
            <div>
              {/* Business rule set */}
              <div className="form-group">
                <label>Business rule set:</label>
                <Select
                  styles={helper.colourStyles}
                  isClearable={true}
                  // isLoading={areBusinessRuleSetsLoading}
                  getOptionLabel={(b) => b.name}
                  getOptionValue={(b) => b.id}
                  options={businessRulesSets}
                  onChange={(b) =>
                    dispatch(updateActionSet("businessRuleSetId", get(b, "id", null)))
                  }
                  value={businessRuleSelected}
                />
              </div>
              <div>
                {/* Add new */}
                <div className="form-group">
                  <button
                    onClick={(e) => {
                      dispatch(selectedActionIndexAction(-1));
                      dispatch(editAction(utils.getDefaultBuiltInAction()));
                    }}
                    className="btn btn-link px-0"
                  >
                    + Add new action
                  </button>
                </div>

                {action && <ActionForm />}
              </div>
            </div>
          )}

          <div></div>
        </div>

        {/* Right side */}
        <div className="col-6">
          <ActionsPlayground />
        </div>
      </div>
    </React.Fragment>
  );
};

export default ActionSetForm;
