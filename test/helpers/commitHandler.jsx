import React, { Component } from 'react';

export default function commitHandler(BaseComponent) {
  const baseComponentName = BaseComponent.displayName
    || BaseComponent.name
    || 'Component';

  const propTypes = {
    ...BaseComponent.propTypes,
  };

  class CommitHandler extends Component {
    constructor(props) {
      super(props);

      this.handleCommit = this.handleCommit.bind(this);

      this.state = {};
    }

    handleCommit(path, value) {
      this.setState({
        value,
      });
    }

    render() {
      const {
        value,
      } = this.state;

      return (
        <BaseComponent
          {...this.props}
          onCommit={this.handleCommit}
          value={value}
        />
      );
    }
  }

  CommitHandler.propTypes = propTypes;
  CommitHandler.displayName = `commitHandler(${baseComponentName})`;

  return CommitHandler;
}
