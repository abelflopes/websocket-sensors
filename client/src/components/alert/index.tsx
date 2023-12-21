import React, { type HTMLAttributes } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {}

export const Alert = ({ className, ...otherProps }: AlertProps): React.ReactElement => {
  return <div className={classNames(className, styles.root)} {...otherProps} />;
};
