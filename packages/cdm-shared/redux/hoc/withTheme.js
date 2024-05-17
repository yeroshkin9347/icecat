import React from 'react'
import { connect } from "react-redux"

const mapDispatchToProps = dispatch => {
    return {}
}

const mapStateToProps = state => {
    return {
      theme: state.theme
    }
}

export default function withTheme(WrappedComponent) {
    return connect(mapStateToProps, mapDispatchToProps)(
        class extends React.Component {

        render() {
            return <WrappedComponent {...this.props} />
        }
    })
}

