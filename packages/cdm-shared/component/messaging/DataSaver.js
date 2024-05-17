import React, { useEffect } from "react";
import filter from "lodash/filter";
import { useStateValue } from "../../hook/useStateValue";
import { saveState } from "./reducer";
import { isDraftEmpty } from "./utils";

function DataSaver() {
  const [{ user, drafts }, dispatch] = useStateValue();

  useEffect(() => {
    const saveStateDispatch = () => {
      dispatch({ type: "saveState", user });
      return undefined;
    };

    window.addEventListener("beforeunload", saveStateDispatch);
    return () => {
      window.removeEventListener("beforeunload", saveStateDispatch);
      saveState(
        user,
        filter(drafts, d => !isDraftEmpty(d))
      );
    };
  }, [dispatch, user, drafts]);

  return <></>;
}

export default React.memo(DataSaver);
