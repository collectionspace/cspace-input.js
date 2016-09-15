import React, { Component, PropTypes } from 'react';

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
        onCommit,
      } = this.props;

      if (onCommit) {
        onCommit(value);
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
    onCommit: PropTypes.func,
  };

  return Committable;
}
