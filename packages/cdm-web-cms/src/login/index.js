import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Zone, Row, Col, Label, Input, Button } from "cdm-ui-components";
import get from "lodash/get";
import { withLocalization } from "common/redux/hoc/withLocalization";
import Presentation from "./Presentation";
import { login, getUser } from "cdm-shared/services/auth";
import withTheme from "cdm-shared/redux/hoc/withTheme";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      loading: false,
      alert: null
    };
    this.submit = this.submit.bind(this);
  }

  submit(e) {
    e.preventDefault();

    const { username, password } = this.state;

    const { history } = this.props;

    const { setToken, setUser } = this.props;

    this.setState({ loading: true });
    login(username, password)
      .then(res => {
        setToken(get(res, "data.access_token"));
        getUser().then(res2 => {
          const user = get(res2, "data");
          setUser(user);
          history.push(`/`);
        });
        this.setState({ loading: false });
      })
      .catch(err => {
        this.setState({
          loading: false,
          alert: "An error occured."
        });
      });
  }

  render() {
    const { username, password, loading } = this.state;

    return (
      <Zone style={{ height: "100vh", overflow: "hidden" }} noPadding noShadow>
        <Row style={{ height: "100%" }}>
          {/* Left zone */}
          <Col col style={{ height: "100%" }}>
            <Presentation>
              <Zone
                transparent
                noPadding
                style={{
                  maxWidth: "500px",
                  margin: "0 auto",
                  boxShadow: "0 0 40px 0 rgba(0, 0, 0, 0.5)",
                  borderRadius: "1em",
                  overflow: "hidden"
                }}
              >
                {/* Login */}
                <Zone left>
                  <form onSubmit={this.submit}>
                    <Label block>Nom d'utilisateur:</Label>
                    <Input
                      id="input-login-email"
                      value={username}
                      onChange={e =>
                        this.setState({ username: e.target.value })
                      }
                      block
                    />
                    <br />

                    <Label block>Mot de passe:</Label>
                    <Input
                      id="input-login-password"
                      value={password}
                      onChange={e =>
                        this.setState({ password: e.target.value })
                      }
                      type="password"
                      block
                    />
                    <br />
                    <br />

                    <Button
                      id="button-login"
                      disabled={loading}
                      type="submit"
                      primary
                      shadow
                      block
                    >
                      {loading && "..."}
                      {!loading && "Me connecter"}
                    </Button>
                  </form>
                </Zone>
              </Zone>
            </Presentation>
          </Col>
        </Row>
      </Zone>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    setToken: token =>
      dispatch({
        type: "AUTH_RECEIVE_TOKEN",
        token
      }),
    setUser: user =>
      dispatch({
        type: "AUTH_RECEIVE_USER",
        user
      })
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTheme(withLocalization(Login)))
);
