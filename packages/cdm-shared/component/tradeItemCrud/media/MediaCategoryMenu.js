import React from 'react'
import map from 'lodash/map'
import reduce from 'lodash/reduce'
import get from 'lodash/get'
import { List, ListItem, Text } from 'cdm-ui-components';
import { onlyUpdateForKeys } from 'recompose';
import { withValuesGroupsLocalContext } from '../store/ValuesGroupProvider';
import { renderFixedValue } from '../properties/utils';

export const ALL_CATEGORIES_KEY = '_ALL'

class MediaCategoryMenu extends React.Component {

    state = {
        categories: {}
    }

    componentDidMount() {
        this.refreshCategories()
    }

    componentDidUpdate(nextProps) {
        if (JSON.stringify(nextProps.medias) !== JSON.stringify(this.props.medias) || nextProps.locale !== this.props.locale) this.refreshCategories()
    }

    refreshCategories() {
        const { medias, categorySelected, categoryKeyIndex, categoryValuesGroupId, valuesGroups, locale, translate, onSelect } = this.props

        const newCategories = reduce(medias, (result, media, key) => {
            const categoryKey = get(media, categoryKeyIndex, null)
            if (categoryKey !== null) {
                result[categoryKey] = renderFixedValue(get(valuesGroups, `${categoryValuesGroupId}[${categoryKey}]`), locale)
            }
            return result
        }, {})

        const newCategorySelected = get(newCategories, categorySelected, null) ? categorySelected : get(newCategories, '[0]', ALL_CATEGORIES_KEY)

        this.setState({
            categories: Object.assign({}, { [ALL_CATEGORIES_KEY]: translate('tradeItemCrud.media.allCategories') }, newCategories)
        })

        onSelect && onSelect(newCategorySelected);

    }

    render() {

        const { categories } = this.state

        const { categorySelected } = this.props

        const { onSelect, translate } = this.props

        return (
            <List>
                {map(categories, (imgCategory, imgCategoryKey) => (
                    <ListItem
                        key={`trade-item-image-cat-menu-${imgCategoryKey}`}
                        selected={categorySelected === imgCategoryKey}
                        onClick={() => onSelect && onSelect(imgCategoryKey)}
                    >
                        <Text bold={categorySelected === imgCategoryKey}>
                            {translate(`tradeItemCrud.images.types.${imgCategory}`)}
                        </Text>
                    </ListItem>
                ))}
            </List>
        )

    }

}

export default onlyUpdateForKeys(['medias', 'categorySelected', 'locale'])(withValuesGroupsLocalContext(MediaCategoryMenu))
