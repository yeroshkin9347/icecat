import React from "react";
import dotProps from "dot-prop-immutable";
import map from "lodash/map";
import get from "lodash/get";
import TradeItemProperty from "../properties/TradeItemProperty";
import { withTradeItemPropertiesLocalContext } from "../store/TradeItemPropertiesProvider";
import { Row, Container, Button, Margin, Col } from "cdm-ui-components";
import MediaCard from "./MediaCard";
import { withLocalization } from "common/redux/hoc/withLocalization";
import MediaTagsEdit from "./MediaTagsEdit";

class EditMedia extends React.Component {
  state = {
    mediaEdit: Object.assign({}, this.props.media) || {},
  };

  render() {
    const { mediaEdit } = this.state;

    const { tradeItemProperties, showPrePicture } = this.props;

    const { translate, onApply, onCancel } = this.props;

    return (
      <Container fluid>
        {/* Thumb */}
        {showPrePicture !== false && (
          <Row>
            <Col col>
              <MediaCard
                style={{ width: "100px" }}
                src={
                  get(mediaEdit, "publicUrl", null) || get(mediaEdit, "_tmpUrl")
                }
                showPrePicture={showPrePicture}
                height="100px"
                imgHeight="100px"
              />
            </Col>
          </Row>
        )}

        {/* Properties */}
        {map(tradeItemProperties, (property, key) =>
          property.code !== "tags" ? (
            <TradeItemProperty
              key={`media-property-edit-${property.id}-${key}`}
              value={get(mediaEdit, property.code, null)}
              onChange={(newVal) => {
                this.setState({
                  mediaEdit: dotProps.set(
                    this.state.mediaEdit,
                    `${property.code}`,
                    newVal
                  ),
                });
              }}
              property={property}
              disabled={property && property.isReadOnly}
            />
          ) : (
            <MediaTagsEdit
              property={property}
              tagIds={this.state.mediaEdit.tagIds}
              onChange={(tags) => {
                let newMediaEdit = dotProps.set(
                  this.state.mediaEdit,
                  "tags",
                  tags.map((tag) => tag.label)
                );

                newMediaEdit = dotProps.set(
                  newMediaEdit,
                  "tagIds",
                  tags.map((tag) => tag.id)
                );

                this.setState({
                  mediaEdit: newMediaEdit,
                });
              }}
              disabled={property && property.isReadOnly}
            />
          )
        )}

        {/* Actions */}
        <Margin top={5} />
        <Row>
          <Col right>
            {/* Cancel */}
            <Button onClick={(e) => onCancel && onCancel()} light small>
              {translate("tradeItemCrud.media.cancel")}
            </Button>

            {/* Update */}
            <Button
              onClick={(e) => onApply && onApply(mediaEdit)}
              primary
              noMargin
              small
            >
              {translate("tradeItemCrud.media.update")}
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withLocalization(
  withTradeItemPropertiesLocalContext(EditMedia)
);
