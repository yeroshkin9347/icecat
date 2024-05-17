const numberFormatCached = new Map();

export const prettyNumber = (value, locale) => {
  if (!numberFormatCached.has(locale)) {
    numberFormatCached.set(locale, new Intl.NumberFormat(locale));
  }
  return numberFormatCached.get(locale).format(value);
}
