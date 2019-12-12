import React from 'react';
import { render } from 'react-dom';
import createTestContainer from '../../helpers/createTestContainer';
import compose from '../../../src/helpers/compose';

chai.should();

const PlainComponent = () => <div className="plain">Hello world</div>;

// eslint-disable-next-line react/prop-types
const WrapperComponent1 = ({ children }) => <div className="wrapper1">{children}</div>;

// eslint-disable-next-line react/prop-types
const WrapperComponent2 = ({ children }) => <div className="wrapper2">{children}</div>;

const enhancer1 = (BaseComponent) => () => <WrapperComponent1><BaseComponent /></WrapperComponent1>;
const enhancer2 = (BaseComponent) => () => <WrapperComponent2><BaseComponent /></WrapperComponent2>;

describe('compose', () => {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  context('when no enhancers are supplied', () => {
    it('should return an identity function', () => {
      compose()(PlainComponent).should.equal(PlainComponent);
    });
  });

  context('when one enhancer is supplied', () => {
    it('should return the enhancer', () => {
      compose(enhancer1).should.equal(enhancer1);
      compose(enhancer2).should.equal(enhancer2);
    });
  });

  context('when multiple enhancers are supplied', () => {
    it('should return a function that applies the enhancers from right to left', function test() {
      const EnhancedComponent = compose(enhancer1, enhancer2)(PlainComponent);

      render(<EnhancedComponent />, this.container);

      const root = this.container.firstElementChild;

      root.className.should.equal('wrapper1');
      root.querySelector('div.wrapper2').should.not.equal(null);
      root.querySelector('div.wrapper2').querySelector('div.plain').should.not.equal(null);
    });
  });
});
