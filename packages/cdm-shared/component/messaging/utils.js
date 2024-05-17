import styled from "styled-components";
import { Col } from "cdm-ui-components";
import { HTML5_EDITOR_EMPTY_BODY_SIZE } from "../../component/htmlEditor/HTMLEditor";

export const TRI_LAYOUT_FIRST_COL = 2;
export const TRI_LAYOUT_SECOND_COL = 5;
export const TRI_LAYOUT_THIRD_COL = 5;

export const TOP_ROW_HEIGHT = "6rem";
export const TOP_ROW_PADDING_BOTTOM = "0rem";
export const TOP_ROW_DEFAULT_ITEMS_PADDING = "1rem";
export const TOP_ROW_DEFAULT_FILTER_WIDTH = "100%";

export const MESSAGE_LIST_MESSAGE_HEIGHT = "75px";
export const MESSAGE_LIST_REDUCED_MESSAGE_HEIGHT = "50px";

export const DRAFT_DEFAULT_HEIGHT = "650px";
export const DRAFT_DEFAULT_WIDTH = "650px";
export const DRAFT_BANNER_HEIGHT = "40px";
export const DRAFT_BANNER_REDUCED_WIDTH = "220px";

export const DEFAULT_ZONE_VERTICAL_PADDING = "1rem";

export const DEFAULT_BODY_CHARACTERS = 140;
export const DEFAULT_PAGE_SIZE = 30;

export const FILTER_TYPE_COLLECTION = "COLLECTION";
export const FILTER_TYPE_COMAPNY = "COMPANY";
export const FILTER_TYPE_FREE_SEARCH = "FREE";

export const isDraftEmpty = draft => {
  if (!draft) return true;
  return (
    !draft.subject &&
    !draft.recipients.length &&
    (!draft.body || draft.body.length <= HTML5_EDITOR_EMPTY_BODY_SIZE)
  );
};
