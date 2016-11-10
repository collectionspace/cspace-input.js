import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import DropdownInput from './DropdownInput';
import Menu from './Menu';
import labelable from '../enhancers/labelable';
import repeatable from '../enhancers/repeatable';
import getPath from '../helpers/getPath';

import {
  getLabelForValue,
  getOptionForLabel,
  filterOptions,
  normalizeOptions,
} from '../helpers/optionHelpers';

import styles from '../../styles/cspace-input/DropdownMenuInput.css';

class DropdownMenuInput extends Component {
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

  commit(value) {
    const {
      onCommit,
    } = this.props;

    if (onCommit) {
      onCommit(getPath(this.props, this.context), value);
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

  render() {
    const {
      filter,
      open,
      options,
      value,
      valueLabel,
    } = this.state;

    const {
      /* eslint-disable no-unused-vars */
      blankable,
      options: optionsProp,
      formatFilterMessage,
      onCommit,
      ...remainingProps
      /* eslint-enable no-unused-vars */
    } = this.props;

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
        {...remainingProps}
        className={classes}
        focusPopup={this.focusMenu}
        open={open}
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
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })),
  formatFilterMessage: PropTypes.func,
  onCommit: PropTypes.func,
};

DropdownMenuInput.defaultProps = {
  blankable: true,
  options: [],
};

DropdownMenuInput.contextTypes = {
  defaultSubpath: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  parentPath: PropTypes.arrayOf(PropTypes.string),
};

export const BaseDropdownMenuInput = DropdownMenuInput;
export default repeatable(labelable(DropdownMenuInput));
