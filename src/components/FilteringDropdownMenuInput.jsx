import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import BaseDropdownMenuInput from './DropdownMenuInput';
import changeable from '../enhancers/changeable';
import { getOptionForLabel } from '../helpers/optionHelpers';
import { getPath } from '../helpers/pathHelpers';
import styles from '../../styles/cspace-input/FilteringDropdownMenuInput.css';

const DropdownMenuInput = changeable(BaseDropdownMenuInput);

const propTypes = {
  ...DropdownMenuInput.propTypes,
  blankable: PropTypes.bool,
  formatStatusMessage: PropTypes.func,
  filter: PropTypes.func,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  onCommit: PropTypes.func,
};

const defaultProps = {
  blankable: true,
  formatStatusMessage: (count) => {
    const matches = count === 1 ? 'match' : 'matches';
    const num = count === 0 ? 'No' : count;

    return `${num} ${matches} found`;
  },
};

export default class FilteringDropdownMenuInput extends Component {
  constructor(props) {
    super(props);

    this.handleDropdownInputChange = this.handleDropdownInputChange.bind(this);
    this.handleDropdownInputClose = this.handleDropdownInputClose.bind(this);
    this.handleDropdownInputCommit = this.handleDropdownInputCommit.bind(this);
    this.handleDropdownInputKeyDown = this.handleDropdownInputKeyDown.bind(this);
    this.handleDropdownInputOpen = this.handleDropdownInputOpen.bind(this);

    this.state = {
      isFiltering: false,
      open: false,
      value: this.props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
    });
  }

  close() {
    this.setState({
      open: false,
    });
  }

  commit(value, meta) {
    const {
      onCommit,
    } = this.props;

    if (onCommit) {
      onCommit(getPath(this.props), value, meta);
    }
  }

  filter(filterByValue) {
    const {
      filter,
    } = this.props;

    if (filter) {
      filter(filterByValue);
    }
  }

  handleDropdownInputChange(value) {
    this.setState({
      isFiltering: true,
      open: true,
      valueLabel: value,
    });

    this.filter(value);
  }

  handleDropdownInputCommit(path, value, meta) {
    this.setState({
      value,
      isFiltering: false,
      open: false,
    });

    this.filter();
    this.commit(value, meta);
  }

  handleDropdownInputKeyDown(event) {
    const {
      isFiltering,
    } = this.state;

    if (isFiltering && event.key === 'Enter') {
      event.preventDefault();

      const {
        valueLabel,
      } = this.state;

      const {
        blankable,
        options,
      } = this.props;

      // If there is only one option, select it. Otherwise, if the current content of the
      // input matches an option exactly, select it.

      let matchingOption = (options.length === 1)
        ? options[0]
        : getOptionForLabel(options, valueLabel);

      if (!matchingOption && blankable && valueLabel === '') {
        // If blankable, and the current content of the input is empty, allow it to be
        // committed even if there is no empty option.

        matchingOption = {
          value: '',
          valueLabel: '',
        };
      }

      if (matchingOption) {
        this.setState({
          open: false,
          value: matchingOption.value,
          valueLabel: matchingOption.label,
        });

        this.commit(matchingOption.value, matchingOption.meta);
      }
    }
  }

  handleDropdownInputClose() {
    this.setState({
      isFiltering: false,
      open: false,
    });

    const {
      onClose,
    } = this.props;

    if (onClose) {
      onClose();
    }
  }

  handleDropdownInputOpen() {
    const {
      onOpen,
    } = this.props;

    if (onOpen) {
      onOpen();
    }

    if (!this.state.open) {
      this.setState({
        isFiltering: false,
        open: true,
      });

      this.filter();
    }
  }

  renderMenuHeader() {
    const {
      isFiltering,
    } = this.state;

    const {
      formatStatusMessage,
      options,
    } = this.props;

    if (isFiltering) {
      return (
        <span>{formatStatusMessage(options ? options.length : 0)}</span>
      );
    }

    return null;
  }

  render() {
    const {
      isFiltering,
      open,
      value,
      valueLabel,
    } = this.state;

    const {
      onMount,
      className,
      /* eslint-disable no-unused-vars */
      formatStatusMessage,
      /* eslint-enable no-unused-vars */
      ...remainingProps
    } = this.props;

    const valueProp = isFiltering ? { valueLabel } : { value };

    const classes = classNames(className, {
      [styles.filtering]: isFiltering,
    });

    return (
      <DropdownMenuInput
        {...remainingProps}
        {...valueProp}
        className={classes}
        menuHeader={this.renderMenuHeader()}
        open={open}
        onChange={this.handleDropdownInputChange}
        onClose={this.handleDropdownInputClose}
        onCommit={this.handleDropdownInputCommit}
        onKeyDown={this.handleDropdownInputKeyDown}
        onOpen={this.handleDropdownInputOpen}
        onMount={onMount}
      />
    );
  }
}

FilteringDropdownMenuInput.propTypes = propTypes;
FilteringDropdownMenuInput.defaultProps = defaultProps;
