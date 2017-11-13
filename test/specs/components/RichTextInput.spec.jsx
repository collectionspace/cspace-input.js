import React from 'react';
import { render } from 'react-dom';
import { createRenderer } from 'react-test-renderer/shallow';
import ReactQuill from 'react-quill';
import createTestContainer from '../../helpers/createTestContainer';
import { isInput } from '../../../src/helpers/inputHelpers';
import RichTextInput from '../../../src/components/RichTextInput';

const expect = chai.expect;

chai.should();

describe('RichTextInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', function test() {
    isInput(<RichTextInput />).should.equal(true);
  });

  it('should render as a Quill editor', function test() {
    render(
      <RichTextInput
        value="Hello <i>world</i>"
      />, this.container);

    this.container.firstElementChild.className.should.contain('quill');
  });

  it('should render with enabled class when readOnly is false', function test() {
    render(
      <RichTextInput
        value="Hello <i>world</i>"
      />, this.container);

    this.container.firstElementChild.className.should.contain('--enabled');
  });

  it('should not render with enabled class when readOnly is true', function test() {
    render(
      <RichTextInput
        readOnly
        value="Hello <i>world</i>"
      />, this.container);

    this.container.firstElementChild.className.should.not.contain('--enabled');
  });

  it('should render with multiline class when multiline is true', function test() {
    render(
      <RichTextInput
        multiline
        value="Hello <i>world</i>"
      />, this.container);

    this.container.firstElementChild.className.should.contain('--multiline');
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
      />, this.container);


    this.container.firstElementChild.className.should.not.contain('--enabled');
    this.container.firstElementChild.className.should.contain('--multiline');
  });

  it('should render a ReactQuill component', function test() {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RichTextInput
        value="Hello <i>world</i>"
      />);

    const result = shallowRenderer.getRenderOutput();

    result.type.should.equal(ReactQuill);
  });

  it('should set the value to empty string if value is undefined', function test() {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RichTextInput />);

    const result = shallowRenderer.getRenderOutput();

    result.props.value.should.equal('');
  });

  it('should set the Quill tab handler to a function that returns true', function test() {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RichTextInput />);

    const result = shallowRenderer.getRenderOutput();
    const tabHandler = result.props.modules.keyboard.bindings.tab.handler;

    tabHandler.should.be.a('function');

    tabHandler().should.equal(true);
  });

  it('should set the Quill enter handler to a function that calls onCommit', function test() {
    let committedValue = null;

    const handleCommit = (pathArg, valueArg) => {
      committedValue = valueArg;
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RichTextInput
        onCommit={handleCommit}
      />);

    const result = shallowRenderer.getRenderOutput();
    const enterHandler = result.props.modules.keyboard.bindings.enter.handler;

    enterHandler.should.be.a('function');

    result.props.onChange('new value');

    enterHandler();

    committedValue.should.equal('new value');
  });

  it('should set the Quill enter handler to return true if multiline is true', function test() {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RichTextInput
        multiline
      />);

    const result = shallowRenderer.getRenderOutput();
    const enterHandler = result.props.modules.keyboard.bindings.enter.handler;

    enterHandler().should.equal(true);
  });

  it('should set the Quill enter handler to return true if multiline is true', function test() {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RichTextInput
        multiline
      />);

    const result = shallowRenderer.getRenderOutput();
    const enterHandler = result.props.modules.keyboard.bindings.enter.handler;

    enterHandler().should.equal(true);
  });

  it('should set the Quill enter handler to return false if multiline is falsy', function test() {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RichTextInput />);

    const result = shallowRenderer.getRenderOutput();
    const enterHandler = result.props.modules.keyboard.bindings.enter.handler;

    enterHandler().should.equal(false);
  });

  it('should call onCommit when the editor loses focus', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (pathArg, valueArg) => {
      committedPath = pathArg;
      committedValue = valueArg;
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RichTextInput
        name="title"
        onCommit={handleCommit}
      />);

    const result = shallowRenderer.getRenderOutput();

    result.props.onChange('hello');
    result.props.onBlur();

    committedPath.should.deep.equal(['title']);
    committedValue.should.equal('hello');
  });

  it('should remove the outer <p> tag if there is only one paragraph in the content', function test() {
    let committedValue = null;

    const handleCommit = (pathArg, valueArg) => {
      committedValue = valueArg;
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RichTextInput
        onCommit={handleCommit}
      />);

    const result = shallowRenderer.getRenderOutput();

    result.props.onChange('<p>hello <i>world</i></p>');
    result.props.onBlur();

    committedValue.should.equal('hello <i>world</i>');
  });

  it('should normalize <br> with no other content to empty string', function test() {
    let committedValue = null;

    const handleCommit = (pathArg, valueArg) => {
      committedValue = valueArg;
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RichTextInput
        onCommit={handleCommit}
      />);

    const result = shallowRenderer.getRenderOutput();

    result.props.onChange('<p><br></p>');
    result.props.onBlur();

    committedValue.should.equal('');
  });

  it('should not call onCommit when the value has not changed', function test() {
    let committedValue = null;

    const handleCommit = (pathArg, valueArg) => {
      committedValue = valueArg;
    };

    const shallowRenderer = createRenderer();

    shallowRenderer.render(
      <RichTextInput
        value="hello <i>world</i>"
        onCommit={handleCommit}
      />);

    const result = shallowRenderer.getRenderOutput();

    result.props.onChange('<p>hello <i>world</i></p>');
    result.props.onBlur();

    expect(committedValue).to.equal(null);
  });
});
