import React from "react";
import { renderTradeItemProperty } from "tradeItem/tradeItemProperty";
import { Col, Text, Tooltip, Row } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { HelpOutline } from "@mui/icons-material";

const LogisticProperty = ({
	code,
	value,
	translate,
	showTooltip,
	currentLocaleCode,
}) => {
	return (
		<>
			<div style={{ display: "flex" }}>
				<Text bold as="label">
					{translate(`tradeItemProperties.properties.${code}`)}
				</Text>
				{showTooltip && (
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
								<Col col={12}>
									<Text
										style={{
											whiteSpace: "pre-wrap",
										}}
									>
										{currentLocaleCode === "fr-FR"
											? "Cette propriété depend de la valeur d’autres propriétés"
											: "This property is dependent on other properties values"}
									</Text>
								</Col>
							</Row>
						}
					>
						<span style={{ marginLeft: 5 }}>
							<HelpOutline fontSize="small" />
						</span>
					</Tooltip>
				)}
			</div>
			<Text>{renderTradeItemProperty({ code, value })}</Text>

			<br />
		</>
	);
};

export default React.memo(
	withLocalization(LogisticProperty)
);
