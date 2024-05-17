import reduce from 'lodash/reduce'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import isBoolean from 'lodash/isBoolean'
import isArray from 'lodash/isArray';
import isNil from 'lodash/isNil';

const calculateActiveFilters = filters => reduce(filters, (acc, filter, key) => {
    //Remove searchAfter as filter
    if (key === 'searchAfter' || (key === "scopes" && !find(filters.scopes, s => s === false))) {
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
  }, 0);

export const isFilterValueNull = (value) => {
  if (isArray(value))
    return value.length === 0;
  else
    return isNil(value);
};

export const areFiltersEmpty = filters => calculateActiveFilters(filters) === 0
