import React from 'react';
import { Simulate } from 'react-dom/test-utils';

import createTestContainer from '../helpers/createTestContainer';
import { render } from '../helpers/renderHelpers';

import InputTableRow from '../../src/components/InputTableRow';
import InputTableHeader from '../../src/components/InputTableHeader';
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

describe('exported', () => {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  describe('CustomCompoundInput', () => {
    it('should render an InputTableRow template and an InputTableHeader label', function test() {
      const tableHeader = (
        <InputTableHeader>
          <TextInput name="title" label="Alternate title" />
          <TextInput name="type" label="Type" />
          <TextInput name="language" label="Language" />
        </InputTableHeader>
      );

      render(
        <CustomCompoundInput label={tableHeader}>
          <InputTableRow>
            <TextInput embedded name="title" />
            <TextInput embedded name="type" />
            <TextInput embedded name="language" />
          </InputTableRow>
        </CustomCompoundInput>, this.container,
      );

      this.container.querySelectorAll('label').length.should.equal(3);
      this.container.querySelectorAll('input').length.should.equal(3);
    });
  });

  describe('LineInput', () => {
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
        />, this.container,
      );

      const input = this.container.firstElementChild;
      const newValue = 'New value';

      input.value = newValue;

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

  describe('MultilineInput', () => {
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
        />, this.container,
      );

      const input = this.container.firstElementChild;
      const newValue = 'New value line 1\nNew value line 2';

      input.value = newValue;

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

  describe('PasswordInput', () => {
    it('should call onCommit when enter is pressed', function test() {
      let committedPath = null;
      let committedValue = null;

      const handleCommit = (path, value) => {
        committedPath = path;
        committedValue = value;
      };

      render(
        <PasswordInput name="input" onCommit={handleCommit} />, this.container,
      );

      const input = this.container.firstElementChild;
      const newValue = 'New value';

      input.value = newValue;

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

  describe('TabularCompoundInput', () => {
    it('should render outer and inner labels', function test() {
      render(
        <TabularCompoundInput label="Compound input label">
          <TextInput name="objectNumber" label="Inner label" />
        </TabularCompoundInput>, this.container,
      );

      const labels = this.container.querySelectorAll('label');

      labels[0].textContent.should.equal('Compound input label');
      labels[1].textContent.should.equal('Inner label');
    });

    it('should render when no labels are supplied', function test() {
      render(
        <TabularCompoundInput>
          <TextInput name="objectNumber" />
        </TabularCompoundInput>, this.container,
      );

      const labels = this.container.querySelectorAll('label');

      labels.length.should.equal(0);
    });
  });
});
