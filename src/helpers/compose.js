export default function compose(...enhancers) {
  if (enhancers.length === 0) {
    return component => component;
  }

  return component => enhancers.reduceRight((result, enhancer) => enhancer(result), component);
}
