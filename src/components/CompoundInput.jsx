import React, { Component, PropTypes } from 'react';
import get from 'lodash/get';

export default class CompoundInput extends Component {
  constructor(props) {
    super(props);

    this.getValue = this.getValue.bind(this);
    this.decorateInputs = this.decorateInputs.bind(this);
  }

  getValue(name, path = this.props.defaultPath) {
    const {
      value,
    } = this.props;

    const context = path ? get(value, path) : value;

    return (context ? context[name] : undefined);
  }

  decorateInputs(children) {
    return React.Children.map(children, (child) => {
      if (!child.type) {
        return child;
      }

      const propTypes = child.type.propTypes;

      if (propTypes && propTypes.value && propTypes.onCommit) {
        return React.cloneElement(child, {
          value: this.getValue(child.props.name, child.props.path),
          onCommit: this.handleCommit,
        });
      }

      return React.cloneElement(child, {
        children: this.decorateInputs(child.props.children),
      });
    }, this);
  }

  render() {
    const {
      children,
    } = this.props;

    return (
      <div>
        {this.decorateInputs(children)}
      </div>
    );
  }
}

CompoundInput.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
  value: PropTypes.object,
  defaultPath: PropTypes.string,
  disabled: PropTypes.bool,
  onCommit: PropTypes.func,
};

CompoundInput.defaultProps = {
  name: '',
  value: {},
  defaultPath: '',
  disabled: false,
};
