import React from 'react';
import { Switch, Route } from 'react-router';
import { createPubkeeperClient } from '../util/pubkeeper';
import Home from '../pages/home';
import { Loader } from '@nio/ui-kit';

export default class Routes extends React.Component {
  state = { pkConnected: false };

  pkClient = false;

  componentDidMount = () => {
    this.connectToPubkeeper();
  };

  componentWillUnmount = () => {
    if (this.pkClient) {
      this.pkClient.disconnect();
      this.setState({ pkConnected: false });
    }
  };

  connectToPubkeeper = () => {
    createPubkeeperClient().then((pkClient) => {
      this.pkClient = pkClient;
      pkClient.connect().then(() => { this.setState({ pkConnected: true }); });
    })
    .catch(() => console.log('unable to locate pubkeeper config details.')); // eslint-disable-line no-console
  };

  render = () => {
    const { pkConnected } = this.state;

    return (
      <Switch>
        <Route exact render={() => pkConnected && <Home pkClient={this.pkClient} />}  path="/" />
      </Switch>
    );
  }
};
