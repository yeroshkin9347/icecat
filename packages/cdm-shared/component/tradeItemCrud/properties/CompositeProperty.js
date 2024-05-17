import React, { useEffect, useState } from "react";
import { plus } from "react-icons-kit/fa/plus";
import {
	Icon,
	RoundedButton,
	Row,
	Col,
	Modal,
	P,
	Margin,
} from "cdm-ui-components";
import { withTradeItemLocalContext } from "../store/TradeItemProvider";
import { withTradeItemPropertiesLocalContext } from "../store/TradeItemPropertiesProvider";
import { withLocalization } from "common/redux/hoc/withLocalization";
import {Button, IconButton} from '@mui/material';
import { useDebounce } from "./useDebounce";
import { isPropertyMultiple } from "../manager";
import FixedValueProperty from "./FixedValueProperty";
import toNumber from "lodash/toNumber";

// Import React Table
import ReactTable from "react-table";
import {Delete as DeleteIcon} from '@mui/icons-material';
import "react-table/react-table.css";

const CompositeProperty = ({
	value,
	onChange,
	removeTradeItemValue,
	property,
	setTradeItemValue,
	compositionValue,
	selectedGroupItemIndex,
	translate,
	locale,
	disabled,
	tradeItemCategoryCode,
  manufacturerId
}) => {
	const [showModal, setShowModal] = useState(false);
	const [propertyIndex, setPropertyIndex] = useState();

	const newObject = property.properties.reduce((obj, p) => {
		obj[p.code] = '';
		return obj;
	}, {})

	useEffect(() => {
		if (!isPropertyMultiple(property) && value === null) {
			onChange([newObject]);
		}
	}, [value]);

	const handleChange = (index, valIndex, value) => {
		setTradeItemValue(
			`marketing.${selectedGroupItemIndex}.values.${property?.code}.${index}.${valIndex}`,
			value
		);
	};

	const renderEditable = (cellInfo) => {
		const singleProperty = property.properties.find(
			({ code }) => code === cellInfo.column.id
		);

		const calculatedValue =
			singleProperty?.discriminator === "NumericProductPropertyViewModel"
				? Number(cellInfo.value).toFixed(1)
				: cellInfo.value;
		const value = calculatedValue === "NaN" ? "" : calculatedValue;

		const [str, setStr] = useState(value);
		const debouncedCellValue = useDebounce(str, 1000);

		useEffect(() => {
			if (debouncedCellValue !== value) {
				handleChange(
					cellInfo.index,
					cellInfo.column.id,
					debouncedCellValue
				);
			}
		}, [debouncedCellValue]);

		return (
			<>
				{singleProperty?.discriminator ===
					"ListProductPropertyViewModel" && (
					<FixedValueProperty
						property={property}
						value={str || []}
						onChange={(newVal) => {
							setStr(newVal);
						}}
						locale={locale}
						disabled={disabled}
						tradeItemCategoryCode={tradeItemCategoryCode}
						manufacturerId={manufacturerId}
					/>
				)}
				{singleProperty?.discriminator ===
					"NumericProductPropertyViewModel" && (
					<input
						className="form-field"
						type="number"
						disabled={disabled}
						value={str}
						onChange={(e) => setStr(toNumber(e.target.value))}
					/>
				)}
				{singleProperty?.discriminator ===
					"CalculatedProductPropertyViewModel" && (
					<input
						className="form-field"
						type="number"
						disabled={disabled}
						value={str}
					/>
				)}
			</>
		);
	};

	return (
		<>
			<div>
				<ReactTable
					data={value === null ? [newObject] : value}
					columns={[
						{
							Header: (
								<RoundedButton
									secondary
									small
									onClick={() =>
										onChange(
											value === null
												? [newObject]
												: [...value, newObject]
										)
									}
								>
									<Icon icon={plus} size={12} />
								</RoundedButton>
							),
							id: "action",
							className: "text-center",
							Cell: (cellInfo) => {
								return (
									<IconButton
										color="error"
										size="large"
										aria-label="Remove"
										sx={{
											padding: 0.5,
										}}
										onClick={() => {
											setShowModal(true);
											setPropertyIndex(cellInfo.index);
										}}
									>
										<DeleteIcon fontSize="small" />
									</IconButton>
								);
							},
							show: isPropertyMultiple(property),
						},
						...property.properties.map(p => ({
							Header: p.name || p.code,
							id: p.code,
							className: "text-center",
							accessor: (value) => value[p.code],
							Cell: renderEditable,
						})),
					]}
					pageSize={(value || []).length}
					showPaginationBottom={false}
					className="-striped -highlight"
					sortable={false}
				></ReactTable>
				<br />
			</div>

			{showModal && (
				<Modal sm>
					{/* Text to explain that the translation will be deleted */}
					<Row style={{ marginTop: "20px" }}>
						<Col col center>
							<P lead>
								{translate(
									"tradeItemCrud.calculatedValue.delete"
								)}
							</P>

							<Margin bottom={5} />
						</Col>
					</Row>

					{/* Actions */}
					<Row>
						<Col col right>
							{/* Cancel */}
							<Button
								onClick={(e) => setShowModal(false)}
								variant="outlined"
							>
								{translate(
									"tradeItemCrud.calculatedValue.cancel"
								)}
							</Button>

							{/* Remove */}
							<Button
								onClick={(e) => {
									removeTradeItemValue(
										`marketing.${selectedGroupItemIndex}.values.${property?.code}`,
										propertyIndex
									);
									setShowModal(false);
								}}
								variant="contained"
								color="error"
								style={{ marginLeft: "10px" }}
							>
								{translate(
									"tradeItemCrud.calculatedValue.confirm"
								)}
							</Button>
						</Col>
					</Row>
				</Modal>
			)}
		</>
	);
};
export default withTradeItemPropertiesLocalContext(
	withTradeItemLocalContext(
		withLocalization(CompositeProperty)
	)
);
