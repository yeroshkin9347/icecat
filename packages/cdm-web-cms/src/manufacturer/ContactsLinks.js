import React from 'react'
import { IconWrap, DivWrap } from "./styles";
import map from "lodash/map";
import { ic_cancel } from "react-icons-kit/md/ic_cancel";
import { ContactWrap, IconContainer } from "./styles";
function ContactsLinks({
  value,
  delContactList,
  // function
  // onUpdate,
}) {
  return (
    <DivWrap style={{ flexWrap: "wrap", padding: 10 }} display={`flex`}>
      {map(value, (v, k) => (
        <div>
          <ContactWrap>{v.description}</ContactWrap>
          <IconContainer onClick={()=>{
            delContactList(k)
          }}>
            <IconWrap  style={{ color: "red" }} size={20} icon={ic_cancel} />
          </IconContainer>
        </div>
      ))}
    </DivWrap>
  );
}

export default ContactsLinks
