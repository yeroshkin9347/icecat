import React from 'react';
import { Toast } from "cdm-ui-components";
function CustomToast({messageObject=null}) {
    
    if (messageObject){
        const { msgType, message } = messageObject;
        return (
            <>
                {msgType === "success" && (
                    <Toast
                        style={{
                            position: "fixed",
                            bottom: "20px",
                            right: "20px",
                            zIndex: 99999999,
                        }}
                        success
                    >
                        {message}
                    </Toast>
                )}
                {msgType === "error" && (
                    <Toast
                        style={{
                            position: "fixed",
                            bottom: "20px",
                            right: "20px",
                            zIndex: 99999999,
                        }}
                        danger
                    >
                        {message}
                    </Toast>
                )}
            </>
        );
    }
    return null;
}

export default CustomToast;
