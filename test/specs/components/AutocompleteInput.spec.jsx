import React from 'react';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { createRenderer } from 'react-test-renderer/shallow';
import Immutable from 'immutable';
import FilteringDropdownMenuInput from '../../../src/components/FilteringDropdownMenuInput';
import AutocompleteInput from '../../../src/components/AutocompleteInput';
import createTestContainer from '../../helpers/createTestContainer';

const expect = chai.expect;

chai.should();

const recordTypes = {
  person: {
    vocabularies: {
      local: {
        messages: {
          name: {
            id: 'vocab.person.local.name',
            defaultMessage: 'Local',
          },
          collectionName: {
            id: 'vocab.person.local.collectionName',
            defaultMessage: 'Local Persons',
          },
        },
      },
      ulan: {
        messages: {
          name: {
            id: 'vocab.person.ulan.name',
            defaultMessage: 'ULAN',
          },
          collectionName: {
            id: 'vocab.person.ulan.collectionName',
            defaultMessage: 'ULAN Persons',
          },
        },
      },
    },
  },
};

const janMatches = Immutable.Map().setIn(['jan', 'person', 'local', 'items'], [
  {
    refName: 'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(JaneDoe)\'Jane Doe\'',
    uri: '/personauthorities/fbe3019a-f8d4-4f84-a900/items/7fc7c8ca-8ca0-4a29-8e2e',
  },
]);

const johMatches = Immutable.Map().setIn(['joh', 'person', 'local', 'items'], [
  {
    refName: 'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(JohnDoe)\'John Doe\'',
    uri: '/personauthorities/fbe3019a-f8d4-4f84-a900/items/7fc7c8ca-8ca0-4a29-8e2e',
  },
]);

const samMatches = Immutable.Map().setIn(['sam', 'person', 'local', 'items'], [
  {
    refName: 'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(SamuelSmith)\'Samuel Smith\'',
    uri: '/personauthorities/fbe3019a-f8d4-4f84-a901/items/7fc7c8ca-8ca0-4a29-8e2d',
  },
  {
    refName: 'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(SamanthaSmith)\'Samantha Smith\'',
    uri: '/personauthorities/fbe3019a-f8d4-4f84-a902/items/7fc7c8ca-8ca0-4a29-8e2f',
  },
]);

const newTermMatches = Immutable.fromJS({
  'John Doe': {
    person: {
      local: {
        newTerm: {
          document: {
            'ns2:collectionspace_core': {
              refName: 'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(JohnDoe)\'John Doe\'',
              uri: '/personauthorities/fbe3019a-f8d4-4f84-a900/items/7fc7c8ca-8ca0-4a29-8e2e',
            },
          },
        },
      },
    },
  },
});

describe('AutocompleteInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should render as a FilteringDropdownMenuInput', function test() {
    const shallowRenderer = createRenderer();

    shallowRenderer.render(<AutocompleteInput source="" />, context);

    const result = shallowRenderer.getRenderOutput();

    result.type.should.equal(FilteringDropdownMenuInput);
  });

  it('should show the display name of the ref name value', function test() {
    const value = 'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(JaneDoe)\'Jane Doe\'';

    render(
      <AutocompleteInput
        source="person/local"
        value={value}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('Jane Doe');
  });

  it('should show a continue typing prompt if the value is changed to something shorter than the min length', function test() {
    render(
      <AutocompleteInput
        source="person/local"
        recordTypes={recordTypes}
      />, this.container);

    const input = this.container.querySelector('input');

    let menuHeader;

    Simulate.change(input);

    menuHeader = this.container.querySelector('.cspace-layout-Popup--common > header');
    menuHeader.textContent.should.match(/^Continue typing/);

    input.value = '1';

    Simulate.change(input);

    menuHeader = this.container.querySelector('.cspace-layout-Popup--common > header');
    menuHeader.textContent.should.match(/^Continue typing/);

    input.value = '12';

    Simulate.change(input);

    menuHeader = this.container.querySelector('.cspace-layout-Popup--common > header');
    menuHeader.textContent.should.match(/^Continue typing/);

    input.value = '12';

    Simulate.change(input);

    menuHeader = this.container.querySelector('.cspace-layout-Popup--common > header');
    menuHeader.textContent.should.match(/^Continue typing/);

    input.value = '123';

    Simulate.change(input);

    menuHeader = this.container.querySelector('.cspace-layout-Popup--common > header');
    menuHeader.textContent.should.match(/^No matching terms/);
  });

  it('should show a quick add menu when the minimum number of characters is entered', function test() {
    render(
      <AutocompleteInput
        source="person/local"
        recordTypes={recordTypes}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value = '123';

    Simulate.change(input);

    const quickAdd = this.container.querySelector('.cspace-input-QuickAdd--common');

    quickAdd.should.not.equal(null);
  });

  it('should not show the quick add menu when showQuickAdd is false', function test() {
    render(
      <AutocompleteInput
        source="person/local"
        recordTypes={recordTypes}
        showQuickAdd={false}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value = '123';

    Simulate.change(input);

    const quickAdd = this.container.querySelector('.cspace-input-QuickAdd--common');

    expect(quickAdd).to.equal(null);
  });

  it('should show options when a partial term is entered that has items in matches', function test() {
    render(
      <AutocompleteInput
        source="person/local"
        matches={johMatches}
        recordTypes={recordTypes}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value = 'joh';

    Simulate.change(input);

    const menu = this.container.querySelector('.cspace-input-Menu--common');
    const items = menu.querySelectorAll('li');

    items.length.should.equal(1);
    items[0].textContent.should.equal('John Doe');
  });

  it('should call findMatchingTerms when a partial term is entered that does not exist in matches', function test() {
    let partialTerm = null;

    const findMatchingTerms = (partialTermArg) => {
      partialTerm = partialTermArg;
    };

    render(
      <AutocompleteInput
        source="person/local"
        recordTypes={recordTypes}
        findMatchingTerms={findMatchingTerms}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value = 'abc';

    Simulate.change(input);

    partialTerm.should.equal('abc');
  });

  it('should call onCommit when a value is committed', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (pathArg, valueArg) => {
      committedPath = pathArg;
      committedValue = valueArg;
    };

    render(
      <AutocompleteInput
        parentPath={['collectionobjects_common']}
        name="owner"
        source="person/local"
        matches={johMatches}
        recordTypes={recordTypes}
        onCommit={handleCommit}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value = 'joh';

    Simulate.change(input);

    const menu = this.container.querySelector('.cspace-input-Menu--common');
    const items = menu.querySelectorAll('li');

    Simulate.click(items[0]);

    committedPath.should.deep.equal(['collectionobjects_common', 'owner']);
    committedValue.should.equal('urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(JohnDoe)\'John Doe\'');
  });

  it('should call onCommit when a new term has been created', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (pathArg, valueArg) => {
      committedPath = pathArg;
      committedValue = valueArg;
    };

    render(
      <AutocompleteInput
        parentPath={['collectionobjects_common']}
        name="owner"
        source="person/local"
        matches={johMatches}
        recordTypes={recordTypes}
        onCommit={handleCommit}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value = 'John Doe';

    Simulate.change(input);

    render(
      <AutocompleteInput
        parentPath={['collectionobjects_common']}
        name="owner"
        source="person/local"
        matches={newTermMatches}
        recordTypes={recordTypes}
        onCommit={handleCommit}
      />, this.container);

    committedPath.should.deep.equal(['collectionobjects_common', 'owner']);
    committedValue.should.equal('urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(JohnDoe)\'John Doe\'');
  });

  it('should update options when new matches are supplied', function test() {
    render(
      <AutocompleteInput
        parentPath={['collectionobjects_common']}
        name="owner"
        source="person/local"
        matches={johMatches}
        recordTypes={recordTypes}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value = 'jan';

    Simulate.change(input);

    render(
      <AutocompleteInput
        parentPath={['collectionobjects_common']}
        name="owner"
        source="person/local"
        matches={janMatches}
        recordTypes={recordTypes}
      />, this.container);

    const menu = this.container.querySelector('.cspace-input-Menu--common');
    const items = menu.querySelectorAll('li');

    items.length.should.equal(1);
    items[0].textContent.should.equal('Jane Doe');
  });

  it('should render a ReadOnlyInput if readOnly is true', function test() {
    const value = 'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(DavidBowie1489220916785)\'David Bowie\'';

    render(
      <AutocompleteInput
        value={value}
        readOnly
      />, this.container);

    const input = this.container.firstElementChild;

    input.className.should.contain('cspace-input-ReadOnlyInput--common');
    input.textContent.should.equal('David Bowie');
  });

  it('should update options when new matches are supplied', function test() {
    render(
      <AutocompleteInput
        parentPath={['collectionobjects_common']}
        name="owner"
        source="person/local,person/ulan"
        matches={samMatches}
        recordTypes={recordTypes}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value = 'sam';

    Simulate.change(input);

    render(
      <AutocompleteInput
        parentPath={['collectionobjects_common']}
        name="owner"
        source="person/local,person/ulan"
        matches={samMatches}
        recordTypes={recordTypes}
      />, this.container);
  });

  it('should focus the first item in the match menu when matches are present', function test() {
    render(
      <AutocompleteInput
        parentPath={['collectionobjects_common']}
        name="owner"
        source="person/local,person/ulan"
        matches={samMatches}
        recordTypes={recordTypes}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value = 'sam';

    Simulate.change(input);
    Simulate.keyDown(input, { key: 'ArrowDown' });

    const menu = this.container.querySelector('.cspace-input-Menu--common');

    // Need to simulate focus here, since items don't get focused until the menu is focused.
    Simulate.focus(menu);

    const item = menu.querySelector('li');

    item.className.should.contain('cspace-input-MenuItem--focused');
  });

  it('should focus the first item in the add menu when matches are not present', function test() {
    render(
      <AutocompleteInput
        parentPath={['collectionobjects_common']}
        name="owner"
        source="person/local,person/ulan"
        recordTypes={recordTypes}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value = 'sam';

    Simulate.change(input);
    Simulate.keyDown(input, { key: 'ArrowDown' });

    const menu = this.container.querySelector('.cspace-input-QuickAdd--common .cspace-input-Menu--common');

    // Need to simulate focus here, since items don't get focused until the menu is focused.
    Simulate.focus(menu);

    const item = menu.querySelector('li');

    item.className.should.contain('cspace-input-MenuItem--focused');
  });

  it('should transfer focus the last item in the add menu when up arrow is depressed on first item in the match menu', function test() {
    render(
      <AutocompleteInput
        parentPath={['collectionobjects_common']}
        name="owner"
        source="person/local,person/ulan"
        recordTypes={recordTypes}
        matches={samMatches}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value = 'sam';

    Simulate.change(input);
    Simulate.keyDown(input, { key: 'ArrowDown' });

    const dropdownMenu = this.container.querySelector('.cspace-input-Menu--common');

    Simulate.keyDown(dropdownMenu, { key: 'ArrowUp' });

    const menu = this.container.querySelector('.cspace-input-QuickAdd--common .cspace-input-Menu--common');

    // Need to simulate focus here, since items don't get focused until the menu is focused.
    Simulate.focus(menu);

    const items = menu.querySelectorAll('li');
    const focusItem = items[items.length - 1];

    focusItem.className.should.contain('cspace-input-MenuItem--focused');
  });

  it('should transfer focus to the first item in the add menu when down arrow is depressed on the last item in the match menu', function test() {
    render(
      <AutocompleteInput
        parentPath={['collectionobjects_common']}
        name="owner"
        source="person/local,person/ulan"
        recordTypes={recordTypes}
        matches={samMatches}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value = 'sam';

    Simulate.change(input);
    Simulate.keyDown(input, { key: 'ArrowDown' });

    const dropdownMenu = this.container.querySelector('.cspace-input-Menu--common');

    Simulate.keyDown(dropdownMenu, { key: 'ArrowDown' });
    Simulate.keyDown(dropdownMenu, { key: 'ArrowDown' });

    const menu = this.container.querySelector('.cspace-input-QuickAdd--common .cspace-input-Menu--common');

    // Need to simulate focus here, since items don't get focused until the menu is focused.
    Simulate.focus(menu);

    const items = menu.querySelectorAll('li');
    const focusItem = items[0];

    focusItem.className.should.contain('cspace-input-MenuItem--focused');
  });

  it('should transfer focus the last item in the match menu when up arrow is depressed on first item in the add menu', function test() {
    render(
      <AutocompleteInput
        parentPath={['collectionobjects_common']}
        name="owner"
        source="person/local,person/ulan"
        recordTypes={recordTypes}
        matches={samMatches}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value = 'sam';

    Simulate.change(input);
    Simulate.keyDown(input, { key: 'ArrowDown' });

    const addMenu = this.container.querySelector('.cspace-input-QuickAdd--common .cspace-input-Menu--common');

    Simulate.keyDown(addMenu, { key: 'ArrowUp' });

    const menu = this.container.querySelector('.cspace-input-Menu--common');

    // Need to simulate focus here, since items don't get focused until the menu is focused.
    Simulate.focus(menu);

    const items = menu.querySelectorAll('li');
    const focusItem = items[items.length - 1];

    focusItem.className.should.contain('cspace-input-MenuItem--focused');
  });

  it('should transfer focus to the first item in the match menu when down arrow is depressed on the last item in the add menu', function test() {
    render(
      <AutocompleteInput
        parentPath={['collectionobjects_common']}
        name="owner"
        source="person/local,person/ulan"
        recordTypes={recordTypes}
        matches={samMatches}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value = 'sam';

    Simulate.change(input);
    Simulate.keyDown(input, { key: 'ArrowDown' });

    const addMenu = this.container.querySelector('.cspace-input-QuickAdd--common .cspace-input-Menu--common');

    Simulate.keyDown(addMenu, { key: 'ArrowDown' });
    Simulate.keyDown(addMenu, { key: 'ArrowDown' });

    const menu = this.container.querySelector('.cspace-input-Menu--common');

    // Need to simulate focus here, since items don't get focused until the menu is focused.
    Simulate.focus(menu);

    const items = menu.querySelectorAll('li');
    const focusItem = items[0];

    focusItem.className.should.contain('cspace-input-MenuItem--focused');
  });
});
