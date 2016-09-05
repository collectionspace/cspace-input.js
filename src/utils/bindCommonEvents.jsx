import React, { Component, PropTypes } from 'react';

const propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onCommit: PropTypes.func,
};

export default function bindCommonEvents(Element) {
  class InputEventHandler extends Component {
    constructor(props) {
      super(props);

      this.handleChange = this.handleChange.bind(this);
      this.handleBlur = this.handleBlur.bind(this);
      this.handleKeyPress = this.handleKeyPress.bind(this);
      this.commit = this.commit.bind(this);
    }

    handleBlur(event) {
      this.commit(event.target.value);
    }

    handleChange(event) {
      const {
        onChange,
      } = this.props;

      if (onChange) {
        onChange(event.target.value);
      }
    }

    handleKeyPress(event) {
      if (event.key === 'Enter') {
        this.commit(event.target.value);
      }
    }

    commit(value) {
      const {
        onCommit,
      } = this.props;

      if (onCommit) {
        onCommit(value);
      }
    }

    render() {
      const {
        value,
        onChange,
        onCommit, // eslint-disable-line no-unused-vars
        ...remainingProps,
      } = this.props;

      const valueProp = onChange ? { value } : { defaultValue: value };

      return (
        <Element
          {...valueProp}
          {...remainingProps}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
      );
    }
  }

  InputEventHandler.propTypes = propTypes;

  return InputEventHandler;
}
