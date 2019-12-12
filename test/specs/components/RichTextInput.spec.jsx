/* global window, document */

import React from 'react';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { createRenderer } from 'react-test-renderer/shallow';
import { findWithType } from 'react-shallow-testutils';
import ReactQuill from 'react-quill';
import createTestContainer from '../../helpers/createTestContainer';
import { isInput } from '../../../src/helpers/inputHelpers';
import RichTextInput from '../../../src/components/RichTextInput';

const { expect } = chai;

chai.should();

describe('RichTextInput', () => {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', () => {
    isInput(<RichTextInput />).should.equal(true);
  });

  it('should render a Quill editor', function test() {
    render(
      <RichTextInput
        value="Hello <i>world</i>"
      />, this.container,
    );

    this.container.querySelector('.quill').should.not.equal(null);
  });

  it('should render an editor with enabled class when readOnly is false', function test() {
    render(
      <RichTextInput
        value="Hello <i>world</i>"
      />, this.container,
    );

    this.container.querySelector('.quill').className.should.contain('--enabled');
  });

  it('should render an editor without enabled class when readOnly is true', function test() {
    render(
      <RichTextInput
        readOnly
        value="Hello <i>world</i>"
      />, this.container,
    );

    this.container.querySelector('.quill').className.should.not.contain('--enabled');
  });

  it('should render with multiline class when multiline is true', function test() {
    render(
      <RichTextInput
        multiline
        value="Hello <i>world</i>"
      />, this.container,
    );

    this.container.querySelector('.quill').className.should.contain('--multiline');
  });

  it('should render without enabled class and with multiline class both readOnly is true and multiline is true', function test() {
    render(
      <RichTextInput
        multiline
        readOnly
        value={`
          <p>Hello <i>world</i></p>
          <p>Another line</p>
          <p>Line 3</p>
          <p>Line 4</p>
          <p><b>Line 5</b></p>
          <p>Line 6</p>
        `}
      />, this.container,
    );


    this.container.querySelector('.quill').className.should.not.contain('--enabled');
    this.container.querySelector('.quill').className.should.contain('--multiline');
  });

  it('should update the editor value when a new value is supplied via props', function test() {
    render(
      <RichTextInput
        value="Hello <i>world</i>"
      />, this.container,
    );

    render(
      <RichTextInput
        value="new value"
      />, this.container,
    );

    this.container.querySelector('div[contenteditable]').innerHTML.should
      .equal('<p>new value</p>');
  });

  it('should render a ReactQuill component', () => {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RichTextInput
        value="Hello <i>world</i>"
      />,
    );

    const result = shallowRenderer.getRenderOutput();

    findWithType(result, ReactQuill).should.not.equal(null);
  });

  it('should set the value to empty string if value is undefined', () => {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RichTextInput />,
    );

    const result = shallowRenderer.getRenderOutput();
    const reactQuill = findWithType(result, ReactQuill);

    reactQuill.props.value.should.equal('');
  });

  it('should set the Quill tab binding to null', () => {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RichTextInput />,
    );

    const result = shallowRenderer.getRenderOutput();
    const reactQuill = findWithType(result, ReactQuill);
    const tabHandler = reactQuill.props.modules.keyboard.bindings.tab;

    expect(tabHandler).to.equal(null);
  });

  it('should set the Quill enter handler to a function that calls onCommit', () => {
    let committedValue = null;

    const handleCommit = (pathArg, valueArg) => {
      committedValue = valueArg;
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RichTextInput
        onCommit={handleCommit}
      />,
    );

    const result = shallowRenderer.getRenderOutput();
    const reactQuill = findWithType(result, ReactQuill);
    const enterHandler = reactQuill.props.modules.keyboard.bindings.enter.handler;

    enterHandler.should.be.a('function');

    reactQuill.props.onChange('new value');

    enterHandler();

    committedValue.should.equal('new value');
  });

  it('should set the Quill enter handler to return true if multiline is true', () => {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RichTextInput
        multiline
      />,
    );

    const result = shallowRenderer.getRenderOutput();
    const reactQuill = findWithType(result, ReactQuill);
    const enterHandler = reactQuill.props.modules.keyboard.bindings.enter.handler;

    enterHandler().should.equal(true);
  });

  it('should set the Quill enter handler to return false if multiline is falsy', () => {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RichTextInput />,
    );

    const result = shallowRenderer.getRenderOutput();
    const reactQuill = findWithType(result, ReactQuill);
    const enterHandler = reactQuill.props.modules.keyboard.bindings.enter.handler;

    enterHandler().should.equal(false);
  });

  it('should asynchronously call onCommit and remove focus class when the editor loses focus', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (pathArg, valueArg) => {
      committedPath = pathArg;
      committedValue = valueArg;
    };

    render(
      <RichTextInput
        name="title"
        value="hello"
        onCommit={handleCommit}
      />, this.container,
    );

    const quill = this.container.querySelector('.quill');

    Simulate.focus(quill);

    const editor = this.container.querySelector('div[contenteditable]');

    editor.innerHTML = 'new value';

    Simulate.blur(quill);

    return new Promise((resolve) => {
      window.setTimeout(() => {
        committedPath.should.deep.equal(['title']);
        committedValue.should.equal('new value');

        quill.className.should.not.contain('--focus');

        resolve();
      }, 0);
    });
  });

  it('should do nothing when the editor loses focus but the newly focused item is still within the input', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (pathArg, valueArg) => {
      committedPath = pathArg;
      committedValue = valueArg;
    };

    render(
      <RichTextInput
        name="title"
        value="hello"
        onCommit={handleCommit}
      />, this.container,
    );

    const quill = this.container.querySelector('.quill');

    Simulate.focus(quill);

    const editor = this.container.querySelector('div[contenteditable]');

    editor.innerHTML = 'new value';

    Simulate.blur(quill, {
      relatedTarget: this.container.querySelector('.ql-toolbar'),
    });

    return new Promise((resolve) => {
      window.setTimeout(() => {
        expect(committedPath).to.equal(null);
        expect(committedValue).to.equal(null);

        quill.className.should.contain('--focus');

        resolve();
      }, 0);
    });
  });

  it('should remove the outer <p> tag if there is only one paragraph in the content', () => {
    let committedValue = null;

    const handleCommit = (pathArg, valueArg) => {
      committedValue = valueArg;
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RichTextInput
        onCommit={handleCommit}
      />,
    );

    const result = shallowRenderer.getRenderOutput();
    const reactQuill = findWithType(result, ReactQuill);
    const enterHandler = reactQuill.props.modules.keyboard.bindings.enter.handler;

    reactQuill.props.onChange('<p>hello <i>world</i></p>');

    enterHandler();

    committedValue.should.equal('hello <i>world</i>');
  });

  it('should normalize <br> with no other content to empty string', () => {
    let committedValue = null;

    const handleCommit = (pathArg, valueArg) => {
      committedValue = valueArg;
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RichTextInput
        onCommit={handleCommit}
      />,
    );

    const result = shallowRenderer.getRenderOutput();
    const reactQuill = findWithType(result, ReactQuill);
    const enterHandler = reactQuill.props.modules.keyboard.bindings.enter.handler;

    reactQuill.props.onChange('<p><br></p>');

    enterHandler();

    committedValue.should.equal('');
  });

  it('should not call onCommit when the value has not changed', () => {
    let committedValue = null;

    const handleCommit = (pathArg, valueArg) => {
      committedValue = valueArg;
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RichTextInput
        value="hello <i>world</i>"
        onCommit={handleCommit}
      />,
    );

    const result = shallowRenderer.getRenderOutput();
    const reactQuill = findWithType(result, ReactQuill);
    const enterHandler = reactQuill.props.modules.keyboard.bindings.enter.handler;

    reactQuill.props.onChange('<p>hello <i>world</i></p>');

    enterHandler();

    expect(committedValue).to.equal(null);
  });

  it('should render with focus class when focus is received', function test() {
    render(
      <RichTextInput
        readOnly
        value="Hello <i>world</i>"
      />, this.container,
    );

    Simulate.focus(this.container.querySelector('.quill'));

    this.container.querySelector('.quill').className.should.contain('--focus');
  });

  it('should not render with focus class when focus is received if the previously focused element is within the input', function test() {
    render(
      <RichTextInput
        readOnly
        value="Hello <i>world</i>"
      />, this.container,
    );

    Simulate.focus(this.container.querySelector('.quill'), {
      relatedTarget: this.container.querySelector('.ql-editor'),
    });

    this.container.querySelector('.quill').className.should.not.contain('--focus');
  });

  it('should prevent the default when the mouse is depressed on a button', () => {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RichTextInput />,
    );

    const result = shallowRenderer.getRenderOutput();

    let defaultPrevented = false;

    result.props.onMouseDown({
      target: document.createElement('button'),
      preventDefault: () => {
        defaultPrevented = true;
      },
    });

    defaultPrevented.should.equal(true);
  });
});
