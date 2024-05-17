import React from "react";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import get from "lodash/get";
import ContextualZone from "../ContextualZone";
import { Text, Container, Margin, Row, Col, Tag } from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { withLastActionsLocalContext } from "../store/LastActionProvider";
import { withTradeItemLocalContext } from "../store/TradeItemProvider";
import { getDateTime } from "cdm-shared/utils/date";

class LastActions extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.lastActions !== nextProps.lastActions) return true;
    return false;
  }

  componentDidMount() {
    if (get(this.props.tradeItem, "tradeItemId"))
      this.props.refreshLastActions(get(this.props.tradeItem, "tradeItemId"));
  }

  render() {
    const { lastActions, tradeItem } = this.props;

    const { translate } = this.props;

    if (!get(tradeItem, "tradeItemId")) return <React.Fragment />;

    return (
      <>
        {/* Main zone showing all of the current channels */}
        <ContextualZone>
          <Text bold>
            {translate("tradeItemCrud.lastestActions.title")}
          </Text>

          {/* Display groups */}
          <Container fluid style={{ padding: "0 0 0 0" }}>
            {!isEmpty(lastActions) && <Margin top={4} />}

            {/* Headers */}
            {!isEmpty(lastActions) && (
              <>
                <Row>
                  <Col col>
                    <Text small bold>
                      {translate("tradeItemCrud.lastestActions.status")}
                    </Text>
                  </Col>
                  <Col col>
                    <Text small bold>
                      {translate("tradeItemCrud.lastestActions.firstName")}
                    </Text>
                  </Col>
                  <Col col>
                    <Text small bold>
                      {translate("tradeItemCrud.lastestActions.lastName")}
                    </Text>
                  </Col>
                  <Col col>
                    <Text small bold>
                      {translate("tradeItemCrud.lastestActions.timestamp")}
                    </Text>
                  </Col>
                </Row>
                <br />
              </>
            )}

            {/* Render last actions */}
            {map(lastActions, (lastAction, index) => (
              <Row
                key={`trade-item-last-actions-${index}-${get(
                  lastAction,
                  "timestamp"
                )}`}
              >
                {/* Tag */}
                <Col col>
                  <Tag style={{ color: "#fff" }} secondary>
                    {translate("tradeItemCrud.lastestActions.persisted")}
                  </Tag>
                </Col>

                {/* First name */}
                <Col col>
                  <Text small>
                    {get(lastAction, "firstName", "-")}
                  </Text>
                </Col>

                {/* Last name */}
                <Col col>
                  <Text small >
                    {get(lastAction, "lastName", "-")}
                  </Text>
                </Col>

                {/* Timestamp */}
                <Col col>
                  <Text small>
                    {get(lastAction, "timestamp", null)
                      ? getDateTime(get(lastAction, "timestamp"))
                      : "-"}
                  </Text>
                </Col>
              </Row>
            ))}
          </Container>
        </ContextualZone>
      </>
    );
  }
}

export default withLocalization(
  withTradeItemLocalContext(withLastActionsLocalContext(LastActions))
);
