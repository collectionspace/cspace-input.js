import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';
import BaseDropdownInput from './DropdownInput';
import LineInput from './LineInput';
import changeable from '../enhancers/changeable';
import committable from '../enhancers/committable';
import { getPath } from '../helpers/pathHelpers';
import styles from '../../styles/cspace-input/DateInput.css';
/* eslint-disable import/imports-first, import/no-unresolved */
import '!style-loader!css-loader!../../styles/react-calendar/calendar.css';
/* eslint-enable import/imports-first, import/no-unresolved */

import {
  formatDate,
  normalizeDateString,
  normalizeISO8601DateString,
  parseNormalizedDate,
} from '../helpers/dateHelpers';

const DropdownInput = committable(changeable(BaseDropdownInput));

const propTypes = {
  ...BaseDropdownInput.propTypes,
  locale: PropTypes.string,
  onCommit: PropTypes.func,
  readOnly: PropTypes.bool,
};

const defaultProps = {
  locale: 'en-US',
};

export default class DateInput extends Component {
  constructor(props) {
    super(props);

    this.focusCalendar = this.focusCalendar.bind(this);
    this.handleCalendarChange = this.handleCalendarChange.bind(this);
    this.handleCalendarContainerRef = this.handleCalendarContainerRef.bind(this);
    // this.handleCalendarRef = this.handleCalendarRef.bind(this);
    this.handleDropdownInputApi = this.handleDropdownInputApi.bind(this);
    this.handleDropdownInputBeforeClose = this.handleDropdownInputBeforeClose.bind(this);
    this.handleDropdownInputChange = this.handleDropdownInputChange.bind(this);
    this.handleDropdownInputClose = this.handleDropdownInputClose.bind(this);
    this.handleDropdownInputKeyDown = this.handleDropdownInputKeyDown.bind(this);
    this.handleDropdownInputMount = this.handleDropdownInputMount.bind(this);
    this.handleDropdownInputOpen = this.handleDropdownInputOpen.bind(this);

    const value = normalizeISO8601DateString(props.value) || props.value;

    this.state = {
      value,
      date: parseNormalizedDate(value),
      open: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const nextValue = normalizeISO8601DateString(nextProps.value) || nextProps.value;

    this.setState({
      value: nextValue,
      date: parseNormalizedDate(nextValue),
    });
  }

  commit(date) {
    const {
      onCommit,
    } = this.props;

    const {
      value: initialValue,
    } = this.props;

    const normalizedInitialValue = normalizeISO8601DateString(initialValue);
    const nextValue = formatDate(date);

    if (
      onCommit &&
      (nextValue || normalizedInitialValue) &&
      (nextValue !== normalizedInitialValue)
    ) {
      onCommit(getPath(this.props), nextValue);
    }
  }

  focusCalendar() {
    // TODO: react-calendar v6 no longer has the focus method. Maybe it will come back?

    // if (this.calendar) {
    //   this.calendar.focus();
    // }

    // For now do a bit of a DOM hack to focus.

    if (this.calendarContainerDomNode) {
      const button = this.calendarContainerDomNode.querySelector('button');

      if (button) {
        button.focus();
      }
    }
  }

  handleCalendarChange(date) {
    this.setState({
      value: formatDate(date),
      open: false,
    });

    this.commit(date);
    this.focusInput();
  }

  // handleCalendarRef(ref) {
  //   this.calendar = ref;
  // }

  handleCalendarContainerRef(ref) {
    this.calendarContainerDomNode = ref;
  }

  handleDropdownInputApi(api) {
    this.dropdownInputApi = api;
  }

  handleDropdownInputBeforeClose(isCancelled) {
    if (isCancelled) {
      this.setState({
        provisionalDate: undefined,
        value: normalizeISO8601DateString(this.props.value),
      });
    }
  }

  handleDropdownInputChange(value) {
    const date = parseNormalizedDate(normalizeDateString(value, this.props.locale));

    this.setState({
      value,
      provisionalDate: date,
      open: true,
    });
  }

  handleDropdownInputClose() {
    const nextState = {
      provisionalDate: undefined,
      open: false,
    };

    const {
      provisionalDate,
      value,
    } = this.state;

    if (typeof provisionalDate !== 'undefined' && value === '') {
      // Normally enter must be pressed on the provisional value in order to select a matching
      // date, but make an exception for the blank value. This allows fields to be cleared
      // without ever pressing enter. This is required by DRYD-227.

      nextState.value = '';

      const {
        onCommit,
      } = this.props;

      if (onCommit) {
        onCommit(getPath(this.props), '');
      }
    } else {
      nextState.value = normalizeISO8601DateString(this.props.value) || this.props.value;
    }

    this.setState(nextState);
  }

  handleDropdownInputKeyDown(event) {
    const {
      provisionalDate,
      value,
    } = this.state;

    if (event.key === 'Tab') {
      // DRYD-264: Close the dropdown when tab is depressed. The calendar is still keyboard
      // accessible by pressing down arrow. Need to close immediately (synchronously) -- otherwise
      // the calendar will receive focus before closing, leaving nothing focused. To do this, the
      // close() method of the dropdown needs to be called, rather than just passing open={false}
      // as a prop.

      this.dropdownInputApi.close();

      this.setState({
        open: false,
      });
    } else if (typeof provisionalDate !== 'undefined' && event.key === 'Enter') {
      event.preventDefault();

      if (provisionalDate !== null || value === '') {
        this.setState({
          open: false,
        });

        this.commit(provisionalDate);
      }
    }
  }

  handleDropdownInputMount({ focusInput }) {
    this.focusInput = focusInput;
  }

  handleDropdownInputOpen() {
    if (!this.state.open) {
      this.setState({
        open: true,
        provisionalDate: undefined,
      });
    }
  }

  render() {
    const {
      locale,
      readOnly,
      ...remainingProps
    } = this.props;

    const {
      open,
      date,
      provisionalDate,
      value,
    } = this.state;

    if (readOnly) {
      return (
        <LineInput readOnly value={value} embedded={this.props.embedded} />
      );
    }

    let calendarValue;

    if (value) {
      calendarValue = (typeof provisionalDate !== 'undefined') ? provisionalDate : date;
    }

    const className = (typeof provisionalDate !== 'undefined') ? styles.provisional : styles.normal;

    return (
      <DropdownInput
        {...remainingProps}
        className={className}
        focusPopup={this.focusCalendar}
        open={open}
        value={value}
        api={this.handleDropdownInputApi}
        onChange={this.handleDropdownInputChange}
        onBeforeClose={this.handleDropdownInputBeforeClose}
        onClose={this.handleDropdownInputClose}
        onKeyDown={this.handleDropdownInputKeyDown}
        onMount={this.handleDropdownInputMount}
        onOpen={this.handleDropdownInputOpen}
      >
        <div ref={this.handleCalendarContainerRef}>
          <Calendar
            locale={locale}
            // ref={this.handleCalendarRef}
            value={calendarValue}
            onChange={this.handleCalendarChange}
          />
        </div>
      </DropdownInput>
    );
  }
}

DateInput.propTypes = propTypes;
DateInput.defaultProps = defaultProps;
