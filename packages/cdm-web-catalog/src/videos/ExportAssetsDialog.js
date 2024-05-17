import React, {useCallback, useEffect, useMemo, useState} from "react";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {Button, Col, Label, Row} from "cdm-ui-components";
import {withLocalization} from "common/redux/hoc/withLocalization";
import {ModalStyled} from "cdm-shared/component/styled/modal/ModalStyled";
import {VirtualizedAutocomplete} from "cdm-shared/component/styled/form-controls/StyledAutocomplete";
import {getManufacturerNamingConventions, getRetailerNamingConventions} from "cdm-shared/services/settings";
import {isManufacturer} from "cdm-shared/redux/hoc/withAuth";
import {launchExportDigitalAssetsAction} from "cdm-shared/services/export";
import useNotifications from "cdm-shared/hook/useNotifications";
import LoaderOverlay from "cdm-shared/component/LoaderOverlay";
import {newUuid} from "cdm-shared/utils/random";
import ExportAssetTransformationForm from "./ExportAssetTransformationForm";
import {FormField} from "cdm-shared/component/styled/form-controls/FormField";

const transformationOptions = ['ResizeTransformationViewModel', 'CropBackgroundTransformationViewModel', 'ConvertFormatTransformationViewModel'];

const ExportAssetsDialog = ({ user, assetType, assets, translate, onClose }) => {
  const [, notify] = useNotifications();

  const [formData, setFormData] = useState({});
  const [dirty, setDirty] = useState(false);
  const [namingConventions, setNamingConventions] = useState([]);
  const [transformations, setTransformations] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const namingConventionOptions = useMemo(() => (
    namingConventions.map((item) => item.id)
  ), [namingConventions]);

  const availableTransformationOptions = useMemo(() => {
    const options = transformations.map((item) => item.discriminator);
    return transformationOptions.filter((item) => !options.includes(item));
  }, [transformations]);

  const errors = useMemo(() => {
    const messages = {};
    if (!formData.namingConvention) {
      messages.namingConvention = 'Required';
    }
    if (assetType === 'image') {
      if (!availableTransformationOptions.includes('ResizeTransformationViewModel')) {
        if (!formData.resizeWidth || Number(formData.resizeWidth) <= 0) {
          messages.resizeWidth = 'Required';
        }
        if (!formData.resizeHeight || Number(formData.resizeHeight) <= 0) {
          messages.resizeHeight = 'Required';
        }
      }
      if (!availableTransformationOptions.includes('ConvertFormatTransformationViewModel')) {
        if (!formData.outputFormat) {
          messages.outputFormat = 'Required';
        }
      }
    }
    return messages;
  }, [assetType, availableTransformationOptions, formData]);

  useEffect(() => {
    const getNamingConventions = isManufacturer(user) ? getManufacturerNamingConventions : getRetailerNamingConventions;
    getNamingConventions(assetType).then((res) => {
      setNamingConventions(res.data);
    });
  }, [user, assetType]);

  const onUpdateField = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const notifyResult = useCallback((title, description, type = "success") => {
    notify({
      title: translate(title),
      body: translate(...(Array.isArray(description) ? description : [description])),
      severity: type,
      dismissAfter: 3000,
    });
  }, [notify, translate]);

  const onAddTransformation = () => {
    if (!availableTransformationOptions.length) {
      return;
    }

    setTransformations((prev) => [
      ...prev,
      {
        id: newUuid(),
        discriminator: availableTransformationOptions[0],
      },
    ]);
  };

  const onUpdateTransformation = (transformationId, updates) => {
    setTransformations((prev) => (
      prev.map((item) => (
        item.id === transformationId ? {...item, ...updates} : item
      ))
    ));
  };

  const onDeleteTransformation = (transformationId) => {
    setTransformations((prev) => (
      prev.filter((item) => item.id !== transformationId)
    ));
  };

  const onReorderTransformations = useCallback((from, to) => {
    if (from === to) {
      return;
    }

    setTransformations((prev) => {
      const transformations = [...prev];
      const fromId = transformations.findIndex((item) => item.id === from);
      const toId = transformations.findIndex((item) => item.id === to);
      const item = transformations.splice(fromId, 1);
      transformations.splice(toId, 0, ...item);
      return transformations;
    });
  }, []);

  const onExport = () => {
    setDirty(true);
    if (Object.keys(errors).length) {
      return;
    }

    let imageTransformations = [];
    if (assetType === 'image') {
      imageTransformations = transformations.map((item) => {
        if (item.discriminator === 'ResizeTransformationViewModel') {
          return {
            discriminator: item.discriminator,
            width: Number(formData.resizeWidth),
            height: Number(formData.resizeHeight),
          }
        }
        if (item.discriminator === 'ConvertFormatTransformationViewModel') {
          return {
            discriminator: item.discriminator,
            targetImageFormat: formData.outputFormat,
          }
        }
        return {
          discriminator: item.discriminator,
        }
      });
    }

    setSubmitting(true);
    launchExportDigitalAssetsAction({
      discriminator: 'ExportDigitalAssetsActionViewModel',
      digitalAssetIds: assets.map((item) => item.id),
      namingConventionId: formData.namingConvention,
      imageTransformations,
    }).then(async (res) => {
      if (res.data?.errorMessages?.length) {
        throw res.data?.errorMessages;
      }
      notifyResult('video.export.export', 'video.export.exportSuccessMessage');
      onClose();
    }).catch(() => {
      notifyResult('video.export.export', 'video.export.exportFailedMessage', 'error');
    }).finally(() => {
      setSubmitting(false);
    });
  };

  return (
    <ModalStyled sm>
      <FormField error={dirty && errors.namingConvention}>
        <Label block>{translate("video.export.namingConventionLabel")}</Label>
        <VirtualizedAutocomplete
          size="small"
          options={namingConventionOptions}
          getOptionLabel={(option) => namingConventions.find((item) => item.id === option)?.name || option}
          value={formData.namingConvention ?? ''}
          error={dirty && errors.namingConvention}
          onChange={(_, value) => onUpdateField("namingConvention", value)}
        />
      </FormField>
      <br/>

      {assetType === 'image' && (
        <DndProvider backend={HTML5Backend}>
          {transformations.map((transformation) => (
            <ExportAssetTransformationForm
              key={transformation.id}
              transformation={transformation}
              availableTransformationOptions={availableTransformationOptions}
              formData={formData}
              dirty={dirty}
              errors={errors}
              onFormFieldChange={onUpdateField}
              onChange={onUpdateTransformation}
              onDelete={() => onDeleteTransformation(transformation.id)}
              onReorder={onReorderTransformations}
            />
          ))}

          {transformations.length < transformationOptions.length && (
            <Button
              type="button"
              small
              primary
              onClick={onAddTransformation}
            >
              {translate("video.export.addTransformation")}
            </Button>
          )}
        </DndProvider>
      )}

      <Row
        right
        style={{marginTop: "30px"}}
      >
        <Col col right>
          <Button type="button" small light onClick={onClose}>
          {translate("common.cancel")}
          </Button>
          <Button small primary noMargin onClick={onExport}>
            {translate("video.export.export")}
          </Button>
        </Col>
      </Row>

      {submitting && (
        <LoaderOverlay />
      )}
    </ModalStyled>
  );
}
export default withLocalization(ExportAssetsDialog);
