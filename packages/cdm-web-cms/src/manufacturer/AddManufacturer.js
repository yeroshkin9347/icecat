import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import map from "lodash/map";
import find from "lodash/find";
import get from "lodash/get";
import filter from "lodash/filter";
import { withLocalization } from "common/redux/hoc/withLocalization";
import DropDown from "../common/layout/DropDown";
import CustomButton from "../common/layout/CustomButton";
import indexOf from "lodash/indexOf";
import EntitiesForm from "./EntitiesForm";
import {
  saveManufacturerById,
  createManufacturer,
  deleteManufacturerById,
  deleteManufacturerEntityById,
} from "cdm-shared/services/manufacturer";
import { ExternalLink } from "cdm-shared/component/Link";
import {
  getAllUsersByManufacturerId,
  getAllUsers,
} from "cdm-shared/services/manufacturer";
import { Margin, Row, Col, H5 } from "cdm-ui-components";
import {
  InputWrap,
  DivWrap,
  ZoneWrap,
  ContainerWrap,
  LabelWrap,
  CheckboxWrap,
} from "./styles";
import {
  PRIMARY,
  BLACKLIGHT,
} from "cdm-shared/component/color";
import { useHistory } from "react-router-dom";
import {
  saveManufacturerEntityById,
  createManufacturerEntity,
  createSubscription,
  updateSubscription,
} from "cdm-shared/services/subscription";
import Datatable from "common/component/smartdatatable/Datatable";
import ModalForm from "./ModalForm";
import ContactsLinks from "./ContactsLinks";
// *******import all actions**** //
import {
  getTargetMarketAction,
  getRetailersAction,
  getExportAcAction,
  getManufacturerByIdAction,
  setManufacturerAction,
  getTaxonomiesAction,
  getBusinessRulesSetsAction,
  getPdfExportActions,
  getManufacturerEntitiesActions,
  getImageCategoriesAction,
  getMatrixMappingsAction,
  getLanguagesAction,
  getOffersListAction,
  setManufacturerEntitiesActions,
  getSubscriptionByManufacturerIdAction,
  setSubscriptionsActions,
} from "cdm-shared/redux/actions/subscription";

// *******import all selectors**** //
import {
  getTargetMarkets,
  getRetailer,
  getExportActionData,
} from "cdm-shared/redux/selectors/subscription";

//custom components
import CustomActionsBar from "../common/layout/CustomActionsBar";
import ButtonRow from "../common/component/ButtonRow";
import ConfirmBox from "../common/component/ConfirmBox";
import CustomToast from "../common/component/CustomToast";

const AddManufacturer = ({ translate, match = null }) => {
  
  const [message, setMessage] = useState(null);
  const [confirmBox, setConfirmBox] = useState(false);
  const [confirmBoxEntity, setConfirmBoxEntity] = useState(false);
  
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [entitiesType, setEntitiesType] = useState('list');
  const [title, setTitle] = useState("Trigger Polling");
  const [modalFlag, setModalFlag] = useState(false);
  const [entity, setEntity] = useState({});
  const history = useHistory();
  
  //all selectors
  const retailers = useSelector(getRetailer);
  const matrixMappings = useSelector((state) => state.subscription.matrixdata);
  const exportactiondata = useSelector(getExportActionData);
  const manufacturerdata = useSelector(
    (state) => state.subscription.manufacturersingledata
  );
  const manufacturerentitiesdata = useSelector(
    (state) => state.subscription.manufacturerentitiesdata
  );
  const subscription = useSelector((state) => state.subscription.subscriptions);
  const pdfdata = useSelector((state) => state.subscription.pdfdata);
  const imageCategories = useSelector(
    (state) => state.subscription.imagecategories
  );
  const taxonomies = useSelector((state) => state.subscription.taxonomiesdata);
  const businessRulesSets = useSelector(
    (state) => state.subscription.businessRulesSets
  );
  const languages = useSelector((state) => state.subscription.languages);
  const offerlist = useSelector((state) => state.subscription.offerlist);
  const targetMarkets = useSelector(getTargetMarkets);
  
  const id = match?.params.id;
  
  const editManufacturerEntity = (data) => {
    setEntity(data);
    setEntitiesType("edit");
  };

  const deleteManufacturerEntity = (data) => {
    if (!confirmBoxEntity){
      setEntity(data);
      setConfirmBoxEntity(true);
      return;
    }
    deleteManufacturerEntityById(entity.id)
      .then((res) => {
        const succMsg = {
          msgType: "success",
          message: "Data Deleted Successfully",
        };
        setMessage(succMsg);
        setConfirmBoxEntity(false);
        dispatch(getManufacturerEntitiesActions(id));
        setTimeout(()=>{
          setMessage(null);
        },2000)
      })
      .catch(errorResponse);
  };
  
  const columns = useMemo(
    () => [
      {
        Header: translate("manufacturer.table.id"),
        accessor: "id",
        width: 50,
      },
      {
        Header: translate("manufacturer.table.name"),
        accessor: "name",
      },
      {
        Header: translate("manufacturer.table.url"),
        accessor: "importSettings.ftpConnectionSettings.url",
      },
      {
        Header: translate("manufacturer.table.path"),
        accessor: "importSettings.ftpConnectionSettings.path",
      },
      {
        Header: translate("manufacturer.table.actions"),
        id: "actions",
        accessor: (d) => (
            <div className="text-center">
              <ExternalLink onClick={() => editManufacturerEntity(d)}>
            <span style={{cursor:'pointer'}}>
            {translate("manufacturer.table.edit")}
            </span>
              </ExternalLink>
              <Margin right={1}/>
              <ExternalLink onClick={() => deleteManufacturerEntity(d)}>
            <span style={{color:'red',cursor:'pointer'}}>
            {translate("manufacturer.table.delete")}
            </span>
              </ExternalLink>
            </div>
        ),
      },
    ],
    [translate]
  );

  /*********************useffect******************/
  useEffect(() => {
    dispatch(getRetailersAction());
    dispatch(getExportAcAction());
    dispatch(getPdfExportActions());
    dispatch(getTargetMarketAction());
    dispatch(getTaxonomiesAction());
    dispatch(getBusinessRulesSetsAction());
    dispatch(getImageCategoriesAction());
    dispatch(getMatrixMappingsAction());
    dispatch(getLanguagesAction());
    dispatch(getOffersListAction());
  }, [dispatch]);
  useEffect(() => {
    if (id) {
      dispatch(getSubscriptionByManufacturerIdAction(id));
      dispatch(getManufacturerByIdAction(id));
      dispatch(getManufacturerEntitiesActions(id));
    } else {
      dispatch(setManufacturerAction({}));
      dispatch(setManufacturerEntitiesActions({}));
      dispatch(setSubscriptionsActions(null));
    }
  }, [id, dispatch]);
  useEffect(() => {
    const getUsersPromise = id
        ? getAllUsersByManufacturerId(id)
        : getAllUsers();
    getUsersPromise.then((res) => {
      setUsers(
          map(get(res, "data"), (u) => ({
            id: get(u, "id"),
            name: `${get(u, "firstname")} ${get(u, "lastname")}`,
            email: get(u, "email"),
          }))
      );
    });
  }, [id]);
  /***************************************/
  
  const changeEntities=(key)=>(val)=>{
    const subentities={
      ...entity,
      [key]:val
    }
    setEntity(subentities);
  }
  
  const change = (key) => (value) => {
    const subsdata = { ...manufacturerdata, [key]: value };
    dispatch(setManufacturerAction(subsdata));
  };
  
  const addContactList = (data) => {
    const contactlist = manufacturerdata.contactLinks || [];
    contactlist.push(data);
    const subsdata = {
      ...manufacturerdata,
      contactLinks: contactlist,
    };
    dispatch(setManufacturerAction(subsdata));
    setModalFlag(false);
  };
  const delContactList = (index) => {
    const contactlist = manufacturerdata.contactLinks || [];
    contactlist.splice(index, 1);
    const subsdata = {
      ...manufacturerdata,
      contactLinks: contactlist,
    };
    dispatch(setManufacturerAction(subsdata));
  };
  
  const modalValueSet = (title) => () => {
    setTitle(title);
    setModalFlag(true);
  };
  
  const updateSubscriptionData=(key)=>(val)=>{
    const subsdata={
      ...subscription,
      [key]:val
    }
    dispatch(setSubscriptionsActions(subsdata));
  }
  
  const setValue = (key) => {
    return subscription ? get(subscription, key) : 0
  }
  
  const saveSubscription = () => {
    if (subscription.id){
      updateSubscription(subscription)
          .then(successResponse("create"))
          .catch(errorResponse);
    } else {
      if(!subscription) return;
      const finalsubscription = {
        ...subscription,
        manufacturerId:manufacturerdata.id,
      };
      createSubscription(finalsubscription)
          .then(successResponse("create"))
          .catch(errorResponse);
    }
    
  }
  
  const goBack = (e) => {
    history.push("/connections");
  };
  
  const onCreateNew = () => {
    history.push("/create-manufacturer");
  };
  
  const saveEntity = () => {
    if (entity.id) {
      saveManufacturerEntityById(id, entity).then((res)=>{
        setEntitiesType('list');
        dispatch(getManufacturerEntitiesActions(id));
        const succMsg = {
          msgType: "success",
          message: "Data Updated Successfully",
        };
        setMessage(succMsg);
        dispatch(getManufacturerEntitiesActions(id));
      }).catch(errorResponse);
    } else {
      createManufacturerEntity(entity).then((res)=>{
        setEntitiesType("list");
        dispatch(getManufacturerEntitiesActions(id));
        const succMsg = {
          msgType: "success",
          message: "Data Created Successfully",
        };
        setMessage(succMsg);
        setTimeout(() => {
          setMessage(null);
        }, 2000);
      }).catch(errorResponse);
    }
  };
  
  const saveManufacturer = () => {
    if (id) {
      saveManufacturerById(id,manufacturerdata)
        .then(successResponse("update"))
        .catch(errorResponse);
    } else {
      createManufacturer(manufacturerdata)
        .then(successResponse("create"))
        .catch(errorResponse);
    }
  };
  
  const deleteManufacturer = () => {
    setConfirmBox(false);
    deleteManufacturerById(manufacturerdata.id)
      .then(successResponse("delete"))
      .catch(errorResponse);
  };
  
  const successResponse =(type = "") =>
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
              history.push("/connections")
            }, 2000);
          } else {
            if (id) {
              const succMsg = {
                msgType: "success",
                message: "Data Updated Successfully",
              };
              setMessage(succMsg);
              dispatch(getManufacturerByIdAction(id));
              dispatch(getManufacturerEntitiesActions(id));
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
                history.push(`/update-offers/${res.data}`);
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
  
  return (
    <>
      <ModalForm
        users={users}
        translate={translate}
        setShowFlag={setModalFlag}
        showFlag={modalFlag}
        title={title}
        addContactList={addContactList}
        manufacturerEntityId={id}
      />
      <ConfirmBox
        label={`manufacturer`}
        show={confirmBox}
        onClose={closeConfirmBox}
        onDelete={deleteManufacturer}
      />
      <ConfirmBox
        label={`manufacturer entity`}
        show={confirmBoxEntity}
        onClose={() => setConfirmBoxEntity(false)}
        onDelete={deleteManufacturerEntity}
      />
      <CustomToast messageObject={message} />

      <ContainerWrap>
        {/* Actions Bar*/}
        <CustomActionsBar
            title={
              id
                  ? `${translate("manufacturer.main.edit")}`
                  : `${translate("manufacturer.main.new")}`
            }
            goBack={goBack}
            id={id || null}
            translate={translate}
            onCreateNew={onCreateNew}
            buttonLabel={`+ ${translate("manufacturer.main.create_new")}`}
            goBackLabel={`${translate("manufacturer.main.go_back")}`}
        />
        <Row>
          <Col col={6}>
            <ZoneWrap>
              <Row>
                <Col col={12}>
                  <DivWrap>
                    <LabelWrap>
                      {translate("manufacturer.add_edit.onboarded")}
                    </LabelWrap>
                    <Margin left={4} />
                    <CheckboxWrap>
                      <InputWrap
                        hideWidth={true}
                        type="checkbox"
                        checked={get(manufacturerdata, "onBoarded")}
                        onChange={(e) => change("onBoarded")(e.target.checked)}
                      />
                    </CheckboxWrap>
                  </DivWrap>
                  
                  {id && (
                    <DivWrap>
                      <LabelWrap>
                        {translate("manufacturer.add_edit.manufacturer_id")}
                      </LabelWrap>
                      <Margin left={4} />
                      <InputWrap disabled={true} type="text" value={id || ""} />
                    </DivWrap>
                  )}
                  
                  <DivWrap>
                    <LabelWrap>
                      {translate("manufacturer.add_edit.name")}
                    </LabelWrap>
                    <Margin left={4} />
                    <InputWrap
                      type="text"
                      value={manufacturerdata?.name || ""}
                      onChange={(e) => change("name")(e.target.value)}
                    />
                  </DivWrap>
                  
                  <DivWrap>
                    <LabelWrap>
                      {translate("manufacturer.add_edit.default_export_action")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      className={"select-styling-full"}
                      value={find(
                        exportactiondata,
                        (o) =>
                          get(o, "id") ===
                          get(manufacturerdata, "defaultExportActionId")
                      )}
                      isSearchable={true}
                      options={exportactiondata}
                      onChange={(exportActionsSelected) =>
                        change("defaultExportActionId")(
                          exportActionsSelected ? exportActionsSelected.id : ""
                        )
                      }
                      getOptionLabel={(o) => o.name}
                      getOptionValue={(o) => o.id}
                    />
                  </DivWrap>
                  
                  <DivWrap>
                    <LabelWrap>
                      {translate("manufacturer.add_edit.export_actions")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      isMulti
                      className={"select-styling-full"}
                      value={filter(
                        exportactiondata,
                        (r) =>
                          indexOf(
                            get(manufacturerdata, "uiExportActionIds", []),
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
                  
                  <DivWrap>
                    <LabelWrap>
                      {translate("manufacturer.add_edit.pdf_export_actions")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      isMulti
                      className={"select-styling-full"}
                      value={filter(
                        pdfdata,
                        (r) =>
                          indexOf(
                            get(manufacturerdata, "downloadPdfActionIds", []),
                            r.id
                          ) !== -1
                      )}
                      isSearchable={true}
                      options={pdfdata}
                      onChange={(e) =>
                        e === null
                          ? change("downloadPdfActionIds")([])
                          : change("downloadPdfActionIds")(map(e, "id"))
                      }
                      getOptionLabel={(o) => get(o, "name")}
                      getOptionValue={(o) => get(o, "id")}
                    />
                  </DivWrap>
                  
                  <DivWrap>
                    <LabelWrap>
                      {translate("manufacturer.add_edit.external_id")}
                    </LabelWrap>
                    <Margin left={4} />
                    <InputWrap
                      type="text"
                      value={manufacturerdata?.externalId || ""}
                      onChange={(e) => change("externalId")(e.target.value)}
                    />
                  </DivWrap>
                  
                  <DivWrap>
                    <LabelWrap>
                      {translate("manufacturer.add_edit.allow_pdf_download")}
                    </LabelWrap>
                    <Margin left={4} />
                    <CheckboxWrap>
                      <InputWrap
                        hideWidth={true}
                        type="checkbox"
                        checked={
                          get(
                            manufacturerdata,
                            "canDownloadPdfTradeItemSheet"
                          ) || false
                        }
                        onChange={(e) =>
                          change("canDownloadPdfTradeItemSheet")(
                            e.target.checked
                          )
                        }
                      />
                    </CheckboxWrap>
                  </DivWrap>
                  
                  <DivWrap>
                    <LabelWrap>
                      {translate("manufacturer.add_edit.authorize_automatic")}
                    </LabelWrap>
                    <Margin left={4} />
                    <CheckboxWrap>
                      <InputWrap
                        hideWidth={true}
                        type="checkbox"
                        checked={
                          get(
                            manufacturerdata,
                            "authorizeAutomaticMineForConflict"
                          ) || false
                        }
                        onChange={(e) =>
                          change("authorizeAutomaticMineForConflict")(
                            e.target.checked
                          )
                        }
                      />
                    </CheckboxWrap>
                  </DivWrap>
                  
                  <DivWrap>
                    <LabelWrap>
                      {translate("manufacturer.add_edit.contacts_links")}
                    </LabelWrap>
                    <Margin left={4} />
                    <CheckboxWrap>
                      <CustomButton
                        loader={false}
                        onClick={modalValueSet("New Contacts")}
                        backgroundColor={PRIMARY}
                        padding={`4px 8px`}
                        title={translate(
                          "manufacturer.add_edit.add_new_contacts"
                        )}
                      />
                    </CheckboxWrap>
                  </DivWrap>
                  
                  <ContactsLinks
                    manufacturerId={id}
                    value={get(manufacturerdata, "contactLinks")}
                    users={users}
                    delContactList={delContactList}
                    // onUpdate={(contactLinks) =>
                    //   onChange({ ...(manufacturer || {}), contactLinks })
                    // }
                  />
                  <DivWrap>
                    <LabelWrap>
                      {translate("manufacturer.add_edit.company_prefixes")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      className={"select-styling-full"}
                      value={get(manufacturerdata, "gs1CompanyPrefixes")}
                      isSearchable={true}
                      options={[]}
                      onChange={(e) =>
                        e === null
                          ? change("gs1CompanyPrefixes")("")
                          : change("gs1CompanyPrefixes")(e)
                      }
                      getOptionLabel={(o) => get(o, "name")}
                      getOptionValue={(o) => get(o, "id")}
                    />
                  </DivWrap>
                  
                  <Margin top={4} />
                    <ButtonRow
                        onSave={saveManufacturer}
                        onDelete={id ? () => setConfirmBox(true) : null}
                        title={
                          id
                              ? `${translate("manufacturer.main.update")}`
                              : `${translate("manufacturer.main.create")}`
                        }
                        title2={`${translate("manufacturer.main.delete")}`}
                    />
                </Col>
              </Row>
            </ZoneWrap>
            
            <Margin bottom={6} />
            <ZoneWrap>
              <Row>
                <Col col={12}>
                  <DivWrap justifyContent={`flex-start`}>
                    <H5>{translate("manufacturer.add_edit.subscription")}</H5>
                  </DivWrap>
                  {manufacturerdata?.id && (
                      <DivWrap>
                        <LabelWrap>
                          {translate("manufacturer.subscription.manufacturer")}
                        </LabelWrap>
                        <Margin left={4} />
                        <InputWrap
                            disabled={true}
                            type="text"
                            value={manufacturerdata.name || ""}
                            onChange={(e) => change("externalId")(e.target.value)}
                        />
                      </DivWrap>
                  )}
                  
                  <DivWrap>
                    <LabelWrap>
                      {translate("manufacturer.subscription.offer")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                        className={"select-styling-full"}
                        value={
                          subscription
                            ? filter(
                              offerlist,
                              (ol) => ol.id === get(subscription, "offerId")
                            )
                            : null
                        }
                        onChange={(e) => updateSubscriptionData("offerId")(e.id)}
                        isSearchable={true}
                        options={offerlist}
                        getOptionLabel={(o) => get(o, "name.values[0].value")}
                        getOptionValue={(o) => get(o, "id")}
                    />
                  </DivWrap>
                  
                  <DivWrap>
                    <LabelWrap>
                      {translate(
                          "manufacturer.subscription.min_nb_of_trade_items"
                      )}
                    </LabelWrap>
                    <Margin left={4} />
                    <InputWrap
                        type="number"
                        value={get(subscription, "numberOfTradeItem.min", 0)}
                        onChange={(e) =>
                            updateSubscriptionData("numberOfTradeItem")({
                              ...subscription.numberOfTradeItem,
                              min: parseInt(e.target.value),
                            })
                        }
                    />
                  </DivWrap>
                  
                  <DivWrap>
                    <LabelWrap>
                      {translate(
                          "manufacturer.subscription.max_nb_of_trade_items"
                      )}
                    </LabelWrap>
                    <Margin left={4} />
                    <InputWrap
                      type="number"
                      value={get(subscription, "numberOfTradeItem.max", 0)}
                      onChange={(e) =>
                          updateSubscriptionData("numberOfTradeItem")({
                            ...subscription.numberOfTradeItem,
                            max: parseInt(e.target.value),
                          })
                      }
                    />
                  </DivWrap>
                  
                  <DivWrap>
                    <LabelWrap>
                      {translate("manufacturer.subscription.nb_of_connectors")}
                    </LabelWrap>
                    <Margin left={4} />
                    <InputWrap
                        type="number"
                        value={get(subscription, "numberOfConnector", 0)}
                        onChange={(e) =>
                          updateSubscriptionData("numberOfConnector")(
                            parseInt(e.target.value)
                          )
                        }
                    />
                  </DivWrap>
                  <Margin top={4} />
                  <DivWrap style={{ float: "right" }}>
                    <CustomButton
                        onClick={saveSubscription}
                        backgroundColor={PRIMARY}
                        padding={`8px 10px`}
                        title={translate("manufacturer.subscription.save")}
                    />
                  </DivWrap>
                </Col>
              </Row>
            </ZoneWrap>
          </Col>
          {id && (
            <Col col={6}>
              <ZoneWrap>
                <Row>
                  <Col col={12}>
                    <H5>{`${manufacturerdata?.name} Entities` || ""}</H5>
                    {entitiesType === "list" && (
                        <>
                          <CustomButton
                              loader={false}
                              onClick={() => {
                                editManufacturerEntity({});
                                setEntitiesType("add");
                              }}
                              backgroundColor={BLACKLIGHT}
                              padding={`4px 8px`}
                              title={translate(
                                  "manufacturer.add_edit.create_new_entity"
                              )}
                          />
                          <Margin bottom={4} />
                  
                          {manufacturerentitiesdata && (
                              <Datatable
                                  thClassname={"thead-styling"}
                                  loading={false}
                                  data={manufacturerentitiesdata}
                                  columns={columns}
                                  total={10}
                                  showPaginationBottom={false}
                                  hideFilter={true}
                                  noDataText={"no data"}
                              />
                          )}
                        </>
                    )}
                    {(entitiesType === "edit" || entitiesType === "add") && (
                      <>
                        <EntitiesForm
                            translate={translate}
                            setEntitiesType={setEntitiesType}
                            modalValueSet={modalValueSet}
                            manufacturerdata={entity}
                            entity={entity}
                            onChange={changeEntities}
                            {...{
                              matrixMappings,
                              languages,
                              targetMarkets,
                              taxonomies,
                              businessRulesSets,
                              retailers,
                              imageCategories,
                            }}
                            saveEntity={saveEntity}
                        />
                      </>
                    )}
                  </Col>
                </Row>
              </ZoneWrap>
            </Col>
          )}
        </Row>
      </ContainerWrap>
    </>
  );
};

export default withLocalization(AddManufacturer);
