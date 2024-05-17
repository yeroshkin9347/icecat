import React from 'react'
import styled, {css} from 'styled-components'

const Hidder = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background: linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 99%,rgba(255,255,255,1) 100%);
`

const ToggleZoneWrapper = styled.div`
    ${props => props && !props.show && css`
        overflow: hidden;
        max-height: ${props.height};
        height: ${props.height};
    `}
`

function ToggleZone({
    show,
    height,
    children,
    ...otherProps
}) {
    return (
        <ToggleZoneWrapper
            height={height}
            show={show}
            {...otherProps}
            >

            {children}

            {!show && <Hidder />}
    
        </ToggleZoneWrapper>
    )
}

export default ToggleZone