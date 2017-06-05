import React from 'react';
import Label from '../components/Label';

export default function normalizeLabel(label, props) {
  return (label && typeof label === 'string') ? <Label {...props}>{label}</Label> : label;
}
