import React from 'react';
import { Simulate } from 'react-addons-test-utils';
import { render } from 'react-dom';

import createTestContainer from '../helpers/createTestContainer';

import InputRow from '../../src/components/InputRow';
import Label from '../../src/components/Label';
import LabelRow from '../../src/components/LabelRow';
import { components } from '../../src';

const {
  CustomCompoundInput,
  LineInput,
  MultilineInput,
  PasswordInput,
  TabularCompoundInput,
  TextInput,
} = components;

chai.should();

describe('exported', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  describe('CustomCompoundInput', function componentSuite() {
    it('should render an InputRow template and a LabelRow label', function test() {
      const labelRow = (
        <LabelRow>
          <Label>Alternate title</Label>
          <Label>Type</Label>
          <Label>Language</Label>
        </LabelRow>
      );

      render(
        <CustomCompoundInput label={labelRow}>
          <InputRow>
            <TextInput embedded name="title" />
            <TextInput embedded name="type" />
            <TextInput embedded name="language" />
          </InputRow>
        </CustomCompoundInput>, this.container);

      this.container.querySelectorAll('label').length.should.equal(3);
      this.container.querySelectorAll('input').length.should.equal(3);
    });
  });

  describe('LineInput', function componentSuite() {
    it('should call onCommit when enter is pressed', function test() {
      let committedPath = null;
      let committedValue = null;

      const handleCommit = (path, value) => {
        committedPath = path;
        committedValue = value;
      };

      render(
        <LineInput
          name="input"
          onCommit={handleCommit}
          subpath="schema_name"
        />, this.container);

      const input = this.container.firstElementChild;
      const newValue = input.value = 'New value';

      Simulate.keyPress(input, { key: 'Enter' });

      committedPath.should.deep.equal(['schema_name', 'input']);
      committedValue.should.equal(newValue);
    });

    it('should not call onCommit when other keys are pressed', function test() {
      let handlerCalled = false;

      const handleCommit = () => {
        handlerCalled = true;
      };

      render(<LineInput onCommit={handleCommit} />, this.container);

      const input = this.container.firstElementChild;

      Simulate.keyPress(input, { key: 'a' });

      handlerCalled.should.equal(false);
    });

    it('should call onCommit when focus is lost', function test() {
      let committedPath = null;
      let committedValue = null;

      const handleCommit = (path, value) => {
        committedPath = path;
        committedValue = value;
      };

      render(<LineInput name="input" onCommit={handleCommit} />, this.container);

      const input = this.container.firstElementChild;
      const newValue = 'New value';

      input.value = newValue;

      Simulate.blur(input);

      committedPath.should.deep.equal(['input']);
      committedValue.should.equal(newValue);
    });
  });

  describe('MultilineInput', function componentSuite() {
    it('should call onCommit when enter is pressed', function test() {
      let committedPath = null;
      let committedValue = null;

      const handleCommit = (path, value) => {
        committedPath = path;
        committedValue = value;
      };

      render(
        <MultilineInput
          name="input"
          onCommit={handleCommit}
          subpath="schema_name"
        />, this.container);

      const input = this.container.firstElementChild;
      const newValue = input.value = 'New value line 1\nNew value line 2';

      Simulate.keyPress(input, { key: 'Enter' });

      committedPath.should.deep.equal(['schema_name', 'input']);
      committedValue.should.equal(newValue);
    });

    it('should not call onCommit when other keys are pressed', function test() {
      let handlerCalled = false;

      const handleCommit = () => {
        handlerCalled = true;
      };

      render(<MultilineInput onCommit={handleCommit} />, this.container);

      const input = this.container.firstElementChild;

      Simulate.keyPress(input, { key: 'a' });

      handlerCalled.should.equal(false);
    });

    it('should call onCommit when focus is lost', function test() {
      let committedPath = null;
      let committedValue = null;

      const handleCommit = (path, value) => {
        committedPath = path;
        committedValue = value;
      };

      render(<MultilineInput name="input" onCommit={handleCommit} />, this.container);

      const input = this.container.firstElementChild;
      const newValue = 'New value line 1\nNew value line 2';

      input.value = newValue;

      Simulate.blur(input);

      committedPath.should.deep.equal(['input']);
      committedValue.should.equal(newValue);
    });
  });

  describe('PasswordInput', function componentSuite() {
    it('should call onCommit when enter is pressed', function test() {
      let committedPath = null;
      let committedValue = null;

      const handleCommit = (path, value) => {
        committedPath = path;
        committedValue = value;
      };

      render(
        <PasswordInput name="input" onCommit={handleCommit} />, this.container);

      const input = this.container.firstElementChild;
      const newValue = input.value = 'New value';

      Simulate.keyPress(input, { key: 'Enter' });

      committedPath.should.deep.equal(['input']);
      committedValue.should.equal(newValue);
    });

    it('should not call onCommit when other keys are pressed', function test() {
      let handlerCalled = false;

      const handleCommit = () => {
        handlerCalled = true;
      };

      render(<PasswordInput onCommit={handleCommit} />, this.container);

      const input = this.container.firstElementChild;

      Simulate.keyPress(input, { key: 'a' });

      handlerCalled.should.equal(false);
    });

    it('should call onCommit when focus is lost', function test() {
      let committedPath = null;
      let committedValue = null;

      const handleCommit = (path, value) => {
        committedPath = path;
        committedValue = value;
      };

      render(<PasswordInput name="input" onCommit={handleCommit} />, this.container);

      const input = this.container.firstElementChild;
      const newValue = 'New value';

      input.value = newValue;

      Simulate.blur(input);

      committedPath.should.deep.equal(['input']);
      committedValue.should.equal(newValue);
    });
  });

  describe('TabularCompoundInput', function componentSuite() {
    it('should render outer and inner labels', function test() {
      render(
        <TabularCompoundInput label="Compound input label">
          <TextInput name="objectNumber" label="Inner label" />
        </TabularCompoundInput>, this.container);

      const labels = this.container.querySelectorAll('label');

      labels[0].textContent.should.equal('Compound input label');
      labels[1].textContent.should.equal('Inner label');
    });

    it('should render when no labels are supplied', function test() {
      render(
        <TabularCompoundInput>
          <TextInput name="objectNumber" />
        </TabularCompoundInput>, this.container);

      const labels = this.container.querySelectorAll('label');

      labels.length.should.equal(0);
    });
  });
});
