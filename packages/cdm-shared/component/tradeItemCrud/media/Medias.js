import React from "react";
import get from "lodash/get";
import join from "lodash/join";
import isEmpty from "lodash/isEmpty";
import size from "lodash/size";
import reduce from "lodash/reduce";
import map from "lodash/map";
import find from "lodash/find";
import uniqBy from "lodash/uniqBy";
import {
  Zone,
  Button,
  Container,
  Row,
  Col,
  Margin,
  Padding,
  Tag,
} from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { withTradeItemLocalContext } from "../store/TradeItemProvider";
import { withGroupLocalContext } from "../store/PropertyGroupProvider";
import {
  getNewObjectForGroup,
  getTradeItemGroupCurrentItem,
  isPropertyMultiple,
} from "../manager";
import UploadMedia from "./UploadMedia";
import MediaCard from "./MediaCard";
import {
  reduceGroupValues,
  reduceGroupValuesValues,
  renderFixedValue,
} from "../properties/utils";
import { withTradeItemPropertiesLocalContext } from "../store/TradeItemPropertiesProvider";
import {
  getGroupsValues,
  saveTradeItemProperties,
  saveGroupValues,
  getGroupsValuesCMS,
} from "../api";
import PrimaryLoader from "cdm-shared/component/PrimaryLoader";
import EditMedia from "./EditMedia";
import { withValuesGroupsLocalContext } from "../store/ValuesGroupProvider";
import MediaCategoryMenu, { ALL_CATEGORIES_KEY } from "./MediaCategoryMenu";
import { getTradeItemPropertiesApiHelper } from "../helpers";
import withUser from "../../../redux/hoc/withUser";
import { isRetailer } from "../../../redux/hoc/withAuth";
import { ModalStyled } from "../../styled/modal/ModalStyled";
import { IconButton, Link } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download,
} from "@mui/icons-material";

import { grey } from "@mui/material/colors";

const FILE_LEVELS = {
  MASTER: 0,
  LEVEL_1: 1,
  LEVEL_2: 2,
};

class Medias extends React.Component {
  state = {
    mediaUnderEditIndex: null,
    categoryValuesGroupId: null,
    categorySelected: null,
  };

  componentDidMount() {
    this.fetchMediaProperty();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.tradeItem.tradeItemCategory.code !==
      prevProps.tradeItem.tradeItemCategory.code
    ) {
      this.fetchMediaProperty();
    }
  }

  // fetch medias properties
  fetchMediaProperty() {
    const { groupSelected, categoryIndexKey, tradeItem, user } = this.props;
    const { taxonomyId, tradeItemCategory } = tradeItem;
    const { code } = tradeItemCategory;
    const {
      setFetchingTradeItemProperties,
      setTradeItemProperties,
      setFetchingValuesGroups,
      addValuesGroups,
    } = this.props;
    const isAdmin = localStorage.getItem("isAdmin") === "1";

    if (!code) {
      return;
    }
    setFetchingTradeItemProperties(true);
    const getTradeItemPropertiesApi = getTradeItemPropertiesApiHelper(
      isAdmin,
      user
    );
    getTradeItemPropertiesApi(taxonomyId, code, groupSelected)
      .then((res) => {
        const properties = get(res, "data", []);
        saveTradeItemProperties(taxonomyId, code, groupSelected, properties);
        const categoryValuesGroupId = get(
          find(properties, (p) => get(p, "code") === categoryIndexKey),
          "valuesGroupId",
          null
        );
        const groupsValuesIds = reduceGroupValues(properties);

        setFetchingTradeItemProperties(false);
        setTradeItemProperties(properties);
        this.setState({ categoryValuesGroupId: categoryValuesGroupId });

        if (!isEmpty(groupsValuesIds)) {
          setFetchingValuesGroups(true);
          const uniqueIds = groupsValuesIds.filter((value, index, self) => {
            return self.indexOf(value) === index;
          });
          const getGroupsValuesApi = isAdmin
            ? getGroupsValuesCMS(
                uniqueIds,
                code,
                get(tradeItem, "manufacturer.manufacturerId")
              )
            : getGroupsValues(uniqueIds, code);
          getGroupsValuesApi
            .then((res2) => {
              saveGroupValues(uniqueIds, code, get(res2, "data", []));
              const valuesGroups = reduceGroupValuesValues(
                get(res2, "data", [])
              );
              addValuesGroups(valuesGroups);
              setFetchingValuesGroups(false);
            })
            .catch((err) => {
              console.error(err);
              setFetchingValuesGroups(false);
            });
        }
      })
      .catch((err) => {
        setFetchingTradeItemProperties(false);
        console.error(err);
      });
  }

  componentWillUnmount() {
    this.props.resetTradeItemProperties();
    this.props.resetValuesGroups();
  }

  prepareMedia(blobFile) {
    const { tradeItemProperties, fileNamePropertyCode } = this.props;
    const { tradeItem, selectedVariantIndex } = this.props;
    const tradeItemId =
      selectedVariantIndex === null
        ? tradeItem.tradeItemId
        : get(
            tradeItem,
            `variantDefinitions.${selectedVariantIndex}.tradeItemId`,
            null
          );

    return Object.assign(
      {},
      reduce(
        tradeItemProperties,
        (result, prop, key) => {
          if (prop.code === fileNamePropertyCode)
            result[prop.code] = get(blobFile, "name", null);
          else result[prop.code] = isPropertyMultiple(prop) ? [] : null;
          return result;
        },
        {}
      ),
      {
        _blob: blobFile,
        _tmpUrl: URL.createObjectURL(blobFile),
        tradeItemIds: [tradeItemId],
      }
    );
  }

  addMedias(mediasAccepted) {
    const { tradeItem } = this.props;

    const { setTradeItemValue } = this.props;

    const valuesKey = this.getTradeItemValuesKey();

    const key = get(tradeItem, `${valuesKey}`, []);
    const newVal = map(mediasAccepted, (img) => this.prepareMedia(img));

    setTradeItemValue(valuesKey, [...key, ...newVal]);
  }

  removeMedia(mediaIndex) {
    const { removeTradeItemValue } = this.props;

    const valuesKey = this.getTradeItemValuesKey();

    removeTradeItemValue(valuesKey, mediaIndex);
  }

  getTradeItemValuesKey() {
    const { currentGroupKey, selectedGroupItemIndex } = this.props;

    return `${getTradeItemGroupCurrentItem(
      currentGroupKey,
      selectedGroupItemIndex
    )}.values`;
  }

  getCategoryKey(media) {
    const { categoryIndexKey } = this.props;

    return get(media, categoryIndexKey, null);
  }

  getCategoryValue(media) {
    const { categoryValuesGroupId } = this.state;

    const { valuesGroups, currentLocaleCode } = this.props;

    if (
      this.getCategoryKey(media) !== null &&
      categoryValuesGroupId &&
      get(valuesGroups, categoryValuesGroupId, null) !== null
    )
      return renderFixedValue(
        get(
          valuesGroups,
          `${categoryValuesGroupId}[${this.getCategoryKey(media)}]`
        ),
        currentLocaleCode
      );

    return null;
  }

  getIndex(media) {
    const { mediaIndexKey } = this.props;

    return get(media, mediaIndexKey, null);
  }

  getLevel(variant) {
    let level = FILE_LEVELS.MASTER;
    if (!variant) {
      level = FILE_LEVELS.MASTER;
    } else {
      if (variant && !get(variant, "options.75")) {
        level = FILE_LEVELS.LEVEL_1;
      } else if (!!get(variant, "options.75")) {
        level = FILE_LEVELS.LEVEL_2;
      }
    }

    return level;
  }

  render() {
    const { mediaUnderEditIndex, categorySelected, categoryValuesGroupId } =
      this.state;

    const {
      fileNamePropertyCode,
      showPrePicture,
      tradeItem,
      currentGroupKey,
      groupSelected,
      selectedGroupItemIndex,
      isFetchingTradeItemProperties,
      isFetchingValuesGroups,
      currentLocaleCode,
      fileTypesAccepted,
      categoryIndexKey,
      defaultTargetMarketId,
      user,
    } = this.props;

    const {
      translate,
      setTradeItemValue,
      setSelectedGroupItemIndex,
      getThumbUrl,
      getMediaUrl,
      selectedVariantIndex,
      setSelectedVariantIndex,
      onSelectMedia,
      addChangedMediaIds,
    } = this.props;
    const valuesKey = this.getTradeItemValuesKey();
    const variants = get(tradeItem, "variantDefinitions", []);
    const selectedVariantTradeItem = get(
      variants,
      `${selectedVariantIndex}`,
      null
    );
    let selectedVariantTradeItemId = tradeItem.tradeItemId;
    if (selectedVariantTradeItem) {
      selectedVariantTradeItemId = get(
        selectedVariantTradeItem,
        "tradeItemId",
        null
      );
    }
    const originalFiles = get(tradeItem, `${valuesKey}`, []);
    const computedFiles = get(tradeItem, `${valuesKey}`, []).map(
      (file, fileIndex) => {
        const tradeItemIds = get(file, "tradeItemIds", []);
        const belongToMaster = tradeItemIds.includes(tradeItem.tradeItemId);
        const variantIndex = belongToMaster
          ? -1
          : variants.findIndex((v) => v.tradeItemId === file.variantId);
        return {
          ...file,
          fileIndex,
          variantIndex,
          variant: variantIndex > -1 ? variants[variantIndex] : null,
        };
      }
    );

    const selectedEdition = get(selectedVariantTradeItem, "options.8410");
    const selectedPlatform = get(selectedVariantTradeItem, "options.75");
    const isRetailerUser = isRetailer(user);

    const isSelectedMaster =
      selectedVariantTradeItemId === tradeItem.tradeItemId;
    const isSelectedVariantEdition =
      selectedVariantTradeItemId !== tradeItem.tradeItemId &&
      !!selectedEdition &&
      !selectedPlatform;
    const isSelectedVariantPlatform =
      selectedVariantTradeItemId !== tradeItem.tradeItemId &&
      !!selectedEdition &&
      !!selectedPlatform;

    let files = [];
    if (isSelectedMaster) {
      files.push(
        ...computedFiles.filter((f) =>
          f.tradeItemIds.includes(tradeItem.tradeItemId)
        )
      );
    } else if (isSelectedVariantEdition) {
      files.push(
        ...computedFiles.filter((f) =>
          f.tradeItemIds.includes(tradeItem.tradeItemId)
        )
      );
      files.push(
        ...computedFiles.filter((f) =>
          f.tradeItemIds.includes(selectedVariantTradeItemId)
        )
      );
    } else if (isSelectedVariantPlatform) {
      files.push(
        ...computedFiles.filter((f) =>
          f.tradeItemIds.includes(tradeItem.tradeItemId)
        )
      );
      selectedVariantTradeItem.parentsTradeItemIds.forEach((parentId) => {
        files.push(
          ...computedFiles.filter((f) => f.tradeItemIds.includes(parentId))
        );
      });
      files.push(
        ...computedFiles.filter((f) =>
          f.tradeItemIds.includes(selectedVariantTradeItemId)
        )
      );
    }

    files = uniqBy([...files], (f) => (f.id ? f.id : Math.random()));

    // show loader when fetching properties
    // when a rendering occurs too
    if (isFetchingTradeItemProperties || isFetchingValuesGroups)
      return (
        <Zone noShadow center>
          <PrimaryLoader />
        </Zone>
      );

    // display buttons to add new properties group values
    if (selectedGroupItemIndex === null)
      return (
        <Zone noShadow center>
          {/* Add new default group */}
          <Button
            onClick={(e) => {
              const newGroupIndex = size(get(tradeItem, currentGroupKey, 0));
              setTradeItemValue(currentGroupKey, [
                getNewObjectForGroup(groupSelected, defaultTargetMarketId),
                ...(get(tradeItem, currentGroupKey) || []),
              ]);
              setSelectedGroupItemIndex(newGroupIndex);
            }}
            secondary
            shadow
          >
            {translate("tradeItemCrud.media.addDefaultValues")}
          </Button>
        </Zone>
      );

    return (
      <Container fluid style={{ marginTop: "1rem" }}>
        {/* Upload zone */}
        <Row>
          <Col col>
            <UploadMedia
              typesAccepted={join(fileTypesAccepted, ", ")}
              maxSize={100000000}
              onFilesAccepted={(accepted) =>
                !isEmpty(accepted) && this.addMedias(accepted)
              }
            />
          </Col>
        </Row>

        {/* Categories menu */}
        {!isEmpty(files) && (
          <Margin vertical={4}>
            <MediaCategoryMenu
              medias={files}
              translate={translate}
              locale={currentLocaleCode}
              categoryKeyIndex={categoryIndexKey}
              categoryValuesGroupId={categoryValuesGroupId}
              categorySelected={categorySelected}
              onSelect={(newCategory) =>
                this.setState({ categorySelected: newCategory })
              }
            />
          </Margin>
        )}

        {/* Visualize medias */}
        {!isEmpty(files) && (
          <>
            <Margin top={5} />
            <Row>
              {map(files, (file) => {
                const fileIndex = file.fileIndex;
                const isSelectedTradeItem = file.tradeItemIds.includes(
                  selectedVariantTradeItemId
                );
                let isFileFromMaster = false;
                let isFileFromEdition = false;
                let parentEditionName = "";
                if (!isSelectedTradeItem) {
                  isFileFromMaster = file.tradeItemIds.includes(
                    tradeItem.tradeItemId
                  );
                  if (!isFileFromMaster) {
                    const parentId =
                      selectedVariantTradeItem.parentsTradeItemIds.find((id) =>
                        file.tradeItemIds.includes(id)
                      );
                    const parentVariant = variants.find(
                      (v) => v.tradeItemId === parentId
                    );
                    isFileFromEdition = !!parentVariant;
                    parentEditionName = get(parentVariant, "options.8410", "");
                  }
                }

                return (
                  <MediaCard
                    key={`media-uploaded-media-${fileIndex}`}
                    showPrePicture={showPrePicture}
                    style={{
                      display:
                        categorySelected === ALL_CATEGORIES_KEY ||
                        categorySelected === null ||
                        this.getCategoryKey(file) === categorySelected
                          ? "block"
                          : "none",
                    }}
                    src={
                      (getThumbUrl && getThumbUrl(file)) ||
                      get(file, "publicUrl", null) ||
                      get(file, "_tmpUrl")
                    }
                    fileName={
                      get(file, fileNamePropertyCode, null) ||
                      get(file, "_blob.name", null)
                    }
                    height="267px"
                    category={this.getCategoryValue(file)}
                    index={this.getIndex(file)}
                    manuallyImported={
                      get(file, "manuallyImported")
                        ? translate("tradeItemCrud.media.manuallyImported")
                        : false
                    }
                    notDefinitive={
                      get(file, "notDefinitive")
                        ? translate("tradeItemCrud.media.notDefinitive")
                        : false
                    }
                    notExportable={
                      !isRetailerUser && get(file, "notExportable")
                        ? translate("tradeItemCrud.media.notExportable")
                        : false
                    }
                    isChild={
                      get(file, "tradeItemId") &&
                      get(file, "tradeItemId") !== selectedVariantTradeItemId
                        ? translate("tradeItemCrud.media.child")
                        : false
                    }
                    tags={get(file, "tags") || []}
                    languageCodes={get(file, "languageCodes") || []}
                    onClick={() => onSelectMedia && onSelectMedia(file)}
                  >
                    <Padding all={3}>
                      {isSelectedTradeItem ? (
                        <>
                          {/* Edit media */}
                          <IconButton
                            color="primary"
                            size="large"
                            aria-label="Edit media"
                            sx={{
                              padding: 0.5,
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              this.setState({ mediaUnderEditIndex: fileIndex });
                            }}
                          >
                            <EditIcon fontSize="medium" />
                          </IconButton>

                          {/* Remove media */}
                          <IconButton
                            color="error"
                            size="large"
                            aria-label="Delete media"
                            sx={{
                              padding: 0.5,
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              this.removeMedia(fileIndex);
                            }}
                          >
                            <DeleteIcon fontSize="medium" />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          {isFileFromMaster && (
                            <Tag
                              onClick={() => setSelectedVariantIndex(null)}
                              warning
                            >
                              {translate("tradeItemCrud.media.master")}
                            </Tag>
                          )}
                          {isFileFromEdition && (
                            <Tag
                              onClick={() =>
                                setSelectedVariantIndex(
                                  get(file, "variantIndex", null)
                                )
                              }
                              warning
                            >
                              {parentEditionName}
                            </Tag>
                          )}
                        </>
                      )}

                      {/* Download media */}
                      {(isRetailerUser
                        ? !get(file, "notExportable")
                        : true) && (
                        <IconButton
                          color="default"
                          size="large"
                          aria-label="Download media"
                          sx={{
                            padding: 0.5,
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(
                              getMediaUrl ? getMediaUrl(file) : "#",
                              "_blank"
                            );
                          }}
                        >
                          <Download
                            fontSize="medium"
                            sx={{ color: grey[900] }}
                          />
                        </IconButton>
                      )}
                    </Padding>
                  </MediaCard>
                );
              })}
            </Row>

            {mediaUnderEditIndex !== null && (
              <ModalStyled md>
                <EditMedia
                  media={get(originalFiles, `[${mediaUnderEditIndex}]`, null)}
                  showPrePicture={showPrePicture}
                  onApply={(newMedia) => {
                    setTradeItemValue(
                      `${valuesKey}.${mediaUnderEditIndex}`,
                      newMedia
                    );
                    addChangedMediaIds(newMedia.id);
                    this.setState({ mediaUnderEditIndex: null });
                  }}
                  onCancel={() => this.setState({ mediaUnderEditIndex: null })}
                />
              </ModalStyled>
            )}
          </>
        )}
      </Container>
    );
  }
}

export default withLocalization(
  withTradeItemPropertiesLocalContext(
    withValuesGroupsLocalContext(
      withTradeItemLocalContext(withGroupLocalContext(withUser(Medias)))
    )
  )
);
