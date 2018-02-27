import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Menu from './Menu';
import parseResourceID from '../helpers/parseResourceID';
import styles from '../../styles/cspace-input/QuickAdd.css';
import itemStyles from '../../styles/cspace-input/QuickAddItem.css';

const propTypes = {
  add: PropTypes.func,
  displayName: PropTypes.string,
  partialTerm: PropTypes.string,
  formatAddPrompt: PropTypes.func,
  formatCloneOptionLabel: PropTypes.func,
  formatCreateNewOptionLabel: PropTypes.func,
  formatDestinationName: PropTypes.func,
  recordTypes: PropTypes.object,
  showCloneOption: PropTypes.bool,
  cloneOptionDisabled: PropTypes.bool,
  to: PropTypes.string,
  onBeforeItemFocusChange: PropTypes.func,
};

const defaultProps = {
  formatAddPrompt: (displayName, destinationName) => `Add "${displayName}" to ${destinationName}`,
  formatCloneOptionLabel: () => 'Clone current record',
  formatCreateNewOptionLabel: () => 'Create new record',
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
        clone,
        value,
      } = item;

      const [
        recordType,
        vocabulary,
      ] = value.split('/');

      add(recordType, vocabulary, displayName, partialTerm, clone);
    }
  }

  render() {
    const {
      displayName,
      formatAddPrompt,
      formatCloneOptionLabel,
      formatCreateNewOptionLabel,
      formatDestinationName,
      recordTypes,
      showCloneOption,
      cloneOptionDisabled,
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
          className: itemStyles.add,
        });
      })
      .filter(option => !!option);

    if (options.length === 0) {
      return null;
    }

    // If showCloneOption is true and there is only one destination, the options should be to
    // create new or clone into the source.

    let singleDestinationName;

    if (options.length === 1 && showCloneOption) {
      singleDestinationName = options[0].label;

      options[0].label = formatCreateNewOptionLabel();

      options.push(Object.assign({}, options[0], {
        clone: true,
        label: formatCloneOptionLabel(),
        className: itemStyles.clone,
        disabled: cloneOptionDisabled,
      }));
    }

    return (
      <div className={styles.common}>
        <div>{formatAddPrompt(displayName, singleDestinationName)}</div>

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
