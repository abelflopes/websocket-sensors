import React, { useMemo, type HTMLAttributes } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";
import { LineChart, XAxis, Line, ResponsiveContainer, YAxis, Legend } from "recharts";

const RESERVED_X_AXIS_KEY = "__x";

const colors = [...Array.from(Array(6)).keys()].map((i) => `var(--color-info-${i + 1})`);

export interface ChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  series: Array<{
    name: string;
    color?: number;
    data: Record<string | number, string | number>;
  }>;
  legend?: boolean;
  xAxis?: boolean;
  height?: number;
}

export const Chart = ({
  height = 250,
  series,
  xAxis,
  legend,
  className,
  ...otherProps
}: Readonly<ChartProps>): React.ReactElement => {
  const computedData = useMemo<Array<Record<string, string | number>>>(() => {
    let data: Array<Record<string, string | number>> = [];

    // Structure date into format expected by rechart
    series.forEach(({ name: seriesName, data: seriesData }) => {
      Object.entries(seriesData).forEach(([dataKey, dataValue]) => {
        const existingNode = data.find((data) => data[RESERVED_X_AXIS_KEY] === Number(dataKey));

        if (existingNode !== undefined) {
          data = data.map((i) => {
            if (i[RESERVED_X_AXIS_KEY] === existingNode[RESERVED_X_AXIS_KEY]) {
              return {
                ...existingNode,
                [seriesName]: dataValue,
              };
            } else {
              return i;
            }
          });
        } else {
          data.push({
            [RESERVED_X_AXIS_KEY]: Number(dataKey),
            [seriesName]: dataValue,
          });
        }
      });
    });

    return data.sort((a, b) =>
      a[RESERVED_X_AXIS_KEY] > b[RESERVED_X_AXIS_KEY]
        ? 1
        : a[RESERVED_X_AXIS_KEY] < b[RESERVED_X_AXIS_KEY]
          ? -1
          : 0,
    );
  }, [series]);

  const [yMin, yMax] = useMemo(() => {
    const allValues = Object.values(computedData)
      .map((i) =>
        Object.entries(i)
          .filter(([k]) => k !== RESERVED_X_AXIS_KEY)
          .map((i) => i[1]),
      )
      .flat()
      .map((i) => Number(i))
      .filter((i) => !isNaN(i));

    const min = Math.min(...allValues);
    const max = Math.max(...allValues);

    const margin = Math.abs(max - min) * 0.1;

    return [Math.max(0, Math.floor(min - margin)), Math.ceil(max + margin)];
  }, [computedData]);

  return (
    <div className={classNames(className, styles.root)} {...otherProps}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={computedData}>
          <YAxis
            width={30}
            type="number"
            domain={[yMin, yMax]}
            tick={{
              fontFamily: "inherit",
              fontSize: "var(--font-size-small)",
              fill: "var(--color-faded-text)",
            }}
            stroke="var(--color-faded-text)"
            tickFormatter={(value) => Math.round(Number(value)).toString()}
            style={{
              marginLeft: -100,
            }}
          />

          {legend !== undefined && <Legend wrapperStyle={{ fontSize: ".9em" }} />}

          {xAxis !== undefined && (
            <XAxis
              minTickGap={100}
              dataKey={RESERVED_X_AXIS_KEY}
              tickFormatter={(i) => new Date(Number(i)).toLocaleTimeString()}
              tick={{
                fontFamily: "inherit",
                fontSize: "var(--font-size-small)",
                fill: "var(--color-faded-text)",
              }}
              stroke="var(--color-faded-text)"
            />
          )}

          {series
            .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
            .map(({ name, color }, k) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={colors[(color ?? k + 1) % colors.length]}
                dot={<React.Fragment />}
                isAnimationActive={false}
                strokeWidth={2}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
