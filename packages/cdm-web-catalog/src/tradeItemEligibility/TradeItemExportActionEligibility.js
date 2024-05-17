import React, { useState, useEffect } from "react";
import get from "lodash/get";
import map from "lodash/map";
import reduce from "lodash/reduce";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import uniq from "lodash/uniq";
import indexOf from "lodash/indexOf";
import { withLocalization } from "common/redux/hoc/withLocalization";
import {
  Row,
  Col,
  P,
  H4,
  Tag,
  LightZone,
  Zone,
  Loader,
  H5,
  Padding,
  Text
} from "cdm-ui-components";
import { getTradeItemEligibilityById } from "cdm-shared/services/tradeItemEligibilityNetwork";
import { PrimaryLink } from "cdm-shared/component/Link";
import TradeItemEligibilityStatus from "./TradeItemEligibilityStatus";
import { getBusinessRuleSetByIds } from "cdm-shared/services/businessRuleManagement";
import { getDetailedAssociationsByIds } from "cdm-shared/services/tradeItemProperties";
import { parseDate } from "cdm-shared/utils/date";

const Channels = React.memo(({ channels, name, translate }) => {
  const filteredChannels = filter(
    channels,
    channel => channel.dateStart || channel.dateEnd
  );
  if (!filteredChannels || !filteredChannels.length) return <div />;
  return (
    <>
      <br />
      <Tag small light inline>
        {translate(`tradeItemEligibility.detail.channels`)}
      </Tag>
      {map(filteredChannels, (channel, i) => (
        <Text small inline key={`channel-${name}-${i}`}>
          ({parseDate(channel.dateStart)}, {parseDate(channel.dateEnd)}) &nbsp;
        </Text>
      ))}
    </>
  );
});

function TradeItemExportActionEligibility({
  tradeItemEligibilityId,
  defaultValues,
  // locale
  lang,
  currentLocaleCode,
  // functions
  translate
}) {
  // state
  const [tradeItemEligibility, setTradeItemEligibility] = useState({
    ...(defaultValues || {}),
    id: tradeItemEligibilityId
  });
  const [mandatoryBusinessRuleSets, setMandatoryBusinessRuleSets] = useState(
    []
  );
  const [warningBusinessRuleSets, setWarningBusinessRuleSets] = useState([]);
  const [
    mandatoryRetailerPropertiesAssociations,
    setMandatoryRetailerPropertiesAssociations
  ] = useState([]);
  const [
    warningRetailerPropertiesAssociations,
    setWarningRetailerPropertiesAssociations
  ] = useState([]);
  const [loadingIdx, setLoadingIdx] = useState(false);
  const [
    channelsByRetailerPropertyAssociation,
    setChannelsByRetailerPropertyAssociation
  ] = useState({});

  const [warningPropertyResults, setWarningPropertyResults] = useState([]);
  const [mandatoryPropertyResults, setMandatoryPropertyResults] = useState([]);

  useEffect(() => {
    getTradeItemEligibilityById(tradeItemEligibilityId)
      .then(res => {
        setLoadingIdx(idx => idx + 1);
        const tmpTradeItemEligibility = res.data;

        setTradeItemEligibility(tmpTradeItemEligibility);

        // load business rules
        const mandatoryBusinessRuleSetIds = map(
          get(
            tmpTradeItemEligibility,
            "tradeItemEligibilityMandatoryBusinessRuleSetResults"
          ),
          o => o.id
        );
        const warningBusinessRuleSetIds = map(
          get(
            tmpTradeItemEligibility,
            "tradeItemEligibilityWarningBusinessRuleSetResults"
          ),
          o => o.id
        );
				setWarningPropertyResults(
					get(
						tmpTradeItemEligibility,
						"warningPropertyResults"
					)
				);
				setMandatoryPropertyResults(
					get(tmpTradeItemEligibility, "mandatoryPropertyResults")
				);
        const businessRuleSetIds = uniq([
          ...mandatoryBusinessRuleSetIds,
          ...warningBusinessRuleSetIds
        ]);
        if (!isEmpty(businessRuleSetIds)) {
          getBusinessRuleSetByIds(
            businessRuleSetIds,
            currentLocaleCode,
            "en-GB"
          )
            .then(brsRes => {
              setMandatoryBusinessRuleSets(
                filter(
                  brsRes.data,
                  d => indexOf(mandatoryBusinessRuleSetIds, d.id) !== -1
                )
              );
              setWarningBusinessRuleSets(
                filter(
                  brsRes.data,
                  d => indexOf(warningBusinessRuleSetIds, d.id) !== -1
                )
              );
              setLoadingIdx(idx => idx + 1);
            })
            .catch(e => setLoadingIdx(idx => idx + 1));
        } else setLoadingIdx(idx => idx + 1);

        // load retailer properties associations
        const retailerPropertiesAssociationsIds = map(
          get(
            tmpTradeItemEligibility,
            "tradeItemEligibilityPropertyAssociationResults"
          ),
          o => o.id
        );
        if (!isEmpty(retailerPropertiesAssociationsIds)) {
          getDetailedAssociationsByIds(retailerPropertiesAssociationsIds)
            .then(assoRes => {
              setMandatoryRetailerPropertiesAssociations(
                filter(
                  assoRes.data,
                  d =>
                    get(d, "conditionalMandatoryLevels.0.mandatoryLevel") ===
                    "Mandatory"
                )
              );
              setWarningRetailerPropertiesAssociations(
                filter(
                  assoRes.data,
                  d =>
                    get(d, "conditionalMandatoryLevels.0.mandatoryLevel") ===
                    "Warning"
                )
              );
              setLoadingIdx(idx => idx + 1);
            })
            .then(() => {
              setChannelsByRetailerPropertyAssociation(
                reduce(
                  get(
                    tmpTradeItemEligibility,
                    "tradeItemEligibilityPropertyAssociationResults"
                  ),
                  (result, value) => {
                    result[value.id] = value.channels;
                    return result;
                  },
                  {}
                )
              );
            })
            .catch(e => setLoadingIdx(idx => idx + 1));
        } else setLoadingIdx(idx => idx + 1);
      })
      .catch(e => setLoadingIdx(idx => idx + 1));
  }, [tradeItemEligibilityId, currentLocaleCode]);

  return (
    <Row>
      <Col col={4}>
        <LightZone>
          <H4 lead>{get(tradeItemEligibility, "tradeItem.title")}</H4>

          <Tag secondary medium>
            {get(tradeItemEligibility, "tradeItem.identity.gtin.value", null)} /{" "}
            {get(
              tradeItemEligibility,
              "tradeItem.identity.tradeItemManufacturerCode",
              null
            )}
          </Tag>

          <br />

          <TradeItemEligibilityStatus
            noTooltip
            medium
            tradeItemEligibility={tradeItemEligibility}
            translate={translate}
          />

          <br />
          <br />

          <P lead>{get(tradeItemEligibility, "exportAction.retailer.name")}</P>

          <P lead>{get(tradeItemEligibility, "exportAction.name")}</P>

          <br />

          <PrimaryLink
            target="__blank"
            to={`/product/${lang || currentLocaleCode}/${get(
              tradeItemEligibility,
              "tradeItem.id",
              null
            )}`}
          >
            {translate("tradeItemEligibility.detail.viewProduct")}
          </PrimaryLink>

          <br />
          <br />

          <PrimaryLink to={`/network-status`}>
            {translate("tradeItemEligibility.detail.backToList")}
          </PrimaryLink>
        </LightZone>
      </Col>

      <Col col>
        <Zone>
          <H4>{translate("tradeItemEligibility.detail.errors")}</H4>

          {/* Summary */}
          <Padding vertical={3}>
            <H5>
              {translate("tradeItemEligibility.common.rejectionStatuses")}
            </H5>

            <Padding left={3}>
              {map(get(tradeItemEligibility, "rejectionStatuses"), (o, k) => (
                <P key={`rejection-status-detail-${k}`}>
                  - {translate(`tradeItemEligibility.common.${o}`)}
                </P>
              ))}
            </Padding>
          </Padding>

          {/* Business rules */}
          <Padding vertical={3}>
            <H5>{translate("tradeItemEligibility.common.businessRuleSets")}</H5>

            <Row>
              {/* Mandatory */}
              {!isEmpty(mandatoryBusinessRuleSets) && (
                <Col col={6}>
                  <Tag danger>
                    {translate("tradeItemEligibility.common.mandatory")}
                  </Tag>
                  <Padding top={3}>
                    {map(mandatoryBusinessRuleSets, (o, k) => (
                      <P key={`retailer-brs-mandatory-asso-${k}`}>
                        {o.shortDescription}
                      </P>
                    ))}
                  </Padding>
                </Col>
              )}

              {/* Warning */}
              {!isEmpty(warningBusinessRuleSets) && (
                <Col col={6}>
                  <Tag warning>
                    {translate("tradeItemEligibility.common.warning")}
                  </Tag>
                  <Padding top={3}>
                    {map(warningBusinessRuleSets, (o, k) => (
                      <P key={`retailer-brs-warning-asso-${k}`}>
                        {o.shortDescription}
                      </P>
                    ))}
                  </Padding>
                </Col>
              )}
            </Row>
          </Padding>

          {/* Properties associations*/}
          <Padding vertical={3}>
            <H5>
              {translate(
                "tradeItemEligibility.common.retailerPropertiesAssociations"
              )}
            </H5>

            <Row>
              {/* Mandatory */}
              {!isEmpty(mandatoryRetailerPropertiesAssociations) && (
                <Col col={6}>
                  <Tag danger>
                    {translate("tradeItemEligibility.common.mandatory")}
                  </Tag>
                  <Padding top={3}>
                    {map(mandatoryRetailerPropertiesAssociations, (o, k) => (
                      <P key={`retailer-property-mandatory-asso-${k}`}>
                        {o.group} -{" "}
                        {translate(
                          `tradeItemProperties.properties.${o.productPropertyCode}`
                        )}
                        &nbsp;
                        <Channels
                          translate={translate}
                          channels={channelsByRetailerPropertyAssociation[o.id]}
                          name={`man-${o.id}`}
                        />
                      </P>
                    ))}
                  </Padding>
                </Col>
              )}

              {/* Warning */}
              {!isEmpty(warningRetailerPropertiesAssociations) && (
                <Col col={6}>
                  <Tag warning>
                    {translate("tradeItemEligibility.common.warning")}
                  </Tag>
                  <Padding top={3}>
                    {map(warningRetailerPropertiesAssociations, (o, k) => (
                      <P key={`retailer-property-warning-asso-${k}`}>
                        {o.group} -{" "}
                        {translate(
                          `tradeItemProperties.properties.${o.productPropertyCode}`
                        )}
                        &nbsp;
                        <Channels
                          translate={translate}
                          channels={channelsByRetailerPropertyAssociation[o.id]}
                          name={`man-${o.id}`}
                        />
                      </P>
                    ))}
                  </Padding>
                </Col>
              )}

							{!isEmpty(mandatoryPropertyResults) && (
								<Col col={6}>
									<Tag danger>
										{translate(
											"tradeItemEligibility.common.mandatory"
										)}
									</Tag>
									<Padding top={3}>
										{map(
											mandatoryPropertyResults,
											(o, k) => (
												<P
													key={`mandatory-Property-Results-${k}`}
												>
													{o.retailerPropertyCode}
												</P>
											)
										)}
									</Padding>
								</Col>
							)}

							{!isEmpty(warningPropertyResults) && (
								<Col col={6}>
									<Tag warning>
										{translate(
											"tradeItemEligibility.common.warning"
										)}
									</Tag>
									<Padding top={3}>
										{map(warningPropertyResults, (o, k) => (
											<P
												key={`warning-Property-Results-${k}`}
											>
												{o.retailerPropertyCode}
											</P>
										))}
									</Padding>
								</Col>
							)}

            </Row>
          </Padding>

          {loadingIdx < 3 && <Loader />}
        </Zone>
      </Col>
    </Row>
  );
}

export default withLocalization(TradeItemExportActionEligibility);
