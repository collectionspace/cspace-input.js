import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { pathPropType } from '../helpers/pathHelpers';
import styles from '../../styles/cspace-input/ChooserInput.css';
import buttonStyles from '../../styles/cspace-input/MiniButton.css';

const propTypes = {
  children: PropTypes.node,
  chooseButtonLabel: PropTypes.string,
  className: PropTypes.string,
  // TODO: Stop using propTypes in isInput. Until then, these unused props need to be declared so
  // this component is recognized as an input.
  /* eslint-disable react/no-unused-prop-types */
  name: PropTypes.string,
  parentPath: pathPropType,
  subpath: pathPropType,
  /* eslint-enable react/no-unused-prop-types */
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.any,
  readOnly: PropTypes.bool,
  formatValue: PropTypes.func,
  onChooseButtonClick: PropTypes.func,
  onDrop: PropTypes.func,
};

const defaultProps = {
  children: undefined,
  chooseButtonLabel: 'Select…',
  className: undefined,
  name: undefined,
  parentPath: undefined,
  subpath: undefined,
  value: undefined,
  readOnly: undefined,
  formatValue: (value) => value,
  onChooseButtonClick: undefined,
  onDrop: undefined,
};

export default class ChooserInput extends Component {
  constructor(props) {
    super(props);

    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDrop = this.handleDrop.bind(this);

    this.state = {
      isDraggedOver: false,
    };
  }

  handleDragEnter(event) {
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      isDraggedOver: true,
    });
  }

  handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      isDraggedOver: false,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDrop(event) {
    const {
      onDrop,
    } = this.props;

    if (onDrop) {
      event.preventDefault();
      event.stopPropagation();

      onDrop(event.dataTransfer);

      this.setState({
        isDraggedOver: false,
      });
    }
  }

  render() {
    const {
      children,
      chooseButtonLabel,
      className,
      value,
      readOnly,
      formatValue,
      onChooseButtonClick,
      onDrop,
    } = this.props;

    const {
      isDraggedOver,
    } = this.state;

    const formattedValue = formatValue(value);

    const classes = classNames(
      className,
      isDraggedOver ? styles.dragOver : styles.normal,
    );

    let dragDropProps;

    if (onDrop && !readOnly) {
      dragDropProps = {
        onDragEnter: this.handleDragEnter,
        onDragLeave: this.handleDragLeave,
        onDragOver: this.handleDragOver,
        onDrop: this.handleDrop,
      };
    }

    let chooseButton;

    if (!readOnly) {
      chooseButton = (
        <button
          className={buttonStyles.common}
          disabled={readOnly}
          name="choose"
          type="button"
          onClick={onChooseButtonClick}
        >
          {chooseButtonLabel}
        </button>
      );
    }

    return (
      // Allow click/drag/drop events on the file info div.
      <div
        className={classes}
      >
        {children}
        {chooseButton}
        {/* The choose button provides keyboard accessibility -- clicking on the file info
          * container is just an extra convenience -- so no key event should be required. */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
        <div
          onClick={readOnly ? undefined : onChooseButtonClick}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...dragDropProps}
        >
          {formattedValue}
        </div>
      </div>
    );
  }
}

ChooserInput.propTypes = propTypes;
ChooserInput.defaultProps = defaultProps;
