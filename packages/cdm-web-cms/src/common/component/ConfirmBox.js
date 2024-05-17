import React from 'react';
import CustomModal from "../../common/layout/CustomModal";
import { PRIMARY, SECONDARY } from "cdm-shared/component/color";
import CustomButton from "../../common/layout/CustomButton";
import { Margin } from "cdm-ui-components";

function ConfirmBox({ onClose, onDelete,show,label='' }) {
    if (!show) return null;
    return (
        <CustomModal
            onClose={onClose}
            headerTitle={"Confirm"}
            bodyContent={`Are you sure you want to delete this ${label}?`}
            footer={() => (
                <>
                    <CustomButton
                        title={"Yes"}
                        backgroundColor={PRIMARY}
                        onClick={onDelete}
                    />
                    <Margin left={2} />
                    <CustomButton
                        title={"No"}
                        backgroundColor={SECONDARY}
                        onClick={onClose}
                    />
                </>
            )}
        />
    );
}

export default ConfirmBox;
