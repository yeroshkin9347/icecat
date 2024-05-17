import React from "react";
import get from "lodash/get";
import findIndex from "lodash/findIndex";
import filter from "lodash/filter";
import {
  withUserManagementAuth,
  getUserId,
} from "cdm-shared/redux/hoc/withAuth";
import {
  Container,
  Button,
  Modal,
  Margin,
  Row,
  Col,
  P,
} from "cdm-ui-components";
import { withLocalization } from "common/redux/hoc/withLocalization";
import Table from "cdm-shared/component/Table";
import { getDateTime } from "cdm-shared/utils/date";
import {
  getUsers,
  deleteUser,
  createUser,
  updateUser,
  getUsersGroups,
  changeUserPassword,
} from "cdm-shared/services/user";
import User from "./User";
import { SinglePageLayout } from "styled-components/layout";
import { IconButton } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

class Users extends React.Component {
  state = {
    users: [],
    user: null,
    usersGroups: [],
    isCreating: false,
    userToRemove: null,
    newPassword: false,
  };

  componentDidMount() {
    // fetch all of the users at once
    getUsers().then((res) => this.setState({ users: get(res, "data", []) }));

    // fetch users groups
    getUsersGroups().then((res) =>
      this.setState({ usersGroups: get(res, "data", []) })
    );
  }

  deleteUser(user) {
    const { users } = this.state;

    const newUsers = filter(users, (u) => u !== user);

    this.setState({ userToRemove: null });
    deleteUser(user.id).then((res) =>
      this.setState({
        users: newUsers,
        user: null,
      })
    );
  }

  createUser(user) {
    const { users } = this.state;

    const { translate } = this.props;

    createUser(user)
      .then((res) => {
        this.setState({ isCreating: false });
        const userId = get(res, "data.userId");
        if (userId)
          this.setState({
            users: [Object.assign({}, user, { id: userId }), ...users],
          });
      })
      .catch((err) => {
        const errorMessage = translate(
          `users.errors.${get(err, "response.data.ErrorCode")}`
        );
        alert(errorMessage);
      });
  }

  updateUser(user) {
    const { users } = this.state;

    const { translate } = this.props;

    updateUser(user)
      .then((res) => {
        this.setState({ user: null });
        // change the current user in array
        const currentIndex = findIndex(
          users,
          (u) => get(u, "id") === get(user, "id")
        );
        if (currentIndex !== -1) {
          this.setState({
            users: Object.assign([], users, { [currentIndex]: user }),
          });
        }
      })
      .catch((err) => {
        const errorMessage = translate(
          `users.errors.${get(err, "response.data.ErrorCode")}`
        );
        alert(errorMessage);
      });
  }

  changePassword(user) {
    changeUserPassword(get(user, "id")).then((res) => {
      this.setState({ newPassword: true });
    });
  }

  render() {
    const { users, user, usersGroups, isCreating, userToRemove, newPassword } =
      this.state;

    const { translate, getCurrentUser } = this.props;

    const currentUser = getCurrentUser();

    return (
      <>
        <SinglePageLayout
          title={translate("users.meta.title")}
          subtitle={translate("users.meta.subtitle")}
          breadcrumbs={[
            { title: translate("header.nav.home"), route: "/" },
            { title: translate("users.meta.title") },
          ]}
          rightSideItems={[
            <Button
              onClick={(e) => this.setState({ isCreating: true })}
              small
              primary
            >
              {translate("users.meta.create")}
            </Button>,
          ]}
        >
          <Table
            filterable
            sortable={true}
            data={users}
            showPaginationTop={true}
            columns={[
              {
                Header: translate("users.table.firstname"),
                accessor: "firstname",
              },
              {
                Header: translate("users.table.lastname"),
                accessor: "lastname",
              },
              {
                Header: translate("users.table.email"),
                width: 300,
                accessor: "email",
              },
              {
                Header: translate("users.table.phoneNumber"),
                accessor: "phoneNumber",
              },
              {
                Header: translate("users.table.lastLoginTimestamp"),
                id: "lastLoginTimestamp",
                className: "text-center",
                accessor: (u) =>
                  getDateTime(get(u, "lastLoginTimestamp", null)),
              },
              {
                Header: translate("users.table.actions"),
                className: "text-center",
                id: "actions",
                accessor: (u) => (
                  <>
                    {/* Edit user */}
                    <IconButton
                      color="primary"
                      size="large"
                      aria-label="Edit user"
                      sx={{
                        padding: 0.5,
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.setState({ user: u });
                      }}
                    >
                      <EditIcon fontSize="medium" />
                    </IconButton>

                    {/* Remove user */}
                    {getUserId(currentUser) !== get(u, "id") && (
                      <IconButton
                        color="error"
                        size="large"
                        aria-label="Remove user"
                        sx={{
                          padding: 0.5,
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          this.setState({ userToRemove: u });
                        }}
                      >
                        <DeleteIcon fontSize="medium" />
                      </IconButton>
                    )}
                  </>
                ),
              },
            ]}
          />
        </SinglePageLayout>

        {/* Edit user modal */}
        {(isCreating || user) && (
          <Modal md>
            <User
              defaultValues={user}
              isCreating={isCreating}
              usersGroups={usersGroups}
              onCancel={() =>
                this.setState({
                  user: null,
                  isCreating: false,
                })
              }
              onDelete={() => this.deleteUser(user)}
              onApply={(u) =>
                isCreating ? this.createUser(u) : this.updateUser(u)
              }
              onChangePassword={() => this.changePassword(user)}
            />
          </Modal>
        )}

        {/* New password */}
        {newPassword && (
          <Modal onClose={() => this.setState({ newPassword: false })} sm>
            <P lead>
              {translate("users.newPassword.title")} {get(user, "email")}
            </P>
          </Modal>
        )}

        {/* Are you sure to remove */}
        {userToRemove && (
          <Modal sm center>
            <Container fluid>
              {translate("users.table.areYouSure")}
              {get(userToRemove, "firstname")}&nbsp;
              {get(userToRemove, "lastname")}&nbsp; (
              {get(userToRemove, "email")})
              <Margin top={5} />
              <Row>
                <Col col right>
                  {/* Cancel */}
                  <Button
                    onClick={(e) => this.setState({ userToRemove: null })}
                    light
                  >
                    {translate("users.edit.cancel")}
                  </Button>

                  {/* Delete */}
                  <Button
                    onClick={(e) => this.deleteUser(userToRemove)}
                    danger
                    noMargin
                  >
                    {translate("users.edit.delete")}
                  </Button>
                </Col>
              </Row>
            </Container>
          </Modal>
        )}
      </>
    );
  }
}

export default withUserManagementAuth(withLocalization(Users));
