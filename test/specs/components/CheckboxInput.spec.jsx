import React from 'react';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';

import createTestContainer from '../../helpers/createTestContainer';

import { isInput } from '../../../src/helpers/inputHelpers';
import CheckboxInput from '../../../src/components/CheckboxInput';

chai.should();

const expectedClassName = 'cspace-input-CheckboxInput--normal cspace-input-CheckboxInput--common';

describe('CheckboxInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', function test() {
    isInput(<CheckboxInput />).should.equal(true);
  });

  it('should render as a label', function test() {
    render(<CheckboxInput />, this.container);

    this.container.firstElementChild.nodeName.should.equal('LABEL');
  });

  it('should render with correct class', function test() {
    render(<CheckboxInput />, this.container);

    this.container.firstElementChild.className.should
      .equal(expectedClassName);
  });

  context('when tristate is false', () => {
    it('should render truthy values as checked', function test() {
      render(<CheckboxInput value />, this.container);

      this.container.querySelector('input').checked.should.equal(true);

      render(<CheckboxInput value="foo" />, this.container);

      this.container.querySelector('input').checked.should.equal(true);

      render(<CheckboxInput value={1} />, this.container);

      this.container.querySelector('input').checked.should.equal(true);
    });

    it('should render falsy values as unchecked', function test() {
      render(<CheckboxInput value={false} />, this.container);

      this.container.querySelector('input').checked.should.equal(false);

      render(<CheckboxInput value={null} />, this.container);

      this.container.querySelector('input').checked.should.equal(false);

      render(<CheckboxInput value={undefined} />, this.container);

      this.container.querySelector('input').checked.should.equal(false);

      render(<CheckboxInput value="" />, this.container);

      this.container.querySelector('input').checked.should.equal(false);

      render(<CheckboxInput value={0} />, this.container);

      this.container.querySelector('input').checked.should.equal(false);
    });

    it('should call onCommit with value of true when the value is changed from something falsy', function test() {
      let committedPath = null;
      let committedValue = null;

      const handleCommit = (pathArg, valueArg) => {
        committedPath = pathArg;
        committedValue = valueArg;
      };

      render(
        <CheckboxInput
          name="checkbox1"
          value={false}
          onCommit={handleCommit}
        />, this.container);

      const checkbox = this.container.querySelector('input');

      Simulate.change(checkbox);

      committedPath.should.deep.equal(['checkbox1']);
      committedValue.should.equal(true);
    });

    it('should call onCommit with value of false when the value is changed from something truthy', function test() {
      let committedPath = null;
      let committedValue = null;

      const handleCommit = (pathArg, valueArg) => {
        committedPath = pathArg;
        committedValue = valueArg;
      };

      render(
        <CheckboxInput
          name="checkbox1"
          value
          onCommit={handleCommit}
        />, this.container);

      const checkbox = this.container.querySelector('input');

      Simulate.change(checkbox);

      committedPath.should.deep.equal(['checkbox1']);
      committedValue.should.equal(false);
    });
  });

  context('when tristate is true', () => {
    it('should render as checked when value === true', function test() {
      render(<CheckboxInput tristate value />, this.container);

      this.container.querySelector('input').checked.should.equal(true);
    });

    it('should render as unchecked when value === false', function test() {
      render(<CheckboxInput tristate value={false} />, this.container);

      this.container.querySelector('input').checked.should.equal(false);
    });

    it('should render as indeterminate when value is anything else', function test() {
      render(<CheckboxInput tristate value={undefined} />, this.container);

      this.container.firstElementChild.className.should
        .match(/ cspace-input-CheckboxInput--indeterminate$/);

      render(<CheckboxInput tristate value={null} />, this.container);

      this.container.firstElementChild.className.should
        .match(/ cspace-input-CheckboxInput--indeterminate$/);

      render(<CheckboxInput tristate value="" />, this.container);

      this.container.firstElementChild.className.should
        .match(/ cspace-input-CheckboxInput--indeterminate$/);

      render(<CheckboxInput tristate value="foo" />, this.container);

      this.container.firstElementChild.className.should
        .match(/ cspace-input-CheckboxInput--indeterminate$/);

      render(<CheckboxInput tristate value={0} />, this.container);

      this.container.firstElementChild.className.should
        .match(/ cspace-input-CheckboxInput--indeterminate$/);

      render(<CheckboxInput tristate value={1} />, this.container);

      this.container.firstElementChild.className.should
        .match(/ cspace-input-CheckboxInput--indeterminate$/);
    });

    it('should call onCommit with value of true when the value is changed from false', function test() {
      let committedPath = null;
      let committedValue = null;

      const handleCommit = (pathArg, valueArg) => {
        committedPath = pathArg;
        committedValue = valueArg;
      };

      render(
        <CheckboxInput
          tristate
          name="checkbox1"
          value={false}
          onCommit={handleCommit}
        />, this.container);

      const checkbox = this.container.querySelector('input');

      Simulate.change(checkbox);

      committedPath.should.deep.equal(['checkbox1']);
      committedValue.should.equal(true);
    });
  });

  it('should call onCommit with value of false when the value is changed from true', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (pathArg, valueArg) => {
      committedPath = pathArg;
      committedValue = valueArg;
    };

    render(
      <CheckboxInput
        tristate
        name="checkbox1"
        value
        onCommit={handleCommit}
      />, this.container);

    const checkbox = this.container.querySelector('input');

    Simulate.change(checkbox);

    committedPath.should.deep.equal(['checkbox1']);
    committedValue.should.equal(false);
  });

  it('should call onCommit with value of false when the value is changed from something indeterminate', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (pathArg, valueArg) => {
      committedPath = pathArg;
      committedValue = valueArg;
    };

    render(
      <CheckboxInput
        tristate
        name="checkbox1"
        value={null}
        onCommit={handleCommit}
      />, this.container);

    const checkbox = this.container.querySelector('input');

    Simulate.change(checkbox);

    committedPath.should.deep.equal(['checkbox1']);
    committedValue.should.equal(false);
  });
});
