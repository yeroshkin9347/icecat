import React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import {
  addTranslationForLanguage,
  getTranslate,
  getLanguages,
  setActiveLanguage
} from "react-localize-redux";
import find from "lodash/find";
import size from "lodash/size";
import split from "lodash/split";
import map from "lodash/map";
import debounce from 'lodash/debounce';
import {
  localStorageSetItem,
  localStorageGetItem
} from "../utils/localStorage";

export const setLang = locale => {
  try {
    localStorageSetItem("lang", locale);
  } catch (e) {}
};

export const getLang = () => {
  try {
    return localStorageGetItem("lang") || null;
  } catch (e) {
    return null;
  }
};

export const getDatePickerFormatByLocale = () => {
  return "dd/MM/yyyy";
}

const getCurrentParsedLocaleCode = createSelector(
  state => state.localize,
  localize => {
    const currentLocalCode = find(localize.languages, x => x.active === true)
      .code;
    return size(currentLocalCode) === 2
      ? currentLocalCode.toLowerCase()
      : split(currentLocalCode, "-")[0].toLowerCase();
  }
);

const getCurrentLocaleCode = createSelector(
  state => state.localize,
  localize => {
    return find(localize.languages, x => x.active === true).code;
  }
);

const mapStateToProps = state => {
  return {
    translate: getTranslate(state.localize),
    availableLanguages: map(getLanguages(state.localize), l => l.code),
    currentLocaleCode: getCurrentLocaleCode(state),
    currentParsedLocaleCode: getCurrentParsedLocaleCode(state),
    isLoading: state.localize.isLoading ?? false,
    loadedLocales: state.localize.loadedLocales ?? [],
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    initLocalization: async (locale, requireFn) => {
      dispatch({ type: "LOADING_TRANSLATION_FILE_INIT" });
      const data = await requireFn(locale);
      dispatch(addTranslationForLanguage(data, `${locale}`));
      dispatch({ type: "LOADING_TRANSLATION_FILE_DONE", payload: { locale } });
    },
    changeActiveLanguage: langCode => {
      dispatch(setActiveLanguage(langCode));
      setLang(langCode);
    },
  };
};

export function withLocalization(WrappedComponent, requireFn) {
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    class extends React.Component {
      constructor() {
        super();
        this.reloadTranslation = debounce(this.reloadTranslationImpl, 100);
      }

      componentDidMount() {
        this.reloadTranslation();
      }

      componentDidUpdate(prevProps) {
        const { currentLocaleCode } = this.props;
        if (currentLocaleCode !== prevProps.currentLocaleCode) {
          this.reloadTranslation();
        }
      }

      async reloadTranslationImpl(langCode) {
        const { isLoading, currentLocaleCode, loadedLocales } = this.props;
        if (!isLoading && !loadedLocales.includes(currentLocaleCode)) {
          await this.props.initLocalization(
            langCode ?? this.props.currentLocaleCode,
            requireFn
          );
        }
      }

      render() {
        return (
          <WrappedComponent
            {...this.props}
            changeActiveLanguage={this.props.changeActiveLanguage}
            initLocalization={langCode => this.reloadTranslation(langCode)}
          />
        );
      }
    }
  );
}
