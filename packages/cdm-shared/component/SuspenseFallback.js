// import React from 'react'
import styled, { keyframes } from 'styled-components'

const appear = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`

const SuspenseFallback = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: #fff;
    // animation: ${appear} .2s cubic-bezier(0, 0, 0, 0.99);    
`

export default SuspenseFallback