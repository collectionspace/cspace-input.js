import AuthorityControlledInput from './components/AuthorityControlledInput';
import Button from './components/Button';
import CompoundInput from './components/CompoundInput';
import CustomCompoundInput from './components/CustomCompoundInput';
import DateInput from './components/DateInput';
import DropdownMenuInput from './components/DropdownMenuInput';
import FilteringDropdownMenuInput from './components/FilteringDropdownMenuInput';
import IDGeneratorInput from './components/IDGeneratorInput';
import Label from './components/Label';
import LineInput from './components/LineInput';
import MultilineInput from './components/MultilineInput';
import OptionListControlledInput from './components/OptionListControlledInput';
import PasswordInput from './components/PasswordInput';
import PrefixFilteringDropdownMenuInput from './components/PrefixFilteringDropdownMenuInput';
import ReadOnlyInput from './components/ReadOnlyInput';
import RepeatingInput from './components/RepeatingInput';
import StructuredDateInput from './components/StructuredDateInput';
import TabularCompoundInput from './components/TabularCompoundInput';
import TextInput from './components/TextInput';
import VocabularyControlledInput from './components/VocabularyControlledInput';

import changeable from './enhancers/changeable';
import committable from './enhancers/committable';
import labelable from './enhancers/labelable';
import nestable from './enhancers/nestable';
import repeatable from './enhancers/repeatable';
import standalone from './enhancers/standalone';
import withNormalizedOptions from './enhancers/withNormalizedOptions';

import * as pathHelpers from './helpers/pathHelpers';

export const baseComponents = {
  AuthorityControlledInput,
  Button,
  CompoundInput,
  CustomCompoundInput,
  DateInput,
  DropdownMenuInput,
  FilteringDropdownMenuInput,
  IDGeneratorInput,
  Label,
  LineInput,
  MultilineInput,
  OptionListControlledInput,
  PasswordInput,
  PrefixFilteringDropdownMenuInput,
  ReadOnlyInput,
  RepeatingInput,
  StructuredDateInput,
  TabularCompoundInput,
  TextInput,
  VocabularyControlledInput,
};

export const components = {
  Button,
  CompoundInput,
  Label,
  ReadOnlyInput,
  RepeatingInput,
  AuthorityControlledInput: repeatable(labelable(AuthorityControlledInput)),
  CustomCompoundInput: repeatable(labelable(CustomCompoundInput)),
  DateInput: repeatable(labelable(DateInput)),
  DropdownMenuInput: repeatable(labelable(withNormalizedOptions(DropdownMenuInput))),
  IDGeneratorInput: repeatable(labelable(IDGeneratorInput)),
  LineInput: standalone(LineInput),
  MultilineInput: standalone(MultilineInput),
  OptionListControlledInput: repeatable(labelable(OptionListControlledInput)),
  PasswordInput: standalone(PasswordInput),
  StructuredDateInput: repeatable(labelable(StructuredDateInput)),
  TabularCompoundInput: labelable(TabularCompoundInput),
  TextInput: standalone(TextInput),
  VocabularyControlledInput: repeatable(labelable(VocabularyControlledInput)),
};

export const enhancers = {
  changeable,
  committable,
  labelable,
  nestable,
  repeatable,
  standalone,
  withNormalizedOptions,
};

export const helpers = {
  pathHelpers,
};
