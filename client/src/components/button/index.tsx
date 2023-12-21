import React, { type ButtonHTMLAttributes } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = ({ className, ...otherProps }: ButtonProps): React.ReactElement => {
  return <button className={classNames(className, styles.root)} {...otherProps} />;
};
