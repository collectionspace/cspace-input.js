import Button from './components/Button';
import CompoundInput from './components/CompoundInput';
import CustomCompoundInput from './components/CustomCompoundInput';
import DropdownMenuInput from './components/DropdownMenuInput';
import FilteringDropdownMenuInput from './components/FilteringDropdownMenuInput';
import Label from './components/Label';
import LineInput from './components/LineInput';
import MultilineInput from './components/MultilineInput';
import PasswordInput from './components/PasswordInput';
import PrefixFilteringDropdownMenuInput from './components/PrefixFilteringDropdownMenuInput';
import ReadOnlyInput from './components/ReadOnlyInput';
import RepeatingInput from './components/RepeatingInput';
import TabularCompoundInput from './components/TabularCompoundInput';
import TextInput from './components/TextInput';

import changeable from './enhancers/changeable';
import committable from './enhancers/committable';
import labelable from './enhancers/labelable';
import nestable from './enhancers/nestable';
import repeatable from './enhancers/repeatable';
import standalone from './enhancers/standalone';
import withNormalizedOptions from './enhancers/withNormalizedOptions';

import * as pathHelpers from './helpers/pathHelpers';

export const baseComponents = {
  Button,
  CompoundInput,
  CustomCompoundInput,
  DropdownMenuInput,
  FilteringDropdownMenuInput,
  Label,
  LineInput,
  MultilineInput,
  PasswordInput,
  PrefixFilteringDropdownMenuInput,
  ReadOnlyInput,
  RepeatingInput,
  TabularCompoundInput,
  TextInput,
  // Stubs
  AuthorityControlledInput: LineInput,
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
  CustomCompoundInput: repeatable(labelable(CustomCompoundInput)),
  DropdownMenuInput: repeatable(labelable(withNormalizedOptions(DropdownMenuInput))),
  LineInput: standalone(LineInput),
  MultilineInput: standalone(MultilineInput),
  PasswordInput: standalone(PasswordInput),
  TabularCompoundInput: labelable(TabularCompoundInput),
  TextInput: standalone(TextInput),
  // Stubs
  AuthorityControlledInput: standalone(LineInput),
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
