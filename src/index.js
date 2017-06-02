import AutocompleteInput from './components/AutocompleteInput';
import Button from './components/Button';
import CheckboxInput from './components/CheckboxInput';
import ComboBoxInput from './components/ComboBoxInput';
import CompoundInput from './components/CompoundInput';
import CustomCompoundInput from './components/CustomCompoundInput';
import DateInput from './components/DateInput';
import DropdownMenuInput from './components/DropdownMenuInput';
import FilteringDropdownMenuInput from './components/FilteringDropdownMenuInput';
import IDGeneratorInput from './components/IDGeneratorInput';
import InputTable from './components/InputTable';
import Label from './components/Label';
import LineInput from './components/LineInput';
import MiniButton from './components/MiniButton';
import MultilineInput from './components/MultilineInput';
import PasswordInput from './components/PasswordInput';
import PrefixFilteringDropdownMenuInput from './components/PrefixFilteringDropdownMenuInput';
import QuickSearchInput from './components/QuickSearchInput';
import RecordTypeInput from './components/RecordTypeInput';
import ReadOnlyInput from './components/ReadOnlyInput';
import RepeatingInput from './components/RepeatingInput';
import StructuredDateInput from './components/StructuredDateInput';
import TabularCompoundInput from './components/TabularCompoundInput';
import TextInput from './components/TextInput';
import TermPickerInput from './components/TermPickerInput';
import VocabularyInput from './components/VocabularyInput';

import changeable from './enhancers/changeable';
import committable from './enhancers/committable';
import labelable from './enhancers/labelable';
import nestable from './enhancers/nestable';
import repeatable from './enhancers/repeatable';
import standalone from './enhancers/standalone';
import withLabeledOptions from './enhancers/withLabeledOptions';
import withNormalizedOptions from './enhancers/withNormalizedOptions';

import * as pathHelpers from './helpers/pathHelpers';

export const baseComponents = {
  AutocompleteInput,
  Button,
  CheckboxInput,
  CompoundInput,
  CustomCompoundInput,
  DateInput,
  DropdownMenuInput,
  FilteringDropdownMenuInput,
  IDGeneratorInput,
  InputTable,
  Label,
  LineInput,
  MiniButton,
  MultilineInput,
  PasswordInput,
  PrefixFilteringDropdownMenuInput,
  QuickSearchInput,
  ReadOnlyInput,
  RecordTypeInput,
  RepeatingInput,
  StructuredDateInput,
  TabularCompoundInput,
  TextInput,
  TermPickerInput,
  VocabularyInput,
};

export const components = {
  Button,
  CompoundInput,
  Label,
  MiniButton,
  ReadOnlyInput,
  RepeatingInput,
  AutocompleteInput: repeatable(labelable(AutocompleteInput)),
  CheckboxInput: labelable(CheckboxInput),
  ComboBoxInput: repeatable(labelable(withLabeledOptions(ComboBoxInput))),
  CustomCompoundInput: repeatable(labelable(CustomCompoundInput)),
  DateInput: repeatable(labelable(DateInput)),
  DropdownMenuInput: repeatable(labelable(withNormalizedOptions(DropdownMenuInput))),
  IDGeneratorInput: repeatable(labelable(IDGeneratorInput)),
  InputTable: labelable(InputTable),
  LineInput: standalone(LineInput),
  MultilineInput: standalone(MultilineInput),
  OptionPickerInput: repeatable(
    labelable(withLabeledOptions(withNormalizedOptions(PrefixFilteringDropdownMenuInput)))
  ),
  PasswordInput: standalone(PasswordInput),
  QuickSearchInput: labelable(QuickSearchInput),
  RecordTypeInput: labelable(RecordTypeInput),
  StructuredDateInput: repeatable(labelable(StructuredDateInput)),
  TabularCompoundInput: labelable(TabularCompoundInput),
  TextInput: standalone(TextInput),
  VocabularyInput: labelable(VocabularyInput),
  TermPickerInput: repeatable(labelable(TermPickerInput)),
};

export const enhancers = {
  changeable,
  committable,
  labelable,
  nestable,
  repeatable,
  standalone,
  withLabeledOptions,
  withNormalizedOptions,
};

export const helpers = {
  pathHelpers,
};
