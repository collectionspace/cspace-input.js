import moment from 'moment';

import {
  normalizeDateString,
  normalizeISO8601DateString,
  normalizeNaturalLanguageDateString,
} from '../../../src/helpers/dateHelpers';

const expect = chai.expect;

chai.should();

describe('dateHelpers', function suite() {
  describe('normalizeISO8601DateString', function funcSuite() {
    it('should return null for empty, null, and undefined strings', function test() {
      expect(normalizeISO8601DateString('', 'en')).to.equal(null);
      expect(normalizeISO8601DateString(null, 'en')).to.equal(null);
      expect(normalizeISO8601DateString(undefined, 'en')).to.equal(null);
    });

    it('should remove the time zone, if present', function test() {
      normalizeISO8601DateString('1974-04-25T00:00:00.000Z').should
        .equal('1974-04-25');

      normalizeISO8601DateString('1974-04-25T00:00:00.000+07:00').should
        .equal('1974-04-25');

      normalizeISO8601DateString('1974-04-25T00:00:00-03:00').should
        .equal('1974-04-25');
    });
  });

  describe('normalizeNaturalLanguageDateString', function funcSuite() {
    it('should return null for empty, null, and undefined strings', function test() {
      expect(normalizeNaturalLanguageDateString('', 'en')).to.equal(null);
      expect(normalizeNaturalLanguageDateString(null, 'en')).to.equal(null);
      expect(normalizeNaturalLanguageDateString(undefined, 'en')).to.equal(null);
    });

    it('should normalize common formats', function test() {
      expect(normalizeNaturalLanguageDateString('5/23/1984', 'en')).to.equal('1984-05-23');
      expect(normalizeNaturalLanguageDateString('June 12 1962', 'en')).to.equal('1962-06-12');
    });

    it('should normalize natural language strings', function test() {
      normalizeNaturalLanguageDateString('today', 'en').should
        .equal(moment().format('YYYY-MM-DD'));

      normalizeNaturalLanguageDateString('tomorrow', 'en').should
        .equal(moment().add(1, 'days').format('YYYY-MM-DD'));

      normalizeNaturalLanguageDateString('yesterday', 'en').should
        .equal(moment().subtract(1, 'days').format('YYYY-MM-DD'));
    });
  });

  describe('normalizeDateString', function funcSuite() {
    it('should return null for empty, null, and undefined strings', function test() {
      expect(normalizeDateString('', 'en')).to.equal(null);
      expect(normalizeDateString(null, 'en')).to.equal(null);
      expect(normalizeDateString(undefined, 'en')).to.equal(null);
    });

    it('should normalize ISO 8601 formatted strings with normalizeISO8601DateString', function test() {
      const dateString = '1974-04-25T00:00:00.000Z';

      normalizeDateString(dateString).should
        .equal(normalizeISO8601DateString(dateString));
    });

    it('should normalize natural language strings with normalizeNaturalLanguageDateString', function test() {
      const dateString = 'today';

      normalizeDateString(dateString).should
        .equal(normalizeNaturalLanguageDateString(dateString));
    });
  });
});
