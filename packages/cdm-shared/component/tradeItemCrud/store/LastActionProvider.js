import React, { createContext } from "react";
import get from "lodash/get";
import map from "lodash/map";
import find from "lodash/find";
import filter from "lodash/filter";
import isEmpty from "lodash/isEmpty";
import { getAuditTradeItemPersisted } from "cdm-shared/services/audit";
import { getMultipleUsers } from "cdm-shared/services/user";

const createLastAction = (
  firstName,
  lastName,
  timestamp,
  lastLoginTimestamp
) => {
  return {
    firstName,
    lastName,
    timestamp,
    lastLoginTimestamp
  };
};

const findParamValue = (key, params) =>
  get(
    find(params, param => get(param, "key") === key),
    "value"
  );

const Context = createContext({
  lastActions: [],
  isFetchingLastActions: false,
  setLastActions: () => {},
  resetLastActions: () => {},
  setFetchingLastActions: isFetching => {}
});

export default class LastActionProvider extends React.Component {
  state = {
    lastActions: [],
    isFetchingLastActions: false,
    setLastActions: lastActions => this.setState({ lastActions }),
    resetLastActions: () => this.setState({ lastActions: [] }),
    setFetchingLastActions: isFetching =>
      this.setState({ isFetchingLastActions: isFetching }),
    refreshLastActions: tradeItemId => {
      this.state.setFetchingLastActions(true);
      getAuditTradeItemPersisted(tradeItemId, 0, 10).then(res => {
        const values = get(res, "data", []);
        const userIds = filter(
          map(values, (v, k) =>
            findParamValue("userId", get(v, "parameters", []))
          )
        );

        const prom = isEmpty(userIds)
          ? Promise.resolve([])
          : getMultipleUsers(userIds).then(res => get(res, "data", []));

        prom.then(users => {
          const lastActions = map(values, (v, k) => {
            const userId = findParamValue("userId", get(v, "parameters", []));
            const user = find(users, u => get(u, "id") === userId);

            return user === null
              ? createLastAction(null, null, get(v, "timestamp"), null)
              : createLastAction(
                  get(user, "firstname"),
                  get(user, "lastname"),
                  get(v, "timestamp"),
                  get(user, "lastLoginTimestamp")
                );
          });

          this.state.setLastActions(lastActions);
          this.state.setFetchingLastActions(false);
        });
      });
    }
  };

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const withLastActionsLocalContext = WrappedComponent => props => (
  <Context.Consumer>
    {store => <WrappedComponent {...props} {...store} />}
  </Context.Consumer>
);
