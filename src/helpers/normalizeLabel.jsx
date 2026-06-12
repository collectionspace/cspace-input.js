import React from 'react';
import Label from '../components/Label';

export default function normalizeLabel(label, props) {
  if (label && typeof label === 'string') {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Label {...props}>{label}</Label>;
  }

  if (props && React.isValidElement(label) && label.type === Label) {
    const { htmlFor, id } = props;
    const overrides = {};

    if (htmlFor && !label.props.htmlFor) {
      overrides.htmlFor = htmlFor;
    }

    if (id && !label.props.id) {
      overrides.id = id;
    }

    if (Object.keys(overrides).length > 0) {
      return React.cloneElement(label, overrides);
    }
  }

  return label;
}
