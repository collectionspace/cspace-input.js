/**
 * Helper functions for working with options and option lists. An option is a pair of
 * [value, label], where value is the underlying data, and label is a human readable string.
 * An option list is an array of option pairs.
 */

/**
 * Retrieve the label for a given value in an option list.
 */
export const getLabelForValue = (options, value) => {
  let label = '';

  // TODO: Use Array.find when it is supported in all browsers.

  for (let i = 0; i < options.length; i += 1) {
    const option = options[i];

    if (option[0] === value) {
      label = option[1];
      break;
    }
  }

  return label;
};

/**
 * Retrieve the value for a given label in an option list.
 */
export const getValueForLabel = (options, label) => {
  let value = null;

  // TODO: Use Array.find when it is supported in all browsers.

  for (let i = 0; i < options.length; i += 1) {
    const option = options[i];

    if (option[1] === label) {
      value = option[0];
      break;
    }
  }

  return value;
};

/**
 * Filter an option list.
 */
export const filterOptions = (options, filter) => {
  if (!filter) {
    return options;
  }

  // TODO: Use String.startsWith when it is supported in all browsers.

  return options.filter(option => (option[1].indexOf(filter, 0) === 0));
};

/**
 * Normalize an option list.
 *
 */
export const normalizeOptions = (options, blankable) => {
  const normalizedOptions = [];

  if (blankable) {
    normalizedOptions.push(['', '']);
  }

  options.forEach((option) => {
    const value = option[0];
    let label = option[1];

    if (label === null || typeof label === 'undefined') {
      label = value;
    }

    normalizedOptions.push([value, label]);
  });

  return normalizedOptions;
};
