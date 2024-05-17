import React from "react";
import map from "lodash/map";
import has from "lodash/has";
import remove from "lodash/remove";
import isArray from "lodash/isArray";
import isString from "lodash/isString";
import isPlainObject from "lodash/isPlainObject";
import { parseDate } from "cdm-shared/utils/date";
import { isRetailer } from "cdm-shared/redux/hoc/withAuth";
import { formatEan } from "cdm-shared/utils/format";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { getAccuracyLabelFromDateWithAccuracy } from "cdm-shared/component/tradeItemCrud/properties/utils";
import { getLang } from "cdm-shared/redux/localization";
import * as env from "cdm-shared/environment";

const renderPropertyValue = (propertyCode, propertyType, value) => {
	switch (propertyType) {
		case "DateProductPropertyLightViewModel":
		case "DateProductPropertyViewModel":
			return parseDate(value);
		default:
			return value;
	}
};

export const checkEmptyTradeItemProperty = (property) => {
	return remove(
		property.value,
		(value) =>
			value === null ||
			(value.discriminator !== "ObjectListPropertyValue" &&
				property.discriminator !==
					"CompositeProductPropertyViewModel" &&
				value.length === 0) ||
			(isPlainObject(value?.value) && value?.value.length === 0)
	);
};

export const isNullOrWhitespaceString = (input) => {
	return isString(input) && (!input || !input.trim());
};

export const renderTradeItemProperty = (property, user) => {
	if (property.discriminator === "CompositeProductPropertyViewModel") {
		return (
			<ReactTable
				data={property.value === null ? [] : property.value}
				columns={[
					...property.properties.map(p => ({
						Header: p.name || p.code,
						id: p.code,
						className: "text-center",
						accessor: (value) => value[p.code],
					})),
				]}
				pageSize={(property.value || []).length}
				showPaginationBottom={false}
				className="-striped -highlight"
				sortable={false}
			></ReactTable>
		);
	}
	// special exclusivity handling
	if (property.code === "exclusivity" && user && isRetailer(user)) {
		return <i className="icon-check" />;
	}

	// special exclusion handling
	if (property.code === "exclusion" && user && isRetailer(user)) {
		return <i className="icon-check" />;
	}

	// EAN specific hack
	if (property.code === "ean") return formatEan(property.value);

	// Start availability specific hack
	if (property.code === "start_availability") return parseDate(property.value);

	// array type
	if (isArray(property.value)) {
		let arrayOfValues = map(property.value, (item) =>
			has(item, "Value")
				? renderTradeItemProperty(
						{
							code: property.code,
							value: item.Value,
							discriminator: property.discriminator,
						},
						user
				  )
				: renderTradeItemProperty(
						{
							code: property.code,
							value: item,
							discriminator: property.discriminator,
						},
						user
				  )
		);

		//return <ul>{ map(orderby(arrayOfValues, [entry => entry.toLowerCase()], ['asc']), entry => <li>{entry}</li>) }</ul>;
		return (
			<ul>
				{map(arrayOfValues, (entry) => (
					<li key={entry}>{entry}</li>
				))}
			</ul>
		);
	}

	// object type
	if (isPlainObject(property.value)) {
		if (has(property.value, "value")) {
			return renderPropertyValue(
				property.code,
				property.discriminator,
				property.value.value,
				user
			);
		} if (has(property.value, "dateTimeOffset") && property.discriminator === 'DateProductPropertyViewModel') {
			return parseDate(property.value.dateTimeOffset);
		} if (has(property.value, "dateTimeOffset") && property.discriminator === 'DateWithAccuracyProductPropertyViewModel') {
			const locale = getLang() || env.CDM_DEFAULT_LANG;
			return `${parseDate(property.value.dateTimeOffset)} (${getAccuracyLabelFromDateWithAccuracy(property.value, locale)})`;
		} else {
			const arrayOfValues = [];
			for (const propertyCode in property.value) {
				arrayOfValues.push(property.value[propertyCode]);
			}
			return arrayOfValues.join(", ");
		}
	}

	// scalar
	else
		return renderPropertyValue(
			property.code,
			property.discriminator,
			property.value,
			user
		);
};
