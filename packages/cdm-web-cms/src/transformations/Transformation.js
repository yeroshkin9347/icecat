// Dependencies
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import get from "lodash/get";
import { useDispatch, useSelector } from "react-redux";

// Localization
import { withLocalization } from "common/redux/hoc/withLocalization";
import {
  getTaxonomiesData,
  getTradeItemCategoriesAction,
  getPropertyGroupsAction,
  postTransformationSetAction,
  deleteTransformationSetAction,
  putTransformationSetAction,
  getActionDefinitionsAction,
  errorMessage,
  resetTaxonomies,
  resetTradeItemCategories,
  resetPropertiesGroups,
  resetActionsDefinitions,
  resetBusinessRulesSets,
  resetTradeItemProperties,
  resetEditAction,
  resetTransformationSet,
  selectTransformation,
  getTransformationSet,
} from "cdm-shared/redux/actions/transformation";

import {
  errorMessageSelector,
  getTradeItemTransformationSelector,
} from "cdm-shared/redux/selectors/transformation";

// Components
import PageWrapper from "../common/layout/PageWrapper";
import ActionsBar from "../common/layout/ActionsBar";
import TransformationSetForm from "./TransformationSetForm";

import { Toast } from "cdm-ui-components";

const toast_message_style = {
  zIndex: 999999,
  position: "fixed",
  bottom: "20px",
  left: "20px",
};

const Transformation = ({
  match: {
    params: { id },
  },
}) => {
  //state
  const [persistenceStatus, setPersistanceStatus] = useState(null);
  const [persistenceMessage, setPersistenceMessage] = useState(null);

  //history
  const history = useHistory();

  //dispatcher
  const dispatch = useDispatch();

  //selector
  const error_message = useSelector(errorMessageSelector);
  const transformationSet = useSelector(getTradeItemTransformationSelector);

  useEffect(() => {
    return () => {
      dispatch(resetTaxonomies());
      dispatch(resetTradeItemCategories());
      dispatch(resetPropertiesGroups());
      dispatch(resetActionsDefinitions());
      dispatch(resetBusinessRulesSets());
      dispatch(resetTradeItemProperties());
      dispatch(resetEditAction());
    };
  }, []);

  useEffect(() => {
    reset();
    init();
  }, [id]);

  useEffect(() => {
    if (error_message) {
      PersistenceStatus(false, error_message);
    }
  }, [error_message]);

  function init() {
    if (id) {
      dispatch(getTransformationSet(id));
    } else {
      reset();
    }
    loadDependencies();
  }

  function reset() {
    dispatch(resetTransformationSet());
    dispatch(selectTransformation(-1));
  }

  function loadDependencies() {
    dispatch(getTaxonomiesData());
    dispatch(getTradeItemCategoriesAction());
    dispatch(getPropertyGroupsAction());
    dispatch(getActionDefinitionsAction());
  }

  const deleteTransformation = () => {
    if (!window.confirm("Are you sure to delete this transformation?")) return;
    dispatch(deleteTransformationSetAction(id))
      .then((res) => history.push("/transformations"))
      .catch((err) => console.log(err));
  };

  const PersistenceStatus = (persistenceStatus, persistenceMessage) => {
    setPersistanceStatus(persistenceStatus);
    setPersistenceMessage(persistenceMessage);
    setTimeout(() => {
      setPersistanceStatus(null);
      setPersistenceMessage(null);
      dispatch(errorMessage(null));
    }, 5000);
  };

  return (
    <>
      <div className="container-fluid no-padding minus-margin-top">
        {/* Actions */}
        <ActionsBar>
          <div className="col-4">
            <h2 className="h4 pt-1 m-0 font-weight-light">
              {id ? get(transformationSet, "name") : "New transformations set"}
            </h2>
          </div>
          <div className="col-8 text-right">
            <Link to={`/transformations`} className="btn btn-light mr-2">
              Go back to list
            </Link>
            {id && (
              <Link to={`/transformation`} className="btn btn-success mr-2">
                + Create new transformations set
              </Link>
            )}
            {id && (
              <button
                className="btn btn-danger mr-2"
                onClick={deleteTransformation}
              >
                Delete
              </button>
            )}
            {!id && (
              <button
                onClick={(e) =>
                  dispatch(postTransformationSetAction())
                    .then((_id) => {
                      PersistenceStatus(true, "Created");
                      history.push(`/transformation/${_id}`);
                    })
                    .catch((err) => PersistenceStatus(false, err.message))
                }
                className="btn btn-primary"
              >
                Create
              </button>
            )}
            {id && (
              <button
                onClick={(e) =>
                  dispatch(putTransformationSetAction())
                    .then(() => {
                      PersistenceStatus(true, "Updated!");
                    })
                    .catch((err) => {
                      PersistenceStatus(false, err.message);
                    })
                }
                className="btn btn-primary"
              >
                Save
              </button>
            )}
          </div>
        </ActionsBar>

        {/* Content */}
        <PageWrapper>
          {/* <Card> */}
          <TransformationSetForm />
          {/* </Card> */}
        </PageWrapper>
      </div>

      {persistenceStatus === false && (
        <Toast style={toast_message_style} danger>
          {"Failed"}
          {persistenceMessage && ` - ${persistenceMessage}`}
        </Toast>
      )}
      {persistenceStatus === true && (
        <Toast style={toast_message_style} success>
          {persistenceMessage && ` ${persistenceMessage}!`}
        </Toast>
      )}
    </>
  );
};

// withLocalProviders used to work on a single context tree instance
export default withLocalization(Transformation);
