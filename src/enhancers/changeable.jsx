import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * An adapter for onChange events. Returns an enhanced component that handles onChange events fired
 * by the base component, and executes a callback with the new value.
 * @param {string|function} BaseComponent - The component to enhance. This component must accept an
 * onChange prop.
 * @returns {function} The enhanced component, which accepts an onChange prop containing a function
 * to be called with the new value.
 */
export default function changeable(BaseComponent) {
  const baseComponentName = BaseComponent.displayName
    || BaseComponent.name
    || 'Component';

  const propTypes = {
    // TODO: Stop using propTypes in isInput, and in render method of cspace-ui Field component.
    // Until then, propTypes need to be hoisted from the base component.
    // eslint-disable-next-line react/forbid-foreign-prop-types
    ...BaseComponent.propTypes,
    autoSyncValue: PropTypes.bool,
    onChange: PropTypes.func,
    value: PropTypes.string,
  };

  const defaultProps = {
    autoSyncValue: true,
    onChange: undefined,
    value: '',
  };

  class Changeable extends Component {
    constructor(props) {
      super(props);

      this.state = {
        value: props.value,
      };

      this.handleChange = this.handleChange.bind(this);
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(nextProps) {
      this.setState({
        value: nextProps.value,
      });
    }

    handleChange(event) {
      const { value } = event.target;

      const {
        onChange,
        autoSyncValue,
      } = this.props;

      if (autoSyncValue) {
        this.setState({
          value,
        });
      }

      if (onChange) {
        onChange(value);
      }
    }

    render() {
      const {
        autoSyncValue,
        onChange,
        ...remainingProps
      } = this.props;

      const {
        value,
      } = this.state;

      return (
        <BaseComponent
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...remainingProps}
          value={value}
          onChange={this.handleChange}
        />
      );
    }
  }

  Changeable.propTypes = propTypes;
  Changeable.defaultProps = defaultProps;
  Changeable.displayName = `changeable(${baseComponentName})`;

  return Changeable;
}
