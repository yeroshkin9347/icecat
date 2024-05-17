import React from "react";
import { Col, Icon, Label, Text, Tooltip, Row } from "cdm-ui-components";
import { question } from "react-icons-kit/metrize/question";
import { getLocalizedValue } from "../../../utils/localized";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { ic_error } from "react-icons-kit/md/ic_error";
import { withTradeItemPropertiesLocalContext } from "../store/TradeItemPropertiesProvider";
import get from "lodash/get";
import isObject from "lodash/isObject";

const TradeProperty = ({
	property,
	currentLocaleCode,
	showTooltip = false,
	isEditable,
	valuechanged,
	translate,
}) => {
	const name = isObject(property.name)
		? get(
				get(property, "name.values", []).find(
					(value) => value.languageCode === currentLocaleCode
				),
				"value",
				""
			)
		: property.name

	return (
		<>
			<span
				style={{
					marginLeft: "5px",
					marginRight: "10px",
					color:
						Object.keys(valuechanged).find((key) => key === property.code) && isEditable
							? "orange"
							: "black",
				}}>
				{name ?? property.code}
			</span>
			{get(property, "nullable") === false && <span>*&nbsp;</span>}
			{showTooltip &&
				getLocalizedValue(property, "boolean", currentLocaleCode) && (
					<Tooltip
						placement="bottom"
						interactive
						html={
							<Row
								style={{
									padding: 20,
									textAlign: "left",
								}}
							>
								{Object.keys(valuechanged).find(
									(key) => key === property.code
								) &&
									property?.discriminator ===
									"CalculatedProductPropertyViewModel" && (
										<Col col={12}>
											<br />
											<br />
											<Text
												style={{
													whiteSpace: "pre-wrap",
												}}
											>
												{translate(
													"tradeItemCrud.calculatedValue.save"
												)}
											</Text>
											<br />
											<br />
										</Col>
									)}
								{property?.discriminator ===
									"CalculatedProductPropertyViewModel" && (
										<Col col={12}>
											<Text
												style={{
													whiteSpace: "pre-wrap",
												}}
											>
												{translate(
													"tradeItemCrud.calculatedValue.dependent"
												)}
											</Text>
										</Col>
									)}
								<Col col={12}>
									<Label bold>Property code</Label>
									<Text style={{ whiteSpace: "pre-wrap" }}>
										{property.code}
									</Text>
									<br />
									<br />
								</Col>

								<Col col={12}>
									<Label>Cardinality</Label>
									<Text style={{ whiteSpace: "pre-wrap" }}>
										{property.cardinality}
									</Text>
									<br />
									<br />
								</Col>

								<Col col={12}>
									<Label>Type</Label>
									<Text style={{ whiteSpace: "pre-wrap" }}>
										{property.discriminator}
									</Text>
								</Col>

								{property.description?.value && (
									<Col col={12}>
										<br />
										<br />
										<Label>Description</Label>
										<Text
											style={{ whiteSpace: "pre-wrap" }}
										>
											{property.description.value}
										</Text>
									</Col>
								)}

								{property.numericType && (
									<Col col={12}>
										<br />
										<br />
										<Label>Numeric Type</Label>
										<Text
											style={{ whiteSpace: "pre-wrap" }}
										>
											{property.numericType}
										</Text>
									</Col>
								)}
							</Row>
						}
					>
						{Object.keys(valuechanged).find(
							(key) => key === property.code
						) &&
							property?.discriminator ===
							"CalculatedProductPropertyViewModel" ? (
							<span style={{ color: "orange" }}>
								<Icon size={20} icon={ic_error} />
							</span>
						) : (
							property?.discriminator !==
							"CompositeProductPropertyViewModel" && (
								<span>
									<Icon size={16} icon={question} />
								</span>
							)
						)}
					</Tooltip>
				)}
		</>
	);
};

export default withTradeItemPropertiesLocalContext(
	withLocalization(TradeProperty)
);
