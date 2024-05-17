import React, { useEffect, useState } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { Zone, H3, Margin } from "cdm-ui-components";
import HierarchyRawData from "./logistic/HierarchyRawData";
import withUser from "cdm-shared/redux/hoc/withUser";
import { allowViewLogistic, isRetailer } from "cdm-shared/redux/hoc/withAuth";
import { getTradeItemProperties, getTradeItemPropertiesForRetailer } from "cdm-shared/component/tradeItemCrud/api";
import { ZoneStyled } from "styled-components/zone/ZoneStyled";

const Logistic = ({ tradeItem, user, translate }) => {
	const [properties, setProperties] = useState([]);
	useEffect(() => {
		if (tradeItem) {
			const getTradeItemPropertiesApi = isRetailer(user) ? getTradeItemPropertiesForRetailer : getTradeItemProperties;
			getTradeItemPropertiesApi(
				tradeItem?.taxonomyId,
				tradeItem?.tradeItemCategory?.code,
				"LOGISTIC"
			).then((res) => {
				setProperties(res.data);
			});
		}
	}, [tradeItem]);
	if (!tradeItem || isEmpty(get(tradeItem, "logistic")))
		return <React.Fragment />;

	const isRestricted = !allowViewLogistic(user);


	return (
		<>
			<ZoneStyled
				style={{
					minWidth: "50%",
					minHeight: "300px",
					maxWidth: "1500px",
					margin: "0 auto"
				}}
				responsive
				borderRadius
			>
				<H3>{translate("tradeitem.logistic.title")}</H3>

				<Zone transparent noPadding noShadow>
					<HierarchyRawData
						{...get(tradeItem, "logistic")}
						isRestricted={isRestricted}
						inline
						translate={translate}
            properties={properties}
					/>
				</Zone>
			</ZoneStyled>

			<Margin bottom={6} />
		</>
	);
};

export default withUser(Logistic);
