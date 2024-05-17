import React from 'react'
import { Text, H3 } from 'cdm-ui-components'

const GaugeLabel = ({
    title,
    nbMin,
    nbMax
}) => {

    return (

        <>

            <H3
                noMargin
                inline
                >
                {nbMin}
                </H3>

            {nbMax && <Text inline>/{nbMax}</Text>}

            {title && <Text 
                style={{marginTop: '.7rem'}}
                spaced 
                lightgray 
                center
                >
                {title}
                </Text>}

        </>

    )

}

export default GaugeLabel