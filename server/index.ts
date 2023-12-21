import * as rxjs from "rxjs";
import * as operators from "rxjs/operators";
import ws from "ws";

const UPDATE_INTERVAL_MS = 100;
const PORT = 5000;

export interface Sensor {
  id: string;
  name: string;
  connected: boolean;
  unit: string;
  value: string | null;
}

interface SensorCommand {
  command: "connect" | "disconnect";
  id: string;
}

const sensors: Sensor[] = [
  { id: "0", name: "Temperature", connected: !1, unit: "°C", value: "15" },
  { id: "1", name: "Pressure", connected: !1, unit: "kPa", value: "101.325" },
  { id: "2", name: "Humidity", connected: !1, unit: "%", value: "45" },
  { id: "3", name: "PM2.5", connected: !1, unit: "PM2.5", value: "50" },
  { id: "4", name: "PM10", connected: !1, unit: "PM10", value: "43" },
  { id: "5", name: "Wind", connected: !1, unit: "m/s", value: "7" },
];

function isSensorCommand(data: unknown): data is SensorCommand {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "command" in data
  );
}

const generateSensor = (data: Sensor): Sensor => ({
  ...data,
  connected: isSensorConnected(data.id),
  value: isSensorConnected(data.id)
    ? (Math.random() + Number(data.value)).toFixed(3).toString()
    : null,
});

let connectedSensors: Sensor["id"][] = [];

const isSensorConnected = function (id: Sensor["id"]): boolean {
  return connectedSensors.includes(id);
};

let initialized = false;

const wss = new ws.Server({ port: PORT });

wss.on("connection", function (ws) {
  ws.on("message", (rawData) => {
    const data = JSON.parse(rawData.toString());

    console.log("Client -> Server: ", data);

    if (
      isSensorCommand(data) &&
      data.command === "connect" &&
      !isSensorConnected(data.id)
    ) {
      connectedSensors.push(data.id);
    }

    if (
      isSensorCommand(data) &&
      data.command === "disconnect" &&
      isSensorConnected(data.id)
    ) {
      connectedSensors = connectedSensors.filter((id) => id !== data.id);

      const sensorToUpdate = sensors.find((e) => e.id === data.id);

      if (sensorToUpdate)
        ws.send(JSON.stringify(generateSensor(sensorToUpdate)));
    }
  });

  sensors.forEach((sensor) => {
    ws.send(JSON.stringify(generateSensor(sensor)));
  });

  if (initialized) return;

  new rxjs.Observable((subscriber) => {
    const interval = setInterval(() => {
      sensors.forEach((i) => {
        subscriber.next(generateSensor(i));
      });
    }, UPDATE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  })
    .pipe(
      operators.concatMap((e) =>
        rxjs.of(e).pipe(operators.delay(5 + 5 * Math.random()))
      )
    )
    .subscribe(
      (n) =>
        isSensorConnected((n as Sensor).id) &&
        wss.clients.forEach((e) => {
          e.send(JSON.stringify(n));
        })
    );

  initialized = true;
});

console.log("Server started on: ws://localhost:" + PORT);
