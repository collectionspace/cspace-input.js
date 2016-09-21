import React, { Component, PropTypes } from 'react';
import { normalizeLabel } from './Label';
import MiniButton from './MiniButton';
import labelable from '../enhancers/labelable';
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

class RepeatingInput extends Component {
  renderHeader() {
    const {
      children,
    } = this.props;

    const template = React.Children.only(children);

    const {
      label,
    } = template.props;

    const normalizedLabel = normalizeLabel(label);

    if (!label) {
      return null;
    }

    return (
      <header>
        {normalizedLabel}
      </header>
    );
  }

  renderInstances() {
    const {
      children,
      value,
    } = this.props;

    const template = React.Children.only(children);

    return normalizeValue(value).map((instanceValue, index, list) => {
      const instance = React.cloneElement(template, {
        embedded: true,
        label: undefined,
        name: `${index}`,
        value: instanceValue,
      });

      return (
        <li key={index}>
          <div>
            <MiniButton disabled={index === 0}>{index + 1}</MiniButton>
          </div>
          <div>
            {instance}
          </div>
          <div>
            <MiniButton disabled={list.length < 2}>−</MiniButton>
          </div>
        </li>
      );
    });
  }

  render() {
    const header = this.renderHeader();
    const instances = this.renderInstances();

    return (
      <div className={styles.common}>
        {header}
        <ol>
          {instances}
        </ol>
        <footer>
          <div>
            <MiniButton>+</MiniButton>
          </div>
        </footer>
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

RepeatingInput.isInput = true;

export default labelable(RepeatingInput);
