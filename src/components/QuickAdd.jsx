import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import parseResourceID from '../helpers/parseResourceID';
import styles from '../../styles/cspace-input/QuickAdd.css';

const propTypes = {
  add: PropTypes.func,
  displayName: PropTypes.string,
  formatDestinationName: PropTypes.func,
  formatAddPrompt: PropTypes.func,
  recordTypes: PropTypes.object,
  to: PropTypes.string,
};

const defaultProps = {
  formatAddPrompt: displayName => `Add ${displayName} to`,
  formatDestinationName: (recordTypeConfig, vocabulary) => {
    if (vocabulary) {
      return get(recordTypeConfig,
        ['vocabularies', vocabulary, 'messages', 'collectionName', 'defaultMessage']);
    }

    return get(recordTypeConfig, ['messages', 'record', 'collectionName', 'defaultMessage']);
  },
};

export default class QuickAdd extends Component {
  constructor(props) {
    super(props);

    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick(event) {
    event.preventDefault();

    const {
      add,
      displayName,
    } = this.props;

    if (add) {
      const {
        vocabulary,
        recordtype: recordType,
      } = event.currentTarget.dataset;

      add(recordType, vocabulary, displayName);
    }
  }

  render() {
    const {
      displayName,
      formatAddPrompt,
      formatDestinationName,
      recordTypes,
      to: destinationID,
    } = this.props;

    const destinations = parseResourceID(destinationID);

    const buttons = destinations.map((destination) => {
      const {
        recordType,
        vocabulary,
      } = destination;

      const recordTypeConfig = get(recordTypes, recordType);

      if (!recordTypeConfig) {
        return null;
      }

      if (vocabulary) {
        const vocabularyConfig = get(recordTypeConfig, ['vocabularies', vocabulary]);

        if (!vocabularyConfig) {
          return null;
        }
      }

      return (
        <li key={[recordType, vocabulary].join('/')}>
          <button
            data-recordtype={recordType}
            data-vocabulary={vocabulary}
            onClick={this.handleButtonClick}
          >
            {formatDestinationName(recordTypeConfig, vocabulary)}
          </button>
        </li>
      );
    });

    return (
      <div className={styles.common}>
        <div>{formatAddPrompt(displayName)}</div>
        <ul>
          {buttons}
        </ul>
      </div>
    );
  }
}

QuickAdd.propTypes = propTypes;
QuickAdd.defaultProps = defaultProps;
