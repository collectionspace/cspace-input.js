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
    this.handleDropdownInputChange = this.handleDropdownInputChange.bind(this);
    this.handleDropdownInputClose = this.handleDropdownInputClose.bind(this);
    this.handleDropdownInputCommit = this.handleDropdownInputCommit.bind(this);
    this.handleDropdownInputKeyPress = this.handleDropdownInputKeyPress.bind(this);
    this.handleDropdownInputMount = this.handleDropdownInputMount.bind(this);
    this.handleDropdownInputOpen = this.handleDropdownInputOpen.bind(this);

    const value = normalizeISO8601DateString(props.value);

    this.state = {
      value,
      date: parseNormalizedDate(value),
      open: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const nextValue = normalizeISO8601DateString(nextProps.value);

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

    this.setState({
      value: nextValue,
      provisionalDate: undefined,
    });
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
      open: false,
    });

    this.commit(date);
  }

  // handleCalendarRef(ref) {
  //   this.calendar = ref;
  // }

  handleCalendarContainerRef(ref) {
    this.calendarContainerDomNode = ref;
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
    const {
      value,
    } = this.state;

    if (value === '') {
      // Normally enter must be pressed on the provisional value in order to select a matching
      // date, but make an exception for the blank value. This allows fields to be cleared
      // without ever pressing enter. This is required by DRYD-227.

      const {
        onCommit,
      } = this.props;

      if (onCommit) {
        onCommit(getPath(this.props), '');
      }
    }

    this.setState({
      open: false,
      provisionalDate: undefined,
      value: normalizeISO8601DateString(this.props.value),
    });

    this.focusInput();
  }

  handleDropdownInputCommit() {
    const {
      value,
    } = this.props;

    const {
      provisionalDate,
    } = this.state;

    if (typeof provisionalDate !== 'undefined') {
      this.setState({
        open: false,
      });

      this.commit(provisionalDate);
    } else if (typeof value === 'undefined') {
      // The calendar is open, but the user hasn't typed at all, so there's no provisional date.
      // If enter is pressed, just close the calendar.

      this.setState({
        open: false,
      });
    }
  }

  handleDropdownInputKeyPress(event) {
    if (event.key === 'Enter') {
      const {
        provisionalDate,
      } = this.state;

      if (provisionalDate) {
        event.preventDefault();
      }
    }
  }

  handleDropdownInputMount({ focusInput }) {
    this.focusInput = focusInput;
  }

  handleDropdownInputOpen() {
    this.setState({
      open: true,
    });
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
        commitUnchanged
        focusPopup={this.focusCalendar}
        open={open}
        onChange={this.handleDropdownInputChange}
        onClose={this.handleDropdownInputClose}
        onCommit={this.handleDropdownInputCommit}
        onKeyPress={this.handleDropdownInputKeyPress}
        onMount={this.handleDropdownInputMount}
        onOpen={this.handleDropdownInputOpen}
        value={value}
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
