import React, {createContext, useContext} from 'react'

const Context = createContext ({
    valuesGroups: {},
    isFetchingValuesGroups: false,
    setValuesGroups: () => {},
    addValuesGroups: () => {},
    resetValuesGroups: () => {},
    setFetchingValuesGroups: isFetching => {},
    valueGroupWithKey: {},
    saveValueGroupWithKey: () => {}
})

export default class ValuesGroupProvider extends React.Component {

    state = {
        valuesGroups: {}, // indexed by id
        isFetchingValuesGroups: false,
        setValuesGroups: valuesGroups => this.setState({ valuesGroups }),
        addValuesGroups: valuesGroups => this.setState({ valuesGroups: Object.assign({}, this.state.valuesGroups, valuesGroups) }),
        resetValuesGroups: () => this.setState({ valuesGroups: [] }),
        setFetchingValuesGroups: isFetching => this.setState({ isFetchingValuesGroups: isFetching }),
        valueGroupWithKey: {},
        saveValueGroupWithKey: valueGroupWithKey => this.setState({ valueGroupWithKey }),
    }

    render() {
        return (
            <Context.Provider value={this.state}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

export const useValuesGroupContext = () => {
    const context = useContext(Context);

    if (!context) throw new Error('useValuesGroupContext must be use inside ValuesGroupProvider');

    return context;
};

export const withValuesGroupsLocalContext = WrappedComponent => props => (
    <Context.Consumer>
        { store => <WrappedComponent {...props} {...store} />}
    </Context.Consumer>
)
