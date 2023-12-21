import React, { useMemo, type HTMLAttributes } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";

let defaultItemIndex = 0;

export interface DashboardItemProps extends HTMLAttributes<HTMLDivElement> {
  fullWidth?: boolean;
  index?: number;
}

export const DashboardItem = ({
  fullWidth,
  index,
  className,
  onClick,
  ...otherProps
}: Readonly<DashboardItemProps>): React.ReactElement => {
  const computedItemIndex = useMemo(() => index ?? defaultItemIndex++, [index]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      className={classNames(className, styles.root, {
        [styles.clickable]: onClick !== undefined,
        [styles.full_width]: fullWidth,
      })}
      style={{ "--i": computedItemIndex }}
      {...otherProps}
    />
  );
};
