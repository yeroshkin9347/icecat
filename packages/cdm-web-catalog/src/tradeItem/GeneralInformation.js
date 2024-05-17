import React from "react";
import { connect } from "react-redux"; // for trade item properties
import get from "lodash/get";
import map from "lodash/map";
import reduce from "lodash/reduce";
import isNumber from "lodash/isNumber";
import isEmpty from "lodash/isEmpty";
import isArray from "lodash/isArray";
import has from "lodash/has";
import isString from "lodash/isString";
import isPlainObject from "lodash/isPlainObject";
import { isPropertyNested } from "cdm-shared/component/tradeItemCrud/manager";
import {
	Zone,
	H3,
	List,
	ListItem,
	Text,
	Row,
	Col,
	Label,
	LightZone,
} from "cdm-ui-components";
import { createSelector } from "reselect";
import { getByTradeItemCategoryAndGroup, getByTradeItemCategoryAndGroupForRetailer } from "cdm-shared/services/tradeItemProperties";
import { getResults } from "cdm-shared/redux/helpers/createList";
import {
	checkEmptyTradeItemProperty,
	renderTradeItemProperty,
	isNullOrWhitespaceString,
} from "./tradeItemProperty";
import withUser from "cdm-shared/redux/hoc/withUser";
import draft from "../assets/draft.png";
import TradeProperty from "cdm-shared/component/tradeItemCrud/properties/TradeProperty";
import { getAllPropertyFamilyByIds } from "cdm-shared/component/tradeItemCrud/api";
import orderBy from "lodash/orderBy";
import find from "lodash/find";
import { isRetailer } from "cdm-shared/redux/hoc/withAuth";
import { ZoneStyled } from "styled-components/zone/ZoneStyled";

class GeneralInformation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			groupSelectedIndex: 0,
			marketingValues: [],
		};
	}

	async componentDidUpdate(prevProps) {
		const {
			currentScope,
			tradeItem,
			tradeItemProperties,
			currentLocaleCode,
		} = this.props;
		const { getTradeItemPropertiesForTradeItemCategory } = this.props;
		if (
			get(prevProps, "tradeItem") !== get(this.props, "tradeItem") ||
			get(prevProps, "currentLocaleCode") !==
				get(this.props, "currentLocaleCode") ||
			get(prevProps, "tradeItemProperties") !==
				get(this.props, "tradeItemProperties")
		) {
			if (
				get(tradeItem, "tradeItemCategory.code") &&
				currentScope !== get(tradeItem, "tradeItemCategory.code")
			)
				getTradeItemPropertiesForTradeItemCategory(
					get(tradeItem, "taxonomyId"),
					get(tradeItem, "tradeItemCategory.code")
				);

			const values = reduce(
				tradeItemProperties,
				(result, property) => {
					const val = get(
						get(tradeItem, "marketing.values", null),
						property.code,
						null
					);
					if (
						val != null &&
						(isNumber(val) ||
							(isString(val) ? !isNullOrWhitespaceString(val) : !isEmpty(val)))
					) {
						// We should add property to the list.
						const groupName = get(
							property,
							"propertyFamilyId",
							"00000000-0000-0000-0000-000000000000"
						);
						(result[groupName] || (result[groupName] = [])).push(
							Object.assign({}, property, {
								value: get(
									get(tradeItem, "marketing.values", null),
									property.code,
									null
								),
							})
						);
					}
					return result;
				},
				{}
			);
			const propertyFamilyIds = Object.keys(values);
			let { data: propertyFamilies } = await getAllPropertyFamilyByIds(
				propertyFamilyIds
			);
			propertyFamilies = orderBy(
				propertyFamilies,
				(p) => p.displayIndex,
				"desc"
			);
			let items = [];

			if (
				values["00000000-0000-0000-0000-000000000000"] &&
				values["00000000-0000-0000-0000-000000000000"].length > 0
			) {
				items.push({
					name: "General Information",
					values: values["00000000-0000-0000-0000-000000000000"],
				});
			}

			const groups = propertyFamilies.map((propertyFamily) => ({
				name: get(
					get(propertyFamily, "name.values", []).find(
						(value) => value.languageCode === currentLocaleCode
					),
					"value",
					""
				),
				values: values[propertyFamily.id],
			}));

			items = [...items, ...groups];
			this.setState({ marketingValues: items });
		}
	}

	isDraft(tradeItem) {
		if (
			tradeItem.marketing.values &&
			tradeItem.marketing.values.product_status &&
			tradeItem.marketing.values.product_status.key
		)
			return tradeItem.marketing.values.product_status.key === "draft";
	}

	render() {
		const { groupSelectedIndex, marketingValues } = this.state;


		const { tradeItem, user,currentLocaleCode } = this.props;

		const { translate } = this.props;

		if (!tradeItem) return <React.Fragment />;

		const selectedFamily = marketingValues[groupSelectedIndex]

		//checkEmptyTradeItemProperty(marketingValues)

		return (
			<ZoneStyled
				style={{
					minWidth: "50%",
					minHeight: "300px",
					maxWidth: "1500px",
					margin: "0 auto",
				}}
				responsive
				borderRadius
			>
				<H3>{translate("tradeitem.marketing.title")}</H3>

				{/* <Padding responsive> */}

				<Row>
					{/* Properties group select */}
					<Col col={4}>
						<List stacked>
							{map(marketingValues, ({ name }, index) => (
								<ListItem
									key={`trade-item-properties-${name}-${index}`}
									selected={groupSelectedIndex === index}
									onClick={() =>
										this.setState({ groupSelectedIndex: index })
									}
								>
									<Text bold={groupSelectedIndex === index}>
										{name}
									</Text>
								</ListItem>
							))}
						</List>
					</Col>

					<Col col={8}>
						<LightZone responsive borderRadius>
							<Row>
								{this.isDraft(tradeItem) && (
									<img
										height="200"
										width="200"
										style={{
											top: "-100px",
											left: "-100px",
											position: "absolute",
										}}
										src={draft}
										alt="draft"
									/>
								)}

								{map(
									get(selectedFamily, "values", []),
									(property, propertyIndex) => {
										if (
											isNullOrWhitespaceString(
												property.value
											)
										)
											return null;
										//Check value is "emptyArray"
										if (
											!isNumber(property.value) &&
											isEmpty(property.value)
										)
											return null;
										//Filter array of elements by removing items with empty "value"
										if (isArray(property.value))
											checkEmptyTradeItemProperty(
												property
											);
										//Check if value field of value object si empty
										if (
											isPlainObject(property.value) &&
											has(property, "value.value") &&
											isEmpty(
												get(
													property,
													"value.value"
												).trim()
											)
										)
											return null;
										if(isPropertyNested(property))
										  return null
										//Return if all check was passed
										else
											return (
												<>
													{!(
														property.discriminator ===
															"CalculatedProductPropertyViewModel" &&
														property.value === "n/a"
													) && (
														<Col
															col={12}
															key={`marketing-value-${propertyIndex}`}
														>
															<Label block>
																<TradeProperty
																	property={
																		property
																	}
																	showTooltip
																/>
															</Label>
															<Text
																style={{
																	paddingLeft: 6,
																	whiteSpace:
																		"pre-wrap",
																}}
															>
																{renderTradeItemProperty(
																	property,
																	user,
																	currentLocaleCode
																)}
															</Text>
															<br />
															<br />
														</Col>
													)}
												</>
											);
									}
								)}
							</Row>
						</LightZone>
					</Col>
				</Row>
				{/* </Padding> */}
			</ZoneStyled>
		);
	}
}

// using redux store only to not overload to trade item properties management service
//

const getCurrentLocaleCode = createSelector(
	(state) => state.localize,
	(localize) => {
		return find(localize.languages, (x) => x.active === true).code;
	}
);

const mapStateToProps = (state) => {
	return {
		currentScope: state.tradeItemProperties.currentScope,
		tradeItemPropertiesGrouped:
			state.tradeItemProperties.tradeItemPropertiesGrouped,
		tradeItemProperties: getResults(
			state.tradeItemProperties.tradeItemProperties
		),
		currentLocaleCode: getCurrentLocaleCode(state),
	};
};

const mapDispatchToProps = (dispatch, { user }) => {
	return {
		getTradeItemPropertiesForTradeItemCategory: (
			taxonomyId,
			tradeItemCategoryCode
		) => {
			const getByTradeItemCategoryAndGroupApi = isRetailer(user)
				? getByTradeItemCategoryAndGroupForRetailer
				: getByTradeItemCategoryAndGroup;

			getByTradeItemCategoryAndGroupApi(
				taxonomyId,
				tradeItemCategoryCode,
				"MARKETING"
			).then((res) => {
				dispatch({
					type: "MOD_TRADE_ITEM_PROPERTIES_SET_TRADE_ITEM_CATEGORY_CODE",
					tradeItemCategoryCode,
				});
				dispatch({
					type: "MOD_TRADE_ITEM_PROPERTIES_LIST_SUCCESS",
					results: get(res, "data", []),
				});
			});
		},
	};
};

export default withUser(
	connect(mapStateToProps, mapDispatchToProps)(GeneralInformation)
);
