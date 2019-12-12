import React from 'react';
import Label from '../components/Label';

export default function normalizeLabel(label, props) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (label && typeof label === 'string') ? <Label {...props}>{label}</Label> : label;
}
