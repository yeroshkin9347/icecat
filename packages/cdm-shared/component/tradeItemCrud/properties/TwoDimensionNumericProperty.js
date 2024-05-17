import React, { useState, useEffect } from "react";
import toNumber from "lodash/toNumber";
import { Row, Col } from "cdm-ui-components";
import { Spacing } from "./style";
import { useDebounce } from "./useDebounce";

const TwoDimensionNumericProperty = ({
	disabled,
	value,
	// functions
	onChange,
}) => {
	const [numericalValue, setNumerical] = useState(value);
	const debouncedNumericalValue = useDebounce(numericalValue, 1000);
	const values = (typeof value === "string" ? value : "")
		.split("x")
		.map((v) => v.trim());

	const setValues = (value, index) => {
		values[index] = value;
		setNumerical(values.join("x"));
	};
	const handleChange = (value) => {
		onChange(value);
	};

	useEffect(() => {
		if (debouncedNumericalValue !== value) {
			handleChange(debouncedNumericalValue);
		}
	}, [debouncedNumericalValue]);

	return (
		<Row alignItems="center">
			<Col col={6}>
				<input
					className="form-field"
					type="number"
					disabled={disabled}
					defaultValue={values[0] || ""}
					onChange={(e) => setValues(toNumber(e.target.value), 0)}
				/>
			</Col>
			<Spacing>x</Spacing>
			<Col col={6}>
				<input
					className="form-field"
					type="number"
					disabled={disabled}
					defaultValue={values[1] || ""}
					onChange={(e) => setValues(toNumber(e.target.value), 1)}
				/>
			</Col>
		</Row>
	);
};

export default TwoDimensionNumericProperty;
