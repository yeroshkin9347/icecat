import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import map from "lodash/map";
import find from "lodash/find";
import get from "lodash/get";
import filter from "lodash/filter";
import { withLocalization } from "common/redux/hoc/withLocalization";
import DropDown from "../common/layout/DropDown";
import CustomButton from "../common/layout/CustomButton";
import { edit } from "react-icons-kit/fa/edit";
import { plus } from "react-icons-kit/fa/plus";
import indexOf from "lodash/indexOf";
import { ExternalLink } from "cdm-shared/component/Link";
import { makeOption } from "../subscription/utils";
import { Margin, Row, Col, Icon, H5, Modal } from "cdm-ui-components";
import {
  InputWrap,
  DivWrap,
  ZoneWrap,
  ContainerWrap,
  LabelWrap,
  CheckboxWrap,
  iconstyle,
  TextareaWrap,
} from "./styles";
import { PRIMARY, BLACKLIGHT } from "cdm-shared/component/color";
import { useHistory } from "react-router-dom";
import Datatable from "common/component/smartdatatable/Datatable";

import {
  createRetailer,
  updateRetailer,
  deleteRetailerById,
  createEnrichmentConfiguration,
  updateEnrichmentConfiguration,
  deleteEnrichmentConfiguration,
} from "cdm-shared/services/retailer";

// *******import all actions**** //
import {
  getOffersListAction,
  getManufacturersAction,
  retailerFailureActions,
  retailerSuccessActions,
  getTargetMarketAction,
  getRetailersAction,
  setRetailerDataActions,
  getGroupsAction,
  getRetailerActions,
  saveGroup,
  getExportAcAction,
  getAllRetailersAction,
  getMatrixMappingsAction,
  getEnrichmentConfigurationsByRetailerIdAction,
} from "cdm-shared/redux/actions/subscription";

// *******import all selectors**** //
import {
  getRetailerFailure,
  getTargetMarkets,
  getRetailerData,
  getRetailerSuccess,
  getRetailerLoader,
  getGroupListData,
  manufacturerData,
  getExportActionData,
} from "cdm-shared/redux/selectors/subscription";

//custom components
import CustomActionsBar from "../common/layout/CustomActionsBar";
import ButtonRow from "../common/component/ButtonRow";
import ConfirmBox from "../common/component/ConfirmBox";
import CustomToast from "../common/component/CustomToast";

const ModalForm = ({ translate, onChange, modalData, onSave }) => {
  const retaileralldata = useSelector(
      (state) => state.subscription.retaileralldata
  );
  const matrixmappingdata = useSelector(
      (state) => state.subscription.matrixdata
  );
  return (
    <div>
      <ContainerWrap>
        <Row>
          <Col col={12}>
            <DivWrap>
              <LabelWrap>{translate("retailer.modal.name")}</LabelWrap>
              <Margin left={4} />
              <InputWrap
                  type="text"
                  value={get(modalData, "name")}
                  onChange={(e) => onChange("name")(e.target.value)}
              />
            </DivWrap>
            <DivWrap>
              <LabelWrap>{translate("retailer.modal.description")}</LabelWrap>
              <Margin left={4} />
              <TextareaWrap
                  type="text"
                  value={get(modalData, "description")}
                  onChange={(e) => onChange("description")(e.target.value)}
              />
            </DivWrap>

            <DivWrap>
              <LabelWrap>{translate("retailer.modal.retailer")}</LabelWrap>
              <Margin left={4} />
              <DropDown
                  className={"select-styling-full"}
                  value={find(
                      retaileralldata,
                      (rd) => rd.id === modalData.retailerId
                  )}
                  isSearchable={true}
                  options={retaileralldata}
                  onChange={(e) => {
                    onChange("retailerId")(e.id);
                  }}
                  getOptionLabel={(o) => get(o, "name")}
                  getOptionValue={(o) => get(o, "id")}
              />
            </DivWrap>

            <DivWrap>
              <LabelWrap>
                {translate("retailer.modal.matrix_mapping")}
              </LabelWrap>
              <Margin left={4} />
              <DropDown
                  className={"select-styling-full"}
                  value={filter(
                      matrixmappingdata,
                      (tm) => tm.id === modalData.matrixMappingId
                  )}
                  isSearchable={true}
                  options={matrixmappingdata}
                  onChange={(e) => onChange("matrixMappingId")(e.id)}
                  getOptionLabel={(o) => get(o, "mappingTitle")}
                  getOptionValue={(o) => get(o, "id")}
              />
            </DivWrap>

            <DivWrap>
              <LabelWrap>{translate("retailer.modal.is_csv")}</LabelWrap>
              <Margin left={4} />
              <CheckboxWrap>
                <InputWrap
                  hideWidth={true}
                  type="checkbox"
                  value={get(modalData, "isCsv")}
                  onChange={(e) => {
                    onChange("isCsv")(e.target.checked);
                  }}
                />
              </CheckboxWrap>
            </DivWrap>

            <DivWrap justifyContent={`flex-start`}>
              <H5>{translate("retailer.modal.ftp_connection_settings")}</H5>
            </DivWrap>
            <DivWrap>
              <LabelWrap>{translate("retailer.modal.url")}</LabelWrap>
              <Margin left={4} />
              <InputWrap
                type="text"
                value={get(modalData, "ftpConnectionSettings.url")}
                onChange={(e) => {
                  onChange("ftpConnectionSettings")({
                    ...modalData.ftpConnectionSettings,
                    url: e.target.value,
                  });
                }}
              />
            </DivWrap>

            <DivWrap>
              <LabelWrap>{translate("retailer.modal.username")}</LabelWrap>
              <Margin left={4} />
              <InputWrap
                type="text"
                value={get(modalData, "ftpConnectionSettings.username")}
                onChange={(e) => {
                  onChange("ftpConnectionSettings")({
                    ...modalData.ftpConnectionSettings,
                    username: e.target.value,
                  });
                }}
              />
            </DivWrap>

            <DivWrap>
              <LabelWrap>{translate("retailer.modal.path")}</LabelWrap>
              <Margin left={4} />
              <InputWrap
                type="text"
                value={get(modalData, "ftpConnectionSettings.path")}
                onChange={(e) => {
                  onChange("ftpConnectionSettings")({
                    ...modalData.ftpConnectionSettings,
                    path: e.target.value,
                  });
                }}
              />
            </DivWrap>

            <DivWrap>
              <LabelWrap>{translate("retailer.modal.password")}</LabelWrap>
              <Margin left={4} />
              <InputWrap
                type="text"
                value={get(modalData, "ftpConnectionSettings.password")}
                onChange={(e) => {
                  onChange("ftpConnectionSettings")({
                    ...modalData.ftpConnectionSettings,
                    password: e.target.value,
                  });
                }}
              />
            </DivWrap>

            <Margin top={4} />
            <ButtonRow
              onSave={onSave}
              onDelete={null}
              title={
                modalData.id
                  ? `${translate("retailer.main.update")}`
                  : `${translate("retailer.main.create")}`
              }
              title2={`${translate("retailer.main.delete")}`}
            />
          </Col>
        </Row>
      </ContainerWrap>
    </div>
  );
};

const AddRetailer = ({ translate, match = null }) => {
  const id = match?.params.id;
  
  const dispatch = useDispatch();
  const history = useHistory();
  
  const [message, setMessage] = useState(null);
  const [confirmBox, setConfirmBox] = useState(false);
  const [confirmBoxSource, setConfirmBoxSource] = useState(false);
  
  const [newSourceFlag, setNewSourceFlag] = useState(false);
  const [groupFlag, setGroupFlag] = useState(false);
  const [editGroupValue, setEditGroupValue] = useState(null);
  const [editGroupValueFlag, setEditGroupValueFlag] = useState(false);
  
  const [modalData, setModalData] = useState({});
  
  //all selectors
  const exportactiondata = useSelector(getExportActionData);
  const retailerfailure = useSelector(getRetailerFailure);
  const retailersuccess = useSelector(getRetailerSuccess);
  const retailerloader = useSelector(getRetailerLoader);
  const enrichmentconfigurationsdata = useSelector(
      (state) => state.subscription.enrichmentconfigurationsdata
  );
  
  const retailerdata = useSelector(getRetailerData);
  const targetmarkets = useSelector(getTargetMarkets);
  const groups = useSelector(getGroupListData);
  const manufacturers = useSelector(manufacturerData);
  
  const currentTargetMarketIds = get(retailerdata, "targetMarketIds") || [];
  const selectedTargetMarkets = useMemo(
    () => filter(targetmarkets, (tm) => !!find(currentTargetMarketIds, tmId => tm.id === tmId)),
    [targetmarkets, currentTargetMarketIds]
  );
  const currentAuthorizedManufacturerIds = get(retailerdata, "authorizedManufacturerIds") || [];
  const selectedAuthorizedManufacturer = useMemo(
    () =>
      filter(
        manufacturers,
        (mf) =>
          !!find(currentAuthorizedManufacturerIds, (mfId) => mf.id === mfId)
      ),
    [manufacturers, currentAuthorizedManufacturerIds]
  );
  
  const getGroup = (option) => find(groups, (g) => g.id === option.value);
  const groupOptions = map(groups, makeOption);
  const selectedGroupOption = find(
    groupOptions,
    (o) => o.value === retailerdata.groupId
  );

  const columns = useMemo(
    () => [
      {
        Header: translate("retailer.table.id"),
        accessor: "id",
      },
      {
        Header: translate("retailer.table.name"),
        accessor: "name",
      },
      {
        Header: translate("retailer.table.description"),
        accessor: "description",
      },
      {
        Header: translate("retailer.table.action"),
        id: "action",
        accessor: (d) => (
          <DivWrap>
            <ExternalLink onClick={()=>{editSource(d)}}>
              <span style={{ cursor: "pointer" }}>
                {translate("retailer.main.edit")}
              </span>
            </ExternalLink>
            <Margin right={1} />
            <ExternalLink onClick={()=>{
              setModalData(d);
              setConfirmBoxSource(true)
            }}>
              <span style={{ color: "red", cursor: "pointer" }}>
                {translate("retailer.main.delete")}
              </span>
            </ExternalLink>
          </DivWrap>
        ),
      },
    ],
    [translate]
  );

  useEffect(() => {
    dispatch(getManufacturersAction());
    dispatch(getRetailersAction());
    dispatch(getExportAcAction());
    dispatch(getOffersListAction());
    dispatch(getTargetMarketAction());
    dispatch(getGroupsAction());
    dispatch(getAllRetailersAction());
    dispatch(getMatrixMappingsAction());
  }, [dispatch]);
  
  useEffect(() => {
    if (id){
      dispatch(getRetailerActions(id));
      dispatch(getEnrichmentConfigurationsByRetailerIdAction(id));
    }
  }, [id, dispatch]);
  
  useEffect(() => {
    setTimeout(() => {
      dispatch(retailerFailureActions(null));
    }, 2000);
  }, [retailerfailure, dispatch]);
  
  useEffect(() => {
    if (retailersuccess) {
      setTimeout(() => {
        dispatch(retailerSuccessActions(null));
      }, 2000);
    }
  }, [retailersuccess, dispatch]);
  
  const editSource = (data) => {
    setModalData(data)
    setNewSourceFlag(true);
  };
  
  const change = (key) => (value) => {
    const subsdata = { ...retailerdata, [key]: value };
    dispatch(setRetailerDataActions(subsdata));
  };

  const addGroup = () => {
    let groupObj = {};
    if (editGroupValueFlag) {
      groupObj = {
        ...groupObj,
        id: selectedGroupOption.value,
        name: editGroupValue,
      };
    } else {
      groupObj = {
        ...groupObj,
        name: editGroupValue,
      };
    }
    const dis=dispatch(saveGroup(groupObj));
    dis.then((res)=>{
      if(res.status === 200){
        setEditGroupValueFlag(false);
        setGroupFlag(false)
        dispatch(getGroupsAction());
      }
    }).catch((e)=>{
      console.log('err',e)
    })
  };
  
  const saveRetailer = () => {
    if (id) {
      updateRetailer(retailerdata).then(successResponse("update")).catch(errorResponse);
    } else {
      createRetailer(retailerdata).then(successResponse("create")).catch(errorResponse);
    }
  };

  const saveRetailerEntity = () => {
    if (modalData.id) {
      updateEnrichmentConfiguration(modalData.id,modalData).then((res)=>{
        const succMsg = {
          msgType: "success",
          message: "Data Updated Successfully",
        };
        setMessage(succMsg);
        setNewSourceFlag(false);
        dispatch(getEnrichmentConfigurationsByRetailerIdAction(id));
        setTimeout(()=>{
          setMessage(null);
        },2000)
      }).catch(errorResponse);
    } else {
      createEnrichmentConfiguration(modalData)
        .then((res) => {
          const succMsg = {
            msgType: "success",
            message: "Data Created Successfully",
          };
          setMessage(succMsg);
          setNewSourceFlag(false);
          dispatch(getEnrichmentConfigurationsByRetailerIdAction(id));
          setTimeout(() => {
            setMessage(null);
          }, 2000);
        }).catch(errorResponse);
    }
  };
  
  const deleteRetailer = () => {
    deleteRetailerById(retailerdata.id).then(successResponse("delete")).catch(errorResponse);
  };
  
  const delEnrichmentConfiguration = () => {
    setConfirmBoxSource(false);
    deleteEnrichmentConfiguration(modalData.id)
      .then(successResponse("delete",()=>{
        dispatch(getEnrichmentConfigurationsByRetailerIdAction(id));
      }))
      .catch(errorResponse);
  };
  
  const successResponse =
    (type = "", callback=null) =>
      (res) => {
        if (res.status === 200) {
          if (type === "delete") {
            const succMsg = {
              msgType: "success",
              message: "Data Deleted Successfully",
            };
            if (callback) {
              dispatch(getEnrichmentConfigurationsByRetailerIdAction(id));
            }
            setMessage(succMsg);
            setTimeout(() => {
              setMessage(null);
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
              }, 2000);
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
    history.push("/connectors");
  };
  
  const onCreateNew = () => {
    history.push("/create-retailer");
  };
  
  const closeConfirmBox = () => setConfirmBox(false);
  
  const changeModalData=(key)=>(val)=>{
    const subdata={
      ...modalData,
      [key]:val
    }
    setModalData(subdata)
  }
  
  const createSource = () => {
    setModalData({});
    setNewSourceFlag(true);
  };
  
  return (
    <>
      {newSourceFlag && (
          <Modal
              style={{ overflow: "initial" }}
              sm
              onClose={() => setNewSourceFlag(false)}
          >
            <>
              <ModalForm
                  translate={translate}
                  onChange={changeModalData}
                  modalData={modalData}
                  onSave={saveRetailerEntity}
                  onEdit={editSource}
              />
            </>
          </Modal>
      )}
      {groupFlag && (
        <Modal
          style={{ overflow: "initial" }}
          sm
          onClose={() => setGroupFlag(false)}
        >
          <>
            <DivWrap>
              <LabelWrap>{translate("retailer.add_edit.group")}</LabelWrap>
              <Margin left={4} />
              <InputWrap
                type="text"
                value={editGroupValue}
                onChange={(e) => {
                  setEditGroupValue(e.target.value);
                }}
              />
            </DivWrap>
            <DivWrap style={{ float: "right" }}>
              <CustomButton
                disabled={!id}
                onClick={() => setConfirmBox(true)}
                backgroundColor={BLACKLIGHT}
                padding={`8px 10px`}
                title={translate("retailer.main.cancel")}
              />
              <Margin left={2} />
              <CustomButton
                loader={retailerloader}
                onClick={addGroup}
                backgroundColor={PRIMARY}
                padding={`8px 10px`}
                title={translate("retailer.main.save")}
              />
            </DivWrap>
          </>
        </Modal>
      )}
      
      <ConfirmBox
          label={`retailer`}
          show={confirmBox}
          onClose={closeConfirmBox}
          onDelete={deleteRetailer}
      />
      {/* source confirm box */}
      <ConfirmBox
          label={`source`}
          show={confirmBoxSource}
          onClose={()=>{setConfirmBoxSource(false)}}
          onDelete={delEnrichmentConfiguration}
      />
      <CustomToast messageObject={message} />
      <ContainerWrap>
        {/* Actions Bar*/}
        <CustomActionsBar
            title={
              id
                ? `${translate("retailer.main.edit")} ${translate(
                    "retailer.main.title"
                )}`
                : `${translate("retailer.main.new")}`
            }
            goBack={goBack}
            id={id || null}
            translate={translate}
            onCreateNew={onCreateNew}
            buttonLabel={`+ ${translate("retailer.main.create_new")}`}
            goBackLabel={`${translate("retailer.main.go_back")}`}
        />
        <Row>
          <Col col={6}>
            <ZoneWrap>
              <Row>
                <Col col={12}>
                  <DivWrap>
                    <LabelWrap>{translate("retailer.add_edit.name")}</LabelWrap>
                    <Margin left={4} />
                    <InputWrap
                      type="text"
                      value={retailerdata.name || ""}
                      onChange={(e) => change("name")(e.target.value)}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>{translate("retailer.add_edit.code")}</LabelWrap>
                    <Margin left={4} />
                    <InputWrap
                      type="text"
                      value={retailerdata.code || ""}
                      onChange={(e) => change("code")(e.target.value)}
                    />
                  </DivWrap>

                  <DivWrap column>
                    <DivWrap width={`100%`}>
                      <LabelWrap>
                        {translate("retailer.add_edit.group")}
                      </LabelWrap>
                      <Margin left={4} />
                      <DropDown
                        className={"select-styling-full"}
                        closeMenuOnSelect={false}
                        value={selectedGroupOption}
                        isSearchable={true}
                        options={groupOptions}
                        onChange={(e) => change("groupId")(getGroup(e).id)}
                        getOptionLabel={(o) => get(o, "label")}
                        getOptionValue={(o) => get(o, "value")}
                      />
                    </DivWrap>
                    <DivWrap width={`100%`} justifyContent={`flex-end`}>
                      <Icon
                        onClick={() => {
                          setGroupFlag(true);
                          setEditGroupValue(selectedGroupOption.label);
                          setEditGroupValueFlag(true);
                        }}
                        size={16}
                        icon={edit}
                        style={iconstyle}
                      />
                      <Icon
                        onClick={() => {
                          setGroupFlag(true);
                          setEditGroupValueFlag(false);
                        }}
                        size={16}
                        icon={plus}
                        style={iconstyle}
                      />
                    </DivWrap>
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate("retailer.add_edit.target_markets")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      isMulti
                      className={"select-styling-full"}
                      value={selectedTargetMarkets}
                      isSearchable={true}
                      options={targetmarkets}
                      onChange={(e) =>
                        e === null
                          ? change("targetMarketIds")([])
                          : change("targetMarketIds")(map(e, "id"))
                      }
                      getOptionLabel={(o) => get(o, "name")}
                      getOptionValue={(o) => get(o, "id")}
                    />
                  </DivWrap>

                  {/* Authorized manufacturers */}
                  <DivWrap>
                    <LabelWrap>
                      {translate("retailer.add_edit.authorized_manufacturers")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      isMulti
                      className={"select-styling-full"}
                      value={selectedAuthorizedManufacturer}
                      isSearchable={true}
                      options={manufacturers}
                      onChange={(e) =>
                        e === null
                          ? change("authorizedManufacturerIds")([])
                          : change("authorizedManufacturerIds")(map(e, "id"))
                      }
                      getOptionLabel={(o) => get(o, "name")}
                      getOptionValue={(o) => get(o, "id")}
                    />
                  </DivWrap>
                  
                  {/* Export actions */}
                  <DivWrap>
                    <LabelWrap>
                      {translate("retailer.add_edit.export_actions")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      isMulti
                      className={"select-styling-full"}
                      value={filter(
                        exportactiondata,
                        (r) =>
                          indexOf(
                            get(retailerdata, "uiExportActionIds", []),
                            r.id
                          ) !== -1
                      )}
                      isSearchable={true}
                      options={exportactiondata}
                      onChange={(exportActionsSelected) =>
                        change("uiExportActionIds")(
                          exportActionsSelected
                            ? map(exportActionsSelected, (ea) => ea.id)
                            : []
                        )
                      }
                      getOptionLabel={(o) => o.name}
                      getOptionValue={(o) => o.id}
                    />
                  </DivWrap>
                  
                  {/* External id */}
                  <DivWrap>
                    <LabelWrap>
                      {translate("retailer.add_edit.external_id")}
                    </LabelWrap>
                    <Margin left={4} />
                    <InputWrap
                      type="number"
                      value={retailerdata.externalId || ""}
                      onChange={(e) =>
                        change("externalId")(
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                    />
                  </DivWrap>
                  
                  {/* Resource base URL*/}
                  <DivWrap>
                    <LabelWrap>
                      {translate("retailer.add_edit.resource_base_url")}
                    </LabelWrap>
                    <Margin left={4} />
                    <InputWrap
                      type="text"
                      value={retailerdata.baseUrl || ""}
                      onChange={(e) => change("baseUrl")(e.target.value)}
                    />
                  </DivWrap>
                  
                  {/* can export videos */}
                  <DivWrap>
                    <LabelWrap>
                      {translate("retailer.add_edit.allow_videos")}
                    </LabelWrap>
                    <Margin left={4} />
                    <CheckboxWrap>
                      <InputWrap
                        hideWidth={true}
                        type="checkbox"
                        checked={get(retailerdata, "allowVideos")}
                        onChange={(e) =>
                          change("allowVideos")(e.target.checked)
                        }
                      />
                    </CheckboxWrap>
                  </DivWrap>
                  
                  <Margin top={4} />
                  <ButtonRow
                      onSave={saveRetailer}
                      onDelete={id ? () => setConfirmBox(true) : null}
                      title={
                        id
                            ? `${translate("retailer.main.update")}`
                            : `${translate("retailer.main.create")}`
                      }
                      title2={`${translate("retailer.main.delete")}`}
                  />
                </Col>
              </Row>
            </ZoneWrap>
          </Col>
          <Col col={6}>
            <ZoneWrap>
              <Row>
                <Col col={12}>
                  <H5>{translate("retailer.add_edit.inventorysource")}</H5>
                  <CustomButton
                    loader={false}
                    onClick={createSource}
                    backgroundColor={BLACKLIGHT}
                    padding={`4px 8px`}
                    title={`+ ${translate("retailer.add_edit.newsource")}`}
                  />
                  <Margin bottom={4} />
                  {enrichmentconfigurationsdata && (
                    <Datatable
                      thClassname={"thead-styling"}
                      loading={false}
                      columns={columns}
                      data={enrichmentconfigurationsdata}
                      total={10}
                      showPaginationBottom={false}
                      hideFilter={true}
                      noDataText={"no data"}
                    />
                  )}
                </Col>
              </Row>
            </ZoneWrap>
          </Col>
        </Row>
      </ContainerWrap>
    </>
  );
};

export default withLocalization(AddRetailer);
