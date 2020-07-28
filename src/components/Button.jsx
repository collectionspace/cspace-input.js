import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from '../../styles/cspace-input/Button.css';

const propTypes = {
  className: PropTypes.string,
  icon: PropTypes.bool,
  type: PropTypes.string,
};

const defaultProps = {
  className: undefined,
  icon: undefined,
  type: 'button',
};

/**
 * A button.
 */
export default function Button(props) {
  const {
    className,
    icon,
    type,
    ...remainingProps
  } = props;

  const classes = classNames(icon ? styles.icon : styles.common, className);

  return (
    // TODO: The linter rules only allow static button types (not from a prop). Will need to
    // refactor this. https://github.com/yannickcr/eslint-plugin-react/issues/1846
    <button
      className={classes}
      // eslint-disable-next-line react/button-has-type
      type={type}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...remainingProps}
    />
  );
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;
