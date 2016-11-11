/**
 * Helper functions for working with options and option lists.
 */

/**
 * Retrieve the option for a given value in an option list.
 * @param {Object[]} options - The options
 * @param {string} value - The value
 * @returns {Object} The option whose value exactly equals the given value. If more than one option
 * has the value, the first is returned. If no option has the value, null is returned.
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
 * @param {Object[]} options - The options
 * @param {string} value - The value
 * @returns {string} The label of the option whose value exactly equals the given value. If more
 * than one option has the value, the first is returned. If no option has the value, null is
 * returned.
 */
export const getLabelForValue = (options, value) => {
  const option = getOptionForValue(options, value);

  return (option ? option.label : null);
};

/**
 * Retrieve the option for a given label in an option list.
 * @param {Object[]} options - The options
 * @param {string} label - The label
 * @returns {Object} The option whose label exactly equals the given label. If more than one option
 * has the label, the first is returned. If no option has the label, null is returned.
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
 * Filter an option list using a supplied filter string. An option is retained by the filter if its
 * label begins with the string, case-insensitively.
 * @param {Object[]} options - The options to filter
 * @param {string} filter - The filter string
 * @returns {Object[]} An array of options whose labels begin with the filter string
 */
export const filterOptions = (options, filter) => {
  if (!filter) {
    return options;
  }

  const normalizedFilter = filter.toLowerCase();

  // TODO: Use String.startsWith when it is supported in all browsers.

  return options.filter(option => option.label.toLowerCase().indexOf(normalizedFilter, 0) === 0);
};

/**
 * Normalize an option list. In options where the label is null or undefined, the label is set to
 * the option value. If the list is blankable, an option with empty value and label is added as the
 * first option. This function does not mutate the passed options.
 * @param {Object[]} options - The options to normalize
 * @param {boolean} blankable - If true, add a blank option to the beginning of the list
 * @returns {Object[]} A new array of normalized options
 */
export const normalizeOptions = (options, blankable) => {
  const normalizedOptions = [];

  if (blankable) {
    normalizedOptions.push({
      value: '',
      label: '',
    });
  }

  options.forEach((option) => {
    const value = option.value;
    let label = option.label;

    if (label === null || typeof label === 'undefined') {
      label = value;
    }

    normalizedOptions.push({
      value,
      label,
    });
  });

  return normalizedOptions;
};
