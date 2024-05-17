import { useEffect, useRef, useCallback } from "react";

function useInterval(callback, delay) {
  const savedCallback = useRef();
  const idInterval = useRef();

  // clear int
  const clearInt = useCallback(
    () => idInterval && idInterval.current && clearInterval(idInterval.current),
    []
  );

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      idInterval.current = setInterval(tick, delay);
      return () => clearInt();
    }
  }, [delay, clearInt]);

  return clearInt;
}

export default useInterval;
