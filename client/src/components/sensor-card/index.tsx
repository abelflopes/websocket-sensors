import React, { useState, type HTMLAttributes, useEffect } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";
import { FaTemperatureLow } from "react-icons/fa6";
import { WiHumidity } from "react-icons/wi";
import { LuGaugeCircle } from "react-icons/lu";
import { DiReact } from "react-icons/di";
import { FiWind } from "react-icons/fi";
import { SiBookmeter } from "react-icons/si";
import { type SensorStateItem } from "@store/modules/sensors";
import { Toggle } from "@components/toggle";
import { Store } from "@store/index";
import { EmptyState } from "@components/empty-state";

const iconsMap = {
  default: () => <SiBookmeter />,
  temp: () => <FaTemperatureLow />,
  humidity: () => <WiHumidity />,
  pressure: () => <LuGaugeCircle />,
  pm: () => <DiReact />,
  wind: () => <FiWind />,
};

export interface SensorCardProps extends HTMLAttributes<HTMLDivElement> {
  data: SensorStateItem;
}

const nameToIcon = (name: string): keyof typeof iconsMap => {
  switch (name) {
    case "Humidity":
      return "humidity";
    case "Wind":
      return "wind";
    case "Temperature":
      return "temp";
    case "Pressure":
      return "pressure";
    case "PM10":
    case "PM2.5":
      return "pm";
    default:
      return "default";
  }
};

export const SensorCard = ({
  data,
  children,
  className,
  ...otherProps
}: Readonly<SensorCardProps>): React.ReactElement => {
  const { name, connected, value, unit, id } = data;
  const dispatch = Store.useDispatch();
  const [shouldConnect, setShouldConnect] = useState(connected);

  useEffect(() => {
    if (shouldConnect === connected) return;

    if (shouldConnect) void dispatch(Store.actions.sensors.connectSensor(id));
    else void dispatch(Store.actions.sensors.disconnectSensor(id));
  }, [connected, dispatch, id, shouldConnect]);

  return (
    <div className={classNames(className, styles.root)} {...otherProps}>
      <div className={styles.header}>
        <span className={styles.icon}>{iconsMap[nameToIcon(name)]()}</span>
        <h2 className={styles.name}>{name}</h2>
        <Toggle value={shouldConnect} onChange={setShouldConnect} />
      </div>

      {connected && (
        <>
          <div className={styles.value_wrapper}>
            <span className={styles.value}>{value ?? "-"}</span>
            <span className={styles.unit}>{unit}</span>
          </div>

          <div className={styles.content}>{children}</div>
        </>
      )}

      {!connected && <EmptyState className={styles.disconnected}>sensor disconnected</EmptyState>}
    </div>
  );
};
