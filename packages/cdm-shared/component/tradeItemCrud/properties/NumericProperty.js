import React, { useState, useEffect } from "react";
import classNames from "classnames";
import get from "lodash/get";
import filter from "lodash/filter";
import { isPropertyMultiple } from "../manager";
import MultipleValuesManager from "./MultipleValuesManager";
import toNumber from "lodash/toNumber";
import { useDebounce } from "./useDebounce";
import { TextField } from "@mui/material";

const NumericProperty = ({
	className,
	property,
	value,
	disabled,
	// functions
	onChange,
	debounceTime = 1000,
}) => {
	const [numericalValue, setNumerical] = useState(value);
	const debouncedNumericalValue = useDebounce(numericalValue, debounceTime);
	const handleChange = (value) => {
		onChange(value);
	};

	useEffect(() => {
		if (debouncedNumericalValue !== value) {
			handleChange(debouncedNumericalValue);
		}
	}, [debouncedNumericalValue]);

	return isPropertyMultiple(property) ? (
		<MultipleValuesManager
			name={get(property, "code")}
			values={value}
			onRemove={(val, index) =>
				onChange(filter(value, (o, k) => k !== index))
			}
			onAdd={(newVal) =>
				newVal !== null && onChange([...(value || []), newVal])
			}
			Editor={({
				val,
				onChangeLocal,
				add,
				cancel,
				focus,
				internalRef,
			}) => (
				<TextField
					className={classNames("form-field", className)}
					size="small"
					type="number"
					disabled={disabled}
					ref={internalRef}
					value={val === null ? "" : val}
					onChange={(e) => onChangeLocal(toNumber(e.target.value))}
					onKeyDown={(event) => {
						if (event.key === "Enter" && val !== null) {
							add(true);
							event.preventDefault();
							event.stopPropagation();
							focus();
						} else if (event.key === "Escape") {
							cancel();
							event.preventDefault();
							event.stopPropagation();
							focus();
						}
					}}
				/>
			)}
		/>
	) : (
		<TextField
			className={classNames("form-field", className)}
			size="small"
			type="number"
			disabled={disabled}
			defaultValue={numericalValue === null ? "" : numericalValue}
			onChange={(e) => setNumerical(toNumber(e.target.value))}
		/>
	);
};

export default React.memo(NumericProperty);
