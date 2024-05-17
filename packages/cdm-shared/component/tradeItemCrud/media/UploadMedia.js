import React from "react";
import { UploadZone, P } from "cdm-ui-components";
import Dropzone from "react-dropzone";
import { withLocalization } from "common/redux/hoc/withLocalization";

const UploadMedia = ({
  typesAccepted,
  maxSize,
  multiple = true,
  // functions
  onFilesAccepted,
  onFilesRejected,
  translate
}) => {
  const handleFileRejection = (files, event) => {
    if (onFilesRejected) {
      onFilesRejected(files, event);
    }
  };

  return (
    <Dropzone
      onDrop={(accepted, rejected) =>
        onFilesAccepted && onFilesAccepted(accepted)
      }
      maxSize={maxSize || 100000000} // 100Mo
      onDropRejected={handleFileRejection}
      accept={typesAccepted}
      multiple={multiple}
    >
      {({
          getRootProps,
          getInputProps,
          isDragActive,
          isDragAccept,
          isDragReject,
          acceptedFiles,
          ...props
        }) => {
        return (
          <UploadZone
            style={{
              height: "250px"
            }}
            borderRadius
            isDragActive={isDragActive}
            isDragReject={isDragReject}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <P
              style={{
                top: "50%",
                transform: "translateY(-50%)"
              }}
              lead
            >
              {isDragReject && translate("tradeItemCrud.media.reject")}
              {isDragAccept && translate("tradeItemCrud.media.drop")}
              {!isDragAccept && translate("tradeItemCrud.media.drag")}
            </P>
          </UploadZone>
        );
      }}
    </Dropzone>
  )
};

export default withLocalization(UploadMedia);
