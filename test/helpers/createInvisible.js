/* global document */

export default function createInvisible(elementName) {
  const element = document.createElement(elementName);
  element.style.visibility = 'hidden';
  element.style.position = 'absolute';

  document.body.appendChild(element);

  return element;
}
