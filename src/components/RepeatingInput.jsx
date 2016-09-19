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
        <tr key={index}>
          <td className={styles.left}>
            <MiniButton disabled={index === 0}>{index + 1}</MiniButton>
          </td>
          <td className={styles.content}>
            {instance}
          </td>
          <td className={styles.right}>
            <MiniButton disabled={list.length < 2}>−</MiniButton>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <table className={styles.common}>
        <colgroup />
        <thead />
        <tbody>
          {this.renderInstances()}
        </tbody>
        <tfoot>
          <tr>
            <td className={styles.left}>
              <MiniButton>+</MiniButton>
            </td>
          </tr>
        </tfoot>
      </table>
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

RepeatingInput.isInput = true;
