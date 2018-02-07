import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Menu from './Menu';
import parseResourceID from '../helpers/parseResourceID';
import styles from '../../styles/cspace-input/QuickAdd.css';

const propTypes = {
  add: PropTypes.func,
  displayName: PropTypes.string,
  partialTerm: PropTypes.string,
  formatDestinationName: PropTypes.func,
  formatAddPrompt: PropTypes.func,
  recordTypes: PropTypes.object,
  to: PropTypes.string,
  onBeforeItemFocusChange: PropTypes.func,
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

    this.handleMenuRef = this.handleMenuRef.bind(this);
    this.handleMenuSelect = this.handleMenuSelect.bind(this);
  }

  focusMenu(itemIndex) {
    if (this.menu) {
      this.menu.focus(itemIndex);
    }
  }

  handleMenuRef(ref) {
    this.menu = ref;
  }

  handleMenuSelect(item) {
    const {
      add,
      displayName,
      partialTerm,
    } = this.props;

    if (add) {
      const {
        value,
      } = item;

      const [
        recordType,
        vocabulary,
      ] = value.split('/');

      add(recordType, vocabulary, displayName, partialTerm);
    }
  }

  render() {
    const {
      displayName,
      formatAddPrompt,
      formatDestinationName,
      recordTypes,
      to: destinationID,
      onBeforeItemFocusChange,
    } = this.props;

    const destinations = parseResourceID(destinationID);

    const options = destinations
      .map((destination) => {
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

        return ({
          label: formatDestinationName(recordTypeConfig, vocabulary),
          value: `${recordType}/${vocabulary}`,
        });
      })
      .filter(option => !!option);

    if (options.length === 0) {
      return null;
    }

    return (
      <div className={styles.common}>
        <div>{formatAddPrompt(displayName)}</div>

        <Menu
          options={options}
          tabIndex="-1"
          ref={this.handleMenuRef}
          onBeforeItemFocusChange={onBeforeItemFocusChange}
          onSelect={this.handleMenuSelect}
        />
      </div>
    );
  }
}

QuickAdd.propTypes = propTypes;
QuickAdd.defaultProps = defaultProps;
