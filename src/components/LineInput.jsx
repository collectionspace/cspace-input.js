import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pathPropType } from '../helpers/pathHelpers';
import styles from '../../styles/cspace-input/LineInput.css';
import wrapperStyles from '../../styles/cspace-input/LineInputWrapper.css';

const propTypes = {
  asText: PropTypes.bool,
  embedded: PropTypes.bool,
  name: PropTypes.string,
  parentPath: pathPropType,
  subpath: pathPropType,
  value: PropTypes.string,
  readOnly: PropTypes.bool,
  showLink: PropTypes.bool,
  linkContent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  linkUrl: PropTypes.func,
  api: PropTypes.func,
};

const defaultProps = {
  linkContent: 'Open',
  linkUrl: value => ((value && value.startsWith('http://')) ? value : null),
};

/**
 * A text input that accepts and is able to display only a single line of text. If a value prop is
 * supplied that contains a newline character, the behavior is unspecified; newline characters may
 * be stripped, replaced with other characters, or retained but not displayed. If this presents a
 * problem, use TextInput or MultilineInput.
 */
export default class LineInput extends Component {
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
      readOnly,
      value,
      showLink,
      linkContent,
      linkUrl,
      /* eslint-disable no-unused-vars */
      parentPath,
      subpath,
      api,
      /* eslint-enable no-unused-vars */
      ...remainingProps
    } = this.props;

    const className = embedded ? styles.embedded : styles.normal;
    const normalizedValue = (value === null || typeof value === 'undefined') ? '' : value;

    if (asText) {
      return (
        <div className={className}>{normalizedValue}</div>
      );
    }

    const input = (
      <input
        {...remainingProps}
        // In Chrome, having autocomplete="off" on the parent form doesn't seem to be enough.
        autoComplete="off"
        className={className}
        disabled={readOnly}
        readOnly={!remainingProps.onChange}
        ref={this.handleRef}
        type="text"
        value={normalizedValue}
      />
    );

    if (showLink) {
      const url = linkUrl(value);

      const link = url
        ? <a href={url} target="_blank" rel="noopener noreferrer">{linkContent}</a>
        : null;

      return (
        <div className={wrapperStyles.common}>
          {input}{link}
        </div>
      );
    }

    return input;
  }
}

LineInput.propTypes = propTypes;
LineInput.defaultProps = defaultProps;
