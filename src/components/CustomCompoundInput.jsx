import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import get from 'lodash/get';
import labelable from '../enhancers/labelable';
import repeatable from '../enhancers/repeatable';
import getPath from '../helpers/getPath';
import styles from '../../styles/cspace-input/CompoundInput.css';

class CustomCompoundInput extends Component {
  getChildContext() {
    return {
      defaultSubpath: this.props.defaultChildSubpath,
      parentPath: getPath(this.props, this.context),
    };
  }

  getValue(name, subpath = this.props.defaultChildSubpath) {
    const {
      value,
    } = this.props;

    let keyPath;

    if (subpath) {
      if (Array.isArray(subpath)) {
        keyPath = [...subpath];
      } else {
        keyPath = [subpath];
      }
    } else {
      keyPath = [];
    }

    if (name) {
      keyPath.push(name);
    }

    if (keyPath.length === 0) {
      return value;
    }

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
          overrideProps.value = this.getValue(child.props.name, child.props.subpath);
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
  defaultChildSubpath: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  name: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.object, // eslint-disable-line react/forbid-prop-types
    PropTypes.instanceOf(Immutable.Map),
  ]),
};

CustomCompoundInput.defaultProps = {
  value: {},
};

CustomCompoundInput.contextTypes = {
  defaultSubpath: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  parentPath: PropTypes.arrayOf(PropTypes.string),
};

CustomCompoundInput.childContextTypes = {
  defaultSubpath: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  parentPath: PropTypes.arrayOf(PropTypes.string),
};

export default repeatable(labelable(CustomCompoundInput));
