import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import update from "immutability-helper";
import map from "lodash/map";
import filter from "lodash/filter";
import find from "lodash/find";
import get from "lodash/get";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { SharedLocalizableStrings } from "cdm-shared/component/lang/LocalizableStrings";
import  DropDown from "../../common/layout/DropDown";
import { getDateFormat } from "cdm-shared/utils/date";

import {
  CONNECTOR_STATUS,
  CONNECTOR_TYPE,
  CONNECTOR_SCOPE,
  CONNECTOR_VISIBILITY,
} from "../utils";

import {
  Margin,
  Row,
  Col,
} from "cdm-ui-components";
import {
  InputWrap,
  DivWrap,
  ZoneWrap,
  ContainerWrap,
  LabelWrap,
  DatePickerWrap,
  CheckboxWrap,
} from "./styles";
import useLanguages from "cdm-shared/hook/useLanguages";

import { useHistory } from "react-router-dom";

// *******import all actions**** //
import {
  getOffersListAction,
  getManufacturersAction,
  setConnectorsActions,
  getTargetMarketAction,
  getRetailersAction,
  getConnectorsActions,
} from "cdm-shared/redux/actions/subscription";

// *******import all selectors**** //
import {
  getOfferDataList,
  getTargetMarkets,
  getConnectors,
  getRetailer,
} from "cdm-shared/redux/selectors/subscription";

//import services
import {
  createConnector,
  updateConnector,
  deleteConnector as delConnector,
} from "cdm-shared/services/subscription";

//custom components
import CustomActionsBar from "../../common/layout/CustomActionsBar";
import ButtonRow from "../../common/component/ButtonRow";
import ConfirmBox from "../../common/component/ConfirmBox";
import CustomToast from "../../common/component/CustomToast";

const AddConnectors = ({ translate, match = null }) => {
  const id = match?.params.id;

  const dispatch = useDispatch();
  const history = useHistory();

  const [message, setMessage] = useState(null);
  const [confirmBox, setConfirmBox] = useState(false);

  const languages = useLanguages();

  //all selectors
  const retailer = useSelector(getRetailer);
  const connectors = useSelector(getConnectors);
  const offerlist = useSelector(getOfferDataList);
  const targetmarkets = useSelector(getTargetMarkets);


  const currentRetailer = useMemo(
      () => {
        if (connectors.retailerId) {
          return filter(retailer, (o) => connectors.retailerId === o.id);
        } else {
          return []
        }
      } ,
    [retailer, connectors]
  );
  const currentTargetMarkets = useMemo(
      () => {
        if (connectors.targetMarketId) {
          return filter(targetmarkets, (o) => connectors.targetMarketId === o.id);
        } else {
          return []
        }
      },
    [targetmarkets, connectors]
  );

  const currentOfferIds = get(connectors, "offerIds");
  const currentOffers = useMemo(
      () =>
        map(currentOfferIds, (offerId) =>
          find(offerlist, (o) => get(o, "id") === offerId)
        ),
      [offerlist, currentOfferIds]
  );

  const releaseDate = get(connectors, "releaseDate") || null;
  const currentReleaseDate = useMemo(() => {
    return releaseDate ? getDateFormat(releaseDate, "YYYY-MM-DD") : null;
  }, [releaseDate]);

  const discontinuedDate = get(connectors, "discontinuedDate") || null;
  const currentDiscontinuedDate = useMemo(() => {
    return discontinuedDate
      ? getDateFormat(discontinuedDate, "YYYY-MM-DD")
      : null;
  }, [discontinuedDate]);

  useEffect(() => {
    dispatch(getManufacturersAction());
    dispatch(getRetailersAction());
    dispatch(getOffersListAction());
    dispatch(getTargetMarketAction());
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(getConnectorsActions(id));
    } else {
      dispatch(setConnectorsActions({}));
    }
  }, [id]);

  const setData = (type) => (data) => {
    let subsdata = {};
    switch (type) {
      case "offer":
        subsdata = {
          ...connectors,
          offerIds: data ? map(data, (o) => get(o, "id")) : [],
        };
        break;
      case "targetmarkets":
        subsdata = {
          ...connectors,
          targetMarketId: data.id,
        };
        break;
      case "retailer":
        subsdata = {
          ...connectors,
          retailerId: data.id,
        };
        break;
      case "type":
        subsdata = {
          ...connectors,
          type: data ? data : null,
        };
        break;
      case "scopes":
        subsdata = {
          ...connectors,
          scopes: data || [],
        };
        break;
      case "status":
        subsdata = {
          ...connectors,
          status: data ? data : null,
        };
        break;
      case "visibility":
        subsdata = {
          ...connectors,
          visibility: data,
        };
        break;
      case "releaseDate":
        subsdata = {
          ...connectors,
          releaseDate: data ? data.format("YYYY-MM-DD") : null,
        };
        break;
      case "discontinuedDate":
        subsdata = {
          ...connectors,
          discontinuedDate: data ? data.format("YYYY-MM-DD") : null,
        };
        break;
      case "sentByManufacturer":
        subsdata = {
          ...connectors,
          sentByManufacturer: !!data.currentTarget.checked,
        };
        break;
      default:
        return subsdata;
    }
    dispatch(setConnectorsActions(subsdata));
  };

  const goBack = (e) => {
    history.push("/connectors");
  };

  const onCreateNew = () => {
    if (Object.keys(connectors).length > 0) {
      history.push("/create-connectors");
    }
  };

  const saveConnector = () => {
    if (id) {
      updateConnector(connectors)
          .then(successResponse("update"))
          .catch(errorResponse);
    } else {
      createConnector(connectors)
          .then(successResponse("create"))
          .catch(errorResponse);
    }
  };

  const successResponse =
      (type = "") =>
          (res) => {
            if (res.status === 200) {
              if (type === "delete") {
                const succMsg = {
                  msgType: "success",
                  message: "Data Deleted Successfully",
                };
                setMessage(succMsg);
                setTimeout(() => {
                  setMessage(null);
                  history.push(`/connectors`);
                }, 3000);
              } else {
                if (id) {
                  const succMsg = {
                    msgType: "success",
                    message: "Data Updated Successfully",
                  };
                  setMessage(succMsg);
                  setTimeout(() => {
                    setMessage(null);
                  }, 3000);
                } else {
                  const succMsg = {
                    msgType: "success",
                    message: "Data Created Successfully",
                  };
                  setMessage(succMsg);
                  setTimeout(() => {
                    setMessage(null);
                    history.push(`/update-connectors/${res.data}`);
                  }, 3000);
                }
              }
            }
          };

  const errorResponse = (err) => {
    const errMsg = {
      msgType: "error",
      message: get(err, "response.data.ErrorMessage"),
    };
    setMessage(errMsg);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const closeConfirmBox = () => setConfirmBox(false);

  const deleteConnector = () => {
    setConfirmBox(false);
    delConnector(connectors.id)
        .then(successResponse("delete"))
        .catch(errorResponse);
  };

  return (
    <>
      <ConfirmBox
          label={`connector`}
          show={confirmBox}
          onClose={closeConfirmBox}
          onDelete={deleteConnector}
      />
      <CustomToast messageObject={message} />

      <ContainerWrap>
        {/* Actions Bar*/}
        <CustomActionsBar
            title={
              id
                  ? `${translate("connectors.main.edit")}`
                  : `${translate("connectors.main.new")}`
            }
            goBack={goBack}
            id={id || null}
            translate={translate}
            onCreateNew={onCreateNew}
            buttonLabel={`+ ${translate("connectors.main.create_new")}`}
            goBackLabel={`${translate("connectors.main.go_back")}`}
        />

        <Row>
          <Col col={12}>
            <ZoneWrap>
              <Row>
                <Col
                  col={12}
                  style={{
                    maxWidth: "70%",
                    margin: "auto",
                  }}
                >
                  {id && (
                    <DivWrap>
                      <LabelWrap>
                        {translate("connectors.add_edit.id")}
                      </LabelWrap>
                      <Margin left={4} />
                      <InputWrap
                        disabled={true}
                        type="text"
                        value={connectors.id}
                      />
                    </DivWrap>
                  )}

                  <div>
                    {Object.keys(connectors).length > 0 && (
                      <SharedLocalizableStrings
                        width={"64%"}
                        integrated
                        languages={languages}
                        localizableStrings={["name"]}
                        labels={{
                          name: "Name",
                        }}
                        input={connectors}
                        onChange={(property, value) => {
                          dispatch(
                            setConnectorsActions(
                              update(connectors, {
                                [property]: { $set: value },
                              })
                            )
                          );
                        }}
                      />
                    )}
                    {Object.keys(connectors).length === 0 && (
                      <SharedLocalizableStrings
                        width={"64%"}
                        integrated
                        languages={languages}
                        localizableStrings={["name"]}
                        labels={{
                          name: "Name",
                        }}
                        input={null}
                        onChange={(property, value) => {
                          dispatch(
                            setConnectorsActions(
                              update(connectors, {
                                [property]: { $set: value },
                              })
                            )
                          );
                        }}
                      />
                    )}
                  </div>

                  <DivWrap>
                    <LabelWrap>
                      {translate("connectors.add_edit.retailers")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      className={"select-styling-full"}
                      value={currentRetailer}
                      isSearchable={true}
                      options={retailer}
                      onChange={setData("retailer")}
                      getOptionLabel={(o) => get(o, "name")}
                      getOptionValue={(o) => get(o, "id")}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate("connectors.add_edit.target_markets")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      className={"select-styling-full"}
                      value={currentTargetMarkets}
                      isSearchable={true}
                      options={targetmarkets}
                      onChange={setData("targetmarkets")}
                      getOptionLabel={(o) => get(o, "name")}
                      getOptionValue={(o) => get(o, "id")}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate("connectors.add_edit.offers")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      className={"select-styling-full"}
                      isMulti
                      closeMenuOnSelect={false}
                      value={currentOffers}
                      isSearchable={true}
                      options={offerlist}
                      onChange={setData("offer")}
                      getOptionLabel={(o) => get(o, "name.values[0].value")}
                      getOptionValue={(o) => get(o, "id")}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate("connectors.add_edit.type")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      className={"select-styling-full"}
                      value={[get(connectors, "type")]}
                      isSearchable={true}
                      options={CONNECTOR_TYPE}
                      onChange={setData("type")}
                      getOptionLabel={(o) => o}
                      getOptionValue={(o) => o}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate("connectors.add_edit.scopes")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      isMulti
                      className={"select-styling-full"}
                      value={
                        get(connectors, "scopes")
                          ? get(connectors, "scopes")
                          : []
                      }
                      isSearchable={true}
                      options={CONNECTOR_SCOPE}
                      onChange={setData("scopes")}
                      getOptionLabel={(o) => o}
                      getOptionValue={(o) => o}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate("connectors.add_edit.status")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      className={"select-styling-full"}
                      value={
                        get(connectors, "status")
                          ? [get(connectors, "status")]
                          : []
                      }
                      isSearchable={true}
                      options={CONNECTOR_STATUS}
                      onChange={setData("status")}
                      getOptionLabel={(o) => o}
                      getOptionValue={(o) => o}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate("connectors.add_edit.visibility")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      className={"select-styling-full"}
                      value={
                        get(connectors, "visibility")
                          ? [get(connectors, "visibility")]
                          : []
                      }
                      isSearchable={true}
                      options={CONNECTOR_VISIBILITY}
                      onChange={setData("visibility")}
                      getOptionLabel={(o) => o}
                      getOptionValue={(o) => o}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate("connectors.add_edit.release_date")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DatePickerWrap
                      dateFormat={`YYYY-MM-DD`}
                      timeFormat={false}
                      onChange={setData("releaseDate")}
                      value={currentReleaseDate}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate("connectors.add_edit.discontinued_date")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DatePickerWrap
                      dateFormat={`YYYY-MM-DD`}
                      timeFormat={false}
                      onChange={setData("discontinuedDate")}
                      value={currentDiscontinuedDate}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate(
                        "connectors.add_edit.sent_by_manufacturer_himself"
                      )}
                    </LabelWrap>
                    <Margin left={4} />
                    <CheckboxWrap>
                      <InputWrap
                        hideWidth={true}
                        type="checkbox"
                        checked={!!connectors.sentByManufacturer}
                        onChange={setData("sentByManufacturer")}
                      />
                    </CheckboxWrap>
                  </DivWrap>
                  <Margin top={4} />
                  <ButtonRow
                      onSave={saveConnector}
                      onDelete={id ? () => setConfirmBox(true) : null}
                      title={
                        id
                          ? `${translate("connectors.main.update")}`
                          : `${translate("connectors.main.create")}`
                      }
                      title2={`${translate("connectors.main.delete")}`}
                  />
                </Col>
              </Row>
            </ZoneWrap>
          </Col>
        </Row>
      </ContainerWrap>
    </>
  );
};

export default withLocalization(AddConnectors);
