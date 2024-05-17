import React, { useCallback, useState } from "react";
import get from "lodash/get";
import styled from "styled-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import UploadMedia from "cdm-shared/component/tradeItemCrud/media/UploadMedia";
import {
  importDocumentResourceForUser,
  importImageResourceForUser,
  importVideoResourceForUser
} from "cdm-shared/services/resource";
import { ModalStyled } from "cdm-shared/component/styled/modal/ModalStyled";
import LoaderOverlay from "cdm-shared/component/LoaderOverlay";
import useNotifications from "cdm-shared/hook/useNotifications";
import { ACCEPTABLE_FILE_TYPES } from "./models";
import ImageUploadForm from "./ImageUploadForm";
import VideoUploadForm from "./VideoUploadForm";
import DocumentUploadForm from "./DocumentUploadForm";

const DropZoneWrapper = styled.div`
  margin-top: -40px;
  margin-bottom: 20px;
`;

const MAX_FILE_SIZE = 100000000;

const AssetUpload = ({
  assetType,
  translate,
  onUpload,
}) => {
  const [, notify] = useNotifications();

  const [file, setFile] = useState();
  const [saving, setSaving] = useState(false);

  const notifyResult = useCallback((title, description, type = "success") => {
    notify({
      title: translate(title),
      body: translate(description),
      severity: type,
      dismissAfter: 3000,
    });
  }, [notify, translate]);

  const onSelectFile = (files) => {
    setFile(files[0]);
  };

  const onRejectFile = (files) => {
    const file = files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        notifyResult("video.toast.fileRejected", "video.toast.fileExceedsMaxSize", 'error');
      } else if (!ACCEPTABLE_FILE_TYPES[assetType].includes(file.type)) {
        notifyResult("video.toast.fileRejected", "video.toast.fileInvalidType", 'error');
      }
    }
  };

  const onSubmit = (metadata) => {
    const capitalizedAssetType = `${assetType[0].toUpperCase()}${assetType.slice(1)}`;
    let uploadFunction;
    if (assetType === "image") {
      uploadFunction = importImageResourceForUser;
    } else if (assetType === "document") {
      uploadFunction = importDocumentResourceForUser;
    } else if (assetType === "video") {
      uploadFunction = importVideoResourceForUser;
    }

    if (uploadFunction) {
      setSaving(true);
      const title = `video.form.upload${capitalizedAssetType}`;
      uploadFunction(metadata, file).then((res) => {
        notifyResult(title, `video.toast.upload${capitalizedAssetType}Success`);
        const result = res.data[0];
        if (result) {
          if (assetType === "image") {
            onUpload({
              id: get(result, 'metadata.values.id.value'),
              title: metadata.Title,
              categories: [metadata.ImageCategory],
              languageCodes: metadata.LanguageCodes || [],
              size: get(result, 'metadata.values.size.value'),
              mimeType: get(result, 'metadata.values.mimeType.value'),
              width: get(result, 'metadata.values.width.value'),
              height: get(result, 'metadata.values.height.value'),
              thumbUrl: get(result, 'metadata.values.publicUrl.value'),
            });
          } else if (assetType === "document") {
            onUpload({
              id: get(result, 'metadata.values.id.value') ?? result._id,
              title: metadata.Title,
              fileName: metadata.FileName,
              categories: [metadata.DocumentCategory],
              languageCodes: metadata.LanguageCodes || [],
              size: get(result, 'metadata.values.size.value') ?? result.size,
              mimeType: get(result, 'metadata.values.mimeType.value') ?? result.mimeType,
            });
          } else if (assetType === "video") {
            onUpload({
              id: res.data._id,
              title: metadata.Title,
              categories: metadata.VideoCategories,
              languageCodes: metadata.LanguageCodes || [],
              size: res.data.size,
              mimeType: res.data.mimeType,
              censors: res.data.censors,
            });
          }
        }
        onClose();
      }).catch(() => {
        notifyResult(title, `video.toast.upload${capitalizedAssetType}Failed`, 'error');
      }).finally(() => {
        setSaving(false);
      });
    }
  };

  const onClose = () => {
    setFile(undefined);
  };

  return (
    <div>
      <DropZoneWrapper>
        <UploadMedia
          typesAccepted={ACCEPTABLE_FILE_TYPES[assetType]}
          maxSize={MAX_FILE_SIZE}
          multiple={false}
          onFilesAccepted={onSelectFile}
          onFilesRejected={onRejectFile}
        />
      </DropZoneWrapper>

      {saving && (
        <LoaderOverlay />
      )}

      {file && (
        <ModalStyled md>
          {assetType === 'image' && <ImageUploadForm file={file} onSubmit={onSubmit} onClose={onClose} />}
          {assetType === 'video' && file && <VideoUploadForm file={file} onSubmit={onSubmit} onClose={onClose} />}
          {assetType === 'document' && file && <DocumentUploadForm file={file} onSave={onSubmit} onClose={onClose} />}
        </ModalStyled>
      )}

    </div>
  );
}
export default withLocalization(AssetUpload);
