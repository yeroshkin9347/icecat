import React, { useEffect, useState } from "react";
import { withTradeItemPropertiesLocalContext } from "../store/TradeItemPropertiesProvider";
import get from "lodash/get";

const TextFieldForCalculated = ({
	value,
	calculatedValue,
	setCalculatedValue,
	property,
	onShowChangedValueToast
}) => {
	const [textValue, setTextValue] = useState({});

	useEffect(() => {
		setCalculatedValue({
			...calculatedValue,
			[property.code]: { value, discriminator: "NullPropertyValue" },
		});
	}, []);


	useEffect(() => {
		if (get(textValue, 'value') !== get(calculatedValue[`${property.code}`], 'value')) {
			onShowChangedValueToast && onShowChangedValueToast();
		}
		setTextValue(calculatedValue[`${property.code}`]);
	},[calculatedValue])

	return (
		<input
			className="form-field"
			disabled={true}
			value={textValue?.value || value}
		/>
	);
};

export default withTradeItemPropertiesLocalContext(TextFieldForCalculated);
