/**
 * Helper functions for working with options and option lists. An option is a pair of
 * [value, label], where value is the underlying data, and label is a human readable string.
 * An option list is an array of option pairs.
 */

/**
 * Retrieve the option for a given value in an option list.
 */
export const getOptionForValue = (options, value) => {
  let option = null;

  // TODO: Use Array.find when it is supported in all browsers.

  for (let i = 0; i < options.length; i += 1) {
    const candidateOption = options[i];

    if (candidateOption.value === value) {
      option = candidateOption;
      break;
    }
  }

  return option;
};

/**
 * Retrieve the label for a given value in an option list.
 */
export const getLabelForValue = (options, value) => {
  const option = getOptionForValue(options, value);

  return (option ? option.label : null);
};

/**
 * Retrieve the option for a given label in an option list.
 */
export const getOptionForLabel = (options, label) => {
  let option = null;

  // TODO: Use Array.find when it is supported in all browsers.

  for (let i = 0; i < options.length; i += 1) {
    const candidateOption = options[i];

    if (candidateOption.label === label) {
      option = candidateOption;
      break;
    }
  }

  return option;
};

/**
 * Filter an option list.
 */
export const filterOptions = (options, filter) => {
  if (!filter) {
    return options;
  }

  // TODO: Use String.startsWith when it is supported in all browsers.

  return options.filter(option => (option.label.indexOf(filter, 0) === 0));
};

/**
 * Normalize an option list.
 *
 */
export const normalizeOptions = (options, blankable) => {
  const normalizedOptions = [];

  if (blankable) {
    normalizedOptions.push({ value: '', label: '' });
  }

  options.forEach((option) => {
    const value = option.value;
    let label = option.label;

    if (label === null || typeof label === 'undefined') {
      label = value;
    }

    normalizedOptions.push({ value, label });
  });

  return normalizedOptions;
};
