import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import DropdowMenuInput from '../../../src/components/DropdownMenuInput';
import withLabeledOptions from '../../../src/enhancers/withLabeledOptions';

chai.should();

describe('withLabeledOptions', () => {
  context('enhanced component', () => {
    it('should lift propTypes from the base component', () => {
      const StubComponent = ({
        name,
        value,
      }) => (
        <div>
          {name}
          {value}
        </div>
      );

      StubComponent.propTypes = {
        name: null,
        value: null,
      };

      StubComponent.defaultProps = {
        name: '',
        value: '',
      };

      const EnhancedComponent = withLabeledOptions(StubComponent);

      // eslint-disable-next-line react/forbid-foreign-prop-types
      EnhancedComponent.propTypes.should.include.keys(Object.keys(StubComponent.propTypes));
    });

    it('should label the options and pass them to the base component', () => {
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

    it('should call formatOptionLabel to format the label', () => {
      const EnhancedComponent = withLabeledOptions(DropdowMenuInput);
      const shallowRenderer = createRenderer();
      const formatOptionLabel = (option) => `formatted ${option.value}`;

      const options = [
        { value: 'cm' },
        { value: 'in' },
        { value: 'ft' },
      ];

      shallowRenderer.render(
        <EnhancedComponent
          formatOptionLabel={formatOptionLabel}
          options={options}
        />,
      );

      const result = shallowRenderer.getRenderOutput();

      result.props.options.should.deep.equal([
        { value: 'cm', label: 'formatted cm' },
        { value: 'in', label: 'formatted in' },
        { value: 'ft', label: 'formatted ft' },
      ]);
    });
  });
});
