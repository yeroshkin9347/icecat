import { withLocalization as withSharedLocalization } from "cdm-shared/redux/localization";

const requireFn = (locale) =>
  require(`${"../../../i18n"}/${locale}`);

const withLocalization = (WrappedComponent) =>
  withSharedLocalization(WrappedComponent, requireFn);

// const withLocalization = withSharedLocalization;

export { withLocalization };
