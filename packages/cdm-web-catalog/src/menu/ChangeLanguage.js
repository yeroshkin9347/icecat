import React from "react";
import map from "lodash/map";
import { Tooltip, Padding } from "cdm-ui-components";
import Flag from "cdm-shared/component/Flag";
import { withLocalization } from "common/redux/hoc/withLocalization";

const TL_DISTANCE = [0, 0];

function ChangeLanguage({
  currentLanguageCode,
  languages,
  // function
  onLanguageClicked,
  initLocalization
}) {
  return (
    <Tooltip
      appendTo="parent"
      offset={TL_DISTANCE}
      placement="bottom"
      interactive
      html={map(languages, langCode => (
        <Padding key={`lang-picker-${langCode}`} inline horizontal={2}>
          <Flag
            code={langCode}
            style={{ width: '32px' }}
            onClick={async () => {
              await initLocalization(langCode);
              onLanguageClicked(langCode);
            }}
          />
        </Padding>
      ))}
    >
      <Padding all={0}>
        <Flag code={currentLanguageCode} />
      </Padding>
    </Tooltip>
  );
}

export default withLocalization(ChangeLanguage);
