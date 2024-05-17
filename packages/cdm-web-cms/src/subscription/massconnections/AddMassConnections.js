import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import map from "lodash/map";
import get from "lodash/get";
import { withLocalization } from "common/redux/hoc/withLocalization";
import DropDown from "../../common/layout/DropDown";
import CustomButton from "../../common/layout/CustomButton";
import CustomModal from "../../common/layout/CustomModal";
import reduce from "lodash/reduce";
import {
  getConnectionsByConnectorIds,
} from "cdm-shared/services/subscription";
import indexOf from "lodash/indexOf";

import {
  CONNECTOR_STATUS,
} from "../utils";

import {
  Margin,
  Row,
  Col,
} from "cdm-ui-components";
import {
  DivWrap,
  ZoneWrap,
  ContainerWrap,
  LabelWrap,
  DatePickerWrap,
  ToastWrap,
} from "./styles";
import { PRIMARY, SECONDARY, WHITE } from "cdm-shared/component/color";

import { useHistory } from "react-router-dom";
import { deleteConnector } from "cdm-shared/services/subscription";

// *******import all actions**** //
import {
  getManufacturersAction,
  setConnectorsActions,
  connectionsFailureActions,
  setConnectionsMassToolsActions,
  saveConnectionsMassToolsActions,
  getAllConnectorsAction,
} from "cdm-shared/redux/actions/subscription";

// *******import all selectors**** //
import {
  getConnectors,
  getConnectionsMassTools,
  getConnectionsMassFailure,
  getConnectionsMassSuccess,
  getConnectionsMassLoader,
  connectorsData,
  manufacturerData,
} from "cdm-shared/redux/selectors/subscription";

const multiSelectStyles = {
  height: "calc(100vh - 230px)",
  width: "100%",
};
const multiSelectBoxStyling = {
  width: "100%",
  textAlign: "left",
  fontSize:20,
  marginBottom:10,
  fontWeight:'500'
};
const divwrapcustomstyling = {
  flexDirection: "column",
  width: "45%",
};

const AddMassConnectors = ({ translate }) => {
  const dispatch = useDispatch();
  const [showtoast, setShowtoast] = useState(false);
  const [confirmBox, setConfirmBox] = useState(false);
  const history = useHistory();
  const manufacturersSelect = useRef(null);
  

  //all selectors
  const manufacturerdata = useSelector(manufacturerData);
  const connectionsfailure = useSelector(getConnectionsMassFailure);
  const connectionssuccess = useSelector(getConnectionsMassSuccess);
  const connectionsloader = useSelector(getConnectionsMassLoader);
  const connectors = useSelector(getConnectors);
  const connectorsdata = useSelector(connectorsData);
  const connectionsmasstools = useSelector(getConnectionsMassTools);

  useEffect(() => {
    dispatch(getManufacturersAction());
    dispatch(getAllConnectorsAction());
  }, []);

  useEffect(() => {
    setTimeout(() => {
      dispatch(connectionsFailureActions(null));
    }, 2000);
  }, [connectionsfailure]);
  useEffect(() => {
    if (connectionssuccess) {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [connectionssuccess]);

  const setData = (type) => (data) => {
    let subsdata = {};
    switch (type) {
      case "manufacturerIds":
        subsdata = {
          ...connectionsmasstools,
          manufacturerIds: reduce(
            data.currentTarget.options,
            (results, value) => {
              if (!value.selected) return results;
              return [...results, value.value];
            },
            []
          ),
        };
        break;
      case "connectorIds":
        subsdata = {
          ...connectionsmasstools,
          connectorIds: reduce(
            data.currentTarget.options,
            (results, value) => {
              if (!value.selected) return results;
              return [...results, value.value];
            },
            []
          ),
        };
        break;
      case "status":
        subsdata = {
          ...connectionsmasstools,
          status: data ? data : null,
        };
        break;
      case "releaseDate":
        subsdata = {
          ...connectionsmasstools,
          releaseDate: data ? data.format("YYYY-MM-DD") : null,
        };
        break;
      default:
        return subsdata;
    }
    dispatch(setConnectionsMassToolsActions(subsdata));
  };

  const deleteConnectorsData = (currentId) => {
    deleteConnector(currentId)
      .then((res) => {
        setConfirmBox(false);
        setShowtoast(true);
        setTimeout(() => {
          setShowtoast(false);
          history.push("/connectors");
        }, 2000);
        //  setToastDisplay("success", "subscription deleted");
        dispatch(setConnectorsActions({}));
      })
      .catch((err) => alert("Error"))
      .finally(() => {});
  };

  return (
    <>
      {showtoast && <ToastWrap danger>{"subscription deleted"}</ToastWrap>}
      {connectionsfailure && (
        <ToastWrap danger>{connectionsfailure.message}</ToastWrap>
      )}
      {connectionssuccess && (
        <ToastWrap success>{connectionssuccess.message}</ToastWrap>
      )}
      {confirmBox && (
        <CustomModal
          onClose={() => setConfirmBox(false)}
          headerTitle={"Confirm"}
          bodyContent={"Are you sure you want to delete this connector?"}
          footer={() => (
            <>
              <CustomButton
                title={"Yes"}
                backgroundColor={PRIMARY}
                onClick={() => deleteConnectorsData(connectors.id)}
              />
              <Margin left={2} />
              <CustomButton
                title={"No"}
                backgroundColor={SECONDARY}
                onClick={() => setConfirmBox(false)}
              />
            </>
          )}
        />
      )}
      <ContainerWrap>
        <Row>
          <Col col={12}>
            <ZoneWrap>
              <Row>
                <Col col={6}>
                  <Row>
                    <DivWrap style={divwrapcustomstyling}>
                      <LabelWrap style={multiSelectBoxStyling}>
                        {translate(
                          "connectionsmasstool.add_edit.manufacturers"
                        )}
                      </LabelWrap>
                      {/* manufacturerIds */}
                      <select
                        style={multiSelectStyles}
                        ref={manufacturersSelect}
                        onChange={setData("manufacturerIds")}
                        multiple
                      >
                        {map(manufacturerdata, (o, k) => (
                          <option key={`c-man-${k}`} value={o.id}>
                            {get(o, "name")}
                          </option>
                        ))}
                      </select>
                    </DivWrap>
                    <Margin left={4} />
                    <DivWrap style={divwrapcustomstyling}>
                      <LabelWrap style={multiSelectBoxStyling}>
                        {translate("connectionsmasstool.add_edit.connectors")}
                      </LabelWrap>
                      {/* connectorIds */}
                      <select
                        style={multiSelectStyles}
                        onChange={setData("connectorIds")}
                        multiple
                      >
                        {map(connectorsdata, (o, k) => (
                          <option key={`c-ret-${k}`} value={o.id}>
                            {get(o, "name")}
                          </option>
                        ))}
                      </select>
                    </DivWrap>
                  </Row>
                </Col>
                <Col col={6}>
                  <Margin top={4} />

                  <DivWrap>
                    <LabelWrap>
                      {translate("connectionsmasstool.add_edit.status")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      className={"select-styling-full"}
                      value={[get(connectionsmasstools, "status")]}
                      isSearchable={true}
                      options={CONNECTOR_STATUS}
                      onChange={setData("status")}
                      getOptionLabel={(o) => o}
                      getOptionValue={(o) => o}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate("connectionsmasstool.add_edit.release_date")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DatePickerWrap
                      onChange={setData("releaseDate")}
                      value={get(connectionsmasstools, "releaseDate")}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate(
                        "connectionsmasstool.add_edit.connections_duplication"
                      )}
                    </LabelWrap>
                    <Margin left={4} />
                    <CustomButton
                      style={{
                        border: `1px solid ${PRIMARY}`,
                        color: `${PRIMARY}`,
                        width: `100%`,
                      }}
                      hoverColor={WHITE}
                      hoverBackgroundColor={PRIMARY}
                      onClick={() => {
                        if (!connectionsmasstools.connectorIds) return;
                        getConnectionsByConnectorIds(
                          connectionsmasstools.connectorIds
                        ).then((res) => {
                          const changeManufacturerIds = map(
                            res.data,
                            (connection) => connection.manufacturerId
                          );

                          dispatch(
                            setConnectionsMassToolsActions({
                              ...connectionsmasstools,
                              manufacturerIds: changeManufacturerIds,
                            })
                          );
                          map(manufacturersSelect.current.options, (o) => {
                            o.selected = indexOf(changeManufacturerIds, o.value) !== -1;
                          });
                        });
                      }}
                      backgroundColor={WHITE}
                      padding={`8px 10px`}
                      title={translate(
                        "connectionsmasstool.main.select_manufacturer"
                      )}
                    />
                  </DivWrap>

                  <Margin top={4} />
                  <DivWrap style={{ float: "right" }}>
                    <CustomButton
                      loader={connectionsloader}
                      disabled={
                        !connectionsmasstools.connectorIds ||
                        !connectionsmasstools.manufacturerIds
                      }
                      onClick={() =>
                        dispatch(
                          saveConnectionsMassToolsActions(connectionsmasstools)
                        )
                      }
                      backgroundColor={PRIMARY}
                      padding={`8px 10px`}
                      title={translate("connectionsmasstool.main.create")}
                    />
                  </DivWrap>
                </Col>
              </Row>
            </ZoneWrap>
          </Col>
        </Row>
      </ContainerWrap>
    </>
  );
};

export default withLocalization(AddMassConnectors);
