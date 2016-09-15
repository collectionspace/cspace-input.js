import React, { Component, PropTypes } from 'react';

export default function changeable(BaseComponent) {
  class Changeable extends Component {
    constructor(props) {
      super(props);

      this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
      const {
        onChange,
      } = this.props;

      if (onChange) {
        onChange(event.target.value);
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
