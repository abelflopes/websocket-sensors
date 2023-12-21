import React, { type HTMLAttributes } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";
import { TbAccessPointOff } from "react-icons/tb";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {}

export const EmptyState = ({
  children,
  className,
  ...otherProps
}: EmptyStateProps): React.ReactElement => {
  return (
    <div className={classNames(className, styles.root)} {...otherProps}>
      <TbAccessPointOff className={styles.icon} />
      <span>{children}</span>
    </div>
  );
};
