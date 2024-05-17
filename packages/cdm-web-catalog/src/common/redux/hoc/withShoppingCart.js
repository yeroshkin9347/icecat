import React from 'react'
import { connect } from "react-redux"
import findIndex from 'lodash/findIndex'

const mapDispatchToProps = dispatch => {
    return {
        clearShoppingCart: () => dispatch({ type: `MOD_SHOPPING_CART_RESET` }),
        addItemToShoppingCart: item => dispatch({ type: `MOD_SHOPPING_CART_ADD`, item }),
        removeItemFromShoppingCart: index => dispatch({ type: `MOD_SHOPPING_CART_REMOVE`, index }),
        findAndRemoveItemFromShoppingCart: fn => dispatch({ type: `MOD_SHOPPING_CART_FIND_REMOVE`, fn }),
    }
}

const mapStateToProps = state => {
    return {
      shoppingCart: state.shoppingCart
    }
}

export default function withShoppingCart(WrappedComponent) {
    return connect(mapStateToProps, mapDispatchToProps)(
        class extends React.Component {

        constructor(props) {
            super(props)
            this.isInShoppingCart = this.isInShoppingCart.bind(this)
        }

        isInShoppingCart(compareFn) {
            return findIndex(this.props.shoppingCart, ti => compareFn(ti)) !== -1
        }

        render() {
            return <WrappedComponent {...this.props} isInShoppingCart={this.isInShoppingCart} />
        }
    })
}

