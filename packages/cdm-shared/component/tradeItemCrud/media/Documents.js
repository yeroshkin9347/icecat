import React from 'react'
import get from 'lodash/get'
import Medias from './Medias';

const FILE_TYPES_ACCEPTED = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]

const CATEGORY_KEY = "documentCategory"

const INDEX_KEY = "index"

const FILE_NAME_PROPERTY = "filename"

const getMediaUrl = img => get(img, 'publicUrl', null)

const Documents = () => (
    <Medias
        fileTypesAccepted={FILE_TYPES_ACCEPTED}
        categoryIndexKey={CATEGORY_KEY}
        mediaIndexKey={INDEX_KEY}
        showPrePicture={false}
        fileNamePropertyCode={FILE_NAME_PROPERTY}
        getMediaUrl={getMediaUrl}
    />

)

export default Documents
