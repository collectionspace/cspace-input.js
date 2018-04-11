import PropTypes from 'prop-types';

export const pathPropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
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
