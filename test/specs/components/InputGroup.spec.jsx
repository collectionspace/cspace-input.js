import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import { render } from 'react-dom';
import chai from 'chai';

import createTestContainer from '../../helpers/createTestContainer';

import isInput from '../../../src/helpers/isInput';
import CompoundInput from '../../../src/components/CompoundInput';
import TabularCompoundInput from '../../../src/components/TabularCompoundInput';
import TextInput from '../../../src/components/TextInput';
import InputGroup from '../../../src/components/InputGroup';

chai.should();

describe('InputGroup', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', function test() {
    isInput(<InputGroup />).should.equal(true);
  });

  context('when tabular prop is false', function context() {
    it('should render as a CompoundInput', function test() {
      const shallowRenderer = createRenderer();

      shallowRenderer.render(<InputGroup />);

      const result = shallowRenderer.getRenderOutput();

      result.type.should.equal(CompoundInput);
    });

    it('should render labels and values properly', function test() {
      const value = {
        firstName: 'John',
        lastName: 'Doe',
        address: {
          street: '12 Main St.',
          city: 'Berkeley',
          state: 'CA',
        },
      };

      render(
        <InputGroup value={value} label="Person">
          <TextInput name="firstName" label="First name" />
          <TextInput name="lastName" label="Last name" />

          <InputGroup name="address" label="Address">
            <TextInput name="street" label="Street" />
            <TextInput name="city" label="City" />
            <TextInput name="state" label="State" />
          </InputGroup>
        </InputGroup>, this.container);

      const labels = this.container.querySelectorAll('label');

      labels[0].textContent.should.equal('Person');
      labels[1].textContent.should.equal('First name');
      labels[2].textContent.should.equal('Last name');
      labels[3].textContent.should.equal('Address');
      labels[4].textContent.should.equal('Street');
      labels[5].textContent.should.equal('City');
      labels[6].textContent.should.equal('State');

      const inputs = this.container.querySelectorAll('input');

      inputs[0].value.should.equal(value.firstName);
      inputs[1].value.should.equal(value.lastName);
      inputs[2].value.should.equal(value.address.street);
      inputs[3].value.should.equal(value.address.city);
      inputs[4].value.should.equal(value.address.state);
    });
  });

  context('when tabular prop is true', function context() {
    it('should render as a TabularCompoundInput', function test() {
      const shallowRenderer = createRenderer();

      shallowRenderer.render(<InputGroup tabular />);

      const result = shallowRenderer.getRenderOutput();

      result.type.should.equal(TabularCompoundInput);
    });

    it('should render labels and values properly', function test() {
      const value = {
        firstName: 'John',
        lastName: 'Doe',
        address: {
          street: '12 Main St.',
          city: 'Berkeley',
          state: 'CA',
        },
      };

      render(
        <InputGroup value={value} tabular label="Person">
          <TextInput name="firstName" label="First name" />
          <TextInput name="lastName" label="Last name" />

          <InputGroup name="address" label="Address" tabular>
            <TextInput name="street" label="Street" />
            <TextInput name="city" label="City" />
            <TextInput name="state" label="State" />
          </InputGroup>
        </InputGroup>, this.container);

      const labels = this.container.querySelectorAll('label');

      labels[0].textContent.should.equal('Person');
      labels[1].textContent.should.equal('First name');
      labels[2].textContent.should.equal('Last name');
      labels[3].textContent.should.equal('Address');
      labels[4].textContent.should.equal('Street');
      labels[5].textContent.should.equal('City');
      labels[6].textContent.should.equal('State');

      const inputs = this.container.querySelectorAll('input');

      inputs[0].value.should.equal(value.firstName);
      inputs[1].value.should.equal(value.lastName);
      inputs[2].value.should.equal(value.address.street);
      inputs[3].value.should.equal(value.address.city);
      inputs[4].value.should.equal(value.address.state);
    });
  });
});
