import React from 'react'
import styled, { css } from 'styled-components'
import { Zone } from 'cdm-ui-components';

const PrimaryZone = styled(Zone)`

    ${props => css`
        background-color: rgb(${props.theme.color.primary});
    `}

`

const InterSectionBanner = ({
    style,
    children
}) => {

    return (
        <PrimaryZone 
            noShadow
            style={Object.assign({}, {
                position: 'relative', 
                padding: 0 
            }, style || {})}
            >

            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 100 10"
                preserveAspectRatio="none" 
                style={{
                    position: 'absolute',
                    top: '0',
                    width: '100%',
                    height: '20em'
                    }}
                >
                <polygon className="svg--lg" fill="white" points="100,0 100,10 0,0" />
            </svg>

            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 100 10"
                preserveAspectRatio="none" 
                style={{
                    position: 'absolute',
                    bottom: '0',
                    width: '100%',
                    height: '30em'
                    }}
                >
                <polygon className="svg--lg" fill="white" points="100 5 100 10 0 10" />
            </svg>

            { children }

        </PrimaryZone>
    )
}

export default InterSectionBanner
