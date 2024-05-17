import React, {createContext, useContext} from "react";
import dotProps from "dot-prop-immutable";
import get from "lodash/get";
import filter from "lodash/filter";

const Context = createContext({
  tradingItemChanged: false,
  changedMediaIds: [],
  tradeItem: {},
  defaultTargetMarketId: null,
  selectedGroupItemIndex: null,
  selectedVariantIndex: null,
  categoryList: null,
  manufacturerList : null,
  isEditable: true,
  isLoadedVariantsInit: false,
  setIsDuplicatingChannel: () => {},
  setCategoryList: () => {},
  setManufacturerList: () => {},
  setEditable: () => {},
  setTradeItem: () => {},
  setTradeItemValue: () => {},
  addTradeItemValue: () => {},
  removeTradeItemValue: () => {},
  resetTradeItem: () => {},
  setSelectedGroupItemIndex: () => {},
  resetSelectedGroupItemIndex: () => {},
  setSelectedVariantIndex: () => {},
  setDefaultTargetMarketId: () => {},
  setIsLoadedVariantsInit: () => {},
});

export default class TradeItemProvider extends React.Component {
  state = {
    tradingItemChanged: false,
    changedMediaIds: [],
    tradeItem: {},
    selectedGroupItemIndex: null,
    selectedVariantIndex: null,
    categoryList: null,
    manufacturerList : null,
    isEditable: true,
    isFetchingTradeItem: false,
    setFetchingTradeItem: isFetching => this.setState({ isFetchingTradeItem: isFetching }),
    isDuplicatingChannel: false,
    setIsDuplicatingChannel: isLoading => this.setState({ isDuplicatingChannel: isLoading }),
    setCategoryList: (categoryList) => this.setState({ categoryList }),
    setManufacturerList: (manufacturerList) => this.setState({ manufacturerList }),
    setEditable: (isEditable) => this.setState({ isEditable }),
    setTradeItem: (tradeItem, callback) =>
      this.setState({ tradeItem, tradingItemChanged: false }, callback || null),
    setTradeItemValue: (key, value) => {
      this.setState({
        tradeItem: dotProps.set(this.state.tradeItem, key, value), tradingItemChanged: true
      });
    },
    addTradeItemValue: (key, value) => {
      this.setState({
        tradeItem: dotProps.set(this.state.tradeItem, key, [
          ...get(this.state.tradeItem, key, []),
          value
        ]),
        tradingItemChanged: true
      });
    },
    removeTradeItemValue: (key, index) => {
      this.setState({
        tradeItem: dotProps.set(
          this.state.tradeItem,
          key,
          filter(get(this.state.tradeItem, key, []), (o, i) => index !== i)
        ),
        tradingItemChanged: true,
        selectedGroupItemIndex: this.state.selectedGroupItemIndex ? this.state.selectedGroupItemIndex - 1 : 0
      });
    },
    setTradeItemChangedValue: (value) => this.setState({ tradingItemChanged: value }),
    resetTradeItem: () => this.setState({ tradeItem: {}, tradingItemChanged: false }),
    setSelectedGroupItemIndex: selectedGroupItemIndex => {
      return this.setState({ selectedGroupItemIndex, selectedVariantIndex: null });
    },
    resetSelectedGroupItemIndex: () => {
      return this.setState({ selectedGroupItemIndex: null });
    },
    setSelectedVariantIndex: selectedVariantIndex => {
      return this.setState({ selectedVariantIndex })
    },
    setDefaultTargetMarketId: targetMarketId =>
      this.setState({ defaultTargetMarketId: targetMarketId }),
    addChangedMediaIds: mediaId => {
      if (!this.state.changedMediaIds.includes(mediaId)) {
        this.setState({
          changedMediaIds: [...this.state.changedMediaIds, mediaId],
        })
      }
    },
    setIsLoadedVariantsInit: isLoadedVariantsInit => {
      return this.setState({ isLoadedVariantsInit })
    },
  };

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const useTradeItemContext = () => {
  const context = useContext(Context);

  if (!context) throw new Error('useTradeItemContext must be use inside TradeItemProvider');

  return context;
};

export const withTradeItemLocalContext = WrappedComponent => props => (
  <Context.Consumer>
    {store => <WrappedComponent {...props} {...store} />}
  </Context.Consumer>
);
