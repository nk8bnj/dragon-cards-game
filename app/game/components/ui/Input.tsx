"use client";

import { ChangeEvent, InputHTMLAttributes, memo, useCallback, useEffect, useState } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  min: number;
  max: number;
  value: number;
  maxDecimals: number;
  onValueChange: (value: number) => void;
  getValueOnBlur?: (parsedValue: number, min: number, max: number) => number;
}

const Input = ({
  value,
  min,
  max,
  maxDecimals,
  onValueChange,
  getValueOnBlur,
  ...props
}: InputProps) => {
  const [displayedValue, setDisplayedValue] = useState<string>(value.toString());

  useEffect(() => {
    const displayValueNumber = Number(displayedValue);
    if (!isNaN(displayValueNumber) && value !== displayValueNumber) {
      setDisplayedValue(value.toFixed(maxDecimals));
    }
  }, [displayedValue, maxDecimals, value]);

  const normalizeDisplayValue = useCallback(
    (val: string) => {
      const numberValue = Number.parseFloat(val);
      const validValue = numberValue > max ? max : val;
      return validValue.toString();
    },
    [max],
  );

  const isValidFirstCharacter = useCallback((val: string) => {
    return (val.length > 1 && val[0] === "0" && val[1] !== ".") === false;
  }, []);

  const onInputValueChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const regex = new RegExp(`^-?\\d*\\.?\\d{0,${maxDecimals}}$`);

      let { value: inputValue } = event.target;
      if (!isValidFirstCharacter(inputValue)) inputValue = inputValue.slice(1);
      if (regex.test(inputValue)) {
        const normalizedValue = normalizeDisplayValue(inputValue);
        const parsedValue = Number(normalizedValue);
        setDisplayedValue(normalizedValue);
        if (!isNaN(parsedValue)) {
          onValueChange(parsedValue);
        }
      }
    },
    [isValidFirstCharacter, maxDecimals, normalizeDisplayValue, onValueChange],
  );

  const onBlur = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value: inputValue } = event.target;
      let parsedNumber = Number.parseFloat(inputValue);
      parsedNumber = getValueOnBlur
        ? getValueOnBlur(parsedNumber, min, max)
        : isNaN(parsedNumber)
          ? min
          : parsedNumber;
      const valueOnBlur = parsedNumber < min ? min : value > max ? max : parsedNumber;
      onValueChange(valueOnBlur);
      setDisplayedValue(valueOnBlur.toFixed(maxDecimals));
    },
    [getValueOnBlur, max, maxDecimals, min, onValueChange, value],
  );

  return (
    <input
      placeholder={Number(0).toFixed(maxDecimals)}
      value={displayedValue}
      min={min}
      max={max}
      autoComplete="off"
      onChange={onInputValueChange}
      onBlur={onBlur}
      {...props}
    />
  );
};

export default memo(Input);

