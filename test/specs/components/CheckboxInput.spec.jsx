import React from 'react';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';

import createTestContainer from '../../helpers/createTestContainer';

import { isInput } from '../../../src/helpers/inputHelpers';
import CheckboxInput from '../../../src/components/CheckboxInput';

chai.should();

const expectedClassName = 'cspace-input-CheckboxInput--normal cspace-input-CheckboxInput--common cspace-input-CheckboxInput--indeterminate';

describe('CheckboxInput', () => {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', () => {
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

  it('should render as a div when asText is true', function test() {
    render(<CheckboxInput value asText />, this.container);

    this.container.firstElementChild.nodeName.should.equal('DIV');
  });

  it('should render as checked when value === true', function test() {
    render(<CheckboxInput value />, this.container);

    this.container.querySelector('input').checked.should.equal(true);
  });

  it('should render as unchecked when value === false', function test() {
    render(<CheckboxInput value={false} />, this.container);

    this.container.querySelector('input').checked.should.equal(false);
  });

  it('should render as indeterminate when value is anything else', function test() {
    render(<CheckboxInput value={undefined} />, this.container);

    this.container.firstElementChild.className.should
      .match(/ cspace-input-CheckboxInput--indeterminate$/);

    render(<CheckboxInput value={null} />, this.container);

    this.container.firstElementChild.className.should
      .match(/ cspace-input-CheckboxInput--indeterminate$/);

    render(<CheckboxInput value="" />, this.container);

    this.container.firstElementChild.className.should
      .match(/ cspace-input-CheckboxInput--indeterminate$/);

    render(<CheckboxInput value="foo" />, this.container);

    this.container.firstElementChild.className.should
      .match(/ cspace-input-CheckboxInput--indeterminate$/);

    render(<CheckboxInput value={0} />, this.container);

    this.container.firstElementChild.className.should
      .match(/ cspace-input-CheckboxInput--indeterminate$/);

    render(<CheckboxInput value={1} />, this.container);

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
        name="checkbox1"
        value={false}
        onCommit={handleCommit}
      />, this.container,
    );

    const checkbox = this.container.querySelector('input');

    Simulate.change(checkbox);

    committedPath.should.deep.equal(['checkbox1']);
    committedValue.should.equal(true);
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
        name="checkbox1"
        value
        onCommit={handleCommit}
      />, this.container,
    );

    const checkbox = this.container.querySelector('input');

    Simulate.change(checkbox);

    committedPath.should.deep.equal(['checkbox1']);
    committedValue.should.equal(false);
  });

  it('should call onCommit with value of true when the value is changed from something indeterminate', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (pathArg, valueArg) => {
      committedPath = pathArg;
      committedValue = valueArg;
    };

    render(
      <CheckboxInput
        name="checkbox1"
        value={null}
        onCommit={handleCommit}
      />, this.container,
    );

    const checkbox = this.container.querySelector('input');

    Simulate.change(checkbox);

    committedPath.should.deep.equal(['checkbox1']);
    committedValue.should.equal(true);
  });
});
