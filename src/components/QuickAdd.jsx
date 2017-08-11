import React, { Component } from 'react';
import Menu from './Menu';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import parseResourceID from '../helpers/parseResourceID';
import {capitalizeLabel} from '../helpers/optionHelpers';
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
    this.handleMenuRef = this.handleMenuRef.bind(this);
    this.focusMenu = this.focusMenu.bind(this);
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

  handleMenuRef(ref) {
    this.menu = ref;
  }

  focusMenu() {
    if (this.menu) {
      this.menu.focus();
    }
  }

  render() {
    const {
      displayName,
      formatAddPrompt,
      formatDestinationName,
      recordTypes,
      to: destinationID,
      shouldTransferFocus,
      notifyBeforeFocusWrap,
    } = this.props;

    const destinations = parseResourceID(destinationID);

    const options = destinations.map((destination) => {
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
      // TODO: render labels method? - Yousuf
      return ({label: capitalizeLabel(`${recordType} ${vocabulary}`), value: `${recordType}/${vocabulary}`});
    });

    return (
      <div className={styles.common}>
        <div>{formatAddPrompt(displayName)}</div>
          <Menu
            options={options}
            onSelect={this.handleButtonClick}
            tabIndex="-1"
            ref={this.handleMenuRef}
            shouldTransferFocus={shouldTransferFocus}
            notifyBeforeFocusWrap={notifyBeforeFocusWrap}
          />
      </div>
    );
  }
}

QuickAdd.propTypes = propTypes;
QuickAdd.defaultProps = defaultProps;
