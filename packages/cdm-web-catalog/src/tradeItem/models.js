import get from 'lodash/get'

const getGalleryModel = () => {
    return {
        opened: false,
        imageIndex: 0
    }
}

const buildReductedTradeItem = (tradeItem, languageCode) => {
    return {
        gtin: get(tradeItem, 'gtin'),
        languageCode: languageCode,
        manufacturerId: get(tradeItem, 'manufacturer.manufacturerId'),
        manufacturerName: get(tradeItem, 'manufacturer.name'),
        title: get(tradeItem, 'marketing.values.title'),
        tradeItemManufacturerCode: get(tradeItem, 'tradeItemManufacturerCode'),
        tradeItemId: get(tradeItem, 'tradeItemId'),
        tradeItemMediumImagePath: get(tradeItem, 'imageResourceMetadatas.0.values.publicUrl'),
        tradeItemThumbnailImagePath: get(tradeItem, 'imageResourceMetadatas.0.values.publicUrl'),
    }
}

export { getGalleryModel, buildReductedTradeItem }