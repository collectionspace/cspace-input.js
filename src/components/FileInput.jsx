import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getPath } from '../helpers/pathHelpers';
import ChooserInput from './ChooserInput';
import styles from '../../styles/cspace-input/FileInput.css';

const propTypes = {
  accept: PropTypes.string,
  name: PropTypes.string,
  formatFileInfo: PropTypes.func,
  onCommit: PropTypes.func,
};

const defaultProps = {
  formatFileInfo: (name, type, size) => `${name} (${type}, ${size} bytes)`,
};

const fileListToArray = (fileList) => {
  const fileArray = [];

  for (let i = 0; i < fileList.length; i += 1) {
    fileArray.push(fileList[i]);
  }

  return fileArray;
};

export default class FileInput extends Component {
  constructor(props) {
    super(props);

    this.formatValue = this.formatValue.bind(this);
    this.handleChooseButtonClick = this.handleChooseButtonClick.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.handleFileInputRef = this.handleFileInputRef.bind(this);
  }

  formatValue(value) {
    const {
      formatFileInfo,
    } = this.props;

    if (value && value.length > 0) {
      const file = value[0];

      return formatFileInfo(file.name, file.type, file.size);
    }

    return undefined;
  }

  handleChooseButtonClick() {
    if (this.fileInput) {
      this.fileInput.click();
    }
  }

  handleDrop(dataTransfer) {
    const { files } = dataTransfer;

    const {
      onCommit,
    } = this.props;

    if (files && files.length > 0 && onCommit) {
      onCommit(getPath(this.props), fileListToArray(files));
    }
  }

  handleFileInputChange(event) {
    const {
      onCommit,
    } = this.props;

    if (onCommit) {
      const input = event.target;

      onCommit(getPath(this.props), fileListToArray(input.files));
    }
  }

  handleFileInputRef(ref) {
    this.fileInput = ref;
  }

  render() {
    const {
      accept,
      formatValue,
      name,
      ...remainingProps
    } = this.props;

    return (
      <ChooserInput
        className={styles.common}
        formatValue={this.formatValue}
        onChooseButtonClick={this.handleChooseButtonClick}
        onDrop={this.handleDrop}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...remainingProps}
      >
        <input
          accept={accept}
          data-name={name}
          ref={this.handleFileInputRef}
          tabIndex="-1"
          type="file"
          onChange={this.handleFileInputChange}
        />
      </ChooserInput>
    );
  }
}

FileInput.propTypes = {
  ...propTypes,
  ...ChooserInput.propTypes,
};

FileInput.defaultProps = defaultProps;
