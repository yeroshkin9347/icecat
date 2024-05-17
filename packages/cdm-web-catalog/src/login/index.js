import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Zone,
  DarkZone,
  Row,
  Col,
  Label,
  Input,
  Button,
  P
} from "cdm-ui-components";
import get from "lodash/get";
import { withLocalization } from "common/redux/hoc/withLocalization";
import Presentation from "./Presentation";
import Logo from "cdm-shared/component/Logo";
import { login, getUser } from "cdm-shared/services/auth";
import ChangeLanguage from "menu/ChangeLanguage";
import { filter } from "lodash";

import styled from "styled-components";

const FlagContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 1em;
`;

const FlagWrapper= styled.div`
  position: absolute;
`;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      loading: false,
      error: false
    };
    this.submit = this.submit.bind(this);
  }

  submit(e) {
    e.preventDefault();

    const { username, password } = this.state;

    const { history } = this.props;

    const { setToken, setUser } = this.props;

    this.setState({ loading: true, error: false });
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
          error: true
        });
      });
  }

  render() {
    const { username, password, loading, error } = this.state;
    const { currentLocaleCode, changeActiveLanguage, availableLanguages, translate } = this.props;

    const langs = filter(availableLanguages, (al) => al !== currentLocaleCode);


    return (
      <Zone
        style={{ height: "100vh", overflow: "hidden" }}
        noPadding
        noShadow
        noRadius
      >
        <Row style={{ height: "100%" }}>
          {/* Left zone */}
          <Col col style={{ height: "100%" }}>
            <Presentation>
              <Zone
                transparent
                noPadding
                noRadius
                style={{
                  maxWidth: "500px",
                  margin: "0 auto",
                  boxShadow: "0 0 40px 0 rgba(0, 0, 0, 0.5)",
                  borderRadius: "1em",
                  overflow: "hidden"
                }}
              >
                {/* Header */}
                <DarkZone style={{ padding: "1.6em 1.6em" }} center noPadding>
                  <Logo />
                </DarkZone>

                {/* Login */}
                <Zone left>
                  <form onSubmit={this.submit}>
                    <Label block>{translate("login.username")}:</Label>
                    <Input
                      id="input-login-email"
                      value={username}
                      onChange={e =>
                        this.setState({ username: e.target.value })
                      }
                      block
                    />
                    <br />

                    <Label block>{translate("login.password")}:</Label>
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
                    {error && (
                      <P color="red">{translate("login.invalidCredentials")}</P>
                    )}
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
                      {!loading && translate("login.connect")}
                    </Button>
                  </form>

                  <FlagContainer>
                    <FlagWrapper>
                      <ChangeLanguage
                        currentLanguageCode={currentLocaleCode}
                        languages={langs}
                        onLanguageClicked={(langCode) =>
                          changeActiveLanguage(langCode)
                        }
                      />
                    </FlagWrapper>
                  </FlagContainer>
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
  connect(mapStateToProps, mapDispatchToProps)(withLocalization(Login))
);
