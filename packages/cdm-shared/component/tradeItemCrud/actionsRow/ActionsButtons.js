import React from "react";
import { Button } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { withTradeItemPropertiesLocalContext } from "../store/TradeItemPropertiesProvider";

class ActionsButtons extends React.Component {
	render() {
		const { createMode, isAdmin } = this.props;

		const { translate, onSave, preCompute, onDelete } = this.props;
		const { SetValueChanged } = this.props;

		const tradPrefixKey = createMode === true ? "create" : "update";

		return (
			<>
				<Button
					style={{ marginTop: "0.4em" }}
					onClick={(e) => {
						onSave && onSave();
						SetValueChanged({});
					}}
					small
					primary
					noMargin
				>
					{translate(
						`tradeItemCrud.${tradPrefixKey}.actionButtonApply`
					)}
				</Button>

				{!createMode && isAdmin && (
					<>
						<Button
							style={{ marginTop: "0.4em" }}
							onClick={(e) => {
								preCompute && preCompute();
							}}
							small
							primary
							noMargin
						>
							<i className="icon-energy mr-1"/> 
							{translate(
								`tradeItemCrud.preCompute.title`
							)}
						</Button>
						<Button
							style={{ marginTop: "0.4em" }}
							onClick={(e) => {
								onDelete && onDelete()
							}}
							small
							danger
							noMargin
						>
							{translate("tradeItemCrud.delete.title")}
						</Button>
					</>
				)}
			</>
		);
	}
}

export default withTradeItemPropertiesLocalContext(
	withLocalization(ActionsButtons)
);
