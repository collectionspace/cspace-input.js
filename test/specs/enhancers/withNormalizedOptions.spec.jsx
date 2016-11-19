import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import chai from 'chai';

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
});
