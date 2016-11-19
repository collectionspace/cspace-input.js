import { PropTypes } from 'react';

export const pathPropType = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.string),
  PropTypes.string,
]);

export const getPath = (props) => {
  const {
    parentPath,
    subpath,
    name,
  } = props;

  return [parentPath, subpath, name].reduce((path, part) => (
    part ? path.concat(part) : path
  ), []);
};
