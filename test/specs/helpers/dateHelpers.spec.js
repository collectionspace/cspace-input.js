import moment from 'moment';

import {
  computeEarliestScalarDate,
  computeLatestScalarDate,
  normalizeDateString,
  normalizeISO8601DateString,
  normalizeNaturalLanguageDateString,
} from '../../../src/helpers/dateHelpers';

const { expect } = chai;

chai.should();

describe('dateHelpers', () => {
  describe('normalizeISO8601DateString', () => {
    it('should return null for empty, null, and undefined strings', () => {
      expect(normalizeISO8601DateString('', 'en')).to.equal(null);
      expect(normalizeISO8601DateString(null, 'en')).to.equal(null);
      expect(normalizeISO8601DateString(undefined, 'en')).to.equal(null);
    });

    it('should remove the time zone, if present', () => {
      normalizeISO8601DateString('1974-04-25T00:00:00.000Z').should
        .equal('1974-04-25');

      normalizeISO8601DateString('1974-04-25T00:00:00.000+07:00').should
        .equal('1974-04-25');

      normalizeISO8601DateString('1974-04-25T00:00:00-03:00').should
        .equal('1974-04-25');
    });
  });

  describe('normalizeNaturalLanguageDateString', () => {
    it('should return null for empty, null, and undefined strings', () => {
      expect(normalizeNaturalLanguageDateString('', 'en')).to.equal(null);
      expect(normalizeNaturalLanguageDateString(null, 'en')).to.equal(null);
      expect(normalizeNaturalLanguageDateString(undefined, 'en')).to.equal(null);
    });

    it('should normalize common formats', () => {
      expect(normalizeNaturalLanguageDateString('5/23/1984', 'en')).to.equal('1984-05-23');
      expect(normalizeNaturalLanguageDateString('June 12 1962', 'en')).to.equal('1962-06-12');
    });

    it('should normalize natural language strings', () => {
      normalizeNaturalLanguageDateString('today', 'en').should
        .equal(moment().format('YYYY-MM-DD'));

      normalizeNaturalLanguageDateString('tomorrow', 'en').should
        .equal(moment().add(1, 'days').format('YYYY-MM-DD'));

      normalizeNaturalLanguageDateString('yesterday', 'en').should
        .equal(moment().subtract(1, 'days').format('YYYY-MM-DD'));
    });
  });

  describe('normalizeDateString', () => {
    it('should return null for empty, null, and undefined strings', () => {
      expect(normalizeDateString('', 'en')).to.equal(null);
      expect(normalizeDateString(null, 'en')).to.equal(null);
      expect(normalizeDateString(undefined, 'en')).to.equal(null);
    });

    it('should normalize ISO 8601 formatted strings with normalizeISO8601DateString', () => {
      const dateString = '1974-04-25T00:00:00.000Z';

      normalizeDateString(dateString).should
        .equal(normalizeISO8601DateString(dateString));
    });

    it('should normalize natural language strings with normalizeNaturalLanguageDateString', () => {
      const dateString = 'today';

      normalizeDateString(dateString).should
        .equal(normalizeNaturalLanguageDateString(dateString));
    });
  });

  describe('computeEarliestScalarDate', () => {
    it('should return empty string if year, month, and day are empty', () => {
      computeEarliestScalarDate({
        dateEarliestSingleYear: '',
        dateEarliestSingleMonth: '',
        dateEarliestSingleDay: '',
        dateEarliestSingleEra: '',
      }).should.equal('');

      computeEarliestScalarDate({
        dateEarliestSingleYear: null,
        dateEarliestSingleMonth: null,
        dateEarliestSingleDay: null,
        dateEarliestSingleEra: null,
      }).should.equal('');

      computeEarliestScalarDate({}).should.equal('');
    });

    it('should return the date if year, month, and day are supplied and valid', () => {
      computeEarliestScalarDate({
        dateEarliestSingleYear: '1995',
        dateEarliestSingleMonth: '5',
        dateEarliestSingleDay: '21',
        dateEarliestSingleEra: '',
      }).should.equal('1995-05-21');
    });

    it('should return Jan. 1 if only the year is supplied', () => {
      computeEarliestScalarDate({
        dateEarliestSingleYear: '1995',
        dateEarliestSingleMonth: '',
        dateEarliestSingleDay: '',
        dateEarliestSingleEra: '',
      }).should.equal('1995-01-01');
    });

    it('should return the first of the month if only the year and month are supplied', () => {
      computeEarliestScalarDate({
        dateEarliestSingleYear: '1995',
        dateEarliestSingleMonth: '05',
        dateEarliestSingleDay: '',
        dateEarliestSingleEra: '',
      }).should.equal('1995-05-01');
    });

    it('should return null for invalid inputs', () => {
      // Day without month

      expect(computeEarliestScalarDate({
        dateEarliestSingleYear: '1995',
        dateEarliestSingleMonth: '',
        dateEarliestSingleDay: '21',
        dateEarliestSingleEra: '',
      })).to.equal(null);

      // Month and day without year

      expect(computeEarliestScalarDate({
        dateEarliestSingleYear: '',
        dateEarliestSingleMonth: '4',
        dateEarliestSingleDay: '21',
        dateEarliestSingleEra: '',
      })).to.equal(null);

      // Month without year

      expect(computeEarliestScalarDate({
        dateEarliestSingleYear: '',
        dateEarliestSingleMonth: '4',
        dateEarliestSingleDay: '',
        dateEarliestSingleEra: '',
      })).to.equal(null);

      // Day without month

      expect(computeEarliestScalarDate({
        dateEarliestSingleYear: '2001',
        dateEarliestSingleMonth: '',
        dateEarliestSingleDay: '5',
        dateEarliestSingleEra: '',
      })).to.equal(null);

      // Invalid day

      expect(computeEarliestScalarDate({
        dateEarliestSingleYear: '2001',
        dateEarliestSingleMonth: '6',
        dateEarliestSingleDay: '55',
        dateEarliestSingleEra: '',
      })).to.equal(null);

      // Invalid month

      expect(computeEarliestScalarDate({
        dateEarliestSingleYear: '2001',
        dateEarliestSingleMonth: '15',
        dateEarliestSingleDay: '1',
        dateEarliestSingleEra: '',
      })).to.equal(null);

      // Invalid year

      expect(computeEarliestScalarDate({
        dateEarliestSingleYear: 'abc',
        dateEarliestSingleMonth: '15',
        dateEarliestSingleDay: '1',
        dateEarliestSingleEra: '',
      })).to.equal(null);
    });
  });

  describe('computeLatestScalarDate', () => {
    it('should return the date plus one day if year, month, and day are supplied and valid', () => {
      computeLatestScalarDate({
        dateLatestYear: '1995',
        dateLatestMonth: '5',
        dateLatestDay: '21',
        dateLatestEra: '',
      }).should.equal('1995-05-22');

      computeLatestScalarDate({
        dateLatestYear: '1995',
        dateLatestMonth: '12',
        dateLatestDay: '31',
        dateLatestEra: '',
      }).should.equal('1996-01-01');

      computeLatestScalarDate({
        dateLatestYear: '1995',
        dateLatestMonth: '2',
        dateLatestDay: '28',
        dateLatestEra: '',
      }).should.equal('1995-03-01');
    });

    it('should inherit earliest/single year, month, and day if year, month, and day are empty', () => {
      computeLatestScalarDate({
        dateEarliestSingleYear: '1995',
        dateEarliestSingleMonth: '5',
        dateEarliestSingleDay: '21',
        dateEarliestSingleEra: '',
        dateLatestYear: '',
        dateLatestMonth: '',
        dateLatestDay: '',
        dateLatestEra: '',
      }).should.equal('1995-05-22');

      computeLatestScalarDate({
        dateEarliestSingleYear: '1995',
        dateEarliestSingleMonth: '2',
        dateEarliestSingleDay: '28',
        dateEarliestSingleEra: '',
        dateLatestYear: null,
        dateLatestMonth: null,
        dateLatestDay: null,
        dateLatestEra: null,
      }).should.equal('1995-03-01');

      computeLatestScalarDate({
        dateEarliestSingleYear: '1995',
        dateEarliestSingleMonth: '12',
        dateEarliestSingleDay: '31',
        dateEarliestSingleEra: '',
      }).should.equal('1996-01-01');
    });

    it('should return empty string if both latest and earliest/single year, month, and day are empty', () => {
      computeLatestScalarDate({}).should.equal('');
    });

    it('should return the first of the next year if only the year is supplied', () => {
      computeLatestScalarDate({
        dateLatestYear: '1995',
        dateLatestMonth: '',
        dateLatestDay: '',
        dateLatestEra: '',
      }).should.equal('1996-01-01');

      computeLatestScalarDate({
        dateLatestYear: '1999',
        dateLatestMonth: '',
        dateLatestDay: '',
        dateLatestEra: '',
      }).should.equal('2000-01-01');
    });

    it('should return the first of the next month if only the year and month are supplied', () => {
      computeLatestScalarDate({
        dateLatestYear: '1995',
        dateLatestMonth: '05',
        dateLatestDay: '',
        dateLatestEra: '',
      }).should.equal('1995-06-01');

      computeLatestScalarDate({
        dateLatestYear: '1999',
        dateLatestMonth: '12',
        dateLatestDay: '',
        dateLatestEra: '',
      }).should.equal('2000-01-01');
    });

    it('should return null for invalid inputs', () => {
      // Day without month

      expect(computeLatestScalarDate({
        dateLatestYear: '1995',
        dateLatestMonth: '',
        dateLatestDay: '21',
        dateLatestEra: '',
      })).to.equal(null);

      // Month and day without year

      expect(computeLatestScalarDate({
        dateLatestYear: '',
        dateLatestMonth: '4',
        dateLatestDay: '21',
        dateLatestEra: '',
      })).to.equal(null);

      // Month without year

      expect(computeLatestScalarDate({
        dateLatestYear: '',
        dateLatestMonth: '4',
        dateLatestDay: '',
        dateLatestEra: '',
      })).to.equal(null);

      // Day without month

      expect(computeLatestScalarDate({
        dateLatestYear: '2001',
        dateLatestMonth: '',
        dateLatestDay: '5',
        dateLatestEra: '',
      })).to.equal(null);

      // Invalid day

      expect(computeLatestScalarDate({
        dateLatestYear: '2001',
        dateLatestMonth: '6',
        dateLatestDay: '55',
        dateLatestEra: '',
      })).to.equal(null);

      // Invalid month

      expect(computeLatestScalarDate({
        dateLatestYear: '2001',
        dateLatestMonth: '15',
        dateLatestDay: '1',
        dateLatestEra: '',
      })).to.equal(null);

      // Invalid year

      expect(computeLatestScalarDate({
        dateLatestYear: 'abc',
        dateLatestMonth: '15',
        dateLatestDay: '1',
        dateLatestEra: '',
      })).to.equal(null);
    });
  });
});
