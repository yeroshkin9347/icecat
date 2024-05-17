import { Text } from "cdm-ui-components";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const RatingImage = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 4px;
  margin-bottom: 4px;
`;

const RatingText = styled(Text)`
  margin-right: 4px;
  margin-bottom: 4px;
  display: inline;
`;

const VideoRatingImage = ({ censor }) => {
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    try {
      setImgSrc(require(`cdm-shared/assets/videoRatings/${censor}.png`));
    } catch (error) {
      setImgSrc(null);
    }
  }, [censor]);

  return imgSrc ? (
    <RatingImage
      src={require(`cdm-shared/assets/videoRatings/${censor}.png`)}
      alt={censor}
    />
  ) : (
    <RatingText>{censor}</RatingText>
  );
};

export default VideoRatingImage;
