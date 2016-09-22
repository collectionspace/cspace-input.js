export default function isInput(Component) {
  if (!Component) {
    return false;
  }

  const type = Component.type;

  if (!type) {
    return false;
  }

  const propTypes = type.propTypes;

  if (!propTypes) {
    return false;
  }

  return ('name' in propTypes && 'value' in propTypes);
}
