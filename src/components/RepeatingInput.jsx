import React, { Component, PropTypes } from 'react';

function normalizeValue(value) {
  if (!Array.isArray(value)) {
    return [value];
  }

  if (value.length === 0) {
    return [null];
  }

  return value;
}

export default class RepeatingInput extends Component {
  renderInstances() {
    const {
      children,
      name,
      value,
    } = this.props;
    
    const template = React.Children.only(children);
    
    return normalizeValue(value).map((instanceValue, index, list) => {
      const instance = React.cloneElement(template, {
        name: `${index}`,
        value: instanceValue,
      });
      
      return (
        <li key={index}>
          {instance}
        </li>
      );
    });
  }
  
  render() {
    return (
      <div>
        <ol>
          {this.renderInstances()}
        </ol>
      </div>
    );
  }
}

RepeatingInput.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]))
  ]),
};

RepeatingInput.defaultProps = {
  value: [null],
};

