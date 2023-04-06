import React from 'react';
import { Simulate } from 'react-dom/test-utils';
import createTestContainer from '../../helpers/createTestContainer';
import { render } from '../../helpers/renderHelpers';
import { isInput } from '../../../src/helpers/inputHelpers';
import UploadInput from '../../../src/components/UploadInput';

const { expect } = chai;

chai.should();

describe('UploadInput', () => {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', () => {
    isInput(<UploadInput />).should.equal(true);
  });

  it('should render as a div', function test() {
    render(<UploadInput />, this.container);

    this.container.firstElementChild.nodeName.should.equal('DIV');
  });

  context('when type is \'file\'', () => {
    it('should render a FileInput', function test() {
      render(<UploadInput type="file" />, this.container);

      this.container.querySelector('.cspace-input-FileInput--common').should
        .not.equal(null);
    });

    it('should not accept a value that is not an array', function test() {
      render(<UploadInput type="file" value="foo" />, this.container);

      this.container.querySelector('input[data-name="file"]').files.should.have.lengthOf(0);
    });

    it('should call onCommit when the file is changed', function test() {
      let handlerCalled = false;

      const handleCommit = () => {
        handlerCalled = true;
      };

      render(
        <UploadInput
          type="file"
          onCommit={handleCommit}
        />, this.container,
      );

      const input = this.container.querySelector('input[data-name="file"]');

      Simulate.change(input);

      handlerCalled.should.equal(true);
    });
  });

  context('when type is \'url\'', () => {
    it('should render a LineInput', function test() {
      render(<UploadInput type="url" value="http://foo.com" />, this.container);

      this.container.querySelector('.cspace-input-LineInput--normal').should
        .not.equal(null);
    });

    it('should not accept a value that is not a string', function test() {
      render(<UploadInput type="url" value={{}} />, this.container);

      this.container.querySelector('input[data-name="url"]').value.should.equal('');
    });

    it('should call onCommit when the url is committed', function test() {
      let committedValue = null;

      const handleCommit = (pathArg, valueArg) => {
        committedValue = valueArg;
      };

      render(
        <UploadInput
          type="url"
          onCommit={handleCommit}
        />, this.container,
      );

      const input = this.container.querySelector('input[data-name="url"]');
      const newValue = 'http://collectionspace.org';

      input.value = newValue;

      Simulate.blur(input);

      committedValue.should.equal(newValue);
    });
  });

  it('should change the rendering when a new type is supplied via props', function test() {
    render(<UploadInput type="url" />, this.container);

    expect(this.container.querySelector('.cspace-input-FileInput--normal')).to
      .equal(null);

    render(<UploadInput type="file" />, this.container);

    this.container.querySelector('.cspace-input-FileInput--common').should
      .not.equal(null);
  });

  it('should call onCommit with null value when the type is changed', function test() {
    let committedValue;

    const handleCommit = (pathArg, valueArg) => {
      committedValue = valueArg;
    };

    render(
      <UploadInput
        type="file"
        onCommit={handleCommit}
      />, this.container,
    );

    const dropdown = this.container.querySelector('input[data-name="type"]');

    Simulate.focus(dropdown);
    Simulate.keyDown(dropdown, { key: 'ArrowDown' });

    const menu = this.container.querySelector('.cspace-input-Menu--common');

    Simulate.keyDown(menu, { key: 'ArrowDown' });
    Simulate.keyPress(menu, { key: 'Enter' });

    expect(committedValue).to.equal(null);
  });

  it('should call onTypeChanged when the type is changed', function test() {
    let changedType = null;

    const handleTypeChanged = (typeArg) => {
      changedType = typeArg;
    };

    render(
      <UploadInput
        type="file"
        onTypeChanged={handleTypeChanged}
      />, this.container,
    );

    const dropdown = this.container.querySelector('input[data-name="type"]');

    Simulate.focus(dropdown);
    Simulate.keyDown(dropdown, { key: 'ArrowDown' });

    const menu = this.container.querySelector('.cspace-input-Menu--common');

    Simulate.keyDown(menu, { key: 'ArrowDown' });
    Simulate.keyPress(menu, { key: 'Enter' });

    expect(changedType).to.equal('url');
  });
});
