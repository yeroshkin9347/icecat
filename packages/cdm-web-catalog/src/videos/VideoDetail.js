import React from "react";
import { withLocalization } from "common/redux/hoc/withLocalization";
import withUser from "cdm-shared/redux/hoc/withUser";
import VideoUpdateForm from "videos/VideoUpdateForm";

class VideoDetail extends React.Component {
  state = {
    video: null,
    productsData: [],
    loading: false
  };

  render() {
    const { id, onClose } = this.props;

    return (
      <VideoUpdateForm
        id={id}
        onClose={onClose}
        setLoading={() => {}}
        onDelete={() => {}}
      />
    )

    // return (
    //   <Zone noPadding noShadow left>
    //     <Row>
    //       {/* Video info */}
    //       <Col col>
    //         {/* Title */}
    //         <Label block>{translate("video.meta.title")}</Label>
    //         <P>{get(video, "metadata.values.title.value")}</P>
    //         <br />
    //
    //         {/* Last updated */}
    //         <Label block>{translate("video.meta.lastUpdated")}</Label>
    //         <P>{parseDate(get(video, "metadata.values.updateTimestamp.value", null))}</P>
    //         <br />
    //
    //         {/* videoFormat */}
    //         {!isEmpty(langs) && (
    //           <>
    //             <Label block>{translate("video.meta.languages")}</Label>
    //             <P>{langs.join(", ")}</P>
    //           </>
    //         )}
    //         <br />
    //       </Col>
    //
    //       {/* Video player */}
    //       <Col col>
    //         <VideoContainer>
    //           <iframe
    //             title={get(video, "title")}
    //             width={600}
    //             height={324}
    //             frameBorder={0}
    //             src={`https://video.cedemo.com/i/?prefer=html5&clID=4&div=cedemoPlayer&h=100%&noJQ=0&codeType=video&code=${get(
    //               video,
    //               "metadata.values.externalId.value"
    //             )}&w=100%&ratio=1.87&plType=VerticalList`}
    //           />
    //         </VideoContainer>
    //       </Col>
    //     </Row>
    //
    //     <Row>
    //       {/* Products info */}
    //       <Col col={4}>
    //         <Label block>{translate("video.meta.tradeItems")}</Label>
    //
    //         {map(productsData, (videoData, k) => (
    //           <React.Fragment
    //             key={`video-trade-item-${k}-${get(videoData, "tradeItemId")}`}
    //           >
    //             <PrimaryLink
    //               to={`/product/${currentLocaleCode}/${get(
    //                 videoData,
    //                 "tradeItemId"
    //               )}`}
    //               target="_blank"
    //               style={{ display: 'inline-block', marginBottom: '10px' }}
    //             >
    //               {get(videoData, "tradeItemTitle")} {videoData.tradeItemManufacturerCode ? `(${videoData.tradeItemManufacturerCode})`: ''}
    //             </PrimaryLink>
    //
    //             <br />
    //           </React.Fragment>
    //         ))}
    //       </Col>
    //
    //       {/* Integration code */}
    //       <Col col={8}>
    //         {isRetailer(user) && (
    //           <VideoIntegration video={video} translate={translate} />
    //         )}
    //       </Col>
    //     </Row>
    //   </Zone>
    // );
  }
}

export default withLocalization(withUser(VideoDetail));
