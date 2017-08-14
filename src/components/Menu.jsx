import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from '../../styles/cspace-input/Menu.css';
import itemStyles from '../../styles/cspace-input/MenuItem.css';

const propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
  })),
  tabIndex: PropTypes.string,
  renderItemLabel: PropTypes.func,
  value: PropTypes.string,
  onSelect: PropTypes.func,
  shouldTransferFocus: PropTypes.bool,
  notifyBeforeFocusWrap: PropTypes.func,
};

const defaultProps = {
  options: [],
  // Display a no break space if the label is blank, so height is preserved.
  renderItemLabel: label => (label || ' '),
  tabIndex: '0',
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
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleRef = this.handleRef.bind(this);
    this.handleSelectedItemRef = this.handleSelectedItemRef.bind(this);

    this.state = {
      focusedIndex: null,
      value: props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.focusedIndex !== this.state.focusedIndex && !this.isItemMouseDown) {
      this.scrollFocusedItemIntoView();
    }
  }

  scrollFocusedItemIntoView() {
    const {
      focusedIndex,
    } = this.state;

    if (focusedIndex !== null) {
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

        this.domNode.scrollTop = this.domNode.scrollTop + delta;
      } else if (focusedItemTop <= menuTop) {
        // Scroll the top of the item into view.

        const delta = Math.ceil(menuTop - focusedItemTop);

        this.domNode.scrollTop = this.domNode.scrollTop - delta;
      }
    }
  }

  focus() {
    if (this.domNode) {
      this.domNode.focus();
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

  handleKeyDown(event) {
    const {
      notifyBeforeFocusWrap,
    } = this.props;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      // Prevent the page from scrolling.
      event.preventDefault();

      let {
        focusedIndex,
      } = this.state;

      const {
        options,
        shouldTransferFocus,
      } = this.props;

      if (event.key === 'ArrowDown') {
        focusedIndex += 1;

        if (focusedIndex >= options.length) {
          if (shouldTransferFocus) {
            notifyBeforeFocusWrap();
            focusedIndex = null;
          } else {
            focusedIndex = 0;
          }
        }
      } else {
        focusedIndex -= 1;

        if (focusedIndex < 0) {
          focusedIndex = options.length - 1;
        }
      }

      this.setState({
        focusedIndex,
      });
    }
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.selectItem(this.state.focusedIndex);
    }
  }

  selectItem(index) {
    const selectedOption = this.props.options[index];
    const value = selectedOption.value;

    this.setState({
      value,
      focusedIndex: index,
    });

    const {
      onSelect,
    } = this.props;

    if (onSelect) {
      onSelect(selectedOption);
    }
  }

  renderItems() {
    const {
      focusedIndex,
      value,
    } = this.state;

    const {
      options,
      renderItemLabel,
    } = this.props;

    return options.map((option, index) => {
      const {
        value: optionValue,
        label: optionLabel,
        indent: optionIndent,
        startGroup: optionStartGroup,
      } = option;

      const className = classNames(optionIndent ? itemStyles[`indent${optionIndent}`] : null, {
        [itemStyles.common]: true,
        [itemStyles.startGroup]: !!optionStartGroup,
        [itemStyles.selected]: optionValue === value,
        [itemStyles.focused]: focusedIndex === index,
      });

      const ref = (optionValue === value)
        ? this.handleSelectedItemRef
        : null;

      // TODO: ARIA
      // https://www.w3.org/WAI/GL/wiki/index.php?title=Using_aria-activedescendant&oldid=2629

      return (
        /* eslint-disable jsx-a11y/no-static-element-interactions */
        <li
          className={className}
          data-index={index}
          key={index}
          ref={ref}
          role="option"
          onClick={this.handleItemClick}

          // Prevent flash of incorrectly focused item when clicking on an item in an unfocused
          // menu.
          onMouseDown={stopPropagation}

          // Track if the mouse is down on an item, using the capture phase so that the state
          // of the mouse may be updated before onFocus fires.
          onMouseDownCapture={this.handleItemMouseDownCapture}
        >
          {renderItemLabel(optionLabel)}
        </li>
        /* eslint-enable jsx-a11y/no-static-element-interactions */
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
      /* eslint-disable jsx-a11y/no-static-element-interactions */
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
      /* eslint-enable jsx-a11y/no-static-element-interactions */
    );
  }
}

Menu.propTypes = propTypes;
Menu.defaultProps = defaultProps;
