import React from "react";
import map from "lodash/map";
import { Row, Col, Margin, Modal, P } from "cdm-ui-components";
import { withTranslationsLocalContext } from "../store/TranslationProvider";
import SelectableFlag from "./SelectableFlag";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { onlyUpdateForKeys } from "recompose";
import { withTradeItemLocalContext } from "../store/TradeItemProvider";
import { Button } from '@mui/material';

class TranslationsRow extends React.Component {
  state = {
    showDelete: false
  };

  removeTranslation() {
    const { translationSelected, translationValueKey } = this.props;

    const {
      removeTranslation,
      removeTradeItemValue,
      getTranslationSelectedIndex
    } = this.props;

    removeTranslation(translationSelected);
    removeTradeItemValue(translationValueKey, getTranslationSelectedIndex());
  }

  render() {
    const { showDelete } = this.state;

    const {
      translations,
      translationSelected,
      // functions
      setSelectedTranslation,
      translate
    } = this.props;

    return (
      <>
        <Row>
          {/* Translations */}
          <Col col>
            {/* Display translations flags */}
            {map(translations, (languageCode, index) => (
              <React.Fragment
                key={`trade-item-translations-row-${index}-${languageCode}`}
              >
                <SelectableFlag
                  onClick={e => setSelectedTranslation(languageCode)}
                  selected={translationSelected === languageCode}
                  style={{
                    position: "relative",
                    display: "inline-block",
                    verticalAlign: "top",
                    marginRight: "6px"
                  }}
                  code={languageCode}
                />
              </React.Fragment>
            ))}
          </Col>

          <Col col right>
            {/* Delete current translation */}
            <Button
              onClick={e => this.setState({ showDelete: true })}
              variant="contained" color="error"
            >
              {translate("tradeItemCrud.translations.remove")}
            </Button>
          </Col>
        </Row>

        <Margin bottom={4} />

        {showDelete && (
          <Modal sm>
            {/* Text to explain that the translation will be deleted */}
            <Row>
              <Col col center>
                <P lead>{translate("tradeItemCrud.translations.areYouSure")}</P>

                <P>{translationSelected}</P>

                <SelectableFlag
                  onClick={e => setSelectedTranslation(translationSelected)}
                  code={translationSelected}
                />

                <Margin bottom={5} />
              </Col>
            </Row>

            {/* Actions */}
            <Row>
              <Col col right>
                {/* Cancel */}
                <Button
                  onClick={e => this.setState({ showDelete: false })}
                  variant="outlined"
                >
                  {translate("tradeItemCrud.translations.cancel")}
                </Button>

                {/* Remove */}
                <Button onClick={e => this.removeTranslation()} variant="contained" color="error">
                  {translate("tradeItemCrud.translations.remove")}
                </Button>
              </Col>
            </Row>
          </Modal>
        )}
      </>
    );
  }
}

export default onlyUpdateForKeys(["translations", "translationSelected"])(
  withLocalization(
    withTranslationsLocalContext(withTradeItemLocalContext(TranslationsRow))
  )
);
