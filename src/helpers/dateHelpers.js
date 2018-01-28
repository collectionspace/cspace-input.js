import moment from 'moment';
import Sugar from 'sugar-date';
// FIXME: Don't include locales unless they're requested. This increases the size of the minified
// dist bundle by about 26 KB.
import 'sugar-date/locales';

const normalizedDateFormat = 'YYYY-MM-DD';

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
  if (!dateString) {
    return null;
  }

  // Use parseZone to prevent conversion to local time, which could result in the date becoming
  // the previous day in time zones with a negative offset from UTC.

  const dateMoment = moment.parseZone(dateString, moment.ISO_8601);

  return (dateMoment.isValid() ? dateMoment.format(normalizedDateFormat) : null);
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
  if (!dateString) {
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
  if (!dateString) {
    return null;
  }

  return (
    normalizeISO8601DateString(dateString)
      || normalizeNaturalLanguageDateString(dateString, locale)
  );
};

export const formatDate = date => (date ? moment(date).format(normalizedDateFormat) : null);

export const parseNormalizedDate = dateString =>
  (dateString ? moment(dateString, normalizedDateFormat).toDate() : null);

const momentFromYearMonthDay = (year, month, day /* , era */) => {
  if (
    (!year && (month || day)) ||
    (!month && day)
  ) {
    return null;
  }

  const dateParts = [parseInt(year, 10)];

  if (month) {
    dateParts.push(parseInt(month, 10) - 1);

    if (day) {
      dateParts.push(parseInt(day, 10));
    }
  }

  const date = moment(dateParts);

  return (date.isValid() ? date : null);
};

export const computeEarliestScalarDate = (structuredDate) => {
  const {
    dateEarliestSingleYear: year,
    dateEarliestSingleMonth: month,
    dateEarliestSingleDay: day,
    dateEarliestSingleEra: era,
  } = structuredDate;

  if (!year && !month && !day) {
    return '';
  }

  const date = momentFromYearMonthDay(year, month, day, era);

  // TODO: Handle BC dates. The old UI ignored the era.
  // TODO: Incorporate the qualifier value/unit. The old UI did nothing with these.

  return (date ? date.format(normalizedDateFormat) : null);
};

export const computeLatestScalarDate = (structuredDate) => {
  let {
    dateLatestYear: year,
    dateLatestMonth: month,
    dateLatestDay: day,
  } = structuredDate;

  const {
    dateLatestEra: era,
  } = structuredDate;

  if (!year && !month && !day) {
    // No latest date parts are specified. Inherit year, month, and day from earliest/single.

    const {
      dateEarliestSingleYear,
      dateEarliestSingleMonth,
      dateEarliestSingleDay,
      // dateEarliestSingleEra,
    } = structuredDate;

    // TODO: What if no date parts are specified, but the era/certainty/qualifier is different than
    // the earliest/single?

    year = dateEarliestSingleYear;
    month = dateEarliestSingleMonth;
    day = dateEarliestSingleDay;
  }

  if (!year && !month && !day) {
    return '';
  }

  const date = momentFromYearMonthDay(year, month, day, era);

  if (!date) {
    return null;
  }

  if (!month) {
    date.endOf('year');
  } else if (!day) {
    date.endOf('month');
  }

  date.add(1, 'days');

  return date.format(normalizedDateFormat);
};
