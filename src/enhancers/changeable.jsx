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
    ...BaseComponent.propTypes,
    autoSyncValue: PropTypes.bool,
    onChange: PropTypes.func,
    value: PropTypes.string,
  };

  const defaultProps = {
    autoSyncValue: true,
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

    componentWillReceiveProps(nextProps) {
      this.setState({
        value: nextProps.value,
      });
    }

    handleChange(event) {
      const value = event.target.value;

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
        /* eslint-disable no-unused-vars */
        autoSyncValue,
        onChange,
        /* eslint-enable no-unused-vars */
        ...remainingProps
      } = this.props;

      const {
        value,
      } = this.state;

      return (
        <BaseComponent
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
