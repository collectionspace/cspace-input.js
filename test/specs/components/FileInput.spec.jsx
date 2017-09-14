/* global File */

import React from 'react';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import createTestContainer from '../../helpers/createTestContainer';
import { isInput } from '../../../src/helpers/inputHelpers';
import FileInput from '../../../src/components/FileInput';

const expect = chai.expect;

chai.should();

describe('FileInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', function test() {
    isInput(<FileInput />).should.equal(true);
  });

  it('should render as a div', function test() {
    render(<FileInput />, this.container);

    this.container.firstElementChild.nodeName.should.equal('DIV');
  });

  it('should simulate a click on the file input when when the select file button is clicked', function test() {
    render(<FileInput />, this.container);

    const input = this.container.querySelector('input[type="file"]');

    let inputClicked = false;

    input.onclick = () => {
      inputClicked = true;
    };

    const button = this.container.querySelector('button');

    Simulate.click(button);

    inputClicked.should.equal(true);
  });

  it('should apply the dragOver class when drag enters', function test() {
    render(<FileInput />, this.container);

    const infoDiv = this.container.querySelector('.cspace-input-FileInput--common > div');

    Simulate.dragEnter(infoDiv);

    this.container.querySelector('.cspace-input-FileInput--dragOver').should.not.equal(null);
  });

  it('should stop event propagation when drag enters', function test() {
    let containerHandlerCalled = false;

    const handleContainerDragEnter = () => {
      containerHandlerCalled = true;
    };

    render(
      <div onDragEnter={handleContainerDragEnter}>
        <FileInput />
      </div>, this.container);

    const infoDiv = this.container.querySelector('.cspace-input-FileInput--common > div');

    Simulate.dragEnter(infoDiv);

    containerHandlerCalled.should.equal(false);
  });

  it('should remove the dragOver class when drag leaves', function test() {
    render(<FileInput />, this.container);

    const infoDiv = this.container.querySelector('.cspace-input-FileInput--common > div');

    Simulate.dragLeave(infoDiv);

    expect(this.container.querySelector('.cspace-input-FileInput--dragOver')).to.equal(null);
  });

  it('should stop event propagation when drag leaves', function test() {
    let containerHandlerCalled = false;

    const handleContainerDragLeave = () => {
      containerHandlerCalled = true;
    };

    render(
      <div onDragLeave={handleContainerDragLeave}>
        <FileInput />
      </div>, this.container);

    const infoDiv = this.container.querySelector('.cspace-input-FileInput--common > div');

    Simulate.dragLeave(infoDiv);

    containerHandlerCalled.should.equal(false);
  });

  it('should stop event propagation when dragged over', function test() {
    let containerHandlerCalled = false;

    const handleContainerDragOver = () => {
      containerHandlerCalled = true;
    };

    render(
      <div onDragOver={handleContainerDragOver}>
        <FileInput />
      </div>, this.container);

    const infoDiv = this.container.querySelector('.cspace-input-FileInput--common > div');

    Simulate.dragOver(infoDiv);

    containerHandlerCalled.should.equal(false);
  });

  it('should call onCommit when a file is dropped', function test() {
    let committedValue = null;

    const handleCommit = (pathArg, valueArg) => {
      committedValue = valueArg;
    };

    render(<FileInput onCommit={handleCommit} />, this.container);

    const infoDiv = this.container.querySelector('.cspace-input-FileInput--common > div');

    Simulate.drop(infoDiv, {
      dataTransfer: {
        files: ['1', '2'],
      },
    });

    committedValue.should.deep.equal(['1', '2']);
  });

  it('should stop event propagation when a file is dropped', function test() {
    let containerHandlerCalled = false;

    const handleContainerDrop = () => {
      containerHandlerCalled = true;
    };

    render(
      <div onDrop={handleContainerDrop}>
        <FileInput />
      </div>, this.container);

    const infoDiv = this.container.querySelector('.cspace-input-FileInput--common > div');

    Simulate.drop(infoDiv, {
      dataTransfer: {
        files: ['1', '2'],
      },
    });

    containerHandlerCalled.should.equal(false);
  });

  it('should call onCommit when the file is changed', function test() {
    let handlerCalled = false;

    const handleCommit = () => {
      handlerCalled = true;
    };

    render(<FileInput onCommit={handleCommit} />, this.container);

    const input = this.container.querySelector('input[type="file"]');

    Simulate.change(input);

    handlerCalled.should.equal(true);
  });

  it('should call formatFileInfo to format file info', function test() {
    const fileName = 'testfile.png';
    const fileSize = 16;
    const fileType = 'image/png';

    let file;

    try {
      file = new File([new Uint8Array(fileSize)], fileName, { type: fileType });
    } catch (err) {
      if (err.name === 'TypeError' && err.number === -2146823286) {
        // Edge does not yet support the File constructor. Just skip the test.
        this.skip();
      } else {
        throw err;
      }
    }

    let formattedName = null;
    let formattedType = null;
    let formattedSize = null;

    const formatFileInfo = (nameArg, typeArg, sizeArg) => {
      formattedName = nameArg;
      formattedType = typeArg;
      formattedSize = sizeArg;

      return `${formattedName} - ${formattedType} - ${formattedSize}`;
    };

    render(
      <FileInput
        value={[file]}
        formatFileInfo={formatFileInfo}
      />, this.container);

    formattedName.should.equal(fileName);
    formattedType.should.equal(fileType);
    formattedSize.should.equal(fileSize);

    const infoDiv = this.container.querySelector('.cspace-input-FileInput--common > div');

    infoDiv.textContent.should.equal([formattedName, formattedType, formattedSize].join(' - '));
  });

  it('should format file info using a default formatting if formatFileInfo is not supplied', function test() {
    const fileName = 'testfile.png';
    const fileSize = 16;
    const fileType = 'image/png';

    let file;

    try {
      file = new File([new Uint8Array(fileSize)], fileName, { type: fileType });
    } catch (err) {
      if (err.name === 'TypeError' && err.number === -2146823286) {
        // Edge does not yet support the File constructor. Just skip the test.
        this.skip();
      } else {
        throw err;
      }
    }

    render(
      <FileInput
        value={[file]}
      />, this.container);

    const infoDiv = this.container.querySelector('.cspace-input-FileInput--common > div');

    infoDiv.textContent.should.equal(`${fileName} (${fileType}, ${fileSize} bytes)`);
  });
});
