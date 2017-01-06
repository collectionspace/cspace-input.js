import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import DropdowMenuInput from '../../../src/components/DropdownMenuInput';
import withLabeledOptions from '../../../src/enhancers/withLabeledOptions';

chai.should();

describe('withLabeledOptions', function suite() {
  context('enhanced component', function context() {
    it('should lift propTypes from the base component', function test() {
      const StubComponent = () => null;

      StubComponent.propTypes = {
        name: null,
        value: null,
      };

      const EnhancedComponent = withLabeledOptions(StubComponent);

      EnhancedComponent.propTypes.should.include.keys(Object.keys(StubComponent.propTypes));
    });


    it('should label the options and pass them to the base component', function test() {
      const EnhancedComponent = withLabeledOptions(DropdowMenuInput);
      const shallowRenderer = createRenderer();

      const options = [
        { value: 'cm' },
        { value: 'in' },
        { value: 'ft' },
        { value: 'm', label: 'meters' },
      ];

      shallowRenderer.render(<EnhancedComponent options={options} />);

      const result = shallowRenderer.getRenderOutput();

      result.props.options.should.deep.equal([
        { value: 'cm', label: 'cm' },
        { value: 'in', label: 'in' },
        { value: 'ft', label: 'ft' },
        { value: 'm', label: 'meters' },
      ]);
    });

    it('should call formatOptionLabel to format the label', function test() {
      const EnhancedComponent = withLabeledOptions(DropdowMenuInput);
      const shallowRenderer = createRenderer();
      const formatOptionLabel = option => `formatted ${option.value}`;

      const options = [
        { value: 'cm' },
        { value: 'in' },
        { value: 'ft' },
      ];

      shallowRenderer.render(
        <EnhancedComponent
          formatOptionLabel={formatOptionLabel}
          options={options}
        />);

      const result = shallowRenderer.getRenderOutput();

      result.props.options.should.deep.equal([
        { value: 'cm', label: 'formatted cm' },
        { value: 'in', label: 'formatted in' },
        { value: 'ft', label: 'formatted ft' },
      ]);
    });
  });
});
