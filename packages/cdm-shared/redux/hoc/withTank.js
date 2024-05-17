import React from 'react'
import { connect } from "react-redux"

const mapDispatchToProps = dispatch => {
    return {
        setTankData: data => dispatch({
            type: 'TANK_RECEIVE_DATA', 
            data
        })
    }
}

const mapStateToProps = state => {
    return {
      tank: state.tank
    }
}

export default function withTank(WrappedComponent) {
    return connect(mapStateToProps, mapDispatchToProps)(
        class extends React.Component {

        render() {
            return <WrappedComponent {...this.props} />
        }
    })
}