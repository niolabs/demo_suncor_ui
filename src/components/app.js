import React, { Component } from 'react';
import { Navbar, NavbarToggler, Nav, NavItem, Collapse, NavLink as DumbNavLink } from '@nio/ui-kit';
import { NavLink } from 'react-router-dom';

import '../app.scss';
import Routes from './routes';
import { authRequired, handleAuthentication, isAuthenticated, login, logout } from '../util/auth';
import { staticPubkeeper } from '../util/pubkeeper';
import ConfigModal from './configModal';

class App extends Component {
  state = { navOpen: false, configOpen: false };

  componentDidMount = () => {
    if (window.location.search.indexOf('authorize=true') >= 0) {
      handleAuthentication().then(() => this.forceRender());
    } else if (!isAuthenticated() && authRequired()) {
      login();
    }
  };

  forceRender = () => {
    this.setState(this.state);
  };

  openConfig = () => {
    this.setState({ configOpen: true, navOpen: false });
  };

  closeConfig = () => {
    this.setState({ configOpen: false });
  };

  render = () => {
    const { navOpen, configOpen } = this.state;
    const auth = isAuthenticated();
    const authrequired = authRequired();
    const staticPK = staticPubkeeper();

    return (auth || !authrequired) ? (
      <>
        <Navbar id="app-nav" dark fixed="top" expand="md">
          <div className="navbar-brand">
            <NavLink to="/"><div id="logo" /></NavLink>
          </div>
          <NavbarToggler right onClick={() => this.setState({ navOpen: !navOpen })} isOpen={navOpen} />
          <Collapse isOpen={navOpen} navbar>
            <Nav className="ml-auto" navbar>
              { !staticPK && (
                <NavItem>
                  <DumbNavLink onClick={() => this.openConfig()} title="settings"><i className="fa fa-lg fa-gear" /></DumbNavLink>
                </NavItem>
              )}
              { (authrequired || auth) && (
                auth ? (
                  <NavItem>
                    <DumbNavLink onClick={() => logout()} title="log out"><i className="fa fa-lg fa-sign-out" /></DumbNavLink>
                  </NavItem>
                ) : (
                  <NavItem>
                    <DumbNavLink onClick={() => login()} title="log in"><i className="fa fa-lg fa-sign-in" /></DumbNavLink>
                  </NavItem>
                )
              )}
            </Nav>
          </Collapse>
        </Navbar>
        <div id="app-container">
          <Routes />
        </div>
        <ConfigModal
          isOpen={configOpen}
          openConfig={this.openConfig}
          closeConfig={this.closeConfig}
        />
      </>
    ) : null;
  }
}

export default App;
