import React from "react";
import { components } from "react-select";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import map from "lodash/map";
import indexOf from "lodash/indexOf";
import ContextualZone from "../ContextualZone";
import {
  Text,
  Container,
  Margin,
  Icon,
  RoundedButton,
  Row,
  Col
} from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { withTradeItemLocalContext } from "../store/TradeItemProvider";
import { withGroupLocalContext } from "../store/PropertyGroupProvider";
import {
  getNewObjectForGroup,
  TRANSLATIONS_GROUP_KEY,
  TRANSLATIONS_LANGUAGE_CODE_KEY
} from "../manager";
import { withLanguagesLocalContext } from "../store/LanguageProvider";
import { getAllLanguages } from "../api";
import Flag from "cdm-shared/component/Flag";
import { withTranslationsLocalContext } from "../store/TranslationProvider";
import SelectableFlag from "./SelectableFlag";

import { TextField, Box } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import {Add as AddIcon} from '@mui/icons-material';

export const LanguageOption = props => (
  <components.Option {...props}>
    <Flag
      style={{
        position: "relative",
        top: "-9px",
        display: "inline-block",
        verticalAlign: "top"
      }}
      code={props.value}
    />
    &nbsp;&nbsp;{props.value}
  </components.Option>
);

class Translations extends React.Component {
  state = {
    showAdd: false,
    langToAdd: null,
    defaultLanguageCode: null
  };

  componentDidMount() {
    this.refresh();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedGroupItemIndex !== this.props.selectedGroupItemIndex)
      this.refresh();
  }

  componentWillUnmount() {
    this.props.resetTranslations();
  }

  refresh() {
    const { languages, tradeItem, translationValueKey } = this.props;

    const { setFetchingLanguage, setLanguages, setTranslations } = this.props;

    // set current existing translations
    const existingLanguages = map(
      get(tradeItem, translationValueKey, []),
      (translation, translationKey) =>
        get(translation, TRANSLATIONS_LANGUAGE_CODE_KEY)
    );
    setTranslations(existingLanguages);

    // set languages
    if (isEmpty(languages)) {
      setFetchingLanguage(true);
      getAllLanguages()
        .then(l => {
          setFetchingLanguage(false);
          setLanguages((l || []).sort());
        })
        .catch(err => {
          setFetchingLanguage(false);
          console.error(err);
        });
    }

    // set default language code
    this.setState({
      defaultLanguageCode: get(tradeItem, "defaultLanguageCode")
    });
  }

  selectLanguage(languageCode) {
    const { setSelectedTranslation } = this.props;

    setSelectedTranslation(languageCode);
    this.setState({
      langToAdd: null
    });
  }

  addLang() {
    const { langToAdd, defaultLanguageCode } = this.state;

    const { translations, defaultTargetMarketId, translationValueKey } = this.props;

    const { addTradeItemValue, setTradeItemValue, translate, setTranslations } = this.props;

    // todo check if the lang already exists
    if (indexOf(translations, langToAdd) !== -1) {
      alert(
        `${translate("tradeItemCrud.translations.alreadyExists")}${langToAdd}`
      );
      return;
    }

    // add lang
    const newTranslation = Object.assign(
      {},
      getNewObjectForGroup(TRANSLATIONS_GROUP_KEY, defaultTargetMarketId),
      { [TRANSLATIONS_LANGUAGE_CODE_KEY]: langToAdd }
    );
    addTradeItemValue(translationValueKey, newTranslation);

    // select the added lang
    setTranslations([...translations, langToAdd]);
    this.selectLanguage(langToAdd);

    if (!defaultLanguageCode) {
      setTradeItemValue("defaultLanguageCode", langToAdd);
      this.setState({
        defaultLanguageCode: langToAdd
      });
    }
  }

  render() {
    const { langToAdd, defaultLanguageCode } = this.state;

    const {
      selectedGroupItemIndex,
      languages,
      isFetchingLanguages,
      translations,
      translationSelected
    } = this.props;

    const { translate, setSelectedTranslation } = this.props;

    if (selectedGroupItemIndex === null) return <React.Fragment />;

    return (
      <>
        {/* Main zone showing all of the current channels */}
        <ContextualZone>
          <Text bold>
            {translate("tradeItemCrud.translations.title")}
            <>
              {langToAdd && (
                <RoundedButton onClick={e => this.addLang()}
                               style={{
                                 position: "absolute",
                                 right: 0,
                                 top: "50%",
                                 transform: "translateY(-50%)",
                                 display: "flex",
                                 alignItems: "center",
                                 justifyContent: "center",
                               }}
                               primary
                               noMargin>
                  <AddIcon fontSize="small" sx={{ color: "#fff" }} />
                </RoundedButton>
              )}
            </>
          </Text>

          {/* Add new translations */}
          <Margin top={4} />
          <Row>
            {/* Select with languages */}
            <Col>
              <Autocomplete
                disablePortal
                autoComplete
                includeInputInList
                disableClearable
                value={langToAdd}
                onChange={(e, value) => this.setState({ langToAdd: value })}

                options={languages || []}
                renderOption={(props, option) => (
                  <Box component="li"  {...props}>
                    &nbsp;&nbsp;
                    <Flag
                      style={{
                        verticalAlign: "middle"
                      }}
                      code={option}
                    />
                    &nbsp;&nbsp;{option}
                  </Box>
                )}
                filterOptions={
                  createFilterOptions({
                    matchFrom: 'any',
                    limit: 100,
                  })
                }
                renderInput={(params) =>
                  <TextField
                    {...params}
                    size="small"
                    className="form-field"
                    hiddenLabel
                    fullWidth
                  />
                }
              />
            </Col>
          </Row>

          {/* Display translations */}
          <Container fluid style={{ padding: "0 0 0 0" }}>
            <Margin top={3} />

            {defaultLanguageCode && (
              <SelectableFlag
                title={defaultLanguageCode}
                onClick={e => setSelectedTranslation(defaultLanguageCode)}
                selected={translationSelected === defaultLanguageCode}
                style={{
                  position: "relative",
                  display: "inline-block",
                  verticalAlign: "top",
                  marginRight: "6px"
                }}
                code={defaultLanguageCode}
              />
            )}

            {map(translations, (languageCode, index) => (
              <SelectableFlag
                key={`trade-item-translations-${index}-${languageCode}`}
                title={languageCode}
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
            ))}
          </Container>
        </ContextualZone>
      </>
    );
  }
}

export default withLocalization(
  withGroupLocalContext(
    withTradeItemLocalContext(
      withLanguagesLocalContext(withTranslationsLocalContext(Translations))
    )
  )
);
