import React from 'react'
import { List, ListItem, Text } from 'cdm-ui-components'

const ManufacturerMenu = ({
    translate
}) => {

    return (

        <List>
            <ListItem selected><Text bold spaced uppercase>Your subscription</Text></ListItem>
            <ListItem><Text bold spaced uppercase>Connectors map</Text></ListItem>
            <ListItem><Text bold spaced uppercase>Our offers</Text></ListItem>
        </List>

    )

}

export default ManufacturerMenu