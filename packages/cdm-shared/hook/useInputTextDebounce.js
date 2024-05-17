import { useEffect, useRef, useState } from "react";

function useInputTextDebounce(initValue = "", delay = 500) {
  const initRef = useRef(false);
  const [searchText, setSearchText] = useState(initValue);
  const [searchTextDebounced, setSearchTextDebounced] = useState(initValue);

  useEffect(() => {
    let timeout = null;
    initRef.current = true;
    if (searchTextDebounced !== searchText) {
      timeout = setTimeout(() => {
        setSearchTextDebounced(searchText);
      }, delay);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [searchText, searchTextDebounced]);

  return [searchText, searchTextDebounced, setSearchText];
}

export default useInputTextDebounce;
