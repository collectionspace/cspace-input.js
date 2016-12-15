import React, { Component, PropTypes } from 'react';
import { Row } from 'cspace-layout';
import BaseDropdownInput from './DropdownInput';
import Menu from './Menu';
import changeable from '../enhancers/changeable';
import committable from '../enhancers/committable';
import styles from '../../styles/cspace-input/IDGeneratorInput.css';

const DropdownInput = committable(changeable(BaseDropdownInput));

const propTypes = {
  ...DropdownInput.propTypes,
  patterns: PropTypes.array,
  generateID: PropTypes.func,
  sampleColumnLabel: PropTypes.string,
  typeColumnLabel: PropTypes.string,
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
    this.handleDropdownInputMount = this.handleDropdownInputMount.bind(this);
    this.handleMenuRef = this.handleMenuRef.bind(this);
    this.handleMenuSelect = this.handleMenuSelect.bind(this);

    this.state = {
      open: false,
    };
  }

  focusMenu() {
    if (this.menu) {
      this.menu.focus();
    }
  }

  handleDropdownInputMount({ focusInput }) {
    this.focusInput = focusInput;
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
      generateID(option.value);
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
    } = this.props;

    const options = patterns.map(pattern => ({
      value: pattern.csid,
      label: [pattern.type, pattern.sample],
    }));

    return (
      <DropdownInput
        className={styles.normal}
        focusPopup={this.focusMenu}
        open={open}
        onMount={this.handleDropdownInputMount}
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
          onSelect={this.handleMenuSelect}
        />
      </DropdownInput>
    );
  }
}

IDGeneratorInput.propTypes = propTypes;
IDGeneratorInput.defaultProps = defaultProps;
