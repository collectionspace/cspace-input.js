export default function isInput(candidateComponent) {
  if (!candidateComponent) {
    return false;
  }

  const type = candidateComponent.type;

  if (!type) {
    return false;
  }

  const propTypes = type.propTypes;

  if (!propTypes) {
    return false;
  }

  return ('name' in propTypes && 'value' in propTypes);
}
