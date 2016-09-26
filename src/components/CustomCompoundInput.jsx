import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import get from 'lodash/get';
import labelable from '../enhancers/labelable';
import repeatable from '../enhancers/repeatable';
import styles from '../../styles/cspace-input/CompoundInput.css';

class CustomCompoundInput extends Component {
  constructor(props) {
    super(props);

    this.handleCommit = this.handleCommit.bind(this);
    this.getValue = this.getValue.bind(this);
    this.decorateInputs = this.decorateInputs.bind(this);
  }

  getValue(name, path = this.props.defaultPath) {
    const {
      value,
    } = this.props;

    const keyPath = path ? [path, name] : [name];

    if (Immutable.Map.isMap(value)) {
      return value.getIn(keyPath);
    }

    return get(value, keyPath);
  }

  decorateInputs(children) {
    return React.Children.map(children, (child) => {
      if (!child.type) {
        // Text node. Just return it.
        return child;
      }

      const childPropTypes = child.type.propTypes;
      const overrideProps = {};

      if (childPropTypes) {
        if (childPropTypes.value) {
          overrideProps.value = this.getValue(child.props.name, child.props.path);
        }

        if (childPropTypes.onCommit) {
          overrideProps.onCommit = this.handleCommit;
        }

        if (childPropTypes.path && !child.props.path && this.props.defaultPath) {
          overrideProps.path = this.props.defaultPath;
        }

        if (Object.keys(overrideProps).length > 0) {
          return React.cloneElement(child, overrideProps);
        }
      }

      return React.cloneElement(child, {
        children: this.decorateInputs(child.props.children),
      });
    }, this);
  }

  handleCommit(childPath, value) {
    const {
      name,
      path,
      onCommit,
    } = this.props;

    if (onCommit) {
      onCommit(path ? [path, name, ...childPath] : [name, ...childPath], value);
    }
  }

  render() {
    const {
      children,
      name,
    } = this.props;

    return (
      <fieldset
        className={styles.common}
        name={name}
      >
        {this.decorateInputs(children)}
      </fieldset>
    );
  }
}

CustomCompoundInput.propTypes = {
  children: PropTypes.node,
  defaultPath: PropTypes.string,
  name: PropTypes.string,
  path: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.object, // eslint-disable-line react/forbid-prop-types
    PropTypes.instanceOf(Immutable.Map),
  ]),
  onCommit: PropTypes.func,
};

CustomCompoundInput.defaultProps = {
  defaultPath: '',
  value: {},
};

export default repeatable(labelable(CustomCompoundInput));
