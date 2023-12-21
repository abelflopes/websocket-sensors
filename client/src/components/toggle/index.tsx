import React, { useId } from "react";
import styles from "./index.module.scss";

export interface ToggleProps {
  children?: React.ReactNode;
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export const Toggle = ({
  children,
  value,
  onChange,
}: Readonly<ToggleProps>): React.ReactElement => {
  const computedId = useId();

  return (
    <>
      <input
        id={computedId}
        type="checkbox"
        checked={value}
        className={styles.input}
        onChange={(e) => {
          onChange?.(e.currentTarget.checked);
        }}
      />
      <label htmlFor={computedId} className={styles.label}>
        {children}
      </label>
    </>
  );
};
