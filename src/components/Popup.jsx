import React, { Component, PropTypes } from 'react';
import styles from '../../styles/cspace-input/Popup.css';

const propTypes = {
  children: PropTypes.node,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,

  /**
   * Callback to be executed after the Popup has mounted.
   */
  onMounted: PropTypes.func,
};

export default class Popup extends Component {
  constructor() {
    super();

    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    const {
      onMounted,
    } = this.props;

    if (onMounted) {
      onMounted();
    }
  }

  handleBlur(event) {
    const {
      onBlur,
    } = this.props;

    if (onBlur) {
      onBlur(event);
    }
  }

  handleKeyDown(event) {
    const {
      onKeyDown,
    } = this.props;

    if (onKeyDown) {
      onKeyDown(event);
    }
  }

  render() {
    const {
      children,
    } = this.props;

    // TODO: ARIA

    return (
      /* eslint-disable jsx-a11y/no-static-element-interactions */
      <div
        className={styles.common}
        tabIndex="-1"
        onBlur={this.handleBlur}
        onKeyDown={this.handleKeyDown}
      >
        {children}
      </div>
      /* eslint-enable jsx-a11y/no-static-element-interactions */
    );
  }
}

Popup.propTypes = propTypes;
