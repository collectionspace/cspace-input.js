import React from 'react';
import PropTypes from 'prop-types';
import { Simulate } from 'react-dom/test-utils';
import Immutable from 'immutable';
import createTestContainer from '../../helpers/createTestContainer';
import { render } from '../../helpers/renderHelpers';
import { isInput } from '../../../src/helpers/inputHelpers';
import CustomCompoundInput from '../../../src/components/CustomCompoundInput';
import InputTableRow from '../../../src/components/InputTableRow';
import InputTableHeader from '../../../src/components/InputTableHeader';
import RepeatingInput from '../../../src/components/RepeatingInput';
import BaseTextInput from '../../../src/components/TextInput';
import committable from '../../../src/enhancers/committable';

const TextInput = committable(BaseTextInput);

const { expect } = chai;

chai.should();

const StubTemplateComponent = ({ value }) => (
  <div className="template">
    Value:
    {JSON.stringify(value)}
  </div>
);

StubTemplateComponent.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

StubTemplateComponent.defaultProps = {
  value: 'Repeating input template',
};

describe('RepeatingInput', () => {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', () => {
    isInput(<RepeatingInput />).should.equal(true);
  });

  it('should render as a fieldset', function test() {
    render(
      <RepeatingInput>
        <StubTemplateComponent />
      </RepeatingInput>, this.container,
    );

    this.container.firstElementChild.nodeName.should.equal('FIELDSET');
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
      </RepeatingInput>, this.container,
    );

    const textareas = this.container.querySelectorAll('textarea');

    textareas.length.should.equal(3);

    for (let i = 0; i < textareas.length; i += 1) {
      const textarea = textareas[i];
      textarea.value.should.equal(repeatingValue[i]);
    }
  });

  it('should render the template once for each element in an Immutable.List value', function test() {
    const repeatingValue = Immutable.List([ // eslint-disable-line new-cap
      '1',
      '2',
      '3',
    ]);

    render(
      <RepeatingInput value={repeatingValue}>
        <TextInput />
      </RepeatingInput>, this.container,
    );

    const inputs = this.container.querySelectorAll('input');

    inputs.length.should.equal(3);

    for (let i = 0; i < inputs.length; i += 1) {
      const input = inputs[i];
      input.value.should.equal(repeatingValue.get(i));
    }
  });

  it('should render the template once for a string value', function test() {
    render(
      <RepeatingInput value="A string">
        <StubTemplateComponent />
      </RepeatingInput>, this.container,
    );

    this.container.querySelectorAll('div.template').length.should.equal(1);
  });

  it('should render the template once for an object value', function test() {
    render(
      <RepeatingInput value={{}}>
        <StubTemplateComponent />
      </RepeatingInput>, this.container,
    );

    this.container.querySelectorAll('div.template').length.should.equal(1);
  });

  it('should render the template once for an undefined value', function test() {
    render(
      <RepeatingInput>
        <TextInput multiline />
      </RepeatingInput>, this.container,
    );

    this.container.querySelectorAll('textarea').length.should.equal(1);
    this.container.querySelector('textarea').value.should.equal('');
  });

  it('should render the template once for an empty array value', function test() {
    render(
      <RepeatingInput value={[]}>
        <TextInput multiline />
      </RepeatingInput>, this.container,
    );

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
      <RepeatingInput value={repeatingValue} label="Label">
        <TextInput label="Inner label" />
      </RepeatingInput>, this.container,
    );

    this.container.querySelector('input[data-name="0"]').value.should.equal(repeatingValue[0]);
    this.container.querySelector('input[data-name="1"]').value.should.equal(repeatingValue[1]);
    this.container.querySelector('input[data-name="2"]').value.should.equal(repeatingValue[2]);
  });

  it('should set parentPath on instances', function test() {
    let committedPath = null;

    const handleCommit = (path) => {
      committedPath = path;
    };

    const repeatingValue = [
      'Value 1',
      'Value 2',
      'Value 3',
    ];

    render(
      <RepeatingInput
        value={repeatingValue}
        label="Label"
        name="rpt"
        parentPath="parent"
        onCommit={handleCommit}
      >
        <TextInput label="Inner label" />
      </RepeatingInput>, this.container,
    );

    const input = this.container.querySelector('input[data-name="0"]');

    input.value = 'something';

    Simulate.blur(input);

    committedPath.should.deep.equal(['parent', 'rpt', '0']);
  });

  it('should call the onCommit callback when a committable instance is committed', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (path, value) => {
      committedPath = path;
      committedValue = value;
    };

    const repeatingValue = [
      'Value 1',
      'Value 2',
      'Value 3',
    ];

    render(
      <RepeatingInput
        name="rpt"
        subpath="schema_name"
        value={repeatingValue}
        onCommit={handleCommit}
      >
        <TextInput />
      </RepeatingInput>, this.container,
    );

    const input = this.container.querySelectorAll('input')[1];

    input.value = 'New value';

    Simulate.keyPress(input, { key: 'Enter' });

    committedPath.should.deep.equal(['schema_name', 'rpt', '1']);
    committedValue.should.equal('New value');
  });

  it('should call renderOrderIndicator to render the order indicator, if supplied', function test() {
    const renderOrderIndicator = (orderNumber) => <div className="testOrderIndicator">{`order ${orderNumber}`}</div>;

    const repeatingValue = [
      'Value 1',
      'Value 2',
      'Value 3',
    ];

    render(
      <RepeatingInput
        name="rpt"
        subpath="schema_name"
        value={repeatingValue}
        renderOrderIndicator={renderOrderIndicator}
      >
        <TextInput />
      </RepeatingInput>, this.container,
    );

    const indicators = this.container.querySelectorAll('.testOrderIndicator');

    indicators.should.have.lengthOf(3);

    indicators[0].textContent.should.equal('order 1');
    indicators[1].textContent.should.equal('order 2');
    indicators[2].textContent.should.equal('order 3');
  });

  it('should extract the label prop from the template and render it as a header', function test() {
    render(
      <RepeatingInput>
        <TextInput label="Inner label" />
      </RepeatingInput>, this.container,
    );

    this.container.querySelector('label').textContent.should.equal('Inner label');
  });

  it('should render a repeating CustomCompoundInput', function test() {
    const repeatingValue = [
      {
        title: 'Title 1',
        type: 'Type 1',
        language: 'Lang 1',
      },
      {
        title: 'Title 2',
        type: 'Type 2',
        language: 'Lang 2',
      },
    ];

    render(
      <RepeatingInput value={repeatingValue}>
        <CustomCompoundInput>
          <TextInput name="title" label="Title" />
          <TextInput name="type" label="Type" />
          <TextInput name="language" label="Language" />
        </CustomCompoundInput>
      </RepeatingInput>, this.container,
    );
  });

  it('should extract a table header label prop from the template and render it as a header', function test() {
    const repeatingValue = [
      {
        title: 'Title 1',
        type: 'Type 1',
        language: 'Lang 1',
      },
      {
        title: 'Title 2',
        type: 'Type 2',
        language: 'Lang 2',
      },
    ];

    const tableHeader = (
      <InputTableHeader embedded>
        <TextInput name="title" label="Alternate title" />
        <TextInput name="type" label="Type" />
        <TextInput name="language" label="Language" />
      </InputTableHeader>
    );

    render(
      <RepeatingInput value={repeatingValue}>
        <CustomCompoundInput label={tableHeader}>
          <InputTableRow embedded>
            <TextInput embedded name="title" />
            <TextInput embedded name="type" />
            <TextInput embedded name="language" />
          </InputTableRow>
        </CustomCompoundInput>
      </RepeatingInput>, this.container,
    );

    const labels = this.container.querySelectorAll('label');

    labels[0].textContent.should.equal('Alternate title');
    labels[1].textContent.should.equal('Type');
    labels[2].textContent.should.equal('Language');
  });

  it('should display three digit column numbers without truncation', function test() {
    const repeatingValue = Array(100).fill('foo');

    render(
      <RepeatingInput
        name="rpt"
        subpath="schema_name"
        value={repeatingValue}
      >
        <TextInput />
      </RepeatingInput>, this.container,
    );

    return true;
  });

  it('should call disableRemoveButton to determine if the remove button should be disabled for each instance', function test() {
    const disableRemoveButton = (data) => data.includes('nope');

    const repeatingValue = [
      '1 yup',
      '2 nope',
      '3 nope',
      '4 yup',
      '5 nope',
    ];

    render(
      <RepeatingInput
        name="rpt"
        subpath="schema_name"
        value={repeatingValue}
        disableRemoveButton={disableRemoveButton}
      >
        <TextInput />
      </RepeatingInput>, this.container,
    );

    const removeButtons = this.container.querySelectorAll('button[data-name="remove"]');

    removeButtons[0].disabled.should.equal(false);
    removeButtons[1].disabled.should.equal(true);
    removeButtons[2].disabled.should.equal(true);
    removeButtons[3].disabled.should.equal(false);
    removeButtons[4].disabled.should.equal(true);
  });

  it('should call the onAddInstance callback when the add button is clicked', function test() {
    let addInstancePath = null;

    const handleAddInstance = (path) => {
      addInstancePath = path;
    };

    render(
      <RepeatingInput
        name="rpt"
        subpath="schema_name"
        value="Value"
        onAddInstance={handleAddInstance}
      >
        <TextInput />
      </RepeatingInput>, this.container,
    );

    const addButton = this.container.querySelector('button[data-name="add"]');

    Simulate.click(addButton);

    addInstancePath.should.deep.equal(['schema_name', 'rpt']);
  });

  it('should call the onRemoveInstance callback when the remove button is clicked', function test() {
    let removeInstancePath = null;

    const handleRemoveInstance = (path) => {
      removeInstancePath = path;
    };

    const repeatingValue = [
      'Value 1',
      'Value 2',
      'Value 3',
    ];

    render(
      <RepeatingInput
        name="rpt"
        subpath="schema_name"
        value={repeatingValue}
        onRemoveInstance={handleRemoveInstance}
      >
        <TextInput />
      </RepeatingInput>, this.container,
    );

    const removeButton = this.container.querySelectorAll('button[data-name="remove"]')[1];

    Simulate.click(removeButton);

    removeInstancePath.should.deep.equal(['schema_name', 'rpt', '1']);
  });

  it('should call the onMoveInstance callback when the move to top button is clicked', function test() {
    let moveInstancePath = null;
    let moveInstanceNewPosition = null;

    const handleMoveInstance = (path, newPosition) => {
      moveInstancePath = path;
      moveInstanceNewPosition = newPosition;
    };

    const repeatingValue = [
      'Value 1',
      'Value 2',
      'Value 3',
    ];

    render(
      <RepeatingInput
        name="rpt"
        subpath="schema_name"
        value={repeatingValue}
        onMoveInstance={handleMoveInstance}
      >
        <TextInput />
      </RepeatingInput>, this.container,
    );

    const moveButton = this.container.querySelectorAll('button[data-name="moveToTop"]')[1];

    Simulate.click(moveButton);

    moveInstancePath.should.deep.equal(['schema_name', 'rpt', '1']);
    moveInstanceNewPosition.should.equal(0);
  });

  context('when shift + down arrow is depressed in the move to top button', () => {
    let moveInstancePath;
    let moveInstanceNewPosition;

    beforeEach(function before() {
      moveInstancePath = null;
      moveInstanceNewPosition = null;

      const handleMoveInstance = (path, newPosition) => {
        moveInstancePath = path;
        moveInstanceNewPosition = newPosition;
      };

      const repeatingValue = [
        'Value 1',
        'Value 2',
        'Value 3',
      ];

      render(
        <RepeatingInput
          name="rpt"
          subpath="schema_name"
          value={repeatingValue}
          onMoveInstance={handleMoveInstance}
        >
          <TextInput />
        </RepeatingInput>, this.container,
      );
    });

    it('should call onMoveInstance, incrementing the position by one', function test() {
      const moveButton = this.container.querySelectorAll('button[data-name="moveToTop"]')[1];

      Simulate.keyDown(moveButton, {
        shiftKey: true,
        key: 'ArrowDown',
      });

      moveInstancePath.should.deep.equal(['schema_name', 'rpt', '1']);
      moveInstanceNewPosition.should.equal(2);
    });

    it('should wrap to position 0 if the next position is past the end of the list', function test() {
      const moveButton = this.container.querySelectorAll('button[data-name="moveToTop"]')[2];

      Simulate.keyDown(moveButton, {
        shiftKey: true,
        key: 'ArrowDown',
      });

      moveInstancePath.should.deep.equal(['schema_name', 'rpt', '2']);
      moveInstanceNewPosition.should.equal(0);
    });

    it('should not call onMoveInstance if down arrow is depressed without shift', function test() {
      const moveButton = this.container.querySelectorAll('button[data-name="moveToTop"]')[2];

      Simulate.keyDown(moveButton, {
        key: 'ArrowDown',
      });

      expect(moveInstancePath).to.equal(null);
    });
  });

  context('when shift + up arrow is depressed in the move to top button', () => {
    let moveInstancePath;
    let moveInstanceNewPosition;

    beforeEach(function before() {
      moveInstancePath = null;
      moveInstanceNewPosition = null;

      const handleMoveInstance = (path, newPosition) => {
        moveInstancePath = path;
        moveInstanceNewPosition = newPosition;
      };

      const repeatingValue = [
        'Value 1',
        'Value 2',
        'Value 3',
      ];

      render(
        <RepeatingInput
          name="rpt"
          subpath="schema_name"
          value={repeatingValue}
          onMoveInstance={handleMoveInstance}
        >
          <TextInput />
        </RepeatingInput>, this.container,
      );
    });

    it('should call onMoveInstance, incrementing the position by one', function test() {
      const moveButton = this.container.querySelectorAll('button[data-name="moveToTop"]')[1];

      Simulate.keyDown(moveButton, {
        shiftKey: true,
        key: 'ArrowUp',
      });

      moveInstancePath.should.deep.equal(['schema_name', 'rpt', '1']);
      moveInstanceNewPosition.should.equal(0);
    });

    it('should wrap to the last position if the next position is 0', function test() {
      const moveButton = this.container.querySelectorAll('button[data-name="moveToTop"]')[0];

      Simulate.keyDown(moveButton, {
        shiftKey: true,
        key: 'ArrowUp',
      });

      moveInstancePath.should.deep.equal(['schema_name', 'rpt', '0']);
      moveInstanceNewPosition.should.equal(2);
    });

    it('should not call onMoveInstance if up arrow is depressed without shift', function test() {
      const moveButton = this.container.querySelectorAll('button[data-name="moveToTop"]')[2];

      Simulate.keyDown(moveButton, {
        key: 'ArrowUp',
      });

      expect(moveInstancePath).to.equal(null);
    });
  });

  context('when shift + plus is depressed in the move to top button', () => {
    let addInstancePath;
    let addInstancePosition;

    beforeEach(function before() {
      addInstancePath = null;
      addInstancePosition = null;

      const handleAddInstance = (path, position) => {
        addInstancePath = path;
        addInstancePosition = position;
      };

      const repeatingValue = [
        'Value 1',
        'Value 2',
        'Value 3',
      ];

      render(
        <RepeatingInput
          name="rpt"
          subpath="schema_name"
          value={repeatingValue}
          onAddInstance={handleAddInstance}
        >
          <TextInput />
        </RepeatingInput>, this.container,
      );
    });

    it('should call onAddInstance, passing the next higher position', function test() {
      const moveButton = this.container.querySelectorAll('button[data-name="moveToTop"]')[1];

      Simulate.keyDown(moveButton, {
        shiftKey: true,
        key: '+',
      });

      addInstancePath.should.deep.equal(['schema_name', 'rpt']);
      addInstancePosition.should.equal(2);
    });

    it('should not call onAddInstance if up arrow is depressed without shift', function test() {
      const moveButton = this.container.querySelectorAll('button[data-name="moveToTop"]')[2];

      Simulate.keyDown(moveButton, {
        key: '+',
      });

      expect(addInstancePath).to.equal(null);
    });
  });

  context('when asText is true', () => {
    it('should render as a div', function test() {
      const repeatingValue = [
        'Value 1',
        'Value 2',
        'Value 3',
      ];

      render(
        <RepeatingInput value={repeatingValue} asText>
          <TextInput />
        </RepeatingInput>, this.container,
      );

      this.container.firstElementChild.nodeName.should.equal('DIV');
    });

    it('should not render any control buttons', function test() {
      const repeatingValue = [
        'Value 1',
        'Value 2',
        'Value 3',
      ];

      render(
        <RepeatingInput value={repeatingValue} asText>
          <TextInput />
        </RepeatingInput>, this.container,
      );

      this.container.querySelectorAll('.cspace-input-MiniButton--common').should.have.lengthOf(0);
    });

    it('should pass asText to children', function test() {
      const repeatingValue = [
        'Value 1',
        'Value 2',
        'Value 3',
      ];

      render(
        <RepeatingInput value={repeatingValue} asText>
          <TextInput />
        </RepeatingInput>, this.container,
      );

      this.container.querySelectorAll('input').should.have.lengthOf(0);
    });
  });
});
