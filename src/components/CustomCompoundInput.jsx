import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import get from 'lodash/get';
import { getPath, pathPropType } from '../helpers/pathHelpers';
import isInput from '../helpers/isInput';
import styles from '../../styles/cspace-input/CompoundInput.css';

const propTypes = {
  children: PropTypes.node,
  defaultChildSubpath: pathPropType,
  name: PropTypes.string,
  parentPath: pathPropType,    // eslint-disable-line react/no-unused-prop-types
  subpath: pathPropType,       // eslint-disable-line react/no-unused-prop-types
  value: PropTypes.oneOfType([
    PropTypes.object,          // eslint-disable-line react/forbid-prop-types
    PropTypes.instanceOf(Immutable.Map),
  ]),
};

const defaultProps = {
  value: {},
};

const getChildValue = (value, subpath, name) => {
  let keyPath = [];

  if (subpath) {
    keyPath = keyPath.concat(subpath);
  }

  if (name) {
    keyPath = keyPath.concat(name);
  }

  if (keyPath.length === 0) {
    return value;
  }

  if (Immutable.Map.isMap(value)) {
    return value.getIn(keyPath);
  }

  return get(value, keyPath);
};

export default class CustomCompoundInput extends Component {
  decorateInputs(children) {
    return React.Children.map(children, (child) => {
      if (!child.type) {
        // Text node. Just return it.
        return child;
      }

      if (isInput(child)) {
        const {
          name,
        } = child.props;

        let {
          subpath,
        } = child.props;

        const {
          defaultChildSubpath,
          value,
        } = this.props;

        if (typeof subpath === 'undefined') {
          subpath = defaultChildSubpath;
        }

        return React.cloneElement(child, {
          subpath,
          parentPath: getPath(this.props),
          value: getChildValue(value, subpath, name),
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

CustomCompoundInput.propTypes = propTypes;
CustomCompoundInput.defaultProps = defaultProps;
