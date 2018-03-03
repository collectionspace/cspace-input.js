/* global window */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactQuill, { Quill } from 'react-quill';
import classNames from 'classnames';
import { getPath, pathPropType } from '../helpers/pathHelpers';
import styles from '../../styles/cspace-input/RichTextInput.css';
/* eslint-disable import/imports-first, import/no-unresolved */
import '!style-loader!css-loader!../../styles/quill/cspace.css';
import '!style-loader!css-loader!react-quill/dist/quill.core.css';
/* eslint-enable import/imports-first, import/no-unresolved */

// Change bold rendering to <b> instead of <strong>, since it is more semantically neutral.

const Bold = Quill.import('formats/bold');
Bold.tagName = 'B';
Quill.register(Bold, true);

// Change italic rendering to <i> instead of <em>, since it is more semantically neutral.

const Italic = Quill.import('formats/italic');
Italic.tagName = 'I';
Quill.register(Italic, true);

const normalizeValue = (value) => {
  let normalizedValue = value;

  if (normalizedValue) {
    // If there is only a single paragraph, remove the <p></p> wrapper.

    if (normalizedValue.indexOf('<p>', 1) < 0) {
      normalizedValue = normalizedValue.replace(/^<p>|<\/p>$/g, '');
    }

    // If content is '<br>', set it to empty. Quill uses this as a placeholder.

    if (normalizedValue === '<br>') {
      normalizedValue = '';
    }
  }

  return normalizedValue;
};

const preventButtonMouseDown = (event) => {
  if (event.target.nodeName === 'BUTTON') {
    // On mouseDown on a toolbar button, Firefox fires a blur event with null relatedTarget. This
    // would be fine, if relatedTarget were correctly set to the toolbar button. But since it's
    // null, the toolbar disappears. Prevent this.

    event.preventDefault();
  }
};

const propTypes = {
  embedded: PropTypes.bool,
  multiline: PropTypes.bool,
  /* eslint-disable react/no-unused-prop-types */
  name: PropTypes.string,
  parentPath: pathPropType,
  subpath: pathPropType,
  /* eslint-enable react/no-unused-prop-types */
  value: PropTypes.string,
  readOnly: PropTypes.bool,
  onCommit: PropTypes.func,
};

export default class RichTextInput extends Component {
  constructor(props) {
    super(props);

    // Set the allowed formats.
    // TODO: Make this a prop.
    // TODO: Add paragraph formatting (e.g. lists) when multiline is true?

    this.formats = ['bold', 'italic', 'underline', 'script'];

    // Configure the toolbar buttons.
    // TODO: Make this a prop.

    this.modules = {
      keyboard: {
        bindings: {
          // Only allow newlines in content if multiline prop is true.

          enter: {
            key: 13,
            handler: () => {
              this.commit();

              return !!this.props.multiline;
            },
          },

          // Don't allow tabs in the content, just do the browser default of focusing the next
          // field.

          tab: null,
        },
      },
      toolbar: ['bold', 'italic', 'underline', { script: 'sub' }, { script: 'super' }, 'clean'],
    };

    // TODO: Make a custom HTML toolbar for accessibility:
    // https://github.com/zenoamaro/react-quill#html-toolbar

    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRef = this.handleRef.bind(this);

    this.state = {
      value: this.props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      embedded,
      multiline,
      readOnly,
      value,
    } = this.props;

    return (
      nextProps.embedded !== embedded ||
      nextProps.multiline !== multiline ||
      nextProps.readOnly !== readOnly ||
      nextProps.value !== value ||
      nextState.focused !== this.state.focused
    );
  }

  commit() {
    const {
      onCommit,
      value: prevValue,
    } = this.props;

    if (onCommit) {
      const value = normalizeValue(this.state.value);

      if (value !== prevValue) {
        onCommit(getPath(this.props), value);
      }
    }
  }

  handleBlur(event) {
    if (!this.domNode.contains(event.relatedTarget)) {
      window.setTimeout(() => {
        this.setState({
          focused: false,
        });

        this.commit();
      }, 0);
    }
  }

  handleChange(value) {
    this.setState({
      value,
    });
  }

  handleFocus(event) {
    if (this.domNode && !this.domNode.contains(event.relatedTarget)) {
      this.setState({
        focused: true,
      });
    }
  }

  handleRef(ref) {
    this.domNode = ref;
  }

  render() {
    const {
      embedded,
      multiline,
      readOnly,
    } = this.props;

    const {
      focused,
      value,
    } = this.state;

    const normalizedValue = value || '';

    const className = classNames({
      [styles.embedded]: embedded,
      [styles.normal]: !embedded,
      [styles.enabled]: !readOnly,
      [styles.multiline]: multiline,
      [styles.focus]: focused,
    });

    // The react-quill onBlur event is unreliable, so the wrapper div here is used to do our own
    // implementation.
    // https://github.com/zenoamaro/react-quill/issues/286
    // https://github.com/zenoamaro/react-quill/issues/276

    return (
      <div
        ref={this.handleRef}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onMouseDown={preventButtonMouseDown}
      >
        <ReactQuill
          className={className}
          formats={this.formats}
          modules={this.modules}
          readOnly={readOnly}
          theme="snow"
          value={normalizedValue}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

RichTextInput.propTypes = propTypes;
