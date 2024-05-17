const initialState = {}

// the tank is used to keep shared data to avoid network accesses

const tank = (state = initialState, action) => {
    switch (action.type) {
        case 'TANK_RECEIVE_DATA':
            return Object.assign({}, state, action.data || {})
        default:
            return state
    }
}

export default tank
