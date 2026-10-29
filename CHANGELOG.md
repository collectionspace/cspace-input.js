# Change Log

## 2.3.2

* Render CustomCompoundInput, InputTable, and RepeatingInput as a div instead of a fieldset when they have no legend, resolving fieldset missing legend accessibility errors
* Render a CustomToolbar in RichTextInput so that buttons have aria-labels
* Override the SnowTheme in RichTextInput to suppress the quill tooltip, fixing empty link accessibility warnings

## 2.3.1

* Fix CheckboxInput not responding to clicks, caused by the invisible input not covering the visible checkbox after the wrapper was changed from a label to a span

## 2.3.0

* Add formatNarrowResultsMessage prop to AutocompleteInput, shown in place of the match count when a partial term search returns a truncated result list

## 2.2.0

* Resolve orphaned/missing form labels by forwarding id and aria attributes to rendered inputs, and adding label props to QuickSearchInput, RepeatingInput, TabularCompoundInput, and UploadInput

## 2.1.2

* Add htmlFor/id attribute to labels associating them to inputs
* Changed button color palette

## 2.1.1

* Increase contrast in disabled mini button text

## 2.1.0

* Add tooltip to DateInput component

## 2.0.0

Version 2.0.0 requires React 16.
