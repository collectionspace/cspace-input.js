import React, { Component, PropTypes } from 'react';
import get from 'lodash/get';
import labelable from '../enhancers/labelable';
import repeatable from '../enhancers/repeatable';
import styles from '../../styles/cspace-input/CompoundInput.css';

class CompoundInput extends Component {
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

      if (child.type.isInput) {
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
      <div className={styles.common}>
        {this.decorateInputs(children)}
      </div>
    );
  }
}

CompoundInput.propTypes = {
  children: PropTypes.node,
  defaultPath: PropTypes.string,
  value: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

CompoundInput.defaultProps = {
  defaultPath: '',
  value: {},
};

CompoundInput.isInput = true;

export default repeatable(labelable(CompoundInput));
