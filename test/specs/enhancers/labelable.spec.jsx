import React from 'react';
import { render } from 'react-dom';
import chai from 'chai';

import createTestContainer from '../../helpers/createTestContainer';

import labelable from '../../../src/enhancers/labelable';
import Label from '../../../src/components/Label';

chai.should();

describe('labelable', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  context('enhanced component', function context() {
    it('should lift propTypes from the base component', function test() {
      const StubComponent = () => null;

      StubComponent.propTypes = {
        name: null,
        value: null,
      };

      const EnhancedComponent = labelable(StubComponent);

      EnhancedComponent.propTypes.should.include.keys(Object.keys(StubComponent.propTypes));
    });

    it('should accept label prop', function test() {
      labelable('input').propTypes.should.include.keys(['label']);
    });

    it('should accept msgkey prop', function test() {
      labelable('input').propTypes.should.include.keys(['msgkey']);
    });

    it('should not pass the label prop to the base component', function test() {
      let propsReceived = null;

      const StubComponent = (props) => {
        propsReceived = props;

        return null;
      };

      const EnhancedComponent = labelable(StubComponent);

      render(<EnhancedComponent name="n" label="Test label" foo="f" />, this.container);

      propsReceived.should.not.include.keys('label');
    });

    it('should not pass the msgkey prop to the base component', function test() {
      let propsReceived = null;

      const StubComponent = (props) => {
        propsReceived = props;

        return null;
      };

      const EnhancedComponent = labelable(StubComponent);

      render(<EnhancedComponent name="n" msgkey="key" />, this.container);

      propsReceived.should.not.include.keys('msgkey');
    });

    it('should render the supplied Label component label', function test() {
      const EnhancedComponent = labelable('input');
      const label = <Label>Object number</Label>;

      render(<EnhancedComponent label={label} defaultValue="Hello world" />, this.container);

      this.container.querySelector('label').textContent.should.equal('Object number');
    });

    it('should render the supplied string label', function test() {
      const EnhancedComponent = labelable('input');
      const label = 'String label';

      render(<EnhancedComponent label={label} defaultValue="Hello world" />, this.container);

      this.container.querySelector('label').textContent.should.equal('String label');
    });

    it('should render the supplied Label array label', function test() {
      const EnhancedComponent = labelable('input');
      const label = [
        <Label key="1">Label 1</Label>,
        <Label key="2">Label 2</Label>,
        <Label key="3">Label 3</Label>,
      ];

      render(<EnhancedComponent label={label} defaultValue="Hello world" />, this.container);

      const labels = this.container.querySelectorAll('label');

      labels[0].textContent.should.equal('Label 1');
      labels[1].textContent.should.equal('Label 2');
      labels[2].textContent.should.equal('Label 3');
    });
  });
});
