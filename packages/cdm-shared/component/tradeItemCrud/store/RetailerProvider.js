import React, {createContext, useContext} from 'react'

const Context = createContext ({
    retailers: {},
    isFetchingRetailers: false,
    setRetailers: () => {},
    resetRetailers: () => {},
    setFetchingRetailers: isFetching => {}
})

export default class RetailerProvider extends React.Component {

    state = {
        retailers: {}, // retailers indexed by id
        isFetchingRetailers: false,
        setRetailers: retailers => this.setState({ retailers }),
        resetRetailers: () => this.setState({ retailers: [] }),
        setFetchingRetailers: isFetching => this.setState({ isFetchingRetailers: isFetching })
    }

    render() {
        return (
            <Context.Provider value={this.state}>
                {this.props.children}
            </Context.Provider>
        )
    }

}

export const useRetailerContext = () => {
    const context = useContext(Context);

    if (!context) throw new Error('useRetailerContext must be use inside RetailerProvider');

    return context;
};

export const withRetailersLocalContext = WrappedComponent => props => (
    <Context.Consumer>
        { store => <WrappedComponent {...props} {...store} />}
    </Context.Consumer>
)
