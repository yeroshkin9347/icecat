import React from "react";
import styled from "styled-components";
import { Card, BackgroundImage, Col, Margin, Tag } from "cdm-ui-components";
import { onlyUpdateForKeys } from "recompose";
import noimage from "cdm-shared/assets/noimage.svg";
import map from 'lodash/map'
import Flag from "cdm-shared/component/Flag";

const InfoBadge = styled(Tag)`
  top: -11px;
`;

const FlagsWrapper = styled(Tag)`
  top: -11px;
  background-color: transparent;
  position: relative;
  width: 100%;
`;

const ImageBadgeWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
`;

const MediaCard = ({
  src,
  fileUrl,
  height,
  imgHeight,
  category,
  index,
  show,
  showPrePicture,
  fileName,
  manuallyImported,
  notDefinitive,
  notExportable,
  isChild,
  children,
  tags,
  languageCodes,
  onClick,
  ...otherProps
}) => {
  return (
    <Col {...otherProps} col={3}>
      <Card style={{ cursor: "pointer" }} height={height || "300px"} transition onClick={onClick}>
        <BackgroundImage
          background="#fff"
          height={imgHeight || "200px"}
          cover={showPrePicture === false}
          src={showPrePicture === false ? noimage : src}
        >
          
          {!!languageCodes && !!languageCodes.length && (
            <FlagsWrapper>
              {map(languageCodes, (languageCode, index) => (
                <Flag
                  key={`media-item-${index}-${languageCode}`}
                  title={languageCode}
                  style={{
                    marginRight: "6px"
                  }}
                  code={languageCode}
                />
              ))}
            </FlagsWrapper>
          )}

          {category && (
            <InfoBadge style={{ color: "#fff" }} secondary>
              {category}
            </InfoBadge>
          )}

          {manuallyImported && (
            <InfoBadge style={{ color: "#222" }} warning>
              {manuallyImported}
            </InfoBadge>
          )}

          {notDefinitive && (
            <InfoBadge style={{ color: "#222" }} warning>
              {notDefinitive}
            </InfoBadge>
          )}

          {notExportable && (
            <InfoBadge info>
              {notExportable}
            </InfoBadge>
          )}

          {index !== null && index !== undefined && (
            <InfoBadge info>#{index}</InfoBadge>
          )}

          {isChild && (
            <InfoBadge danger>
              {isChild}
            </InfoBadge>
          )}

          <ImageBadgeWrapper>
            {(tags || []).map(tag => (
              <Tag info>{tag}</Tag>
            ))}
          </ImageBadgeWrapper>

          {showPrePicture === false && fileName && fileName}
        </BackgroundImage>

        {children}
      </Card>

      <Margin bottom={4} />
    </Col>
  );
};

export default onlyUpdateForKeys([
  "category",
  "index",
  "src",
  "style",
  "manuallyImported"
])(MediaCard);
