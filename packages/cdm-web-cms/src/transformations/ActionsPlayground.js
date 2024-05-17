import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import map from "lodash/map";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import Editor from "../../src/common/component/editor/Editor";
import Modal from "../../src/common/layout/Modal";
import * as utils from "cdm-shared/utils/transformation";
import { Loader } from "cdm-ui-components";

import {
  editAction,
  selectedActionIndexAction,
  deleteAction,
  setPlaygroundTradeItemId,
  doPlayground,
  errorMessage,
  switchActions,
} from "cdm-shared/redux/actions/transformation";
import {
  playgroundTradeItemIdSelecter,
  transformationSetPlaygroundResultSelecter,
  getActionDefinitionsSelecter,
  actionSetSelector,
  getSelectedActionIndexSelector,
} from "cdm-shared/redux/selectors/transformation";

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "#3e8ef7" : "",
  width: "100%",
});

const ActionRow = ({ className, id, action, name, onClick, onDelete }) => (
  <div
    onClick={(e) => onClick()}
    className={`text-white px-2 py-2 wrap-box ${className || ""}`}
  >
    <div> {action.name || name}</div>
    <div>
      <button
        className="btn btn-link p-0 float-right text-white"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        Remove
      </button>
    </div>
  </div>
);

const ActionsPlayground = () => {
  const dispatch = useDispatch();

  const [showFullscreen, setShowFullscreen] = useState(false);
  const [goLoading, setgoLoading] = useState(false);

  //selectors
  const actionSet = useSelector(actionSetSelector);
  const selectedActionIndex = useSelector(getSelectedActionIndexSelector);
  const playgroundTradeItemId = useSelector(playgroundTradeItemIdSelecter);
  const playgroundResult = useSelector(
    transformationSetPlaygroundResultSelecter
  );
  const actionsDefinitions = useSelector(getActionDefinitionsSelecter);

  const toggleFullscreen = () => {
    setShowFullscreen(!showFullscreen);
  };

  return (
    <React.Fragment>
      {/* Actions row */}
      {!isEmpty(get(actionSet, "actionSet.orderedParametrizedActions")) && (
        <div className="row">
          <div className="col-12">
            <h5>Actions playground</h5>

            {/* Input value */}
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label className="control-label">
                    Select a product to test:
                  </label>
                  <input
                    className="form-control"
                    value={playgroundTradeItemId || ""}
                    onChange={(e) =>
                      dispatch(setPlaygroundTradeItemId(e.target.value))
                    }
                  />
                  {playgroundTradeItemId && (
                    <button
                      onClick={(e) => {
                        setgoLoading(true);
                        return dispatch(
                          doPlayground(playgroundTradeItemId, actionSet)
                        )
                          .then(() => {})
                          .catch((err) => {
                            dispatch(errorMessage(err.message));
                          })
                          .finally(() => {
                            setgoLoading(false);
                          });
                      }}
                      className="btn btn-block btn-primary mt-2"
                    >
                      {goLoading ? <Loader small light /> : "Go!"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Manage actions */}
            <div className="row mb-3">
              <div className="col">
                <DragDropContext
                  onDragEnd={(e) => {
                    if (e.destination && e.destination.index !== e.source.index)
                      dispatch(
                        switchActions(e.source.index, e.destination.index)
                      );
                  }}
                >
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                      >
                        {map(
                          get(
                            actionSet,
                            "actionSet.orderedParametrizedActions"
                          ),
                          (a, k) => (
                            <Draggable
                              key={`action-${k}`}
                              draggableId={`action-${k}`}
                              index={k}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <ActionRow
                                    name={
                                      utils.isBuiltInAction(a)
                                        ? get(
                                            actionsDefinitions,
                                            `${a.builtInActionDefinitionId}.name`,
                                            a.discriminator
                                          )
                                        : `Template`
                                    }
                                    onClick={() => {
                                      dispatch(selectedActionIndexAction(k));
                                      dispatch(editAction(a));
                                    }}
                                    onDelete={() => dispatch(deleteAction(k))}
                                    selected={k === selectedActionIndex}
                                    action={a}
                                    className={`${
                                      k === selectedActionIndex
                                        ? "bg-surprise"
                                        : "bg-secondary"
                                    } mb-2`}
                                    id={`action-${k}`}
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
            </div>

            {/* Output */}
            <div className="row">
              <div className="col">
                <Editor
                  value={
                    isEmpty(playgroundResult)
                      ? ""
                      : JSON.stringify(playgroundResult, null, 2)
                  }
                  type="JSON"
                />

                {playgroundResult && (
                  <button
                    onClick={(e) => toggleFullscreen()}
                    className="btn btn-primary mt-3"
                  >
                    Toggle fullscreen
                  </button>
                )}

                {showFullscreen && (
                  <Modal
                    title={`Playground result`}
                    size="lg"
                    onClose={() => toggleFullscreen()}
                  >
                    <Editor
                      height="1000px"
                      value={
                        isEmpty(playgroundResult)
                          ? ""
                          : JSON.stringify(playgroundResult, null, 2)
                      }
                      type="JSON"
                    />
                  </Modal>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default ActionsPlayground;
