import React, { useMemo} from "react";
import IconButton from "@mui/material/IconButton";
import {DeleteOutline, DragIndicator} from "@mui/icons-material";
import {useDrag, useDrop} from 'react-dnd';
import styled from "styled-components";
import {Col, Input, Row} from "cdm-ui-components";
import {withLocalization} from "common/redux/hoc/withLocalization";
import {VirtualizedAutocomplete} from "cdm-shared/component/styled/form-controls/StyledAutocomplete";
import {FormField} from "cdm-shared/component/styled/form-controls/FormField";

const TransformationCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background-color: white;
  border-width: ${props => (props.isOver ? 2 : 1)}px;
  border-style:  ${props => (props.isOver ? 'dashed' : 'solid')};
  border-color: ${props => (props.isOver ? '#078DEE' : '#DFE3E8')};
  border-radius: 8px;
  opacity: ${props => (props.isDragging ? 0.4 : 1)};
  padding: 16px;
  margin-bottom: 16px;
  
  .actions {
    display: flex;
    flex-direction: column;
  }
  
  .form-content {
    flex: 1;
  }
`;

const outputFormatOptions = ['Jpeg', 'Png', 'Gif', 'Bmp'];
const exportImageTypeOptions = ['link', 'file'];

const ExportAssetsTransformationForm = ({
  transformation,
  availableTransformationOptions,
  formData,
  dirty,
  errors,
  translate,
  onFormFieldChange,
  onChange,
  onReorder,
  onDelete,
}) => {
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'transformation',
      item: { id: transformation.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [transformation.id]
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'transformation',
      drop: (item, e) => {
        if (onReorder) {
          onReorder(item.id, transformation.id);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [transformation.id, onReorder]
  );

  const transformationOptions = useMemo(() => {
    if (!transformation.discriminator) {
      return availableTransformationOptions;
    }
    return [transformation.discriminator, ...availableTransformationOptions];
  }, [transformation.discriminator, availableTransformationOptions]);

  return (
    <TransformationCard
      ref={drop}
      isOver={isOver}
      isDragging={isDragging}
    >
      <IconButton ref={drag} sx={{ cursor: 'move' }}>
        <DragIndicator />
      </IconButton>

      <div className="form-content" ref={preview}>
        <VirtualizedAutocomplete
          size="small"
          options={transformationOptions}
          placeholder={translate('video.export.transformation')}
          getOptionLabel={(option) => translate(`video.export.transformations.${option}`)}
          value={transformation.discriminator}
          onChange={(_, value) => onChange(transformation.id, { discriminator: value })}
        />

        {transformation.discriminator === 'ResizeTransformationViewModel' && (
          <>
            <br />
            <Row>
              <Col col={6}>
                <FormField error={dirty && errors.resizeWidth}>
                  <Input
                    block
                    type="number"
                    value={formData?.resizeWidth ?? ''}
                    placeholder={translate("video.form.width")}
                    onChange={(e) => onFormFieldChange("resizeWidth", e.target.value)}
                  />
                </FormField>
              </Col>
              <Col col={6}>
                <FormField error={dirty && errors.resizeHeight}>
                  <Input
                    block
                    type="number"
                    value={formData?.resizeHeight ?? ''}
                    placeholder={translate("video.form.height")}
                    onChange={(e) => onFormFieldChange("resizeHeight", e.target.value)}
                  />
                </FormField>
              </Col>
            </Row>
          </>
        )}

        {transformation.discriminator === 'ConvertFormatTransformationViewModel' && (
          <>
            <br/>
            <FormField error={dirty && errors.outputFormat}>
              <VirtualizedAutocomplete
                size="small"
                options={outputFormatOptions}
                getOptionLabel={(option) => option.toUpperCase()}
                placeholder={translate("video.export.outputFormat")}
                value={formData.outputFormat ?? ''}
                error={dirty && errors.outputFormat}
                onChange={(_, value) => onFormFieldChange("outputFormat", value)}
              />
            </FormField>
          </>
        )}
      </div>

      <IconButton color="error" onClick={onDelete}>
        <DeleteOutline/>
      </IconButton>
    </TransformationCard>
  );
}
export default withLocalization(ExportAssetsTransformationForm);
