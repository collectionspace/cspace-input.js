import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from '../../styles/cspace-input/Menu.css';
import itemStyles from '../../styles/cspace-input/MenuItem.css';

const propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    disabled: PropTypes.bool,
    value: PropTypes.string,
  })),
  tabIndex: PropTypes.string,
  renderItemLabel: PropTypes.func,
  value: PropTypes.string,
  ignoreDisabledOptions: PropTypes.bool,
  onSelect: PropTypes.func,
  onBeforeItemFocusChange: PropTypes.func,
  onItemMouseEnter: PropTypes.func,
  onItemMouseLeave: PropTypes.func,
};

const defaultProps = {
  options: [],
  tabIndex: '0',
  // Display a no break space if the label is blank, so height is preserved.
  renderItemLabel: (label) => (label || ' '),
  value: undefined,
  ignoreDisabledOptions: undefined,
  onSelect: undefined,
  onBeforeItemFocusChange: undefined,
  onItemMouseEnter: undefined,
  onItemMouseLeave: undefined,
};

const stopPropagation = (event) => {
  event.stopPropagation();
};

export default class Menu extends Component {
  constructor(props) {
    super(props);

    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleItemMouseDownCapture = this.handleItemMouseDownCapture.bind(this);
    this.handleItemMouseEnter = this.handleItemMouseEnter.bind(this);
    this.handleItemMouseLeave = this.handleItemMouseLeave.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleRef = this.handleRef.bind(this);
    this.handleSelectedItemRef = this.handleSelectedItemRef.bind(this);

    this.state = {
      focusedIndex: null,
      value: props.value,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      focusedIndex: prevFocusedIndex,
    } = prevState;

    const {
      focusedIndex,
    } = this.state;

    if (prevFocusedIndex !== focusedIndex && !this.isItemMouseDown) {
      this.scrollFocusedItemIntoView();
    }
  }

  handleBlur() {
    this.setState({
      focusedIndex: null,
    });
  }

  handleFocus() {
    this.setState({
      focusedIndex: this.selectedIndex || 0,
    });
  }

  handleItemClick(event) {
    const index = parseInt(event.currentTarget.dataset.index, 10);

    this.isItemMouseDown = false;
    this.selectItem(index);
  }

  handleItemMouseDownCapture() {
    this.isItemMouseDown = true;
  }

  handleItemMouseEnter(event) {
    const {
      options,
      onItemMouseEnter,
    } = this.props;

    if (onItemMouseEnter) {
      const index = parseInt(event.target.dataset.index, 10);
      const option = options[index];

      onItemMouseEnter(option.value, event.target, event.relatedTarget);
    }
  }

  handleItemMouseLeave(event) {
    const {
      options,
      onItemMouseLeave,
    } = this.props;

    if (onItemMouseLeave) {
      const index = parseInt(event.target.dataset.index, 10);
      const option = options[index];

      onItemMouseLeave(option.value, event.target, event.relatedTarget);
    }
  }

  handleKeyDown(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      // Prevent the page from scrolling.
      event.preventDefault();

      let {
        focusedIndex,
      } = this.state;

      const {
        options,
        onBeforeItemFocusChange,
      } = this.props;

      let nextFocusedIndex = focusedIndex;

      if (event.key === 'ArrowDown') {
        nextFocusedIndex += 1;

        if (nextFocusedIndex >= options.length) {
          nextFocusedIndex = 0;
        }
        if (onBeforeItemFocusChange) {
          focusedIndex = onBeforeItemFocusChange(focusedIndex, nextFocusedIndex, event.key);
        } else {
          focusedIndex = nextFocusedIndex;
        }
      } else {
        nextFocusedIndex -= 1;

        if (nextFocusedIndex < 0) {
          nextFocusedIndex = options.length - 1;
        }

        if (onBeforeItemFocusChange) {
          focusedIndex = onBeforeItemFocusChange(focusedIndex, nextFocusedIndex, event.key);
        } else {
          focusedIndex = nextFocusedIndex;
        }
      }
      this.setState({
        focusedIndex,
      });
    }
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      const {
        focusedIndex,
      } = this.state;

      this.selectItem(focusedIndex);
    }
  }

  handleRef(ref) {
    this.domNode = ref;
  }

  handleSelectedItemRef(ref) {
    this.selectedIndex = (ref === null)
      ? null
      : parseInt(ref.dataset.index, 10);
  }

  focus(itemIndex) {
    if (typeof itemIndex === 'number') {
      const {
        options,
      } = this.props;

      this.selectedIndex = (itemIndex >= 0) ? itemIndex : options.length + itemIndex;
    }

    if (this.domNode) {
      this.domNode.focus();
    }
  }

  scrollFocusedItemIntoView() {
    const {
      focusedIndex,
    } = this.state;

    if (focusedIndex !== null && this.domNode) {
      const focusedItem = this.domNode.querySelector(`li:nth-of-type(${focusedIndex + 1})`);

      const focusedItemRect = focusedItem.getBoundingClientRect();
      const focusedItemTop = focusedItemRect.top;
      const focusedItemBottom = focusedItemRect.bottom;

      const menuRect = this.domNode.getBoundingClientRect();
      const menuTop = menuRect.top;
      const menuBottom = menuRect.bottom;

      if (focusedItemBottom >= menuBottom) {
        // Scroll the bottom of the item into view.

        const delta = Math.ceil(focusedItemBottom - menuBottom);

        this.domNode.scrollTop += delta;
      } else if (focusedItemTop <= menuTop) {
        // Scroll the top of the item into view.

        const delta = Math.ceil(menuTop - focusedItemTop);

        this.domNode.scrollTop -= delta;
      }
    }
  }

  selectItem(index) {
    const {
      ignoreDisabledOptions,
      options,
      onSelect,
    } = this.props;

    const option = options[index];

    const {
      disabled,
      value,
    } = option;

    if (ignoreDisabledOptions || !disabled) {
      this.setState({
        value,
        focusedIndex: index,
      });

      if (onSelect) {
        onSelect(option);
      }
    }
  }

  renderItems() {
    const {
      focusedIndex,
      value,
    } = this.state;

    const {
      ignoreDisabledOptions,
      options,
      renderItemLabel,
    } = this.props;

    return options.map((option, index) => {
      const {
        value: optionValue,
        label: optionLabel,
        className: optionClassName,
        disabled: optionDisabled,
        indent: optionIndent,
        startGroup: optionStartGroup,
      } = option;

      const className = classNames(optionIndent ? itemStyles[`indent${optionIndent}`] : null, {
        [itemStyles.common]: true,
        [itemStyles.startGroup]: !!optionStartGroup,
        [itemStyles.disabled]: optionDisabled && !ignoreDisabledOptions,
        [itemStyles.selected]: optionValue === value,
        [itemStyles.focused]: focusedIndex === index,
        [optionClassName]: true,
      });

      const selected = (optionValue === value);

      const ref = selected
        ? this.handleSelectedItemRef
        : null;

      // TODO: ARIA
      // https://www.w3.org/WAI/GL/wiki/index.php?title=Using_aria-activedescendant&oldid=2629

      return (
        // The keyboard handlers are attached to the parent (<ul>), not to the <li>.
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <li
          aria-selected={selected}
          className={className}
          data-index={index}
          key={optionValue}
          ref={ref}
          role="option"
          onClick={this.handleItemClick}
          // Prevent flash of incorrectly focused item when clicking on an item in an unfocused
          // menu.
          onMouseDown={stopPropagation}
          // Track if the mouse is down on an item, using the capture phase so that the state
          // of the mouse may be updated before onFocus fires.
          onMouseDownCapture={this.handleItemMouseDownCapture}
          onMouseEnter={this.handleItemMouseEnter}
          onMouseLeave={this.handleItemMouseLeave}
        >
          {renderItemLabel(optionLabel)}
        </li>
      );
    });
  }

  render() {
    const {
      tabIndex,
    } = this.props;

    const items = this.renderItems();

    if (items.length === 0) {
      return null;
    }

    // TODO: ARIA
    // https://www.w3.org/WAI/GL/wiki/index.php?title=Using_aria-activedescendant&oldid=2629

    return (
      <ul
        className={styles.common}
        ref={this.handleRef}
        role="listbox"
        tabIndex={tabIndex}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onKeyDown={this.handleKeyDown}
        onKeyPress={this.handleKeyPress}
      >
        {items}
      </ul>
    );
  }
}

Menu.propTypes = propTypes;
Menu.defaultProps = defaultProps;
