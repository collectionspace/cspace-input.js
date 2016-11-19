import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import DropdownInput from './DropdownInput';
import Menu from './Menu';
import { getPath } from '../helpers/pathHelpers';

import {
  getLabelForValue,
  getOptionForLabel,
  filterOptions,
  normalizeOptions,
} from '../helpers/optionHelpers';

import styles from '../../styles/cspace-input/DropdownMenuInput.css';

const propTypes = {
  ...DropdownInput.propTypes,
  blankable: PropTypes.bool,
  embedded: PropTypes.bool,
  formatFilterMessage: PropTypes.func,
  formatLoadingMesasge: PropTypes.func,
  isLoading: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })),
  valueLabel: PropTypes.string,
  onCommit: PropTypes.func,
};

const defaultProps = {
  blankable: true,
  options: [],
};

export default class DropdownMenuInput extends Component {
  constructor(props) {
    super(props);

    this.handleDropdownInputChange = this.handleDropdownInputChange.bind(this);
    this.handleDropdownInputClose = this.handleDropdownInputClose.bind(this);
    this.handleDropdownInputKeyDown = this.handleDropdownInputKeyDown.bind(this);
    this.handleDropdownInputOpen = this.handleDropdownInputOpen.bind(this);
    this.handleDropdownInputRef = this.handleDropdownInputRef.bind(this);
    this.handleMenuRef = this.handleMenuRef.bind(this);
    this.handleMenuSelect = this.handleMenuSelect.bind(this);
    this.focusMenu = this.focusMenu.bind(this);

    const options = normalizeOptions(props.options, props.blankable);
    const canonicalValueLabel = getLabelForValue(options, props.value);

    this.state = {
      options,
      filter: null,
      open: false,
      value: props.value,
      valueLabel: (canonicalValueLabel === null) ? props.valueLabel : canonicalValueLabel,
    };
  }

  componentWillReceiveProps(nextProps) {
    const options = normalizeOptions(nextProps.options, nextProps.blankable);
    const canonicalValueLabel = getLabelForValue(options, nextProps.value);

    this.setState({
      options,
      value: nextProps.value,
      valueLabel: (canonicalValueLabel === null) ? nextProps.valueLabel : canonicalValueLabel,
    });
  }

  commit(value) {
    const {
      onCommit,
    } = this.props;

    if (onCommit) {
      onCommit(getPath(this.props), value);
    }
  }

  focusMenu() {
    if (this.menu) {
      this.menu.focus();
    }
  }

  formatFilterMessage(count) {
    const {
      formatFilterMessage,
    } = this.props;

    if (formatFilterMessage) {
      return formatFilterMessage(count);
    }

    const matches = count === 1 ? 'match' : 'matches';
    const num = count === 0 ? 'No' : count;

    return `${num} ${matches} found`;
  }

  formatLoadingMessage() {
    const {
      formatLoadingMessage,
    } = this.props;

    if (formatLoadingMessage) {
      return formatLoadingMessage();
    }

    return 'Loading...';
  }

  handleDropdownInputChange(value) {
    this.setState({
      filter: value,
    });
  }

  handleDropdownInputClose() {
    this.setState({
      filter: null,
      open: false,
    });
  }

  handleDropdownInputKeyDown(event) {
    if (event.key === 'Enter') {
      const {
        filter,
        options,
      } = this.state;

      let matchingOption = null;

      const matchingOptions = filterOptions(options, filter);

      if (matchingOptions.length === 1) {
        // The filter matches only one option. Select it.
        matchingOption = matchingOptions[0];
      } else if (matchingOptions.length > 1) {
        // The filter matches more than one option. If it matches one of them exactly, select that
        // one.
        matchingOption = getOptionForLabel(matchingOptions, filter);
      }

      if (matchingOption) {
        this.setState({
          filter: null,
          open: false,
          value: matchingOption.value,
          valueLabel: matchingOption.label,
        });

        this.commit(matchingOption.value);
      }
    }
  }

  handleDropdownInputOpen() {
    this.setState({
      filter: null,
      open: true,
    });
  }

  handleDropdownInputRef(ref) {
    this.dropdownInput = ref;
  }

  handleMenuRef(ref) {
    this.menu = ref;
  }

  handleMenuSelect(option) {
    const {
      value,
      label: valueLabel,
    } = option;

    this.setState({
      value,
      valueLabel,
      filter: null,
      open: false,
    });

    this.commit(value);
    this.dropdownInput.focusInput();
  }

  renderMenuHeader(filteredOptions) {
    const {
      filter,
    } = this.state;

    const {
      isLoading,
    } = this.props;

    if (isLoading) {
      return (
        <header>{this.formatLoadingMessage()}</header>
      );
    }

    if (filter === null) {
      return null;
    }

    return (
      <header>{this.formatFilterMessage(filteredOptions.length)}</header>
    );
  }

  render() {
    const {
      filter,
      open,
      options,
      value,
      valueLabel,
    } = this.state;

    const {
      embedded,
      /* eslint-disable no-unused-vars */
      blankable,
      isLoading,
      options: optionsProp,
      formatFilterMessage,
      formatLoadingMessage,
      valueLabel: valueLabelProp,
      onCommit,
      /* eslint-enable no-unused-vars */
      ...remainingProps
    } = this.props;

    const classes = classNames({
      [styles.common]: true,
      [styles.embedded]: embedded,
      [styles.filtering]: filter !== null,
      [styles.open]: open,
    });

    const inputValue = (filter === null) ? valueLabel : filter;
    const filteredOptions = filterOptions(options, filter);
    const menuHeader = this.renderMenuHeader(filteredOptions);

    return (
      <DropdownInput
        {...remainingProps}
        className={classes}
        embedded={embedded}
        focusPopup={this.focusMenu}
        open={open}
        ref={this.handleDropdownInputRef}
        spellCheck={false}
        value={inputValue}
        onChange={this.handleDropdownInputChange}
        onClose={this.handleDropdownInputClose}
        onKeyDown={this.handleDropdownInputKeyDown}
        onOpen={this.handleDropdownInputOpen}
      >
        {menuHeader}
        <Menu
          options={filteredOptions}
          ref={this.handleMenuRef}
          tabIndex="-1"
          value={value}
          onSelect={this.handleMenuSelect}
        />
      </DropdownInput>
    );
  }
}

DropdownMenuInput.propTypes = propTypes;
DropdownMenuInput.defaultProps = defaultProps;
