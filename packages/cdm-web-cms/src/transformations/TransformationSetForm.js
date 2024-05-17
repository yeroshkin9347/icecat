import React, { useState, useEffect } from "react";
import get from "lodash/get";
import map from "lodash/map";
import find from "lodash/find";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Select from "react-select";
import Sticky from "react-stickynode";
import * as helper from "cdm-shared/helper";

import {
  getTaxonomiesSelector,
  getTradeItemCategoriesSelector,
  getTradeItemTransformationSelector,
  getSelectedTransformIndexSelector,
  areTaxonomiesLoadingSelector,
  areTradeItemCategoriesLoadingSelector,
  getTransformationsSelector,
} from "cdm-shared/redux/selectors/transformation";
import {
  updateTransformationSetTaxonomyId,
  updateTransformationSetTradeItemCategory,
  updateTransformationSet,
  initializeSet,
  deleteTransformation,
  addNewTransformation,
  switchTransformations,
} from "cdm-shared/redux/actions/transformation";
import TransformationForm from "./TransformationForm";

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "#3e8ef7" : "",
  width: "100%",
});

const TransformationRow = ({ name, onClick, onRemove, selected }) => (
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
  //state
  const [nameSHowShow, setNameSHowShow] = useState(false);

  //dispatcher
  const dispatch = useDispatch();

  //selector
  const taxonomies = useSelector(getTaxonomiesSelector);
  const areTaxonomiesLoading = useSelector(areTaxonomiesLoadingSelector);
  const areTradeItemCategoriesLoading = useSelector(
    areTradeItemCategoriesLoadingSelector
  );
  const tradeItemCategories = useSelector(getTradeItemCategoriesSelector);
  const transformationSet = useSelector(getTradeItemTransformationSelector);

  //binding data
  const name = transformationSet.name;
  const taxonomyId = transformationSet.taxonomyId;
  const tradeItemCategory = transformationSet.tradeItemCategory;

  const selected_transformation_index = useSelector(
    getSelectedTransformIndexSelector
  );

  const transformations = useSelector(getTransformationsSelector);

  useEffect(() => {
    if (transformationSet) {
      setNameSHowShow(true);
    }
  }, [transformationSet]);

  return (
    <React.Fragment>
      <div className="card ">
        <div className="card-body ">
          <div className="row mb-3">
            {/* Name */}
            <div className="col-4">
              <div className="form-group">
                <label>Name *:</label>
                <input
                  value={name || ""}
                  onChange={(e) =>
                    dispatch(updateTransformationSet("name", e.target.value))
                  }
                  type="text"
                  className="form-control"
                  style={{height:'38px'}}
                />
              </div>
            </div>

            {/* Taxonomy */}
            <div className="col-4">
              <div className="form-group">
                <label>Taxonomy *:</label>
                <Select
                  styles={helper.colourStyles}
                  // disabled={!!id}
                  options={taxonomies}
                  value={
                    taxonomyId
                      ? find(taxonomies, (s) => s.id === taxonomyId)
                      : null
                  }
                  name={"taxonomyId"}
                  getOptionLabel={(o) => o.name}
                  getOptionValue={(o) => o.id}
                  isLoading={areTaxonomiesLoading}
                  onChange={(taxonomy) => {
                    dispatch(updateTransformationSetTaxonomyId(taxonomy.id));
                  }}
                />
              </div>
            </div>

            {/* Trade Item Category */}
            <div className="col-4">
              <div className="form-group">
                <label>Trade Item Category *:</label>
                <Select
                  styles={helper.colourStyles}
                  // disabled={!!id}
                  options={tradeItemCategories}
                  value={
                    tradeItemCategory
                      ? find(
                          tradeItemCategories,
                          (s) => s.code?.code === tradeItemCategory.code
                        )
                      : null
                  }
                  name={"tradeItemCategoryCode"}
                  getOptionLabel={(o) =>
                    `${o.code?.code} - ${o.name} (${o.unspsc})`
                  }
                  getOptionValue={(o) => o.code?.code}
                  isLoading={areTradeItemCategoriesLoading}
                  onChange={(tradeItemCategory) => {
                    dispatch(
                      updateTransformationSetTradeItemCategory(
                        tradeItemCategory.code.code
                      )
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row">
            {nameSHowShow && (
              <div className="col-3">
                <h5 className="mb-4">Transformations</h5>
                <button
                  onClick={() => {
                    dispatch(addNewTransformation());
                  }}
                  className="btn btn-light mb-3"
                >
                  + Add new transformation
                </button>
                <DragDropContext
                  onDragEnd={(e) => {
                    if (e.destination && e.destination.index !== e.source.index)
                      dispatch(
                        switchTransformations(
                          e.source.index,
                          e.destination.index
                        )
                      );
                  }}
                >
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                      >
                        {transformations.length > 0 &&
                          map(transformations, (transformation, tIndex) => (
                            <Draggable
                              key={`transformation-${tIndex}`}
                              draggableId={`transformation-${tIndex}`}
                              index={tIndex}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <TransformationRow
                                    key={`transformation-mgmt-transformation-${tIndex}`}
                                    selected={
                                      selected_transformation_index === tIndex
                                    }
                                    onClick={(e) => {
                                      dispatch(initializeSet(tIndex));
                                    }}
                                    onRemove={(e) => {
                                      e.stopPropagation();
                                      dispatch(deleteTransformation(tIndex));
                                    }}
                                    name={get(transformation, "name")}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            )}

            {/* Transformation form */}
            <div className="col-9">
              <Sticky top={45}>
                {selected_transformation_index > -1 && <TransformationForm />}
              </Sticky>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TransformationSetForm;
