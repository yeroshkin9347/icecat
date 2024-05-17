import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import map from "lodash/map";
import find from "lodash/find";
import get from "lodash/get";
import { withLocalization } from "common/redux/hoc/withLocalization";
import DropDown from "../../common/layout/DropDown";
import CustomButton from "../../common/layout/CustomButton";
import reduce from "lodash/reduce";
import filter from "lodash/filter";

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
  ToastWrap,
} from "./styles";
import { PRIMARY } from "cdm-shared/component/color";

// *******import all actions**** //
import {
  getOffersListAction,
  getManufacturersAction,
  getTargetMarketAction,
  getRetailersAction,
  getConnectorsActions,
  setConnectorsMassToolsActions,
  saveConnectorsMassToolsActions,
  connectorsInMassFailureActions,
  connectorsInMassSuccessActions,
} from "cdm-shared/redux/actions/subscription";

// *******import all selectors**** //
import {
  getOfferDataList,
  getTargetMarkets,
  getRetailer,
  getConnectorsMassTools,
  getConnectorsMassFailure,
  getConnectorsMassSuccess,
  getConnectorsMassLoader,
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

const AddMassConnectors = ({ translate, match = null }) => {
  const dispatch = useDispatch();

  //all selectors
  const retailer = useSelector(getRetailer);
  const connectorsinmassfailure = useSelector(getConnectorsMassFailure);
  const connectorsinmasssuccess = useSelector(getConnectorsMassSuccess);
  const connectorinmassloader = useSelector(getConnectorsMassLoader);
  const connectorsmasstools = useSelector(getConnectorsMassTools);
  const offerlist = useSelector(getOfferDataList);
  const targetmarkets = useSelector(getTargetMarkets);

  const id = match?.params.id;

  const currentType = get(connectorsmasstools, "type") || [];
  const selectedType = useMemo(
    () =>
      filter(
        CONNECTOR_TYPE,
        (tm) => !!find(currentType, (tmId) => tm === tmId)
      ),
    [currentType]
  );
  const currentScopes = get(connectorsmasstools, "scopes") || [];
  const selectedScopes = useMemo(
    () =>
      filter(
        CONNECTOR_SCOPE,
        (tm) => !!find(currentScopes, (tmId) => tm === tmId)
      ),
    [currentScopes]
  );

  const currentStatus = get(connectorsmasstools, "status") || [];
  const selectedStatus = useMemo(
    () =>
      filter(
        CONNECTOR_STATUS,
        (tm) => !!find(currentStatus, (tmId) => tm === tmId)
      ),
    [currentStatus]
  );

  const currentVisibility = get(connectorsmasstools, "visibility") || [];
  const selectedVisibility = useMemo(
    () =>
      filter(
        CONNECTOR_VISIBILITY,
        (tm) => !!find(currentVisibility, (tmId) => tm === tmId)
      ),
    [currentVisibility]
  );


  const offerIds = get(connectorsmasstools, "offerIds");
  const currentOffers = useMemo(
    () =>
      map(offerIds, (offerId) =>
        find(offerlist, (o) => get(o, "id") === offerId)
      ),
    [offerlist, offerIds]
  );

  useEffect(() => {
    dispatch(getManufacturersAction());
    dispatch(getRetailersAction());
    dispatch(getOffersListAction());
    dispatch(getTargetMarketAction());
  }, []);
  useEffect(() => {
    if (id) dispatch(getConnectorsActions(id));
  }, [id]);
  useEffect(() => {
    if (connectorsinmassfailure){
      setTimeout(() => {
        dispatch(connectorsInMassFailureActions(null));
      }, 2000);
    }
  }, [connectorsinmassfailure]);
  useEffect(() => {
    if (connectorsinmasssuccess) {
      setTimeout(() => {
        dispatch(connectorsInMassSuccessActions(null));
        window.location.reload();
      }, 2000);
    }
  }, [connectorsinmasssuccess]);

  const formattedValue = (data) => {
    return reduce(
      data.currentTarget.options,
      (results, value) => {
        if (!value.selected) return results;
        return [...results, value.value];
      },
      []
    );
  }

  const change = (key) => (value) => {
    const subsdata = { ...connectorsmasstools, [key]: value };
    dispatch(setConnectorsMassToolsActions(subsdata));
  };

  return (
    <>
      {connectorsinmassfailure && (
        <ToastWrap danger>{connectorsinmassfailure.message}</ToastWrap>
      )}
      {connectorsinmasssuccess && (
        <ToastWrap success>{connectorsinmasssuccess.message}</ToastWrap>
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
                        {translate("connectorsmasstool.add_edit.retailers")}
                      </LabelWrap>
                      <select
                        style={multiSelectStyles}
                        onChange={(e) =>
                          e === null
                            ? change("retailerIds")([])
                            : change("retailerIds")(formattedValue(e))
                        }
                        multiple
                      >
                        {map(retailer, (o, k) => (
                          <option key={`c-ret-${k}`} value={o.id}>
                            {get(o, "name")}
                          </option>
                        ))}
                      </select>
                    </DivWrap>
                    <Margin left={4} />
                    <DivWrap style={divwrapcustomstyling}>
                      <LabelWrap style={multiSelectBoxStyling}>
                        {translate(
                          "connectorsmasstool.add_edit.target_markets"
                        )}
                      </LabelWrap>
                      <select
                        style={multiSelectStyles}
                        onChange={(e) =>
                          e === null
                            ? change("targetMarketIds")([])
                            : change("targetMarketIds")(formattedValue(e))
                        }
                        multiple
                      >
                        {map(targetmarkets, (o, k) => (
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
                      {translate("connectorsmasstool.add_edit.offers")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      className={"select-styling-full"}
                      isMulti
                      closeMenuOnSelect={false}
                      value={currentOffers}
                      isSearchable={true}
                      options={offerlist}
                      onChange={(e) =>
                          e === null ? change("offer")([]) : change("offer")(e)
                      }
                      getOptionLabel={(o) => get(o, "name.values[0].value")}
                      getOptionValue={(o) => get(o, "id")}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate("connectorsmasstool.add_edit.type")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      className={"select-styling-full"}
                      value={selectedType}
                      isSearchable={true}
                      options={CONNECTOR_TYPE}
                      onChange={(e) =>
                        e === null ? change("type")("") : change("type")(e)
                      }
                      getOptionLabel={(o) => o}
                      getOptionValue={(o) => o}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate("connectorsmasstool.add_edit.scopes")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      isMulti
                      className={"select-styling-full"}
                      value={selectedScopes}
                      isSearchable={true}
                      options={CONNECTOR_SCOPE}
                      onChange={(e) =>
                        e === null ? change("scopes")([]) : change("scopes")(e)
                      }
                      getOptionLabel={(o) => o}
                      getOptionValue={(o) => o}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate("connectorsmasstool.add_edit.status")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      className={"select-styling-full"}
                      value={selectedStatus}
                      isSearchable={true}
                      options={CONNECTOR_STATUS}
                      onChange={(e) =>
                        e === null ? change("status")("") : change("status")(e)
                      }
                      getOptionLabel={(o) => o}
                      getOptionValue={(o) => o}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate("connectorsmasstool.add_edit.visibility")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DropDown
                      className={"select-styling-full"}
                      value={selectedVisibility}
                      isSearchable={true}
                      options={CONNECTOR_VISIBILITY}
                      onChange={(e) =>
                        e === null
                          ? change("visibility")("")
                          : change("visibility")(e)
                      }
                      getOptionLabel={(o) => o}
                      getOptionValue={(o) => o}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate("connectorsmasstool.add_edit.release_date")}
                    </LabelWrap>
                    <Margin left={4} />
                    <DatePickerWrap
                      onChange={(e) =>
                        e === null
                          ? change("releaseDate")("")
                          : change("releaseDate")(e.format("YYYY-MM-DD"))
                      }
                      value={get(connectorsmasstools, "releaseDate")}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate(
                        "connectorsmasstool.add_edit.discontinued_date"
                      )}
                    </LabelWrap>
                    <Margin left={4} />
                    <DatePickerWrap
                      onChange={(e) =>
                        e === null
                          ? change("discontinuedDate")("")
                          : change("discontinuedDate")(e.format("YYYY-MM-DD"))
                      }
                      value={get(connectorsmasstools, "discontinuedDate")}
                    />
                  </DivWrap>

                  <DivWrap>
                    <LabelWrap>
                      {translate(
                        "connectorsmasstool.add_edit.sent_by_manufacturer_himself"
                      )}
                    </LabelWrap>
                    <Margin left={4} />
                    <CheckboxWrap>
                      <InputWrap
                        hideWidth={true}
                        type="checkbox"
                        onChange={(e) =>
                          e === null
                            ? change("sentByManufacturer")(false)
                            : change("sentByManufacturer")(
                                !!e.currentTarget.checked
                              )
                        }
                      />
                    </CheckboxWrap>
                  </DivWrap>
                  <Margin top={4} />
                  <DivWrap style={{ float: "right" }}>
                    <CustomButton
                      loader={connectorinmassloader}
                      onClick={() =>
                        dispatch(
                          saveConnectorsMassToolsActions(connectorsmasstools)
                        )
                      }
                      backgroundColor={PRIMARY}
                      padding={`8px 10px`}
                      title={translate("connectorsmasstool.main.create")}
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
