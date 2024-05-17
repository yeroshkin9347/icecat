import styled, { css } from "styled-components"
import {
    Zone,
} from 'cdm-ui-components'

const User = styled(Zone)`
    position: absolute;
    z-index: 1;
    border-bottom-left-radius: .3em;
    width: 90%;
    padding: 1.2em .8em;
    right: 10px;
    text-align: center;
    color: #fff;

    ${props => css`
        background-color: rgb(${props.theme.color.primary});
    `}

    ::before {
        display: inline-block;
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background-color: #000;
        opacity: .1;
        transition: height .2s ease;
        z-index: -1;
    }

    &:hover {
        ::before {
            height: 100%;
        }
    }

    > a {
        color: #fff;
        text-decoration: none;
        font-size: .8em;
    }
`

export default User;
