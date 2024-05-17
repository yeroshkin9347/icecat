const useDebounceState = ({ onValueChange, defaultValue }) => {
  const [value, setValue] = useState(defaultValue);
  const [valueDebounced, setValueDebounced] = useState(defaultValue);

  useEffect(() => {
    initRef.current && onValueChange(valueDebounced);
  }, [onValueChange, valueDebounced]);

  useEffect(() => {
    let timeout = null;

    initRef.current = true;

    timeout = setTimeout(() => {
      setValueDebounced(value);
    }, 500);

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [value]);

  return [value, valueDebounced, setValue];
};

export default useDebounceState;
