import React from 'react'
import styled, { css } from 'styled-components'
import get from 'lodash/get'
import find from 'lodash/find'
import statusBlocked from './icons/blocked.png'
import statusWarning from './icons/warning.png'
import statusOk from './icons/ok.png'

const StatusLine = styled.span`
    padding: 0.25rem 0.5rem;
`

const StatusIcon = styled.i`
    width: ${props => props.size ? `${props.size}` : "22px"};
    height: ${props => props.size ? `${props.size}` : "22px"};
    display: inline-block;
    background-repeat: no-repeat;
    background-size: contain;

    ${props => props.backgroundImage && css`
        background-image: url(${props.backgroundImage})
    `}
`

export const getIconForStatus = (status, size) => {
    switch (status) {
        case 'Blocked':
            return <StatusIcon backgroundImage={statusBlocked} size={size}/>
        case 'Warning':
            return <StatusIcon backgroundImage={statusWarning} size={size}/>
        case 'Ok':
            return <StatusIcon backgroundImage={statusOk} size={size}/>        
        default:
            return ''
        
    }
}

const Status = ({
        targetRetailer,
        tradeItemRetailerReports,
        // functions
        translate
    }) => {
  let status = null
  const retailer = find(tradeItemRetailerReports, r => {
    if(get(r, "retailer.name") === targetRetailer) {
      status = get(r, "status")
      return true
    }
    return false
  })
  if(!retailer) return translate('importReports.meta.na')
  return <StatusLine>{getIconForStatus(status)}</StatusLine>
}

export default Status