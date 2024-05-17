import { useSelector } from "react-redux";
import { useMemo } from "react";
import find from "lodash/find";

function useLocalization() {
  const languages = useSelector(state => state.localize.languages);

  const currentLocaleCode = useMemo(
    () => find(languages, x => x.active === true).code,
    [languages]
  );

  //   return useMemo(() => [currentLocaleCode], [currentLocaleCode]);
  return [currentLocaleCode];
}

export default useLocalization;
