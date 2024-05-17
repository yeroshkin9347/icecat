import React from "react"
import {
  Input
} from 'cdm-ui-components'


const StringProperty = ({property, value, onChange}) => (
  <>
    <Input
      type="text"
      onChange={e => onChange(e.target.value)}
      value={value || ""}
      />
  </>
)

export default StringProperty
