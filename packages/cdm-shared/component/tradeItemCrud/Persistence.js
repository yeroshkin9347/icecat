import React from "react";
import get from "lodash/get";
import map from "lodash/map";
import reduce from "lodash/reduce";
import filter from "lodash/filter";
import difference from "lodash/difference";
import isEmpty from "lodash/isEmpty";
import chunk from "lodash/chunk";
import size from "lodash/size";
import pick from "lodash/pick";
import drop from "lodash/drop";
import keys from "lodash/keys";
import isEqual from "lodash/isEqual";
import flatten from "lodash/flatten";
import {
  Container,
  Row,
  Col,
  Text,
  Padding,
  ProgressBar,
} from "cdm-ui-components";
import PrimaryLoader from "cdm-shared/component/PrimaryLoader";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { KEYED_PROPERTIES_GROUPS } from "./manager";
import {
  getResources,
  updateImageMetadata,
  updateDocumentMetadata,
  deleteResource,
  importImageResource,
  importDocumentResource,
  updateTradeItem,
  createTradeItem,
} from "./api";
import { getManufacturerId } from "../../redux/hoc/withUser";
import { withEnrichmentUpdateContext } from "./enrichmentManagement/useEnrichmentUpdate";

const STEP_PERSIST_METADATA = 1;
const STEP_PERSIST_MEDIAS = 2;
const STEP_PERSIST_UPLOAD_IMAGES = 3;
const STEP_PERSIST_UPLOAD_DOCUMENTS = 4;
const STEP_PERSIST_UPDATE_MEDIAS_META = 5;

const DEFAULT_UPLOAD_CHUNK_SIZE = 2;
const DEFAULT_UPDATE_CHUNK_SIZE = 2;

const getInitialState = (thus) => {
  return {
    _isMounted: false,
    isCreation: false,
    step: null,
    loading: false,
    // resource upload
    totalChunks: 0,
    currentChunks: 0,
    resourcesCreatedIds: [],
    resourcesDeletedIds: [],
    resourcesUpdatedIds: [],
    increaseTotalChunks: (size) =>
      thus.updateState({ totalChunks: thus.state.totalChunks + size }),
    increaseCurrentChunks: () =>
      thus.updateState({ currentChunks: thus.state.currentChunks + 1 }),
    addCreatedResourcesIds: (resourceIds) =>
      thus.updateState({
        resourcesCreatedIds: [
          ...thus.state.resourcesCreatedIds,
          ...resourceIds,
        ],
      }),
    addDeletedResourcesIds: (resourceIds) =>
      thus.updateState({
        resourcesDeletedIds: [
          ...thus.state.resourcesDeletedIds,
          ...resourceIds,
        ],
      }),
    addUpdatedResourcesIds: (resourceIds) =>
      thus.updateState({
        resourcesUpdatedIds: [
          ...thus.state.resourcesUpdatedIds,
          ...resourceIds,
        ],
      }),
  };
};

class Persistence extends React.Component {
  _isMounted = false;

  state = getInitialState(this);

  componentDidMount() {
    const {
      tradeItem,
      onPersisted,
      onFailed,
      user,
      triggerAnalyticsEvent,
      manufacturerId,
      runEnrichmentUpdateQueue,
    } = this.props;

    this._isMounted = true;

    const isAdmin = localStorage.getItem("isAdmin") === "1";
    const tradeItemManufacturerId = get(
      tradeItem,
      "manufacturer.manufacturerId"
    );
    if (isAdmin && !tradeItemManufacturerId) {
      onFailed && onFailed();
      this.reset();
      return;
    }

    this.persistTradeItem(
      tradeItem,
      onPersisted,
      onFailed,
      user,
      triggerAnalyticsEvent,
      manufacturerId,
      runEnrichmentUpdateQueue
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  updateState(state) {
    this._isMounted && this.setState(state);
  }

  persistTradeItem(
    tradeItem,
    onPersisted,
    onFailed,
    user,
    triggerAnalyticsEvent,
    manufacturerId,
    runEnrichmentUpdateQueue
  ) {
    // creates the returned promise
    let resourcePromises = Promise.resolve([]);
    let tradeItemId = get(tradeItem, "tradeItemId", null);
    const isCreation = tradeItemId === null;
    runEnrichmentUpdateQueue();
    // send to analytics
    triggerAnalyticsEvent &&
      triggerAnalyticsEvent(
        "CRUD",
        isCreation ? "Create product" : "Update product"
      );

    // start process
    this.updateState({
      step: STEP_PERSIST_METADATA,
      loading: true,
      isCreation,
    });

    // first update metadata
    // trade item to persist: remove all medias info
    const {
      // imageResourceMetadatas,
      // documentResourceMetadatas,
      ...tradeItemMetadataToPersist
    } = tradeItem;
    let persistencePromise = isCreation
      ? createTradeItem(user)(
          tradeItemMetadataToPersist,
          tradeItemMetadataToPersist?.manufacturer?.manufacturerId
        )
      : updateTradeItem(user)(tradeItemMetadataToPersist);
    resourcePromises = persistencePromise
      .then((res) => {
        // get the trade item id if creation
        tradeItemId = get(res, "data.tradeItemId", null);

        // get the children of the trade item
        const children = get(res, "data.children", null);

        // exit if no trade item id
        if (tradeItemId === null) return;

        // persist/delete medias
        resourcePromises = this.persistMedias(tradeItem, tradeItemId);

        // return promise
        return isCreation
          ? Promise.resolve(tradeItemId)
          : resourcePromises.then(() => {
              return Promise.all(
                children.map((child) =>
                  this.persistMedias(tradeItem, get(child, "tradeItemId"))
                )
              ).then(() => tradeItemId);
            });
      })
      .then((tradeItemId) => {
        onPersisted && tradeItemId && onPersisted(tradeItemId);
      })
      .catch((err) => {
        onFailed && onFailed(err);
        this.reset();
      });
  }

  persistMedias(tradeItem, tradeItemId) {
    // creates the returned promise
    let resourcePromises = Promise.resolve([]);
    let deleteResourcesPromise = Promise.resolve([]);
    let newMediasUploadPromise = Promise.resolve([]);
    let updateMetadataPromise = Promise.resolve([]);

    // update step
    this.updateState({ step: STEP_PERSIST_MEDIAS });

    // global promise
    // only resolve once the upload has been done
    return new Promise((resolve, reject) => {
      // get existing resources
      const variants = get(tradeItem, "variantDefinitions", []);
      resourcePromises = [
        getResources(tradeItemId),
        ...map(variants, (variant) => getResources(variant.tradeItemId)),
      ];
      Promise.all(resourcePromises).then((existingResourcesResponses) => {
        const existingResources = flatten(existingResourcesResponses);

        // STEP 1: delete resources
        deleteResourcesPromise = this.deleteResources(
          existingResources,
          tradeItem,
          tradeItemId
        );

        // STEP2: upload new medias
        newMediasUploadPromise = this.uploadNewMedias(tradeItem, tradeItemId);

        // STEP3: update metadata that have changed
        updateMetadataPromise = this.updateExistingMetadata(
          existingResources,
          tradeItem,
          tradeItemId
        );

        // wait for all of those promises before resolving
        Promise.all([
          deleteResourcesPromise,
          newMediasUploadPromise,
          updateMetadataPromise,
        ])
          .then((promisesResults) => {
            resolve(promisesResults);
          })
          .catch((err) => reject(err));
      });
    });
  }

  deleteResources(existingResources, tradeItem, tradeItemId) {
    let returnedPromise = Promise.resolve([]);

    // look for medias to delete
    const existingResourcesIds = map(existingResources, (m) =>
      get(m, "metadata.values.id.value")
    );

    const currentResourcesIds = [
      // images
      ...reduce(
        get(tradeItem, KEYED_PROPERTIES_GROUPS["IMAGES"], []),
        (result, resource, key) => {
          result = [
            ...result,
            ...filter(map(get(resource, "values"), (m) => get(m, "id", null))),
          ];
          return result;
        },
        []
      ),

      // documents
      ...reduce(
        get(tradeItem, KEYED_PROPERTIES_GROUPS["DOCUMENTS"], []),
        (result, resource, key) => {
          result = [
            ...result,
            ...filter(map(get(resource, "values"), (m) => get(m, "id", null))),
          ];
          return result;
        },
        []
      ),
    ];

    // delete resources
    const resourcesIdsToDelete = difference(
      existingResourcesIds,
      currentResourcesIds
    );
    if (!isEmpty(resourcesIdsToDelete)) {
      returnedPromise = this.deleteResourcesByIds(resourcesIdsToDelete).then(
        (resourcesDeletedIds) =>
          this.state.addDeletedResourcesIds(resourcesDeletedIds)
      );
    }

    return returnedPromise;
  }

  uploadNewMedias(tradeItem, tradeItemId) {
    let returnedPromises = [];

    const variants = get(tradeItem, "variantDefinitions", []);
    const isVariant =
      variants.findIndex((variant) => variant.tradeItemId === tradeItemId) !==
      -1;
    const isMaster = tradeItemId === get(tradeItem, "tradeItemId");

    // upload new medias
    // images
    const newImages = reduce(
      get(tradeItem, KEYED_PROPERTIES_GROUPS["IMAGES"], []),
      (result, resource, key) => {
        const values = get(resource, "values", []).map((value) => ({
          ...value,
          channels: resource.channels,
        }));

        result = [
          ...result,
          ...filter(
            values,
            (m) => get(m, "_blob", null) !== null && (isMaster || isVariant)
          ),
        ];
        return result;
      },
      []
    );

    // create images chunks and do the upload
    if (!isEmpty(newImages)) {
      this.updateState({ step: STEP_PERSIST_UPLOAD_IMAGES });
      const chunks = chunk(newImages, DEFAULT_UPLOAD_CHUNK_SIZE);
      this.state.increaseTotalChunks(size(chunks));
      const imagesUploadPromise = new Promise((resolve, reject) =>
        this.uploadResourcesByChunks(
          tradeItemId,
          chunks,
          importImageResource,
          resolve,
          reject
        )
      );
      returnedPromises.push(imagesUploadPromise);

      imagesUploadPromise.then((resourcesIds) => {
        this.state.addCreatedResourcesIds(resourcesIds);
        return resourcesIds;
      });
    }

    // documents
    const newDocuments = reduce(
      get(tradeItem, KEYED_PROPERTIES_GROUPS["DOCUMENTS"], []),
      (result, resource, key) => {
        result = [
          ...result,
          ...filter(
            get(resource, "values"),
            (m) => get(m, "_blob", null) !== null
          ),
        ];
        return result;
      },
      []
    );

    // create documents chunks and do the upload
    if (!isEmpty(newDocuments)) {
      // wait for images to finish
      this.updateState({ step: STEP_PERSIST_UPLOAD_DOCUMENTS });

      const chunks = chunk(newDocuments, DEFAULT_UPLOAD_CHUNK_SIZE);
      this.state.increaseTotalChunks(size(chunks));
      const documentsUploadPromise = new Promise((resolve, reject) =>
        this.uploadResourcesByChunks(
          tradeItemId,
          chunks,
          importDocumentResource,
          resolve,
          reject
        )
      );
      returnedPromises.push(documentsUploadPromise);

      documentsUploadPromise.then((resourcesIds) => {
        this.state.addCreatedResourcesIds(resourcesIds);
        return [...this.state.resourcesCreatedIds, resourcesIds];
      });
    }

    return Promise.all(returnedPromises);
  }

  updateExistingMetadata(existingResources, tradeItem, tradeItemId) {
    let returnedPromise = Promise.resolve([]);

    if (isEmpty(existingResources)) return returnedPromise;

    // get current resources
    const existingResourcesById = reduce(
      existingResources,
      (r, v, k) => {
        r[get(v, "metadata.values.id.value")] = v;
        return r;
      },
      {}
    );

    const { changedMediaIds = [] } = this.props;

    // images metadata potentially updated
    const imagesToUpdate = reduce(
      get(tradeItem, KEYED_PROPERTIES_GROUPS["IMAGES"], []),
      (result, resource, key) => {
        const values = get(resource, "values", []).map((value) => ({
          ...value,
          channels: resource.channels,
        }));

        result = [
          ...result,
          ...filter(
            values,
            (m) =>
              get(existingResourcesById, get(m, "id", null)) &&
              !isEqual(m, pick(existingResourcesById[m.id], keys(m))) &&
              !get(m, "_blob", null)
          ),
        ];
        return result;
      },
      []
    ).filter((image) => changedMediaIds.includes(image.id));

    // documents metadata potentially updated
    const documentsToUpdate = reduce(
      get(tradeItem, KEYED_PROPERTIES_GROUPS["DOCUMENTS"], []),
      (result, resource, key) => {
        result = [
          ...result,
          ...filter(
            get(resource, "values"),
            (m) =>
              get(existingResourcesById, get(m, "id", null)) &&
              !isEqual(m, pick(existingResourcesById[m.id], keys(m))) &&
              !get(m, "_blob", null)
          ),
        ];
        return result;
      },
      []
    ).filter((image) => changedMediaIds.includes(image.id));

    // merge resources for update
    const resourcesToUpdate = [...imagesToUpdate, ...documentsToUpdate];

    if (isEmpty(resourcesToUpdate)) return returnedPromise;

    // trigger the update
    this.updateState({ step: STEP_PERSIST_UPDATE_MEDIAS_META });
    this.state.addUpdatedResourcesIds(resourcesToUpdate);
    const updateImagesChunks = chunk(imagesToUpdate, DEFAULT_UPDATE_CHUNK_SIZE);
    const updateDocumentsChunks = chunk(
      documentsToUpdate,
      DEFAULT_UPDATE_CHUNK_SIZE
    );

    const updateImagesPromise = new Promise((resolve, reject) =>
      this.updateResourcesByChunks(
        tradeItemId,
        updateImagesChunks,
        updateImageMetadata,
        resolve,
        reject
      )
    );
    const updateDocumentsPromise = new Promise((resolve, reject) =>
      this.updateResourcesByChunks(
        tradeItemId,
        updateDocumentsChunks,
        updateDocumentMetadata,
        resolve,
        reject
      )
    );

    returnedPromise = Promise.all([
      updateImagesPromise,
      updateDocumentsPromise,
    ]);

    return returnedPromise;
  }

  uploadResourcesByChunks(
    tradeItemId,
    resourcesChunks,
    importResourceFn,
    resolveFn,
    rejectFn,
    resourcesIds
  ) {
    if (isEmpty(resourcesChunks)) {
      resolveFn(resourcesIds);
      return;
    }

    const promises = map(resourcesChunks[0], (resource) => {
      // upload resource
      const { _blob, channels, ...resourceMetadata } = resource;
      const resourceMetadataParams = {
        ...resourceMetadata,
        tradeItemIds: resourceMetadata.tradeItemId
          ? [resourceMetadata.tradeItemId]
          : resourceMetadata?.tradeItemIds || [tradeItemId],
        manufacturerId: getManufacturerId(this.props.user),
      };

      return importResourceFn(
        resourceMetadataParams,
        _blob,
        get(channels, "0", [])
      );
    });

    // wait all promises
    Promise.all(promises)
      .then((promisesResults) => {
        const resourcesIdsCreated = map(promisesResults, (promiseResult) =>
          get(promiseResult, "data.id")
        );

        this.state.increaseCurrentChunks();

        // recursion
        this.uploadResourcesByChunks(
          tradeItemId,
          drop(resourcesChunks),
          importResourceFn,
          resolveFn,
          rejectFn,
          [...(resourcesIds || []), ...resourcesIdsCreated]
        );
      })
      .catch((err) => {
        console.error(err);
        rejectFn(err);
      });
  }

  updateResourcesByChunks(
    tradeItemId,
    resourcesChunks,
    updateResourceFn,
    resolveFn,
    rejectFn
  ) {
    if (isEmpty(resourcesChunks)) {
      resolveFn();
      return;
    }

    const promises = map(resourcesChunks[0], (resource) => {
      return updateResourceFn({ metadataId: get(resource, "id"), ...resource });
    });

    // wait all promises
    Promise.all(promises)
      .then((promisesResults) => {
        // recursion
        this.updateResourcesByChunks(
          tradeItemId,
          drop(resourcesChunks),
          updateResourceFn,
          resolveFn,
          rejectFn
        );
      })
      .catch((err) => {
        console.error(err);
        rejectFn(err);
      });
  }

  deleteResourcesByIds(resourcesIds) {
    return Promise.all(
      map(resourcesIds, (resourceId) =>
        deleteResource(resourceId).then((res) => resourceId)
      )
    );
  }

  reset() {
    this.updateState(getInitialState());
  }

  render() {
    const { isCreation, step, loading, totalChunks, currentChunks } =
      this.state;

    const { translate } = this.props;

    return (
      <Container fluid>
        <Row>
          <Col col center>
            {/* Loader */}
            {loading && <PrimaryLoader />}
            <br />
            <br />

            {/* Creating / Updating */}
            <Text>
              {translate(
                `tradeItemCrud.persistence.${
                  isCreation ? "creating" : "updating"
                }`
              )}
            </Text>
            <br />

            {/* Step */}
            {step && (
              <>
                <Text light small uppercase>
                  {translate("tradeItemCrud.persistence.step")} {step} (
                  {translate(`tradeItemCrud.persistence.step${step}`)})
                </Text>
              </>
            )}

            {/* Display upload chunk progress */}
            {totalChunks > 0 && (
              <Padding top={4}>
                <ProgressBar
                  sm
                  total={totalChunks}
                  success={totalChunks === currentChunks ? totalChunks : 0}
                  pending={totalChunks === currentChunks ? 0 : currentChunks}
                />
              </Padding>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withEnrichmentUpdateContext(withLocalization(Persistence));
