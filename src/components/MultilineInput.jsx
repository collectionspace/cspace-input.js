import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pathPropType } from '../helpers/pathHelpers';
import styles from '../../styles/cspace-input/MultilineInput.css';

const propTypes = {
  asText: PropTypes.bool,
  embedded: PropTypes.bool,
  name: PropTypes.string,
  parentPath: pathPropType,
  subpath: pathPropType,
  value: PropTypes.string,
  readOnly: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  api: PropTypes.func,
};

/**
 * A text input that accepts and is able to display multiple lines of text. This component takes up
 * more screen space when rendered than LineInput.
 */
export default class MultilineInput extends Component {
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
      asText,
      embedded,
      height,
      value,
      readOnly,
      /* eslint-disable no-unused-vars */
      parentPath,
      subpath,
      api,
      /* eslint-enable no-unused-vars */
      ...remainingProps
    } = this.props;

    const className = embedded ? styles.embedded : styles.normal;
    const normalizedValue = (value === null || typeof value === 'undefined') ? '' : value;
    const style = (typeof height !== 'undefined') ? { height } : undefined;

    if (asText) {
      return (
        <div className={className} style={style}>{normalizedValue}</div>
      );
    }

    return (
      <textarea
        {...remainingProps}
        className={className}
        disabled={readOnly}
        readOnly={!remainingProps.onChange}
        ref={this.handleRef}
        style={style}
        value={normalizedValue}
      />
    );
  }
}


MultilineInput.propTypes = propTypes;
