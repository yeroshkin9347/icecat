import React, { useState, useEffect } from "react";
import get from "lodash/get";
import filter from "lodash/filter";
import { isPropertyMultiple } from "../manager";
import MultipleValuesManager from "./MultipleValuesManager";
import { useDebounce } from "./useDebounce";

const FullTextProperty = ({
	property,
	value,
	disabled,
	// functions
	onChange,
}) => {
	const [string, setString] = useState(value);
	const debouncedPropertyValue = useDebounce(string, 1000);
	const handleChange = (value) => {
		onChange(value);
	};

	useEffect(() => {
		if (debouncedPropertyValue !== value) {
			handleChange(debouncedPropertyValue);
		}
	}, [debouncedPropertyValue]);

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
			Editor={({ val, onChangeLocal }) => (
				<textarea
					className="form-field"
					disabled={disabled}
					value={val === null ? "" : val}
					rows={6}
					onChange={(e) => onChangeLocal(e.target.value)}
				/>
			)}
		/>
	) : (
		<textarea
			className="form-field"
			disabled={disabled}
			value={string === null ? "" : string}
			rows={6}
			onChange={(e) => setString(e.target.value)}
		/>
	);
};

export default React.memo(FullTextProperty);
