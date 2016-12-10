import moment from 'moment';
import Sugar from 'sugar-date';
// FIXME: Don't include locales unless they're requested. This increases the size of the minified
// dist bundle by about 26 KB.
import 'sugar-date/locales';

/**
 * Normalizes an ISO 8601 date string, removing any time and time zone parts, if present.
 * CollectionSpace dates should be considered time zone-less, but they are returned from the REST
 * API as ISO 8601 datetimes with a time portion of T00:00:00Z (UTC). This function may be used to
 * convert this to a date without time/zone, for display to end users.
 * @param {string} dateString - The ISO 8601 date string
 * @returns {string} The normalized date string in the format YYYY-MM-DD, or null if the input
 * string is not a valid ISO 8601 date string.
 */
export const normalizeISO8601DateString = (dateString) => {
  if (dateString === '' || dateString === null || typeof dateString === 'undefined') {
    return null;
  }

  // Use parseZone to prevent conversion to local time, which could result in the date becoming
  // the previous day in time zones with a negative offset from UTC.

  const dateMoment = moment.parseZone(dateString, moment.ISO_8601);

  return (dateMoment.isValid() ? dateMoment.format('YYYY-MM-DD') : null);
};

/**
 * Normalizes a date string of unknown format, including natural language descriptions like
 * 'today', 'tomorrow', 'next Tuesday', and others. This function will accept ISO 8601 formatted
 * dates, but may not produce the same result as normalizeISO8601DateString. In particular, ISO
 * 8601 date strings that contain a time/zone are converted to local time by this function.
 * @param {string} dateString - The date string
 * @returns {string} The normalized date string in the format YYYY-MM-DD, or null if the input
 * string could not be interpreted as a date.
 */
export const normalizeNaturalLanguageDateString = (dateString, locale = 'en') => {
  if (dateString === '' || dateString === null || typeof dateString === 'undefined') {
    return null;
  }

  const date = Sugar.Date.create(dateString, locale);

  return (Sugar.Date.isValid(date) ? Sugar.Date.format(date, '%Y-%m-%d') : null);
};

/**
 * Normalizes a date string by first trying normalizeISO8601DateString, and falling back to
 * normalizeNaturalLanguageDateString if normalizeISO8601DateString returns null.
 * @param {string} dateString - The date string
 * @returns {string} The normalized date string in the format YYYY-MM-DD, or null if the input
 * string could not be interpreted as a date.
 */
export const normalizeDateString = (dateString, locale = 'en') => {
  if (dateString === '' || dateString === null || typeof dateString === 'undefined') {
    return null;
  }

  return (
    normalizeISO8601DateString(dateString)
      || normalizeNaturalLanguageDateString(dateString, locale)
  );
};
