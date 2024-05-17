import React from "react";
import { useSelector, useDispatch } from "react-redux";
import get from "lodash/get";
import map from "lodash/map";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ActionSetForm from "./ActionSetForm";

import {
  updateTransformation,
  addNewActionSet,
  selectActionSet,
  deleteActionSet,
  switchActionsSets,
  setAction,
} from "cdm-shared/redux/actions/transformation";

//import selector
import {
  getSelectedActionSetIndexSelector,
  getSelectedTransformSelector,
} from "cdm-shared/redux/selectors/transformation";

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "#3e8ef7" : "",
  width: "100%",
});

const ActionSetRow = ({ name, onClick, onRemove, selected }) => (
  <div
    onClick={onClick}
    style={{ cursor: "pointer" }}
    className={`col-12 border p-2 ${selected ? "bg-surprise text-white" : ""}`}
  >
    {name || "No name"}
    <button
      onClick={(e) => {
        onRemove(e);
      }}
      className={`btn btn-link btn-sm p-0 float-right ${
        selected ? "bg-surprise text-white" : "text-danger"
      }`}
    >
      Remove
    </button>
  </div>
);

const TransformationSetForm = () => {
  const dispatch = useDispatch();
  const selected_action_set_index = useSelector(
    getSelectedActionSetIndexSelector
  );
  const transformation = useSelector(getSelectedTransformSelector);
  const name = get(transformation, "name");

  return (
    <React.Fragment>
      <h5 className="mb-4">Edit transformation ({name})</h5>

      <div className="row mb-3">
        {/* Name */}
        <div className="col-6">
          <div className="form-group">
            <label>Name *:</label>
            <input
              value={name || ""}
              onChange={(e) =>
                dispatch(updateTransformation("name", e.target.value))
              }
              type="text"
              className="form-control"
              style={{height:'38px'}}
            />
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-3">
          {/* Add new action set */}
          <button
            onClick={(e) => dispatch(addNewActionSet())}
            className="btn btn-light mb-3"
          >
            + Add new action set
          </button>

          {/* Orderable list */}
          <DragDropContext
            onDragEnd={(e) => {
              if (e.destination && e.destination.index !== e.source.index)
                dispatch(
                  switchActionsSets(e.source.index, e.destination.index)
                );
            }}
          >
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {transformation &&
                    transformation.orderedConditionalActionSets &&
                    map(
                      transformation.orderedConditionalActionSets,
                      (aSet, tIndex) => (
                        <Draggable
                          key={`action-set-${tIndex}`}
                          draggableId={`action-set-${tIndex}`}
                          index={tIndex}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <ActionSetRow
                                key={`transformation-mgmt-action-set-${tIndex}`}
                                selected={selected_action_set_index === tIndex}
                                onClick={(e) => {
                                  dispatch(selectActionSet(tIndex));
                                  dispatch(setAction(aSet));
                                }}
                                onRemove={(e) => {
                                  e.stopPropagation();
                                  dispatch(deleteActionSet(tIndex));
                                }}
                                name={get(aSet, "actionSet.name")}
                                id={`action-set-${tIndex}`}
                              />
                            </div>
                          )}
                        </Draggable>
                      )
                    )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Action set form */}
        {selected_action_set_index > -1 && (
          <div className="col-9">
            <ActionSetForm />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default TransformationSetForm;
