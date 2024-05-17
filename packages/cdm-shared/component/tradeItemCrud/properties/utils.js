import filter from "lodash/filter"
import indexOf from "lodash/indexOf"
import reduce from "lodash/reduce"
import get from "lodash/get"
import { accuracyOptions } from "./DateWithAccuracyProperty/DateWithAccuracyProperty.constants"

export const renderFixedValue = (valuesGroup, locale) => {
    const preferredValue = get(valuesGroup, `[${locale}]`, null)
    return preferredValue === null ? get(valuesGroup, 'code') : preferredValue
}

export const getMultipleFixedValueValue = (value, valuesGroup) => {
    return filter(
        valuesGroup,
        r => indexOf(value, r.code) !== -1
    )
}

export const reduceGroupValues = properties => reduce(properties, (result, property, key) => {
    if (get(property, 'valuesGroupId', null)) result.push(get(property, 'valuesGroupId'))
    return result
}, [])

export const reduceGroupValuesValues = (groupValuesValues, localConversion) => reduce(groupValuesValues, (result, valuesGroup, key) => {
    result[valuesGroup.id] = reduce(get(valuesGroup, 'values', []), (valuesResult, value, keyValue) => {
        if (localConversion) {
            valuesResult[value.code] = value.values || {}
        } else {
            valuesResult[value.code] = {}
        }
        valuesResult[value.code].code = value.code
        return valuesResult
    }, {})
    return result
}, {})

export const getAccuracyLabelFromDateWithAccuracy = (dateWithAccuracy = {}, locale) => {
    const foundAccuracyOption =
        accuracyOptions.find(option => option.value === dateWithAccuracy.accuracy || option.code === dateWithAccuracy.accuracy);
    if (foundAccuracyOption) {
        return foundAccuracyOption[locale]
    }

    return "";
}
