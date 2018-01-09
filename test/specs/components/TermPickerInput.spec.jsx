import React from 'react';
import { render } from 'react-dom';
import { createRenderer } from 'react-test-renderer/shallow';
import TermPickerInput from '../../../src/components/TermPickerInput';

import createTestContainer from '../../helpers/createTestContainer';

chai.should();

describe('TermPickerInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render as a SubstringFilteringDropdownMenuInput', function test() {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(<TermPickerInput items={[]} />, context);

    const result = shallowRenderer.getRenderOutput();

    result.type.displayName.should.match(/SubstringFilteringDropdownMenuInput/);
  });

  it('should turn the terms into options and pass them to the base component', function test() {
    const shallowRenderer = createRenderer();

    const terms = [
      {
        refName: 'urn:cspace:core.collectionspace.org:vocabularies:name(languages):item:name(grc)\'Ancient Greek\'',
        displayName: 'Ancient Greek',
      },
      {
        refName: 'urn:cspace:core.collectionspace.org:vocabularies:name(languages):item:name(eng)\'English\'',
        displayName: 'English',
      },
    ];

    shallowRenderer.render(<TermPickerInput terms={terms} />, context);

    const result = shallowRenderer.getRenderOutput();

    result.props.options.should.deep.equal([
      {
        value: 'urn:cspace:core.collectionspace.org:vocabularies:name(languages):item:name(grc)\'Ancient Greek\'',
        label: 'Ancient Greek',
      },
      {
        value: 'urn:cspace:core.collectionspace.org:vocabularies:name(languages):item:name(eng)\'English\'',
        label: 'English',
      },
    ]);
  });

  it('should pass empty options to the base component when terms is undefined', function test() {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(<TermPickerInput />, context);

    const result = shallowRenderer.getRenderOutput();

    result.props.options.should.deep.equal([]);
  });

  it('should call onMount when mounted', function test() {
    let handlerCalled = false;

    const handleMount = () => {
      handlerCalled = true;
    };

    render(<TermPickerInput onMount={handleMount} />, this.container);

    handlerCalled.should.equal(true);
  });
});
