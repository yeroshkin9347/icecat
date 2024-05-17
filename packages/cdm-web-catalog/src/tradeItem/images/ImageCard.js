import React from "react";
import styled from "styled-components";
import fileDownload from "js-file-download";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import {
  Card,
  BackgroundImage,
  Icon,
  Tag,
  Loader,
  RoundedButton,
  Text
} from "cdm-ui-components";
import { getImageLink, downloadContent } from "cdm-shared/utils/url";
import { ic_file_download } from "react-icons-kit/md/ic_file_download";
import onlyUpdateForKeys from "cdm-shared/utils/onlyUpdateForKeys";
import { isRgb, isUndefinedColorspace } from "cdm-shared/utils/image";
import { isObject, map } from "lodash";
import { isRetailer } from "cdm-shared/redux/hoc/withAuth";
import Flag from "cdm-shared/component/Flag";

const dlButtonStyle = {
  position: "absolute",
  left: "0",
  bottom: "0"
};

const StatusInfo = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 8px;
`;

const ImageTags = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  padding: 8px;
`;

const MetadataElement = styled(Text)`
  padding: 0.2rem;
  position: absolute;
  z-index: 2;
  bottom: 6px;
  right: 6px;
`;

const FlagsWrapper = styled(Tag)`
  top: -26px;
  background-color: transparent;
  position: relative;
  width: 100%;
`;

const ImageMetadata = ({ img }) => {
  return (
    <MetadataElement small>
      {get(img, "width")}x{get(img, "height")}
      {get(img, "plungeAngle.value") && ` - ${get(img, "plungeAngle.value")}`}
      {get(img, "facingType.value") && ` - ${get(img, "facingType.value")}`}
    </MetadataElement>
  );
};

class ImagesCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      downloading: false
    };
  }

  download() {
    const { img } = this.props;

    this.setState({ downloading: true });
    const uri = get(img, "publicUrl").replace(
      /storage\.gra\.cloud\.ovh\.net\/v1\/AUTH_8f75d74f077b4b88b4aa7227d4ee5f6f/i,
      "cdmc.cedemo.com"
    );
    downloadContent(uri).then(response => {
      fileDownload(response.data, get(img, "filename"));
      this.setState({ downloading: false });
    });
  }

  render() {
    const { downloading } = this.state;

    const { img, height, user } = this.props;

    const { translate, onClick, isChild, languageCodes } = this.props;

    const colorspace = get(img, "colorSpace", null);

    // tags can be object or array
    const imgTags = get(img, "tags");

    const tags = isObject ? Object.keys(imgTags) : imgTags;

    const notExportable = get(img, "notExportable");
    const isRetailerUser = isRetailer(user);

    return (
      <Card
        height={height || "300px"}
        transition
        onClick={e => onClick && onClick()}
      >
        {/* image */}
        <BackgroundImage
          background="#fff"
          height={height || "300px"}
          src={getImageLink(get(img, "publicUrl"), "-small")}
        >
          {!!languageCodes && !!languageCodes.length && (
            <FlagsWrapper>
              {map(languageCodes, (languageCode, index) => (
                <Flag
                  key={`image-item-${index}-${languageCode}`}
                  title={languageCode}
                  style={{
                    marginRight: "6px"
                  }}
                  code={languageCode}
                />
              ))}
            </FlagsWrapper>
          )}

          <StatusInfo>
            {/* not exportable */}
            {!isRetailerUser && get(img, "notExportable") && (
              <Tag warning>{translate(`tradeitem.images.notExportable`)}</Tag>
            )}

            {/* notDefinitive */}
            {get(img, "notDefinitive") && (
              <Tag info>{translate(`tradeitem.images.notDefinitive`)}</Tag>
            )}

            {/* colorspace */}
            {colorspace && !isRgb(colorspace) && !isUndefinedColorspace(colorspace) && <Tag info>{colorspace}</Tag>}

            {/* isChildImage */}
            {isChild && (
              <Tag danger>{translate(`tradeitem.images.child`)}</Tag>
            )}
          </StatusInfo>

          <ImageTags>
            {tags.map(tag =>
              <Tag primary>{tag}</Tag>
            )}
          </ImageTags>

          {/* download */}
          {(isRetailerUser ? !notExportable : true) && !downloading && (
            <RoundedButton
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                this.download();
                return false;
              }}
              style={dlButtonStyle}
              light
            >
              <Icon size={14} icon={ic_file_download} />
            </RoundedButton>
          )}

          {/* loader */}
          {downloading && <Loader style={dlButtonStyle} small />}

          {/* metadata */}
          <ImageMetadata img={img} />
        </BackgroundImage>
      </Card>
    );
  }
}

export default onlyUpdateForKeys(["img"])(ImagesCard);
