import React, { Component } from "react";
import map from "lodash/map";
import get from "lodash/get";
import styled from "styled-components";
import { Zone, Padding } from "cdm-ui-components";
import { ModalStyled } from "cdm-shared/component/styled/modal/ModalStyled";
import { allowVideoExport, getRetailerId, isManufacturer, isRetailer } from "cdm-shared/redux/hoc/withAuth";
import { exportVideo as _exportVideo } from "cdm-shared/services/product";
import memoize from "cdm-shared/utils/memoize";
import LoaderOverlay from "cdm-shared/component/LoaderOverlay";

import { withLocalization } from "../common/redux/hoc/withLocalization";
import AssetCard from "./AssetCard";
import AssetsTable from "./AssetsTable";
import AssetDetail from "./AssetDetail";
import DocumentUpdateForm from "./DocumentUpdateForm";
import ImageUpdateForm from "./ImageUpdateForm";
import VideoUpdateForm from "./VideoUpdateForm";

const VideoWrapper = styled(Zone)`
  padding-top: 10px !important;
`;

class Results extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedAsset: null,
    };

    this.isRetailer = isRetailer(props.user);
    this.isManufacturer = isManufacturer(props.user);

    this.exportVideo = this.exportVideo.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.setLoading = this.setLoading.bind(this);
  }

  exportVideo(video) {
    const { user } = this.props;

    _exportVideo(get(video, "externalId"), getRetailerId(user)).then(() => {
        alert("Vidéo exportée.")
    });
  }

  handleClose(updatedAsset) {
    if (updatedAsset && this.props.onUpdateAsset) {
      this.props.onUpdateAsset({
        ...this.state.selectedAsset,
        ...updatedAsset,
      });
    }
    this.setState({ selectedAsset: null, loading: false });
  }

  handleDelete() {
    if (this.props.onDeleteAsset) {
      this.props.onDeleteAsset(this.state.selectedAsset);
    }
    this.setState({ selectedAsset: null, loading: false });
  }

  setLoading(loading) {
    this.setState({ loading });
  }

  render() {
    const { selectedAsset, loading } = this.state;

    const { mode, results, user, assetType, translate, basketAssets, onAddAssetToBasket, onRemoveAssetFromBasket } = this.props;

    const spacings = new Array(6).fill("");
    const basketAssetIds = basketAssets.map((item) => item.id);

    return (
      <>
        {mode === 'grid' ? (
          <VideoWrapper noPadding noShadow center>
            {map(results, (asset, keyIndex) => (
              <Padding
                key={`catalog-search-video-${keyIndex}`}
                inline
                all={3}
                style={{ width: "300px", verticalAlign: "top" }}
              >
                <AssetCard
                  assetType={assetType}
                  height="270px"
                  asset={asset}
                  isExportable={allowVideoExport(user)}
                  user={user}
                  translate={translate}
                  isAddedToBasket={basketAssetIds.includes(asset.id)}
                  onClick={() => this.setState({ selectedAsset: asset })}
                  onExport={() => this.exportVideo(asset)}
                  onAddAssetToBasket={() => onAddAssetToBasket(asset)}
                  onRemoveAssetFromBasket={() => onRemoveAssetFromBasket(asset)}
                />
              </Padding>
            ))}
            {map(spacings, (spacing, keyIndex) => (
              <Padding
                key={`catalog-search-space-${keyIndex}`}
                inline
                all={0}
                style={{ width: "300px", verticalAlign: "top" }}
              >
              </Padding>
            ))}
          </VideoWrapper>
        ) : (
          <Zone transparent noShadow center style={{ padding: '20px 0' }}>
            <AssetsTable
              assetType={assetType}
              assets={results}
              isExportable={allowVideoExport(user)}
              basketAssets={basketAssets}
              onEdit={(video) => this.setState({ selectedAsset: video })}
              onExport={this.exportVideo}
              onAddAssetToBasket={onAddAssetToBasket}
              onRemoveAssetFromBasket={onRemoveAssetFromBasket}
            />
          </Zone>
        )}

        {/* Edit asset for manufacturer */}
        {this.isManufacturer && selectedAsset && (
          <ModalStyled md>
            {assetType === 'video' && <VideoUpdateForm id={selectedAsset.id} setLoading={this.setLoading} onDelete={this.handleDelete} onClose={this.handleClose} />}
            {assetType === 'image' && <ImageUpdateForm id={selectedAsset.id} setLoading={this.setLoading} onDelete={this.handleDelete} onClose={this.handleClose} />}
            {assetType === 'document' && <DocumentUpdateForm id={selectedAsset.id} setLoading={this.setLoading} onDelete={this.handleDelete} onClose={this.handleClose} />}
          </ModalStyled>
        )}

        {/* Asset view for retailer */}
        {this.isRetailer && selectedAsset && (
          <AssetDetail
            asset={selectedAsset}
            assetType={assetType}
            user={user}
            onClose={() => this.setState({ selectedAsset: undefined })}
          />
        )}

        {loading && (
          <LoaderOverlay />
        )}
      </>
    );
  }
}

export default memoize(withLocalization(Results));
