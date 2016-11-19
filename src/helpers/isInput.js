export default function isInput(component) {
  if (!component) {
    return false;
  }

  const type = component.type;

  if (!type) {
    return false;
  }

  const propTypes = type.propTypes;

  if (!propTypes) {
    return false;
  }

  return (
    'name' in propTypes &&
    'value' in propTypes &&
    'parentPath' in propTypes &&
    'subpath' in propTypes
  );
}
