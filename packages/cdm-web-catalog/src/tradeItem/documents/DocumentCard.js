import React from "react";
import styled from "styled-components";
import fileDownload from "js-file-download";
import get from "lodash/get";
import {
  Card,
  BackgroundImage,
  Icon,
  Tag,
  Loader,
  RoundedButton
} from "cdm-ui-components";
import { downloadContent } from "cdm-shared/utils/url";
import { ic_file_download } from "react-icons-kit/md/ic_file_download";
import onlyUpdateForKeys from "cdm-shared/utils/onlyUpdateForKeys";
import noimage from "cdm-shared/assets/noimage.svg";

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

class DocumentCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      downloading: false
    };
  }

  download() {
    const { doc } = this.props;

    this.setState({ downloading: true });
    const url = (get(doc, "publicUrl") || "").replace(
      /storage.gra.cloud.ovh.net\/v1\/AUTH_8f75d74f077b4b88b4aa7227d4ee5f6f/gi,
      "cdmc.cedemo.com"
    );
    downloadContent(url).then(response => {
      fileDownload(response.data, get(doc, "filename"));
      this.setState({ downloading: false });
    });
  }

  render() {
    const { downloading } = this.state;

    const { doc, height } = this.props;

    const { translate } = this.props;

    return (
      <Card height={height || "300px"} transition>
        {/* image */}
        <BackgroundImage
          background="#fff"
          height={height || "300px"}
          src={noimage}
          cover
        >
          {/* download */}
          {!downloading && (
            <RoundedButton
              onClick={e => this.download()}
              style={dlButtonStyle}
              light
            >
              <Icon size={14} icon={ic_file_download} />
            </RoundedButton>
          )}

          {/* loader */}
          {downloading && <Loader style={dlButtonStyle} small />}

          {/* Status */}
          <StatusInfo>
            {/* doc type */}
            <Tag info noMargin>
              {translate(
                `tradeitem.documents.types.${get(doc, "documentCategory.key", "")}`
              )}
            </Tag>
          </StatusInfo>
        </BackgroundImage>
      </Card>
    );
  }
}

export default onlyUpdateForKeys(["doc"])(DocumentCard);
