import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import filter from "lodash/filter";
import get from "lodash/get";
import { withLocalization } from "common/redux/hoc/withLocalization";
import DropDown from "../../common/layout/DropDown";
import { getDateFormat } from "cdm-shared/utils/date";
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
} from "./styles";
import {
  getManufacturersAction,
  getAllConnectorsAction,
  setConnectionsActions,
  getConnectionsActions,
} from "cdm-shared/redux/actions/subscription";
import {
  manufacturerData,
  connectorsData,
  getConnectionsData,
} from "cdm-shared/redux/selectors/subscription";
import { useHistory } from "react-router-dom";
import { CONNECTION_STATUS } from "../utils";

import {
  createConnection,
  updateConnection,
  deleteConnection as delConnection,
} from "cdm-shared/services/subscription";

//custom components
import CustomActionsBar from "../../common/layout/CustomActionsBar";
import ButtonRow from "../../common/component/ButtonRow";
import ConfirmBox from "../../common/component/ConfirmBox";
import CustomToast from "../../common/component/CustomToast";

const AddConnections = ({ translate, match = null }) => {
  const id = match?.params.id;
  
  const [message, setMessage] = useState(null);
  const [confirmBox, setConfirmBox] = useState(false);
  
  const dispatch = useDispatch();
  const history = useHistory();
  const connections = useSelector(getConnectionsData);
  const manufacturerdata = useSelector(manufacturerData);
  const connectorsdata = useSelector(connectorsData);
  
  const currentManufacturer = useMemo(
    () => filter(manufacturerdata, (o) => connections.manufacturerId === o.id),
    [manufacturerdata, connections]
  );
  
  const currentConnector = useMemo(
    () => filter(connectorsdata, (o) => connections.connectorId === o.id),
    [connectorsdata, connections]
  );
  
  const releaseDate = get(connections, "releaseDate") || null;
  const currentReleaseDate = useMemo(
    () => {
      return releaseDate ? getDateFormat(releaseDate,'YYYY-MM-DD') : null;
    },
    [releaseDate]
  );
  
  useEffect(() => {
    dispatch(getManufacturersAction());
    dispatch(getAllConnectorsAction());
  }, [dispatch]);
  useEffect(() => {
    if (match.url.includes("update-connection") && id === "undefined") {
      history.push("/connections");
      return;
    }
    if (id) {
      dispatch(getConnectionsActions(id));
    } else {
      dispatch(setConnectionsActions({}));
    }
  }, [id, dispatch, history, match.url]);
  
  const setData = (type) => (data) => {
    let subsdata = {};
    switch (type) {
      case "manufacturer":
        subsdata = {
          ...connections,
          manufacturerId: data?.id,
          manufacturerName: data?.name,
        };
        break;
      case "connectors":
        subsdata = {
          ...connections,
          connectorId: data?.id,
        };
        break;
      case "status":
        subsdata = {
          ...connections,
          status: data,
        };
        break;
      case "releasedate":
        subsdata = {
          ...connections,
          releaseDate: data ? getDateFormat(data, "YYYY-MM-DD") : null,
        };
        break;
      default:
        return subsdata;
    }
    dispatch(setConnectionsActions(subsdata));
  };

  const saveConnection = () => {
    if (id) {
      updateConnection(connections)
          .then(successResponse("update"))
          .catch(errorResponse);
    } else {
      createConnection(connections)
          .then(successResponse("create"))
          .catch(errorResponse);
    }
  };
  
  const deleteConnection = () => {
    setConfirmBox(false);
    delConnection(connections.id)
        .then(successResponse("delete"))
        .catch(errorResponse);
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
              history.push(`/connections`);
            }, 3000);
          } else {
            if (id) {
              const succMsg = {
                msgType: "success",
                message: "Data Updated Successfully",
              };
              setMessage(succMsg);
              dispatch(getConnectionsActions(id));
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
                history.push(`/update-connections/${res.data}`);
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
  
  const goBack = (e) => {
    history.push("/connections");
  };
  
  const onCreateNew = () => {
    if (Object.keys(connections).length > 0) {
      history.push("/create-connections");
    }
  };

  const closeConfirmBox = () => setConfirmBox(false);
  
  return (
    <>
      <ConfirmBox
        label={`connection`}
        show={confirmBox}
        onClose={closeConfirmBox}
        onDelete={deleteConnection}
      />
      <CustomToast messageObject={message} />
      <ContainerWrap>
        {/* Actions Bar*/}
        <CustomActionsBar
          title={
            id
              ? `${translate("connections.main.edit")}`
              : `${translate("connections.main.new")}`
          }
          goBack={goBack}
          id={id || null}
          translate={translate}
          onCreateNew={onCreateNew}
          buttonLabel={`+ ${translate("connections.main.create_new")}`}
          goBackLabel={`${translate("connections.main.go_back")}`}
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
                        {translate("connections.add_edit.id")}
                      </LabelWrap>
                      <Margin left={4} />
                      <InputWrap
                        disabled={true}
                        type="text"
                        value={connections.id}
                      />
                    </DivWrap>
                  )}
                  
                  <DivWrap>
                    <LabelWrap>
                      {translate("connections.add_edit.manufacturer")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      className={"select-styling-full"}
                      value={currentManufacturer}
                      isSearchable={true}
                      options={manufacturerdata}
                      onChange={setData("manufacturer")}
                      getOptionLabel={(o) => get(o, "name")}
                      getOptionValue={(o) => get(o, "id")}
                    />
                  </DivWrap>
                  
                  <DivWrap>
                    <LabelWrap>
                      {translate("connections.add_edit.connector")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      className={"select-styling-full"}
                      value={currentConnector}
                      isSearchable={true}
                      options={connectorsdata}
                      onChange={setData("connectors")}
                      getOptionLabel={(o) => get(o, "name")}
                      getOptionValue={(o) => get(o, "id")}
                    />
                  </DivWrap>
                  
                  <DivWrap>
                    <LabelWrap>
                      {translate("connections.add_edit.status")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      className={"select-styling-full"}
                      value={[get(connections, "status")]}
                      isSearchable={true}
                      options={CONNECTION_STATUS}
                      onChange={setData("status")}
                      getOptionLabel={(o) => o}
                      getOptionValue={(o) => o}
                    />
                  </DivWrap>
                  
                  <DivWrap>
                    <LabelWrap>
                      {translate("connections.add_edit.release_date")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DatePickerWrap
                      dateFormat={`YYYY-MM-DD`}
                      timeFormat={false}
                      onChange={setData("releasedate")}
                      value={currentReleaseDate}
                    />
                  </DivWrap>
                  
                  <Margin top={4} />
                  <ButtonRow
                      onSave={saveConnection}
                      onDelete={id ? () => setConfirmBox(true) : null}
                      title={
                        id
                            ? `${translate("connections.main.update")}`
                            : `${translate("connections.main.create")}`
                      }
                      title2={`${translate("connections.main.delete")}`}
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

export default withLocalization(AddConnections);
