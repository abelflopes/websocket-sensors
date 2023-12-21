import { type ConnectServerOptions } from "./types";
import { isSensorData } from "./utils";

// Create WebSocket connection.
let socket: WebSocket | undefined;

let eventHandlers: Array<{
  [key in keyof Partial<WebSocketEventMap>]: (event: WebSocketEventMap[key]) => void;
}> = [];

const registerEventHandler = <T extends keyof WebSocketEventMap>(
  name: T,
  handler: (event: WebSocketEventMap[T]) => void,
): void => {
  if (socket === undefined) throw new Error("Not connected to server");

  socket.addEventListener(name, handler);
  eventHandlers.push({
    [name]: handler,
  });
};

// eslint-disable-next-line @typescript-eslint/promise-function-async
export const connectServer = (options?: ConnectServerOptions): Promise<void> => {
  if (socket !== undefined) throw new Error("Already connected to server");

  return new Promise<void>((resolve, reject) => {
    socket = new WebSocket("ws://localhost:5000");

    registerEventHandler("open", () => {
      options?.onConnect?.();
      resolve();
    });

    registerEventHandler("error", () => {
      reject(new Error("Server connection failed"));
    });

    registerEventHandler("message", (event) => {
      const parsedData = JSON.parse(event.data);

      if (isSensorData(parsedData)) {
        options?.onSensorData?.(parsedData);
      }
    });
  });
};

export const disconnectServer = (): void => {
  if (socket === undefined) throw new Error("Not connected to server");

  eventHandlers
    .flatMap((i) => Object.entries(i))
    .forEach(([name, handler]) => {
      socket?.removeEventListener(name, handler as EventListenerOrEventListenerObject);
    });
  eventHandlers = [];

  socket.close();
  socket = undefined;
};

export const connectSensor = (id: string): void => {
  if (socket === undefined) throw new Error("Not connected to server");
  socket.send(JSON.stringify({ command: "connect", id }));
};

export const disconnectSensor = (id: string): void => {
  if (socket === undefined) throw new Error("Not connected to server");
  socket.send(JSON.stringify({ command: "disconnect", id }));
};
