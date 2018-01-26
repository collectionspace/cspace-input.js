import {
  getOptionForValue,
  getLabelForValue,
  getOptionForLabel,
  filterOptionsByPrefix,
  filterOptionsBySubstring,
  normalizeOptions,
} from '../../../src/helpers/optionHelpers';

const expect = chai.expect;

chai.should();

const options = [
  { value: 'value1', label: 'Label 1' },
  { value: 'value2', label: 'Label 2' },
  { value: 'value3', label: 'Label 3' },
  { value: 'value4', label: 'Label 4' },
  { value: 'value5', label: 'Label 5' },
  { value: 'value6', label: 'Label 6' },
  { value: 'value7', label: 'Label 7' },
  { value: 'value8', label: 'Label 8' },
  { value: 'value9', label: 'Label 9' },
  { value: 'value10', label: 'Label 10' },
  { value: 'value11', label: 'Label 11' },
  { value: 'value12', label: 'Label 2' },
  { value: 'value13', label: 'Label 13' },
  { value: 'value2', label: 'Label 14' },
];

describe('optionHelpers', function suite() {
  describe('getOptionForValue', function funcSuite() {
    it('should return the option that has the given value', function test() {
      getOptionForValue(options, 'value8').should.equal(options[7]);
    });

    it('should return undefined if no option has the value', function test() {
      expect(getOptionForValue(options, 'foo')).to.equal(undefined);
    });

    it('should use case sensitive comparison', function test() {
      expect(getOptionForValue(options, 'Value8')).to.equal(undefined);
    });

    it('should return the first option if more than one has the given value', function test() {
      getOptionForValue(options, 'value2').should.equal(options[1]);
    });
  });

  describe('getLabelForValue', function funcSuite() {
    it('should return the label of the option that has the given value', function test() {
      getLabelForValue(options, 'value8').should.equal('Label 8');
    });

    it('should return undefined if no option has the value', function test() {
      expect(getLabelForValue(options, 'foo')).to.equal(undefined);
    });

    it('should use case sensitive comparison', function test() {
      expect(getLabelForValue(options, 'Value8')).to.equal(undefined);
    });

    it('should return the first option if more than one has the given value', function test() {
      getLabelForValue(options, 'value2').should.equal('Label 2');
    });
  });

  describe('getOptionForLabel', function funcSuite() {
    it('should return the option that has the given label', function test() {
      getOptionForLabel(options, 'Label 13').should.equal(options[12]);
    });

    it('should return undefined if no option has the label', function test() {
      expect(getOptionForLabel(options, 'Foo')).to.equal(undefined);
    });

    it('should use case insensitive comparison', function test() {
      expect(getOptionForLabel(options, 'LABEL 7')).to.equal(options[6]);
    });

    it('should return the first option if more than one has the given label', function test() {
      getOptionForLabel(options, 'Label 2').should.equal(options[1]);
    });
  });

  describe('filterOptionsByPrefix', function funcSuite() {
    it('should return an array of options whose labels start with the given filter', function test() {
      filterOptionsByPrefix(options, 'Label 1').should.deep.equal([
        options[0],
        options[9],
        options[10],
        options[12],
        options[13],
      ]);
    });

    it('should use case insensitive comparison', function test() {
      filterOptionsByPrefix(options, 'LABEL 1').should.deep.equal([
        options[0],
        options[9],
        options[10],
        options[12],
        options[13],
      ]);
    });

    it('should return all options when filter is empty, null, or undefined', function test() {
      filterOptionsByPrefix(options, '').should.equal(options);
      filterOptionsByPrefix(options, null).should.equal(options);
      filterOptionsByPrefix(options).should.equal(options);
    });
  });

  describe('filterOptionsBySubstring', function funcSuite() {
    it('should return an array of options whose labels contain the given filter', function test() {
      filterOptionsBySubstring(options, 'bel 1').should.deep.equal([
        options[0],
        options[9],
        options[10],
        options[12],
        options[13],
      ]);
    });

    it('should use case insensitive comparison', function test() {
      filterOptionsBySubstring(options, 'BEL 1').should.deep.equal([
        options[0],
        options[9],
        options[10],
        options[12],
        options[13],
      ]);
    });

    it('should return all options when filter is empty, null, or undefined', function test() {
      filterOptionsBySubstring(options, '').should.equal(options);
      filterOptionsBySubstring(options, null).should.equal(options);
      filterOptionsBySubstring(options).should.equal(options);
    });
  });

  describe('normalizeOptions', function funcSuite() {
    const uglyOptions = [
      { value: 'value1', label: 'Label 1' },
      { value: 'value2', label: '', disabled: false },
      { value: 'value3', disabled: true },
      { value: 'value4', label: null },
      { value: 'value5', label: undefined },
    ];

    it('should set null and undefined labels to the value, and normalize disabled settings', function test() {
      normalizeOptions(uglyOptions).should.deep.equal([
        { value: 'value1', label: 'Label 1' },
        { value: 'value2', label: '' },
        { value: 'value3', label: 'value3', disabled: true },
        { value: 'value4', label: 'value4' },
        { value: 'value5', label: 'value5' },
      ]);
    });

    it('should add an empty option when blankable is true', function test() {
      normalizeOptions(uglyOptions, true).should.deep.equal([
        { value: '', label: '' },
        { value: 'value1', label: 'Label 1' },
        { value: 'value2', label: '' },
        { value: 'value3', label: 'value3', disabled: true },
        { value: 'value4', label: 'value4' },
        { value: 'value5', label: 'value5' },
      ]);
    });

    it('should not add an empty option when blankable is false', function test() {
      normalizeOptions(uglyOptions, false).should.deep.equal([
        { value: 'value1', label: 'Label 1' },
        { value: 'value2', label: '' },
        { value: 'value3', label: 'value3', disabled: true },
        { value: 'value4', label: 'value4' },
        { value: 'value5', label: 'value5' },
      ]);
    });

    it('should return an empty array when options is null or undefined', function test() {
      normalizeOptions(null).should.deep.equal([]);
      normalizeOptions(undefined).should.deep.equal([]);
    });
  });
});
