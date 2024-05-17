import React from "react";
import get from "lodash/get";
import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import {H3, Zone, Padding, Row, Col, Modal, P} from "cdm-ui-components";
import TextField from "@mui/material/TextField";
import {Search} from "@mui/icons-material";
import { getVideosByTradeItemId } from "cdm-shared/services/resource";
import AssetCard from "../videos/AssetCard";
import withUser from "cdm-shared/redux/hoc/withUser";
import { allowVideoExport, getRetailerId } from "cdm-shared/redux/hoc/withAuth";
import VideoDetail from "../videos/VideoDetail";
import { exportVideo } from "cdm-shared/services/product";

class Videos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      videos: [],
      selectedVideo: null
    };
  }

  setSearch(value) {
    this.setState({
      search: value,
    });
  }

  componentDidUpdate(prevProps) {
    const { tradeItem } = this.props;

    if (
      get(tradeItem, "tradeItemId") &&
      get(tradeItem, "tradeItemId") !== get(prevProps, "tradeItem.tradeItemId")
    ) {
      // get videos
      getVideosByTradeItemId(get(tradeItem, "tradeItemId")).then(res =>
        this.setState({ videos: get(res, "data", []), search: '' })
      );
    }
  }

  render() {
    const { videos, selectedVideo, search } = this.state;

    const { tradeItem, user, getCurrentUser, translate } = this.props;

    if (!tradeItem) return <React.Fragment />;

    let filteredVideos = videos;
    if (search.trim()) {
      const keyword = search.trim().toLowerCase();
      filteredVideos = videos.filter((video) => video.title?.toLowerCase().includes(keyword));
      console.log(videos, filteredVideos)
    }

    return (
      <>
        {/* videos list */}
        <Zone
          style={{
            boxShadow: "rgba(0, 0, 0, 0.25) 0px 0px 30px 0px",
            minWidth: "50%",
            minHeight: "300px",
            maxWidth: "1500px",
            margin: "0 auto"
          }}
          responsive
          borderRadius
        >
          <H3>{translate("tradeitem.videos.title")}</H3>

          {isEmpty(videos) ? (
            <P lead>{translate(`tradeitem.empty.videos`)}</P>
          ) : (
            <>
              <div>
                <TextField
                  size="small"
                  InputProps={{endAdornment: <Search/>}}
                  value={search}
                  placeholder={translate(`catalog.search.title`)}
                  onChange={(e) => this.setSearch(e.target.value)}
                />
              </div>
              <Padding vertical={3}>
                {isEmpty(filteredVideos) ? (
                  <P lead>{translate(`catalog.products.noresult`)}</P>
                ) : (
                  <Row>
                    {map(filteredVideos, (video, k) => (
                      <Col col={3} key={`trade-item-video-section-${k}`}>
                        <Padding bottom={3}>
                          <AssetCard
                            asset={video}
                            assetType="video"
                            user={user}
                            isExportable={allowVideoExport(getCurrentUser())}
                            onClick={() => this.setState({selectedVideo: video})}
                            onExport={() =>
                              exportVideo(
                                video.id,
                                getRetailerId(getCurrentUser())
                              ).then(res => alert("Done."))
                            }
                          />
                        </Padding>
                      </Col>
                    ))}
                  </Row>
                )}
              </Padding>
            </>
          )}
        </Zone>

        {/* video selected */}
        {selectedVideo && (
          <Modal md onClose={() => this.setState({selectedVideo: null})}>
            <VideoDetail id={selectedVideo.id}/>
          </Modal>
        )}
      </>
    );
  }
}

export default withUser(Videos);

// {map(v, (vdo, vdoKey) => (
//     <div
//       className="d-inline-block p-3"
//       key={`vdo-grid-${vdoKey}`}>
//       <AssetCard
//         onClick={e => setVideoSelected(vdo)}
//         video={vdo}
//         >
//       </AssetCard>

//       {allowVideoExport(user) && <button
//         className="btn btn-sm btn-primary btn-block"
//         onClick={e => exportVideo(get(vdo, "externalId"), get(user, "externalRetailerId"))}
//         >
//         {translate('tradeitem.videos.export')}
//         </button>}
//     </div>
//   ))}
