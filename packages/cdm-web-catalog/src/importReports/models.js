const importDetailDefaultFilters = user => { return {    
    gtins: null,
    title: null,
    status: null
}}

const importTradeItemStatusDefaultFilters = user => { return {
    tradeItemProperty: null,
    status: null
}}

export { importDetailDefaultFilters, importTradeItemStatusDefaultFilters }