/**
 * Composes higher-order components (enhancers) into a single higher-order component.
 * @param {...function} enhancers - The enhancers to compose.
 * @returns {function} A function that accepts a component, and returns a new component with all of
 * the supplied enhancers applied from right to left.
 */
export default function compose(...enhancers) {
  if (enhancers.length === 0) {
    return (component) => component;
  }

  if (enhancers.length === 1) {
    return enhancers[0];
  }

  return (component) => enhancers.reduceRight((result, enhancer) => enhancer(result), component);
}
