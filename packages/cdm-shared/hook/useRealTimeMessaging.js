import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useCallback } from "react";
import { HubConnectionBuilder, LogLevel, HttpTransportType } from "@microsoft/signalr";
import indexOf from "lodash/indexOf";
import slice from "lodash/slice";
import map from "lodash/map";
import { localStorageGetItem } from "../utils/localStorage";

// todo handle list of callbacks: onMessageReceived

// instance = {
//   callbacks: [message => {}],
//   connection: HubConnectionSignalR
// }
const _instances = {};

const __connectionSingleton = {
  getInstance: t => _instances[t] || null,
  setInstance: (t, c) => {
    if (__connectionSingleton.getInstance(t) === null)
      _instances[t] = { connection: c, callbacks: [] };
  },
  addCallback: (t, callback) => {
    const inst = __connectionSingleton.getInstance(t);
    inst.callbacks = [...inst.callbacks, callback];
  },
  removeCallback: (t, callback) => {
    const inst = __connectionSingleton.getInstance(t);
    if (!inst) return;
    const idx = indexOf(inst.callbacks, callback);
    if (idx === -1) return;
    inst.callbacks = [
      ...slice(inst.callbacks, 0, idx),
      ...slice(inst.callbacks, idx + 1)
    ];
  },
  getCallbacks: t => {
    const inst = __connectionSingleton.getInstance(t);
    return inst.callbacks;
  }
};

function useRealTimeMessaging(hubUrl, onMessageReceived, initMessages) {
  // keep in a ref to make mutable
  const connection = useRef(__connectionSingleton);
  const messages = useSelector(state => state.message);
  const dispatch = useDispatch();

  const clearMessage = useCallback(
    messageId =>
      dispatch({
        type: "CDM_MESSAGE_REMOVE",
        key: "messageId",
        value: messageId
      }),
    []
  );

  // initialize signalR connection with Hub
  useEffect(() => {
    const token = localStorageGetItem("token");
    if (!token) return;

    let instance = connection.current.getInstance(token);
    if (hubUrl && instance === null) {
      instance = new HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => token,
          transport: HttpTransportType.LongPolling,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      connection.current.setInstance(token, instance);

      instance.on("receiveMessage", message => {
        dispatch({ type: "CDM_MESSAGE_RECEIVED", message });
        const callbacks = connection.current.getCallbacks(token);
        map(callbacks, c => c(message));
      });

      instance
        .start()
        .then(() => {
          console.log("connected");
        })
        .catch(e => {
          console.error("unable to create signalR client", e);
        });

      if (initMessages) {
        initMessages().then(m => {
          dispatch({ type: "CDM_MESSAGES_RECEIVED", messages: m });
        });
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorageGetItem("token");
    if (!token) return;

    if (onMessageReceived) {
      connection.current.addCallback(token, onMessageReceived);
    }

    return () => {
      if (onMessageReceived) {
        connection.current.removeCallback(token, onMessageReceived);
      }
    };
  }, [onMessageReceived]);

  return [messages, clearMessage];
}

export default useRealTimeMessaging;
