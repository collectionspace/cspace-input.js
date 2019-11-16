import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';

import Menu from '../../../src/components/Menu';
import { normalizeOptions } from '../../../src/helpers/optionHelpers';
import withNormalizedOptions from '../../../src/enhancers/withNormalizedOptions';

chai.should();

describe('withNormalizedOptions', function suite() {
  context('enhanced component', function context() {
    it('should lift propTypes from the base component', function test() {
      const StubComponent = () => null;

      StubComponent.propTypes = {
        name: null,
        value: null,
      };

      const EnhancedComponent = withNormalizedOptions(StubComponent);

      EnhancedComponent.propTypes.should.include.keys(Object.keys(StubComponent.propTypes));
    });

    it('should accept blankable prop', function test() {
      withNormalizedOptions('input').propTypes.should.include.keys(['blankable']);
    });

    it('should accept options prop', function test() {
      withNormalizedOptions('input').propTypes.should.include.keys(['options']);
    });

    it('should not pass the blankable prop to the base component', function test() {
      const StubComponent = () => null;
      const EnhancedComponent = withNormalizedOptions(StubComponent);
      const shallowRenderer = createRenderer();

      const result = shallowRenderer.render(<EnhancedComponent blankable />);

      result.props.should.not.include.keys('blankable');
    });

    it('should normalize options before passing them to the base component', function test() {
      const EnhancedComponent = withNormalizedOptions(Menu);
      const shallowRenderer = createRenderer();
      const blankable = false;

      const uglyOptions = [
        { value: 'value1', label: 'Label 1' },
        { value: 'value2', label: '' },
        { value: 'value3' },
        { value: 'value4', label: null },
        { value: 'value5', label: undefined },
      ];

      const result = shallowRenderer.render(
        <EnhancedComponent options={uglyOptions} blankable={blankable} />
      );

      result.props.options.should.deep.equal(normalizeOptions(uglyOptions, blankable));
    });

    it('shoud filter normalized options using the supplied prefilter before passing them to the base component', function test() {
      const EnhancedComponent = withNormalizedOptions(Menu);
      const shallowRenderer = createRenderer();

      const uglyOptions = [
        { value: 'value1', label: 'Label 1' },
        { value: 'value2', label: '' },
        { value: 'value3', label: 'Label 3' },
        { value: 'value5', label: 'Filter me out' },
        { value: 'value6', label: 'Filter me out too' },
        { value: 'value7', label: null },
        { value: 'value8', label: 'Filter me out also please' },
        { value: 'value9', label: 'Label 9' },
      ];

      const prefilter = option => !option.label.includes('Filter');

      const result = shallowRenderer.render(
        <EnhancedComponent options={uglyOptions} prefilter={prefilter} />
      );

      result.props.options.should.deep.equal([
        { value: '', label: '' },
        { value: 'value1', label: 'Label 1' },
        { value: 'value2', label: '' },
        { value: 'value3', label: 'Label 3' },
        { value: 'value7', label: 'value7' },
        { value: 'value9', label: 'Label 9' },
      ]);
    });
  });

  it('shoud sort normalized options using the supplied sortComparator before passing them to the base component', function test() {
    const EnhancedComponent = withNormalizedOptions(Menu);
    const shallowRenderer = createRenderer();

    const uglyOptions = [
      { value: 'value5', label: 'Label 5' },
      { value: 'value1', label: 'Label 1' },
      { value: 'value7', label: null },
      { value: 'value3', label: 'Label 3' },
      { value: 'value9', label: 'Label 9' },
      { value: 'value2', label: '' },
      { value: 'value8', label: 'Label 8' },
      { value: 'value6', label: 'Label 6' },
    ];

    const sortComparator = (optionA, optionB) =>
      optionA.label.localeCompare(optionB.label, 'en-US');

    const result = shallowRenderer.render(
      <EnhancedComponent options={uglyOptions} sortComparator={sortComparator} />
    );

    result.props.options.should.deep.equal([
      { value: '', label: '' },
      { value: 'value2', label: '' },
      { value: 'value1', label: 'Label 1' },
      { value: 'value3', label: 'Label 3' },
      { value: 'value5', label: 'Label 5' },
      { value: 'value6', label: 'Label 6' },
      { value: 'value8', label: 'Label 8' },
      { value: 'value9', label: 'Label 9' },
      { value: 'value7', label: 'value7' },
    ]);
  });

  it('should default blankable to true', function test() {
    const EnhancedComponent = withNormalizedOptions(Menu);
    const shallowRenderer = createRenderer();

    const options = [
      { value: 'value1', label: 'Label 1' },
    ];

    const result = shallowRenderer.render(
      <EnhancedComponent options={options} />
    );

    result.props.options.should.deep.equal(normalizeOptions(options, true));
  });
});
