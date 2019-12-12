import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Popup from 'cspace-layout/lib/components/Popup';
import classNames from 'classnames';
import TextInput from './TextInput';
import styles from '../../styles/cspace-input/DropdownInput.css';

const propTypes = {
  // TODO: Stop using propTypes in isInput, and in render method of cspace-ui Field component.
  // Until then, propTypes need to be hoisted from the base component.
  // eslint-disable-next-line react/forbid-foreign-prop-types
  ...TextInput.propTypes,
  children: PropTypes.node,
  className: PropTypes.string,
  embedded: PropTypes.bool,
  open: PropTypes.bool,
  openOnFocus: PropTypes.bool,
  openOnMouseDown: PropTypes.bool,
  isOpenableWhenReadOnly: PropTypes.bool,
  api: PropTypes.func,
  /*
   * A function that may be called to give focus to the contents of the popup. This is supplied as
   * a prop because DropdownInput does not know the contents of the popup. Only the caller knows
   * which element in the popup should receive focus.
   */
  focusPopup: PropTypes.func,

  onBlur: PropTypes.func,
  onBeforeClose: PropTypes.func,
  onClose: PropTypes.func,
  onKeyDown: PropTypes.func,
  onMount: PropTypes.func,
  onOpen: PropTypes.func,
};

const defaultProps = {
  children: undefined,
  className: undefined,
  embedded: undefined,
  open: undefined,
  openOnFocus: undefined,
  openOnMouseDown: true,
  isOpenableWhenReadOnly: undefined,
  api: undefined,
  focusPopup: undefined,
  onBlur: undefined,
  onBeforeClose: undefined,
  onClose: undefined,
  onKeyDown: undefined,
  onMount: undefined,
  onOpen: undefined,
};

export default class DropdownInput extends Component {
  constructor(props) {
    super(props);

    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputMouseDown = this.handleInputMouseDown.bind(this);
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
    this.handlePopupBlur = this.handlePopupBlur.bind(this);
    this.handlePopupKeyDown = this.handlePopupKeyDown.bind(this);
    this.handlePopupMount = this.handlePopupMount.bind(this);
    this.handleRef = this.handleRef.bind(this);

    this.state = {
      open: props.open,
    };
  }

  componentDidMount() {
    const {
      api,
      onMount,
    } = this.props;

    if (api) {
      api({
        close: this.close.bind(this),
      });
    }

    if (onMount) {
      onMount({
        focusInput: this.focusInput.bind(this),
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open) {
      this.open();
    } else {
      this.asyncClose();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      open: prevOpen,
    } = prevState;

    const {
      open,
    } = this.state;

    if (prevOpen && !open) {
      const {
        onClose,
      } = this.props;

      if (onClose) {
        onClose();
      }
    } else if (!prevOpen && open) {
      const {
        onOpen,
      } = this.props;

      if (onOpen) {
        onOpen();
      }
    }
  }

  close(isCancelled) {
    const {
      open,
    } = this.state;

    if (open) {
      const {
        onBeforeClose,
      } = this.props;

      if (onBeforeClose) {
        onBeforeClose(isCancelled);
      }

      this.setState({
        open: false,
      });
    }
  }

  asyncClose(isCancelled) {
    setTimeout(() => {
      this.close(isCancelled);
    }, 0);
  }

  open() {
    const {
      open,
    } = this.state;

    if (!open) {
      this.setState({
        open: true,
      });
    }
  }

  focusInput() {
    // FIXME: This breaks the TextInput component abstraction by selecting the rendered DOM node
    // directly and calling focus() on it. But fixing this would require saving a ref to the
    // TextInput; making TextInput a class instead of a function; and adding a focus() method to
    // that class, which could be called here. LineInput and MultilineInput would also need to
    // become classes instead of functions, each with their own focus() method, in order to
    // properly implement TextInput.focus(). This seems like overkill at the moment.

    this.domNode.querySelector('input, textarea').focus();
  }

  focusPopup() {
    const {
      focusPopup,
    } = this.props;

    if (focusPopup) {
      focusPopup();
    }
  }

  handleInputBlur(event) {
    const {
      onBlur,
    } = this.props;

    if (onBlur) {
      onBlur(event);
    }

    if (!this.domNode.contains(event.relatedTarget)) {
      this.asyncClose();
    }
  }

  handleInputFocus() {
    const {
      openOnFocus,
    } = this.props;

    if (openOnFocus) {
      this.open();
    }
  }

  handleInputMouseDown() {
    const {
      openOnMouseDown,
    } = this.props;

    if (openOnMouseDown) {
      this.open();
    }
  }

  handleInputKeyDown(event) {
    const {
      onKeyDown,
    } = this.props;

    if (event.key === 'ArrowDown') {
      const {
        open,
      } = this.state;

      // Prevent the page from scrolling.
      event.preventDefault();

      if (open) {
        this.focusPopup();
      } else {
        this.open();
        this.focusPopupNeeded = true;
      }
    } else if (event.key === 'Escape') {
      this.asyncClose(true);
    }

    if (onKeyDown) {
      onKeyDown(event);
    }
  }

  handlePopupBlur(event) {
    if (!this.domNode.contains(event.relatedTarget)) {
      this.asyncClose();
    }
  }

  handlePopupKeyDown(event) {
    if (event.key === 'Escape') {
      this.asyncClose();
      this.focusInput();
    }
  }

  handlePopupMount() {
    if (this.focusPopupNeeded) {
      this.focusPopup();
      this.focusPopupNeeded = false;
    }
  }

  handleRef(ref) {
    this.domNode = ref;
  }

  renderInput() {
    const {
      children,
      className,
      focusPopup,
      isOpenableWhenReadOnly,
      openOnFocus,
      openOnMouseDown,
      onBeforeClose,
      onClose,
      onKeyDown,
      onMount,
      onOpen,
      ...remainingProps
    } = this.props;

    return (
      <TextInput
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...remainingProps}
        onBlur={this.handleInputBlur}
        onFocus={this.handleInputFocus}
        onKeyDown={this.handleInputKeyDown}
        onMouseDown={this.handleInputMouseDown}
      />
    );
  }

  renderDropdown() {
    const {
      open,
    } = this.state;

    const {
      children,
    } = this.props;

    if (open) {
      return (
        <Popup
          onBlur={this.handlePopupBlur}
          onKeyDown={this.handlePopupKeyDown}
          onMount={this.handlePopupMount}
        >
          {children}
        </Popup>
      );
    }

    return null;
  }

  render() {
    const {
      open,
    } = this.state;

    const {
      className,
      embedded,
      readOnly,
      isOpenableWhenReadOnly,
    } = this.props;

    const classes = classNames(className, {
      [styles.normal]: !embedded,
      [styles.embedded]: embedded,
      [styles.open]: open,
    });

    let readOnlyProps;

    if (readOnly && isOpenableWhenReadOnly) {
      readOnlyProps = {
        tabIndex: 0,
        onBlur: this.handleInputBlur,
        onFocus: this.handleInputFocus,
        onKeyDown: this.handleInputKeyDown,
        onMouseDown: this.handleInputMouseDown,
      };
    }

    return (
      <div
        ref={this.handleRef}
        className={classes}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...readOnlyProps}
      >
        {this.renderInput()}
        {this.renderDropdown()}
      </div>
    );
  }
}

DropdownInput.propTypes = propTypes;
DropdownInput.defaultProps = defaultProps;
