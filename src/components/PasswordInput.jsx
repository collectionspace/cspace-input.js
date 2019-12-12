import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pathPropType } from '../helpers/pathHelpers';
import styles from '../../styles/cspace-input/LineInput.css';

const propTypes = {
  name: PropTypes.string,
  parentPath: pathPropType,
  subpath: pathPropType,
  value: PropTypes.string,
  readOnly: PropTypes.bool,
  api: PropTypes.func,
};

const defaultProps = {
  name: undefined,
  parentPath: undefined,
  subpath: undefined,
  value: '',
  readOnly: undefined,
  api: undefined,
};

export default class PasswordInput extends Component {
  constructor() {
    super();

    this.handleRef = this.handleRef.bind(this);
  }

  componentDidMount() {
    const {
      api,
    } = this.props;

    if (api) {
      api({
        focus: this.focus.bind(this),
      });
    }
  }

  componentWillUnmount() {
    const {
      api,
    } = this.props;

    if (api) {
      api(null);
    }
  }

  focus() {
    this.domNode.focus();
  }

  handleRef(ref) {
    this.domNode = ref;
  }

  render() {
    const {
      api,
      name,
      parentPath,
      subpath,
      readOnly,
      value,
      ...remainingProps
    } = this.props;

    const normalizedValue = (value === null || typeof value === 'undefined') ? '' : value;

    return (
      <input
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...remainingProps}
        className={styles.normal}
        disabled={readOnly}
        data-name={name}
        readOnly={!remainingProps.onChange}
        ref={this.handleRef}
        type="password"
        value={normalizedValue}
      />
    );
  }
}

PasswordInput.propTypes = propTypes;
PasswordInput.defaultProps = defaultProps;
