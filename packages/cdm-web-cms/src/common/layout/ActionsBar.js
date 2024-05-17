import React from "react";
import Sticky from "react-stickynode";

const ActionsBar = ({children}) => (
  <Sticky enabled={true} top={`#mainNav`} innerZ={500}>
      <div className="row bg-white py-2 border-bottom">
          {children}
      </div>
  </Sticky>
)

export default ActionsBar;
