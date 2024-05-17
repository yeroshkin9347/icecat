import React, { useEffect, useMemo, useState } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { isFullTextProperty } from "../manager";
import FixedValueProperty from "./FixedValueProperty";
import DateProperty from "./DateProperty";
import TextProperty from "./TextProperty";
import FullTextProperty from "./FullTextProperty";
import NumericProperty from "./NumericProperty";
import ThreeDimensionNumericProperty from "./ThreeDimensionNumericProperty";
import TwoDimensionNumericProperty from "./TwoDimensionNumericProperty";
import RangeNumericProperty from "./RangeNumericProperty";
import TextFieldForCalculated from "./TextFieldForCalculated";
import CompositeProperty from "./CompositeProperty";
import DateWithAccuracyProperty from './DateWithAccuracyProperty/DateWithAccuracyProperty';
import { withTradeItemPropertiesLocalContext } from "../store/TradeItemPropertiesProvider";
import withUser from "cdm-shared/redux/hoc/withUser";
import { Toast } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { withValuesGroupsLocalContext } from "../store/ValuesGroupProvider";

import "./style.css";

const PropertyForm = ({
	className,
	property,
	value,
	tradeItemCategoryCode,
  manufacturerId,
	currentLocaleCode,
	currentParsedLocaleCode,
	valuechanged,
	debounceTime = 1000,
	disablePortal = true,
	// functions
	onChange,
	translate,
	disabled
}) => {
	const [toast, setToast] = useState(false);

	useEffect(() => {
		if (toast) {
			setTimeout(() => setToast(false), 2000);
		}
	}, [toast]);

	useEffect(() => {
		if (
			property.discriminator !== "CalculatedProductPropertyForFormViewModel"
			&& !isEmpty(valuechanged[property.code]
		)) {
			setToast(true)
		}
	}, [valuechanged]);

	const PropertyFormComponent = useMemo(() => {
		switch (get(property, "discriminator", null)) {
			// Date case, show date picker
			case "DateProductPropertyForFormViewModel":
			case "DateProductPropertyViewModel":
				return (
					<DateProperty
						property={property}
						value={value}
						onChange={(newVal) => {
							onChange(newVal);
						}}
						locale={currentParsedLocaleCode}
						disabled={disabled}
						debounceTime={debounceTime}
						disablePortal={disablePortal}
					/>
				);
			case "DateWithAccuracyProductPropertyForFormViewModel":
				return (
					<DateWithAccuracyProperty
						property={property}
						value={value}
						onChange={(newVal) => {
							onChange(newVal);
						}}
						locale={currentParsedLocaleCode}
						disabled={disabled}
					/>
				);

			// Fixed values selects
			// Fixed values manage their cardinality cases by themselves
			case "ListProductPropertyForFormViewModel":
			case "ListProductPropertyViewModel":
				return (
					<FixedValueProperty
						className={className}
						property={property}
						value={value || []}
						onChange={(newVal) => {
							onChange(newVal);
						}}
						locale={currentLocaleCode}
						disabled={disabled}
						tradeItemCategoryCode={tradeItemCategoryCode}
						manufacturerId={manufacturerId}
						disablePortal={disablePortal}
					/>
				);

			// Number, floats
			case "NumericProductPropertyForFormViewModel":
			case "NumericProductPropertyViewModel":
				return (
					<NumericProperty
						className={className}
						property={property}
						value={value}
						disabled={disabled}
						onChange={(newVal) => {
							onChange(newVal);
						}}
						debounceTime={debounceTime}
					/>
				);

			// Text properties
			// We split the behavior if a rich text is needed
			case "StringProductPropertyForFormViewModel":
			case "StringArrayProductPropertyForFormViewModel":
			case "StringProductPropertyViewModel":
				return isFullTextProperty(property) ? (
					<FullTextProperty
						property={property}
						value={value}
						disabled={disabled}
						onChange={(newVal) => {
							onChange(newVal);
						}}
					/>
				) : (
					<TextProperty
						className={className}
						property={property}
						value={value}
						disabled={disabled}
						onChange={(newVal) => {
							onChange(newVal);
						}}
						debounceTime={debounceTime}
					/>
				);

			case "ThreeDimensionNumericProductPropertyForFormViewModel":
				return (
					<ThreeDimensionNumericProperty
						property={property}
						value={value}
						disabled={disabled}
						onChange={(newVal) => {
							onChange(newVal);
						}}
					/>
				);

			case "TwoDimensionNumericProductPropertyForFormViewModel":
				return (
					<TwoDimensionNumericProperty
						property={property}
						value={value}
						disabled={disabled}
						onChange={(newVal) => {
							onChange(newVal);
						}}
					/>
				);

			case "RangeNumericProductPropertyForFormViewModel":
				return (
					<RangeNumericProperty
						property={property}
						value={value}
						disabled={disabled}
						onChange={(newVal) => {
							onChange(newVal);
						}}
					/>
				);
			case "CalculatedProductPropertyForFormViewModel":
				return (
					<TextFieldForCalculated
						value={value}
						property={property}
						onShowChangedValueToast={() => setToast(true)}
					/>
				);
			case "CompositeProductPropertyForFormViewModel":
				return (
					<CompositeProperty
						value={value}
						onChange={(newVal) => {
							onChange(newVal);
						}}
						property={property}
						locale={currentLocaleCode}
						disabled={disabled}
						tradeItemCategoryCode={tradeItemCategoryCode}
						manufacturerId={manufacturerId}
					/>
				);

			default:
				console.error(
					`Property form not found for: ${get(property, "discriminator", null)}`
				);
				return null;
		}
	}, [
		property,
		value,
		tradeItemCategoryCode,
		manufacturerId,
		currentLocaleCode,
		currentParsedLocaleCode,
		debounceTime,
		disablePortal,
		disabled,
		onChange
	]);

	return (
		<>
			{toast && (
				<Toast
					style={{
						position: "fixed",
						bottom: "20px",
						right: "20px",
						zIndex: 999,
					}}
					success
				>
					{translate("tradeItemCrud.calculatedValue.modified")}
				</Toast>
			)}
			{PropertyFormComponent}
		</>
	);
};


export default React.memo(withValuesGroupsLocalContext(withTradeItemPropertiesLocalContext(
	withUser(withLocalization(PropertyForm))
)));
