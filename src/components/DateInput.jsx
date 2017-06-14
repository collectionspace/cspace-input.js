import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Footer, HistoryView, MonthView, NavBar } from 'react-date-picker';
import BaseDropdownInput from './DropdownInput';
import ReadOnlyInput from './ReadOnlyInput';
import changeable from '../enhancers/changeable';
import committable from '../enhancers/committable';
import { normalizeDateString, normalizeISO8601DateString } from '../helpers/dateHelpers';
import { getPath } from '../helpers/pathHelpers';
import styles from '../../styles/cspace-input/DateInput.css';
/* eslint-disable import/imports-first, import/no-unresolved */
import '!style-loader!css-loader!react-date-picker/base.css';
import '!style-loader!css-loader!../../styles/react-date-picker/cspace.css';
/* eslint-enable import/imports-first, import/no-unresolved */

const DropdownInput = committable(changeable(BaseDropdownInput));

const propTypes = {
  ...BaseDropdownInput.propTypes,
  locale: PropTypes.string,
  onCommit: PropTypes.func,
  todayButtonLabel: PropTypes.string,
  clearButtonLabel: PropTypes.string,
  okButtonLabel: PropTypes.string,
  cancelButtonLabel: PropTypes.string,
  readOnly: PropTypes.bool,
};

const defaultProps = {
  locale: 'en',
  todayButtonLabel: 'Today',
  clearButtonLabel: 'Clear',
  okButtonLabel: 'OK',
  cancelButtonLabel: 'Cancel',
};

export default class DateInput extends Component {
  constructor(props) {
    super(props);

    this.focusCalendar = this.focusCalendar.bind(this);
    this.handleCalendarActiveDateChange = this.handleCalendarActiveDateChange.bind(this);
    this.handleCalendarChange = this.handleCalendarChange.bind(this);
    this.handleCalendarRef = this.handleCalendarRef.bind(this);
    this.handleCalendarViewDateChange = this.handleCalendarViewDateChange.bind(this);
    this.handleDropdownInputChange = this.handleDropdownInputChange.bind(this);
    this.handleDropdownInputClose = this.handleDropdownInputClose.bind(this);
    this.handleDropdownInputCommit = this.handleDropdownInputCommit.bind(this);
    this.handleDropdownInputKeyPress = this.handleDropdownInputKeyPress.bind(this);
    this.handleDropdownInputOpen = this.handleDropdownInputOpen.bind(this);
    this.renderHistoryView = this.renderHistoryView.bind(this);

    this.state = {
      date: normalizeISO8601DateString(props.value),
      open: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      date: normalizeISO8601DateString(nextProps.value),
    });
  }

  commit(value) {
    const {
      onCommit,
    } = this.props;

    let {
      value: initialValue,
    } = this.props;

    initialValue = normalizeISO8601DateString(initialValue);

    if (
      onCommit &&
      (value || initialValue) &&
      (value !== initialValue)
    ) {
      onCommit(getPath(this.props), value);
    }
  }

  focusCalendar() {
    if (this.calendar) {
      this.calendar.focus();
    }
  }

  handleCalendarActiveDateChange(dateString) {
    this.setState({
      activeDate: dateString || Date.now(),
      provisionalDate: dateString,
    });
  }

  handleCalendarChange(dateString) {
    this.setState({
      date: dateString,
      open: false,
      provisionalDate: undefined,
    });

    this.commit(dateString);
  }

  handleCalendarRef(ref) {
    this.calendar = ref;
  }

  handleCalendarViewDateChange(dateString) {
    this.setState({
      viewDate: dateString || Date.now(),
    });
  }

  handleDropdownInputChange(value) {
    const dateString = normalizeDateString(value, this.props.locale);

    const newState = {
      activeDate: dateString,
      provisionalDate: value,
      open: true,
    };

    if (dateString !== null) {
      newState.viewDate = dateString;
    }

    this.setState(newState);
  }

  handleDropdownInputClose() {
    this.setState({
      open: false,
      provisionalDate: undefined,
    });
  }

  handleDropdownInputCommit() {
    const { provisionalDate } = this.state;

    if (typeof provisionalDate !== 'undefined') {
      let dateString;

      if (provisionalDate === '') {
        dateString = '';
      } else {
        dateString = normalizeDateString(provisionalDate, this.props.locale);
      }

      if (dateString !== null) {
        this.setState({
          date: dateString,
          open: false,
          provisionalDate: undefined,
        });

        this.commit(dateString);
      }
    }
  }

  handleDropdownInputKeyPress(event) {
    if (event.key === 'Enter') {
      const { provisionalDate } = this.state;

      if (typeof provisionalDate !== 'undefined') {
        event.preventDefault();
      }
    }
  }

  handleDropdownInputOpen() {
    const {
      date,
      provisionalDate,
    } = this.state;

    const activeDate = provisionalDate || date || Date.now();

    this.setState({
      activeDate,
      viewDate: activeDate,
      open: true,
    });
  }

  renderHistoryView(historyViewProps) {
    const {
      okButtonLabel,
      cancelButtonLabel,
    } = this.props;

    return (
      <HistoryView {...historyViewProps}>
        <Footer
          todayButton={false}
          clearButton={false}
          okButtonText={okButtonLabel}
          cancelButtonText={cancelButtonLabel}
        />
      </HistoryView>
    );
  }

  render() {
    const {
      locale,
      todayButtonLabel,
      clearButtonLabel,
      readOnly,
      /* eslint-disable no-unused-vars */
      okButtonLabel,
      cancelButtonLabel,
      /* eslint-enable no-unused-vars */
      ...remainingProps
    } = this.props;

    const {
      open,
      date,
      activeDate,
      provisionalDate,
      viewDate,
    } = this.state;

    if (readOnly) {
      return (
        <ReadOnlyInput value={date} />
      );
    }

    const value = typeof provisionalDate === 'undefined' ? date : provisionalDate;
    const className = typeof provisionalDate === 'undefined' ? styles.normal : styles.provisional;

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
        onOpen={this.handleDropdownInputOpen}
        value={value}
      >
        <MonthView
          activeDate={activeDate}
          date={date}
          footer
          highlightToday={false}
          highlightWeekends={false}
          locale={locale}
          ref={this.handleCalendarRef}
          theme="cspace"
          viewDate={viewDate}
          weekNumbers={false}
          onChange={this.handleCalendarChange}
          onViewDateChange={this.handleCalendarViewDateChange}
          onActiveDateChange={this.handleCalendarActiveDateChange}
        >
          <NavBar
            renderHistoryView={this.renderHistoryView}
            secondary
          />
          <Footer
            todayButtonText={todayButtonLabel}
            clearButtonText={clearButtonLabel}
            theme="cspace"
          />
        </MonthView>
      </DropdownInput>
    );
  }
}

DateInput.propTypes = propTypes;
DateInput.defaultProps = defaultProps;
