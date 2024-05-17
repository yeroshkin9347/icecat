import React from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import { localStorageGetItem } from "../../utils/localStorage";

const getManufacturerId = user => get(user, "organization_id", null);

const mapDispatchToProps = dispatch => {
  return {
    setUser: user =>
      dispatch({
        type: "AUTH_RECEIVE_USER",
        user
      })
  };
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    token: state.auth.auth.token
  };
};

export default function withUser(WrappedComponent) {
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    class extends React.Component {
      constructor(props) {
        super(props);
        this.getCurrentUser = this.getCurrentUser.bind(this);
        this.setUserValue = this.setUserValue.bind(this);
      }

      componentDidMount() {
        const user = this.getFromLocalStorage();
        if (user) this.props.setUser(user);
      }

      getFromLocalStorage() {
        const user = localStorageGetItem("user");
        if (user) return JSON.parse(user);
        return null;
      }

      getCurrentUser() {
        return this.props.user || this.getFromLocalStorage();
      }

      setUserValue(key, value) {
        const user = this.getCurrentUser();
        user[key] = value;
        this.props.setUser(user);
      }

      render() {
        return (
          <WrappedComponent
            {...this.props}
            getCurrentUser={this.getCurrentUser}
            setUserValue={this.setUserValue}
          />
        );
      }
    }
  );
}

export { getManufacturerId };
