
const defaultFilters = () => {
    return {
        keyword: null,
        manufacturers: null,
        brands: null,
        collections: null,
        gtin: null,
        tradeItemManufacturerCode: null,
        language: null,
        releaseDateStart: null,
        releaseDateEnd: null,
        updatedDateStart: null,
        updatedDateEnd: null,
        hasImages: false,
        hasNoImages: false,
        hasVideos: false,
        hasNoVideos: false,
        discontinuedDateStart: null,
        discontinuedDateEnd: null,
        npd: null,
        categoryNames: null,
        productLine: null,
    }
}

export { defaultFilters }