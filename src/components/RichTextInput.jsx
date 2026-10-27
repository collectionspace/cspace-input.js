/* global window */

// eslint-disable-next-line max-classes-per-file
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactQuill, { Quill } from 'react-quill';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import '!style-loader!css-loader!react-quill/dist/quill.core.css';
import classNames from 'classnames';
import * as DOMPurify from 'dompurify';
import { getPath, pathPropType } from '../helpers/pathHelpers';
import styles from '../../styles/cspace-input/RichTextInput.css';
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import '!style-loader!css-loader!../../styles/react-quill/cspace.css';

const propTypes = {
  id: PropTypes.string.isRequired,
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
  formatToolbarButtonLabel: PropTypes.func,
};

const defaultProps = {
  embedded: undefined,
  multiline: undefined,
  name: undefined,
  parentPath: undefined,
  subpath: undefined,
  value: undefined,
  readOnly: undefined,
  onCommit: undefined,
  formatToolbarButtonLabel: (icon) => icon,
};

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

const sanitizeValue = (value) => DOMPurify.sanitize(value, { USE_PROFILES: { html: true } });

const preventButtonMouseDown = (event) => {
  if (event.target.nodeName === 'BUTTON') {
    // On mouseDown on a toolbar button, Firefox fires a blur event with null relatedTarget. This
    // would be fine, if relatedTarget were correctly set to the toolbar button. But since it's
    // null, the toolbar disappears. Prevent this.

    event.preventDefault();
  }
};

function CustomToolbar({ id, formatToolbarButtonLabel }) {
  return (
    <div id={id}>
      <button className="ql-bold" aria-label={formatToolbarButtonLabel('bold')} type="button" />
      <button className="ql-italic" aria-label={formatToolbarButtonLabel('italic')} type="button" />
      <button className="ql-underline" aria-label={formatToolbarButtonLabel('underline')} type="button" />
      <button className="ql-script" value="sub" aria-label={formatToolbarButtonLabel('subscript')} type="button" />
      <button className="ql-script" value="super" aria-label={formatToolbarButtonLabel('superscript')} type="button" />
      <button className="ql-clean" aria-label={formatToolbarButtonLabel('clean')} type="button" />
    </div>
  );
}

CustomToolbar.propTypes = {
  id: PropTypes.string.isRequired,
  formatToolbarButtonLabel: PropTypes.func.isRequired,
};

// Remove the tooltip as we don't rely on it for linking anything
// and it produces a11y warnings about empty links. If we do need
// it in the future, we'll probably create our own.
const SnowTheme = Quill.import('themes/snow');
class SnowMod extends SnowTheme {
  extendToolbar(toolbar) {
    super.extendToolbar(toolbar);
    this.tooltip.root.innerHTML = '';
  }
}
Quill.register('themes/snow', SnowMod);

export default class RichTextInput extends Component {
  constructor(props) {
    super(props);

    const {
      id,
      multiline,
      value,
    } = this.props;

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

              return !!multiline;
            },
          },

          // Don't allow tabs in the content, just do the browser default of focusing the next
          // field.

          tab: null,
        },
      },
      toolbar: {
        container: `#${id}`,
      },
    };

    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRef = this.handleRef.bind(this);

    this.state = {
      value: sanitizeValue(value),
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      value: sanitizeValue(nextProps.value),
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      embedded,
      multiline,
      readOnly,
      value,
    } = this.props;

    const {
      focused,
    } = this.state;

    return (
      nextProps.embedded !== embedded
      || nextProps.multiline !== multiline
      || nextProps.readOnly !== readOnly
      || nextProps.value !== value
      || nextState.focused !== focused
    );
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

  commit() {
    const {
      onCommit,
      value: prevValue,
    } = this.props;

    if (onCommit) {
      const {
        value,
      } = this.state;

      const nextValue = normalizeValue(value);

      if (nextValue !== prevValue) {
        onCommit(getPath(this.props), nextValue);
      }
    }
  }

  render() {
    const {
      id,
      embedded,
      multiline,
      readOnly,
      formatToolbarButtonLabel,
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
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        ref={this.handleRef}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onMouseDown={preventButtonMouseDown}
        className={className}
      >
        <CustomToolbar id={id} formatToolbarButtonLabel={formatToolbarButtonLabel} />
        <ReactQuill
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
RichTextInput.defaultProps = defaultProps;
