import reduce from 'lodash/reduce'
import isEmpty from 'lodash/isEmpty'
import isBoolean from 'lodash/isBoolean'

const calculateActiveFilters = filters => reduce(filters, (acc, filter, key) => {
    //Remove searchAfter as filter
    if (key === 'searchAfter') {
      return acc += 0
    }
    //Check filter !== empty
    if (isEmpty(filter)) {
      //Check if filter value boolean && true
      if (isBoolean(filter) && filter) {
        return acc += 1
      } else return acc += 0
    }
    return acc += 1
  }, 0)

  export const areFiltersEmpty = filters => calculateActiveFilters(filters) === 0