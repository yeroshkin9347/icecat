import React, {createContext, useContext} from "react";
import get from "lodash/get";
import { ALLOWED_GROUPS, KEYED_PROPERTIES_GROUPS } from "../manager";
import { paramObject, updateUrl } from "cdm-shared/utils/url";

const DEFAULT_GROUP = "MARKETING";

const Context = createContext({
  groupSelected: null,
  currentGroupKey: null,
  setGroupSelected: () => {},
  getGroupSelectedIndex: () => {}
});

export default class PropertyGroupProvider extends React.Component {
  state = {
    groupSelected: DEFAULT_GROUP,
    currentGroupKey: get(KEYED_PROPERTIES_GROUPS, DEFAULT_GROUP, null),
    setGroupSelected: groupSelected => {
    const urlFilters = paramObject();
      updateUrl({
        ...urlFilters,
        groupSelected: groupSelected
      });
      return this.setState({
        groupSelected,
        currentGroupKey: get(KEYED_PROPERTIES_GROUPS, groupSelected, null)
      });
    },
    setCurrentGroupKey: groupKey =>
      this.setState({
        currentGroupKey: groupKey
      }),
    getGroupSelectedIndex: () =>
      get(ALLOWED_GROUPS, `${this.state.groupSelected}`, null)
  };

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const usePropertyGroupContext = () => {
  const context = useContext(Context);

  if (!context) throw new Error('usePropertyGroupContext must be use inside PropertyGroupProvider');

  return context;
};

export const withGroupLocalContext = WrappedComponent => props => (
  <Context.Consumer>
    {store => <WrappedComponent {...props} {...store} />}
  </Context.Consumer>
);
