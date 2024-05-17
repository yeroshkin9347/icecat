import React, {createContext, useContext} from 'react'

const Context = createContext ({
    targetMarkets: {},
    isFetchingTargetMarkets: false,
    setTargetMarkets: () => {},
    resetTargetMarkets: () => {},
    setFetchingTargetMarket: isFetching => {}
})

export default class TargetMarketProvider extends React.Component {

    state = {
        targetMarkets: {}, // properties indexed by code
        isFetchingTargetMarkets: false,
        setTargetMarkets: targetMarkets => this.setState({ targetMarkets }),
        resetTargetMarkets: () => this.setState({ targetMarkets: [] }),
        setFetchingTargetMarkets: isFetching => this.setState({ isFetchingTargetMarkets: isFetching })
    }

    render() {
        return (
            <Context.Provider value={this.state}>
                {this.props.children}
            </Context.Provider>
        )
    }

}

export const useTargetMarketContext = () => {
    const context = useContext(Context);

    if (!context) throw new Error('useTargetMarketContext must be use inside TargetMarketProvider');

    return context;
};

export const withTargetMarketsLocalContext = WrappedComponent => props => (
    <Context.Consumer>
        { store => <WrappedComponent {...props} {...store} />}
    </Context.Consumer>
)
