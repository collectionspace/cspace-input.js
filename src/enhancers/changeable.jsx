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

      this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
      if (event && event.target) {
        const {
          onChange,
        } = this.props;

        if (onChange) {
          onChange(event.target.value);
        }
      }
    }

    render() {
      const {
        onChange, // eslint-disable-line no-unused-vars
        ...remainingProps,
      } = this.props;

      return (
        <BaseComponent
          {...remainingProps}
          onChange={this.handleChange}
        />
      );
    }
  }

  Changeable.propTypes = {
    onChange: PropTypes.func,
  };
  
  return Changeable;
}
