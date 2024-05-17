import styled, { css } from 'styled-components'

export const Table = styled.table`
  border-collapse: collapse;
  background-color: #f5f5f5;
  border-radius: .5rem .5rem;
  overflow: hidden;

  ${props => props && props.full && css`
    width: 100%;
  `}
`

export const Thead = styled.thead`
`

export const Tbody = styled.tbody`
`

export const Th = styled.th`
  border: 1px solid #888;
  padding: 1rem;
`

export const Td = styled.td`
  padding: 1.5rem 2rem;
  vertical-align: top;
`

export const Tr = styled.tr`
`
