import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import find from "lodash/find";
import get from "lodash/get";
import { withLocalization } from "common/redux/hoc/withLocalization";
import  DropDown from "../../common/layout/DropDown";
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
} from "./styles";
import {
  getOffersListAction,
  getManufacturersAction,
  setSubscriptionsActions,
  getSubscriptionsActions,
} from "cdm-shared/redux/actions/subscription";
import {
  getOfferDataList,
  manufacturerData,
  getSubscriptionsData,
} from "cdm-shared/redux/selectors/subscription";
import { useHistory } from "react-router-dom";

//import services
import {
  createSubscription,
  updateSubscription,
  deleteSubscription as delSubscription,
} from "cdm-shared/services/subscription";

//custom components
import CustomActionsBar from "../../common/layout/CustomActionsBar";
import ButtonRow from "../../common/component/ButtonRow";
import ConfirmBox from "../../common/component/ConfirmBox";
import CustomToast from "../../common/component/CustomToast";

const AddSubscriptions = ({ translate, match =null }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [message, setMessage] = useState(null);
  const [confirmBox, setConfirmBox] = useState(false);
  const offerlist = useSelector(getOfferDataList);
  const subscriptions = useSelector(getSubscriptionsData);
  const manufacturerdata = useSelector(manufacturerData);
  const id = match?.params.id;
  const currentManufacturer = useMemo(
    () => find(manufacturerdata, (o) => subscriptions.manufacturerId === o.id),
    [manufacturerdata, subscriptions]
  );
  const currentOffer = useMemo(
    () => find(offerlist, (o) => subscriptions.offerId === o.id),
    [offerlist, subscriptions]
  );
  const currentMinConn = useMemo(
    () =>
      (subscriptions.numberOfTradeItem &&
        subscriptions.numberOfTradeItem.min) ||
      0,
    [subscriptions]
  );
  const currentMaxConn = useMemo(
    () =>
      (subscriptions.numberOfTradeItem &&
        subscriptions.numberOfTradeItem.max) ||
      0,
    [subscriptions]
  );
  const currentConn = useMemo(
    () => subscriptions.numberOfConnector || 0,
    [subscriptions]
  );

  useEffect(() => {
    dispatch(getManufacturersAction());
    dispatch(getOffersListAction());
  }, []);
  useEffect(() => {
    if (id) {
      dispatch(getSubscriptionsActions(id));
    } else {
      dispatch(setSubscriptionsActions({}));
    }
  }, [id]);

  const setData =(type)=> (data) => {
    let subsdata={};
    switch (type) {
      case "manufacturer":
        subsdata = {
          ...subscriptions,
          manufacturerId: data?.id,
          manufacturerName: data?.name,
        };
        break;
      case "offer":
        subsdata = {
          ...subscriptions,
          offerId: data?.id,
          offerName: data?.name,
        };
        break;
      case "min_no_of_trade_item":
        subsdata = {
          ...subscriptions,
          numberOfTradeItem: {
            max: subscriptions?.numberOfTradeItem?.max || 0,
            min: parseInt(data.target.value),
          },
        };
        break;
      case "max_no_of_trade_item":
        subsdata = {
          ...subscriptions,
          numberOfTradeItem: {
            min: subscriptions?.numberOfTradeItem?.min || 0,
            max: parseInt(data.target.value),
          },
        };
        break;
      case "no_of_connectors":
        subsdata = {
          ...subscriptions,
          numberOfConnector: parseInt(data.target.value),
        };
        break;
      default:
        return subsdata;
    }
    dispatch(setSubscriptionsActions(subsdata));
  };
  
  const goBack = (e) => {
    history.push("/subscriptions");
  };
  
  const onCreateNew = () => {
    if (Object.keys(subscriptions).length > 0) {
      history.push("/create-subscriptions");
    }
  };
  
  const saveSubscription = () => {
    if (id) {
      updateSubscription(subscriptions)
        .then(successResponse("update"))
        .catch(errorResponse);
    } else {
      createSubscription(subscriptions)
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
                  history.push(`/subscriptions`);
                }, 3000);
              } else {
                if (id) {
                  const succMsg = {
                    msgType: "success",
                    message: "Data Updated Successfully",
                  };
                  setMessage(succMsg);
                  dispatch(getSubscriptionsActions(id));
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
                    history.push(`/update-subscriptions/${res.data}`);
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
  
  const deleteSubscription = () => {
    setConfirmBox(false);
    delSubscription(subscriptions.id).then(successResponse("delete")).catch(errorResponse);
  };
  
  return (
    <>
      <ConfirmBox
          label={`subscription`}
          show={confirmBox}
          onClose={closeConfirmBox}
          onDelete={deleteSubscription}
      />
      <CustomToast messageObject={message} />
      
      <ContainerWrap>
        {/* Actions Bar*/}
        <CustomActionsBar
            title={
              id
                ? `${translate("subscriptions.main.edit")}`
                : `${translate("subscriptions.main.new")}`
            }
            goBack={goBack}
            id={id || null}
            translate={translate}
            onCreateNew={onCreateNew}
            buttonLabel={`+ ${translate("subscriptions.main.create_new")}`}
            goBackLabel={`${translate("subscriptions.main.go_back")}`}
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
                        {translate("subscriptions.add_edit.id")}
                      </LabelWrap>
                      <Margin left={4} />
                      <InputWrap
                        disabled={true}
                        type="text"
                        value={subscriptions.id}
                      />
                    </DivWrap>
                  )}

                  <DivWrap>
                    <LabelWrap>
                      {translate("subscriptions.add_edit.manufacturer")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      className={"select-styling-full"}
                      value={currentManufacturer || []}
                      isSearchable={true}
                      options={manufacturerdata}
                      onChange={setData("manufacturer")}
                      getOptionLabel={(o) => get(o, "name")}
                      getOptionValue={(o) => get(o, "id")}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate("subscriptions.add_edit.offer")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      className={"select-styling-full"}
                      value={currentOffer || []}
                      isSearchable={true}
                      options={offerlist}
                      onChange={setData("offer")}
                      getOptionLabel={(o) => get(o, "name.values[0].value")}
                      getOptionValue={(o) => get(o, "id")}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate(
                        "subscriptions.add_edit.min_nb_of_trade_items"
                      )}
                    </LabelWrap>
                    <Margin left={4} />
                    <InputWrap
                      type="number"
                      onChange={setData("min_no_of_trade_item")}
                      value={currentMinConn}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate(
                        "subscriptions.add_edit.max_nb_of_trade_items"
                      )}
                    </LabelWrap>
                    <Margin left={4} />
                    <InputWrap
                      type="number"
                      onChange={setData("max_no_of_trade_item")}
                      value={currentMaxConn}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate("subscriptions.add_edit.nb_of_connectors")}
                    </LabelWrap>
                    <Margin left={4} />
                    <InputWrap
                      type="number"
                      onChange={setData("no_of_connectors")}
                      value={currentConn}
                    />
                  </DivWrap>
                  <Margin top={4} />
                  <ButtonRow
                    onSave={saveSubscription}
                    onDelete={id ? () => setConfirmBox(true) : null}
                    title={
                      id
                        ? `${translate("subscriptions.main.update")}`
                        : `${translate("subscriptions.main.create")}`
                    }
                    title2={`${translate("subscriptions.main.delete")}`}
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

export default withLocalization(AddSubscriptions);
