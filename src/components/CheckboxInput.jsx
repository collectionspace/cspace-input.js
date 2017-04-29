import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { getPath, pathPropType } from '../helpers/pathHelpers';
import styles from '../../styles/cspace-input/CheckboxInput.css';

const propTypes = {
  className: PropTypes.string,
  /* eslint-disable react/no-unused-prop-types */
  name: PropTypes.string,
  parentPath: pathPropType,
  subpath: pathPropType,
  /* eslint-enable react/no-unused-prop-types */
  readOnly: PropTypes.bool,
  tristate: PropTypes.bool,
  value: PropTypes.any,
  onCommit: PropTypes.func,
  onClick: PropTypes.func,
};

export default class CheckboxInput extends Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    const {
      tristate,
      value,
      onCommit,
    } = this.props;

    if (onCommit) {
      let newValue;

      if (tristate) {
        if (value === false) {
          // Unchecked goes to checked.

          newValue = true;
        } else {
          // Checked and indeterminate go to false.

          newValue = false;
        }
      } else {
        newValue = !value;
      }

      onCommit(getPath(this.props), newValue);
    }
  }

  render() {
    const {
      className,
      readOnly,
      tristate,
      value,
      onClick,
    } = this.props;

    let checked;
    let classes = classNames(readOnly ? styles.readOnly : styles.normal, className);

    if (tristate) {
      if (value === true) {
        checked = true;
      } else if (value === false) {
        checked = false;
      } else {
        checked = false;
        classes = classNames(classes, styles.indeterminate);
      }
    } else {
      checked = !!value;
    }

    // FIXME: Don't break these lint rules.

    /* eslint-disable jsx-a11y/label-has-for, jsx-a11y/no-static-element-interactions */
    return (
      <label className={classes} onClick={onClick}>
        <input
          checked={checked}
          disabled={readOnly}
          type="checkbox"
          onChange={this.handleChange}
        />
        <span />
      </label>
    );
    /* eslint-enable jsx-a11y/label-has-for, jsx-a11y/no-static-element-interactions */
  }
}

CheckboxInput.propTypes = propTypes;
