import React, {useCallback, useMemo, useState} from "react";
import styled from "styled-components";
import { get } from "lodash";
import { Button, Input, Label, P, Tag, Textarea } from "cdm-ui-components";
import Box from "@mui/material/Box";
import {PieChart} from "@mui/x-charts";
import { launchActionById } from "cdm-shared/services/export";
import { ModalStyled } from "cdm-shared/component/styled/modal/ModalStyled";
import LoaderOverlay from "cdm-shared/component/LoaderOverlay";
import {FormField} from "cdm-shared/component/styled/form-controls/FormField";
import useNotifications from "cdm-shared/hook/useNotifications";
import {EmailInput} from "./EmailInput";

const FormWrapper = styled.div`
  position: relative;
  display: ${(props) => props.hidden ? 'none' : 'flex'};
  flex-direction: column;
  gap: 15px;
`;

const CustomTextarea = styled(Textarea)`
  width: 100%;
  box-shadow: var(--input-box-shadow);
  background-color: var(--input-bg);
`;

const SendEmailModal = ({
  actionResult,
  translate,
  onClose,
}) => {
  const [, notify] = useNotifications();

  const [to, setTo] = useState([]);
  const [cc, setCc] = useState([]);
  const [bcc, setBcc] = useState([]);
  const [subject, setSubject] = useState('');
  const [subjectDirty, setSubjectDirty] = useState(false);
  const [content, setContent] = useState('');
  const [shouldCopy, setShouldCopy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);

  const status = get(actionResult, 'status');
  const numberOfExportedTradeItems = Number(get(actionResult, 'output.NumberOfExportedTradeItems')) || 0;
  const numberOfExportableTradeItems = Number(get(actionResult, 'output.NumberOfExportableTradeItems')) || 0;
  const numberOfNotExportableTradeItems = Number(get(actionResult, 'output.NumberOfNotExportableTradeItems')) || 0;
  const numberOfExportableTradeItemsWithWarning = Number(get(actionResult, 'output.NumberOfExportableTradeItemsWithWarning')) || 0;

  const errors = useMemo(() => {
    const errors = {};
    if (dirty) {
      if (!to.length) {
        errors.to = translate("export.sendEmail.required");
      }
      if (to && !/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(to)) {
        errors.to = translate("export.sendEmail.invalidEmail");
      }
    }
    if (!subject && subjectDirty) {
      errors.subject = translate("export.sendEmail.required");
    }
    return errors;
  }, [translate, to, subject, dirty, subjectDirty]);

  const notifyResult = useCallback((title, description, type = "success") => {
    notify({
      title: translate(title),
      body: translate(...(Array.isArray(description) ? description : [description])),
      severity: type,
      dismissAfter: 3000,
    });
  }, [notify, translate]);

  const onSubmit = () => {
    setDirty(true);
    setSubjectDirty(true);

    if (!to.length || !/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(to) || !subject) return;

    const data = {
      To: to.join(),
      Cc: cc.join(),
      BCC: bcc.join(),
      Subject: subject,
      Body: content,
      ReceiveACopy: shouldCopy,
      AttachmentsFromActionResultId: actionResult.id,
    };

    // TODO: hard coded action id
    const actionId = 'd67073d5-d78f-4399-8ed5-6eded400e736';
    setLoading(true);
    launchActionById(actionId, data).then((result) => {
      if (!result.data?.success) {
        throw new Error();
      }
      notifyResult('export.sendEmail.title', 'export.sendEmail.sendingEmailSuccess');
      onClose(result);
    }).catch(() => {
      notifyResult('export.sendEmail.title', 'export.sendEmail.sendingEmailFailed', 'error');
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <ModalStyled
      sm
      style={{ padding: '1rem 2rem 2rem' }}
    >
      {loading && <LoaderOverlay />}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <h2>{translate('export.sendEmail.title')}</h2>

        <Box sx={{ textAlign: 'right', mt: 1 }}>
          <Tag
            success={status === 'Successful'}
            danger={status === 'Failed'}
            info={status === 'InProgress'}
            medium
            noMargin
            style={{ padding: '0.5em 1em' }}
          >
            {translate(`export.actionExecutionResult.${status}`)}
          </Tag>
        </Box>
      </Box>

      <Box display="flex" justifyContent="flex-center">
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: numberOfExportableTradeItems, label: translate('tradeItemEligibility.common.Exportable'), color: '#30dea7' },
                { id: 1, value: numberOfNotExportableTradeItems, label: translate('tradeItemEligibility.common.NotExportable'), color: '#d2234d' },
                { id: 2, value: numberOfExportableTradeItemsWithWarning, label: translate('tradeItemEligibility.common.ExportableWithWarning'), color: '#ffe125' },
                { id: 3, value: numberOfExportedTradeItems, label: translate('export.requestdetail.totalExportedTradeItems'), color: '#2687ff' },
              ],
              innerRadius: 30,
              outerRadius: 100,
              cornerRadius: 5,
            },
          ]}
          height={200}
        />
      </Box>

      <FormWrapper>
        <EmailInput
          label={translate('export.sendEmail.to')}
          value={to}
          required
          error={errors.to}
          onChange={setTo}
        />

        <EmailInput
          label={translate('export.sendEmail.cc')}
          value={cc}
          error={errors.cc}
          onChange={setCc}
        />

        <EmailInput
          label={translate('export.sendEmail.bcc')}
          value={bcc}
          error={errors.bcc}
          onChange={setBcc}
        />

        <FormField error={!!errors.subject}>
          <Label block>{translate('export.sendEmail.subject')} *</Label>
          <Input
            value={subject}
            block
            onChange={(e) => setSubject(e.target.value)}
            onBlur={() => setSubjectDirty(true)}
          />
          {errors.subject && (<P>{errors.subject}</P>)}
        </FormField>

        <FormField>
          <Label block>{translate('export.sendEmail.content')}</Label>
          <CustomTextarea
            rows={6}
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}/>
        </FormField>

        <Box display="flex" gap="4px" alignItems="center">
          <Input
            id="want-to-receive-copy"
            type="checkbox"
            checked={shouldCopy}
            style={{ height: "fit-content" }}
            onChange={(e) => setShouldCopy(e.target.checked)}
          />
          &nbsp;
          <Label htmlFor="want-to-receive-copy" style={{ marginBottom: 0 }}>{translate("export.sendEmail.wantToReceiveCopy")}</Label>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Button small light onClick={onClose}>
            {translate('export.sendEmail.cancel')}
          </Button>
          <Button
            small
            primary={!Object.keys(errors).length}
            light={Object.keys(errors).length > 0}
            style={{ marginRight: "0" }}
            disabled={Object.keys(errors).length > 0}
            onClick={onSubmit}
          >
            {translate('export.sendEmail.send')}
          </Button>
        </Box>
      </FormWrapper>
    </ModalStyled>
  );
};

export default SendEmailModal;
