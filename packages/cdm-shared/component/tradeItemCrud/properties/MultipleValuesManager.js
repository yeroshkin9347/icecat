import React from "react";
import styled from "styled-components";
import map from "lodash/map";
import get from "lodash/get";
import { Icon, RoundedButton } from "cdm-ui-components";
import { ic_add } from "react-icons-kit/md/ic_add";
import { ic_done } from "react-icons-kit/md/ic_done";
import { ic_close } from "react-icons-kit/md/ic_close";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { getLang } from "../../../redux/localization";

const MultipleValuesWrapper = styled.div`
	position: relative;
	display: block;
	width: 100%;
`;

class MultipleValuesManager extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			adding: false,
			tmpValue: null,
			seletedValueIndex: null
		};
		this.inputElement = React.createRef();
		this.add = this.add.bind(this);
		this.cancel = this.cancel.bind(this);
		this.focus = this.focus.bind(this);
	}

	componentDidUpdate() {
		this.focus();
	}

	componentDidMount() {
		this.focus();
	}

	add(dontClose) {
		const { onAdd, onUpdateValueAt } = this.props;
		const { tmpValue, seletedValueIndex } = this.state;

		if (seletedValueIndex != null) {
			onUpdateValueAt(tmpValue, seletedValueIndex);
			this.setState({
				adding: false,
				tmpValue: null,
				seletedValueIndex: null,
			})
		} else {
			onAdd && onAdd(this.state.tmpValue);
			if (dontClose === true) this.setState({ tmpValue: null });
			else this.cancel();
		}
	}

	cancel() {
		this.setState({
			adding: false,
			tmpValue: null,
			seletedValueIndex: null
		});
	}

	focus() {
		if (this.inputElement && this.inputElement.current)
			this.inputElement.current.focus();
	}

	getValueByLang(value) {
		const currentLocaleCode = getLang() || "fr-FR";
		const valueBylang = get(value, "values", []).find(
			(value) => value.languageCode === currentLocaleCode
		);
		if (valueBylang) {
			return get(valueBylang, 'value', '');
		} else {
			return get(value, 'values.0.value', '');
		}
	}

	getLabel(value) {
		const { getRenderedValue } = this.props;
		if (getRenderedValue) {
			return getRenderedValue(value);
		}

		if (typeof value === 'object') {
			return this.getValueByLang(value);
		}

		return value;
	}

	render() {
		const { values, name, Editor } = this.props;

		const { onRemove, getRenderedValue } = this.props;

		const { adding, tmpValue, seletedValueIndex } = this.state;

		return (
			<>
				<MultipleValuesWrapper style={{ minHeight: "37.15px" }}>
					{map(values, (v, k) => (
						<Chip
							label={<Typography style={{whiteSpace: 'normal', paddingTop: '4px', paddingBottom: '4px'}}>{this.getLabel(v)}</Typography>}
							key={`mult-val-${name || "ok"}-${k}`}
							onDelete={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onRemove && onRemove(v, k);
							}}
							style={{
								height: 'auto',
								marginBottom: '4px',
								marginTop: '4px',
								marginRight: '4px',
							}}
							color={seletedValueIndex === k ? "primary" : undefined}
							onClick={() => {
								if (seletedValueIndex === k) {
									this.setState({ tmpValue: null, seletedValueIndex: null })
								} else {
									this.setState({ tmpValue: v, adding: true, seletedValueIndex: k })
								}
							}}
						/>
					))}

					{/* Add */}

					<RoundedButton
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							this.setState({ adding: true, seletedValueIndex: null, tmpValue: null });
						}}
						light
						small
					>
						<Icon icon={ic_add} size={12} />
					</RoundedButton>
				</MultipleValuesWrapper>
				{adding && (
					<MultipleValuesWrapper style={{ paddingRight: "50px" }}>
						<Editor
							internalRef={this.inputElement}
							val={tmpValue}
							onChangeLocal={(newVal) =>
								this.setState({ tmpValue: newVal })
							}
							add={this.add}
							cancel={this.cancel}
							focus={this.focus}
						/>

						{/* Add */}

						<RoundedButton
							style={{
								position: "absolute",
								right: 0,
								top: "-5px",
							}}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								this.add();
							}}
							success={seletedValueIndex === null}
							primary={seletedValueIndex !== null}
							small
						>
							<Icon icon={ic_done} size={12} />
						</RoundedButton>

						{/* Remove */}
						<RoundedButton
							style={{
								position: "absolute",
								right: 0,
								bottom: "-5px",
							}}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								this.cancel();
							}}
							light
							small
						>
							<Icon icon={ic_close} size={12} />
						</RoundedButton>
					</MultipleValuesWrapper>
				)}
			</>
		);
	}
}

export default MultipleValuesManager;
