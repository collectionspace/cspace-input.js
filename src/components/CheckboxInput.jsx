import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getPath, pathPropType } from '../helpers/pathHelpers';
import styles from '../../styles/cspace-input/CheckboxInput.css';

const propTypes = {
  asText: PropTypes.bool,
  className: PropTypes.string,
  embedded: PropTypes.bool,
  /* eslint-disable react/no-unused-prop-types */
  name: PropTypes.string,
  parentPath: pathPropType,
  subpath: pathPropType,
  /* eslint-enable react/no-unused-prop-types */
  readOnly: PropTypes.bool,
  transition: PropTypes.objectOf(PropTypes.bool),
  trueLabel: PropTypes.string,
  falseLabel: PropTypes.string,
  indeterminateLabel: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
  ]),
  onCommit: PropTypes.func,
  onClick: PropTypes.func,
};

const defaultProps = {
  asText: undefined,
  className: undefined,
  embedded: undefined,
  name: undefined,
  parentPath: undefined,
  subpath: undefined,
  readOnly: undefined,
  transition: {
    null: true,
    true: false,
    false: true,
  },
  trueLabel: 'yes',
  falseLabel: 'no',
  indeterminateLabel: 'indeterminate',
  value: undefined,
  onCommit: undefined,
  onClick: undefined,
};

export default class CheckboxInput extends Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    const {
      transition,
      value,
      onCommit,
    } = this.props;

    if (onCommit) {
      const normalizedValue = (typeof value === 'undefined') ? null : value;
      const newValue = transition[normalizedValue];

      onCommit(getPath(this.props), newValue);
    }
  }

  render() {
    const {
      asText,
      className,
      embedded,
      name,
      parentPath,
      readOnly,
      subpath,
      transition,
      value,
      trueLabel,
      falseLabel,
      indeterminateLabel,
      onClick,
      onCommit,
      ...remainingProps
    } = this.props;

    let checked;
    let textValue;

    let classes = classNames({
      [styles.readOnly]: readOnly,
      [styles.normal]: !readOnly,
      [styles.embedded]: embedded,
    }, className);

    if (value === true) {
      checked = true;
      textValue = trueLabel;
    } else if (value === false) {
      checked = false;
      textValue = falseLabel;
    } else {
      checked = false;
      textValue = indeterminateLabel;
      classes = classNames(classes, styles.indeterminate);
    }

    if (asText) {
      return (
        <div className={classes}>{textValue}</div>
      );
    }

    // FIXME: Don't break jsx-a11y/label-has-associated-control.

    /* eslint-disable
       jsx-a11y/label-has-associated-control,
       jsx-a11y/no-noninteractive-element-interactions,
       jsx-a11y/click-events-have-key-events */
    return (
      <label className={classes} onClick={onClick}>
        <input
          checked={checked}
          data-name={name}
          disabled={readOnly}
          type="checkbox"
          onChange={this.handleChange}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...remainingProps}
        />
        <span />
      </label>
    );
    /* eslint-enable
       jsx-a11y/label-has-associated-control,
       jsx-a11y/no-noninteractive-element-interactions,
       jsx-a11y/click-events-have-key-events */
  }
}

CheckboxInput.propTypes = propTypes;
CheckboxInput.defaultProps = defaultProps;
