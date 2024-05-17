import React, { useState, useEffect } from "react";
import get from "lodash/get";
import filter from "lodash/filter";
import { isPropertyMultiple } from "../manager";
import MultipleValuesManager from "./MultipleValuesManager";
import { parseDate } from "cdm-shared/utils/date";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { useDebounce } from "./useDebounce";
import { getDatePickerFormatByLocale } from "../../../redux/localization";

const DateProperty = (props) => {
	const { property, value, currentParsedLocaleCode, onChange, disabled, debounceTime = 1000, disablePortal = true  } = props;
	const [date, setDate] = useState(value);
	const debouncedDateValue = useDebounce(date, debounceTime);
	const handleChange = (value) => {
		onChange(value);
	};

	useEffect(() => {
		if (debouncedDateValue !== value) {
			handleChange(debouncedDateValue);
		}
	}, [debouncedDateValue]);

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
			getRenderedValue={(val, index) => parseDate(val)}
			Editor={({ val, onChangeLocal }) => (
				<DatePicker
					disabled={disabled}
					PopperProps={{
						disablePortal
					}}
					value={val}
					onChange={(d) => {
						onChangeLocal(d);
					}}
					locale={currentParsedLocaleCode}
					inputFormat={getDatePickerFormatByLocale()}
					block
					// minDate={moment('01/01/0001')}
					renderInput={(params) => (
						<TextField
							className="form-field"
							{...params}
							size="small"
							hiddenLabel
							fullWidth
						/>
					)}
				/>
			)}
		/>
	) : (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<DatePicker
				PopperProps={{
					disablePortal
				}}
				disabled={disabled}
				property={property}
				value={date}
				onChange={(d) => {
					if (d) {
						setDate(d);
					} else {
						setDate("");
					}
				}}
				locale={currentParsedLocaleCode}
				inputFormat={getDatePickerFormatByLocale()}
				block
				// minDate={moment('01/01/0001')}
				renderInput={(params) => (
					<TextField
						className="form-field"
						{...params}
						size="small"
						hiddenLabel
						fullWidth
					/>
				)}
			/>
		</LocalizationProvider>
	);
};
export default React.memo(DateProperty);
