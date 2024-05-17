import React from 'react'
import get from 'lodash/get'
import map from 'lodash/map'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import findIndex from 'lodash/findIndex'
import { H3, List, ListItem, Text, Row, Col, Padding, P } from 'cdm-ui-components';
import ImageCard from './images/ImageCard';
import { getImageResourceMetadatasFromTradeItem } from './utils'
import withUser from 'cdm-shared/redux/hoc/withUser'
import { isRetailer } from 'cdm-shared/redux/hoc/withAuth'
import { ZoneStyled } from 'styled-components/zone/ZoneStyled'

class Images extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            imageGroupSelected: null,
            imagesGroupedByCategory: null

        }
    }

    componentDidUpdate(prevProps) {

        const { tradeItem, user } = this.props

        if (get(tradeItem, 'tradeItemId') && get(tradeItem, 'tradeItemId') !== get(prevProps, 'tradeItem.tradeItemId')) {

            const imageResourceMetadatas = getImageResourceMetadatasFromTradeItem(tradeItem, isRetailer(user));
            const imagesGroupedByCategory = groupBy(imageResourceMetadatas, 'imageCategory.key');

            this.setState({
                imagesGroupedByCategory,
                imageGroupSelected: isEmpty(imagesGroupedByCategory) ? null : Object.keys(imagesGroupedByCategory)[0]
            })
        }
    }

    getImageIndex(imgTarget) {
        const imageResourceMetadatas = getImageResourceMetadatasFromTradeItem(this.props.tradeItem, isRetailer(this.props.user));
        return findIndex(imageResourceMetadatas, img => get(imgTarget, 'publicUrl') === get(img, 'publicUrl'))
    }

    render() {

        const { imageGroupSelected, imagesGroupedByCategory } = this.state
        const { tradeItem, user } = this.props

        const { translate, onImageSelected } = this.props

        if (!tradeItem) return <React.Fragment />

        return (
            <ZoneStyled
                style={{
                    boxShadow: 'rgba(0, 0, 0, 0.25) 0px 0px 30px 0px',
                    minWidth: '50%',
                    minHeight: '300px',
                    maxWidth: '1500px',
                    margin: '0 auto'
                }}
                responsive
                borderRadius
            >

                <H3>{translate('tradeitem.images.title')}</H3>

                {isEmpty(imagesGroupedByCategory) && <P lead>{translate(`tradeitem.empty.images`)}</P>}

                <List>
                    {map(imagesGroupedByCategory, (imgCategory, imgCategoryKey) => (
                        <ListItem
                            key={`trade-item-image-cat-${imgCategoryKey}`}
                            selected={imageGroupSelected === imgCategoryKey}
                            onClick={e => this.setState({ imageGroupSelected: imgCategoryKey })}
                        >
                            <Text bold={imageGroupSelected === imgCategoryKey}>
                                {translate(`tradeitem.images.types.${imgCategoryKey}`)}
                            </Text>
                        </ListItem>
                    ))}
                </List>

                <Padding vertical={5}>
                    <Row>
                        {map(get(imagesGroupedByCategory, imageGroupSelected, []), (img, imgKey) => {
                            return <Col
                                col={3}
                                key={`trade-item-image-section-${imgKey}`}
                            >
                                <Padding bottom={3}>
                                    <ImageCard
                                        user={user}
                                        onClick={() => onImageSelected && onImageSelected(this.getImageIndex(img))}
                                        img={img}
                                        translate={translate}
                                        languageCodes={get(img, "languageCodes") || []}
                                        isChild={!get(img, 'tradeItemIds').includes(get(tradeItem, 'tradeItemId'))}
                                    />
                                </Padding>
                            </Col>
                        })}
                    </Row>
                </Padding>

            </ZoneStyled>
        )

    }

}



export default withUser(Images)
