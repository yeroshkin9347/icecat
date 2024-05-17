import React, {createContext, useContext} from "react";

const Context = createContext({
  platform: [],
  isFetchingPlatform: false,
  setPlatform: () => [],
  resetPlatform: () => {},
  setFetchingPlatform: (isFetching) => {},
});

export default class PlatformProvider extends React.Component {
  state = {
    platform: {}, // Platform indexed by id
    isFetchingPlatform: false,
    setPlatform: (platform) => this.setState({ platform }),
    resetPlatform: () => this.setState({ Platform: [] }),
    setFetchingPlatform: (isFetching) =>
      this.setState({ isFetchingPlatform: isFetching }),
  };

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const usePlatformContext = () => {
  const context = useContext(Context);

  if (!context) throw new Error('usePlatformContext must be use inside PlatformProvider');

  return context;
};

export const withPlatformLocalContext = (WrappedComponent) => (props) =>
  (
    <Context.Consumer>
      {(store) => <WrappedComponent {...props} {...store} />}
    </Context.Consumer>
  );
