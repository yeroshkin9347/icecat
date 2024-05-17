import styled from "styled-components";

const Styles = styled.div`
  position: relative;
  width: 100%;

  table {
    font-size: 0.9rem;
    width: 100%;
    border-spacing: 0;
    border: 1px solid rgb(${props => props.theme.border.color});
    border-radius: ${props => props.theme.border.radius};

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
      :nth-child(even) {
        background-color: rgba(0, 0, 0, 0.04);
      }
      :hover {
        background-color: rgba(${props => props.theme.color.primary}, 0.1);
      }
    }

    tr.noStyle {
      vertical-align: top;
      :nth-child(even) {
        background-color: inherit;
      }
      :hover {
        background-color: inherit;
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid rgb(${props => props.theme.border.color});
      border-right: 1px solid rgb(${props => props.theme.border.color});

      :last-child {
        border-right: 0;
      }
    }
  }
`;

export default Styles;
