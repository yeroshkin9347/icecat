import React from "react"
import {
  Textarea
} from 'cdm-ui-components'


const StringProperty = ({property, value, onChange}) => (
  <>
    <Textarea
      rows={6}
      className="form-field"
      type="text"
      value={value || ""}
      onChange={e => onChange(e.target.value)} />
  </>
)

export default StringProperty
