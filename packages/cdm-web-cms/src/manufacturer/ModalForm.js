import React from "react";
import { Modal } from "cdm-ui-components";
import TriggerPollingForm from "./TriggerPollingForm";
import NewContactForm from "./NewContactForm";

function ModalForm({
  translate,
  showFlag,
  setShowFlag,
  title,
  users,
  addContactList,
  manufacturerEntityId = null,
}) {
  const switchForm = (title) => {
    switch (title) {
      case "Trigger Polling":
        return (
          <TriggerPollingForm
            translate={translate}
            title={title}
            manufacturerEntityId={manufacturerEntityId}
          />
        );
      case "New Contacts":
        return (
          <NewContactForm
            translate={translate}
            title={title}
            users={users}
            addContactList={addContactList}
          />
        );
      default:
        return null;
    }
  };
  return (
    showFlag && (
      <Modal
        style={{ overflow: "initial" }}
        sm
        onClose={() => setShowFlag(false)}
      >
        {switchForm(title)}
      </Modal>
    )
  );
}

export default ModalForm;
