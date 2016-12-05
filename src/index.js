import AuthorityControlledInput from './components/AuthorityControlledInput';
import Button from './components/Button';
import CompoundInput from './components/CompoundInput';
import CustomCompoundInput from './components/CustomCompoundInput';
import DropdownMenuInput from './components/DropdownMenuInput';
import FilteringDropdownMenuInput from './components/FilteringDropdownMenuInput';
import Label from './components/Label';
import LineInput from './components/LineInput';
import MultilineInput from './components/MultilineInput';
import OptionListControlledInput from './components/OptionListControlledInput';
import PasswordInput from './components/PasswordInput';
import PrefixFilteringDropdownMenuInput from './components/PrefixFilteringDropdownMenuInput';
import ReadOnlyInput from './components/ReadOnlyInput';
import RepeatingInput from './components/RepeatingInput';
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
  DropdownMenuInput,
  FilteringDropdownMenuInput,
  Label,
  LineInput,
  MultilineInput,
  OptionListControlledInput,
  PasswordInput,
  PrefixFilteringDropdownMenuInput,
  ReadOnlyInput,
  RepeatingInput,
  TabularCompoundInput,
  TextInput,
  VocabularyControlledInput,
  // Stubs
  IDGeneratorInput: LineInput,
  DateInput: LineInput,
  StructuredDateInput: LineInput,
};

export const components = {
  Button,
  CompoundInput,
  Label,
  ReadOnlyInput,
  RepeatingInput,
  AuthorityControlledInput: repeatable(labelable(AuthorityControlledInput)),
  CustomCompoundInput: repeatable(labelable(CustomCompoundInput)),
  DropdownMenuInput: repeatable(labelable(withNormalizedOptions(DropdownMenuInput))),
  LineInput: standalone(LineInput),
  MultilineInput: standalone(MultilineInput),
  OptionListControlledInput: repeatable(labelable(OptionListControlledInput)),
  PasswordInput: standalone(PasswordInput),
  TabularCompoundInput: labelable(TabularCompoundInput),
  TextInput: standalone(TextInput),
  VocabularyControlledInput: repeatable(labelable(VocabularyControlledInput)),
  // Stubs
  IDGeneratorInput: standalone(LineInput),
  DateInput: standalone(LineInput),
  StructuredDateInput: standalone(LineInput),
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
