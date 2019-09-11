import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';

export default class Page extends React.Component {
  state = { barcode: null, units: null, weight: null, state: null, log: {}, frame: false };

  componentDidMount = () => {
    const { pkClient } = this.props;
    ['general', 'video'].map(topic => {
      pkClient.addPatron(topic, (patron) => {
        patron.on('message', this.writeDataToState);
        return () => {
          patron.off('message', this.writeDataToState)
        }
      });
    });
  };

  componentWillUnmount = () => {
    if (this.pkClient) this.pkClient.disconnect();
  };

  writeDataToState = (data, meta) => {
    const { log } = this.state;
    const time = new Date().toLocaleString();
    const json = new TextDecoder().decode(data);
    const newData = Array.isArray(JSON.parse(json)) ? JSON.parse(json)[0] : JSON.parse(json);
    const topic = meta.topic;

    if (topic !== 'video') {
      const logKey = `${time} ${topic}`;
      log[logKey] = {
        className: topic === 'error' ? 'text-danger' : topic === 'completed' ? 'text-success' : 'text-default',
        value: JSON.stringify(newData),
      };
      this.setState({ log });
    }
    this.setState(newData);
  };

  render = () => {
    const { log, frame } = this.state;
    return (
      <Row>
        <Col xs="8">
          <div id="log">
            {Object.keys(log).reverse().map((k) => (
              <Row key={k}>
                <Col xs="4" className={log[k].className}>
                  {k}
                </Col>
                <Col xs="8" className={log[k].className}>
                  {log[k].value}
                </Col>
              </Row>
            ))}
          </div>
        </Col>
        <Col xs="4" className="photo-holder">
          <Card>
            <CardBody className="p-3 pg-photo">
              {frame && (<img src={`data:image/jpeg;base64,${frame}`} width="100%" />)}
            </CardBody>
          </Card>
        </Col>
      </Row>

    );
  };
}

Page.propTypes = {
  pkClient: PropTypes.object.isRequired,
};
