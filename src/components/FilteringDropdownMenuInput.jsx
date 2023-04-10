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
  // TODO: Stop using propTypes in isInput, and in render method of cspace-ui Field component.
  // Until then, propTypes need to be hoisted from the base component.
  // eslint-disable-next-line react/forbid-foreign-prop-types
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
  filter: undefined,
  onClose: undefined,
  onOpen: undefined,
  onCommit: undefined,
};

export default class FilteringDropdownMenuInput extends Component {
  constructor(props) {
    super(props);

    this.handleDropdownInputBeforeClose = this.handleDropdownInputBeforeClose.bind(this);
    this.handleDropdownInputChange = this.handleDropdownInputChange.bind(this);
    this.handleDropdownInputClose = this.handleDropdownInputClose.bind(this);
    this.handleDropdownInputCommit = this.handleDropdownInputCommit.bind(this);
    this.handleDropdownInputKeyDown = this.handleDropdownInputKeyDown.bind(this);
    this.handleDropdownInputOpen = this.handleDropdownInputOpen.bind(this);

    const {
      value,
    } = this.props;

    this.state = {
      value,
      isFiltering: false,
      open: false,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
    });
  }

  handleDropdownInputBeforeClose(isCancelled) {
    if (isCancelled) {
      this.setState({
        isFiltering: false,
      });
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
        ignoreDisabledOptions,
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

      // The matching option must not be disabled.

      if (matchingOption && matchingOption.disabled && !ignoreDisabledOptions) {
        matchingOption = null;
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
    const nextState = {
      isFiltering: false,
      open: false,
    };

    const {
      isFiltering,
      valueLabel,
    } = this.state;

    if (isFiltering && valueLabel === '') {
      // Normally enter must be pressed on the value being filtered in order to select a matching
      // option, but make an exception for the blank value. If the dropdown is closed while
      // filtering, and the filter value is blank, automatically select the corresponding option
      // if there is one, or if blankable is true. This allows fields to be cleared without ever
      // pressing enter. This is required by DRYD-227.

      const {
        blankable,
        options,
      } = this.props;

      let matchingOption = getOptionForLabel(options, valueLabel);

      if (!matchingOption && blankable) {
        // If blankable, and the current content of the input is empty, allow it to be
        // committed even if there is no empty option.

        matchingOption = {
          value: '',
          valueLabel: '',
        };
      }

      if (matchingOption) {
        nextState.value = matchingOption.value;
        nextState.valueLabel = matchingOption.label;

        this.commit(matchingOption.value, matchingOption.meta);
      }
    }

    this.setState(nextState);

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

    const {
      open,
    } = this.state;

    if (onOpen) {
      onOpen();
    }

    if (!open) {
      this.setState({
        isFiltering: false,
        open: true,
      });

      this.filter();
    }
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
      className,
      filter,
      formatStatusMessage,
      onMount,
      ...remainingProps
    } = this.props;

    const valueProp = isFiltering ? { valueLabel } : { value };

    const classes = classNames(className, {
      [styles.filtering]: isFiltering,
    });

    return (
      <DropdownMenuInput
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...remainingProps}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...valueProp}
        className={classes}
        menuHeader={this.renderMenuHeader()}
        open={open}
        onBeforeClose={this.handleDropdownInputBeforeClose}
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
