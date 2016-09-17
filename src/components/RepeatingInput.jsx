import React, { Component, PropTypes } from 'react';
import MiniButton from './MiniButton';
import styles from '../../styles/cspace-input/RepeatingInput.css';

function normalizeValue(value) {
  if (!Array.isArray(value)) {
    return [value];
  }

  if (value.length === 0) {
    return [null];
  }

  return value;
}

export default class RepeatingInput extends Component {
  renderInstances() {
    const {
      children,
      value,
    } = this.props;

    const template = React.Children.only(children);

    return normalizeValue(value).map((instanceValue, index, list) => {
      const instance = React.cloneElement(template, {
        embedded: true,
        name: `${index}`,
        value: instanceValue,
      });

      return (
        <li key={index}>
          <div className={styles.left}>
            <MiniButton disabled={index === 0}>{index + 1}</MiniButton>
          </div>
          <div className={styles.content}>
            {instance}
          </div>
          <div className={styles.right}>
            <MiniButton disabled={list.length < 2}>−</MiniButton>
          </div>
        </li>
      );
    });
  }

  render() {
    return (
      <div className={styles.common}>
        <ol>
          {this.renderInstances()}
          <li>
            <div className={styles.left}>
              <MiniButton>+</MiniButton>
            </div>
          </li>
        </ol>
      </div>
    );
  }
}

export const propTypes = RepeatingInput.propTypes = {
  children: PropTypes.node,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ])),
  ]),
};

RepeatingInput.defaultProps = {
  value: [null],
};

