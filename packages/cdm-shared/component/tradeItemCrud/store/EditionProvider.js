import React, {createContext, useContext} from "react";

const Context = createContext({
  edition: [],
  isFetchingEdition: false,
  setEdition: () => [],
  resetEdition: () => {},
  setFetchingEdition: (isFetching) => {},
});

export default class EditionProvider extends React.Component {
  state = {
    edition: {}, // Edition indexed by id
    isFetchingEdition: false,
    setEdition: (edition) => this.setState({ edition }),
    resetEdition: () => this.setState({ Edition: [] }),
    setFetchingEdition: (isFetching) =>
      this.setState({ isFetchingEdition: isFetching }),
  };

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const useEditionContext = () => {
  const context = useContext(Context);

  if (!context) throw new Error('useEditionContext must be use inside EditionProvider');

  return context;
};

export const withEditionLocalContext = (WrappedComponent) => (props) =>
  (
    <Context.Consumer>
      {(store) => <WrappedComponent {...props} {...store} />}
    </Context.Consumer>
  );
