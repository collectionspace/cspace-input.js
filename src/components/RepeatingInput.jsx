import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import get from 'lodash/get';
import MiniButton from './MiniButton';
import normalizeLabel from '../helpers/normalizeLabel';
import { getPath, pathPropType } from '../helpers/pathHelpers';
import repeatingInputStyles from '../../styles/cspace-input/RepeatingInput.css';
import moveToTopButtonStyles from '../../styles/cspace-input/MoveToTopButton.css';

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

const renderEmbeddedHeader = label => (
  <header>
    <div />
    <div>
      {label}
    </div>
    <div />
  </header>
);

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
  reorderable: PropTypes.bool,
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

  handleRemoveButtonClick(event) {
    const {
      onRemoveInstance,
    } = this.props;

    if (onRemoveInstance) {
      const instanceName = event.target.dataset.instancename;

      onRemoveInstance([...getPath(this.props), instanceName]);
    }
  }

  renderInstances() {
    const {
      children,
      value,
      reorderable,
    } = this.props;

    const template = React.Children.only(children);

    return normalizeValue(value).map((instanceValue, index, list) => {
      const instanceName = `${index}`;

      const overrideProps = {
        embedded: true,
        label: undefined,
        name: instanceName,
        parentPath: getPath(this.props),
        value: instanceValue,
        // The template is expected to accept an onCommit prop.
        onCommit: this.handleInstanceCommit,
      };

      const instance = React.cloneElement(template, overrideProps);
      const orderNumber = index + 1;

      const orderIndicator = (
        <MiniButton
          className={moveToTopButtonStyles.common}
          data-instancename={instanceName}
          disabled={index === 0 || !reorderable}
          name="moveToTop"
          onClick={this.handleMoveToTopButtonClick}
        >
          {orderNumber}
        </MiniButton>
      );

      return (
        <div key={index}>
          <div>
            {orderIndicator}
          </div>
          <div>
            {instance}
          </div>
          <div>
            <MiniButton
              data-instancename={instanceName}
              disabled={list.length < 2}
              name="remove"
              onClick={this.handleRemoveButtonClick}
            >
              −
            </MiniButton>
          </div>
        </div>
      );
    });
  }

  render() {
    const {
      name,
    } = this.props;

    const label = this.getLabel();
    const isLabelEmbedded = get(label, ['props', 'embedded']);

    const instances = this.renderInstances();

    return (
      <fieldset
        className={repeatingInputStyles.common}
        name={name}
      >
        {isLabelEmbedded ? null : renderHeader(label)}
        <div>
          {isLabelEmbedded ? renderEmbeddedHeader(label) : null}
          {instances}
        </div>
        <footer>
          <div>
            <MiniButton
              name="add"
              onClick={this.handleAddButtonClick}
            >
              +
            </MiniButton>
          </div>
        </footer>
      </fieldset>
    );
  }
}

RepeatingInput.propTypes = propTypes;
RepeatingInput.defaultProps = defaultProps;
