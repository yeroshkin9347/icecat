import React, {createContext, useContext} from 'react'

const Context = createContext ({
    tradeItemProperties: [],
    isFetchingTradeItemProperties: false,
    setTradeItemProperties: () => {},
    resetTradeItemProperties: () => {},
    setFetchingTradeItemProperties: isFetching => {},
    isFetchingTradeItemPropertyFamilies: false,
    setFetchingTradeItemPropertyFamilies: () => {},
    calculatedValue:{},
    setCalculatedValue: () => {},
    valuechanged: {},
    SetValueChanged: () => {},
    compositionValue:{},
    setCompositionValue: () => {},
    cachedValuesGroup: {},
    setCachedValuesGroup: () => {},
    addCachedValuesGroup: () => {},
})

export default class TradeItemPropertiesProvider extends React.Component {

    state = {
        tradeItemProperties: {}, // properties indexed by code
        isFetchingTradeItemProperties: false,
        setTradeItemProperties: tradeItemProperties => this.setState({ tradeItemProperties }),
        resetTradeItemProperties: () => this.setState({ tradeItemProperties: [] }),
        setFetchingTradeItemProperties: isFetching => this.setState({ isFetchingTradeItemProperties: isFetching }),
        isFetchingTradeItemPropertyFamilies: false,
        setFetchingTradeItemPropertyFamilies: isFetching => this.setState({ isFetchingTradeItemPropertyFamilies: isFetching }),
        calculatedValue:{},
        setCalculatedValue: (calculatedValue) => this.setState ({calculatedValue:calculatedValue}),
        valuechanged: {},
        SetValueChanged: (value) => this.setState({valuechanged:value}),
        compositionValue:{},
        setCompositionValue: (compositionValue) => this.setState ({compositionValue:compositionValue}),
        cachedValuesGroup: {},
        setCachedValuesGroup: (cachedValuesGroup) => this.setState({cachedValuesGroup:cachedValuesGroup}),
        addCachedValuesGroup: (newValuesGroup) => this.setState((prev) => ({
            cachedValuesGroup: {
                ...prev.cachedValuesGroup,
                ...newValuesGroup,
            },
        })),
    }

    render() {
        return (
            <Context.Provider value={this.state}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

export const useTradeItemPropertiesContext = () => {
    const context = useContext(Context);

    if (!context) throw new Error('useTradeItemPropertiesContext must be use inside TradeItemPropertiesProvider');

    return context;
};

export const withTradeItemPropertiesLocalContext = WrappedComponent => props => (
    <Context.Consumer>
        { store => <WrappedComponent {...props} {...store} />}
    </Context.Consumer>
)
