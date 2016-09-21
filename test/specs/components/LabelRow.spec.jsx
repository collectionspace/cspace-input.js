import React from 'react';
import { render } from 'react-dom';
import chai from 'chai';

import createTestContainer from '../../helpers/createTestContainer';

import Label from '../../../src/components/Label';
import LabelRow from '../../../src/components/LabelRow';

chai.should();

describe('LabelRow', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render as a div', function test() {
    render(<LabelRow />, this.container);

    this.container.firstElementChild.nodeName.should.equal('DIV');
  });

  it('should render the child labels', function test() {
    render(
      <LabelRow>
        <Label>1</Label>
        <Label>2</Label>
        <Label>3</Label>
      </LabelRow>, this.container);

    const nodes = this.container.querySelectorAll('label');

    nodes[0].textContent.should.equal('1');
    nodes[1].textContent.should.equal('2');
    nodes[2].textContent.should.equal('3');
  });
});
