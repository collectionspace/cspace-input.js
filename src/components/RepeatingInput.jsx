import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import get from 'lodash/get';
import MiniButton from './MiniButton';
import normalizeLabel from '../helpers/normalizeLabel';
import { getPath, pathPropType } from '../helpers/pathHelpers';
import miniButtonContainerStyles from '../../styles/cspace-input/MiniButtonContainer.css';
import moveToTopButtonStyles from '../../styles/cspace-input/MoveToTopButton.css';
import styles from '../../styles/cspace-input/RepeatingInput.css';

const normalizeValue = (value) => {
  const defaultValue = [undefined];

  if (!value) {
    return defaultValue;
  }

  let normalized;

  if (Array.isArray(value)) {
    normalized = value;
  } else if (Immutable.List.isList(value)) {
    normalized = value.toArray();
  } else {
    normalized = [value];
  }

  if (normalized.length === 0) {
    return defaultValue;
  }

  return normalized;
};

const renderHeader = label => label;

const propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
  parentPath: pathPropType, // eslint-disable-line react/no-unused-prop-types
  subpath: pathPropType,    // eslint-disable-line react/no-unused-prop-types
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.instanceOf(Immutable.List),
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ])),
  ]),
  readOnly: PropTypes.bool,
  asText: PropTypes.bool,
  reorderable: PropTypes.bool,
  disableRemoveButton: PropTypes.func,
  renderOrderIndicator: PropTypes.func,
  onAddInstance: PropTypes.func,
  onCommit: PropTypes.func,
  onMoveInstance: PropTypes.func,
  onRemoveInstance: PropTypes.func,
};

const defaultProps = {
  reorderable: true,
};

export default class RepeatingInput extends Component {
  constructor(props) {
    super(props);

    this.handleInstanceCommit = this.handleInstanceCommit.bind(this);
    this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
    this.handleMoveToTopButtonClick = this.handleMoveToTopButtonClick.bind(this);
    this.handleMoveToTopButtonKeyDown = this.handleMoveToTopButtonKeyDown.bind(this);
    this.handleInstancesContainerRef = this.handleInstancesContainerRef.bind(this);
    this.handleRemoveButtonClick = this.handleRemoveButtonClick.bind(this);
  }

  getLabel() {
    const {
      children,
    } = this.props;

    const template = React.Children.only(children);

    const {
      label,
    } = template.props;

    return normalizeLabel(label);
  }

  focus(position) {
    if (this.instancesContainerNode) {
      // FIXME: This is a bit of a hack. It should use refs to track the move to top button nodes.

      const instance = this.instancesContainerNode.querySelector(`div[data-instancename="${position}"]`);
      const moveToTopButtonInstance = instance.querySelector('.cspace-input-MoveToTopButton--common');

      if (moveToTopButtonInstance) {
        moveToTopButtonInstance.focus();
      }
    }
  }

  handleAddButtonClick() {
    const {
      onAddInstance,
    } = this.props;

    if (onAddInstance) {
      onAddInstance(getPath(this.props));
    }
  }

  handleInstanceCommit(instancePath, value) {
    const {
      onCommit,
    } = this.props;

    if (onCommit) {
      onCommit(instancePath, value);
    }
  }

  handleInstancesContainerRef(ref) {
    this.instancesContainerNode = ref;
  }

  handleMoveToTopButtonClick(event) {
    const {
      onMoveInstance,
    } = this.props;

    if (onMoveInstance) {
      const instanceName = event.target.dataset.instancename;
      const newPosition = 0;

      onMoveInstance([...getPath(this.props), instanceName], newPosition);
    }
  }

  handleMoveToTopButtonKeyDown(event) {
    const {
      value,
      onAddInstance,
      onMoveInstance,
    } = this.props;

    if (event.shiftKey) {
      const {
        key,
        currentTarget,
      } = event;

      if (key === 'ArrowDown' || key === 'ArrowUp') {
        if (onMoveInstance) {
          const instanceName = currentTarget.dataset.instancename;
          const position = parseInt(instanceName, 10);
          const normalizedValue = normalizeValue(value);

          let newPosition;

          if (key === 'ArrowDown') {
            newPosition = position + 1;

            if (newPosition > normalizedValue.length - 1) {
              newPosition = 0;
            }
          } else {
            newPosition = position - 1;

            if (newPosition < 0) {
              newPosition = normalizedValue.length - 1;
            }
          }

          onMoveInstance([...getPath(this.props), instanceName], newPosition);

          this.focus(newPosition);
        }
      } else if (key === '+') {
        if (onAddInstance) {
          const instanceName = currentTarget.dataset.instancename;
          const position = parseInt(instanceName, 10);

          onAddInstance(getPath(this.props), position + 1);
        }
      }
    }
  }

  handleRemoveButtonClick(event) {
    const {
      onRemoveInstance,
    } = this.props;

    if (onRemoveInstance) {
      const instanceName = event.target.dataset.instancename;

      onRemoveInstance([...getPath(this.props), instanceName]);
    }
  }

  renderEmbeddedHeader(label) {
    const {
      readOnly,
    } = this.props;

    let removeButtonCol;

    if (!readOnly) {
      removeButtonCol = <div />;
    }

    return (
      <header>
        <div />
        <div>
          {label}
        </div>
        {removeButtonCol}
      </header>
    );
  }

  renderInstances() {
    const {
      asText,
      children,
      value,
      readOnly,
      reorderable,
      disableRemoveButton,
      renderOrderIndicator,
    } = this.props;

    const template = React.Children.only(children);
    const normalizedValue = normalizeValue(value);

    return normalizedValue.map((instanceValue, index, list) => {
      const instanceName = `${index}`;

      const overrideProps = {
        asText,
        readOnly,
        embedded: true,
        label: undefined,
        name: instanceName,
        parentPath: getPath(this.props),
        value: instanceValue,
        // The template is expected to accept an onCommit prop.
        onCommit: this.handleInstanceCommit,
      };

      const inputInstance = React.cloneElement(template, overrideProps);

      let orderIndicator = null;

      const hideOrderNumber = readOnly && normalizedValue.length === 1 && !normalizedValue[0];
      const orderNumber = hideOrderNumber ? null : index + 1;

      if (renderOrderIndicator) {
        orderIndicator = renderOrderIndicator(orderNumber);
      } else {
        const className = readOnly
          ? miniButtonContainerStyles.readOnly
          : miniButtonContainerStyles.normal;

        if (asText) {
          orderIndicator = <div>{orderNumber}</div>;
        } else {
          orderIndicator = (
            <div className={className}>
              <MiniButton
                className={moveToTopButtonStyles.common}
                data-instancename={instanceName}
                disabled={!reorderable}
                name="moveToTop"
                readOnly={readOnly}
                onClick={this.handleMoveToTopButtonClick}
                onKeyDown={this.handleMoveToTopButtonKeyDown}
              >
                {orderNumber}
              </MiniButton>
            </div>
          );
        }
      }

      let removeButton;

      if (!readOnly && !asText) {
        const className = miniButtonContainerStyles.normal;

        removeButton = (
          <div className={className}>
            <MiniButton
              data-instancename={instanceName}
              disabled={
                list.length < 2 ||
                (disableRemoveButton && disableRemoveButton(instanceValue))
              }
              name="remove"
              onClick={this.handleRemoveButtonClick}
            >
              −
            </MiniButton>
          </div>
        );
      }

      return (
        <div
          data-instancename={instanceName}
          key={index}
        >
          {orderIndicator}
          <div>
            {inputInstance}
          </div>
          {removeButton}
        </div>
      );
    });
  }

  render() {
    const {
      asText,
      name,
      readOnly,
    } = this.props;

    const label = this.getLabel();
    const isLabelEmbedded = get(label, ['props', 'embedded']);

    const instances = this.renderInstances();

    if (asText) {
      return (
        <div>{instances}</div>
      );
    }

    let footer;

    if (!readOnly) {
      const className = miniButtonContainerStyles.normal;

      footer = (
        <footer>
          <div className={className}>
            <MiniButton
              name="add"
              onClick={this.handleAddButtonClick}
            >
              +
            </MiniButton>
          </div>
        </footer>
      );
    }

    const className = readOnly ? styles.readOnly : styles.normal;

    return (
      <fieldset
        className={className}
        name={name}
      >
        {isLabelEmbedded ? null : renderHeader(label)}

        <div ref={this.handleInstancesContainerRef}>
          {isLabelEmbedded ? this.renderEmbeddedHeader(label) : null}
          {instances}
        </div>

        {footer}
      </fieldset>
    );
  }
}

RepeatingInput.propTypes = propTypes;
RepeatingInput.defaultProps = defaultProps;
