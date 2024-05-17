import React, { useMemo, useRef, useCallback } from "react";
import {
  Text,
  Button,
  Row,
  Col,
  Label,
  Margin,
  Icon,
  Select,
  DropdownButton,
} from "cdm-ui-components";
import map from "lodash/map";
import styled, { css } from "styled-components";
import {
  DRAFT_DEFAULT_HEIGHT,
  DRAFT_DEFAULT_WIDTH,
  DRAFT_BANNER_HEIGHT,
  DRAFT_BANNER_REDUCED_WIDTH,
} from "../utils";
import HTMLEditor from "../../htmlEditor/HTMLEditor";
import SubjectInput from "./SubjectInput";
import RecipientsSelect from "./RecipientsSelect";
import { ic_close } from "react-icons-kit/md/ic_close";
import { ic_delete } from "react-icons-kit/md/ic_delete";
import { ic_remove } from "react-icons-kit/md/ic_remove";
import { createMessageFromDraft, loadTemplateForDraft } from "../actions";
import useNotifications from "../../../hook/useNotifications";

const ContextualIcon = styled(Icon)`
  position: absolute;
  top: -3px;
  padding: 1rem;
  right: 0;
  cursor: pointer;
  ${(props) =>
    props.isPadded &&
    css`
      padding-right: 3rem;
    `}
`;

const ColNoPadLeft = styled(Col)`
  padding-left: 0;
`;

const ContextualIconDelete = styled(ContextualIcon)`
  position: absolute;
  top: 4px;
  padding: 1rem;
  right: 0;
  cursor: pointer;
`;

const DraftContainer = styled.div`
  position: relative;
  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  width: ${DRAFT_DEFAULT_WIDTH};
  max-width: ${DRAFT_DEFAULT_WIDTH};
  height: ${DRAFT_DEFAULT_HEIGHT};
  max-height: ${DRAFT_DEFAULT_HEIGHT};
  bottom: -1px;
  background-color: ${(props) => `rgb(${props.theme.color.white})`};

  ${(props) =>
    props.reduced &&
    css`
      height: ${DRAFT_BANNER_HEIGHT};
      min-height: ${DRAFT_BANNER_HEIGHT};
      max-height: ${DRAFT_BANNER_HEIGHT};
      width: ${DRAFT_BANNER_REDUCED_WIDTH};
      max-width: ${DRAFT_BANNER_REDUCED_WIDTH};
      overflow: hidden;
    `}
`;

const DraftContent = styled.div`
  position: relative;
  height: calc(100% - ${DRAFT_BANNER_HEIGHT});
  ${(props) =>
    props.reduced &&
    css`
      height: 0;
      overflow: hidden;
    `}
`;
const DraftBanner = styled.div`
  position: relative;
  padding: 0.8rem 1.2rem;
  height: ${DRAFT_BANNER_HEIGHT};
  ${(props) =>
    props.theme &&
    css`
      color: #fff;
      background-color: rgb(${props.theme.color.dark});
    `}
`;

const BannerText = styled(Text)`
  ${(props) =>
    props.reduced &&
    css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 50px;
      width: 100%;
      cursor: pointer;
    `}
`;

const DraftInformation = styled.div`
  position: relative;
  z-index: 2;
  padding: 0.8rem 1.2rem;
  // background-color: #fff;
  border-bottom: 1px solid ${(props) => `rgb(${props.theme.border.color})`};
`;

const DraftInformationLabel = styled(Label)`
  font-weight: normal;
  padding-top: 0.8rem;
  text-align: right;
  width: 100%;
  padding-right: 0;
`;

const DraftBody = styled.div`
  padding: 0.8rem 1.2rem;
  // background-color: #fff;
  padding-bottom: 170px;
  height: 100%;
`;

const DraftActions = styled.div`
  padding: 0.8rem 1.2rem;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  overflow: hidden;
  border-top: 1px solid ${(props) => `rgb(${props.theme.color.light})`};
`;

function Draft({
  dispatch,
  draft,
  recipients,
  collections,
  user,
  templates,
  translate,
}) {
  const editorRef = useRef();
  const [, notify] = useNotifications();

  const Templates = useMemo(() => {
    return map(templates, (t, k) => (
      <Button
        key={`template-${draft.id}-${k}-${t.id}`}
        small
        noMargin
        block
        light
        onClick={() => loadTemplateForDraft(user, dispatch)(draft.id, t.id)}
      >
        {t.name}
      </Button>
    ));
  }, [templates, draft.id, dispatch, user]);

  const sendMessage = useCallback(() => {
    createMessageFromDraft(
      user,
      dispatch
    )({ ...draft, body: editorRef.current.getHtmlContent() }).then(() => {
      notify({
        title: translate("messaging.draft.messageSentTitle"),
        body: translate("messaging.draft.messageSentBody"),
        dismissAfter: 3000,
      });
    });
  }, [user, dispatch, draft, translate]);

  return (
    <DraftContainer shadow responsive reduced={draft.reduced}>
      <DraftBanner>
        <BannerText
          reduced={draft.reduced}
          inline
          onClick={() =>
            draft.reduced && dispatch({ type: "toggleReduceDraft", draft })
          }
        >
          {draft.subject
            ? draft.subject
            : translate("messaging.draft.newMessage")}
        </BannerText>
        <ContextualIcon
          isPadded
          icon={ic_remove}
          size={18}
          onClick={() => dispatch({ type: "toggleReduceDraft", draft })}
        />
        <ContextualIcon
          icon={ic_close}
          size={18}
          onClick={() => {
            dispatch({
              type: "hideDraft",
              draft,
              valuesToSave: { body: editorRef.current.getHtmlContent() },
            });
          }}
        />
      </DraftBanner>
      <DraftContent reduced={draft.reduced}>
        <DraftInformation>
          {/* recipients */}
          <Row>
            <Col col={1} noPadding>
              <DraftInformationLabel>
                {translate("messaging.draft.to")}
              </DraftInformationLabel>
            </Col>
            <Col col={templates.length ? 9 : 11}>
              <RecipientsSelect
                placeholder=""
                value={draft.recipients}
                options={recipients}
                getOptionValue={(o) => o.id}
                getOptionLabel={(o) => o.name}
                onChange={(optionsSelected) => {
                  dispatch({
                    type: "updateDraftValue",
                    draft,
                    key: "recipients",
                    // value: map(optionsSelected, o => o.id)
                    value: optionsSelected,
                  });
                }}
              />
            </Col>
            {templates.length > 0 && (
              <ColNoPadLeft col={2}>
                <DropdownButton
                  noMargin
                  small
                  light
                  title={translate("messaging.draft.template")}
                >
                  {Templates}
                </DropdownButton>
              </ColNoPadLeft>
            )}
          </Row>
          <Margin bottom={2} />
          {/* subject */}
          <Row>
            <Col col={1} noPadding>
              <DraftInformationLabel>
                {translate("messaging.draft.subject")}
              </DraftInformationLabel>
            </Col>
            <Col col={6}>
              <SubjectInput
                value={draft.subject}
                onChange={(e) =>
                  dispatch({
                    type: "updateDraftValue",
                    draft,
                    key: "subject",
                    value: e.currentTarget.value,
                  })
                }
              />
            </Col>
            <ColNoPadLeft col={5}>
              <Select
                placeholder={translate("messaging.draft.collection")}
                block
                tabSelectsValue={false}
                small
                hideSelectedOptions={true}
                isClearable={true}
                options={collections}
                value={draft.collection}
                getOptionValue={(o) => o.id}
                getOptionLabel={(o) => o.name}
                onChange={(o) =>
                  dispatch({
                    type: "updateDraftValue",
                    draft,
                    key: "collection",
                    value: o,
                  })
                }
              />
            </ColNoPadLeft>
          </Row>
        </DraftInformation>
        <DraftBody>
          <HTMLEditor
            ref={editorRef}
            keyName={`editor-${draft.id}`}
            html={draft.body}
            onChange={(newHTML) =>
              dispatch({
                type: "updateDraftValue",
                draft,
                key: "body",
                value: newHTML,
              })
            }
          />
        </DraftBody>
        <DraftActions>
          <Button primary small onClick={sendMessage}>
            {translate("messaging.draft.send")}
          </Button>
          <ContextualIconDelete
            icon={ic_delete}
            size={22}
            onClick={() => dispatch({ type: "removeDraft", draft })}
          />
        </DraftActions>
      </DraftContent>
    </DraftContainer>
  );
}

export default React.memo(Draft);
