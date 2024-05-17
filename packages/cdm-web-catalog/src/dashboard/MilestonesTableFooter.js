import React from "react";
import Button from '@mui/material/Button';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { GridFooter, GridFooterContainer } from '@mui/x-data-grid';

const CustomFooterComponent = ({translate, props} ) => {
    return (
      <>
      <GridFooterContainer sx={{ border: 'none'}}>
        <Button color="primary" startIcon={<RefreshRoundedIcon />} onClick={() => props.refresh(props.pageNumber, props.pageSize)}>
        {  translate("milestones.footer.refresh") }
        </Button>
        <GridFooter {...props} sx={{ border: 'none'}}/>
        </GridFooterContainer>
      </> 
    );
  }

  export default CustomFooterComponent;