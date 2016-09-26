import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { normalizeLabel } from './Label';
import MiniButton from './MiniButton';
import labelable from '../enhancers/labelable';
import styles from '../../styles/cspace-input/RepeatingInput.css';

function normalizeValue(value) {
  const defaultValue = [undefined];

  if (!value) {
    return defaultValue;
  }

  let normalized;

  if (Array.isArray(value)) {
    normalized = value;
  } else if (Immutable.List.isList(value)) {
    normalized = value.toArray();
  } else {
    normalized = [value];
  }

  if (normalized.length === 0) {
    return defaultValue;
  }

  return normalized;
}

class RepeatingInput extends Component {
  constructor(props) {
    super(props);

    this.handleInstanceCommit = this.handleInstanceCommit.bind(this);
  }

  getPath() {
    const {
      name,
      path,
    } = this.props;

    return (path ? [path, name] : [name]);
  }

  handleInstanceCommit(instancePath, value) {
    const {
      name,
      path,
      onCommit,
    } = this.props;

    if (onCommit) {
      onCommit([...getPath(), ...instancePath], value);
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
          overrideProps.onCommit = this.handleInstanceCommit;
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
    PropTypes.instanceOf(Immutable.List),
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ])),
  ]),
  onCommit: PropTypes.func,
};

export default labelable(RepeatingInput);
