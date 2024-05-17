import React from "react";
import map from "lodash/map";
import find from "lodash/find";
import get from "lodash/get";
import filter from "lodash/filter";
import DropDown from "../common/layout/DropDown";
import CustomButton from "../common/layout/CustomButton";
import indexOf from "lodash/indexOf";
import { Margin, H5, Icon } from "cdm-ui-components";
import {
  InputWrap,
  DivWrap,
  ContainerWrap,
  LabelWrap,
  CheckboxWrap,
  TitleWrap,
} from "./styles";
import {
  PRIMARY,
  BLACKLIGHT,
  WHITESMOKE,
} from "cdm-shared/component/color";
import {
  getSelectedOption,
  getNewImageType,
} from "./utils";
import dotProp from "dot-prop-immutable";
import LanguageSelect from "cdm-shared/component/lang/LanguageSelect";
import { trashO } from "react-icons-kit/fa/trashO";

const EntitiesForm = ({
    translate,
    setEntitiesType,
    modalValueSet,
    manufacturerdata,
    entity,
    onChange,
    saveEntity,
    matrixMappings,
    targetMarkets,
    taxonomies,
    languages,
    businessRulesSets,
    retailers,
    imageCategories
}) => {
  return (
    <>
      <DivWrap justifyContent={`space-between`}>
        <div>
          <CustomButton
            style={{ marginRight: 10 }}
            loader={false}
            onClick={saveEntity}
            backgroundColor={PRIMARY}
            padding={`4px 8px`}
            title={translate("manufacturer.main.create")}
          />
          <CustomButton
            loader={false}
            onClick={() => {
                setEntitiesType("list");
            }}
            backgroundColor={BLACKLIGHT}
            padding={`4px 8px`}
            title={translate("manufacturer.main.cancel")}
          />
        </div>
        <div>
          <CustomButton
            loader={false}
            onClick={modalValueSet("Trigger Polling")}
            backgroundColor={WHITESMOKE}
            padding={`4px 8px`}
            color={BLACKLIGHT}
            title={translate("manufacturer.add_edit.trigger_polling")}
          />
        </div>
      </DivWrap>
      <Margin bottom={5} />
      <ContainerWrap>
        {/* Manufacturer entity information */}
        <H5>
          {translate("manufacturer.entity.manufacturer_entity_information")}
        </H5>

        {manufacturerdata.id && (
          <DivWrap>
            <LabelWrap>
              {translate("manufacturer.entity.manufacturer_entity_id")}
            </LabelWrap>
            <Margin left={4} />
            <InputWrap
              disabled={true}
              type="text"
              value={manufacturerdata.id || ""}
            />
          </DivWrap>
        )}
        <DivWrap>
          <LabelWrap>{translate("manufacturer.entity.name")}</LabelWrap>
          <Margin left={4} />
          <InputWrap
            type="text"
            value={entity.name || ""}
            onChange={(e) => onChange("name")(e.target.value)}
          />
        </DivWrap>

        <DivWrap>
          <LabelWrap>
            {translate("manufacturer.entity.retailers_network")}
          </LabelWrap>
          <Margin left={4} />
          <DropDown
            isMulti
            className={"select-styling-full"}
            value={filter(
              retailers,
              (tm) => !!find(entity.retailerIds, (tmId) => tm.id === tmId)
            )}
            isSearchable={true}
            options={retailers}
            onChange={(e) =>
              e === null
                ? onChange("retailerIds")([])
                : onChange("retailerIds")(map(e, "id"))
            }
            getOptionLabel={(o) => get(o, "name")}
            getOptionValue={(o) => get(o, "id")}
          />
        </DivWrap>

        {/* Import settings */}
        <ImportSettingsForm
          settings={entity.importSettings}
          onChange={onChange}
          {...{
            matrixMappings,
            targetMarkets,
            taxonomies,
            languages,
            imageCategories,
          }}
        />
        {/* Export settings */}
        <ExportSettingsForm
          settings={entity.exportSettings || {}}
          onChange={onChange}
          {...{ matrixMappings, targetMarkets, languages, imageCategories }}
        />

        {/* FTP connection strings */}
        <FTPSettingsForm
          importSettings={entity?.importSettings || {}}
          settings={entity?.importSettings?.ftpConnectionSettings || {}}
          onChange={onChange}
        />

        {/* Business rules sets */}
        <DivWrap>
          <LabelWrap>Business rules sets</LabelWrap>
          <Margin left={4} />
          <DropDown
            isMulti
            className="select-styling-full"
            closeMenuOnSelect={false}
            value={filter(
              businessRulesSets,
              (r) =>
                indexOf(
                  get(entity, "importSettings.businessRulesIds", []),
                  r.id
                ) !== -1
            )}
            onChange={(e) =>
              e === null
                ? onChange("importSettings")({
                    ...entity?.importSettings,
                    businessRulesIds: [],
                })
                : onChange("importSettings")({
                    ...entity?.importSettings,
                    businessRulesIds: map(e, "id"),
                })
            }
            isClearable={true}
            getOptionLabel={(o) => o.name}
            getOptionValue={(o) => o.id}
            options={businessRulesSets}
          />
        </DivWrap>
      </ContainerWrap>
    </>
  );
};

const ExportSettingsForm = ({ settings, onChange }) => {
  return (
    <div>
      <TitleWrap font={`20px`}>{`Export settings`}</TitleWrap>
      {/* Resource base URL */}
      <DivWrap>
        <LabelWrap>{`Resource base URL`}</LabelWrap>
        <Margin left={4} />
        <InputWrap
          type="text"
          value={settings?.baseUrl || ""}
          onChange={(e) => {
            onChange("exportSettings")({
              ...settings,
              baseUrl: e.target.value,
            });
          }}
        />
      </DivWrap>
    </div>
  );
};

const ImportSettingsForm = ({
  settings,
  matrixMappings,
  targetMarkets,
  taxonomies,
  languages,
  imageCategories,
  onChange,
}) => {
  const change = (type) => (k, v) =>
    onChange(type)(dotProp.set(settings, k, v));
  return (
    <div>
      <TitleWrap font={`20px`}>Import settings</TitleWrap>

      {/* Matrix mapping */}
      <DivWrap>
        <LabelWrap>{`Matrix mapping`}</LabelWrap>
        <Margin left={4} />
        <DropDown
          className={"select-styling-full"}
          value={getSelectedOption(settings?.matrixMappingId, matrixMappings)}
          onChange={(e) => {
            onChange("importSettings")({
              ...settings,
              matrixMappingId: e.id,
            });
          }}
          isSearchable={true}
          options={matrixMappings}
          getOptionLabel={(o) => get(o, "mappingTitle")}
          getOptionValue={(o) => get(o, "id")}
        />
      </DivWrap>

      {/* Default import language */}
      <DivWrap>
        <LabelWrap>{`Default import language*`}</LabelWrap>
        <Margin left={4} />
        <LanguageSelect
          className={"select-styling-full"}
          value={getSelectedOption(
            settings?.defaultImportLanguageId,
            languages
          )}
          onChange={(e) => {
            onChange("importSettings")({
              ...settings,
              defaultImportLanguageId: e.id,
            });
          }}
          isSearchable={true}
          options={languages}
          getOptionLabel={(o) => get(o, "code")}
          getOptionValue={(o) => get(o, "id")}
        />
      </DivWrap>

      {/* Taxonomy */}
      <DivWrap>
        <LabelWrap>{`Matrix mapping`}</LabelWrap>
        <Margin left={4} />
        <DropDown
          className={"select-styling-full"}
          isClearable={true}
          options={taxonomies}
          value={getSelectedOption(settings?.taxonomyId, taxonomies)}
          onChange={(e) => {
            onChange("importSettings")({
              ...settings,
              taxonomyId: e.id,
            });
          }}
          isSearchable={true}
          getOptionLabel={(o) => get(o, "name")}
          getOptionValue={(o) => get(o, "id")}
        />
      </DivWrap>

      {/* Default target market */}
      <DivWrap>
        <LabelWrap>{`Default target market`}</LabelWrap>
        <Margin left={4} />
        <DropDown
          className={"select-styling-full"}
          isClearable={true}
          options={targetMarkets}
          value={getSelectedOption(
            settings?.defaultImportTargetMarketId,
            targetMarkets
          )}
          onChange={(e) => {
            onChange("importSettings")({
              ...settings,
              defaultImportTargetMarketId: e.id,
            });
          }}
          isSearchable={true}
          getOptionLabel={(o) => get(o, "name")}
          getOptionValue={(o) => get(o, "id")}
        />
      </DivWrap>

      {/* Media directory */}
      <DivWrap>
        <LabelWrap>{`Media directory`}</LabelWrap>
        <Margin left={4} />
        <InputWrap
          type="text"
          value={settings?.mediaDirectory || ""}
          onChange={(e) => {
            onChange("importSettings")({
              ...settings,
              mediaDirectory: e.target.value,
            });
          }}
        />
      </DivWrap>

      {/* fullMediaDirectory */}
      <DivWrap>
        <LabelWrap>{`Full media directory`}</LabelWrap>
        <Margin left={4} />
        <InputWrap
          type="text"
          value={settings?.fullMediaDirectory || ""}
          onChange={(e) => {
            onChange("importSettings")({
              ...settings,
              fullMediaDirectory: e.target.value,
            });
          }}
        />
      </DivWrap>

      {/* Images regex */}
      <DivWrap>
        <LabelWrap>{`Images regex`}</LabelWrap>
        <Margin left={4} />
        <InputWrap
          type="text"
          value={settings?.imageRegex || ""}
          onChange={(e) => {
            onChange("importSettings")({
              ...settings,
              imageRegex: e.target.value,
            });
          }}
        />
      </DivWrap>

      {/* Images Types */}
      <div className="form-group field field-string">
        <DivWrap>
          <LabelWrap>{`Image Type Mappings`}</LabelWrap>
          <Margin left={4} />
          <CheckboxWrap>
            <CustomButton
              loader={false}
              onClick={(e) => {
                e.preventDefault();
                onChange("importSettings")({
                  ...settings,
                  imageTypeMappings: [
                    ...get(settings, "imageTypeMappings", []),
                    getNewImageType(),
                  ],
                });
              }}
              backgroundColor={BLACKLIGHT}
              padding={`4px 8px`}
              title={`+ Add new image type mapping`}
            />
          </CheckboxWrap>
        </DivWrap>

        {map(
          get(settings, "imageTypeMappings", []),
          (imageType, imageTypeKey) => (
            <DivWrap
              width={`100%`}
              justifyContent={`space-between`}
              key={`image-type-${imageTypeKey}`}
            >
              <DivWrap width={`40%`}>
                <DropDown
                  className={"select-styling-full"}
                  options={imageCategories}
                  value={[imageType.imageCategory]}
                  onChange={(option) =>
                    change("importSettings")(
                      "imageTypeMappings",
                      dotProp.set(
                        settings?.imageTypeMappings,
                        `${imageTypeKey}.imageCategory`,
                        option
                      )
                    )
                  }
                  isSearchable={true}
                  getOptionLabel={(o) => o}
                  getOptionValue={(o) => o}
                />
              </DivWrap>
              <DivWrap width={`40%`}>
                <InputWrap
                  type="text"
                  value={imageType.value || ""}
                  onChange={(e) =>
                    change("importSettings")(
                      "imageTypeMappings",
                      dotProp.set(
                        settings?.imageTypeMappings,
                        `${imageTypeKey}.value`,
                        e.target.value
                      )
                    )
                  }
                />
              </DivWrap>
              <DivWrap width={`10%`}>
                <Icon
                  size={20}
                  icon={trashO}
                  onClick={(e) => {
                    e.preventDefault();
                    change("importSettings")(`imageTypeMappings`, [
                      ...get(settings, `imageTypeMappings`, []).slice(
                        0,
                        imageTypeKey
                      ),
                      ...get(settings, `imageTypeMappings`, []).slice(
                        imageTypeKey + 1
                      ),
                    ]);
                  }}
                />
              </DivWrap>
            </DivWrap>
          )
        )}
      </div>

      {/* Video regex */}
      <DivWrap>
        <LabelWrap>{`Video regex`}</LabelWrap>
        <Margin left={4} />
        <InputWrap
          type="text"
          value={settings?.videoRegex || ""}
          onChange={(e) => {
            onChange("importSettings")({
              ...settings,
              videoRegex: e.target.value,
            });
          }}
        />
      </DivWrap>

      {/* Matrix regex */}
      <DivWrap>
        <LabelWrap>{`Matrix regex`}</LabelWrap>
        <Margin left={4} />
        <InputWrap
          type="text"
          value={settings?.matrixRegex || ""}
          onChange={(e) => {
            onChange("importSettings")({
              ...settings,
              matrixRegex: e.target.value,
            });
          }}
        />
      </DivWrap>
    </div>
  );
};

const FTPSettingsForm = ({ importSettings, settings, onChange }) => {
  return (
    <div>
      <TitleWrap font={`20px`}>{`FTP connection strings`}</TitleWrap>
      {/* URL */}
      <DivWrap>
        <LabelWrap>{`URL`}</LabelWrap>
        <Margin left={4} />
        <InputWrap
          type="text"
          value={settings?.url}
          onChange={(e) => {
            onChange("importSettings")({
              ...importSettings,
              ftpConnectionSettings: {
                ...settings,
                url: e.target.value,
              },
            });
          }}
        />
      </DivWrap>

      {/* Username */}
      <DivWrap>
        <LabelWrap>{`Username`}</LabelWrap>
        <Margin left={4} />
        <InputWrap
          type="text"
          value={settings?.username}
          onChange={(e) => {
            onChange("importSettings")({
              ...importSettings,
              ftpConnectionSettings: {
                  ...settings,
                  username: e.target.value,
              },
            });
          }}
        />
      </DivWrap>

      {/* Password */}
      <DivWrap>
        <LabelWrap>{`Password`}</LabelWrap>
        <Margin left={4} />
        <InputWrap
          type="text"
          value={settings?.password}
          onChange={(e) => {
            onChange("importSettings")({
              ...importSettings,
              ftpConnectionSettings: {
                ...settings,
                password: e.target.value,
              },
            });
          }}
        />
      </DivWrap>

      {/* Path */}
      <DivWrap>
        <LabelWrap>{`Path`}</LabelWrap>
        <Margin left={4} />
        <InputWrap
          type="text"
          value={settings?.path}
          onChange={(e) => {
            onChange("importSettings")({
              ...importSettings,
              ftpConnectionSettings: {
                ...settings,
                path: e.target.value,
              },
            });
          }}
        />
      </DivWrap>
    </div>
  );
};

export default EntitiesForm;
