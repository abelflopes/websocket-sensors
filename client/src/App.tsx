import React, { useEffect, useMemo, useState } from "react";
import { Store } from "@store/index";
import { DashboardContainer } from "@components/dashboard-container";
import { DashboardItem } from "@components/dashboard-item";
import { SensorCard } from "@components/sensor-card";
import { Chart } from "@components/chart";
import { selectChartData } from "@store/selectors";
import { Select } from "@components/select";
import { Button } from "@components/button";
import { EmptyState } from "@components/empty-state";
import { Alert } from "@components/alert";

export const App = (): React.ReactElement => {
  const dispatch = Store.useDispatch();

  const [viewMode, setViewMode] = useState<"all" | "connected">("all");

  const data = Store.useSelector(
    ({ sensors }) =>
      sensors.data !== undefined &&
      Object.values(sensors.data).filter(
        (i) => viewMode === "all" || (viewMode === "connected" && i.connected),
      ),
  );

  const loading = Store.useSelector(({ sensors }) => sensors.loading > 1);
  const error = Store.useSelector(({ sensors }) => sensors.error);
  const chartData = Store.useSelector(selectChartData);

  const filteredChartData = useMemo(
    () =>
      data !== false &&
      data.length > 0 &&
      Object.entries(chartData).filter(([serie]) => data.some((i) => i.name === serie)),
    [chartData, data],
  );

  useEffect(() => {
    void dispatch(Store.actions.sensors.connectServer());

    return () => {
      void dispatch(Store.actions.sensors.disconnectServer());
    };
  }, [dispatch]);

  return (
    <div>
      <DashboardContainer
        heading={"Dashboard"}
        headerContent={
          <>
            <Select
              value={viewMode}
              options={[
                {
                  value: "all",
                  text: "View all",
                },
                {
                  value: "connected",
                  text: "View connected only",
                },
              ]}
              onChange={setViewMode}
            />

            <Button onClick={() => dispatch(Store.actions.history.reset())}>Clear history</Button>
          </>
        }>
        {(data === false || data.length === 0) && (
          <EmptyState>
            {!loading && error === undefined && <>no data to display, please connect sensors</>}
            {loading && error === undefined && <>loading data</>}
            {error !== undefined && <>unable to display data</>}
          </EmptyState>
        )}

        {data !== false &&
          data.map((i, k) => (
            <DashboardItem key={i.id} index={k}>
              <SensorCard data={i}>
                <Chart
                  height={60}
                  series={[
                    {
                      name: i.name,
                      color: k,
                      data: chartData[i.name] ?? {},
                    },
                  ]}
                />
              </SensorCard>
            </DashboardItem>
          ))}

        {data !== false && filteredChartData !== false && filteredChartData.length > 0 && (
          <DashboardItem index={data.length} fullWidth>
            <h2>History</h2>

            <Chart
              xAxis
              legend
              series={filteredChartData.map(([serie, serieData]) => ({
                color: data.findIndex((i) => i.name === serie),
                name: `${serie} (${data.find((i) => i.name === serie)?.unit})`,
                data: serieData,
              }))}
            />
          </DashboardItem>
        )}

        {error !== undefined && <Alert>{error}</Alert>}
      </DashboardContainer>
    </div>
  );
};
