import React, { Component, PropTypes } from 'react';

/**
 * Returns an enhanced component that detects that a change to the value of the base component has
 * been committed, and executes a callback with the new value. A change is considered to be
 * committed when the base component loses focus, or the enter key is pressed while it has focus.
 * @param {string|function} BaseComponent - The component to enhance. This component must accept
 * onBlur and onKeyPress props.
 * @returns {function} The enhanced component, which accepts an onCommit prop containing a function
 * to be called with the name of the input, and its new value.
 */
export default function committable(BaseComponent) {
  class Committable extends Component {
    constructor(props) {
      super(props);

      this.handleBlur = this.handleBlur.bind(this);
      this.handleKeyPress = this.handleKeyPress.bind(this);
      this.commit = this.commit.bind(this);
    }

    handleBlur(event) {
      this.commit(event.target.value);
    }

    handleKeyPress(event) {
      if (event.key === 'Enter') {
        this.commit(event.target.value);
      }
    }

    commit(value) {
      const {
        name,
        onCommit,
      } = this.props;

      if (onCommit) {
        onCommit(name, value);
      }
    }

    render() {
      const {
        onCommit, // eslint-disable-line no-unused-vars
        ...remainingProps,
      } = this.props;

      return (
        <BaseComponent
          {...remainingProps}
          onBlur={this.handleBlur}
          onKeyPress={this.handleKeyPress}
        />
      );
    }
  }

  Committable.propTypes = {
    ...BaseComponent.propTypes,
    onCommit: PropTypes.func,
  };

  return Committable;
}
