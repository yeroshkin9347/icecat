import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Input} from "cdm-ui-components";
import styled from "styled-components";
import isNil from "lodash/isNil";
import debounceFn from "lodash/debounce";

const NumberInputWrapper = styled.div`
  position: relative;

  input[type=number] {
    border: ${props => (props.error ? '1px solid #ff4c52 !important' : '0')};
    box-shadow: ${props => (props.error ? 'none' : 'var(--input-box-shadow)')};
    -moz-appearance: textfield;
  }

  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  .action {
    position: absolute;
    top: 0;
    right: 0;
    padding: 1px;
    display: flex;
    align-items: center;
    height: 100%;
    
    button {
      height: 100%;
      aspect-ratio: 1 / 1;
      outline: none;
      border: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5em;
      border-radius: 0;
      color: #0008;
      background: transparent;
      transition: all ease-in-out 0.2s;
      
      &:not(:disabled):hover {
        color: black;
        background: #0001;
      }
      
      &:disabled {
        opacity: 0.6;
      }
    }
    
    .divider {
      height: 60%;
      border-left: 1px solid #0001;
      transition: all ease-in-out 0.2s;
    }
    
    &:hover {
      .divider {
        opacity: 0;
      }
    }
  }
`;

const NumberInput = ({
  min,
  max,
  step = 1,
  value,
  validate,
  autoAdjust,
  debounce,
  onChange,
  ...inputProps
}) => {
  const [val, setVal] = useState(value);

  useEffect(() => {
    setVal(value);
  }, [value]);

  const isValid = useCallback((value) => {
    if (!validate || typeof value !== 'number') {
      return true;
    }
    if (!isNil(min) && value < min) {
      return false;
    }
    if (!isNil(max) && value > max) {
      return false;
    }
    return true;
  }, [validate, min, max]);

  const onValueChange = useMemo(() => {
    if (!onChange) {
      return () => {};
    }
    if (!debounce) {
      return onChange;
    }
    return debounceFn(onChange, debounce)
  }, [debounce, onChange]);

  const adjustValue = (value) => {
    if (typeof value !== 'number' && !value) {
      return value;
    }
    value = Number(value);
    if (!isNil(min) && value < min) {
      value = min;
    }
    if (!isNil(max) && value > max) {
      value = max;
    }
    return value;
  }

  const onDecrease = () => {
    const newValue = adjustValue((Number(val) || 0) - step);
    setVal(newValue);
    onValueChange(newValue);
  };

  const onIncrease = () => {
    const newValue = adjustValue((Number(val) || 0) + step);
    setVal(newValue);
    onValueChange(newValue);
  };

  const onInputChange = (e) => {
    let value = e.target.value;
    if (value) {
      value = Number(value) ?? value;
    }
    setVal(value);
    onValueChange(value);
  };

  const adjustCurrentValue = () => {
    if (autoAdjust) {
      const value = adjustValue(val);
      if (value !== val) {
        setVal(value);
        onValueChange(value);
      }
    }
  };

  const onBlur = () => {
    adjustCurrentValue();
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      adjustCurrentValue();
    }
  };

  return (
    <NumberInputWrapper error={!isValid(val)}>
      <Input
        type="number"
        block
        min={min}
        max={max}
        step={step}
        value={val ?? ''}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onChange={onInputChange} {...inputProps}
      />

      <div className="action">
        <button disabled={!isNil(min) && min >= (Number(val) || 0)} onClick={onDecrease}>-</button>
        <div className="divider"/>
        <button disabled={!isNil(max) && max <= (Number(val) || 0)} onClick={onIncrease}>+</button>
      </div>
    </NumberInputWrapper>
  );
};

export default NumberInput;
