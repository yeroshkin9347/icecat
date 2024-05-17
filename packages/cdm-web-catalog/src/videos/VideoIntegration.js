import React from "react";
import get from "lodash/get";
import { List, ListItem, Text } from "cdm-ui-components";
import { getRetailerId } from "cdm-shared/redux/hoc/withAuth";
import {
  CDM_VIDEO_DOCUMENTATION_FR_URI,
  CDM_VIDEO_DOCUMENTATION_EN_URI
} from "common/environment";
import { ExternalLink } from "cdm-shared/component/Link";

const JAVASCRIPT_MODE = 1;
const IFRAME_MODE = 0;

const JavascriptIntegration = ({ video, externalRetailerId }) => (
  <Text style={{ overflow: "auto" }}>
    {`<script async type="text/javascript" src="https://video.cedemo.com/p/?prefer=html5&clID=${externalRetailerId ||
      4}&div=cedemoPlayer&h=100%&noJQ=0&codeType=video&code=${get(video, "metadata.values.externalId.value"
    )}&w=100%&ratio=1.87&plType=VerticalList"></script>`}
  </Text>
);

const IframeIntegration = ({ video, externalRetailerId }) => (
  <Text style={{ overflow: "auto" }}>
    {`<iframe width="985" height="505" frameborder="0" src="https://video.cedemo.com/i/?prefer=html5&clID=${externalRetailerId ||
      4}&div=cedemoPlayer&h=100%&noJQ=0&codeType=video&code=${get(
      video,
      "metadata.values.externalId.value"
    )}&w=100%&ratio=1.87&plType=VerticalList"></iframe>`}
  </Text>
);

class VideoIntegration extends React.Component {
  state = {
    mode: JAVASCRIPT_MODE
  };

  render() {
    const { mode } = this.state;

    const { video, user } = this.props;

    const { translate } = this.props;

    return (
      <>
        {/* Integration menu */}
        <List>
          {/* Javascript */}
          <ListItem
            selected={mode === JAVASCRIPT_MODE}
            onClick={e => this.setState({ mode: JAVASCRIPT_MODE })}
          >
            <Text small bold={mode === JAVASCRIPT_MODE}>
              {translate(`video.integration.javascript`)}
            </Text>
          </ListItem>

          {/* Iframe */}
          <ListItem
            selected={mode === IFRAME_MODE}
            onClick={e => this.setState({ mode: IFRAME_MODE })}
          >
            <Text small bold={mode === IFRAME_MODE}>
              {translate(`video.integration.iframe`)}
            </Text>
          </ListItem>
        </List>
        <br />
        {mode === JAVASCRIPT_MODE && (
          <JavascriptIntegration
            video={video}
            externalRetailerId={getRetailerId(user)}
          />
        )}
        {mode === IFRAME_MODE && (
          <IframeIntegration
            video={video}
            externalRetailerId={getRetailerId(user)}
          />
        )}
        <br />
        <ExternalLink
          target="_blank"
          rel="noopener noreferrer"
          href={CDM_VIDEO_DOCUMENTATION_FR_URI}
        >
          {translate(`video.integration.documentationFr`)}
        </ExternalLink>
        &nbsp;
        <ExternalLink
          target="_blank"
          rel="noopener noreferrer"
          href={CDM_VIDEO_DOCUMENTATION_EN_URI}
        >
          {translate(`video.integration.documentationEn`)}
        </ExternalLink>
      </>
    );
  }
}

export default VideoIntegration;
