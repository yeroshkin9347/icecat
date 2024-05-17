import React, { useState, useEffect } from "react";
import get from 'lodash/get'
import filter from 'lodash/filter'
import { isPropertyMultiple } from '../manager';
import MultipleValuesManager from './MultipleValuesManager';
import { useDebounce } from "./useDebounce";
import { TextField } from "@mui/material";
import classNames from "classnames";

const TextProperty = ({
  className,
  property,
  value,
  disabled,
  debounceTime = 1000,
  // functions
  onChange
}) => {
  const [title, setTitle] = useState(value);
	const debouncedTitleValue = useDebounce(title, debounceTime);
	const handleChange = (value) => {
		onChange(value);
	};

	useEffect(() => {
		if (debouncedTitleValue !== value) {
			handleChange(debouncedTitleValue);
		}
	}, [debouncedTitleValue]);

  return isPropertyMultiple(property) ? (
    <MultipleValuesManager
      name={get(property, 'code')}
      values={value}
      onRemove={(val, index) => onChange(filter(value, (o, k) => k !== index))}
      onAdd={newVal => newVal !== null && onChange([...(value || []), newVal])}
      onUpdateValueAt={(val, index) => {
        const newValues = [...(value || [])];
			  newValues[index] = val;
        onChange(newValues)
      }}
      Editor={({val, onChangeLocal, add, cancel, focus, internalRef}) => (
        <input
          className={classNames("form-field", className)}
          type="text"
          disabled={disabled}
          ref={internalRef}
          value={val === null ? '' : val}
          onChange={e => onChangeLocal(e.target.value)}
          onKeyDown={event => {
            if(event.key === 'Enter' && val !== null) {
              add(true)
              event.preventDefault()
              event.stopPropagation()
              focus()
            } else if(event.key === 'Escape') {
              cancel()
              event.preventDefault()
              event.stopPropagation()
              focus()
            }
          }}
        />
      )}
    />
  ) : (
    <TextField
      className={classNames("form-field", className)}
      type="text"
      size="small"
      value={title === null ? "" : title}
      disabled={disabled}
      onChange={(e) => setTitle(e.target.value)}
    />
  );
};

export default TextProperty;
