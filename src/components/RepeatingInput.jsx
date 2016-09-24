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
    return [undefined];
  }

  return value;
}

class RepeatingInput extends Component {
  constructor(props) {
    super(props);

    this.handleCommit = this.handleCommit.bind(this);
  }

  handleCommit(instancePath, value) {
    const {
      name,
      path,
      onCommit,
    } = this.props;

    if (onCommit) {
      onCommit(path ? [path, name, ...instancePath] : [name, ...instancePath], value);
    }
  }

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
        <div />
        <div>
          {normalizedLabel}
        </div>
        <div />
      </header>
    );
  }

  renderInstances() {
    const {
      children,
      value,
    } = this.props;

    const template = React.Children.only(children);
    const childPropTypes = template.type.propTypes;

    return normalizeValue(value).map((instanceValue, index, list) => {
      const overrideProps = {
        embedded: true,
        label: undefined,
        name: `${index}`,
        value: instanceValue,
      };

      if (childPropTypes) {
        if (childPropTypes.onCommit) {
          overrideProps.onCommit = this.handleCommit;
        }
      }

      const instance = React.cloneElement(template, overrideProps);

      return (
        <div key={index}>
          <div>
            <MiniButton disabled={index === 0}>{index + 1}</MiniButton>
          </div>
          <div>
            {instance}
          </div>
          <div>
            <MiniButton disabled={list.length < 2}>−</MiniButton>
          </div>
        </div>
      );
    });
  }

  render() {
    const {
      name,
    } = this.props;

    const header = this.renderHeader();
    const instances = this.renderInstances();

    return (
      <fieldset
        className={styles.common}
        name={name}
      >
        <div>
          {header}
          {instances}
        </div>
        <footer>
          <div>
            <MiniButton>+</MiniButton>
          </div>
        </footer>
      </fieldset>
    );
  }
}

RepeatingInput.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
  path: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ])),
  ]),
  onCommit: PropTypes.func,
};

RepeatingInput.defaultProps = {
  value: [undefined],
};

export default labelable(RepeatingInput);
