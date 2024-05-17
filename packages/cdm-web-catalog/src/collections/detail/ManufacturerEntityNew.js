import React, { useEffect, useState } from "react";
import withUser, { getManufacturerId } from "cdm-shared/redux/hoc/withUser";
import {
  checkExistingManufacturerEntityName,
  createManufacturerEntity,
  saveManufacturerEntityById,
} from "cdm-shared/services/manufacturer";
import {
  getLanguages,
  getTargetMarkets,
} from "cdm-shared/services/targetMarket";
import { getTaxonomies } from "cdm-shared/services/taxonomy";
import { Button, Input, Label, Loader, Padding } from "cdm-ui-components";
import { cloneDeep, get, isEmpty } from "lodash";
import CreateNonStandardMaxtrix from "./CreateNonStandardMaxtrix";
import { withLocalization } from "common/redux/hoc/withLocalization";
import {
  createNonStandardMapping,
  uploadFilePriceMaxtrixMapping,
  saveNonStandardMatrixAnalysis,
  updateNonStandardMapping,
  updateStandardMapping,
  getNonStandardMatrixAnalysis,
} from "cdm-shared/services/maxtrixMapping";
import { ModalTitleStyled } from "cdm-shared/component/styled/modal/ModalStyled";
import { Alert, Tab, Tabs } from "@mui/material";
import PriceMatrixAnalysisForm from "./PriceMatrixAnalysisForm";
import MappingMatrixEditForm from "./MappingMatrixEditForm";
import { isStandardMapping } from "./CollectionMatixMapping";
import { StickyFooterRow } from "../../styled-components/modal/sticky-footer-row";
import styled from "styled-components";
import LoaderOverlay from "cdm-shared/component/LoaderOverlay";
import {
  convertMatrixAnalysisValuesFromBackendBase,
  convertMatrixAnalysisValuesToBackendBase,
} from "./helpers";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding-top: 2rem;
`;

const Wrapper = styled.div`
  padding-left: 2rem;
  padding-right: 2rem;
  overflow-y: auto;
  height: 100%;
`;

const CustomizedFooterRow = styled(StickyFooterRow)`
  background-color: #fff;
  padding-bottom: 2rem;
  padding-right: 2rem;
`;

const DEFAULT_TAXONOMY_NAME = "Cedemo";
const DEFAULT_LANGUAGE_CODE = "fr-FR";
const TABS = {
  SHEET_CONFIGURATION: 0,
  MAPPING: 1,
};

function ManufacturerEntityNew({
  importFile,
  existingManufacturerEntity,
  existingMatrixMapping,
  user,
  onSuccess,
  onClose,
  translate,
}) {
  const isEdit = !!existingManufacturerEntity;
  const [manufacturerEntity, setManufacturerEnttiy] = useState({
    name: "",
  });
  const [isManufacturerEntityNameValid, setIsManufacturerEntityNameValid] =
    useState(true);
  const [
    isCheckingManufacturerEntityName,
    setIsCheckingManufacturerEntityName,
  ] = useState(false);

  const [manufacturerEntityId, setManufacturerEntityId] = useState(null);
  const [taxonomyLoading, setTaxonomyLoading] = useState(false);
  const [taxonomy, setTaxonomy] = useState(null);

  const [languageLoading, setLanguageLoading] = useState(false);
  const [language, setLanguage] = useState(null);

  const [targetMarketLoading, setTargetMarketLoading] = useState(false);
  const [targetMarket, setTargetMarket] = useState(null);

  const [isTouchedField, setIsTouchedFields] = useState(false);

  const [selectedTab, setSelectedTab] = useState(0);

  const [loading, setLoading] = useState(false);
  const [showCreateNonStandardMaxtrix, setShowCreateNonStandardMaxtrix] =
    useState(false);

  const [matrixAnalysis, setMatrixAnalysis] = useState(null);
  const [savedMatrixAnalysis, setSavedMatrixAnalysis] = useState(null);
  const [isSavedMatrixAnalysis, setIsSavedMatrixAnalysis] = useState(false);
  const [showNextButton, setShowNextButton] = useState(!isEdit);

  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedMappingData, setSelectedMappingData] = useState(null);

  const [error, setError] = useState(null);

  const [isChangedMapping, setIsChangedMapping] = useState(false);

  const isChangedName = existingManufacturerEntity
    ? existingManufacturerEntity.name !== manufacturerEntity.name
    : !!manufacturerEntity.name;

  const onUpload = (file) => {
    setUploadingFile(true);
    uploadFilePriceMaxtrixMapping(file)
      .then((res) => {
        setMatrixAnalysis(convertMatrixAnalysisValuesFromBackendBase(res.data));
      })
      .finally(() => {
        setUploadingFile(false);
      });
  };

  const buildMatrixMapping = (_matrixAnalysis) => {
    return {
      manufacturerId: getManufacturerId(user),
      matrixAnalysisId: get(_matrixAnalysis, "id"),
      mappingTitle: `${get(manufacturerEntity, "name")}_mapping`,
      taxonomyId: get(taxonomy, "id"),
      discriminator: "NonStandardMappingViewModel",
      tradeItemCategory: {
        discriminator: "TradeItemCategoryViewModel",
      },
      mappingGroups:
        selectedMappingData && !isEmpty(selectedMappingData.mappingGroups)
          ? selectedMappingData.mappingGroups
          : [
              {
                groupIndex: 0,
                groupName: "PRICING",
                mappingTabs: [],
                sheet: 0,
              },
            ],
    };
  };

  const onSaveMaxtrixMappingHandler = async (createdMatrixAnalysis) => {
    return createNonStandardMapping(
      buildMatrixMapping(createdMatrixAnalysis)
    ).then((res) => {
      return res.data;
    });
  };

  const onCloseHandler = () => {
    onClose && onClose(manufacturerEntityId);
  };

  const onNextHandler = async () => {
    setLoading(true);
    if (matrixAnalysis) {
      const createdMatrixAnalysis = await saveMaxtrixAnalysis();
      setSelectedMappingData(buildMatrixMapping(createdMatrixAnalysis));
      setIsSavedMatrixAnalysis(true);
    }
  };

  const onSaveHandler = async () => {
    setIsTouchedFields(true);

    if (
      selectedMappingData &&
      selectedMappingData.id &&
      manufacturerEntity &&
      manufacturerEntity.id
    ) {
      await updateMaxtrixMapping();
      if (manufacturerEntity && manufacturerEntity.id) {
        await saveManufacturerEntityById(manufacturerEntity.id, {
          ...manufacturerEntity,
        }).then((res) => {
          if (res.status === 200) {
            onSuccess && onSuccess(res.data);
          }
          setLoading(false);
        });
      }

      if (selectedTab === TABS.MAPPING || isEdit) {
        onCloseHandler();
      }
      return;
    }

    if (!manufacturerEntity.name || !taxonomy || !language) {
      return;
    }
    setLoading(true);
    let createdMatrixMapping = null;
    if (matrixAnalysis) {
      const createdMatrixAnalysis = await saveMaxtrixAnalysis();
      createdMatrixMapping = await onSaveMaxtrixMappingHandler(
        createdMatrixAnalysis
      );
    }
    await createManufacturerEntity({
      ...manufacturerEntity,
      manufacturerId: getManufacturerId(user),
      importSettings: {
        matrixMappingId: get(createdMatrixMapping, "id"),
        defaultImportLanguageId: get(language, "id"),
        taxonomyId: get(taxonomy, "id"),
        ftpConnectionSettings: {
          url: "",
          username: "",
          password: "",
          path: "",
        },
        businessRulesIds: [],
        defaultImportTargetMarketId: get(targetMarket, "id"),
        facingTypeMappings: [],
        fullMediaDirectory: null,
        imageRegex: "",
        imageTypeMappings: [],
        matrixRegex: null,
        mediaDirectory: null,
        plungeAngleMappings: [],
        tagMappings: [],
        videoRegex: null,
      },
      exportSettings: { baseUrl: null },
      retailerIds: [],
    })
      .then((res) => {
        if (res.status === 200) {
          setSelectedMappingData(createdMatrixMapping);
          setManufacturerEntityId(res.data);

          if (selectedTab === TABS.MAPPING || isEdit) {
            onCloseHandler();
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (
          err.response &&
          get(err.response, "data.ErrorCode") ===
            "AlreadyUsedManufacturerEntityNameException"
        ) {
          setError("The name is already used. Please choose another name.");
        }
      });
  };

  const saveMaxtrixAnalysis = async () => {
    setLoading(true);
    return saveNonStandardMatrixAnalysis(
      convertMatrixAnalysisValuesToBackendBase(matrixAnalysis)
    )
      .then((res) => {
        if (res.status === 200) {
          setSavedMatrixAnalysis(res.data);
          return res.data;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onChangeMappingTabDataHandler = (mappingTab) => {
    const newMappingData = cloneDeep(selectedMappingData);
    const mappingGroups = newMappingData.mappingGroups;

    const pricingMappingGroupIdx = mappingGroups.findIndex(
      (g) => g.groupName === "PRICING"
    );

    const pricingMappingGroup = mappingGroups[pricingMappingGroupIdx];

    const existingMappingTabIdx = pricingMappingGroup.mappingTabs.findIndex(
      (t) => t.sheetIndex === mappingTab.sheetIndex
    );

    const newPricingMappingGroup = cloneDeep(pricingMappingGroup);

    if (existingMappingTabIdx > -1) {
      newPricingMappingGroup.mappingTabs[existingMappingTabIdx] = mappingTab;
    } else {
      newPricingMappingGroup.mappingTabs.push(mappingTab);
    }

    mappingGroups[pricingMappingGroupIdx] = newPricingMappingGroup;
    setSelectedMappingData(newMappingData);
    setIsChangedMapping(true);
  };

  const updateMaxtrixMapping = async () => {
    setLoading(true);
    const updateApi = isStandardMapping(selectedMappingData)
      ? updateStandardMapping
      : updateNonStandardMapping;
    await updateApi(selectedMappingData.id, {
      ...selectedMappingData,
    }).then((res) => {
      if (res.status === 200) {
      }
    });

    await saveMaxtrixAnalysis();

    setLoading(false);
  };

  useEffect(() => {
    if (!existingManufacturerEntity) {
      setTaxonomyLoading(true);
      getTaxonomies()
        .then((res) => {
          setTaxonomy(
            get(res, "data", []).find((t) => t.name === DEFAULT_TAXONOMY_NAME)
          );
        })
        .finally(() => {
          setTaxonomyLoading(false);
        });

      setLanguageLoading(true);
      getLanguages()
        .then((res) => {
          setLanguage(
            get(res, "data", []).find((l) => l.code === DEFAULT_LANGUAGE_CODE)
          );
        })
        .finally(() => {
          setLanguageLoading(false);
        });

      setTargetMarketLoading(true);
      getTargetMarkets()
        .then((res) => {
          const targetMarket = get(res, "data", []).find(
            (tm) => tm.name === "FR"
          );
          setTargetMarket(targetMarket);
        })
        .finally(() => {
          setTargetMarketLoading(false);
        });
    }
  }, [existingManufacturerEntity]);

  useEffect(() => {
    if (importFile && !existingMatrixMapping) {
      onUpload(importFile);
    }
  }, [existingMatrixMapping, importFile]);

  useEffect(() => {
    if (existingManufacturerEntity) {
      setManufacturerEnttiy(existingManufacturerEntity);
      setManufacturerEntityId(existingManufacturerEntity.id);
    }
  }, [existingManufacturerEntity]);

  useEffect(() => {
    if (existingMatrixMapping) {
      setSelectedMappingData(existingMatrixMapping);

      getNonStandardMatrixAnalysis(existingMatrixMapping.matrixAnalysisId).then(
        (res) => {
          if (res.status === 200) {
            const matrixAnalysisData =
              convertMatrixAnalysisValuesFromBackendBase(res.data);
            setMatrixAnalysis(matrixAnalysisData);
            setSavedMatrixAnalysis(matrixAnalysisData);
          }
        }
      );
    }
  }, [existingMatrixMapping]);

  useEffect(() => {
    let checkNameTimeoutId = null;
    setIsCheckingManufacturerEntityName(true);

    if (
      existingManufacturerEntity &&
      existingManufacturerEntity.name === manufacturerEntity.name
    ) {
      setIsManufacturerEntityNameValid(true);
      setIsCheckingManufacturerEntityName(false);
      return;
    }

    if (manufacturerEntity.name && isTouchedField) {
      checkNameTimeoutId = setTimeout(() => {
        checkExistingManufacturerEntityName(manufacturerEntity.name)
          .then((res) => {
            setIsManufacturerEntityNameValid(res.data);
          })
          .finally(() => {
            setIsCheckingManufacturerEntityName(false);
          });
      }, 500);
    }

    return () => {
      checkNameTimeoutId && clearTimeout(checkNameTimeoutId);
    };
  }, [existingManufacturerEntity, isTouchedField, manufacturerEntity.name]);

  const disabledSave =
    (!isEdit && (!manufacturerEntity.name || !taxonomy || !language)) ||
    (isEdit
      ? manufacturerEntity.name
        ? !isChangedName && !isChangedMapping
        : !isChangedMapping
      : false) ||
    !matrixAnalysis;

  const disabledNext =
    disabledSave ||
    !isManufacturerEntityNameValid ||
    isCheckingManufacturerEntityName;

  const pricingMappingGroup = get(
    selectedMappingData,
    "mappingGroups",
    []
  ).find((g) => g.groupName === "PRICING");

  return (
    <>
      {taxonomyLoading ||
      languageLoading ||
      targetMarketLoading ||
      uploadingFile ? (
        <LoaderOverlay />
      ) : null}
      <Container>
        <Wrapper>
          <ModalTitleStyled>
            {translate(
              isEdit
                ? "collections.editManufaturerEntity"
                : "collections.createNewManufaturerEntity"
            )}
          </ModalTitleStyled>
          <br />

          {error && (
            <>
              <Alert severity="error">{error}</Alert>
              <br />
            </>
          )}

          <Label block>{translate("collections.name")}*</Label>
          <Input
            value={manufacturerEntity.name}
            onChange={(e) => {
              setManufacturerEnttiy({
                ...manufacturerEntity,
                name: e.target.value,
              });
              setIsTouchedFields(true);
            }}
            block
            className={
              !manufacturerEntity.name && isTouchedField
                ? "form-field-error"
                : ""
            }
          />

          {!isManufacturerEntityNameValid &&
            isTouchedField &&
            !isCheckingManufacturerEntityName && (
              <>
                <br />
                <Alert severity="error">
                  {translate("collections.nameAlreadyUsed")}
                </Alert>
                <br />
              </>
            )}

          <br />
          {!selectedMappingData && (
            <>
              <Padding bottom={2} />
              <Alert severity="info">
                {translate("collections.pleaseSaveBefore")}
              </Alert>
              <br />
            </>
          )}
          <Tabs
            value={selectedTab}
            onChange={(e, val) => {
              setSelectedTab(val);
              if (val === TABS.MAPPING) {
                setShowNextButton(false);
              }
            }}
            style={{ marginBottom: 16 }}
          >
            <Tab
              value={0}
              label={
                <div className="flex items-center">
                  {translate("collections.sheetConfiguration")}
                </div>
              }
              sx={{ textTransform: "none", fontSize: 14 }}
            />
            {(isSavedMatrixAnalysis || isEdit) && (
              <Tab
                value={1}
                label={
                  <div className="flex items-center">
                    {translate("collections.mapping")}
                  </div>
                }
                sx={{ textTransform: "none", fontSize: 14 }}
              />
            )}
          </Tabs>

          <div style={{ display: selectedTab === 0 ? "block" : "none" }}>
            <PriceMatrixAnalysisForm
              loading={uploadingFile}
              matrixAnalysisForm={matrixAnalysis}
              setMatrixAnalysisForm={(data) => {
                setMatrixAnalysis(data);
                setIsSavedMatrixAnalysis(false);
                setShowNextButton(true);
                setSelectedMappingData(null);
              }}
              editable={!isEdit}
            />
          </div>

          <div style={{ display: selectedTab === 1 ? "block" : "none" }}>
            <MappingMatrixEditForm
              matrixAnalysis={savedMatrixAnalysis}
              selectedMappingData={selectedMappingData}
              onChangeMappingTabData={onChangeMappingTabDataHandler}
              selectedMappingGroup={pricingMappingGroup}
            />
          </div>

          {showCreateNonStandardMaxtrix && (
            <CreateNonStandardMaxtrix
              visible={showCreateNonStandardMaxtrix}
              importFile={importFile}
              onClose={() => setShowCreateNonStandardMaxtrix(false)}
              onCreateSuccess={() => {
                setShowCreateNonStandardMaxtrix(false);
              }}
            />
          )}
        </Wrapper>

        <CustomizedFooterRow>
          <Button small onClick={onCloseHandler}>
            {translate("collections.close")}
          </Button>

          {showNextButton && (
            <>
              {loading ? (
                <Loader style={{ marginRight: "16px" }} />
              ) : (
                <Button
                  small
                  onClick={onNextHandler}
                  primary
                  shadow
                  disabled={disabledNext}
                  className={disabledNext ? "btn-disabled" : ""}
                  style={{ marginRight: 0 }}
                >
                  {translate("collections.next")}
                </Button>
              )}
            </>
          )}

          {!showNextButton && (
            <>
              {loading ? (
                <Loader style={{ marginRight: "16px" }} />
              ) : (
                <Button
                  small
                  onClick={onSaveHandler}
                  primary
                  shadow
                  disabled={disabledSave}
                  className={disabledSave ? "btn-disabled" : ""}
                  style={{ marginRight: 0 }}
                >
                  {translate("collections.save")}
                </Button>
              )}
            </>
          )}
        </CustomizedFooterRow>
      </Container>
    </>
  );
}

export default withUser(withLocalization(ManufacturerEntityNew));
