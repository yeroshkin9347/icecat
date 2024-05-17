import reduce from 'lodash/reduce'
import filter from 'lodash/filter'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import indexOf from 'lodash/indexOf'
import { CONNECTOR_SUBSCRIBED } from './constants';

export const initialState = {
    offers: null,
    initialConnectors: [],
    connectors: [],
    productsStatistics: null,
    loading: {
        offers: false,
        connectors: false,
        productsStatistics: false
    },
    filters: {
        connectorType: [],
        connectorStatus: [],
        connectorSubscribed: null
    }
}

function applyFilters(filters, initialConnectors) {
    if (isEmpty(filters.connectorType) && isEmpty(filters.connectorStatus) && filters.connectorSubscribed === null) return initialConnectors
    return reduce(initialConnectors, (result, countriedConnector) => {
        const key = get(countriedConnector, 'key')
        const connectors = get(countriedConnector, 'values')
        const values = filter(connectors, connector => {
           if (!isEmpty(filters.connectorType) && indexOf(filters.connectorType, get(connector, 'type')) === -1) return false
           if (!isEmpty(filters.connectorStatus) && indexOf(filters.connectorStatus, get(connector, 'status')) === -1) return false
           if (filters.connectorSubscribed === CONNECTOR_SUBSCRIBED.SUBSCRIBED && !get(connector, 'subscribed')) return false
           if (filters.connectorSubscribed === CONNECTOR_SUBSCRIBED.UNSUBSCRIBED && get(connector, 'subscribed')) return false
           return true
        })

        return isEmpty(values) ? result : [...result, { key, values }]

    }, [])
}

export const reducer = (state, action) => {
    switch (action.type) {
        case 'initOffers':
            return {
                ...state,
                offers: action.data,
                loading: {
                    ...state.loading,
                    offers: false
                }
            }
        case 'initConnectors':
            return {
                ...state,
                connectors: applyFilters(state.filters, action.data),
                initialConnectors: action.data,
                loading: {
                    ...state.loading,
                    connectors: false
                }
            }
        case 'initProductsStatistics':
            return {
                ...state,
                productsStatistics: action.data,
                loading: {
                    ...state.loading,
                    productsStatistics: false
                }
            }
        case 'setLoadingValue':
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [action.key]: action.value
                }
            }
        case 'setLoadingValues':
            return {
                ...state,
                loading: {
                    ...state.loading,
                    ...reduce(action.values, (results, value) => {
                        return {
                            ...results,
                            [value.key]: value.value
                        }
                    }, {})
                }
            }
        case 'setFilters':
                const newFilters = {
                    ...state.filters,
                    ...reduce(action.values, (results, value) => {
                        return {
                            ...results,
                            [value.key]: value.value
                        }
                    }, {})
                }
                return {
                    ...state,
                    filters: newFilters,
                    connectors: applyFilters(newFilters, state.initialConnectors)
                }
    
        default:
            return state
    }
}