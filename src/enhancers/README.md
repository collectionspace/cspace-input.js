# Enhancers

This directory contains enhancers for cspace-input components.

Enhancers are higher-order components (HOCs) used to amend base components with additional functionality. A higher-order component is a function that accepts a React component, and returns a React component that does a little more. HOCs allow for decomposition of components into small, reusable pieces that each only do one thing, and can be recomposed in various ways. They are a more flexible mechanism for extension than subclasses, and a more idiomatic mechanism than mixins.

Many of the patterns used here are implemented in the [recompose](https://github.com/acdlite/recompose) library, and these enhancers may be rewritten to use that library as it becomes more mature.

For more information, see:

- [Mixins Are Dead. Long Live Composition](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)
- [Andrew Clark - Recomposing your React application at react-europe 2016](https://www.youtube.com/watch?v=zD_judE-bXk)

## Usage

Call the enhancer, passing in a base component. Use the returned component as you would any other:

```
import uncontrolled from './uncontrolled';

const EnhancedInput = uncontrolled('input');

render(<EnhancedInput value="I'm enhanced" />, document.getElementById("container"));
```

Apply as many enhancers as you like:

```
import named from './named';
import repeatable from './repeatable';
import uncontrolled from './uncontrolled';

const EnhancedInput = repeatable(uncontrolled(named('input')));
```

Compose any number of enhancers into a single enhancer:

```
import compose from '../helpers';
import named from './named';
import repeatable from './repeatable';
import uncontrolled from './uncontrolled';

const enhanced = compose(repeatable, uncontrolled, named);
const EnhancedInput = enhanced('input');
```
