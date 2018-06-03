/* global File */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LineInput from './LineInput';
import { getPath, pathPropType } from '../helpers/pathHelpers';
import styles from '../../styles/cspace-input/FileInput.css';
import buttonStyles from '../../styles/cspace-input/MiniButton.css';

const fileListToArray = (fileList) => {
  const fileArray = [];

  for (let i = 0; i < fileList.length; i += 1) {
    fileArray.push(fileList[i]);
  }

  return fileArray;
};

const propTypes = {
  accept: PropTypes.string,
  chooseButtonLabel: PropTypes.string,
  name: PropTypes.string,
  /* eslint-disable react/no-unused-prop-types */
  parentPath: pathPropType,
  subpath: pathPropType,
  /* eslint-enable react/no-unused-prop-types */
  value: PropTypes.arrayOf(PropTypes.instanceOf(File)),
  readOnly: PropTypes.bool,
  formatFileInfo: PropTypes.func,
  onCommit: PropTypes.func,
};

const defaultProps = {
  chooseButtonLabel: 'Select…',
  formatFileInfo: (name, type, size) => `${name} (${type}, ${size} bytes)`,
};

export default class FileInput extends Component {
  constructor(props) {
    super(props);

    this.handleChooseButtonClick = this.handleChooseButtonClick.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.handleFileInputRef = this.handleFileInputRef.bind(this);

    this.state = {
      isDraggedOver: false,
    };
  }

  handleChooseButtonClick() {
    if (this.fileInput) {
      this.fileInput.click();
    }
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
      onCommit,
    } = this.props;

    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;

    if (files && files.length > 0 && onCommit) {
      onCommit(getPath(this.props), fileListToArray(files));
    }

    this.setState({
      isDraggedOver: false,
    });
  }

  handleFileInputChange(event) {
    const input = event.target;

    const {
      onCommit,
    } = this.props;

    if (onCommit) {
      onCommit(getPath(this.props), fileListToArray(input.files));
    }
  }

  handleFileInputRef(ref) {
    this.fileInput = ref;
  }

  render() {
    const {
      accept,
      chooseButtonLabel,
      name,
      value,
      readOnly,
      formatFileInfo,
    } = this.props;

    if (readOnly) {
      return (
        <LineInput readOnly />
      );
    }

    const {
      isDraggedOver,
    } = this.state;

    let selectedFileDescription = null;

    if (value && value.length > 0) {
      const file = value[0];

      selectedFileDescription = formatFileInfo(file.name, file.type, file.size);
    }

    const className = isDraggedOver ? styles.dragOver : styles.normal;

    return (
      // Allow click/drag/drop events on the file info div.
      /* eslint-disable jsx-a11y/no-static-element-interactions */
      <div
        className={className}
      >
        <input
          accept={accept}
          name={name}
          ref={this.handleFileInputRef}
          tabIndex="-1"
          type="file"
          onChange={this.handleFileInputChange}
        />
        <button
          className={buttonStyles.common}
          type="button"
          onClick={this.handleChooseButtonClick}
        >
          {chooseButtonLabel}
        </button>
        <div
          onClick={this.handleChooseButtonClick}
          onDragEnter={this.handleDragEnter}
          onDragLeave={this.handleDragLeave}
          onDragOver={this.handleDragOver}
          onDrop={this.handleDrop}
        >
          {selectedFileDescription}
        </div>
      </div>
      /* eslint-enable jsx-a11y/no-static-element-interactions */
    );
  }
}

FileInput.propTypes = propTypes;
FileInput.defaultProps = defaultProps;
