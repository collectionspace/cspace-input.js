import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Row from 'cspace-layout/lib/components/Row';
import BaseDropdownInput from './DropdownInput';
import LineInput from './LineInput';
import Menu from './Menu';
import changeable from '../enhancers/changeable';
import committable from '../enhancers/committable';
import { getPath } from '../helpers/pathHelpers';
import styles from '../../styles/cspace-input/IDGeneratorInput.css';

const DropdownInput = committable(changeable(BaseDropdownInput));

const propTypes = {
  ...DropdownInput.propTypes,
  patterns: PropTypes.array,
  generateID: PropTypes.func,
  sampleColumnLabel: PropTypes.string,
  typeColumnLabel: PropTypes.string,
  readOnly: PropTypes.bool,
  onMount: PropTypes.func,
  onOpen: PropTypes.func,
};

const defaultProps = {
  patterns: [],
  sampleColumnLabel: 'Sample',
  typeColumnLabel: 'Type',
};

const renderItemLabel = label => (
  <Row>
    <div>{label[0]}</div>
    <div>{label[1]}</div>
  </Row>
);

export default class IDGeneratorInput extends Component {
  constructor(props) {
    super(props);

    this.focusMenu = this.focusMenu.bind(this);
    this.handleDropdownInputClose = this.handleDropdownInputClose.bind(this);
    this.handleDropdownInputMount = this.handleDropdownInputMount.bind(this);
    this.handleDropdownInputOpen = this.handleDropdownInputOpen.bind(this);
    this.handleMenuRef = this.handleMenuRef.bind(this);
    this.handleMenuSelect = this.handleMenuSelect.bind(this);

    this.state = {
      open: false,
    };
  }

  componentDidMount() {
    const {
      onMount,
    } = this.props;

    if (onMount) {
      onMount();
    }
  }

  focusMenu() {
    if (this.menu) {
      this.menu.focus();
    }
  }

  handleDropdownInputMount({ focusInput }) {
    this.focusInput = focusInput;
  }

  handleDropdownInputClose() {
    this.setState({
      open: false,
    });
  }

  handleDropdownInputOpen() {
    const {
      onOpen,
      patterns,
    } = this.props;

    if (onOpen) {
      onOpen(patterns);
    }

    this.setState({
      open: true,
    });
  }

  handleMenuRef(ref) {
    this.menu = ref;
  }

  handleMenuSelect(option) {
    this.setState({
      open: false,
    });

    this.focusInput();

    const {
      generateID,
    } = this.props;

    if (generateID) {
      generateID(option.value, getPath(this.props));
    }
  }

  render() {
    const {
      open,
    } = this.state;

    const {
      patterns,
      sampleColumnLabel,
      typeColumnLabel,
      readOnly,
      /* eslint-disable no-unused-vars */
      generateID,
      onMount,
      onOpen,
      /* eslint-enable no-unused-vars */
      ...remainingProps
    } = this.props;

    if (readOnly) {
      return (
        <LineInput
          readOnly
          value={this.props.value}
          embedded={this.props.embedded}
        />
      );
    }

    const options = patterns.map(pattern => ({
      value: pattern.name,
      label: [pattern.type, pattern.sample],
    }));

    return (
      <DropdownInput
        {...remainingProps}
        className={styles.normal}
        focusPopup={this.focusMenu}
        open={open}
        onClose={this.handleDropdownInputClose}
        onMount={this.handleDropdownInputMount}
        onOpen={this.handleDropdownInputOpen}
      >
        <header>
          <Row>
            <div>{typeColumnLabel}</div>
            <div>{sampleColumnLabel}</div>
          </Row>
        </header>
        <Menu
          options={options}
          ref={this.handleMenuRef}
          renderItemLabel={renderItemLabel}
          tabIndex="-1"
          onSelect={this.handleMenuSelect}
        />
      </DropdownInput>
    );
  }
}

IDGeneratorInput.propTypes = propTypes;
IDGeneratorInput.defaultProps = defaultProps;
