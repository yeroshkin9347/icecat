import React, { useState, createContext, useContext } from "react";

const UpdateEnrichmentQueueContext = createContext({
  addToUpdateQueue: () => {},
  runEnrichmentUpdateQueue: () => {},
});

export const UpdateEnrichmentQueueProvider = ({ children }) => {
  const [updateQueue, setUpdateQueue] = useState([]);
  const [needsUpdate, setNeedsUpdate] = useState(false);

  const addToUpdateQueue = (payload, endpoint) => {
    setUpdateQueue((prevQueue) => [...prevQueue, { payload, endpoint }]);
  };

  const runEnrichmentUpdateQueue = () => {
    updateQueue.forEach(({ payload, endpoint }) => {
      endpoint(payload);
    });

    setNeedsUpdate(true);
    setUpdateQueue([]);
  };

  return (
    <UpdateEnrichmentQueueContext.Provider
      value={{
        needsUpdate: needsUpdate,
        setNeedsUpdate: setNeedsUpdate,
        addToUpdateQueue: addToUpdateQueue,
        runEnrichmentUpdateQueue: runEnrichmentUpdateQueue,
      }}
    >
      {children}
    </UpdateEnrichmentQueueContext.Provider>
  );
};

export const useEnrichmentUpdate = () => {
  const context = useContext(UpdateEnrichmentQueueContext);
  return context;
};

export const withEnrichmentUpdateContext = (WrappedComponent) => (props) =>
  (
    <UpdateEnrichmentQueueContext.Consumer>
      {(store) => <WrappedComponent {...props} {...store} />}
    </UpdateEnrichmentQueueContext.Consumer>
  );
