import React from "react";
import get from "lodash/get";
import onlyUpdateForKeys from "cdm-shared/utils/onlyUpdateForKeys";
import { withValuesGroupsLocalContext } from "../store/ValuesGroupProvider";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { Label, Row, Col } from "cdm-ui-components";
import PropertyForm from "./PropertyForm";
import TradeProperty from "./TradeProperty";

class TradeItemProperty extends React.Component {
	render() {
		const {
			property,
			value,
			currentParsedLocaleCode,
			currentLocaleCode,
			valuesGroups,
			isEditable,
			disabled,
			tradeItemCategoryCode,
			manufacturerId
		} = this.props;

		const { onChange } = this.props;

		return (
			<>
				<Row>
					<Col>
						<Label
							style={{
								display: "flex",
								alignItems: "center",
							}}
						>
							<TradeProperty
								property={property}
								showTooltip
								isEditable={isEditable}
							/>
						</Label>

						{<PropertyForm
							disabled={disabled}
							currentLocaleCode={currentLocaleCode}
							currentParsedLocaleCode={currentParsedLocaleCode}
							property={property}
							value={value}
							valuesGroup={
								property.discriminator ===
									"CompositeProductPropertyForFormViewModel"
									? get(
										valuesGroups,
										`[${property.properties[0].valuesGroupId}]`,
										null
									)
									: get(
										valuesGroups,
										`[${get(
											property,
											"valuesGroupId"
										)}]`,
										null
									)
							}
							onChange={(val) => onChange(val)}
							tradeItemCategoryCode={tradeItemCategoryCode}
							manufacturerId={manufacturerId}
						/>}
					</Col>
				</Row>
				<br />
			</>
		);
	}
}

export default React.memo(onlyUpdateForKeys(["value"])(
	withLocalization(withValuesGroupsLocalContext(TradeItemProperty))
));
// bfcd6115-3782-4867-b963-6356ffe02680
