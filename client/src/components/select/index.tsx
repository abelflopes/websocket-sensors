import React, { type SelectHTMLAttributes } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";

export interface SelectProps<T extends string>
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  value: T;
  options: Array<{
    value: T;
    text?: string;
  }>;
  onChange: (value: T) => void;
}

export const Select = <T extends string>({
  value,
  options,
  className,
  onChange,
  ...otherProps
}: SelectProps<T>): React.ReactElement => {
  return (
    <select
      value={value}
      className={classNames(className, styles.root)}
      {...otherProps}
      onChange={(e) => {
        onChange(e.currentTarget.value as T);
      }}>
      {options.map(({ value, text }) => (
        <option key={value} value={value}>
          {text ?? value}
        </option>
      ))}
    </select>
  );
};
