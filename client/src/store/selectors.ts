import { type RootState } from "@store/index";

const ROUND_VALUE = 100; // round values to 2 decimals

export const selectChartData = ({ history }: RootState): Record<string, Record<string, number>> =>
  Object.entries(history)
    .map(([timestamp, series]) =>
      Object.entries(series).map(([sk, sv]) => ({
        serie: sk,
        x: Number(timestamp),
        value: sv.reduce((a, b) => a + b, 0) / sv.length,
      })),
    )
    .flat()
    .reduce<Record<string, Record<string, number>>>((prev, { x, serie, value }) => {
      const serieData = prev[serie] ?? {};
      serieData[x] = Math.round(value * ROUND_VALUE) / ROUND_VALUE;

      return {
        ...prev,
        [serie]: serieData,
      };
    }, {});
