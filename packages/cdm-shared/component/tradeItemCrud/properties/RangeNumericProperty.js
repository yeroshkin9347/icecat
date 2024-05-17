import React, { useState, useEffect } from "react";
import toNumber from "lodash/toNumber";
import { Row, Col } from "cdm-ui-components";
import { Spacing } from "./style";
import { useDebounce } from "./useDebounce";

const RangeDimensionNumericProperty = ({
	value,
	disabled,
	// functions
	onChange,
}) => {
	const [numericalValue, setNumerical] = useState(value || {});
	const debouncedNumericalValue = useDebounce(numericalValue, 1000);

	const setValues = (value, index) => {
		const newValues = numericalValue ? {...numericalValue} : {};
		newValues[index] = value;
		setNumerical(newValues);
	};

	const handleChange = (value) => {
		onChange(value);
	};

	useEffect(() => {
		handleChange(debouncedNumericalValue);
	}, [debouncedNumericalValue]);

	return (
		<Row alignItems="center">
			<Col col={6}>
				<input
					className="form-field"
					type="number"
					disabled={disabled}
					defaultValue={numericalValue && numericalValue['item1'] || ""}
					onChange={(e) => setValues(toNumber(e.target.value), 'item1')}
				/>
			</Col>
			<Spacing>-</Spacing>
			<Col col={6}>
				<input
					className="form-field"
					type="number"
					disabled={disabled}
					defaultValue={numericalValue && numericalValue['item2'] || ""}
					onChange={(e) => setValues(toNumber(e.target.value), 'item2')}
				/>
			</Col>
		</Row>
	);
};

export default RangeDimensionNumericProperty;
