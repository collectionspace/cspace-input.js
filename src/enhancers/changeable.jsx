import React, { Component, PropTypes } from 'react';

/**
 * An adapter for onChange events. Returns an enhanced component that handles onChange events fired
 * by the base component, and executes a callback with the new value.
 * @param {string|function} BaseComponent - The component to enhance. This component must accept an
 * onChange prop.
 * @returns {function} The enhanced component, which accepts an onChange prop containing a function
 * to be called with the new value.
 */
export default function changeable(BaseComponent) {
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
      if (event && event.target) {
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
    }

    render() {
      const {
        autoSyncValue, // eslint-disable-line no-unused-vars
        onChange, // eslint-disable-line no-unused-vars
        ...remainingProps,
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

  Changeable.propTypes = {
    autoSyncValue: PropTypes.bool,
    onChange: PropTypes.func,
    value: PropTypes.string,
  };

  Changeable.defaultProps = {
    autoSyncValue: true,
    value: '',
  };

  Changeable.isInput = BaseComponent.isInput;

  return Changeable;
}
