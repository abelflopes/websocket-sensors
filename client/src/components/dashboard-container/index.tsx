import React, { type HTMLAttributes } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";

export interface DashboardContainerProps extends HTMLAttributes<HTMLDivElement> {
  heading: string;
  headerContent?: React.ReactNode;
}

export const DashboardContainer = ({
  heading,
  className,
  children,
  headerContent,
  ...otherProps
}: Readonly<DashboardContainerProps>): React.ReactElement => (
  <div className={classNames(className, styles.root)} {...otherProps}>
    <header className={styles.header}>
      <h1 className={styles.heading}>{heading}</h1>
      {headerContent}
    </header>
    <main className={styles.content}>{children}</main>
  </div>
);
