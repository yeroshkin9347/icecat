import React, {useMemo} from "react";
import styled from "styled-components";
import { Icon } from "cdm-ui-components";
import { filePdfO } from "react-icons-kit/fa/filePdfO";
import { fileWordO } from "react-icons-kit/fa/fileWordO";
import { fileExcelO } from "react-icons-kit/fa/fileExcelO";
import { filePowerpointO } from "react-icons-kit/fa/filePowerpointO";
import { fileTextO } from "react-icons-kit/fa/fileTextO";
import { fileO } from "react-icons-kit/fa/fileO";

const DocIconWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DocumentIcon = ({
  asset,
  size,
}) => {
  const icon = useMemo(() => {
    if (!asset?.fileName) {
      return null;
    }
    const dotPos = asset.fileName.lastIndexOf('.');
    const ext = asset.fileName.substring(dotPos + 1).toLowerCase();
    switch (ext) {
      case 'txt':
        return fileTextO;
      case 'pdf':
        return filePdfO;
      case 'doc':
      case 'docx':
        return fileWordO;
      case 'xls':
      case 'xlsx':
        return fileExcelO;
      case 'ppt':
      case 'pptx':
        return filePowerpointO;
      default:
        return fileO;
    }
  }, [asset]);

  if (!icon) {
    return null;
  }

  return (
    <DocIconWrapper>
      <Icon size={size} icon={icon} />
    </DocIconWrapper>
  );
}

export default DocumentIcon;
