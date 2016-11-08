import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import DropdownInput from './DropdownInput';
import Menu from './Menu';

import {
  getLabelForValue,
  getValueForLabel,
  filterOptions,
  normalizeOptions,
} from '../helpers/optionHelpers';

import styles from '../../styles/cspace-input/DropdownMenuInput.css';

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

    this.state = {
      options,
      filter: null,
      open: false,
      value: props.value,
      valueLabel: getLabelForValue(options, props.value),
    };
  }

  componentWillReceiveProps(nextProps) {
    const options = normalizeOptions(nextProps.options, nextProps.blankable);

    this.setState({
      options,
      value: nextProps.value,
      valueLabel: getLabelForValue(options, nextProps.value),
    });
  }

  closeDropdown() {
    if (this.dropdownInput) {
      this.dropdownInput.close();
      this.dropdownInput.focusInput();
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

      const value = getValueForLabel(options, filter);

      if (value !== null) {
        this.setState({
          value,
          valueLabel: filter,
        });

        this.closeDropdown();
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
    const [
      value,
      valueLabel,
    ] = option;

    this.setState({
      value,
      valueLabel,
    });

    this.closeDropdown();
  }

  render() {
    const {
      filter,
      open,
      options,
      value,
      valueLabel,
    } = this.state;

    const classes = classNames({
      [styles.common]: true,
      [styles.filtering]: filter !== null,
      [styles.open]: open,
    });

    const inputValue = (filter === null) ? valueLabel : filter;
    const filteredOptions = filterOptions(options, filter);

    const menuHeader = (filter === null)
      ? null
      : <header>{this.formatFilterMessage(filteredOptions.length)}</header>;

    return (
      <DropdownInput
        className={classes}
        focusPopup={this.focusMenu}
        ref={this.handleDropdownInputRef}
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

DropdownMenuInput.propTypes = {
  ...DropdownInput.propTypes,
  blankable: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.string)
  ),
  formatFilterMessage: PropTypes.func,
};

DropdownMenuInput.defaultProps = {
  blankable: true,
  options: [],
};
