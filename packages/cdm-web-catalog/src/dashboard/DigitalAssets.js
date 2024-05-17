import { getDigitalAssetStatistics } from "cdm-shared/services/videos";
import { Row, Text, Zone, H3 } from "cdm-ui-components";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { useHistory } from "react-router-dom";
import { prettyNumber } from "common/utils/formatter";

const Wrapper = styled(Row)`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  gap: 2rem;
  padding-left: 15px;
  padding-right: 15px;
  cursor: pointer;
`;

const ItemZone = styled(Zone)`
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 30px 0px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Title = styled(H3)`
  margin-bottom: 0.75rem;
`;

const DigitalAssets = ({ translate, currentLocaleCode }) => {
  const history = useHistory();

  const [digitalAssets, setDigitalAssets] = useState({
    imagesCount: null,
    documentsCount: null,
    videosCount: null,
  });

  const navigateToDAM = (type) => {
    history.push(`/digital-assets-management?type=${type}&mode=grid`);
  };

  useEffect(() => {
    getDigitalAssetStatistics().then((res) => {
      setDigitalAssets(res.data);
    });
  }, []);

  return (
    <>
      <Wrapper>
        <ItemZone onClick={() => navigateToDAM("video")}>
          <Title block center>
            {prettyNumber(get(digitalAssets, "videosCount"), currentLocaleCode)}
          </Title>

          <Text center uppercase>
            {get(digitalAssets, "videosCount") > 1
              ? translate("dashboard.manufacturer.videos")
              : translate("dashboard.manufacturer.video")}
          </Text>
        </ItemZone>
        <ItemZone onClick={() => navigateToDAM("image")}>
          <Title block center>
            {prettyNumber(get(digitalAssets, "imagesCount"), currentLocaleCode)}
          </Title>

          <Text center uppercase>
            {get(digitalAssets, "imagesCount") > 1
              ? translate("dashboard.manufacturer.images")
              : translate("dashboard.manufacturer.image")}
          </Text>
        </ItemZone>

        <ItemZone onClick={() => navigateToDAM("document")}>
          <Title block center>
            {prettyNumber(get(digitalAssets, "documentsCount"), currentLocaleCode)}
          </Title>

          <Text center uppercase>
            {get(digitalAssets, "documentsCount") > 1
              ? translate("dashboard.manufacturer.documents")
              : translate("dashboard.manufacturer.document")}
          </Text>
        </ItemZone>
      </Wrapper>
    </>
  );
};

export default withLocalization(DigitalAssets);
