import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import PrefixFilteringDropdownMenuInput from '../../../src/components/PrefixFilteringDropdownMenuInput';
import OptionListControlledInput from '../../../src/components/OptionListControlledInput';

chai.should();

describe('OptionListControlledInput', function suite() {
  it('should render as a PrefixFilteringDropdownMenuInput', function test() {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(<OptionListControlledInput options={[]} />, context);

    const result = shallowRenderer.getRenderOutput();

    result.type.should.equal(PrefixFilteringDropdownMenuInput);
  });

  it('should label the options and pass them to the base component', function test() {
    const shallowRenderer = createRenderer();

    const options = [
      { value: 'cm' },
      { value: 'in' },
      { value: 'ft' },
    ];

    shallowRenderer.render(<OptionListControlledInput options={options} />, context);

    const result = shallowRenderer.getRenderOutput();

    result.props.options.should.deep.equal([
      { value: 'cm', label: 'cm' },
      { value: 'in', label: 'in' },
      { value: 'ft', label: 'ft' },
    ]);
  });

  it('should call formatOptionLabel to format the label', function test() {
    const shallowRenderer = createRenderer();
    const formatOptionLabel = option => `formatted ${option.value}`;

    const options = [
      { value: 'cm' },
      { value: 'in' },
      { value: 'ft' },
    ];

    shallowRenderer.render(
      <OptionListControlledInput
        formatOptionLabel={formatOptionLabel}
        options={options}
      />, context);

    const result = shallowRenderer.getRenderOutput();

    result.props.options.should.deep.equal([
      { value: 'cm', label: 'formatted cm' },
      { value: 'in', label: 'formatted in' },
      { value: 'ft', label: 'formatted ft' },
    ]);
  });
});
