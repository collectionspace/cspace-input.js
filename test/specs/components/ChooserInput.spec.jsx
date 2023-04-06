import React from 'react';
import { Simulate } from 'react-dom/test-utils';
import createTestContainer from '../../helpers/createTestContainer';
import { render } from '../../helpers/renderHelpers';
import { isInput } from '../../../src/helpers/inputHelpers';
import ChooserInput from '../../../src/components/ChooserInput';

const { expect } = chai;

chai.should();

describe('ChooserInput', () => {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', () => {
    isInput(<ChooserInput />).should.equal(true);
  });

  it('should render as a div', function test() {
    render(<ChooserInput />, this.container);

    this.container.firstElementChild.nodeName.should.equal('DIV');
  });

  it('should render as a read only LineInput if readOnly is true', function test() {
    render(<ChooserInput readOnly />, this.container);

    this.container.firstElementChild.className.should.contain('cspace-input-LineInput--normal');
  });

  context('when onDrop is provided', () => {
    const handleDrop = () => undefined;

    it('should apply the dragOver class when drag enters', function test() {
      render(<ChooserInput onDrop={handleDrop} />, this.container);

      const infoDiv = this.container.querySelector('.cspace-input-ChooserInput--common > div');

      Simulate.dragEnter(infoDiv);

      this.container.querySelector('.cspace-input-ChooserInput--dragOver').should.not.equal(null);
    });

    it('should stop event propagation when drag enters', function test() {
      let containerHandlerCalled = false;

      const handleContainerDragEnter = () => {
        containerHandlerCalled = true;
      };

      render(
        <div onDragEnter={handleContainerDragEnter}>
          <ChooserInput onDrop={handleDrop} />
        </div>, this.container,
      );

      const infoDiv = this.container.querySelector('.cspace-input-ChooserInput--common > div');

      Simulate.dragEnter(infoDiv);

      containerHandlerCalled.should.equal(false);
    });

    it('should remove the dragOver class when drag leaves', function test() {
      render(<ChooserInput onDrop={handleDrop} />, this.container);

      const infoDiv = this.container.querySelector('.cspace-input-ChooserInput--common > div');

      Simulate.dragLeave(infoDiv);

      expect(this.container.querySelector('.cspace-input-ChooserInput--dragOver')).to.equal(null);
    });

    it('should stop event propagation when drag leaves', function test() {
      let containerHandlerCalled = false;

      const handleContainerDragLeave = () => {
        containerHandlerCalled = true;
      };

      render(
        <div onDragLeave={handleContainerDragLeave}>
          <ChooserInput onDrop={handleDrop} />
        </div>, this.container,
      );

      const infoDiv = this.container.querySelector('.cspace-input-ChooserInput--common > div');

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
          <ChooserInput onDrop={handleDrop} />
        </div>, this.container,
      );

      const infoDiv = this.container.querySelector('.cspace-input-ChooserInput--common > div');

      Simulate.dragOver(infoDiv);

      containerHandlerCalled.should.equal(false);
    });

    it('should stop event propagation when data is dropped', function test() {
      let containerHandlerCalled = false;

      const handleContainerDrop = () => {
        containerHandlerCalled = true;
      };

      render(
        <div onDrop={handleContainerDrop}>
          <ChooserInput onDrop={handleDrop} />
        </div>, this.container,
      );

      const infoDiv = this.container.querySelector('.cspace-input-ChooserInput--common > div');

      Simulate.drop(infoDiv, {
        dataTransfer: {
          files: ['1', '2'],
        },
      });

      containerHandlerCalled.should.equal(false);
    });
  });
});
