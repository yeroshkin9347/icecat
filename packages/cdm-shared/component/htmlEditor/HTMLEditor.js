import React, {
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
  forwardRef
} from "react";
import {
  EditorState,
  // ContentState,
  // convertFromHTML,
  getDefaultKeyBinding,
  KeyBindingUtil,
  convertToRaw,
  convertFromRaw,
  convertFromHTML,
  ContentState
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";

import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./htmlEditor.css";
import useInterval from "../../hook/useInterval";

const { hasCommandModifier } = KeyBindingUtil;
const HTML5_EDITOR_EMPTY_BODY_SIZE = 132;

const serializeHtmlEditorContent = draftJsContent => {
  return JSON.stringify(convertToRaw(draftJsContent));
  // html
  // return draftToHtml(convertToRaw(draftJsContent))
};

const unserialize = toDeserialize => {
  if (!toDeserialize) return EditorState.createEmpty();

  //json
  if (toDeserialize[0] === "{") {
    return EditorState.createWithContent(
      convertFromRaw(JSON.parse(toDeserialize))
    );
  }
  // html
  else {
    return EditorState.createWithContent(
      ContentState.createFromBlockArray(convertFromHTML(toDeserialize))
    );
  }
};

function myKeyBindingFn(e) {
  if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
    return "myeditor-save";
  }
  return getDefaultKeyBinding(e);
}

const fromEditorContentToHtml = content => {
  return content ? draftToHtml(JSON.parse(content)) : "";
};

const fromHtmlToEditorContent = html => {
  return html ? htmlToDraft(html) : "";
};

const EditorConvertToHTML = forwardRef(({ keyName, html, onChange }, ref) => {
  const [editorState, setEditorState] = useState(unserialize(html));

  const onEditorStateChange = useCallback(newEditorState => {
    setEditorState(newEditorState);
  }, []);

  const saveEditorState = useCallback(() => {
    const newHtml = serializeHtmlEditorContent(editorState.getCurrentContent());
    onChange(newHtml);
  }, [editorState, onChange]);

  const handleKeyCommand = useCallback(
    command => {
      if (command === "myeditor-save") {
        saveEditorState();
        return "handled";
      }
      return "not-handled";
    },
    [saveEditorState]
  );

  const clearEditorStateInterval = useInterval(saveEditorState, 5000);

  // trigger a save on closing
  useImperativeHandle(ref, () => ({
    getHtmlContent() {
      return serializeHtmlEditorContent(editorState.getCurrentContent());
    }
  }));

  // const onImageUploadNoOptim = useCallback(
  //   file =>
  //     new Promise((resolve, reject) => {
  //       var reader = new FileReader();
  //       reader.readAsDataURL(file);
  //       let img = new Image();
  //       reader.onload = function(e) {
  //         img.src = this.result;
  //         resolve({
  //           data: {
  //             link: img.src
  //           }
  //         });
  //       };
  //     }),
  //   []
  // );

  const onImageUpload = useCallback(
    file =>
      new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        let img = new Image();
        reader.onload = function(e) {
          img.src = this.result;
        };
        img.onload = function() {
          var canvas = document.createElement("canvas");
          var context = canvas.getContext("2d");

          var originWidth = this.width;
          var originHeight = this.height;

          var maxWidth = 600,
            maxHeight = 700;
          // target size
          var targetWidth = originWidth,
            targetHeight = originHeight;
          // Image size exceeds 300x300 limit
          if (originWidth > maxWidth || originHeight > maxHeight) {
            if (originWidth / originHeight > maxWidth / maxHeight) {
              // wider, size limited by width
              targetWidth = maxWidth;
              targetHeight = Math.round(
                maxWidth * (originHeight / originWidth)
              );
            } else {
              targetHeight = maxHeight;
              targetWidth = Math.round(
                maxHeight * (originWidth / originHeight)
              );
            }
          }
          // canvas scales the image
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          // clear the canvas
          context.clearRect(0, 0, targetWidth, targetHeight);
          // Image Compression
          context.drawImage(img, 0, 0, targetWidth, targetHeight);
          const newUrl = canvas.toDataURL("image/jpeg", 0.92);

          resolve({
            data: {
              link: newUrl
            }
          });
        };
      }),
    []
  );

  useEffect(() => {
    return () => {
      clearEditorStateInterval();
    };
  }, [clearEditorStateInterval]);

  return (
    <Editor
      key={keyName}
      handleKeyCommand={handleKeyCommand}
      keyBindingFn={myKeyBindingFn}
      editorState={editorState}
      wrapperClassName="html-editor-wrapper"
      editorClassName="html-editor-wrapper-editor"
      toolbarClassName="html-editor-wrapper-toolbar"
      onEditorStateChange={onEditorStateChange}
      toolbar={{
        options: [
          "inline",
          "blockType",
          "colorPicker",
          "list",
          "textAlign",
          "link",
          "emoji",
          "image",
          "history"
        ],
        inline: {
          options: ["bold", "italic", "underline", "strikethrough", "monospace"]
        },
        image: {
          urlEnabled: false,
          uploadCallback: onImageUpload,
          previewImage: true,
          inputAccept: "image/*",
          alt: { present: false, mandatory: false }
        }
      }}
    />
  );
});

// function areEqual(prevProps, nextProps) {
//   return true;
// }

export {
  fromEditorContentToHtml,
  fromHtmlToEditorContent,
  serializeHtmlEditorContent,
  HTML5_EDITOR_EMPTY_BODY_SIZE
};
export default React.memo(EditorConvertToHTML);
