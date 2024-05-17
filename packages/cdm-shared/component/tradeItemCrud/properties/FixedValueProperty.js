import React, { useEffect, useState, useRef, useMemo } from "react";
import classNames from "classnames";
import TextField from "@mui/material/TextField";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import useMediaQuery from "@mui/material/useMediaQuery";
import Popper from "@mui/material/Popper";
import { useTheme, styled } from "@mui/material/styles";
import { VariableSizeList } from "react-window";
import Typography from "@mui/material/Typography";
import { getMultipleFixedValueValue, renderFixedValue } from "./utils";
import { isPropertyMultiple } from "../manager";
import get from "lodash/get";
import map from "lodash/map";
import isArray from "lodash/isArray";
import CircularProgress from "@mui/material/CircularProgress";
import { getGroupsValues, getGroupsValuesCMS } from "../api";
import { reduceGroupValuesValues } from "./utils";
import values from "lodash/values";
import { withTradeItemPropertiesLocalContext } from "../store/TradeItemPropertiesProvider";
import { getLang } from 'cdm-shared/redux/localization';
import * as env from "cdm-shared/environment";
import { withValuesGroupsLocalContext } from "../store/ValuesGroupProvider";

const LISTBOX_PADDING = 8;

function renderRow(props) {
	const { data, index, style } = props;
	const dataSet = data[index];
	const inlineStyle = {
		...style,
		top: style.top + LISTBOX_PADDING,
		margin: 0,
	};
	const locale = getLang() || env.CDM_DEFAULT_LANG;

	return (
		<Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
			{renderFixedValue(dataSet[1], locale)}
		</Typography>
	);
}

const OuterElementContext = React.createContext({});
const OuterElementType = React.forwardRef((props, ref) => {
	const outerProps = React.useContext(OuterElementContext);
	return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
	const ref = useRef(null);
	useEffect(() => {
		if (ref.current != null) {
			ref.current.resetAfterIndex(0, true);
		}
	}, [data]);
	return ref;
}

export const PropertyListboxComponent = React.forwardRef(function ListboxComponent(
	props,
	ref
) {
	const { children, ...other } = props;
	const itemData = [];
	children.forEach((item) => {
		itemData.push(item);
		itemData.push(...(item.children || []));
	});

	const theme = useTheme();
	const smUp = useMediaQuery(theme.breakpoints.up("sm"), {
		noSsr: true,
	});
	const itemCount = itemData.length;
	const itemSize = smUp ? 36 : 48;

	const getChildSize = (child) => {
		if (child.hasOwnProperty("group")) {
			return 48;
		}

		return itemSize;
	};

	const getHeight = () => {
		if (itemCount > 8) {
			return 8 * itemSize;
		}
		return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
	};

	const gridRef = useResetCache(itemCount);

	return (
		<div ref={ref}>
			<OuterElementContext.Provider value={other}>
				<VariableSizeList
					itemData={itemData}
					height={getHeight() + 2 * LISTBOX_PADDING}
					width="100%"
					ref={gridRef}
					outerElementType={OuterElementType}
					innerElementType={(props) => <ul {...props} style={{ ...props.style, margin: 0 }} />}
					itemSize={(index) => getChildSize(itemData[index])}
					overscanCount={5}
					itemCount={itemCount}
				>
					{renderRow}
				</VariableSizeList>
			</OuterElementContext.Provider>
		</div>
	);
});
const StyledPopper = styled(Popper)({
	[`& .${autocompleteClasses.listbox}`]: {
		boxSizing: "border-box",
		"& ul": {
			padding: 2,
			margin: 2,
		},
	},
	"&": {
		zIndex: 9999
	}
});

const CustomPopper = function (props) {
	return <StyledPopper {...props} placement="bottom-start" />;
};

const FixedValueProperty = ({
	className,
	property,
	value,
	locale,
	tradeItemCategoryCode,
  manufacturerId,
  valueGroupWithKey,
	disablePortal = true,
	// functions
	onChange,
	cachedValuesGroup,
	addCachedValuesGroup,
	disabled,
}) => {
	const [open, setOpen] = useState(false);
	const [options, setOptions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [fetchedOptions, setFetchedOption] = useState(false);
	const valuesGroupId =
		property.discriminator === "CompositeProductPropertyViewModel"
			? property?.properties[0]?.valuesGroupId
			: get(property, "valuesGroupId", null);

  const groupValues = valueGroupWithKey?.valuesGroupValueResponseDefinitions?.find((prop) => prop.propertyCode === property.code)

	useEffect(() => {
		if (cachedValuesGroup[valuesGroupId]) {
			setOptions(values(cachedValuesGroup[valuesGroupId]));
		}
	}, [tradeItemCategoryCode]);

	useEffect(async () => {
		if (!open || fetchedOptions) {
			return;
		}

		if (cachedValuesGroup[valuesGroupId]) {
			setOptions(values(cachedValuesGroup[valuesGroupId]));
			return;
		}

		setLoading(true);
		const isAdmin = localStorage.getItem('isAdmin') === "1";
		const getGroupsValuesApi = isAdmin ? getGroupsValuesCMS([valuesGroupId], tradeItemCategoryCode, manufacturerId) : getGroupsValues([valuesGroupId], tradeItemCategoryCode)
		const response = await getGroupsValuesApi;
		const valuesGroups = reduceGroupValuesValues(get(response, "data", []), property?.code !== "currency_code");

		if (!cachedValuesGroup[valuesGroupId]) {
			if (values(valuesGroups).length === 0) {
				valuesGroups[valuesGroupId] = [];
			}
			addCachedValuesGroup(valuesGroups);
		}

		setFetchedOption(true);
		const groupOptions = valuesGroups[valuesGroupId];
		if (values(groupOptions).length) {
			setOptions(values(groupOptions));
		}
		setLoading(false);
	}, [open]);

	useEffect(() => {
		if (groupValues && value) {
      if (!fetchedOptions) {
        if (isArray(value)) {
          const result = value.map(val => {
            const languages = groupValues?.values[val]?.values.reduce((langResult, item) => {
              langResult[item.languageCode] = item.value;
              return langResult;
            }, {}) || {};
            return ({
              code: val,
              ...languages
            })
          });
          setOptions(result);
        } else {
          const languages = groupValues?.values[value]?.values.reduce((langResult, item) => {
            langResult[item.languageCode] = item.value;
            return langResult;
          }, {});
          setOptions([{
            code: value,
            ...languages
          }]);
        }
      }
    } else if (value && !fetchedOptions) {
			if (isArray(value)) {
				setOptions(value.map(val => ({ code: val })));
			} else {
				setOptions([{
					code: value,
				}]);
			}
		}
	}, [value]);

	const sortedOptions = useMemo(() => {
		return options.sort((a, b) => {
			const labelA = renderFixedValue(a, locale) || "";
			const labelB = renderFixedValue(b, locale) || "";
			return labelA.localeCompare(labelB);
		});
	}, [options])

	return !isPropertyMultiple(property) ? (
		<Autocomplete
			disablePortal={disablePortal}
			autoComplete
			includeInputInList
			id="virtualize-demo"
			disableListWrap
			disabled={disabled}
			PopperComponent={CustomPopper}
			ListboxComponent={PropertyListboxComponent}
			open={open}
			onOpen={() => {
				setOpen(true);
			}}
			onClose={() => {
				setOpen(false);
			}}
			options={sortedOptions}
			loading={loading}
			value={(() => {
				const singValObj = options.find((r) => value === r.code);
				return typeof singValObj === "object" ? singValObj : null;
			})()}
			onChange={(e, v) => {
				onChange(get(v, "code"));
			}}
			getOptionLabel={(o) => renderFixedValue(o, locale) || ""}
			renderInput={(params) => (
				<TextField
					className={classNames("form-field", className)}
					{...params}
					InputProps={{
						...params.InputProps,
						style: {
							paddingTop: 0,
							paddingBottom: 0,
						},
						endAdornment: (
							<React.Fragment>
								{loading ? (
									<CircularProgress
										color="inherit"
										size={20}
									/>
								) : null}
								{params.InputProps.endAdornment}
							</React.Fragment>
						),
					}}
					size="small"
					hiddenLabel
					fullWidth
				/>
			)}
			renderOption={(props, option) => [props, option]}
			renderGroup={(params) => params}
		/>
	) : (
		<Autocomplete
			disablePortal={disablePortal}
			disabled={disabled}
			multiple
			autoComplete
			includeInputInList
			disableCloseOnSelect
			open={open}
			onOpen={() => {
				setOpen(true);
			}}
			onClose={() => {
				setOpen(false);
			}}
			options={sortedOptions}
			loading={loading}
			PopperComponent={StyledPopper}
			ListboxComponent={PropertyListboxComponent}
			value={getMultipleFixedValueValue(value, options)}
			onChange={(e, v) => {
				onChange(map(v, (_v) => get(_v, "code", null)));
			}}
			getOptionLabel={(o) => renderFixedValue(o, locale) || ""}
			renderInput={(params) => (
				<TextField
					className="form-field"
					{...params}
					InputProps={{
						...params.InputProps,
						style: {
							paddingTop: 0,
							paddingBottom: 0,
						},
						endAdornment: (
							<React.Fragment>
								{loading ? (
									<CircularProgress
										color="inherit"
										size={20}
									/>
								) : null}
								{params.InputProps.endAdornment}
							</React.Fragment>
						),
					}}
					size="small"
					hiddenLabel
					fullWidth
				/>
			)}
			renderOption={(props, option) => [props, option]}
			renderGroup={(params) => params}
		/>
	);
};
export default withTradeItemPropertiesLocalContext(withValuesGroupsLocalContext(FixedValueProperty));
