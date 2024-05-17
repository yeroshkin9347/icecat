import React from "react"
import {
  VirtualizedSelect
} from 'cdm-ui-components'
import filter from "lodash/filter"
import indexOf from "lodash/indexOf"
import get from "lodash/get"
import map from "lodash/map"



const ListProperty = ({property, value, onChange, isMulti}) => isMulti ? (
  <>
    <VirtualizedSelect
      isMulti
      closeMenuOnSelect={false}
      value={filter(
        get(property, "values", []),
        r => indexOf(value, r.code) !== -1
      )}
      onChange={v => onChange(map(v, _v => get(_v, "code", null)))}
      isClearable={true}
      getOptionLabel={o => `(${o.code}) ${get(o, "values[fr-FR]", "")}`}
      getOptionValue={o => o.code}
      options={get(property, "values", [])}
    />
  </>
)
:
(
  <VirtualizedSelect
    value={filter(
      get(property, "values", []),
      r => value === r.code
    )}
    onChange={v => onChange(get(v, "code"))}
    isClearable={true}
    getOptionLabel={o => `(${o.code}) ${get(o, "values[fr-FR]", "")}`}
    getOptionValue={o => o.code}
    options={get(property, "values", [])} />
)

export default ListProperty
