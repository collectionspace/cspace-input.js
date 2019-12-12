import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import OptionPickerInput from '../../../src/components/OptionPickerInput';

import createTestContainer from '../../helpers/createTestContainer';

chai.should();

describe('OptionPickerInput', () => {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render as a SubstringFilteringDropdownMenuInput', () => {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(<OptionPickerInput items={[]} />);

    const result = shallowRenderer.getRenderOutput();

    result.type.displayName.should.match(/SubstringFilteringDropdownMenuInput/);
  });

  it('should render as a PrefixFilteringDropdownMenuInput if filter is \'prefix\'', () => {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(<OptionPickerInput items={[]} filter="prefix" />);

    const result = shallowRenderer.getRenderOutput();

    result.type.displayName.should.match(/PrefixFilteringDropdownMenuInput/);
  });
});
