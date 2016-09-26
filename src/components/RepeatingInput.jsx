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
    this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
    this.handleRemoveButtonClick = this.handleRemoveButtonClick.bind(this);

    this.componentWillReceiveProps(props);
  }

  componentWillReceiveProps(nextProps) {
    const {
      value,
    } = nextProps;

    const {
      onSingleValueReceived,
    } = this.props;

    if (onSingleValueReceived && !Immutable.List.isList(value) && !Array.isArray(value)) {
      onSingleValueReceived(this.getPath());
    }
  }

  getPath() {
    const {
      name,
      path,
    } = this.props;

    return (path ? [path, name] : [name]);
  }

  handleAddButtonClick() {
    const {
      onAddInstance,
    } = this.props;

    if (onAddInstance) {
      onAddInstance(this.getPath());
    }
  }

  handleInstanceCommit(instancePath, value) {
    const {
      onCommit,
    } = this.props;

    if (onCommit) {
      onCommit([...this.getPath(), ...instancePath], value);
    }
  }

  handleRemoveButtonClick(event) {
    const {
      onRemoveInstance,
    } = this.props;

    if (onRemoveInstance) {
      const instanceName = event.target.dataset.instancename;

      onRemoveInstance([...this.getPath(), instanceName]);
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
      const instanceName = `${index}`;

      const overrideProps = {
        embedded: true,
        label: undefined,
        name: instanceName,
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
            <MiniButton
              disabled={index === 0}
            >
              {index + 1}
            </MiniButton>
          </div>
          <div>
            {instance}
          </div>
          <div>
            <MiniButton
              data-instancename={instanceName}
              disabled={list.length < 2}
              name="remove"
              onClick={this.handleRemoveButtonClick}
            >
              −
            </MiniButton>
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
            <MiniButton
              name="add"
              onClick={this.handleAddButtonClick}
            >
              +
            </MiniButton>
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
  onAddInstance: PropTypes.func,
  onCommit: PropTypes.func,
  onRemoveInstance: PropTypes.func,
  onSingleValueReceived: PropTypes.func,
};

export default labelable(RepeatingInput);
