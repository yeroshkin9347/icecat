import React from "react"

const memoize = (component, areEqual) => React.memo(component, areEqual || null)

export default memoize