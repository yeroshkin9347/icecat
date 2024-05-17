import React, { createContext } from 'react'
import indexOf from 'lodash/indexOf'
import filter from 'lodash/filter'

const Context = createContext ({
    translations: [],
    translationSelected: null,
    setTranslations: () => {},
    resetSelectedTranslation: () => {},
    removeTranslation: () => {},
    getTranslationSelectedIndex: () => {},
    resetTranslations: () => {},
})

export default class TranslationProvider extends React.Component {

    state = {
        translations: [],
        translationSelected: null,
        translationSelectedIndex: null,
        setTranslations: translations => this.setState({ translations }),
        setSelectedTranslation: translationSelected => this.setState({ translationSelected }),
        resetSelectedTranslation: () => this.setState({ translationSelected: null }),
        getTranslationSelectedIndex: () => {
            return indexOf(this.state.translations, this.state.translationSelected)
        },
        removeTranslation: languageCode => {
            const translationIndex = indexOf(this.state.translations, this.state.translationSelected)
            if(translationIndex !== -1) this.setState({
                translationSelected: languageCode === this.state.translationSelected ? null : this.state.translationSelected,
                translations: filter(this.state.translations, (tr, trIndex) => trIndex !== translationIndex)
            })
        },
        resetTranslations: () => this.setState({ 
            translations: [],
            translationSelected: null,
            translationSelectedIndex: null,
        }),
    }

    render() {
        return (
            <Context.Provider value={this.state}>
                {this.props.children}
            </Context.Provider>
        )
    }

}

export const withTranslationsLocalContext = WrappedComponent => props => (
    <Context.Consumer>
        { store => <WrappedComponent {...props} {...store} />}
    </Context.Consumer>
)