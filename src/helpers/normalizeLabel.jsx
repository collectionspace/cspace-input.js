import React from 'react';
import Label from '../components/Label';

export default function normalizeLabel(label) {
  return (label && typeof label === 'string') ? <Label>{label}</Label> : label;
}
