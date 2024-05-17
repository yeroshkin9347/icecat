import React from "react";
import Lightbox from "lightbox-react";
import "lightbox-react/style.css";

const ImageViewer = ({ image, opened, onClose }) =>
  image &&
  opened ? (
    <Lightbox
      mainSrc={image}
      nextSrc={null}
      prevSrc={null}
      onCloseRequest={() => onClose && onClose()}
    />
  ) : null;

export default ImageViewer;
