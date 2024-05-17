import React from "react";
import get from "lodash/get";
import map from "lodash/map";
import size from "lodash/size";
import {
  Zone,
  Padding,
  Row,
  Col,
  Button,
  H3,
  Margin,
  Tag,
  P
} from "cdm-ui-components";
import noimage from "cdm-shared/assets/noimage.svg";
import ImageCard from "./images/ImageCard";
import { getImageResourceMetadatasFromTradeItem, isConsistent } from "./utils";
import { AnchorLink } from "cdm-shared/component/Link";
import {
  allowViewEligibility,
  isManufacturer,
  isRetailer,
} from "cdm-shared/redux/hoc/withAuth";
import Eligibility from "./eligibility/Eligibility";

const ManufacturerThumbsRow = ({
  imageResourceMetadatas,
  countImages,
  tradeItemId,
  tradeItem,
  user,
  // functions
  translate,
  onImageSelected
}) => {
  return (
    <>
      <Row
        style={{
          maxWidth: "1500px",
          margin: "0 auto"
        }}
      >
        {/* Thumbs apetizers */}
        <Col col={5} style={{ paddingLeft: 0 }}>
          <>
            {countImages > 0 && (
              <Zone
                style={{
                  padding: "2em",
                  paddingBottom: countImages > 4 ? "4em" : "2em",
                  boxShadow: "rgba(0, 0, 0, 0.25) 0px 0px 30px 0px"
                }}
                noPadding
                borderRadius
              >
                {/* imageResourceMetadatas.slice(1, 5).map((d,i) => ( */}
                {map(imageResourceMetadatas.slice(0, 4), (d, i) => (
                  <Padding
                    key={`img-hero-${i}`}
                    style={{ width: "50%", position: "relative" }}
                    all={3}
                    inline
                  >
                    <ImageCard
                      img={d}
                      onClick={() => onImageSelected(i)}
                      height="200px"
                      width="100%"
                      translate={translate}
                      isChild={!get(d, 'tradeItemIds').includes(tradeItemId)}
                    />
                  </Padding>
                ))}
              </Zone>
            )}

            {/* No image */}
            {countImages === 0 && (
              <Zone
                borderRadius
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.25) 0px 0px 30px 0px",
                  backgroundImage: `url(${noimage})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover"
                }}
                noPadding
              >
                <Padding style={{ textAlign: "center" }} vertical={7}>
                  <H3 noMargin>{translate("tradeitem.hero.noImage")}</H3>
                </Padding>
              </Zone>
            )}

            {countImages > 4 && (
              <Row style={{ marginTop: "-1.8em" }}>
                <Col center col>
                  <AnchorLink offset={80} href="#images-ref">
                    <Button secondary noMargin>
                      {translate("tradeitem.hero.viewMore")}
                    </Button>
                  </AnchorLink>
                </Col>
              </Row>
            )}
          </>

          {/* Consistency status */}
          {false && (
            <>
              <Margin top={5} />
              <Zone>
                <Row>
                  <Col>
                    <H3>{translate(`tradeitem.consistency.title`)}</H3>
                    {!isConsistent(tradeItem) && (
                      <Tag danger>
                        {translate(
                          `tradeitem.consistency.${get(
                            tradeItem,
                            "consistencyStatus"
                          )}`
                        )}
                      </Tag>
                    )}
                    {isConsistent(tradeItem) && (
                      <Tag info>
                        {translate(
                          `tradeitem.consistency.${get(
                            tradeItem,
                            "consistencyStatus"
                          )}`
                        )}
                      </Tag>
                    )}

                    {/* Cause of inconsistency */}
                    {!isConsistent(tradeItem) && (
                      <>
                        <Margin bottom={4} />
                        <P>
                          {translate(`tradeitem.consistency.causedBy`)}
                          <a href="#pricing">
                            {translate(`tradeitem.consistency.pricing`)}
                          </a>
                        </P>
                      </>
                    )}
                  </Col>
                </Row>
              </Zone>
            </>
          )}
        </Col>

        {/* Some info */}
        <Col col style={{ paddingRight: 0 }}>
          {/* Eligibility */}
          {allowViewEligibility(user) && (
            <Eligibility tradeItemId={tradeItemId} translate={translate} />
          )}
        </Col>
      </Row>
      <br />
      <br />
    </>
  );
};

const RetailerThumbsRow = ({
  imageResourceMetadatas,
  countImages,
  tradeItemId,
  user,
  // functions
  translate,
  onImageSelected
}) => {
  return (
    <>
      <Row
        style={{
          maxWidth: "1500px",
          margin: "0 auto"
        }}
      >
        {/* Thumbs apetizers */}
        <Col col={12}>
          <>
            <Zone
              style={{
                padding: "2em",
                paddingBottom: countImages > 4 ? "4rem" : "2rem",
                boxShadow: "rgba(0, 0, 0, 0.25) 0px 0px 30px 0px",
                textAlign: "center"
              }}
              noPadding
              borderRadius
            >
              {map(imageResourceMetadatas.slice(0, 4), (d, i) => (
                <Padding
                  key={`img-hero-${i}`}
                  style={{ width: "25%", position: "relative" }}
                  all={1}
                  inline
                >
                  <ImageCard
                    img={d}
                    user={user}
                    onClick={() => onImageSelected(i)}
                    height="200px"
                    width="100%"
                    translate={translate}
                    isChild={!get(d, 'tradeItemIds').includes(tradeItemId)}
                  />
                </Padding>
              ))}
            </Zone>

            {countImages > 4 && (
              <Row style={{ marginTop: "-1.8em" }}>
                <Col center col>
                  <AnchorLink offset={80} href="#images-ref">
                    <Button secondary noMargin>
                      {translate("tradeitem.hero.viewMore")}
                    </Button>
                  </AnchorLink>
                </Col>
              </Row>
            )}
          </>
        </Col>
      </Row>
      <br />
      <br />
    </>
  );
};

const ImagesThumbsRow = ({
  tradeItemId,
  tradeItem,
  user,
  // functions
  translate,
  onImageSelected
}) => {
  const imageResourceMetadatas = getImageResourceMetadatasFromTradeItem(tradeItem, isRetailer(user));
  const countImages = size(imageResourceMetadatas);

  if (isManufacturer(user))
    return (
      <ManufacturerThumbsRow
        imageResourceMetadatas={imageResourceMetadatas}
        countImages={countImages}
        tradeItemId={tradeItemId}
        tradeItem={tradeItem}
        user={user}
        translate={translate}
        onImageSelected={onImageSelected}
      />
    );

  if (countImages < 3) return <Padding vertical={1} />;

  return (
    <RetailerThumbsRow
      imageResourceMetadatas={imageResourceMetadatas}
      countImages={countImages}
      user={user}
      translate={translate}
      onImageSelected={onImageSelected}
      tradeItemId={get(tradeItem, "tradeItemId")}
    />
  );
};

export default ImagesThumbsRow;
