/* global File */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BaseTextInput from './TextInput';
import BaseDropdownMenuInput from './DropdownMenuInput';
import BaseFileInput from './FileInput';
import changeable from '../enhancers/changeable';
import committable from '../enhancers/committable';
import labelable from '../enhancers/labelable';
import { getPath, pathPropType } from '../helpers/pathHelpers';
import styles from '../../styles/cspace-input/UploadInput.css';

const DropdownMenuInput = labelable(BaseDropdownMenuInput);
const TextInput = labelable(committable(changeable(BaseTextInput)));
const FileInput = labelable(BaseFileInput);

const propTypes = {
  /* eslint-disable react/no-unused-prop-types */
  name: PropTypes.string,
  parentPath: pathPropType,
  subpath: pathPropType,
  /* eslint-enable react/no-unused-prop-types */
  type: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.instanceOf(File)),
    PropTypes.string,
  ]),
  readOnly: PropTypes.bool,
  typeInputLabel: PropTypes.string,
  fileOptionLabel: PropTypes.string,
  urlOptionLabel: PropTypes.string,
  fileInputLabel: PropTypes.string,
  fileChooseButtonLabel: PropTypes.string,
  urlInputLabel: PropTypes.string,
  formatFileInfo: PropTypes.func,
  onCommit: PropTypes.func,
  onTypeChanged: PropTypes.func,
};

const defaultProps = {
  type: 'file',
  typeInputLabel: 'Upload',
  fileOptionLabel: 'local file',
  urlOptionLabel: 'external media',
  fileInputLabel: 'File',
  fileChooseButtonLabel: undefined,
  urlInputLabel: 'URL',
  formatFileInfo: undefined,
};

export default class UploadInput extends Component {
  constructor(props) {
    super(props);

    this.handleTypeInputCommit = this.handleTypeInputCommit.bind(this);
    this.handleFileInputCommit = this.handleFileInputCommit.bind(this);
    this.handleUrlInputCommit = this.handleUrlInputCommit.bind(this);

    this.state = {
      type: props.type,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      type: nextProps.type,
    });
  }

  handleTypeInputCommit(path, value) {
    const prevValue = this.state.value;

    this.setState({
      type: value,
    });

    const {
      onCommit,
      onTypeChanged,
    } = this.props;

    if (onCommit) {
      onCommit(getPath(this.props), null);
    }

    if (onTypeChanged && (value !== prevValue)) {
      onTypeChanged(value);
    }
  }

  handleFileInputCommit(path, value) {
    const {
      onCommit,
    } = this.props;

    if (onCommit) {
      onCommit(getPath(this.props), value);
    }
  }

  handleUrlInputCommit(path, value) {
    const {
      onCommit,
    } = this.props;

    if (onCommit) {
      onCommit(getPath(this.props), value);
    }
  }

  renderTypeInput() {
    const {
      readOnly,
      typeInputLabel,
      fileOptionLabel,
      urlOptionLabel,
    } = this.props;

    const {
      type,
    } = this.state;

    const options = [
      { value: 'file', label: fileOptionLabel },
      { value: 'url', label: urlOptionLabel },
    ];

    return (
      <DropdownMenuInput
        label={typeInputLabel}
        name="type"
        readOnly={readOnly}
        options={options}
        value={type}
        onCommit={this.handleTypeInputCommit}
      />
    );
  }

  renderFileInput() {
    const {
      readOnly,
      value,
      fileInputLabel,
      fileChooseButtonLabel,
      formatFileInfo,
    } = this.props;

    const fileList = (value instanceof Array) ? value : null;

    return (
      <FileInput
        label={fileInputLabel}
        name="file"
        readOnly={readOnly}
        value={fileList}
        chooseButtonLabel={fileChooseButtonLabel}
        formatFileInfo={formatFileInfo}
        onCommit={this.handleFileInputCommit}
      />
    );
  }

  renderUrlInput() {
    const {
      readOnly,
      value,
      urlInputLabel,
    } = this.props;

    const externalUrl = (typeof value === 'string') ? value : null;

    return (
      <TextInput
        label={urlInputLabel}
        name="url"
        readOnly={readOnly}
        value={externalUrl}
        onCommit={this.handleUrlInputCommit}
      />
    );
  }

  render() {
    const {
      type,
    } = this.state;

    const fileOrUrlInput = (type === 'file')
      ? this.renderFileInput()
      : this.renderUrlInput();

    return (
      <div className={styles.common}>
        {this.renderTypeInput()}
        {fileOrUrlInput}
      </div>
    );
  }
}

UploadInput.propTypes = propTypes;
UploadInput.defaultProps = defaultProps;
