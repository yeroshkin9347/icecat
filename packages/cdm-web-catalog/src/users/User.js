import React from "react";
import dotProps from "dot-prop-immutable";
import get from "lodash/get";
import filter from "lodash/filter";
import indexOf from "lodash/indexOf";
import map from "lodash/map";
import {
  Container,
  Row,
  Col,
  Label,
  Input,
  Margin,
  Button,
  Select
} from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import { ExternalLink } from "cdm-shared/component/Link";

const getUserDefaults = () => {
  return {
    groupIds: [],
    isBlocked: false
  };
};

class User extends React.Component {
  state = {
    values: this.props.defaultValues || getUserDefaults()
  };

  setValue(key, value) {
    const { values } = this.state;

    this.setState({ values: dotProps.set(values, key, value) });
  }

  render() {
    const { values } = this.state;

    const { usersGroups, isCreating } = this.props;

    const {
      translate,
      onDelete,
      onApply,
      onCancel,
      onChangePassword
    } = this.props;

    return (
      <form onSubmit={e => false} autoComplete="off">
        <Container fluid>
          {/* User info */}
          <Row>
            <Col col>
              {/* First name */}
              <Label block>{translate("users.table.firstname")}</Label>
              <Input
                value={get(values, "firstname") || ""}
                onChange={e =>
                  this.setValue("firstname", e.currentTarget.value)
                }
                block
              />
              <br />

              {/* Last name */}
              <Label block>{translate("users.table.lastname")}</Label>
              <Input
                value={get(values, "lastname") || ""}
                onChange={e => this.setValue("lastname", e.currentTarget.value)}
                block
              />
              <br />

              {/* Groups */}
              <Label block>{translate("users.table.groupIds")}</Label>
              <Select
                hideSelectedOptions={true}
                isClearable={true}
                isMulti
                placeholder=""
                closeMenuOnSelect={false}
                getOptionLabel={o => get(o, "name")}
                getOptionValue={o => get(o, "id")}
                value={filter(
                  usersGroups,
                  g => indexOf(get(values, "groupIds"), get(g, "id")) !== -1
                )}
                onChange={v =>
                  this.setValue(
                    "groupIds",
                    map(v, r => get(r, "id"))
                  )
                }
                options={usersGroups}
              />
              <br />
            </Col>

            <Col col>
              {/* Email */}
              <Label block>{translate("users.table.email")}</Label>
              <Input
                value={get(values, "email") || ""}
                onChange={e => this.setValue("email", e.currentTarget.value)}
                block
              />
              <br />

              {/* Phone Number */}
              <Label block>{translate("users.table.phoneNumber")}</Label>
              <Input
                value={get(values, "phoneNumber") || ""}
                onChange={e =>
                  this.setValue("phoneNumber", e.currentTarget.value)
                }
                block
              />
              <br />

              {/* Change password */}
              {!isCreating && (
                <ExternalLink
                  style={{ cursor: "pointer" }}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChangePassword && onChangePassword();
                  }}
                >
                  {translate("users.newPassword.changePassword")}
                </ExternalLink>
              )}
            </Col>
          </Row>

          <Margin top={5} />

          {/* Actions */}
          <Row>
            <Col col>
              {/* Delete */}
              {!isCreating && (
                <Button
                  onClick={e => onDelete && onDelete()}
                  type="button"
                  danger
                >
                  {translate("users.edit.delete")}
                </Button>
              )}
            </Col>

            <Col col right>
              {/* Cancel */}
              <Button onClick={e => onCancel && onCancel()} type="button" light>
                {translate("users.edit.cancel")}
              </Button>

              {/* Apply */}
              <Button
                onClick={e => onApply && onApply(values)}
                type="button"
                noMargin
                primary
              >
                {translate(`users.edit.${isCreating ? "create" : "update"}`)}
              </Button>
            </Col>
          </Row>
        </Container>
      </form>
    );
  }
}

export default withLocalization(User);
