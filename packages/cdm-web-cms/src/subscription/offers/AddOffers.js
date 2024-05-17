import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import update from "immutability-helper";
import map from "lodash/map";
import get from "lodash/get";
import {withLocalization} from "common/redux/hoc/withLocalization";
import {SharedLocalizableStrings} from "cdm-shared/component/lang/LocalizableStrings";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import move from "lodash-move/lib/index";
import {
  Margin,
  Button,
  Row,
  Col,
  Label,
  H5,
  Icon,
} from "cdm-ui-components";
import {
  InputWrap,
  DivWrap,
  ZoneWrap,
  ContainerWrap,
  IconWrap,
} from "./styles";
import useLanguages from "cdm-shared/hook/useLanguages";
import {
  setOffersAction,
  getOfferAction,
} from "cdm-shared/redux/actions/subscription";
import {getOfferData} from "cdm-shared/redux/selectors/subscription";
import {useHistory} from "react-router-dom";
import {trashO} from "react-icons-kit/fa/trashO";
import {
  createOffer,
  updateOffer,
  deleteOffer as delOffer,
} from "cdm-shared/services/subscription";

//custom components
import CustomActionsBar from "../../common/layout/CustomActionsBar";
import ButtonRow from "../../common/component/ButtonRow";
import ConfirmBox from "../../common/component/ConfirmBox";
import CustomToast from "../../common/component/CustomToast";

const AddOffers = ({translate, match = null}) => {
  const id = match?.params.id;

  const [message, setMessage] = useState(null);
  const [confirmBox, setConfirmBox] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();
  const offer = useSelector(getOfferData);
  const languages = useLanguages();
  const services = get(offer, "services");


  useEffect(() => {
    if (id) {
      dispatch(getOfferAction(id));
    } else {
      dispatch(setOffersAction({}));
    }
  }, [id]);

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? "#3e8ef7" : "",
    width: "100%",
  });

  const reorderServices = (fromIndex, toIndex) => {
    dispatch(setOffersAction({
      ...offer,
      services: move(services, fromIndex, toIndex),
    }));
  };

  const deleteOfferService = (index) => {
    const serv = offer.services;
    serv.splice(index, 1);
    const finaloffer = {
      ...offer,
      services: serv,
    };
    dispatch(setOffersAction(finaloffer));
  };

  const saveOffers = () => {
    if (id) {
      updateOffer(offer).then(successResponse("update")).catch(errorResponse);
    } else {
      createOffer(offer).then(successResponse("create")).catch(errorResponse);
    }
  };

  const deleteOffer = () => {
    setConfirmBox(false);
    delOffer(offer.id).then(successResponse('delete')).catch(errorResponse);
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
              history.push(`/offers`);
            }, 3000);
          } else {
            if (id) {
              const succMsg = {
                msgType: "success",
                message: "Data Updated Successfully",
              };
              setMessage(succMsg);
              dispatch(getOfferAction(id));
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
    const errMsg = {msgType: 'error', message: get(err, "response.data.ErrorMessage")}
    setMessage(errMsg);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  }

  const goBack = (e) => {
    history.push("/offers");
  };

  const onCreateNew = () => {
    if (Object.keys(offer).length > 0) {
      history.push("/create-offers");
    }
  };

  const closeConfirmBox = () => setConfirmBox(false);

  return (
    <>
      <ConfirmBox
        label={`offer`}
        show={confirmBox}
        onClose={closeConfirmBox}
        onDelete={deleteOffer}
      />
      <CustomToast messageObject={message}/>
      <ContainerWrap>
        {/* Actions */}
        <CustomActionsBar
          title={
            id
              ? `${translate("offers.main.edit")}`
              : `${translate("offers.main.new")}`
          }
          goBack={goBack}
          id={id || null}
          translate={translate}
          onCreateNew={onCreateNew}
          buttonLabel={`+ ${translate("offers.main.create_new")}`}
          goBackLabel={`${translate("offers.main.go_back")}`}
        />

        <Row>
          <Col col={6}>
            <ZoneWrap>
              <Row>
                <Col col={12}>
                  {id && (
                    <DivWrap>
                      <Label style={{marginBottom: 0}}>ID</Label>
                      <Margin left={4}/>
                      <InputWrap disabled={true} type="text" value={id}/>
                    </DivWrap>
                  )}
                  <Margin bottom={4}/>
                  <DivWrap>
                    <Label style={{marginBottom: 0}}>ORDER</Label>
                    <Margin left={4}/>
                    <InputWrap
                      type="number"
                      onChange={(e) => {
                        dispatch(
                          setOffersAction({
                            ...offer,
                            order: e.currentTarget.value,
                          })
                        );
                      }}
                      value={get(offer, "order", "")}
                    />
                  </DivWrap>

                  <Margin top={4}/>

                  {Object.keys(offer).length > 0 && (
                    <SharedLocalizableStrings
                      integrated
                      languages={languages}
                      localizableStrings={["name", "description"]}
                      labels={{
                        name: "Name",
                        description: "Description",
                      }}
                      components={{
                        description: "textarea",
                      }}
                      input={offer}
                      onChange={(property, value) => {
                        dispatch(
                          setOffersAction(
                            update(offer, {[property]: {$set: value}})
                          )
                        );
                      }}
                    />
                  )}
                  {Object.keys(offer).length === 0 && (
                    <SharedLocalizableStrings
                      integrated
                      languages={languages}
                      localizableStrings={["name", "description"]}
                      labels={{
                        name: "Name",
                        description: "Description",
                      }}
                      components={{
                        description: "textarea",
                      }}
                      input={null}
                      onChange={(property, value) => {
                        dispatch(
                          setOffersAction(
                            update(offer, {[property]: {$set: value}})
                          )
                        );
                      }}
                    />
                  )}
                  <Margin bottom={4}/>
                  <ButtonRow
                    onSave={saveOffers}
                    onDelete={id ? () => setConfirmBox(true) : null}
                    title={
                      id
                        ? `${translate("offers.main.update")}`
                        : `${translate("offers.main.create")}`
                    }
                    title2={`${translate("offers.main.delete")}`}
                  />
                </Col>
              </Row>
            </ZoneWrap>
          </Col>
          <Col col={6}>
            <ZoneWrap>
              <Row>
                <Col col={12}>
                  <H5>Services</H5>
                  <Button
                    style={{marginTop: "0.4em"}}
                    onClick={(e) =>
                      dispatch(
                        setOffersAction({
                          ...offer,
                          services: [...(get(offer, "services") || []), {}],
                        })
                      )
                    }
                    small
                    primary
                    noMargin
                  >
                    {translate(`offers.createoffer.createnew`)}
                  </Button>
                  <Margin bottom={4}/>

                  {/* Services */}
                  <DragDropContext
                    onDragEnd={(e) => {
                      if (
                        e.destination &&
                        e.destination.index !== e.source.index
                      )
                        reorderServices(e.source.index, e.destination.index);
                    }}
                  >
                    <Droppable droppableId="droppable">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}
                        >
                          {map(services, (service, serviceIndex) => (
                            <Draggable
                              key={`draggable-service-${serviceIndex}`}
                              draggableId={`draggable-service-${serviceIndex}`}
                              index={serviceIndex}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <div
                                    key={`service-${serviceIndex}`}
                                    style={{
                                      marginBottom: "2rem",
                                      padding: "1rem",
                                      borderBottom: "1px solid #c8e0ff",
                                      borderTop: "1px solid #c8e0ff",
                                      backgroundColor: "#f7fbff",
                                    }}
                                  >
                                    <IconWrap>
                                      <div
                                        style={{cursor: "pointer"}}
                                        onClick={() => {
                                          deleteOfferService(serviceIndex);
                                        }}
                                      >
                                        <Icon size={20} icon={trashO}/>
                                      </div>
                                    </IconWrap>
                                    <SharedLocalizableStrings
                                      integrated
                                      languages={languages}
                                      localizableStrings={["service"]}
                                      labels={{
                                        service: "Service short title",
                                      }}
                                      input={{service}}
                                      onChange={(property, value) => {
                                        dispatch(
                                          setOffersAction({
                                            ...offer,
                                            services: [
                                              ...(services || []).slice(
                                                0,
                                                serviceIndex
                                              ),
                                              value,
                                              ...(services || []).slice(
                                                serviceIndex + 1
                                              ),
                                            ],
                                          })
                                        );
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </Col>
              </Row>
            </ZoneWrap>
          </Col>
        </Row>
      </ContainerWrap>
    </>
  );
};

export default withLocalization(AddOffers);
