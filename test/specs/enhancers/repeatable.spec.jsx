/* eslint-disable no-unused-expressions */

import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { render } from 'react-dom';
import createTestContainer from '../../helpers/createTestContainer';
import committable from '../../../src/enhancers/committable';
import repeatable from '../../../src/enhancers/repeatable';
import TextInput from '../../../src/components/TextInput';
import RepeatingInput from '../../../src/components/RepeatingInput';

const { expect } = chai;

chai.should();

describe('repeatable', () => {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  context('enhanced component', () => {
    it('should lift propTypes from the base component', () => {
      const StubComponent = ({
        name,
        value,
      }) => (
        <div>
          {name}
          {value}
        </div>
      );

      StubComponent.propTypes = {
        name: null,
        value: null,
      };

      StubComponent.defaultProps = {
        name: '',
        value: '',
      };

      const EnhancedComponent = repeatable(StubComponent);

      // eslint-disable-next-line react/forbid-foreign-prop-types
      EnhancedComponent.propTypes.should.include.keys(Object.keys(StubComponent.propTypes));
    });

    it('should not pass the repeating prop to the base component', function test() {
      let propsReceived = null;

      const StubComponent = (props) => {
        propsReceived = props;

        return null;
      };

      const EnhancedComponent = repeatable(StubComponent);

      render(<EnhancedComponent foo="f" value="v" repeating />, this.container);

      propsReceived.should.not.include.keys('repeating');
    });

    it('should render a RepeatingInput when repeating is true', function test() {
      const EnhancedComponent = repeatable(committable(TextInput));

      render(<EnhancedComponent value="" repeating />, this.container);

      this.container.querySelector('fieldset').should.exist;
    });

    it('should not render a RepeatingInput when repeating is false', function test() {
      const EnhancedComponent = repeatable(committable(TextInput));

      render(<EnhancedComponent value="" repeating={false} />, this.container);

      expect(this.container.querySelector('fieldset')).to.be.null;
    });

    it('should lift value to the RepeatingInput when repeating is true', () => {
      const EnhancedComponent = repeatable('input');

      const value = [
        '1',
        '2',
        '3',
      ];

      const shallowRenderer = createRenderer();

      shallowRenderer.render(<EnhancedComponent value={value} repeating />);

      const result = shallowRenderer.getRenderOutput();

      result.type.should.equal(RepeatingInput);
      result.props.should.include({ value });
    });

    it('should lift parentPath to the RepeatingInput when repeating is true', () => {
      const StubComponent = () => null;
      const EnhancedComponent = repeatable(StubComponent);
      const shallowRenderer = createRenderer();

      shallowRenderer.render(<EnhancedComponent parentPath="document" repeating />);

      const result = shallowRenderer.getRenderOutput();

      result.type.should.equal(RepeatingInput);
      result.props.should.include({ parentPath: 'document' });
    });

    it('should lift subpath to the RepeatingInput when repeating is true', () => {
      const StubComponent = () => null;
      const EnhancedComponent = repeatable(StubComponent);
      const shallowRenderer = createRenderer();

      shallowRenderer.render(<EnhancedComponent subpath="schema_name" repeating />);

      const result = shallowRenderer.getRenderOutput();

      result.type.should.equal(RepeatingInput);
      result.props.should.include({ subpath: 'schema_name' });
    });

    it('should lift name to the RepeatingInput when repeating is true', () => {
      const StubComponent = () => null;
      const EnhancedComponent = repeatable(StubComponent);
      const shallowRenderer = createRenderer();

      shallowRenderer.render(<EnhancedComponent name="rpt" repeating />);

      const result = shallowRenderer.getRenderOutput();

      result.type.should.equal(RepeatingInput);
      result.props.should.include({ name: 'rpt' });
    });

    it('should lift onCommit to the RepeatingInput when repeating is true', () => {
      const handleCommit = () => null;

      const StubComponent = () => null;
      const EnhancedComponent = repeatable(StubComponent);
      const shallowRenderer = createRenderer();

      shallowRenderer.render(<EnhancedComponent name="rpt" repeating onCommit={handleCommit} />);

      const result = shallowRenderer.getRenderOutput();

      result.type.should.equal(RepeatingInput);
      result.props.should.include({ onCommit: handleCommit });
    });
  });
});
