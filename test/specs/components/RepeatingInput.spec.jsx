/* global window */

import React, { PropTypes } from 'react';
import { Simulate } from 'react-addons-test-utils';
import Immutable from 'immutable';
import { render } from 'react-dom';
import chai from 'chai';

import createTestContainer from '../../helpers/createTestContainer';

import isInput from '../../../src/helpers/isInput';
import CustomCompoundInput from '../../../src/components/CustomCompoundInput';
import InputRow from '../../../src/components/InputRow';
import Label from '../../../src/components/Label';
import LabelRow from '../../../src/components/LabelRow';
import RepeatingInput from '../../../src/components/RepeatingInput';
import TextInput from '../../../src/components/TextInput';

chai.should();

const StubTemplateComponent = props => (
  <div className="template">Value: {JSON.stringify(props.value)}</div>
);

StubTemplateComponent.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

StubTemplateComponent.defaultProps = {
  value: 'Repeating input template',
};

describe('RepeatingInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', function test() {
    isInput(<RepeatingInput />).should.equal(true);
  });

  it('should render as a fieldset', function test() {
    render(
      <RepeatingInput>
        <StubTemplateComponent />
      </RepeatingInput>, this.container);

    this.container.firstElementChild.nodeName.should.equal('FIELDSET');
  });

  it('should render the template once for each element in an array value', function test() {
    const repeatingValue = [
      '1',
      '2',
      '3',
    ];

    render(
      <RepeatingInput value={repeatingValue}>
        <TextInput multiline />
      </RepeatingInput>, this.container);

    const textareas = this.container.querySelectorAll('textarea');

    textareas.length.should.equal(3);

    for (let i = 0; i < textareas.length; i += 1) {
      const textarea = textareas[i];
      textarea.value.should.equal(repeatingValue[i]);
    }
  });


  it('should render the template once for each element in an Immutable.List value', function test() {
    const repeatingValue = Immutable.List([ // eslint-disable-line new-cap
      '1',
      '2',
      '3',
    ]);

    render(
      <RepeatingInput value={repeatingValue}>
        <TextInput />
      </RepeatingInput>, this.container);

    const inputs = this.container.querySelectorAll('input');

    inputs.length.should.equal(3);

    for (let i = 0; i < inputs.length; i += 1) {
      const input = inputs[i];
      input.value.should.equal(repeatingValue.get(i));
    }
  });

  it('should render the template once for a string value', function test() {
    render(
      <RepeatingInput value="A string">
        <StubTemplateComponent />
      </RepeatingInput>, this.container);

    this.container.querySelectorAll('div.template').length.should.equal(1);
  });

  it('should render the template once for an object value', function test() {
    render(
      <RepeatingInput value={{}}>
        <StubTemplateComponent />
      </RepeatingInput>, this.container);

    this.container.querySelectorAll('div.template').length.should.equal(1);
  });

  it('should render the template once for an undefined value', function test() {
    render(
      <RepeatingInput>
        <TextInput multiline />
      </RepeatingInput>, this.container);

    this.container.querySelectorAll('textarea').length.should.equal(1);
    this.container.querySelector('textarea').value.should.equal('');
  });

  it('should render the template once for an empty array value', function test() {
    render(
      <RepeatingInput value={[]}>
        <TextInput multiline />
      </RepeatingInput>, this.container);

    this.container.querySelectorAll('textarea').length.should.equal(1);
    this.container.querySelector('textarea').value.should.equal('');
  });

  it('should distribute values to child inputs', function test() {
    const repeatingValue = [
      'Value 1',
      'Value 2',
      'Value 3',
    ];

    render(
      <RepeatingInput value={repeatingValue} label="Label">
        <TextInput label="Inner label" />
      </RepeatingInput>, this.container);

    this.container.querySelector('input[name="0"]').value.should.equal(repeatingValue[0]);
    this.container.querySelector('input[name="1"]').value.should.equal(repeatingValue[1]);
    this.container.querySelector('input[name="2"]').value.should.equal(repeatingValue[2]);
  });

  it('should call the onCommit callback when an instance is committed', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (path, value) => {
      committedPath = path;
      committedValue = value;
    };

    const repeatingValue = [
      'Value 1',
      'Value 2',
      'Value 3',
    ];

    render(
      <RepeatingInput
        name="rpt"
        subpath="schema_name"
        value={repeatingValue}
        onCommit={handleCommit}
      >
        <TextInput />
      </RepeatingInput>, this.container);

    const input = this.container.querySelectorAll('input')[1];

    input.value = 'New value';

    Simulate.keyPress(input, { key: 'Enter' });

    committedPath.should.deep.equal(['schema_name', 'rpt', '1']);
    committedValue.should.equal('New value');
  });

  it('should extract the label prop from the template and render it as a header', function test() {
    render(
      <RepeatingInput>
        <TextInput label="Inner label" />
      </RepeatingInput>, this.container);

    this.container.querySelector('label').textContent.should.equal('Inner label');
  });

  it('should render a repeating CustomCompoundInput', function test() {
    const repeatingValue = [
      {
        title: 'Title 1',
        type: 'Type 1',
        language: 'Lang 1',
      },
      {
        title: 'Title 2',
        type: 'Type 2',
        language: 'Lang 2',
      },
    ];

    render(
      <RepeatingInput value={repeatingValue}>
        <CustomCompoundInput>
          <TextInput name="title" label="Title" />
          <TextInput name="type" label="Type" />
          <TextInput name="language" label="Language" />
        </CustomCompoundInput>
      </RepeatingInput>, this.container);
  });

  it('should extract the label prop from the template and render it as a header', function test() {
    const repeatingValue = [
      {
        title: 'Title 1',
        type: 'Type 1',
        language: 'Lang 1',
      },
      {
        title: 'Title 2',
        type: 'Type 2',
        language: 'Lang 2',
      },
    ];

    const labelRow = (
      <LabelRow embedded>
        <Label>Alternate title</Label>
        <Label>Type</Label>
        <Label>Language</Label>
      </LabelRow>
    );

    render(
      <RepeatingInput value={repeatingValue}>
        <CustomCompoundInput label={labelRow}>
          <InputRow embedded>
            <TextInput embedded name="title" />
            <TextInput embedded name="type" />
            <TextInput embedded name="language" />
          </InputRow>
        </CustomCompoundInput>
      </RepeatingInput>, this.container);

    const labels = this.container.querySelectorAll('label');

    labels[0].textContent.should.equal('Alternate title');
    labels[1].textContent.should.equal('Type');
    labels[2].textContent.should.equal('Language');
  });

  it('should call the onAddInstance callback when the add button is clicked', function test() {
    let addInstancePath = null;

    const handleAddInstance = (path) => {
      addInstancePath = path;
    };

    render(
      <RepeatingInput
        name="rpt"
        subpath="schema_name"
        value="Value"
        onAddInstance={handleAddInstance}
      >
        <TextInput />
      </RepeatingInput>, this.container);

    const addButton = this.container.querySelector('button[name="add"]');

    Simulate.click(addButton);

    addInstancePath.should.deep.equal(['schema_name', 'rpt']);
  });

  it('should call the onRemoveInstance callback when the remove button is clicked', function test() {
    let removeInstancePath = null;

    const handleRemoveInstance = (path) => {
      removeInstancePath = path;
    };

    const repeatingValue = [
      'Value 1',
      'Value 2',
      'Value 3',
    ];

    render(
      <RepeatingInput
        name="rpt"
        subpath="schema_name"
        value={repeatingValue}
        onRemoveInstance={handleRemoveInstance}
      >
        <TextInput />
      </RepeatingInput>, this.container);

    const removeButton = this.container.querySelectorAll('button[name="remove"]')[1];

    Simulate.click(removeButton);

    removeInstancePath.should.deep.equal(['schema_name', 'rpt', '1']);
  });
});

