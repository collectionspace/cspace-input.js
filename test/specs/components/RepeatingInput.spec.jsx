import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import chai from 'chai';

import createTestContainer from '../../helpers/createTestContainer';

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

  it('should render as a table', function test() {
    render(
      <RepeatingInput>
        <StubTemplateComponent />
      </RepeatingInput>, this.container);

    this.container.firstElementChild.nodeName.should.equal('TABLE');
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
      <RepeatingInput value={repeatingValue}>
        <TextInput />
      </RepeatingInput>, this.container);

    this.container.querySelector('input[name="0"]').value.should.equal(repeatingValue[0]);
    this.container.querySelector('input[name="1"]').value.should.equal(repeatingValue[1]);
    this.container.querySelector('input[name="2"]').value.should.equal(repeatingValue[2]);
  });
});

