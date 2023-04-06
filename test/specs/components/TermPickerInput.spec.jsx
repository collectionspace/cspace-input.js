import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import TermPickerInput from '../../../src/components/TermPickerInput';

import createTestContainer from '../../helpers/createTestContainer';
import { render } from '../../helpers/renderHelpers';

chai.should();

describe('TermPickerInput', () => {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render as a SubstringFilteringDropdownMenuInput', () => {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(<TermPickerInput items={[]} />, context);

    const result = shallowRenderer.getRenderOutput();

    result.type.displayName.should.match(/SubstringFilteringDropdownMenuInput/);
  });

  it('should render as a PrefixFilteringDropdownMenuInput if filter is \'prefix\'', () => {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(<TermPickerInput items={[]} filter="prefix" />, context);

    const result = shallowRenderer.getRenderOutput();

    result.type.displayName.should.match(/PrefixFilteringDropdownMenuInput/);
  });

  it('should turn the terms into options and pass them to the base component', () => {
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
      {
        refName: 'urn:cspace:core.collectionspace.org:vocabularies:name(languages):item:name(swe)\'Swedish\'',
        displayName: 'Swedish',
        termStatus: 'inactive',
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
      {
        value: 'urn:cspace:core.collectionspace.org:vocabularies:name(languages):item:name(swe)\'Swedish\'',
        label: 'Swedish',
        disabled: true,
      },
    ]);
  });

  it('should set the value label to the displayName of the selected term', () => {
    const shallowRenderer = createRenderer();

    const terms = [
      {
        refName: 'urn:cspace:core.collectionspace.org:vocabularies:name(languages):item:name(grc)\'Ancient Greek\'',
        displayName: 'Ancient Greek',
      },
      {
        refName: 'urn:cspace:core.collectionspace.org:vocabularies:name(languages):item:name(eng)\'English\'',
        displayName: 'English Display Name',
      },
      {
        refName: 'urn:cspace:core.collectionspace.org:vocabularies:name(languages):item:name(swe)\'Swedish\'',
        displayName: 'Swedish',
        termStatus: 'inactive',
      },
    ];

    shallowRenderer.render(
      <TermPickerInput
        terms={terms}
        value="urn:cspace:core.collectionspace.org:vocabularies:name(languages):item:name(eng)'English'"
      />,
      context,
    );

    const result = shallowRenderer.getRenderOutput();

    result.props.valueLabel.should.equal('English Display Name');
  });

  it('should set the value label to the displayName parsed from the value if the value does not match any term', () => {
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
      {
        refName: 'urn:cspace:core.collectionspace.org:vocabularies:name(languages):item:name(swe)\'Swedish\'',
        displayName: 'Swedish',
        termStatus: 'inactive',
      },
    ];

    shallowRenderer.render(
      <TermPickerInput
        terms={terms}
        value="urn:cspace:core.collectionspace.org:vocabularies:name(languages):item:name(pig)'Pig Latin'"
      />,
      context,
    );

    const result = shallowRenderer.getRenderOutput();

    result.props.valueLabel.should.equal('Pig Latin');
  });

  it('should pass empty options to the base component when terms is undefined', () => {
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
