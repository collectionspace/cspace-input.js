/* global File */

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
  /* eslint-disable react/no-unused-prop-types */
  name: PropTypes.string,
  parentPath: pathPropType,
  subpath: pathPropType,
  /* eslint-enable react/no-unused-prop-types */
  value: PropTypes.any,
  readOnly: PropTypes.bool,
  formatValue: PropTypes.func,
  onChooseButtonClick: PropTypes.func,
  onDrop: PropTypes.func,
};

const defaultProps = {
  chooseButtonLabel: 'Select…',
  formatValue: value => value,
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
      /* eslint-disable jsx-a11y/no-static-element-interactions */
      <div
        className={classes}
      >
        {children}
        {chooseButton}
        <div
          onClick={readOnly ? undefined : onChooseButtonClick}
          {...dragDropProps}
        >
          {formattedValue}
        </div>
      </div>
      /* eslint-enable jsx-a11y/no-static-element-interactions */
    );
  }
}

ChooserInput.propTypes = propTypes;
ChooserInput.defaultProps = defaultProps;
