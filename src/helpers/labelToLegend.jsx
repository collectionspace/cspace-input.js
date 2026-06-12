import React from 'react';
import Label from '../components/Label';
import labelStyles from '../../styles/cspace-input/Label.css';

// Extract the label's children, className, id
// and render it as legend instead of an orphaned label
export default function labelToLegend(label) {
  if (!label) {
    return null;
  }

  if (React.isValidElement(label) && label.type === Label) {
    const { required, readOnly } = label.props;
    const className = (required && !readOnly) ? labelStyles.required : labelStyles.common;

    return (
      <legend className={className} id={label.props.id}>
        {label.props.children}
      </legend>
    );
  }

  return <legend>{label}</legend>;
}
