import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import LineInput from './LineInput';
import DropdownInput from './DropdownInput';
import Menu from './Menu';
import { getPath } from '../helpers/pathHelpers';
import { getLabelForValue } from '../helpers/optionHelpers';
import styles from '../../styles/cspace-input/DropdownMenuInput.css';

const propTypes = {
  // TODO: Stop using propTypes in isInput, and in render method of cspace-ui Field component.
  // Until then, propTypes need to be hoisted from the base component.
  // eslint-disable-next-line react/forbid-foreign-prop-types
  ...DropdownInput.propTypes,
  blankable: PropTypes.bool,
  className: PropTypes.string,
  menuHeader: PropTypes.node,
  menuFooter: PropTypes.node,
  open: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })),
  ignoreDisabledOptions: PropTypes.bool,
  readOnly: PropTypes.bool,
  renderItemLabel: PropTypes.func,
  valueLabel: PropTypes.string,
  onClose: PropTypes.func,
  onCommit: PropTypes.func,
  onItemMouseEnter: PropTypes.func,
  onItemMouseLeave: PropTypes.func,
  onMount: PropTypes.func,
  onOpen: PropTypes.func,
  onUpdate: PropTypes.func,
};

const defaultProps = {
  blankable: undefined,
  className: undefined,
  menuHeader: undefined,
  menuFooter: undefined,
  open: undefined,
  options: [],
  ignoreDisabledOptions: undefined,
  readOnly: undefined,
  renderItemLabel: undefined,
  valueLabel: undefined,
  onClose: undefined,
  onCommit: undefined,
  onItemMouseEnter: undefined,
  onItemMouseLeave: undefined,
  onMount: undefined,
  onOpen: undefined,
  onUpdate: undefined,
};

const renderMenuHeader = (content) => {
  if (content) {
    return (
      <header>{content}</header>
    );
  }

  return null;
};

const renderMenuFooter = (content) => {
  if (content) {
    return (
      <footer>{content}</footer>
    );
  }

  return null;
};

export default class DropdownMenuInput extends Component {
  constructor(props) {
    super(props);

    this.handleDropdownInputClose = this.handleDropdownInputClose.bind(this);
    this.handleDropdownInputMount = this.handleDropdownInputMount.bind(this);
    this.handleDropdownInputOpen = this.handleDropdownInputOpen.bind(this);
    this.handleMenuRef = this.handleMenuRef.bind(this);
    this.handleMenuSelect = this.handleMenuSelect.bind(this);
    this.focusMenu = this.focusMenu.bind(this);

    const valueLabel = (props.valueLabel === null || typeof props.valueLabel === 'undefined')
      ? getLabelForValue(props.options, props.value)
      : props.valueLabel;

    this.state = {
      valueLabel,
      open: false,
      value: props.value,
    };
  }

  componentDidMount() {
    const {
      onMount,
    } = this.props;

    if (onMount) {
      const {
        value,
      } = this.state;

      onMount({
        value,
        focusMenu: this.focusMenu.bind(this),
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const valueLabel = (nextProps.valueLabel === null || typeof nextProps.valueLabel === 'undefined')
      ? getLabelForValue(nextProps.options, nextProps.value)
      : nextProps.valueLabel;

    this.setState({
      valueLabel,
      open: nextProps.open,
      value: nextProps.value,
    });
  }

  componentDidUpdate() {
    const {
      onUpdate,
    } = this.props;

    if (onUpdate) {
      const {
        value,
      } = this.state;

      onUpdate({ value });
    }
  }

  commit(value, meta) {
    const {
      value: initialValue,
      onCommit,
    } = this.props;

    if (
      onCommit
      && (value || initialValue)
      && (value !== initialValue)
    ) {
      onCommit(getPath(this.props), value, meta);
    }
  }

  focusMenu(itemIndex) {
    if (this.menu) {
      this.menu.focus(itemIndex);
    }
  }

  handleDropdownInputClose() {
    this.setState({
      open: false,
    });

    const {
      onClose,
    } = this.props;

    if (onClose) {
      onClose();
    }
  }

  handleDropdownInputMount({ focusInput }) {
    this.focusInput = focusInput;
  }

  handleDropdownInputOpen() {
    this.setState({
      open: true,
    });

    const {
      onOpen,
    } = this.props;

    if (onOpen) {
      onOpen();
    }
  }

  handleMenuRef(ref) {
    this.menu = ref;
  }

  handleMenuSelect(option) {
    const {
      value,
      meta,
      label: valueLabel,
    } = option;

    this.setState({
      value,
      valueLabel,
      open: false,
    });

    this.commit(value, meta);
    this.focusInput();
  }

  render() {
    const {
      open,
      value,
      valueLabel,
    } = this.state;

    const {
      blankable,
      className,
      focusPopup,
      ignoreDisabledOptions,
      menuHeader,
      menuFooter,
      onBeforeItemFocusChange,
      onClose,
      onCommit,
      onItemMouseEnter,
      onItemMouseLeave,
      onMount,
      onOpen,
      onUpdate,
      open: openProp,
      options,
      readOnly,
      renderItemLabel,
      valueLabel: valueLabelProp,
      ...remainingProps
    } = this.props;

    const inputValue = valueLabel;

    if (readOnly) {
      const { embedded } = remainingProps;

      return (
        <LineInput
          readOnly
          value={inputValue}
          embedded={embedded}
        />
      );
    }

    const classes = classNames(className, {
      [styles.common]: true,
      [styles.open]: open,
    });

    return (
      <DropdownInput
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...remainingProps}
        className={classes}
        open={open}
        spellCheck={false}
        value={inputValue}
        onClose={this.handleDropdownInputClose}
        onMount={this.handleDropdownInputMount}
        onOpen={this.handleDropdownInputOpen}
        focusPopup={focusPopup || this.focusMenu}
      >
        {renderMenuHeader(menuHeader)}
        <Menu
          options={options}
          ignoreDisabledOptions={ignoreDisabledOptions}
          ref={this.handleMenuRef}
          tabIndex="-1"
          renderItemLabel={renderItemLabel}
          value={value}
          onSelect={this.handleMenuSelect}
          onBeforeItemFocusChange={onBeforeItemFocusChange}
          onItemMouseEnter={onItemMouseEnter}
          onItemMouseLeave={onItemMouseLeave}
        />
        {renderMenuFooter(menuFooter)}
      </DropdownInput>
    );
  }
}

DropdownMenuInput.propTypes = propTypes;
DropdownMenuInput.defaultProps = defaultProps;
