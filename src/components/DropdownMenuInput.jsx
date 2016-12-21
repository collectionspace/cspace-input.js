import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import DropdownInput from './DropdownInput';
import Menu from './Menu';
import { getPath } from '../helpers/pathHelpers';
import { getLabelForValue } from '../helpers/optionHelpers';
import styles from '../../styles/cspace-input/DropdownMenuInput.css';

const propTypes = {
  ...DropdownInput.propTypes,
  className: PropTypes.string,
  menuHeader: PropTypes.node,
  menuFooter: PropTypes.node,
  open: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })),
  renderItemLabel: PropTypes.func,
  valueLabel: PropTypes.string,
  onClose: PropTypes.func,
  onCommit: PropTypes.func,
  onMount: PropTypes.func,
  onOpen: PropTypes.func,
};

const defaultProps = {
  blankable: true,
  options: [],
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
      onMount({ value: this.state.value });
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
      label: valueLabel,
    } = option;

    this.setState({
      value,
      valueLabel,
      open: false,
    });

    this.commit(value);
    this.focusInput();
  }

  render() {
    const {
      open,
      value,
      valueLabel,
    } = this.state;

    const {
      className,
      menuHeader,
      menuFooter,
      options,
      renderItemLabel,
      /* eslint-disable no-unused-vars */
      blankable,
      open: openProp,
      valueLabel: valueLabelProp,
      onCommit,
      /* eslint-enable no-unused-vars */
      ...remainingProps
    } = this.props;

    const classes = classNames(className, {
      [styles.common]: true,
      [styles.open]: open,
    });

    const inputValue = valueLabel;

    return (
      <DropdownInput
        {...remainingProps}
        className={classes}
        focusPopup={this.focusMenu}
        open={open}
        spellCheck={false}
        value={inputValue}
        onClose={this.handleDropdownInputClose}
        onMount={this.handleDropdownInputMount}
        onOpen={this.handleDropdownInputOpen}
      >
        {renderMenuHeader(menuHeader)}
        <Menu
          options={options}
          ref={this.handleMenuRef}
          tabIndex="-1"
          renderItemLabel={renderItemLabel}
          value={value}
          onSelect={this.handleMenuSelect}
        />
        {renderMenuFooter(menuFooter)}
      </DropdownInput>
    );
  }
}

DropdownMenuInput.propTypes = propTypes;
DropdownMenuInput.defaultProps = defaultProps;
