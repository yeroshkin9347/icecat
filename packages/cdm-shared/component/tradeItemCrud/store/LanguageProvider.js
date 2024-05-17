import React, { createContext } from 'react'

const Context = createContext ({
    languages: [],
    isFetchingLanguages: false,
    setLanguages: () => {},
    resetLanguages: () => {},
    setFetchingLanguage: isFetching => {}
})

export default class LanguageProvider extends React.Component {

    state = {
        languages: [], // properties indexed by code
        isFetchingLanguages: false,
        setLanguages: languages => this.setState({ languages }),
        resetLanguages: () => this.setState({ languages: [] }),
        setFetchingLanguage: isFetching => this.setState({ isFetchingLanguages: isFetching })
    }

    render() {
        return (
            <Context.Provider value={this.state}>
                {this.props.children}
            </Context.Provider>
        )
    }

}

export const withLanguagesLocalContext = WrappedComponent => props => (
    <Context.Consumer>
        { store => <WrappedComponent {...props} {...store} />}
    </Context.Consumer>
)